"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisconnectOnLoad from "../app/components/DisconnectOnLoad";

// ── Очищення ДО ініціалізації wagmi (рівень модуля) ──────────────────────────
// Запускається при кожному ПОВНОМУ завантаженні сторінки (не при bfcache-відновленні).
// При bfcache-відновленні відключення відбувається в DisconnectOnLoad.tsx (onShow/pageshow).
if (typeof window !== "undefined") {
  const HIDE_KEY = "wallet_hide_time";
  const raw = localStorage.getItem(HIDE_KEY);

  if (raw && Date.now() - Number(raw) >= 60_000) {
    // Очищаємо ВСІ wagmi-ключі — wagmi v2 перевіряє `wagmi.injected.connected`
    // для shimDisconnect, тому прибираємо все щоб prevent auto-reconnect
    const toDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (
        k.startsWith("wagmi") ||
        k.startsWith("wc@") ||
        k.startsWith("WCM_") ||
        k.startsWith("walletconnect") ||
        k.startsWith("WALLETCONNECT") ||
        k.startsWith("rk-")
      ) {
        toDelete.push(k);
      }
    }
    toDelete.forEach((k) => localStorage.removeItem(k));
    // НЕ видаляємо HIDE_KEY тут — DisconnectOnLoad перевірить його ще раз
    // і викличе disconnect() для оновлення React-стану
  }
}

// ── wagmi/RainbowKit config ───────────────────────────────────────────────────
// Залишаємо дефолтний localStorage — wagmi v2 потребує storage для shimDisconnect
const config = getDefaultConfig({
  appName: "Nexus AI Capital",
  projectId: "be3e828a71c51f172afad1ffa0a8e19b",
  chains: [mainnet, base],
  ssr: true,
  // НЕ передаємо storage: undefined — це ламає shimDisconnect механізм
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DisconnectOnLoad />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
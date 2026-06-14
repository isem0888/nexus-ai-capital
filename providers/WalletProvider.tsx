"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisconnectOnLoad from "../app/components/DisconnectOnLoad";

// ── Допоміжна функція очищення wagmi-ключів ──────────────────────────────────
function clearWagmiStorage() {
  if (typeof window === "undefined") return;
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
}

// ── Очищення ДО ініціалізації wagmi (рівень модуля) ──────────────────────────
if (typeof window !== "undefined") {
  const HIDE_KEY = "wallet_hide_time";

  // ── Перевірка 1: якщо минула 1 хвилина після закриття ───────────────────
  const raw = localStorage.getItem(HIDE_KEY);
  if (raw && Date.now() - Number(raw) >= 60_000) {
    clearWagmiStorage();
    // НЕ видаляємо HIDE_KEY — DisconnectOnLoad викличе disconnect() для React-стану
  }

  // ── Перевірка 2: збережена адреса ≠ активній в MetaMask → скидаємо ──────
  // Це виправляє авто-підключення до "старого" гаманця якщо в MetaMask
  // зараз вибраний інший акаунт.
  try {
    const storedRaw = localStorage.getItem("wagmi.store");
    if (storedRaw) {
      const stored = JSON.parse(storedRaw);
      const connections = stored?.state?.connections;
      const currentConnId = connections?.current;
      const storedAddr: string | undefined =
        currentConnId
          ? connections?.value?.[currentConnId]?.accounts?.[0]
          : undefined;

      // window.ethereum.selectedAddress — поточний активний акаунт MetaMask
      const activeAddr: string | undefined =
        (window as any).ethereum?.selectedAddress ?? undefined;

      if (
        storedAddr &&
        activeAddr &&
        storedAddr.toLowerCase() !== activeAddr.toLowerCase()
      ) {
        // Акаунти не збігаються → повністю очищуємо saved session
        clearWagmiStorage();
      }
    }
  } catch {}
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
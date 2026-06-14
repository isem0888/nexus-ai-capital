"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisconnectOnLoad from "../app/components/DisconnectOnLoad";

// ── Залишає тільки 1 підключення у wagmi.store ───────────────────────────────
function limitToOneConnection() {
  try {
    const raw = localStorage.getItem("wagmi.store");
    if (!raw) return;
    const store = JSON.parse(raw);
    const connections = store?.state?.connections;
    if (!connections?.value) return;
    const keys = Object.keys(connections.value);
    if (keys.length <= 1) return;
    const keepKey = connections.current || keys[0];
    store.state.connections = {
      current: keepKey,
      value: { [keepKey]: connections.value[keepKey] },
    };
    localStorage.setItem("wagmi.store", JSON.stringify(store));
  } catch {}
}

// ── Очищення wagmi ключів ─────────────────────────────────────────────────────
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

// ── Завжди очищаємо при завантаженні сторінки ────────────────────────────────
// Гаманець ніколи не зберігається між сесіями — підключати заново щоразу
if (typeof window !== "undefined") {
  clearWagmiStorage();
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
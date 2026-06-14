"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DisconnectOnLoad from "../app/components/DisconnectOnLoad";

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

if (typeof window !== "undefined") {
  clearWagmiStorage();
}

const config = getDefaultConfig({
  appName: "Nexus AI Capital",
  projectId: "be3e828a71c51f172afad1ffa0a8e19b",
  chains: [mainnet, base],
  ssr: true,
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <DisconnectOnLoad />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
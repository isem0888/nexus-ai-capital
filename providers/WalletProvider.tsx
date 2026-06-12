"use client";

import DisconnectOnLoad from "../app/components/DisconnectOnLoad";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";

import {
  WagmiProvider,
} from "wagmi";

import {
  mainnet,
  base,
} from "wagmi/chains";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: "Nexus AI Capital",
  projectId: "be3e828a71c51f172afad1ffa0a8e19b",
  chains: [mainnet, base],
  ssr: true,

  storage: undefined,
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    if (typeof window !== "undefined") {
  localStorage.removeItem("wagmi.store");
}
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
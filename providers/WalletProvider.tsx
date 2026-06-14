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

const HIDE_KEY = "wallet_hide_time";
const SESSION_KEY = "wallet_session";
const TIMEOUT_MS = 60_000; // 1 хвилина

// ── Логіка ДО ініціалізації wagmi (рівень модуля) ────────────────────────────
if (typeof window !== "undefined") {
  // sessionStorage зберігається при рефреші, але очищується при закритті вкладки
  const isRefresh = sessionStorage.getItem(SESSION_KEY) !== null;

  if (isRefresh) {
    // Рефреш → завжди відключаємо (фіксує проблему 3 гаманців)
    clearWagmiStorage();
    localStorage.removeItem(HIDE_KEY);
  } else {
    // Нова сесія: перший візит або повернення після закриття вкладки
    const raw = localStorage.getItem(HIDE_KEY);
    if (raw && Date.now() - Number(raw) < TIMEOUT_MS) {
      // Повернулись менше ніж за 5 хвилин → дозволяємо переконектитись, але тільки 1
      localStorage.removeItem(HIDE_KEY);
      limitToOneConnection();
    } else {
      // Перший візит або > 5 хвилин → відключаємо
      clearWagmiStorage();
      if (raw) localStorage.removeItem(HIDE_KEY);
    }
  }

  // Позначаємо сесію (persists через рефреш, але НЕ через закриття вкладки)
  sessionStorage.setItem(SESSION_KEY, "1");
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
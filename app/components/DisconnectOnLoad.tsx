"use client";

import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const HIDE_KEY = "wallet_hide_time";
const TIMEOUT_MS = 5 * 60 * 1000; // 5 хвилин

function clearWagmiStorage() {
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
  localStorage.removeItem(HIDE_KEY);
}

export default function DisconnectOnLoad() {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Логіка початкового завантаження перенесена у WalletProvider (module level)
    // Тут лише обробляємо visibility events (перемикання вкладок, мобільний фон)

    function onHide() {
      localStorage.setItem(HIDE_KEY, String(Date.now()));
    }

    function onShow() {
      const raw = localStorage.getItem(HIDE_KEY);
      if (raw && Date.now() - Number(raw) >= TIMEOUT_MS) {
        // Пройшло >= 5 хвилин → відключаємо
        disconnect();
        clearWagmiStorage();
      } else {
        // Повернулись раніше 5 хвилин → прибираємо мітку
        localStorage.removeItem(HIDE_KEY);
      }
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        onHide();
      } else {
        onShow();
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);
    window.addEventListener("pageshow", onShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
      window.removeEventListener("pageshow", onShow);
    };
  }, [disconnect]);

  return null;
}
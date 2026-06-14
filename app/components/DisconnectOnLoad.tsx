"use client";

import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const HIDE_KEY = "wallet_hide_time";
const TIMEOUT_MS = 60_000; // 1 хвилина

/** Видаляємо ВСІ ключі пов'язані з гаманцем */
function clearWalletStorage() {
  const keysToDelete: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (
      key.startsWith("wagmi") ||
      key.startsWith("wc@") ||
      key.startsWith("WCM_") ||
      key.startsWith("walletconnect") ||
      key.startsWith("rk-") ||
      key.startsWith("WALLETCONNECT") ||
      key === "-walletlink:https://www.walletlink.org:Addresses" ||
      key === "-walletlink:https://www.walletlink.org:session:id"
    ) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((k) => localStorage.removeItem(k));
}

export default function DisconnectOnLoad() {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // ── При завантаженні: перевіряємо таймаут ─────────────────────────
    const raw = localStorage.getItem(HIDE_KEY);
    if (raw) {
      const elapsed = Date.now() - Number(raw);
      localStorage.removeItem(HIDE_KEY);

      if (elapsed >= TIMEOUT_MS) {
        // Більше 1 хвилини — відключаємо і чистимо все
        disconnect();
        clearWalletStorage();
      }
      // Менше 1 хвилини — залишаємось підключеними, нічого не робимо
    }

    // ── При приховуванні/закритті сторінки ────────────────────────────
    function onHide() {
      // Зберігаємо час тільки якщо ще не збережено
      if (!localStorage.getItem(HIDE_KEY)) {
        localStorage.setItem(HIDE_KEY, String(Date.now()));
      }
    }

    function onShow() {
      localStorage.removeItem(HIDE_KEY);
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        onHide();
      } else {
        onShow();
      }
    }

    // visibilitychange — спрацьовує і на мобільних
    document.addEventListener("visibilitychange", onVisibility);
    // pagehide — для Safari/iOS (beforeunload не надійний на мобільних)
    window.addEventListener("pagehide", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [disconnect]);

  return null;
}
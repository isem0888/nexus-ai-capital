"use client";

import { useEffect, useRef } from "react";
import { useDisconnect } from "wagmi";

const HIDE_KEY = "wallet_hide_time";
const TIMEOUT_MS = 60_000; // 1 хвилина

export default function DisconnectOnLoad() {
  const { disconnect } = useDisconnect();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // ── При приховуванні: запускаємо таймер на 1 хвилину ──────────────
    function onHide() {
      // Зберігаємо timestamp для випадку закриття вкладки
      localStorage.setItem(HIDE_KEY, String(Date.now()));

      // Якщо вкладка залишається відкритою але прихованою — таймер сам відключить
      timerRef.current = setTimeout(() => {
        disconnect();
        // Чистимо storage щоб wagmi не відновив підключення
        const toDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (!k) continue;
          if (
            k.startsWith("wagmi") ||
            k.startsWith("wc@") ||
            k.startsWith("WCM_") ||
            k.startsWith("walletconnect") ||
            k.startsWith("rk-") ||
            k.startsWith("WALLETCONNECT")
          ) {
            toDelete.push(k);
          }
        }
        toDelete.forEach((k) => localStorage.removeItem(k));
        localStorage.removeItem(HIDE_KEY);
      }, TIMEOUT_MS);
    }

    // ── При поверненні: скасовуємо таймер ─────────────────────────────
    function onShow() {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      localStorage.removeItem(HIDE_KEY);
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") {
        onHide();
      } else {
        onShow();
      }
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide); // Safari/iOS

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [disconnect]);

  return null;
}
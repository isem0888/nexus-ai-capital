"use client";

import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const HIDE_KEY = "wallet_hide_time";
const TIMEOUT_MS = 60_000; // 1 хвилина

export default function DisconnectOnLoad() {
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // ── При завантаженні: перевіряємо чи пройшла 1 хв ─────────────────
    const raw = localStorage.getItem(HIDE_KEY);
    if (raw) {
      const elapsed = Date.now() - Number(raw);
      if (elapsed >= TIMEOUT_MS) {
        disconnect();
      }
      localStorage.removeItem(HIDE_KEY);
    }

    // ── При приховуванні сторінки: зберігаємо час ──────────────────────
    function onHide() {
      localStorage.setItem(HIDE_KEY, String(Date.now()));
    }

    // ── При поверненні на сторінку: скасовуємо таймер ─────────────────
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

    // visibilitychange — працює і на мобільних
    document.addEventListener("visibilitychange", onVisibility);
    // pagehide — для Safari/iOS
    window.addEventListener("pagehide", onHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [disconnect]);

  return null;
}
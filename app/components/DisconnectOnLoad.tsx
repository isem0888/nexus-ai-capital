"use client";

import { useEffect } from "react";
import { useDisconnect } from "wagmi";

const HIDE_KEY = "wallet_hide_time";
const TIMEOUT_MS = 60_000;

function forceDisconnectStorage() {
  // Clear ALL wagmi keys (wagmi v2 checks wagmi.injected.connected for shimDisconnect)
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
    // ─── Перевірка при монтуванні (повне перезавантаження) ───────────────
    // Модульний код WalletProvider вже очистив wagmi.store,
    // але disconnect() ще не викликали — робимо це тут
    {
      const raw = localStorage.getItem(HIDE_KEY);
      if (raw && Date.now() - Number(raw) >= TIMEOUT_MS) {
        disconnect();
        forceDisconnectStorage();
      }
    }

    // ─── Функції обробників подій ────────────────────────────────────────
    function onHide() {
      // Зберігаємо час коли сторінка стала прихованою
      // НЕ використовуємо setTimeout — він не спрацьовує в bfcache!
      localStorage.setItem(HIDE_KEY, String(Date.now()));
    }

    function onShow() {
      const raw = localStorage.getItem(HIDE_KEY);
      if (raw && Date.now() - Number(raw) >= TIMEOUT_MS) {
        // Пройшло >= 1 хвилини поки сторінка була прихована/закрита
        disconnect();
        forceDisconnectStorage();
      } else {
        // Повернулись раніше 1 хвилини — просто прибираємо мітку
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

    // pageshow спрацьовує при відновленні з bfcache (e.persisted === true)
    // visibilitychange ловить переключення вкладок і сховання сторінки
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
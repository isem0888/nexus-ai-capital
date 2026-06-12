"use client";

import { useEffect } from "react";
import { useAccount, useDisconnect, useReconnect, useConfig } from "wagmi";

const TIMEOUT = 30_000; // 30 секунд
const KEY = "lastActive";

export default function DisconnectOnLoad() {
  const { reconnect } = useReconnect();
  const { disconnect } = useDisconnect();
  const config = useConfig();

  // 1) При загрузке: решаем — реконнект или дисконнект
  useEffect(() => {
    const last = Number(localStorage.getItem(KEY) || 0);
    const elapsed = Date.now() - last;
    console.log("[wallet] last:", last, "elapsed:", elapsed);

    if (last && elapsed <= TIMEOUT) {
      const t = setTimeout(() => {
        console.log("[wallet] reconnecting...");
        reconnect({ connectors: config.connectors });
      }, 300);
      return () => clearTimeout(t);
    } else {
      console.log("[wallet] timeout → disconnect");
      localStorage.removeItem(KEY);
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Пока вкладка открыта — постоянно обновляем метку (БЕЗ привязки к isConnected)
  useEffect(() => {
    const beat = () => localStorage.setItem(KEY, Date.now().toString());
    beat();

    const id = setInterval(beat, 3_000);
    window.addEventListener("pagehide", beat);
    window.addEventListener("beforeunload", beat);
    document.addEventListener("visibilitychange", beat);

    return () => {
      clearInterval(id);
      window.removeEventListener("pagehide", beat);
      window.removeEventListener("beforeunload", beat);
      document.removeEventListener("visibilitychange", beat);
    };
  }, []);

  return null;
}
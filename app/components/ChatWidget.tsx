"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  from: "user" | "support";
  time: string;
}

const AUTO_REPLIES = [
  "Дякуємо за ваше повідомлення! Наш менеджер зв'яжеться з вами найближчим часом.",
  "Ми отримали ваш запит. Очікуйте відповіді протягом кількох хвилин.",
  "Дякуємо! Наша команда вже розглядає ваше питання.",
];

function getNow() {
  return new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Привіт! Чим можемо допомогти? 👋",
      from: "support",
      time: getNow(),
    },
  ]);
  const [unread, setUnread] = useState(1);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const now = getNow();
    const userMsg: Message = {
      id: Date.now(),
      text,
      from: "user",
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Send to Telegram (fire and forget — не блокуємо UI)
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, timestamp: now }),
    }).catch(() => {/* silently ignore */});

    // Auto-reply
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply: Message = {
        id: Date.now() + 1,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        from: "support",
        time: getNow(),
      };
      setMessages((prev) => [...prev, reply]);
      if (!open) setUnread((n) => n + 1);
    }, 1800);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-50 flex flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
          style={{
            width: "min(calc(100vw - 2rem), 360px)",
            height: "min(480px, calc(100vh - 140px))",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-700 to-violet-700 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-black text-white text-sm">N</div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-blue-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">Підтримка Nexus</div>
              <div className="text-xs text-blue-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Онлайн · середнє час відповіді &lt;2 хв
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition p-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-800 text-slate-100 rounded-bl-sm"
                }`}>
                  <p className="text-sm leading-snug">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "user" ? "text-blue-200" : "text-slate-500"} text-right`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-700 bg-slate-950/60 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Введіть ваше повідомлення..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 text-sm outline-none border border-slate-700 focus:border-blue-500 transition min-w-0"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-900/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Відкрити чат"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
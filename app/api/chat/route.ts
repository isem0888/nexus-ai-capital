"use client";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
}

function getSessionId(): string {
  try {
    const key = "nx_chat_session";
    let id = localStorage.getItem(key);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId] = useState<string>(() => {
    if (typeof window !== "undefined") return getSessionId();
    return "";
  });
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCountRef = useRef(0);

  // Polling for admin replies every 3 seconds
  useEffect(() => {
    if (!sessionId) return;

    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?session_id=${sessionId}`);
        if (res.ok) {
          const data: ChatMessage[] = await res.json();
          setMessages(data);

          // Show unread dot if widget is closed and admin replied
          if (!isOpen && data.length > lastCountRef.current) {
            const newMsgs = data.slice(lastCountRef.current);
            if (newMsgs.some((m) => m.sender === "admin")) {
              setHasUnread(true);
            }
          }
          lastCountRef.current = data.length;
        }
      } catch {}
    }

    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [sessionId, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isSending) return;
    const text = input.trim();
    setInput("");
    setIsSending(true);

    // Optimistic update
    const tempMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      session_id: sessionId,
      sender: "user",
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          page_url: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
    } catch {}

    setIsSending(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60"
          style={{ height: "420px", background: "#0f172a" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/60"
            style={{ background: "linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)" }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">N</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-blue-800" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm">Nexus Support</div>
              <div className="text-blue-200 text-xs">Online · avg. reply &lt;2 min</div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">N</div>
                <div className="flex flex-col gap-1 max-w-[80%]">
                  <div className="rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-white bg-slate-700/80">
                    Hi! 👋 How can we help you today?
                  </div>
                  <span className="text-[10px] text-slate-500 ml-1">Just now</span>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {msg.sender === "admin" && (
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">N</div>
                )}
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === "user"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm text-white bg-slate-700/80"
                  }`}
                    style={msg.sender === "user"
                      ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" }
                      : undefined
                    }
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-slate-500 mx-1">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700/60 px-3 py-2 flex gap-2 items-end bg-slate-900">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              style={{ maxHeight: "80px" }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isSending}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition flex-shrink-0 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => { setIsOpen((v) => !v); setHasUnread(false); }}
        className="fixed bottom-6 right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
      >
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-slate-900" />
        )}
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}
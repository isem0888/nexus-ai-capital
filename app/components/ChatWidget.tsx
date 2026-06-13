"use client";
import { useState, useEffect, useRef } from "react";

interface ChatMessage {
  id: string;
  session_id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
}

function newSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Parse "📎 filename|||url" file messages */
function parseFileMessage(text: string): { isFile: true; name: string; url: string | null } | null {
  if (!text.startsWith("📎 ")) return null;
  const body = text.slice(3); // remove "📎 "
  const sep = body.indexOf("|||");
  if (sep === -1) return { isFile: true, name: body, url: null };
  return { isFile: true, name: body.slice(0, sep), url: body.slice(sep + 3) };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sessionId] = useState<string>(newSessionId);
  const [hasUnread, setHasUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastCountRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Polling for admin replies every 3 seconds
  useEffect(() => {
    if (!sessionId) return;

    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat?session_id=${sessionId}`);
        if (res.ok) {
          const data: ChatMessage[] = await res.json();
          setMessages(data);
          if (!isOpen && data.length > lastCountRef.current) {
            const newMsgs = data.slice(lastCountRef.current);
            if (newMsgs.some((m) => m.sender === "admin")) setHasUnread(true);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be re-selected
    e.target.value = "";

    setIsUploading(true);

    // Optimistic message
    const tempMsg: ChatMessage = {
      id: `temp_file_${Date.now()}`,
      session_id: sessionId,
      sender: "user",
      message: `📎 ${file.name}`,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);
      formData.append("page_url", typeof window !== "undefined" ? window.location.pathname : "");

      await fetch("/api/chat-upload", { method: "POST", body: formData });
    } catch {}

    setIsUploading(false);
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

  /** Render a single message bubble content */
  function MessageContent({ text }: { text: string }) {
    const file = parseFileMessage(text);
    if (file) {
      return file.url ? (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 underline underline-offset-2 break-all"
        >
          <PaperclipIcon className="w-4 h-4 flex-shrink-0" />
          <span>{file.name}</span>
        </a>
      ) : (
        <span className="flex items-center gap-2">
          <PaperclipIcon className="w-4 h-4 flex-shrink-0" />
          <span>{file.name}</span>
        </span>
      );
    }
    return <span>{text}</span>;
  }

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700/60"
          style={{ height: "420px", background: "#0f172a" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b border-slate-700/60"
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
                  <div
                    className={`rounded-2xl px-3 py-2 text-sm ${
                      msg.sender === "user"
                        ? "rounded-tr-sm text-white"
                        : "rounded-tl-sm text-white bg-slate-700/80"
                    }`}
                    style={msg.sender === "user"
                      ? { background: "linear-gradient(135deg, #2563eb, #7c3aed)" }
                      : undefined
                    }
                  >
                    <MessageContent text={msg.message} />
                  </div>
                  <span className="text-[10px] text-slate-500 mx-1">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <div className="border-t border-slate-700/60 px-3 py-2 flex gap-2 items-end bg-slate-900">
            {/* Paperclip button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Attach file"
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-700 transition disabled:opacity-40"
            >
              {isUploading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <PaperclipIcon className="w-5 h-5" />
              )}
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              style={{ maxHeight: "80px" }}
            />

            {/* Send button */}
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

/** Inline SVG paperclip icon */
function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
      />
    </svg>
  );
}
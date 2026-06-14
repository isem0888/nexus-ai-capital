"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function VerifyOTPPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Якщо не залогінений через Google — на login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Автоматично відправляємо OTP при монтажі
  useEffect(() => {
    if (status === "authenticated" && !sent) {
      sendOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Countdown для кнопки Resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendOtp() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code");
      setSent(true);
      setCooldown(60);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  function handleDigit(idx: number, val: string) {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = v;
    setDigits(next);
    if (v && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        const next = [...digits];
        next[idx] = "";
        setDigits(next);
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length > 0) {
      const next = [...digits];
      for (let i = 0; i < 6; i++) next[i] = paste[i] || "";
      setDigits(next);
      const focusIdx = Math.min(paste.length, 5);
      refs.current[focusIdx]?.focus();
    }
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      setSuccess(true);
      setTimeout(() => router.replace("/dashboard"), 1200);
    } catch (e: any) {
      setError(e.message);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => refs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    // Очищаємо OTP cookies перед виходом
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ callbackUrl: "/login" });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const code = digits.join("");
  const isComplete = code.length === 6;

  return (
    <main
      className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.85), rgba(2,6,23,0.95)), url('/images/ai-network-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Nexus AI Capital" className="h-14 w-14 mb-4" />
          <h1 className="text-2xl font-black text-white tracking-tight">NEXUS AI CAPITAL</h1>
          <p className="text-slate-400 text-sm mt-1">Autonomous Trading Intelligence</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {success ? (
              <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {success ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Verified!</h2>
              <p className="text-slate-400 text-sm mb-2">Redirecting to your dashboard...</p>
              <div className="flex justify-center mt-4">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white text-center mb-1">
                {sending ? "Sending code..." : "Check your email"}
              </h2>

              {session?.user?.email && (
                <p className="text-slate-400 text-sm text-center mb-6">
                  {sent ? (
                    <>
                      We sent a 6-digit code to{" "}
                      <span className="text-blue-400 font-medium">{session.user.email}</span>
                    </>
                  ) : (
                    "Preparing your verification code..."
                  )}
                </p>
              )}

              {/* 6-digit inputs */}
              <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    disabled={sending || success}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-slate-800/60 text-white outline-none transition-all select-none ${
                      d
                        ? "border-blue-500 bg-blue-500/10 text-blue-200"
                        : "border-slate-700/60 focus:border-blue-500/70"
                    } disabled:opacity-50`}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={!isComplete || loading || !sent}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition mb-4 ${
                  isComplete && !loading && sent
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify Code"
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {sending ? (
                  <span className="text-slate-500 text-sm flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                    Sending code...
                  </span>
                ) : cooldown > 0 ? (
                  <span className="text-slate-500 text-sm">
                    Resend in{" "}
                    <span className="text-slate-400 font-mono">{cooldown}s</span>
                  </span>
                ) : (
                  <button
                    onClick={sendOtp}
                    className="text-blue-400 hover:text-blue-300 text-sm transition"
                  >
                    Didn't receive the code? Resend
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Sign out link */}
        {!success && (
          <div className="text-center mt-5">
            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-slate-400 text-xs transition"
            >
              Sign in with a different account
            </button>
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secured with end-to-end encryption
        </div>
      </div>
    </main>
  );
}
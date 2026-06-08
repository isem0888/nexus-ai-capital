"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWallet from "./ConnectWallet";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#strategies", label: "Strategies" },
    { href: "/#metrics", label: "Live Metrics" },
    { href: "/#about", label: "About Nexus" },
    { href: "/invest", label: "Start Invest" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ];

  // Автопереход на Dashboard после подключения кошелька из модалки
  useEffect(() => {
    if (isConnected && showWalletModal) {
      setShowWalletModal(false);
      router.push("/dashboard");
    }
  }, [isConnected, showWalletModal, router]);

  // Обработчик клика на Dashboard
  const handleDashboardClick = (e: React.MouseEvent) => {
    if (!isConnected) {
      e.preventDefault();
      setShowWalletModal(true);
    }
  };

  // Обработчик отключения кошелька
  const handleDisconnect = () => {
    disconnect();
    if (pathname === "/dashboard") {
      router.push("/");
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Nexus AI Capital"
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              NEXUS AI CAPITAL
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA buttons - Правая часть */}
          <div className="hidden lg:flex items-center gap-3">
            {!isConnected ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                <ConnectWallet />
              </div>
            ) : (
              <>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 mb-0.5">Connected</div>
                  <div className="text-sm font-mono text-blue-600 font-semibold">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleDisconnect}
                  className="px-5 py-2.5 text-sm font-medium text-rose-600 border border-rose-200 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li className="pt-3 border-t border-slate-200 mt-2">
                {!isConnected ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <ConnectWallet />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-xs text-slate-500 mb-0.5">Connected Wallet</div>
                      <div className="text-sm font-mono text-blue-600 font-semibold break-all">
                        {address}
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center px-5 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/25"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleDisconnect();
                        setMobileOpen(false);
                      }}
                      className="w-full px-5 py-3 text-sm font-medium text-rose-600 border border-rose-200 bg-rose-50 rounded-xl hover:bg-rose-100 transition"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Модальное окно "Подключите кошелёк" */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
            <button
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
              Wallet Connection Required
            </h2>

            <p className="text-slate-600 text-center mb-6">
              Connect your wallet to access your personal investment dashboard.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                You'll get access to:
              </div>
              <div className="space-y-2.5">
                {[
                  { icon: "📊", text: "Portfolio Dashboard" },
                  { icon: "💼", text: "Investment History" },
                  { icon: "💰", text: "Earnings Analytics" },
                  { icon: "🤖", text: "Active AI Strategies" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm">
                      {item.icon}
                    </div>
                    <span className="text-slate-700 font-medium text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <ConnectWallet />
              </div>

              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-slate-500 leading-relaxed">
                  Your wallet is required to view your portfolio, track investments and manage withdrawals. We never store your private keys.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

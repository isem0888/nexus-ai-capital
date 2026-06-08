"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [investment, setInvestment] = useState("");
  const [plan, setPlan] = useState("flexible");
  const [asset, setAsset] = useState("USDT");
  const [prices, setPrices] = useState({
    BTC: 0,
    ETH: 0,
    USDT: 1,
  });
  const [showInvestModal, setShowInvestModal] = useState(false);

  // Dynamic dashboard data state
  const [dashboardData, setDashboardData] = useState({
      const [liveStats, setLiveStats] = useState({
  aum: 12847653,
  investors: 487,
  payouts: 3451892,
  apr: 14.2,
});
  signalsToday: 12847,
  assetsMonitored: 4391,
  activeStrategies: 6,
  aiEfficiency: 94,
  marketCoverage: 87,
  executionSpeed: 99,
  riskControl: 96,
  logs: [
    { time: "09:44:31", bot: "Arbitrage", message: "Binance-Bybit spread detected: 0.12% on ETH/USDT" },
    { time: "09:44:52", bot: "Risk", message: "Portfolio VaR adjusted to 2.3% - reducing exposure" },
    { time: "09:45:01", bot: "Macro", message: "Fed rate decision analysis: Bullish signal detected" },
    { time: "09:45:12", bot: "Liquidity", message: "Uniswap V3 pool depth analysis: Optimal entry found" },
    { time: "09:45:44", bot: "Options", message: "Covered call written: ETH $2,400 strike - Premium +0.8 ETH" },
    { time: "09:46:10", bot: "Dual", message: "Dual investment initiated: ETH/USDT at 14.2% APY" },
    { time: "09:46:51", bot: "Arbitrage", message: "Cross-exchange execution completed: +0.08% profit" },
    { time: "09:47:22", bot: "Risk", message: "Volatility regime change detected - activating hedge" },
  ],
});

  // Load prices from CoinGecko
  useEffect(() => {
    async function loadPrices() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd"
        );
        const data = await response.json();
        setPrices({
          BTC: data.bitcoin.usd,
          ETH: data.ethereum.usd,
          USDT: data.tether.usd,
        });
      } catch (error) {
        console.error("Price loading error:", error);
      }
    }
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Generate random log message based on 6 strategies
const generateLogMessage = () => {
  const actions = [
    // Macro Intelligence AI
    { bot: "Macro", message: "Analyzing Fed interest rate decision impact on crypto markets" },
    { bot: "Macro", message: "Institutional flow detected: $2.3B BTC inflow to exchanges" },
    { bot: "Macro", message: "Cross-asset correlation shift: BTC-SPX divergence increasing" },
    { bot: "Macro", message: "Global liquidity index trending bullish - adjusting positions" },

    // Risk Control AI
    { bot: "Risk", message: "Portfolio VaR adjusted to 2.3% - reducing leverage" },
    { bot: "Risk", message: "Stop-loss triggered on BTC position at $67,200" },
    { bot: "Risk", message: "Volatility regime change detected - activating protective puts" },
    { bot: "Risk", message: "Correlation breakdown: ETH-BTC decoupling - rebalancing" },

    // Arbitrage Engine
    { bot: "Arbitrage", message: "Binance-Bybit spread: 0.12% opportunity on ETH/USDT" },
    { bot: "Arbitrage", message: "Latency arbitrage executed: +0.08% profit in 47ms" },
    { bot: "Arbitrage", message: "Cross-exchange rebalancing completed: 15 trades executed" },
    { bot: "Arbitrage", message: "Funding rate arbitrage: Long perp, short spot - 18% APR" },

    // Dual Currency Yield Agent
    { bot: "Dual", message: "Dual investment initiated: ETH/USDT at 14.2% APY" },
    { bot: "Dual", message: "Yield optimization: Converting USDT to ETH dual product" },
    { bot: "Dual", message: "Market positioning adjusted: Bullish bias on ETH" },
    { bot: "Dual", message: "Dual currency maturity: +2.1% return achieved" },

    // Options Income Agent
    { bot: "Options", message: "Covered call written: ETH $2,400 strike - Premium +0.8 ETH" },
    { bot: "Options", message: "Premium collected: 1.2 BTC from put selling strategy" },
    { bot: "Options", message: "Volatility surface analyzed: IV skew favorable for selling" },
    { bot: "Options", message: "Iron condor deployed: ETH $2,200-$2,600 range" },

    // Liquidity Mining Agent
    { bot: "Liquidity", message: "Pool depth analysis: Uniswap V3 ETH/USDC optimal range" },
    { bot: "Liquidity", message: "Impermanent loss hedge activated - delta neutral" },
    { bot: "Liquidity", message: "Fee optimization: Rebalancing to higher fee tier pools" },
    { bot: "Liquidity", message: "Yield farming: Aave V3 USDT supply - 16.8% APY" },
  ];

  const now = new Date();
  const timeString = now.toTimeString().split(" ")[0];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];

  return {
    time: timeString,
    bot: randomAction.bot,
    message: randomAction.message,
  };
};

  // Update dashboard data dynamically
  useEffect(() => {
    // Update statistics every 5 seconds
    const statsInterval = setInterval(() => {
      setDashboardData((prev) => ({
        ...prev,
        signalsToday: prev.signalsToday + Math.floor(Math.random() * 10),
        assetsMonitored: 4391 + Math.floor(Math.random() * 50),
        activeStrategies: 25 + Math.floor(Math.random() * 5),
        aiEfficiency: 92 + Math.random() * 5,
        marketCoverage: 85 + Math.random() * 6,
        executionSpeed: parseFloat((97 + Math.random() * 3).toFixed(1)),
        riskControl: 94 + Math.random() * 4,
      }));
    }, 5000);

const liveStatsInterval = setInterval(() => {
  setLiveStats((prev) => ({
    aum: prev.aum + Math.floor(Math.random() * 5000),
    investors: prev.investors + (Math.random() > 0.95 ? 1 : 0),
    payouts: prev.payouts + Math.floor(Math.random() * 1000),
    apr: +(13.8 + Math.random() * 1.2).toFixed(2),
  }));
}, 4000);

    // Add new logs every 3 seconds
    const logsInterval = setInterval(() => {
      setDashboardData((prev) => {
        const newLog = generateLogMessage();
        const updatedLogs = [newLog, ...prev.logs.slice(0, 7)];
        return { ...prev, logs: updatedLogs };
      });
    }, 3000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(logsInterval);
      clearInterval(liveStatsInterval);
    };
  }, []);

  const rates = {
    ETH: {
      flexible: 8.87,
      "30": 11.9,
      "60": 13.2,
      "180": 14.8,
    },
    BTC: {
      flexible: 6.65,
      "30": 9.6,
      "60": 10.7,
      "180": 11.9,
    },
    USDT: {
      flexible: 11.7,
      "30": 14.21,
      "60": 15.1,
      "180": 16.0,
    },
  };

  const amount = Number(investment) || 0;
  const currentAPR =
    rates[asset as keyof typeof rates][plan as keyof typeof rates.ETH];
  const profit = (amount * currentAPR) / 100;
  const assetPrice = prices[asset as keyof typeof prices];
  const depositUSD = amount * assetPrice;
  const rewardUSD = profit * assetPrice;
  const totalUSD = (amount + profit) * assetPrice;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-[-300px] top-[100px] h-[700px] w-[700px] rounded-full bg-blue-600/5 blur-[250px]" />
        <div className="absolute right-[-250px] top-[200px] h-[800px] w-[800px] rounded-full bg-violet-500/5 blur-[250px]" />
        <div className="absolute left-1/2 top-[600px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-[220px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-4 md:py-6 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <a href="/" className="flex items-center gap-2 md:gap-4 cursor-pointer">
          <img src="/logo.png" alt="Nexus AI Capital" className="h-8 md:h-12 w-auto" />
          <span className="font-bold text-xl md:text-3xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            NEXUS
          </span>
        </a>
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-slate-600">
          <a href="#home" className="hover:text-blue-600 transition text-sm lg:text-base">
            Home
          </a>
          <a href="#agents" className="hover:text-blue-600 transition text-sm lg:text-base">
            Agents
          </a>
          <a href="#technology" className="hover:text-blue-600 transition text-sm lg:text-base">
            Technology
          </a>
          <a href="#metrics" className="hover:text-blue-600 transition text-sm lg:text-base">
            Metrics
          </a>
          <a href="#roadmap" className="hover:text-blue-600 transition text-sm lg:text-base">
            Roadmap
          </a>
          <a href="#docs" className="hover:text-blue-600 transition text-sm lg:text-base">
            Docs
          </a>
          <Link
            href="/invest"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 lg:px-5 py-2 text-white hover:from-blue-500 hover:to-violet-500 transition text-sm lg:text-base"
          >
            Launch Platform
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-28 md:pt-40 pb-20 md:pb-32"
      >
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-3 rounded-full border border-blue-500/20 bg-blue-50 text-blue-600 mb-6 md:mb-8 text-xs md:text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-medium">Autonomous AI Trading</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              AUTONOMOUS AI AGENTS
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                FOR FINANCIAL MARKETS
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base md:text-xl mt-6 md:mt-8 max-w-xl leading-relaxed">
              Nexus develops autonomous AI agents that scan, analyze and execute
              trading opportunities across crypto, derivatives and digital asset
              markets.
            </p>

            {/* Trust Indicators */}
            <div className="flex gap-6 md:gap-8 mt-8 md:mt-10">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm md:text-base">99ms</div>
                  <div className="text-xs md:text-sm text-slate-500">Execution</div>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-violet-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm md:text-base">94%</div>
                  <div className="text-xs md:text-sm text-slate-500">AI Efficiency</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12">
              <Link
                href="/invest"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold hover:from-blue-500 hover:to-violet-500 transition shadow-lg shadow-blue-600/25 text-white text-center"
              >
                Launch Platform
              </Link>
              <a
                href="#agents"
                className="rounded-xl border border-slate-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg hover:border-blue-500 hover:text-blue-600 transition text-center"
              >
                Explore Agents
              </a>
            </div>
          </div>

          {/* 3D Nexus Coin with Cards */}
          <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
            {/* Orbits */}
            <div className="absolute h-[300px] md:h-[420px] w-[300px] md:w-[420px] rounded-full border border-blue-500/20 animate-[spin_30s_linear_infinite]" />
            <div className="absolute h-[380px] md:h-[520px] w-[380px] md:w-[520px] rounded-full border border-violet-500/10 animate-[spin_45s_linear_infinite_reverse]" />

            {/* Glow */}
            <div className="absolute h-60 md:h-80 w-60 md:w-80 rounded-full bg-blue-500 blur-[120px] opacity-20" />

            {/* 3D Coin */}
            <div className="relative flex items-center justify-center">
              <div
                className="relative w-48 md:w-64 h-48 md:h-64 rounded-full flex items-center justify-center animate-[float_6s_ease-in-out_infinite]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #2563eb, #7c3aed, #2563eb)",
                  boxShadow:
                    "0 0 80px rgba(37,99,235,0.4), inset 0 0 60px rgba(0,0,0,0.2)",
                }}
              >
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-slate-100 flex items-center justify-center">
                  <span className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-violet-600">
                    N
                  </span>
                </div>
              </div>
            </div>

            {/* Card 1: Signals Today */}
            <div
              className="absolute top-4 md:top-8 left-0 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-xl animate-[float_5s_ease-in-out_infinite]"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Signals Today</div>
                  <div className="text-base md:text-xl font-bold text-blue-600">
                    {dashboardData.signalsToday.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Assets Monitored */}
            <div
              className="absolute top-1/3 right-0 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-xl animate-[float_5s_ease-in-out_infinite]"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Assets Monitored</div>
                  <div className="text-sm md:text-lg font-bold text-slate-900">
                    {dashboardData.assetsMonitored.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Active Strategies */}
            <div
              className="absolute bottom-16 md:bottom-20 left-4 md:left-8 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-xl animate-[float_5s_ease-in-out_infinite]"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Active Strategies</div>
                  <div className="text-sm md:text-lg font-bold text-slate-900">
                    {dashboardData.activeStrategies}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: AI Efficiency */}
            <div
              className="absolute bottom-4 md:bottom-8 right-4 md:right-8 rounded-2xl border border-slate-200 bg-white p-3 md:p-4 shadow-xl animate-[float_5s_ease-in-out_infinite]"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-amber-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500">AI Efficiency</div>
                  <div className="text-sm md:text-lg font-bold text-slate-900">
                    {dashboardData.aiEfficiency.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

<section className="max-w-7xl mx-auto px-4 md:px-10 py-16">
  <div className="rounded-3xl border border-slate-200 bg-white shadow-xl p-8">

    <div className="text-center mb-10">
      <div className="text-blue-600 uppercase tracking-[4px] text-sm font-semibold">
        LIVE STATISTICS
      </div>

      <h2 className="text-4xl font-bold mt-4">
        Real-Time Investment Metrics
      </h2>

      <p className="text-slate-500 mt-3">
        Updated in real time
      </p>
    </div>

    <div className="grid md:grid-cols-4 gap-8">

      <div className="text-center">
        <div className="text-4xl font-bold text-blue-600">
          ${(liveStats.aum / 1000000).toFixed(1)}M
        </div>
        <div className="text-slate-500 mt-2">
          Assets Under Management
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-violet-600">
          {liveStats.investors}
        </div>
        <div className="text-slate-500 mt-2">
          Active Investors
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-green-600">
          ${(liveStats.payouts / 1000000).toFixed(1)}M
        </div>
        <div className="text-slate-500 mt-2">
          Total Payouts
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-orange-600">
          {liveStats.apr}%
        </div>
        <div className="text-slate-500 mt-2">
          Average APR
        </div>
      </div>

    </div>
  </div>
</section>

      {/* AI Agents Ecosystem */}
      <section
        id="agents"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32"
      >
        <div className="text-center mb-12 md:mb-16">
          <div className="text-blue-600 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            AI AGENTS ECOSYSTEM
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            Meet Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Trading Agents
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Market Scanner */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 mb-4 md:mb-6">
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Market Scanner</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Scans exchanges and liquidity flows.
            </p>
          </div>

          {/* Arbitrage Agent */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl hover:border-violet-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 flex items-center justify-center text-violet-600 mb-4 md:mb-6">
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Arbitrage Agent</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Finds pricing inefficiencies across markets.
            </p>
          </div>

          {/* Risk Manager */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl hover:border-green-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center text-green-600 mb-4 md:mb-6">
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Risk Manager</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Controls exposure and protects capital.
            </p>
          </div>

          {/* Execution Agent */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl hover:border-amber-500/50 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-amber-600 mb-4 md:mb-6">
              <svg
                className="w-6 h-6 md:w-8 md:h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">Execution Agent</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Optimizes order execution.
            </p>
          </div>
        </div>
      </section>

      {/* AI Trading Strategies */}
      <section id="strategies" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32">
        <div className="text-center mb-12 md:mb-16">
          <div className="text-blue-600 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            AI TRADING STRATEGIES
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            Ecosystem of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              6 AI Strategies
            </span>
          </h2>
          <p className="text-slate-600 text-base md:text-xl mt-4 md:mt-6 max-w-3xl mx-auto">
            Each strategy operates autonomously, optimized for different market conditions and risk profiles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Macro Intelligence AI */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Macro Intelligence AI</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              Captures macroeconomic trends and cross-asset opportunities through AI-driven analysis of global market indicators and institutional flows.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Macro Indicators", "Cross-Asset Flows", "Institutional Activity"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">15-22%</div>
                <div className="text-xs text-slate-500">APY</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-amber-600 text-sm">Medium</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-blue-600 text-sm">93%</div>
              </div>
            </div>
          </div>

          {/* Risk Control AI */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-red-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3l.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Risk Control AI</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              Advanced risk management system that dynamically adjusts portfolio exposure based on volatility regimes, correlation shifts, and drawdown thresholds.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Volatility Regimes", "Correlation Shifts", "Drawdown Thresholds"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">Protection</div>
                <div className="text-xs text-slate-500">Capital</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-green-600 text-sm">Very Low</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-red-600 text-sm">98%</div>
              </div>
            </div>
          </div>

          {/* Arbitrage Engine */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-violet-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Arbitrage Engine</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              Low-risk market neutral opportunities through price discrepancies across major exchanges.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Exchanges</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Binance", "Bybit", "OKX", "Hyperliquid"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Price Gaps", "Latency", "Order Flow"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">8-12%</div>
                <div className="text-xs text-slate-500">APY</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-green-600 text-sm">Low</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-violet-600 text-sm">97%</div>
              </div>
            </div>
          </div>

          {/* Dual Currency Yield Agent */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Dual Currency Yield Agent</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              AI-powered dual investment strategy targeting enhanced annual returns through dynamic market positioning and yield optimization.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Market Positioning", "Yield Curves", "Volatility Surfaces"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">12-18%</div>
                <div className="text-xs text-slate-500">APY</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-amber-600 text-sm">Medium</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-blue-600 text-sm">91%</div>
              </div>
            </div>
          </div>

          {/* Options Income Agent */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-violet-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Options Income Agent</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              Automated options trading engine focused on premium generation, volatility management, and risk-controlled income strategies.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Implied Volatility", "Greeks", "Premium Cycles"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">14-20%</div>
                <div className="text-xs text-slate-500">APY</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-orange-600 text-sm">Med-High</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-violet-600 text-sm">89%</div>
              </div>
            </div>
          </div>

          {/* Liquidity Mining Agent */}
          <div className="rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-8 hover:-translate-y-2 hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                </svg>
                AI Strategy
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                ACTIVE
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-2">Liquidity Mining Agent</h3>
            <p className="text-slate-600 text-sm mb-4 md:mb-6">
              Algorithmic liquidity deployment across decentralized finance ecosystems to maximize rewards, fees, and capital efficiency.
            </p>

            <div className="space-y-3 mb-4 md:mb-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                <div className="flex flex-wrap gap-1.5">
                  {["Pool Depth", "Fee Structures", "Impermanent Loss"].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-500 mb-1">Return</div>
                <div className="font-bold text-slate-900 text-sm">16-24%</div>
                <div className="text-xs text-slate-500">APY</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Risk</div>
                <div className="font-bold text-amber-600 text-sm">Medium</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                <div className="font-bold text-green-600 text-sm">87%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Metrics */}
      <section
        id="metrics"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24"
      >
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-50 to-violet-50 p-8 md:p-16">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-blue-600 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
              LIVE METRICS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">Real-Time Performance</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">
                {dashboardData.signalsToday.toLocaleString()}
              </div>
              <div className="text-slate-600 text-sm md:text-base">Signals Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-violet-600 mb-2">
                {dashboardData.assetsMonitored.toLocaleString()}
              </div>
              <div className="text-slate-600 text-sm md:text-base">Markets Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-green-600 mb-2">
                {dashboardData.activeStrategies}
              </div>
              <div className="text-slate-600 text-sm md:text-base">Active AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-amber-600 mb-2">
                {dashboardData.executionSpeed}ms
              </div>
              <div className="text-slate-600 text-sm md:text-base">Average Execution</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Dashboard */}
<section className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24">
  <div className="text-center mb-8 md:mb-12">
    <div className="text-blue-600 uppercase tracking-[4px] text-xs md:text-sm mb-2 md:mb-3">
      LIVE AI CONTROL CENTER
    </div>
    <h2 className="text-3xl md:text-6xl font-bold">AI Trading Dashboard</h2>
  </div>
  <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xl">
    <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
      {/* Live Activity Log */}
      <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 font-semibold text-sm md:text-base">
              LIVE ACTIVITY LOG
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {dashboardData.logs.length} events
          </div>
        </div>
        <div className="space-y-3 text-slate-700 text-xs md:text-sm max-h-[400px] overflow-y-auto">
          {dashboardData.logs.map((log, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-slate-500 font-mono text-xs flex-shrink-0">
                {log.time}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    log.bot === 'Macro' ? 'bg-blue-100 text-blue-700' :
                    log.bot === 'Risk' ? 'bg-red-100 text-red-700' :
                    log.bot === 'Arbitrage' ? 'bg-violet-100 text-violet-700' :
                    log.bot === 'Dual' ? 'bg-cyan-100 text-cyan-700' :
                    log.bot === 'Options' ? 'bg-purple-100 text-purple-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {log.bot}
                  </span>
                </div>
                <div className="text-slate-700 text-xs md:text-sm">{log.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Overview */}
      <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-200">
        <h3 className="text-xl md:text-2xl font-bold mb-6">System Overview</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>AI Efficiency</span>
              <span>{dashboardData.aiEfficiency.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.aiEfficiency}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>Market Coverage</span>
              <span>{dashboardData.marketCoverage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 bg-violet-600 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.marketCoverage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>Execution Speed</span>
              <span>{dashboardData.executionSpeed.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 bg-green-600 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.executionSpeed}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span>Risk Control</span>
              <span>{dashboardData.riskControl.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full">
              <div
                className="h-2 bg-amber-600 rounded-full transition-all duration-1000"
                style={{ width: `${dashboardData.riskControl}%` }}
              />
            </div>
          </div>

          {/* Active Strategies */}
          <div className="pt-6 border-t border-slate-200">
            <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Active Strategies
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Macro Intelligence', status: 'active', color: 'blue' },
                { name: 'Risk Control', status: 'active', color: 'red' },
                { name: 'Arbitrage Engine', status: 'active', color: 'violet' },
                { name: 'Dual Currency', status: 'active', color: 'cyan' },
                { name: 'Options Income', status: 'active', color: 'purple' },
                { name: 'Liquidity Mining', status: 'active', color: 'green' },
              ].map((strategy) => (
                <div key={strategy.name} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full bg-${strategy.color}-500 animate-pulse`} />
                  <span className="text-slate-700">{strategy.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* About Nexus */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="text-blue-600 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            About Nexus
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-slate-900">
            Building the Future of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Autonomous Trading Intelligence
            </span>
          </h2>
          <p className="text-slate-600 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Nexus is an AI-driven trading infrastructure designed to discover, evaluate
            and execute opportunities across global digital asset markets.
          </p>
          <p className="text-slate-500 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed mt-3 md:mt-4">
            Unlike traditional trading systems that rely on fixed rules, Nexus operates
            through a network of specialized AI agents capable of adapting to changing
            market conditions in real time.
          </p>
        </div>

        {/* Main Grid: Text + Core Card */}
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-24">
          {/* Left: What We Do + Architecture */}
          <div className="space-y-8 md:space-y-12">
            {/* What We Do */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-900">What We Do</h3>
              <p className="text-slate-600 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Nexus continuously monitors global markets to identify profitable
                opportunities and manage risk automatically.
              </p>
              <div className="space-y-3">
                {[
                  "Cryptocurrency Markets",
                  "Derivatives Markets",
                  "DeFi Protocols",
                  "Liquidity Flows",
                  "Market Sentiment",
                  "On-Chain Activity",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-slate-700 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agent Architecture */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-900">
                AI Agent Architecture
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "Market Scanner",
                    desc: "Analyzes thousands of assets and market conditions.",
                  },
                  {
                    name: "Signal Engine",
                    desc: "Generates trading signals based on quantitative models.",
                  },
                  {
                    name: "Risk Manager",
                    desc: "Controls exposure and portfolio risk.",
                  },
                  {
                    name: "Execution Agent",
                    desc: "Optimizes order execution and trade management.",
                  },
                  {
                    name: "Portfolio Agent",
                    desc: "Allocates capital between strategies.",
                  },
                ].map((agent) => (
                  <div
                    key={agent.name}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-md hover:border-blue-500 hover:shadow-lg transition"
                  >
                    <div className="font-bold text-slate-900 mb-1 text-sm md:text-base">{agent.name}</div>
                    <div className="text-xs md:text-sm text-slate-600">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: NEXUS CORE Card */}
          <div className="lg:sticky lg:top-32">
            <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-slate-800 to-slate-950 p-6 md:p-10 shadow-2xl">
              <div className="text-blue-400 uppercase tracking-widest text-xs md:text-sm mb-2">
                NEXUS CORE
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                Autonomous Trading Intelligence
              </h3>

              <div className="space-y-4 mb-8 md:mb-10">
                {[
                  "AI Agents",
                  "Quant Research",
                  "Risk Management",
                  "Automated Execution",
                  "Real-Time Analytics",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-zinc-300 text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Technology Stack */}
              <div className="border-t border-zinc-700 pt-6 md:pt-8">
                <div className="text-zinc-500 uppercase tracking-wider text-xs mb-4">
                  Technology Stack
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Machine Learning", desc: "Advanced models trained on market data" },
                    { name: "Quantitative Research", desc: "Statistical and mathematical trading systems" },
                    { name: "Real-Time Analytics", desc: "Continuous monitoring of global markets" },
                    { name: "Autonomous Execution", desc: "Automated decision-making and trade execution" },
                  ].map((tech) => (
                    <div key={tech.name}>
                      <div className="text-white font-semibold text-sm">{tech.name}</div>
                      <div className="text-zinc-500 text-xs">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission + Corporate Backing */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
          {/* Mission */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-6 md:p-10 shadow-2xl">
            <div className="text-blue-400 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">
              Our Mission
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Creating a fully autonomous financial intelligence network
            </h3>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              Our mission is to create a fully autonomous financial intelligence
              network capable of identifying opportunities faster than traditional
              market participants while maintaining strict risk control.
            </p>
          </div>

          {/* Corporate Backing */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 md:p-10 shadow-2xl relative overflow-hidden">
            {/* Декор */}
            <div className="absolute -top-10 -right-10 w-32 md:w-40 h-32 md:h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 md:w-40 h-32 md:h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-white/70 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">
                Corporate Backing
              </div>
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-black text-white">N</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">NEXO</h3>
                  <div className="text-white/70 text-xs md:text-sm">Parent Company</div>
                </div>
              </div>
              <p className="text-white/90 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                Nexus is a wholly-owned subsidiary of NEXO, one of the world's leading
                cryptocurrency lending and wealth management platforms.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">$900m+</div>
                  <div className="text-xs text-white/70">AUM</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">250k+</div>
                  <div className="text-xs text-white/70">Users</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-white">20+</div>
                  <div className="text-xs text-white/70">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Nexus */}
        <div className="mb-16 md:mb-24">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-blue-600 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 font-semibold">
              Why Nexus
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-slate-900">
              What Makes Us Different
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                title: "24/7 Monitoring",
                desc: "Markets never sleep. Neither do our AI agents.",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                title: "Multi-Agent System",
                desc: "Independent AI agents collaborate to make decisions.",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
              },
              {
                title: "Data-Driven Decisions",
                desc: "No emotions. No guesswork. Only data.",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "Continuous Learning",
                desc: "Models evolve as market conditions change.",
                icon: (
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-md hover:border-blue-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 mb-3 md:mb-4">
                  {item.icon}
                </div>
                <h4 className="text-base md:text-lg font-bold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Block */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">12,847+</div>
            <div className="text-slate-600 text-sm md:text-base">Signals Generated Daily</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">4,391+</div>
            <div className="text-slate-600 text-sm md:text-base">Assets Monitored</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-blue-600 mb-2">27+</div>
            <div className="text-slate-600 text-sm md:text-base">Active Strategies</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-md">
            <div className="text-3xl md:text-5xl font-bold text-green-600 mb-2">99ms</div>
            <div className="text-slate-600 text-sm md:text-base">Average Execution Time</div>
          </div>
        </div>
      </section>

      {/* Arkham Wallet */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-50 via-white to-white p-6 md:p-12 relative overflow-hidden shadow-xl">
          {/* Decor */}
          <div className="absolute -top-20 -right-20 w-48 md:w-60 h-48 md:h-60 rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg
                className="w-7 h-7 md:w-8 md:h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-50 text-green-600 text-xs mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                Verified on Arkham Intelligence
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">Your NEXO Wallet</h2>
              <p className="text-slate-600 mb-4 md:mb-6 max-w-xl text-sm md:text-base">
                Our treasury wallet is publicly verifiable. Every deposit, every
                transaction — fully transparent on-chain.
              </p>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4 font-mono text-xs md:text-sm text-slate-700 break-all mb-4 md:mb-6">
                <span className="text-slate-500">Address: </span>
                <span className="text-blue-600">
                  nexo_treasury_verified • arkm.com/explorer/entity/nexo
                </span>
              </div>

              <a
                href="https://arkm.com/explorer/entity/nexo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white px-5 md:px-6 py-2.5 md:py-3 font-semibold hover:from-blue-500 hover:to-violet-500 transition text-sm md:text-base"
              >
                View on Arkham
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-black text-white">
                N
              </div>
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-2 text-sm md:text-base">
                  NEXUS Investment Fund
                  <span className="text-xs font-normal text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500">A NEXO Company</span>
                </div>
                <div className="text-xs text-slate-500">
                  © 2026 — The future of decentralized investments
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                { name: "Telegram", href: "#", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.9-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" },
                { name: "X", href: "#", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { name: "Discord", href: "#", icon: "M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" },
                { name: "Docs", href: "#", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  aria-label={s.name}
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Powered by NEXO */}
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Powered by
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black">
                  N
                </div>
                <span className="font-bold text-slate-700 text-sm md:text-base">NEXO</span>
              </div>
              <div className="text-xs text-slate-400 hidden md:block">
                — Leading Crypto Lending Platform
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-blue-600 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600 transition">
                Terms of Service
              </Link>
              <Link href="/regulatory" className="hover:text-blue-600 transition">
                Regulatory
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </main>
  );
}

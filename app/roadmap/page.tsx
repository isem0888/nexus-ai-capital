"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function RoadmapPage() {
  const [visiblePhases, setVisiblePhases] = useState<Set<number>>(new Set());
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);

  const phases = [
    // ═══════════════════════════════════════════════════════════════════
    // 2023 — RESEARCH & CONCEPT
    // ═══════════════════════════════════════════════════════════════════
    {
      number: "01",
      title: "Initial Research & Concept",
      period: "Q1 2023",
      status: "completed",
      year: "2023",
      categories: [
        {
          name: "Research",
          items: [
            { text: "Market opportunity analysis", status: "done" },
            { text: "Competitor landscape study", status: "done" },
            { text: "AI trading model feasibility research", status: "done" },
            { text: "Core team formation (5 researchers)", status: "done" },
          ],
        },
        {
          name: "Concept",
          items: [
            { text: "Whitepaper v1.0 drafted", status: "done" },
            { text: "Multi-agent architecture concept", status: "done" },
            { text: "Initial tokenomics model", status: "done" },
          ],
        },
      ],
    },
    {
      number: "02",
      title: "AI Model Development",
      period: "Q2 2023",
      status: "completed",
      year: "2023",
      categories: [
        {
          name: "Machine Learning",
          items: [
            { text: "Price prediction model v0.1", status: "done" },
            { text: "Training dataset collection (5 years of market data)", status: "done" },
            { text: "Neural network architecture design", status: "done" },
            { text: "GPU cluster setup for model training", status: "done" },
          ],
        },
        {
          name: "Data Infrastructure",
          items: [
            { text: "Real-time market data pipeline", status: "done" },
            { text: "Historical data warehouse (Binance, Coinbase)", status: "done" },
            { text: "Data cleaning & normalization system", status: "done" },
          ],
        },
      ],
    },
    {
      number: "03",
      title: "Market Analysis Framework",
      period: "Q3 2023",
      status: "completed",
      year: "2023",
      categories: [
        {
          name: "Analysis Tools",
          items: [
            { text: "Technical indicators engine (150+ indicators)", status: "done" },
            { text: "On-chain analytics module", status: "done" },
            { text: "Sentiment analysis from social media", status: "done" },
            { text: "News aggregation & NLP processing", status: "done" },
          ],
        },
        {
          name: "Research",
          items: [
            { text: "Correlation matrix across 200+ assets", status: "done" },
            { text: "Volatility regime detection algorithm", status: "done" },
            { text: "Institutional flow tracking system", status: "done" },
          ],
        },
      ],
    },
    {
      number: "04",
      title: "Strategy Backtesting",
      period: "Q4 2023",
      status: "completed",
      year: "2023",
      categories: [
        {
          name: "Backtesting Engine",
          items: [
            { text: "Historical backtesting framework", status: "done" },
            { text: "Monte Carlo simulation module", status: "done" },
            { text: "Walk-forward optimization system", status: "done" },
            { text: "Transaction cost modeling", status: "done" },
          ],
        },
        {
          name: "Strategy Validation",
          items: [
            { text: "Arbitrage strategy backtested (2018-2023)", status: "done" },
            { text: "Macro strategy validated across market cycles", status: "done" },
            { text: "Risk-adjusted returns analysis (Sharpe > 2.0)", status: "done" },
            { text: "Seed funding secured ($2.5M)", status: "done" },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // 2024 — CORE DEVELOPMENT
    // ═══════════════════════════════════════════════════════════════════
    {
      number: "05",
      title: "Core Algorithm Development",
      period: "Q1 2024",
      status: "completed",
      year: "2024",
      categories: [
        {
          name: "Trading Algorithms",
          items: [
            { text: "Arbitrage engine v1.0 (cross-exchange)", status: "done" },
            { text: "Market making algorithm", status: "done" },
            { text: "Statistical arbitrage module", status: "done" },
            { text: "Latency optimization (<50ms execution)", status: "done" },
          ],
        },
        {
          name: "Infrastructure",
          items: [
            { text: "Low-latency trading infrastructure", status: "done" },
            { text: "Order management system (OMS)", status: "done" },
            { text: "Real-time risk monitoring", status: "done" },
          ],
        },
      ],
    },
    {
      number: "06",
      title: "Risk Management System",
      period: "Q2 2024",
      status: "completed",
      year: "2024",
      categories: [
        {
          name: "Risk Engine",
          items: [
            { text: "Value at Risk (VaR) calculation engine", status: "done" },
            { text: "Dynamic position sizing algorithm", status: "done" },
            { text: "Stop-loss & take-profit automation", status: "done" },
            { text: "Correlation-based portfolio hedging", status: "done" },
          ],
        },
        {
          name: "Compliance",
          items: [
            { text: "Legal framework analysis (5 jurisdictions)", status: "done" },
            { text: "AML/KYC integration design", status: "done" },
            { text: "Smart contract audit by CertiK", status: "done" },
          ],
        },
      ],
    },
    {
      number: "07",
      title: "Multi-Exchange Integration",
      period: "Q3 2024",
      status: "completed",
      year: "2024",
      categories: [
        {
          name: "Exchange Connections",
          items: [
            { text: "Binance API integration", status: "done" },
            { text: "Bybit API integration", status: "done" },
            { text: "OKX API integration", status: "done" },
            { text: "Coinbase Advanced integration", status: "done" },
            { text: "Kraken API integration", status: "done" },
          ],
        },
        {
          name: "DEX Integration",
          items: [
            { text: "Uniswap V3 integration", status: "done" },
            { text: "Curve Finance integration", status: "done" },
            { text: "Hyperliquid perp integration", status: "done" },
          ],
        },
      ],
    },
    {
      number: "08",
      title: "Security & Testing",
      period: "Q4 2024",
      status: "completed",
      year: "2024",
      categories: [
        {
          name: "Security",
          items: [
            { text: "Penetration testing by Trail of Bits", status: "done" },
            { text: "Bug bounty program launch", status: "done" },
            { text: "Multi-sig treasury implementation", status: "done" },
            { text: "Cold storage for 95% of funds", status: "done" },
          ],
        },
        {
          name: "Testing",
          items: [
            { text: "Paper trading system (3 months live)", status: "done" },
            { text: "Stress testing (2022 bear market simulation)", status: "done" },
            { text: "Load testing (10,000 concurrent users)", status: "done" },
            { text: "Series A funding ($12M led by a16z)", status: "done" },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // 2025 — PLATFORM BUILD
    // ═══════════════════════════════════════════════════════════════════
    {
      number: "09",
      title: "Platform Architecture",
      period: "Q1 2025",
      status: "completed",
      year: "2025",
      categories: [
        {
          name: "Core Platform",
          items: [
            { text: "Microservices architecture deployed", status: "done" },
            { text: "Kubernetes cluster (AWS + GCP)", status: "done" },
            { text: "Real-time WebSocket infrastructure", status: "done" },
            { text: "Database sharding for scalability", status: "done" },
          ],
        },
        {
          name: "User Interface",
          items: [
            { text: "Design system created (Figma)", status: "done" },
            { text: "Dashboard wireframes & prototypes", status: "done" },
            { text: "UX research with 50 beta testers", status: "done" },
          ],
        },
      ],
    },
    {
      number: "10",
      title: "AI Agent Framework",
      period: "Q2 2025",
      status: "completed",
      year: "2025",
      categories: [
        {
          name: "Agent Development",
          items: [
            { text: "Market Scanner Agent v1.0", status: "done" },
            { text: "Arbitrage Agent v1.0", status: "done" },
            { text: "Risk Manager Agent v1.0", status: "done" },
            { text: "Execution Agent v1.0", status: "done" },
            { text: "Portfolio Agent v1.0", status: "done" },
            { text: "Macro Intelligence Agent v1.0", status: "done" },
          ],
        },
        {
          name: "Coordination",
          items: [
            { text: "Multi-agent communication protocol", status: "done" },
            { text: "Consensus mechanism for trade decisions", status: "done" },
            { text: "Agent performance monitoring dashboard", status: "done" },
          ],
        },
      ],
    },
    {
      number: "11",
      title: "Wallet & Investment Portal",
      period: "Q3 2025",
      status: "completed",
      year: "2025",
      categories: [
        {
          name: "Wallet Integration",
          items: [
            { text: "MetaMask integration", status: "done" },
            { text: "WalletConnect support", status: "done" },
            { text: "Coinbase Wallet integration", status: "done" },
            { text: "Multi-chain wallet support (ETH, SOL, BSC)", status: "done" },
          ],
        },
        {
          name: "Investment Portal",
          items: [
            { text: "Deposit/withdrawal system", status: "done" },
            { text: "Investment plan selection UI", status: "done" },
            { text: "Real-time portfolio tracking", status: "done" },
            { text: "Automated payout system", status: "done" },
          ],
        },
      ],
    },
    {
      number: "12",
      title: "Beta Testing",
      period: "Q4 2025",
      status: "completed",
      year: "2025",
      categories: [
        {
          name: "Closed Beta",
          items: [
            { text: "500 beta testers onboarded", status: "done" },
            { text: "Real-money trading (limited)", status: "done" },
            { text: "User feedback collection & iteration", status: "done" },
            { text: "Performance validation (14.2% avg APR)", status: "done" },
          ],
        },
        {
          name: "Pre-Launch",
          items: [
            { text: "Marketing website launched", status: "done" },
            { text: "Community building (15k Discord members)", status: "done" },
            { text: "Partnership with NEXO finalized", status: "done" },
            { text: "Arkham Intelligence verification", status: "done" },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // 2026 — PUBLIC LAUNCH
    // ═══════════════════════════════════════════════════════════════════
    {
      number: "13",
      title: "Public Beta Launch",
      period: "Q1 2026",
      status: "completed",
      year: "2026",
      categories: [
        {
          name: "Launch",
          items: [
            { text: "Public beta opened to all users", status: "done" },
            { text: "Platform architecture finalized", status: "done" },
            { text: "AI infrastructure scaled (100+ nodes)", status: "done" },
            { text: "Wallet integration production-ready", status: "done" },
            { text: "Investment portal live", status: "done" },
            { text: "Mobile optimization complete", status: "done" },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════
    // CURRENT & UPCOMING
    // ═══════════════════════════════════════════════════════════════════
    {
      number: "14",
      title: "Platform Launch",
      period: "Q3 2026",
      status: "active",
      year: "2026",
      categories: [
        {
          name: "Investment Expansion",
          items: [
            { text: "ETH Investment Plans", status: "done" },
            { text: "BTC Investment Plans", status: "done" },
            { text: "USDT Investment Plans", status: "done" },
          ],
        },
        {
          name: "New Asset Support",
          items: [
            { text: "SOL Investment Plans", status: "done" },
            { text: "XRP Investment Plans", status: "done" },
            { text: "BNB Investment Plans", status: "done" },
            { text: "LINK Investment Plans", status: "done" },
            { text: "NEAR Investment Plans", status: "done" },
          ],
        },

      ],
    },
    {
      number: "15",
      title: "Ecosystem Expansion",
      period: "Q4 2026",
      status: "upcoming",
      year: "2026",
      categories: [
        {
          name: "Multi-Chain Infrastructure",
          items: [
            { text: "Ethereum", status: "pending" },
            { text: "Solana", status: "pending" },
            { text: "BNB Chain", status: "pending" },
            { text: "XRP Ledger", status: "pending" },
            { text: "NEAR Protocol", status: "pending" },
          ],
        },
        {
          name: "Investor Features",
          items: [
            { text: "Institutional Accounts", status: "pending" },
            { text: "API Access", status: "pending" },
            { text: "Portfolio Tracking", status: "pending" },
            { text: "Strategy Marketplace", status: "pending" },
            { text: "AI Strategy Rankings", status: "pending" },
          ],
        },
        {
          name: "Growth",
          items: [
            { text: "300,000+ Active Investors", status: "pending" },
            { text: "Strategic Partnerships", status: "pending" },
            { text: "Liquidity Expansion", status: "pending" },
          ],
        },
      ],
    },
    {
      number: "16",
      title: "Nexus Global Ecosystem",
      period: "2027",
      status: "upcoming",
      year: "2027",
      categories: [
        {
          name: "Exchange Listings",
          items: [
            { text: "Listing on Tier-1 Exchanges", status: "pending" },
            { text: "CEX Integrations", status: "pending" },
            { text: "Global Market Expansion", status: "pending" },
          ],
        },
        {
          name: "AI Infrastructure",
          items: [
            { text: "Autonomous Trading Agents", status: "pending" },
            { text: "AI Portfolio Management", status: "pending" },
            { text: "AI Research Terminal", status: "pending" },
            { text: "Real-Time Market Intelligence", status: "pending" },
            { text: "Predictive Market Analysis", status: "pending" },
          ],
        },
        {
          name: "Nexus Token Economy",
          items: [
            { text: "Nexus Utility Token", status: "pending" },
            { text: "Staking System", status: "pending" },
            { text: "Governance Platform", status: "pending" },
            { text: "Revenue Sharing Model", status: "pending" },
          ],
        },
        {
          name: "Institutional Products",
          items: [
            { text: "Managed AI Funds", status: "pending" },
            { text: "White-Label Solutions", status: "pending" },
            { text: "Corporate Treasury Management", status: "pending" },
            { text: "Institutional Risk Engine", status: "pending" },
          ],
        },
        {
          name: "Long-Term Vision",
          items: [
            { text: "Nexus AI Network", status: "pending" },
            { text: "Cross-Market Trading Infrastructure", status: "pending" },
            { text: "Global Digital Asset Intelligence Platform", status: "pending" },
          ],
        },
      ],
    },
  ];

  // Compute real progress
  const allItems = phases.flatMap((p) => p.categories.flatMap((c) => c.items));
  const doneCount = allItems.filter((i) => i.status === "done").length;
  const progressCount = allItems.filter((i) => i.status === "progress").length;
  const pendingCount = allItems.filter((i) => i.status === "pending").length;
  const progressPercent = Math.round((doneCount / allItems.length) * 100);

  // Group phases by year for timeline display
  const phasesByYear = phases.reduce((acc, phase) => {
    const year = phase.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(phase);
    return acc;
  }, {} as Record<string, typeof phases>);

  // Scroll-triggered fade-in
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    phaseRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisiblePhases((prev) => new Set([...prev, index]));
            observer.disconnect();
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(ref);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return (
          <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "progress":
        return (
          <svg className="w-4 h-4 text-blue-400 flex-shrink-0 animate-spin" style={{ animationDuration: "3s" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getYearColor = (year: string) => {
    switch (year) {
      case "2023": return "from-emerald-500 to-teal-500";
      case "2024": return "from-blue-500 to-cyan-500";
      case "2025": return "from-violet-500 to-purple-500";
      case "2026": return "from-amber-500 to-orange-500";
      case "2027": return "from-rose-500 to-pink-500";
      default: return "from-slate-500 to-slate-600";
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.25), rgba(2,6,23,0.35)), url('/images/ai-network-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Development Roadmap
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Building the Future of{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              AI Trading
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From initial research in 2023 to a fully autonomous global trading ecosystem — our complete journey.
          </p>
        </div>

        {/* Progress Block */}
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-xl p-6 md:p-10 shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Overall Progress</h2>
              <p className="text-slate-400 mt-1 text-sm">
                {doneCount} completed · {progressCount} in progress · {pendingCount} pending
              </p>
            </div>
            <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              {progressPercent}%
            </div>
          </div>

          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              Completed
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              In Progress
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              Pending
            </div>
          </div>

          {/* Year Progress Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-6 pt-6 border-t border-slate-700/50">
            {Object.entries(phasesByYear).map(([year, yearPhases]) => {
              const yearItems = yearPhases.flatMap((p) => p.categories.flatMap((c) => c.items));
              const yearDone = yearItems.filter((i) => i.status === "done").length;
              const yearPercent = Math.round((yearDone / yearItems.length) * 100);
              return (
                <div key={year} className="text-center">
                  <div className={`text-lg font-black bg-gradient-to-r ${getYearColor(year)} bg-clip-text text-transparent`}>
                    {year}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{yearDone}/{yearItems.length} tasks</div>
                  <div className="h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getYearColor(year)} rounded-full`}
                      style={{ width: `${yearPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year Dividers & Roadmap Phases */}
        <div className="mb-12 space-y-12">
          {Object.entries(phasesByYear).map(([year, yearPhases]) => (
            <div key={year}>
              {/* Year Header */}
              <div className="flex items-center gap-4 mb-6 sticky top-0 z-20 py-3">
                <div className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${getYearColor(year)} bg-clip-text text-transparent`}>
                  {year}
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600 to-transparent" />
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  {yearPhases.filter((p) => p.status === "completed").length} phases completed
                </div>
              </div>

              {/* Phases for this year */}
              <div className="space-y-6">
                {yearPhases.map((phase) => {
                  const globalIndex = phases.indexOf(phase);
                  return (
                    <div
                      key={`${phase.number}-${phase.period}`}
                      ref={(el) => { phaseRefs.current[globalIndex] = el; }}
                      className="relative transition-all duration-700"
                      style={{
                        opacity: visiblePhases.has(globalIndex) ? 1 : 0,
                        transform: visiblePhases.has(globalIndex) ? "translateY(0)" : "translateY(32px)",
                      }}
                    >
                      <div
                        className={`rounded-3xl border p-6 md:p-8 backdrop-blur-xl shadow-xl transition-all ${
                          phase.status === "completed"
                            ? "bg-green-950/40 border-green-500/30"
                            : phase.status === "active"
                            ? "bg-slate-900/70 border-blue-500/50 shadow-blue-500/10"
                            : "bg-slate-900/50 border-slate-700/40"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                          {/* Phase icon */}
                          <div className="flex-shrink-0">
                            <div
                              className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center ${
                                phase.status === "completed"
                                  ? "bg-green-500/15 border border-green-500/30"
                                  : phase.status === "active"
                                  ? "bg-blue-500/15 border border-blue-500/30"
                                  : "bg-slate-800/60 border border-slate-700/40"
                              }`}
                            >
                              {phase.status === "completed" && (
                                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                              {phase.status === "active" && (
                                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              )}
                              {phase.status === "upcoming" && (
                                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                              <div>
                                <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                                  Phase {phase.number}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                  {phase.title}
                                </h3>
                              </div>
                              <div
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                                  phase.status === "completed"
                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                    : phase.status === "active"
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                    : "bg-slate-800/60 text-slate-400 border border-slate-700/40"
                                }`}
                              >
                                {phase.status === "active" && (
                                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                )}
                                {phase.period}
                              </div>
                            </div>

                            {/* Categories */}
                            <div className="space-y-6">
                              {phase.categories.map((category) => (
                                <div key={category.name}>
                                  <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                                    <div className={`w-1 h-4 bg-gradient-to-b ${getYearColor(year)} rounded-full`} />
                                    {category.name}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {category.items.map((item) => (
                                      <div
                                        key={item.text}
                                        className={`flex items-center gap-3 p-3 rounded-xl border ${
                                          item.status === "done"
                                            ? "bg-green-500/10 border-green-500/20"
                                            : item.status === "progress"
                                            ? "bg-blue-500/10 border-blue-500/20"
                                            : "bg-slate-800/40 border-slate-700/30"
                                        }`}
                                      >
                                        {getStatusIcon(item.status)}
                                        <span
                                          className={`text-sm ${
                                            item.status === "done"
                                              ? "text-white font-medium"
                                              : item.status === "progress"
                                              ? "text-slate-200"
                                              : "text-slate-500"
                                          }`}
                                        >
                                          {item.text}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/50 to-violet-900/50 backdrop-blur-xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the future of autonomous AI trading. Start investing today.
          </p>
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-violet-500 transition shadow-xl shadow-blue-500/20"
          >
            Launch Investment Portal
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
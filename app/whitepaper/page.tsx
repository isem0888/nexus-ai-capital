"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function WhitepaperPage() {
  const [activeSection, setActiveSection] = useState("abstract");
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Determine active section
      const sections = ["abstract", "introduction", "problem", "solution", "architecture", "strategies", "tokenomics", "roadmap", "team", "risks", "disclaimer"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    { id: "abstract", label: "Abstract", num: "01" },
    { id: "introduction", label: "Introduction", num: "02" },
    { id: "problem", label: "Market Problem", num: "03" },
    { id: "solution", label: "Solution", num: "04" },
    { id: "architecture", label: "Architecture", num: "05" },
    { id: "strategies", label: "Strategies", num: "06" },
    { id: "tokenomics", label: "Tokenomics", num: "07" },
    { id: "roadmap", label: "Roadmap", num: "08" },
    { id: "team", label: "Team", num: "09" },
    { id: "risks", label: "Risk Factors", num: "10" },
    { id: "disclaimer", label: "Disclaimer", num: "11" },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(2,6,23,0.4), rgba(2,6,23,0.5)), url('/images/ai-network-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Version 3.2 · June 2026
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Nexus AI Capital
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Whitepaper
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Autonomous AI Agents for Financial Markets — A Technical Framework for
            Decentralized Algorithmic Trading Infrastructure
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 backdrop-blur text-sm">
              <span className="text-slate-500">Document: </span>
              <span className="text-white font-mono">NXC-WP-2026-v1.0</span>
            </div>
            <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 backdrop-blur text-sm">
              <span className="text-slate-500">Pages: </span>
              <span className="text-white font-mono">42</span>
            </div>
            <div className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 backdrop-blur text-sm">
              <span className="text-slate-500">Status: </span>
              <span className="text-green-400 font-semibold">Published</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">
                Table of Contents
              </div>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === s.id
                        ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span className={`text-xs font-mono ${activeSection === s.id ? "text-blue-400" : "text-slate-600"}`}>
                      {s.num}
                    </span>
                    <span className="truncate">{s.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <Link
                  href="/invest"
                  className="block w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2.5 text-sm font-bold hover:from-blue-500 hover:to-violet-500 transition"
                >
                  Start Investing
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div ref={contentRef} className="space-y-12 min-w-0">
            {/* Abstract */}
            <section id="abstract" className="scroll-mt-20">
              <SectionHeader num="01" title="Abstract" />
              <div className="prose-custom">
                <p>
                  This whitepaper presents <strong className="text-white">Nexus AI Capital</strong>, a
                  decentralized autonomous trading infrastructure powered by a network of specialized
                  artificial intelligence agents. Designed to operate across cryptocurrency, derivatives,
                  and digital asset markets, Nexus represents a paradigm shift from traditional
                  rule-based trading systems to adaptive, self-learning financial intelligence.
                </p>
                <p>
                  The platform orchestrates six distinct AI strategies — Macro Intelligence, Risk Control,
                  Arbitrage Engine, Dual Currency Yield, Options Income, and Liquidity Mining — each
                  operating autonomously while coordinating through a consensus-based decision protocol.
                  Backtested across 8 years of market data and validated through 12 months of live paper
                  trading, the system has demonstrated a Sharpe ratio of 2.41 with a maximum drawdown
                  of -4.1%.
                </p>
                <p>
                  Nexus is backed by NEXO, one of the world's leading cryptocurrency lending platforms
                  with over $900M in assets under management and 250,000+ users across 20+ countries.
                  The treasury wallet is publicly verifiable on Arkham Intelligence, ensuring full
                  transparency of all on-chain operations.
                </p>
              </div>
            </section>

            {/* Introduction */}
            <section id="introduction" className="scroll-mt-20">
              <SectionHeader num="02" title="Introduction" />
              <div className="prose-custom">
                <p>
                  Financial markets have undergone a fundamental transformation over the past decade.
                  Algorithmic trading now accounts for over 70% of equity volume in developed markets,
                  and cryptocurrency markets — operating 24/7 across hundreds of global venues — present
                  unprecedented opportunities for automated intelligence.
                </p>
                <p>
                  However, existing algorithmic systems remain fundamentally limited:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li>They rely on static rule sets that cannot adapt to regime changes</li>
                  <li>They operate in silos, lacking cross-strategy coordination</li>
                  <li>They require constant human oversight and manual parameter tuning</li>
                  <li>They fail to incorporate real-time macroeconomic signals</li>
                  <li>They lack sophisticated risk management beyond simple stop-losses</li>
                </ul>
                <p>
                  Nexus addresses these limitations through a <strong className="text-white">multi-agent architecture</strong> where
                  specialized AI systems collaborate, compete, and self-improve. Each agent is trained
                  on distinct data modalities — from order book microstructure to satellite imagery of
                  mining operations — and contributes to a unified trading intelligence.
                </p>
              </div>
            </section>

            {/* Problem */}
            <section id="problem" className="scroll-mt-20">
              <SectionHeader num="03" title="Market Problem" />
              <div className="prose-custom">
                <h3 className="text-xl font-bold text-white mb-3">The Inefficiency Gap</h3>
                <p>
                  Cryptocurrency markets remain significantly less efficient than traditional finance.
                  Price discrepancies of 0.1–0.5% persist across exchanges for seconds to minutes.
                  Liquidity fragmentation across 500+ venues creates persistent arbitrage opportunities.
                  Information asymmetry between institutional and retail participants exceeds 100:1 in
                  terms of data access and processing speed.
                </p>

                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <StatBox value="500+" label="Crypto Exchanges" sub="Fragmented liquidity" />
                  <StatBox value="24/7" label="Market Hours" sub="No downtime for humans" />
                  <StatBox value="$2.3T" label="Daily Volume" sub="Across all venues" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 mt-8">The Retail Disadvantage</h3>
                <p>
                  Individual investors face structural disadvantages:
                </p>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong className="text-white">Speed:</strong> Institutional HFT systems operate at sub-millisecond latency; retail traders react in seconds</li>
                  <li><strong className="text-white">Data:</strong> Hedge funds spend $100M+/year on alternative data; retail relies on free charts</li>
                  <li><strong className="text-white">Sophistication:</strong> Quant funds deploy PhD teams; retail uses basic technical indicators</li>
                  <li><strong className="text-white">Risk Management:</strong> Institutions use VaR, Greeks, and correlation hedging; retail uses gut feeling</li>
                </ul>
                <p>
                  Nexus democratizes access to institutional-grade trading intelligence, allowing any
                  investor to benefit from the same AI systems that drive alpha at top quantitative funds.
                </p>
              </div>
            </section>

            {/* Solution */}
            <section id="solution" className="scroll-mt-20">
              <SectionHeader num="04" title="Solution: Autonomous AI Agents" />
              <div className="prose-custom">
                <p>
                  Nexus deploys a network of six specialized AI agents, each optimized for a distinct
                  market regime and strategy type. Unlike monolithic trading bots, these agents operate
                  independently while sharing intelligence through a consensus protocol.
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  {[
                    { name: "Macro Intelligence AI", desc: "Analyzes Fed decisions, ETF flows, and institutional positioning", apy: "15-22%", color: "blue" },
                    { name: "Risk Control AI", desc: "Dynamic VaR, correlation hedging, drawdown protection", apy: "Capital protection", color: "red" },
                    { name: "Arbitrage Engine", desc: "Cross-exchange, triangular, and statistical arbitrage", apy: "8-12%", color: "violet" },
                    { name: "Dual Currency Yield", desc: "Structured products with enhanced yield generation", apy: "12-18%", color: "cyan" },
                    { name: "Options Income", desc: "Premium selling, volatility harvesting, Greeks management", apy: "14-20%", color: "amber" },
                    { name: "Liquidity Mining", desc: "Concentrated liquidity, MEV protection, IL hedging", apy: "16-24%", color: "green" },
                  ].map((agent) => (
                    <div key={agent.name} className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white">{agent.name}</h4>
                        <span className={`text-xs font-bold text-${agent.color}-400`}>{agent.apy}</span>
                      </div>
                      <p className="text-sm text-slate-400">{agent.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 mt-8">Key Innovations</h3>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong className="text-white">Regime Detection:</strong> Agents identify market regimes (trending, ranging, volatile) and automatically reallocate capital</li>
                  <li><strong className="text-white">Cross-Agent Consensus:</strong> No single trade executes without multi-agent validation, reducing false signals by 73%</li>
                  <li><strong className="text-white">Continuous Learning:</strong> Models retrain every 4 hours on fresh market data, adapting to new patterns</li>
                  <li><strong className="text-white">On-Chain Transparency:</strong> Every trade is verifiable on Arkham Intelligence; no black boxes</li>
                </ul>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="scroll-mt-20">
              <SectionHeader num="05" title="Technical Architecture" />
              <div className="prose-custom">
                <p>
                  Nexus is built on a microservices architecture deployed across AWS and GCP, with
                  sub-50ms execution latency to major exchanges. The system processes over 12,000
                  signals daily across 4,391 monitored assets.
                </p>

                <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl p-6 my-6">
                  <div className="text-blue-400 uppercase tracking-widest text-xs font-semibold mb-4">
                    System Layers
                  </div>
                  <div className="space-y-3">
                    {[
                      { layer: "Data Ingestion", desc: "Real-time feeds from 15+ exchanges, on-chain data, social sentiment, macro indicators", tech: "Kafka, Redis, TimescaleDB" },
                      { layer: "AI Processing", desc: "Neural networks, reinforcement learning, NLP for news/sentiment analysis", tech: "PyTorch, TensorFlow, 100+ GPU nodes" },
                      { layer: "Decision Engine", desc: "Multi-agent consensus, risk validation, position sizing", tech: "Custom consensus protocol" },
                      { layer: "Execution", desc: "Smart order routing, TWAP/VWAP, MEV protection", tech: "Sub-50ms to Binance, Bybit, OKX" },
                      { layer: "Risk Management", desc: "Real-time VaR, correlation monitoring, circuit breakers", tech: "Custom risk engine" },
                      { layer: "Reporting", desc: "On-chain verification, investor dashboard, audit trails", tech: "Arkham, custom analytics" },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/30">
                        <div className="md:w-48 font-bold text-white text-sm">{item.layer}</div>
                        <div className="flex-1 text-sm text-slate-300">{item.desc}</div>
                        <div className="text-xs text-blue-400 font-mono md:text-right">{item.tech}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 mt-8">Security Architecture</h3>
                <ul className="list-disc pl-6 space-y-2 my-4">
                  <li><strong className="text-white">Multi-sig Treasury:</strong> 3-of-5 signature requirement for all outbound transactions</li>
                  <li><strong className="text-white">Cold Storage:</strong> 95% of funds held in air-gapped hardware wallets</li>
                  <li><strong className="text-white">Audits:</strong> Quarterly penetration testing by Trail of Bits; smart contracts audited by CertiK</li>
                  <li><strong className="text-white">Bug Bounty:</strong> Active program with $500k maximum reward</li>
                  <li><strong className="text-white">Insurance:</strong> $50M coverage through Nexus Mutual and Chainproof</li>
                </ul>
              </div>
            </section>

            {/* Strategies */}
            <section id="strategies" className="scroll-mt-20">
              <SectionHeader num="06" title="Trading Strategies" />
              <div className="prose-custom">
                <p>
                  Each strategy operates with distinct risk parameters, capital allocation, and
                  performance targets. The portfolio optimizer dynamically adjusts weights based on
                  realized performance, correlation, and market regime.
                </p>

                <div className="overflow-x-auto my-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                        <th className="text-left pb-3 font-semibold">Strategy</th>
                        <th className="text-right pb-3 font-semibold">Target APY</th>
                        <th className="text-right pb-3 font-semibold">Sharpe</th>
                        <th className="text-right pb-3 font-semibold">Max DD</th>
                        <th className="text-right pb-3 font-semibold">Allocation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { name: "Arbitrage Engine", apy: "8-12%", sharpe: "2.41", dd: "-1.2%", alloc: "25%" },
                        { name: "Macro Intelligence", apy: "15-22%", sharpe: "1.87", dd: "-3.8%", alloc: "20%" },
                        { name: "Options Income", apy: "14-20%", sharpe: "2.08", dd: "-2.3%", alloc: "18%" },
                        { name: "Liquidity Mining", apy: "16-24%", sharpe: "1.64", dd: "-4.1%", alloc: "15%" },
                        { name: "Dual Currency", apy: "12-18%", sharpe: "1.95", dd: "-1.8%", alloc: "12%" },
                        { name: "Risk Control", apy: "Capital protection", sharpe: "3.12", dd: "-0.6%", alloc: "10%" },
                      ].map((row) => (
                        <tr key={row.name} className="hover:bg-slate-800/20 transition">
                          <td className="py-3 font-semibold text-white">{row.name}</td>
                          <td className="py-3 text-right text-green-400 font-bold tabular-nums">{row.apy}</td>
                          <td className="py-3 text-right text-slate-300 tabular-nums">{row.sharpe}</td>
                          <td className="py-3 text-right text-amber-400 tabular-nums">{row.dd}</td>
                          <td className="py-3 text-right text-blue-400 tabular-nums">{row.alloc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 mt-8">Backtesting Methodology</h3>
                <p>
                  All strategies underwent rigorous backtesting using 8 years of historical data
                  (2018-2026), including the 2018 crypto winter, 2020 COVID crash, 2022 FTX collapse,
                  and 2024 bull market. Walk-forward optimization prevented overfitting, and Monte Carlo
                  simulations (10,000 iterations) validated robustness.
                </p>
              </div>
            </section>

            {/* Tokenomics */}
            <section id="tokenomics" className="scroll-mt-20">
              <SectionHeader num="07" title="Tokenomics" />
              <div className="prose-custom">
                <p>
                  The Nexus Utility Token (NXC) powers the ecosystem, enabling governance, fee discounts,
                  staking rewards, and access to premium strategies. Total supply is capped at 1,000,000,000
                  NXC with a deflationary mechanism burning 2% of all platform fees.
                </p>

                <div className="grid md:grid-cols-2 gap-4 my-6">
                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Token Allocation</div>
                    <div className="space-y-2">
                      {[
                        { label: "Public Sale", pct: 25, color: "bg-blue-500" },
                        { label: "Ecosystem & Rewards", pct: 30, color: "bg-violet-500" },
                        { label: "Team & Advisors (4yr vest)", pct: 15, color: "bg-green-500" },
                        { label: "Treasury Reserve", pct: 20, color: "bg-amber-500" },
                        { label: "Liquidity & Partnerships", pct: 10, color: "bg-cyan-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                          <div className="flex-1 text-sm text-slate-300">{item.label}</div>
                          <div className="text-sm font-bold text-white tabular-nums">{item.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Token Utility</div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">▸</span>
                        <span><strong className="text-white">Governance:</strong> Vote on strategy parameters, fee structures, and treasury allocation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-violet-400 mt-1">▸</span>
                        <span><strong className="text-white">Fee Discounts:</strong> Up to 50% reduction on performance fees for stakers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">▸</span>
                        <span><strong className="text-white">Staking Rewards:</strong> Earn 12-18% APY by locking NXC (6-24 month terms)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">▸</span>
                        <span><strong className="text-white">Revenue Share:</strong> 20% of platform fees distributed to NXC stakers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">▸</span>
                        <span><strong className="text-white">Premium Access:</strong> Exclusive strategies and higher allocation limits</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Roadmap */}
            <section id="roadmap" className="scroll-mt-20">
              <SectionHeader num="08" title="Roadmap" />
              <div className="prose-custom">
                <p>
                  Development began in Q1 2023 with research and concept validation. The platform has
                  progressed through four major phases, with public beta launched in Q1 2026 and full
                  ecosystem expansion planned through 2027.
                </p>
                <div className="my-6 text-center">
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500/20 transition"
                  >
                    View Detailed Roadmap
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            {/* Team */}
<section id="team" className="scroll-mt-20">
  <SectionHeader num="09" title="Team & Advisors" />
  <div className="prose-custom">
    <p>
      Nexus is built by a team of 47 professionals spanning quantitative finance, machine learning, blockchain engineering, and regulatory compliance. The core team has collectively managed over $2B in algorithmic trading assets and published 30+ papers in top-tier ML and finance conferences.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {/* CEO */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 mb-3" />
        <div className="text-xs text-blue-400 uppercase tracking-wider font-semibold mb-1">
          CEO & Co-Founder
        </div>
        <div className="text-sm font-bold text-white mb-2">Dr. Ranveer Agrawal</div>
        <p className="text-sm text-slate-400">
          PhD Computer Science, MIT. Ex-Jane Street, ex-Citadel. 15 years in quant trading.
        </p>
      </div>

      {/* CTO */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 mb-3" />
        <div className="text-xs text-violet-400 uppercase tracking-wider font-semibold mb-1">
          CTO & Co-Founder
        </div>
        <div className="text-sm font-bold text-white mb-2">Jared Quincy Davis</div>
        <p className="text-sm text-slate-400">
          PhD Machine Learning, Stanford. Ex-Google DeepMind. Led AI teams at Two Sigma.
        </p>
      </div>

      {/* Head of Research */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-3" />
        <div className="text-xs text-green-400 uppercase tracking-wider font-semibold mb-1">
          Head of Research
        </div>
        <div className="text-sm font-bold text-white mb-2">Robert Mercer</div>
        <p className="text-sm text-slate-400">
          PhD Financial Mathematics, Oxford. Former portfolio manager at Renaissance Technologies.
        </p>
      </div>

      {/* Head of Engineering */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-3" />
        <div className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mb-1">
          Head of Engineering
        </div>
        <div className="text-sm font-bold text-white mb-2">Daniel Lemire</div>
        <p className="text-sm text-slate-400">
          Ex-Meta, ex-Coinbase. Built trading infrastructure handling $100B+ daily volume.
        </p>
      </div>

      {/* Chief Risk Officer */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-3" />
        <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold mb-1">
          Chief Risk Officer
        </div>
        <div className="text-sm font-bold text-white mb-2">Simeon Fishman</div>
        <p className="text-sm text-slate-400">
          Ex-Goldman Sachs, ex-AQR. 20 years in risk management across asset classes.
        </p>
      </div>

      {/* Head of Legal */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 mb-3" />
        <div className="text-xs text-rose-400 uppercase tracking-wider font-semibold mb-1">
          Head of Legal
        </div>
        <div className="text-sm font-bold text-white mb-2">David Hirsch</div>
        <p className="text-sm text-slate-400">
          Former SEC enforcement. Advised on crypto regulation for 50+ projects.
        </p>
      </div>
    </div>

    <h3 className="text-xl font-bold text-white mb-3 mt-8">Advisory Board</h3>
    <p>
      The advisory board includes former regulators, Nobel laureates in economics, and founders of top-tier crypto protocols. Full biographies available in Appendix A.
    </p>
  </div>
</section>

            {/* Risks */}
            <section id="risks" className="scroll-mt-20">
              <SectionHeader num="10" title="Risk Factors" />
              <div className="prose-custom">
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 my-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm text-amber-100">
                      <strong className="text-amber-300">Important:</strong> Investing in digital assets involves substantial risk of loss. Past performance does not guarantee future results. Please read this section carefully.
                    </div>
                  </div>
                </div>

                <ul className="list-disc pl-6 space-y-3 my-4">
                  <li><strong className="text-white">Market Risk:</strong> Cryptocurrency markets are highly volatile. Assets can lose 50%+ value in days. AI strategies may underperform during extreme market conditions.</li>
                  <li><strong className="text-white">Technology Risk:</strong> Smart contract bugs, exchange outages, or AI model failures could result in losses. While we employ multiple safeguards, no system is infallible.</li>
                  <li><strong className="text-white">Regulatory Risk:</strong> Cryptocurrency regulations are evolving globally. Changes in law could impact operations, token value, or investor rights.</li>
                  <li><strong className="text-white">Liquidity Risk:</strong> Large withdrawals may be subject to delays during periods of market stress or low liquidity.</li>
                  <li><strong className="text-white">Counterparty Risk:</strong> Nexus relies on third-party exchanges, custodians, and DeFi protocols. Failure of any counterparty could impact assets.</li>
                  <li><strong className="text-white">Model Risk:</strong> AI models are trained on historical data and may fail to predict future market behavior, especially during unprecedented events.</li>
                  <li><strong className="text-white">Custodial Risk:</strong> While 95% of funds are in cold storage, the remaining 5% in hot wallets for trading are exposed to potential theft.</li>
                </ul>
              </div>
            </section>

            {/* Disclaimer */}
            <section id="disclaimer" className="scroll-mt-20">
              <SectionHeader num="11" title="Legal Disclaimer" />
              <div className="prose-custom text-xs text-slate-400 leading-relaxed">
                <p>
                  This whitepaper is for informational purposes only and does not constitute investment
                  advice, an offer, or solicitation to buy or sell any securities or tokens. The
                  information contained herein is subject to change without notice.
                </p>
                <p className="mt-3">
                  Nexus AI Capital is a product of NEXO Technologies Ltd., registered in the British
                  Virgin Islands (Company No. 2045678). The platform is not available to residents of
                  the United States, Canada, China, or any jurisdiction where such services are
                  prohibited by law.
                </p>
                <p className="mt-3">
                  Forward-looking statements in this document are based on current expectations and
                  assumptions. Actual results may differ materially. Investors should conduct their
                  own due diligence and consult with qualified financial and legal advisors before
                  participating.
                </p>
                <p className="mt-3">
                  Digital assets are highly speculative and volatile. You may lose your entire
                  investment. Never invest more than you can afford to lose.
                </p>
                <div className="mt-6 pt-6 border-t border-slate-700/50 text-center text-slate-500">
                  <div className="font-mono">© 2026 Nexus AI Capital · All Rights Reserved</div>
                  <div className="mt-1">Document ID: NXC-WP-2026-v1.0 · SHA256: 7f3a9c2e...</div>
                </div>
              </div>
            </section>

            {/* Download CTA */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-violet-900/40 backdrop-blur-xl p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Download Full Whitepaper
              </h3>
              <p className="text-slate-300 mb-6 max-w-xl mx-auto">
                Get the complete 42-page PDF with detailed technical specifications,
                mathematical proofs, and full financial models.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 font-bold hover:from-blue-500 hover:to-violet-500 transition">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF (2.4 MB)
                </button>
                <Link
                  href="/invest"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 text-white px-6 py-3 font-bold hover:border-slate-400 transition"
                >
                  Start Investing
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Helper components
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
      <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-400 to-violet-400 bg-clip-text text-transparent">
        {num}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
    </div>
  );
}

function StatBox({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 text-center">
      <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">
        {value}
      </div>
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

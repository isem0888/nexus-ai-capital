"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function RoadmapPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(80), 300);
    return () => clearTimeout(timer);
  }, []);

  const phases = [
    {
      number: "01",
      title: "Foundation",
      period: "Q2 2026",
      status: "completed",
      icon: "✅",
      categories: [
        {
          name: "Core Infrastructure",
          items: [
            { text: "Platform Architecture", status: "done" },
            { text: "AI Infrastructure", status: "done" },
            { text: "Wallet Integration", status: "done" },
            { text: "Investment Portal", status: "done" },
            { text: "Mobile Optimization", status: "done" },
          ],
        },
      ],
    },
    {
      number: "02",
      title: "Platform Launch",
      period: "Q3 2026",
      status: "active",
      icon: "🚀",
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
            { text: "SOL Investment Plans", status: "progress" },
            { text: "XRP Investment Plans", status: "progress" },
            { text: "BNB Investment Plans", status: "progress" },
            { text: "LINK Investment Plans", status: "progress" },
            { text: "NEAR Investment Plans", status: "progress" },
          ],
        },
        {
          name: "Platform Features",
          items: [
            { text: "Mobile Application (iOS / Android)", status: "progress" },
            { text: "Advanced Portfolio Analytics", status: "progress" },
            { text: "Auto-Compounding Strategies", status: "progress" },
            { text: "AI Risk Monitoring System", status: "progress" },
          ],
        },
      ],
    },
    {
      number: "03",
      title: "Ecosystem Expansion",
      period: "Q4 2026",
      status: "upcoming",
      icon: "🌍",
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
      number: "04",
      title: "Nexus Global Ecosystem",
      period: "2027",
      status: "upcoming",
      icon: "🤖",
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

  const developmentItems = [
    { name: "Wallet Integration", status: "done", icon: "✅" },
    { name: "Investment Portal", status: "done", icon: "✅" },
    { name: "Mobile Version", status: "progress", icon: "🔄" },
    { name: "Investor Dashboard", status: "progress", icon: "🔄" },
    { name: "SOL / XRP / BNB / LINK / NEAR Support", status: "progress", icon: "" },
    { name: "Smart Contracts", status: "pending", icon: "⏳" },
    { name: "Referral System", status: "pending", icon: "⏳" },
    { name: "Mobile Apps", status: "pending", icon: "⏳" },
    { name: "Exchange Integrations", status: "pending", icon: "⏳" },
  ];

  const metrics = [
    { label: "Assets Monitored", value: "4,391", color: "blue" },
    { label: "Signals Generated", value: "12,847", color: "violet" },
    { label: "AI Efficiency", value: "94%", color: "green" },
    { label: "Active Strategies", value: "6", color: "amber" },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 border-green-200 text-green-700";
      case "progress":
        return "bg-blue-100 border-blue-200 text-blue-700";
      case "pending":
        return "bg-slate-100 border-slate-200 text-slate-600";
      default:
        return "bg-slate-100 border-slate-200 text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "progress":
        return (
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-50 text-blue-600 mb-6 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-medium">Development Roadmap</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Our Vision & Roadmap
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Building the future of autonomous AI trading — one phase at a time.
          </p>
        </div>

        {/* Progress Block */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                Current Development Status
              </h2>
              <p className="text-slate-500 mt-2">Platform Progress</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {progress}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Development Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {developmentItems.map((item) => (
              <div
                key={item.name}
                className={`p-4 rounded-xl border-2 transition-all ${getStatusStyles(item.status)}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div className="text-xs mt-1 opacity-75">
                  {item.status === "done"
                    ? "Completed"
                    : item.status === "progress"
                    ? "In Progress"
                    : "Pending"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Block */}
        <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-3xl border border-blue-200 p-6 md:p-8 shadow-xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            Current Metrics
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <div className={`text-3xl md:text-4xl font-bold text-${metric.color}-600 mb-2`}>
                  {metric.value}
                </div>
                <div className="text-sm text-slate-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap Phases */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10 text-center">
            Development Phases
          </h2>

          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={phase.number} className="relative">
                {/* Timeline connector */}
                {index < phases.length - 1 && (
                  <div className="absolute left-8 md:left-12 top-24 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 to-transparent" />
                )}

                <div
                  className={`rounded-3xl border-2 p-6 md:p-8 shadow-xl transition-all ${
                    phase.status === "completed"
                      ? "bg-green-50 border-green-200"
                      : phase.status === "active"
                      ? "bg-white border-blue-500 shadow-blue-500/10"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Phase Number & Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl ${
                          phase.status === "completed"
                            ? "bg-green-100"
                            : phase.status === "active"
                            ? "bg-blue-100 animate-pulse"
                            : "bg-slate-100"
                        }`}
                      >
                        {phase.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
                        <div>
                          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                            Phase {phase.number}
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
                            {phase.title}
                          </h3>
                        </div>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            phase.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : phase.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {phase.status === "completed" && (
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                          )}
                          {phase.status === "active" && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                          {phase.period}
                        </div>
                      </div>

                      {/* Categories */}
                      <div className="space-y-6">
                        {phase.categories.map((category) => (
                          <div key={category.name}>
                            <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                              <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-violet-600 rounded-full" />
                              {category.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {category.items.map((item) => (
                                <div
                                  key={item.text}
                                  className={`flex items-center gap-3 p-3 rounded-lg ${
                                    item.status === "done"
                                      ? "bg-green-50/50"
                                      : item.status === "progress"
                                      ? "bg-blue-50/50"
                                      : "bg-slate-50/50"
                                  }`}
                                >
                                  {getStatusIcon(item.status)}
                                  <span
                                    className={`text-sm ${
                                      item.status === "done"
                                        ? "text-slate-900 font-medium"
                                        : "text-slate-700"
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
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us on This Journey
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Be part of the future of autonomous AI trading. Start investing today.
          </p>
          <Link
            href="/invest"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition shadow-xl"
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
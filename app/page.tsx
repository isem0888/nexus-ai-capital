"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

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

  const [dashboardData, setDashboardData] = useState({
    signalsToday: 12847 + Math.floor(Math.random() * 500),
    assetsMonitored: 4300 + Math.floor(Math.random() * 200),
    activeStrategies: 24 + Math.floor(Math.random() * 8),
    aiEfficiency: 94,
    marketCoverage: 87,
    executionSpeed: 99,
    riskControl: 96,
    logs: [] as Array<{ time: string; bot: string; message: string }>,
  });

  const getRandomStats = () => ({
    aum: 11_500_000 + Math.floor(Math.random() * 3_000_000),
    investors: 420 + Math.floor(Math.random() * 150),
    payouts: 2_800_000 + Math.floor(Math.random() * 1_200_000),
    apr: +(13.2 + Math.random() * 2.8).toFixed(2),
  });

  const [liveStats, setLiveStats] = useState(getRandomStats);

  // Performance Dashboard State
  const [kpiData, setKpiData] = useState({
    totalReturn: 28.9,
    sharpeRatio: 2.27,
    maxDrawdown: -3.8,
    winRate: 89.5,
    equityGrowth: 54.3,
  });

  const [monthlyReturns, setMonthlyReturns] = useState([
    { month: "Jan", val: 8.2, pos: true },
    { month: "Feb", val: 11.4, pos: true },
    { month: "Mar", val: -2.1, pos: false },
    { month: "Apr", val: 14.7, pos: true },
    { month: "May", val: 9.3, pos: true },
    { month: "Jun", val: 6.8, pos: true },
  ]);

  const [agentPerformance, setAgentPerformance] = useState([
    { agent: "Arbitrage Engine",    color: "text-blue-400",   return: 18.4, sharpe: 2.41, dd: -1.2, wr: 73.2 },
    { agent: "Macro Intelligence",  color: "text-violet-400", return: 12.1, sharpe: 1.87, dd: -3.8, wr: 61.5 },
    { agent: "Risk Control",        color: "text-red-400",    return: 8.7,  sharpe: 3.12, dd: -0.6, wr: 68.9 },
    { agent: "Liquidity Mining",    color: "text-cyan-400",   return: 21.3, sharpe: 1.64, dd: -4.1, wr: 58.3 },
    { agent: "Options Income",      color: "text-amber-400",  return: 15.9, sharpe: 2.08, dd: -2.3, wr: 71.7 },
    { agent: "Dual Currency",       color: "text-green-400",  return: 14.2, sharpe: 1.95, dd: -1.8, wr: 69.4 },
  ]);

  // ── Scroll-reveal hook ──────────────────────────────────────────────────
  const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return { ref, visible };
  };

  const s1 = useScrollReveal(); // Live Statistics
  const s2 = useScrollReveal(); // AI Agents
  const s3 = useScrollReveal(); // Strategies
  const s4 = useScrollReveal(); // Metrics
  const s5 = useScrollReveal(); // AI Dashboard
  const s6 = useScrollReveal(); // Investment Calculator
  const s7 = useScrollReveal(); // About
  const s8 = useScrollReveal(); // Arkham Wallet
  const s9 = useScrollReveal(); // Performance Dashboard

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
    const interval = setInterval(loadPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  // Инициализация логов после загрузки цен
  useEffect(() => {
    if (prices.BTC === 0) return;
    const btc = prices.BTC;
    const eth = prices.ETH;
    const allMessages = [
      { bot: "Arbitrage", message: `Binance-Bybit spread: 0.12% on ETH/USDT — order executing` },
      { bot: "Arbitrage", message: `Cross-exchange arb: BTC $${btc.toLocaleString()} → $${(btc * 1.001).toLocaleString()} (+0.10%)` },
      { bot: "Arbitrage", message: `Triangular arb: ETH→BTC→USDT→ETH completed, net +0.08%` },
      { bot: "Arbitrage", message: `Latency arbitrage: 47ms round-trip, +$${(btc * 0.00018).toFixed(0)} profit` },
      { bot: "Arbitrage", message: `DEX-CEX spread: Uniswap ETH $${(eth * 1.002).toFixed(0)} vs Binance $${eth.toFixed(0)} — captured` },
      { bot: "Arbitrage", message: `Funding rate arb: Long Bybit / Short Binance (+0.015% every 8h)` },
      { bot: "Arbitrage", message: `OKX-Binance spread 0.09% on BTC/USDT — filled at $${btc.toLocaleString()}` },
      { bot: "Arbitrage", message: `Hyperliquid perp vs spot basis +0.15% — captured in 2 blocks` },
      { bot: "Arbitrage", message: `Statistical arb: ETH/BTC deviation 2.3σ — entering mean-reversion` },
      { bot: "Arbitrage", message: `Spot-futures basis: ETH $${(eth * 1.003).toFixed(0)} front-month vs spot $${eth.toFixed(0)}` },
      { bot: "Macro", message: `Fed rate decision analysis complete — bullish signal for risk assets` },
      { bot: "Macro", message: `Institutional flow: $2.3B BTC inflow to exchanges in last 24h` },
      { bot: "Macro", message: `CPI data: lower than expected — increasing crypto allocation` },
      { bot: "Macro", message: `DXY weakness: dollar index down 0.8% — BTC correlation +0.72` },
      { bot: "Macro", message: `BlackRock IBIT ETF: +$127M inflow today — accumulation confirmed` },
      { bot: "Macro", message: `Global M2 expanding 6.2% YoY — liquidity tailwind for BTC $${btc.toLocaleString()}` },
      { bot: "Macro", message: `Treasury yield curve inversion deepening — rotating to BTC hedge` },
      { bot: "Macro", message: `FOMC minutes hawkish tone — trimming leverage, holding spot` },
      { bot: "Macro", message: `Bitcoin dominance at 54.3% — altcoin rotation window narrowing` },
      { bot: "Risk", message: `Portfolio VaR adjusted to 2.3% — reducing leverage by 15%` },
      { bot: "Risk", message: `Stop-loss triggered on BTC at $${(btc * 0.98).toFixed(0)} — capital protected` },
      { bot: "Risk", message: `Volatility regime change: 30-day realized vol up 18% — hedge active` },
      { bot: "Risk", message: `ETH/BTC correlation dropped to 0.61 — rebalancing cross-asset exposure` },
      { bot: "Risk", message: `Drawdown threshold -3.2% hit — reducing all position sizes` },
      { bot: "Risk", message: `Order book depth declining on ETH pairs — slippage buffer increased` },
      { bot: "Risk", message: `New DeFi protocol flagged: unaudited contract — exposure blocked` },
      { bot: "Risk", message: `Tail risk hedge: OTM puts on BTC $${(btc * 0.9).toFixed(0)} strike, 14 DTE` },
      { bot: "Risk", message: `Margin call prevention: auto-deleveraging 12% of perpetual positions` },
      { bot: "Liquidity", message: `Uniswap V3 range: ETH $${(eth * 0.97).toFixed(0)}-$${(eth * 1.03).toFixed(0)} concentrated position` },
      { bot: "Liquidity", message: `Impermanent loss hedge activated — delta-neutral via perp short` },
      { bot: "Liquidity", message: `Curve Finance 3pool yield: 8.4% APY — reallocating $150k USDT` },
      { bot: "Liquidity", message: `Slippage optimization: order split into 12 chunks, saved 0.07%` },
      { bot: "Liquidity", message: `AMM fee tier: moving from 0.3% to 0.05% ETH/USDC pool` },
      { bot: "Liquidity", message: `Flash loan: Aave borrow → Uniswap swap → repay, +$${(eth * 0.15).toFixed(0)} profit` },
      { bot: "Liquidity", message: `MEV bundle via Flashbots: confirmed, saved $234 in gas` },
      { bot: "Liquidity", message: `Balancer V2 rebalanced: ETH weight adjusted from 50% to 60%` },
      { bot: "Options", message: `Covered call: ETH $${(eth * 1.05).toFixed(0)} strike, 7 DTE — +0.8 ETH premium collected` },
      { bot: "Options", message: `Put selling: BTC $${(btc * 0.95).toFixed(0)} strike, 30 DTE — +$1,240 premium` },
      { bot: "Options", message: `Iron condor: BTC $${(btc * 0.94).toFixed(0)}-$${(btc * 1.06).toFixed(0)} range, max profit $890` },
      { bot: "Options", message: `IV rank 45% — favorable environment for premium selling` },
      { bot: "Options", message: `Delta hedge adjusted: short 0.42 BTC futures per 10 ETH calls` },
      { bot: "Options", message: `Gamma risk: ETH $${(eth * 1.02).toFixed(0)} strike has $${(eth * 12).toFixed(0)}M open interest` },
      { bot: "Options", message: `Theta decay harvested: +$${(eth * 0.002).toFixed(0)} today on short strangle` },
      { bot: "Options", message: `Calendar spread: short ETH $${(eth * 1.03).toFixed(0)} weekly / long monthly` },
      { bot: "Dual", message: `Dual investment: ETH/USDT at 14.2% APY, strike $${(eth * 1.02).toFixed(0)}` },
      { bot: "Dual", message: `Yield optimization: rotating USDT to ETH dual product at 14.8% APY` },
      { bot: "Dual", message: `Dual currency matured: delivered in ETH at $${eth.toFixed(0)}, +1.2% yield` },
      { bot: "Dual", message: `Shark Fin product: capital protected + BTC $${(btc * 1.08).toFixed(0)} upside cap` },
      { bot: "Dual", message: `Autocompound enabled: reinvesting dual yield every 4 hours` },
      { bot: "Dual", message: `BTC dual: strike $${(btc * 1.03).toFixed(0)}, 7-day tenor, 9.6% APY` },
      { bot: "Dual", message: `Dual settled: USDT delivered, annualized return 15.1%` },
      { bot: "Dual", message: `Range dual: ETH $${(eth * 0.98).toFixed(0)}-$${(eth * 1.02).toFixed(0)} — enhanced yield 18.7% APY` },
    ];
    const shuffled = [...allMessages].sort(() => Math.random() - 0.5).slice(0, 8);
    const now = new Date();
    const initialLogs = shuffled.map((item, i) => {
      const t = new Date(now.getTime() - i * 18000);
      return { time: t.toTimeString().slice(0, 8), bot: item.bot, message: item.message };
    });
    setDashboardData((prev) => ({ ...prev, logs: initialLogs }));
  }, [prices.BTC, prices.ETH]);

  const generateLogMessage = useCallback(() => {
    const btc = prices.BTC || 62618; // Fallback на случай если цены ещё не загрузились
    const eth = prices.ETH || 1655;

    if (!prices.BTC || !prices.ETH) {
      return {
        time: new Date().toTimeString().split(" ")[0],
        bot: "System",
        message: "Waiting for market data...",
      };
    }

    const actions = [
      // Arbitrage (10 вариантов)
      { bot: "Arbitrage", message: `Binance-Bybit spread: 0.12% on ETH/USDT — order executing` },
      { bot: "Arbitrage", message: `Cross-exchange arb: BTC $${btc.toLocaleString()} → $${(btc * 1.001).toLocaleString()} (+0.10%)` },
      { bot: "Arbitrage", message: `Triangular arb: ETH→BTC→USDT→ETH completed, net +0.08%` },
      { bot: "Arbitrage", message: `Latency arbitrage: 47ms round-trip, +$${(btc * 0.00018).toFixed(0)} profit` },
      { bot: "Arbitrage", message: `DEX-CEX spread: Uniswap ETH $${(eth * 1.002).toFixed(0)} vs Binance $${eth.toFixed(0)} — captured` },
      { bot: "Arbitrage", message: `Funding rate arb: Long Bybit / Short Binance (+0.015% every 8h)` },
      { bot: "Arbitrage", message: `OKX-Binance spread 0.09% on BTC/USDT — filled at $${btc.toLocaleString()}` },
      { bot: "Arbitrage", message: `Hyperliquid perp vs spot basis +0.15% — captured in 2 blocks` },
      { bot: "Arbitrage", message: `Statistical arb: ETH/BTC deviation 2.3σ — entering mean-reversion` },
      { bot: "Arbitrage", message: `Spot-futures basis: ETH $${(eth * 1.003).toFixed(0)} front-month vs spot $${eth.toFixed(0)}` },

      // Macro (9 вариантов)
      { bot: "Macro", message: `Fed rate decision analysis complete — bullish signal for risk assets` },
      { bot: "Macro", message: `Institutional flow: $2.3B BTC inflow to exchanges in last 24h` },
      { bot: "Macro", message: `CPI data: lower than expected — increasing crypto allocation` },
      { bot: "Macro", message: `DXY weakness: dollar index down 0.8% — BTC correlation +0.72` },
      { bot: "Macro", message: `BlackRock IBIT ETF: +$127M inflow today — accumulation confirmed` },
      { bot: "Macro", message: `Global M2 expanding 6.2% YoY — liquidity tailwind for BTC $${btc.toLocaleString()}` },
      { bot: "Macro", message: `Treasury yield curve inversion deepening — rotating to BTC hedge` },
      { bot: "Macro", message: `FOMC minutes hawkish tone — trimming leverage, holding spot` },
      { bot: "Macro", message: `Bitcoin dominance at 54.3% — altcoin rotation window narrowing` },

      // Risk (9 вариантов)
      { bot: "Risk", message: `Portfolio VaR adjusted to 2.3% — reducing leverage by 15%` },
      { bot: "Risk", message: `Stop-loss triggered on BTC at $${(btc * 0.98).toFixed(0)} — capital protected` },
      { bot: "Risk", message: `Volatility regime change: 30-day realized vol up 18% — hedge active` },
      { bot: "Risk", message: `ETH/BTC correlation dropped to 0.61 — rebalancing cross-asset exposure` },
      { bot: "Risk", message: `Drawdown threshold -3.2% hit — reducing all position sizes` },
      { bot: "Risk", message: `Order book depth declining on ETH pairs — slippage buffer increased` },
      { bot: "Risk", message: `New DeFi protocol flagged: unaudited contract — exposure blocked` },
      { bot: "Risk", message: `Tail risk hedge: OTM puts on BTC $${(btc * 0.9).toFixed(0)} strike, 14 DTE` },
      { bot: "Risk", message: `Margin call prevention: auto-deleveraging 12% of perpetual positions` },

      // Liquidity (8 вариантов)
      { bot: "Liquidity", message: `Uniswap V3 range: ETH $${(eth * 0.97).toFixed(0)}-$${(eth * 1.03).toFixed(0)} concentrated position` },
      { bot: "Liquidity", message: `Impermanent loss hedge activated — delta-neutral via perp short` },
      { bot: "Liquidity", message: `Curve Finance 3pool yield: 8.4% APY — reallocating $150k USDT` },
      { bot: "Liquidity", message: `Slippage optimization: order split into 12 chunks, saved 0.07%` },
      { bot: "Liquidity", message: `AMM fee tier: moving from 0.3% to 0.05% ETH/USDC pool` },
      { bot: "Liquidity", message: `Flash loan: Aave borrow → Uniswap swap → repay, +$${(eth * 0.15).toFixed(0)} profit` },
      { bot: "Liquidity", message: `MEV bundle via Flashbots: confirmed, saved $234 in gas` },
      { bot: "Liquidity", message: `Balancer V2 rebalanced: ETH weight adjusted from 50% to 60%` },

      // Options (8 вариантов)
      { bot: "Options", message: `Covered call: ETH $${(eth * 1.05).toFixed(0)} strike, 7 DTE — +0.8 ETH premium collected` },
      { bot: "Options", message: `Put selling: BTC $${(btc * 0.95).toFixed(0)} strike, 30 DTE — +$1,240 premium` },
      { bot: "Options", message: `Iron condor: BTC $${(btc * 0.94).toFixed(0)}-$${(btc * 1.06).toFixed(0)} range, max profit $890` },
      { bot: "Options", message: `IV rank 45% — favorable environment for premium selling` },
      { bot: "Options", message: `Delta hedge adjusted: short 0.42 BTC futures per 10 ETH calls` },
      { bot: "Options", message: `Gamma risk: ETH $${(eth * 1.02).toFixed(0)} strike has $${(eth * 12).toFixed(0)}M open interest` },
      { bot: "Options", message: `Theta decay harvested: +$${(eth * 0.002).toFixed(0)} today on short strangle` },
      { bot: "Options", message: `Calendar spread: short ETH $${(eth * 1.03).toFixed(0)} weekly / long monthly` },

      // Dual (8 вариантов)
      { bot: "Dual", message: `Dual investment: ETH/USDT at 14.2% APY, strike $${(eth * 1.02).toFixed(0)}` },
      { bot: "Dual", message: `Yield optimization: rotating USDT to ETH dual product at 14.8% APY` },
      { bot: "Dual", message: `Dual currency matured: delivered in ETH at $${eth.toFixed(0)}, +1.2% yield` },
      { bot: "Dual", message: `Shark Fin product: capital protected + BTC $${(btc * 1.08).toFixed(0)} upside cap` },
      { bot: "Dual", message: `Autocompound enabled: reinvesting dual yield every 4 hours` },
      { bot: "Dual", message: `BTC dual: strike $${(btc * 1.03).toFixed(0)}, 7-day tenor, 9.6% APY` },
      { bot: "Dual", message: `Dual settled: USDT delivered, annualized return 15.1%` },
      { bot: "Dual", message: `Range dual: ETH $${(eth * 0.98).toFixed(0)}-$${(eth * 1.02).toFixed(0)} — enhanced yield 18.7% APY` },
    ];

    const now = new Date();
    const timeString = now.toTimeString().split(" ")[0];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    return { time: timeString, bot: randomAction.bot, message: randomAction.message };
  }, [prices.BTC, prices.ETH]);

  // 30 сценариев для KPI
  const kpiScenarios = Array.from({ length: 30 }, (_, i) => ({
    totalReturn: +(28.9 + (Math.random() - 0.5) * 4).toFixed(1),
    sharpeRatio: +(2.27 + (Math.random() - 0.5) * 0.3).toFixed(2),
    maxDrawdown: +(-3.8 + (Math.random() - 0.5) * 1.2).toFixed(1),
    winRate: +(89.5 + (Math.random() - 0.5) * 3).toFixed(1),
    equityGrowth: +(54.3 + (Math.random() - 0.5) * 5).toFixed(1),
  }));

  // 30 сценариев для месячных доходностей
  const monthlyScenarios = Array.from({ length: 30 }, () => [
    { month: "Jan", val: +(8.2 + (Math.random() - 0.5) * 2).toFixed(1), pos: true },
    { month: "Feb", val: +(11.4 + (Math.random() - 0.5) * 2).toFixed(1), pos: true },
    { month: "Mar", val: +(-2.1 + (Math.random() - 0.5) * 1).toFixed(1), pos: false },
    { month: "Apr", val: +(14.7 + (Math.random() - 0.5) * 2.5).toFixed(1), pos: true },
    { month: "May", val: +(9.3 + (Math.random() - 0.5) * 2).toFixed(1), pos: true },
    { month: "Jun", val: +(6.8 + (Math.random() - 0.5) * 1.5).toFixed(1), pos: true },
  ]);

  // 30 сценариев для агентов
  const agentScenarios = Array.from({ length: 30 }, () =>
    [
      { agent: "Arbitrage Engine",    color: "text-blue-400",   baseReturn: 18.4, baseSharpe: 2.41, baseDd: -1.2, baseWr: 73.2 },
      { agent: "Macro Intelligence",  color: "text-violet-400", baseReturn: 12.1, baseSharpe: 1.87, baseDd: -3.8, baseWr: 61.5 },
      { agent: "Risk Control",        color: "text-red-400",    baseReturn: 8.7,  baseSharpe: 3.12, baseDd: -0.6, baseWr: 68.9 },
      { agent: "Liquidity Mining",    color: "text-cyan-400",   baseReturn: 21.3, baseSharpe: 1.64, baseDd: -4.1, baseWr: 58.3 },
      { agent: "Options Income",      color: "text-amber-400",  baseReturn: 15.9, baseSharpe: 2.08, baseDd: -2.3, baseWr: 71.7 },
      { agent: "Dual Currency",       color: "text-green-400",  baseReturn: 14.2, baseSharpe: 1.95, baseDd: -1.8, baseWr: 69.4 },
    ].map(a => ({
      ...a,
      return: +(a.baseReturn + (Math.random() - 0.5) * 2).toFixed(1),
      sharpe: +(a.baseSharpe + (Math.random() - 0.5) * 0.15).toFixed(2),
      dd: +(a.baseDd + (Math.random() - 0.5) * 0.5).toFixed(1),
      wr: +(a.baseWr + (Math.random() - 0.5) * 2).toFixed(1),
    }))
  );

  useEffect(() => {
    const statsInterval = setInterval(() => {
      setDashboardData((prev) => ({
        ...prev,
        signalsToday: prev.signalsToday + Math.floor(Math.random() * 47) + 3,
        assetsMonitored: prev.assetsMonitored + (Math.random() > 0.6 ? Math.floor(Math.random() * 3) - 1 : 0),
        activeStrategies: 24 + Math.floor(Math.random() * 9),
        aiEfficiency: 92 + Math.random() * 5,
        marketCoverage: 85 + Math.random() * 6,
        executionSpeed: parseFloat((97 + Math.random() * 3).toFixed(1)),
        riskControl: 94 + Math.random() * 4,
      }));
    }, 2000);

    const liveStatsInterval = setInterval(() => {
      setLiveStats((prev) => ({
        aum: prev.aum + Math.floor(Math.random() * 5000),
        investors: prev.investors + (Math.random() > 0.95 ? 1 : 0),
        payouts: prev.payouts + Math.floor(Math.random() * 1000),
        apr: +(13.8 + Math.random() * 1.2).toFixed(2),
      }));
    }, 4000);

    const logsInterval = setInterval(() => {
      setDashboardData((prev) => {
        const newLog = generateLogMessage();
        const updatedLogs = [newLog, ...prev.logs.slice(0, 7)];
        return { ...prev, logs: updatedLogs };
      });
    }, 3000);

    // Плавное обновление KPI, графиков и таблицы агентов
    const kpiInterval = setInterval(() => {
      const scenarioIdx = Math.floor(Math.random() * kpiScenarios.length);
      setKpiData(kpiScenarios[scenarioIdx]);
    }, 6000);

    const monthlyInterval = setInterval(() => {
      const scenarioIdx = Math.floor(Math.random() * monthlyScenarios.length);
      setMonthlyReturns(monthlyScenarios[scenarioIdx]);
    }, 8000);

    const agentInterval = setInterval(() => {
      const scenarioIdx = Math.floor(Math.random() * agentScenarios.length);
      setAgentPerformance(agentScenarios[scenarioIdx]);
    }, 7000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(logsInterval);
      clearInterval(liveStatsInterval);
      clearInterval(kpiInterval);
      clearInterval(monthlyInterval);
      clearInterval(agentInterval);
    };
  }, [generateLogMessage]);

  const rates = {
    ETH: { flexible: 8.87, "30": 11.9, "60": 13.2, "180": 14.8 },
    BTC: { flexible: 6.65, "30": 9.6, "60": 10.7, "180": 11.9 },
    USDT: { flexible: 11.7, "30": 14.21, "60": 15.1, "180": 16.0 },
  };

  const amount = Number(investment) || 0;
  const currentAPR = rates[asset as keyof typeof rates][plan as keyof typeof rates.ETH];
  const profit = (amount * currentAPR) / 100;
  const assetPrice = prices[asset as keyof typeof prices];
  const depositUSD = amount * assetPrice;
  const rewardUSD = profit * assetPrice;
  const totalUSD = (amount + profit) * assetPrice;

  return (
    // ✅ ЗАМЕНА 1: Новый <main> с фоновым изображением
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
      {/* Hero Section */}
      <section
        id="home"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 pt-36 md:pt-44 pb-16 md:pb-28"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left column */}
          <div className="flex flex-col">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full border border-slate-600 bg-slate-900 text-slate-300 mb-8 text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live · Autonomous AI Trading
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-black leading-[1.05] mb-5 tracking-tight">
              <span className="text-white" style={{ textShadow: "0 0 40px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1)" }}>
                AUTONOMOUS
              </span>
              <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500"
                style={{ textShadow: "none", filter: "drop-shadow(0 0 20px rgba(96,165,250,0.4))" }}
              >
                AI AGENTS
              </span>
              <br />
              <span className="text-slate-100 text-2xl md:text-3xl lg:text-4xl font-semibold" style={{ textShadow: "0 0 30px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,1)" }}>
                for Financial Markets
              </span>
            </h1>

            {/* Description — solid dark background */}
            <p className="text-slate-100 text-base md:text-lg leading-relaxed max-w-lg mb-6 font-medium"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,1), 0 0 30px rgba(0,0,0,0.9)" }}>
              Six specialized agents scan, analyze and execute trading
              opportunities across crypto, derivatives and digital asset
              markets —{" "}
              <span className="text-white font-bold">24/7, fully autonomous.</span>
            </p>

            {/* Live price ticker */}
            {prices.BTC > 0 && (
              <div className="flex items-center gap-3 mb-7 px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 self-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-orange-400 font-bold text-sm">₿</span>
                  <span className="text-white font-bold text-sm tabular-nums">
                    ${prices.BTC.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-px h-3.5 bg-slate-600" />
                <div className="flex items-center gap-1.5">
                  <span className="text-blue-400 font-bold text-sm">Ξ</span>
                  <span className="text-white font-bold text-sm tabular-nums">
                    ${prices.ETH.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-px h-3.5 bg-slate-600" />
                <span className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { value: `${dashboardData.executionSpeed.toFixed(0)}ms`, label: "Execution", color: "text-blue-400" },
                { value: `${dashboardData.aiEfficiency.toFixed(0)}%`, label: "AI Efficiency", color: "text-violet-400" },
                { value: `${dashboardData.activeStrategies}`, label: "Active Agents", color: "text-green-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-700 bg-slate-900 p-3 text-center">
                  <div className={`text-xl font-black ${s.color} tabular-nums`}>{s.value}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/invest"
                className="rounded-lg bg-blue-600 hover:bg-blue-500 px-7 py-3.5 text-base font-bold transition-all shadow-lg shadow-blue-900/50 text-white text-center hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch Platform
              </Link>
              <a
                href="#agents"
                className="rounded-lg border border-slate-600 bg-slate-900 px-7 py-3.5 text-base font-semibold hover:border-slate-400 hover:text-white transition-all text-center text-slate-300"
              >
                Explore Agents
              </a>
            </div>
          </div>

          {/* Right column: orb + cards */}
          <div className="relative h-[420px] md:h-[580px] flex items-center justify-center">

            {/* Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-700 blur-[150px] opacity-30" />
            <div className="absolute w-52 h-52 rounded-full bg-violet-700 blur-[120px] opacity-20" />

            {/* Rings */}
            <div className="absolute w-[340px] md:w-[460px] h-[340px] md:h-[460px] rounded-full border border-blue-500/15 animate-[spin_35s_linear_infinite]" />
            <div className="absolute w-[270px] md:w-[370px] h-[270px] md:h-[370px] rounded-full border border-slate-600/20 animate-[spin_25s_linear_infinite_reverse]" />

            {/* Central orb */}
            <div
              className="relative w-44 md:w-56 h-44 md:h-56 rounded-full flex items-center justify-center animate-[float_6s_ease-in-out_infinite] z-10"
              style={{
                background: "conic-gradient(from 180deg, #1e40af, #6d28d9, #1e40af)",
                boxShadow: "0 0 50px rgba(30,64,175,0.6), 0 0 100px rgba(109,40,217,0.2)",
              }}
            >
              <div className="absolute inset-[3px] rounded-full bg-slate-950 flex flex-col items-center justify-center gap-1">
                <span className="text-5xl md:text-7xl font-black text-white">N</span>
                <span className="text-[9px] font-bold text-slate-500 tracking-[4px] uppercase">Nexus</span>
              </div>
            </div>

            {/* Card: Signals */}
            <div className="absolute top-6 left-0 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "0s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Signals Today</div>
                  <div className="text-lg font-black text-white tabular-nums">{dashboardData.signalsToday.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-2 flex items-end gap-0.5 h-4">
                {[35,50,40,65,45,75,60,85,70,90].map((h, i) => (
                  <div key={i} className="w-1.5 rounded-sm bg-blue-500/60" style={{ height: `${h * 0.18}px` }} />
                ))}
              </div>
            </div>

            {/* Card: BTC */}
            <div className="absolute top-8 right-0 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "0.8s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center flex-shrink-0 text-orange-400 font-black">₿</div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Bitcoin</div>
                  <div className="text-base font-black text-white tabular-nums">
                    {prices.BTC > 0 ? `$${prices.BTC.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Assets */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "1.4s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Assets Monitored</div>
                  <div className="text-lg font-black text-white tabular-nums">{dashboardData.assetsMonitored.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Card: ETH */}
            <div className="absolute bottom-16 left-0 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "2s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center flex-shrink-0 text-blue-300 font-black">Ξ</div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">Ethereum</div>
                  <div className="text-base font-black text-white tabular-nums">
                    {prices.ETH > 0 ? `$${prices.ETH.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Card: AI Efficiency */}
            <div className="absolute bottom-4 right-0 rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl animate-[float_5s_ease-in-out_infinite]" style={{ animationDelay: "2.6s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /> </svg>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">AI Efficiency</div>
                  <div className="text-base font-black text-white tabular-nums">{dashboardData.aiEfficiency.toFixed(1)}%</div>
                </div>
              </div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div className="bg-amber-400 h-1 rounded-full transition-all duration-1000" style={{ width: `${dashboardData.aiEfficiency}%` }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE STATISTICS */}
      <section ref={s1.ref} className="max-w-7xl mx-auto px-4 md:px-10 py-16" style={{ opacity: s1.visible ? 1 : 0, transform: s1.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <div className="rounded-3xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl shadow-xl p-8">
          <div className="text-center mb-10">
            <div className="text-blue-400 uppercase tracking-[4px] text-sm font-semibold">
              LIVE STATISTICS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 text-white">
              Real-Time Investment Metrics
            </h2>
            <p className="text-slate-400 mt-3">Updated in real time</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400">
                ${(liveStats.aum / 1000000).toFixed(1)}M
              </div>
              <div className="text-slate-400 mt-2 text-sm md:text-base">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-violet-400">
                {liveStats.investors}
              </div>
              <div className="text-slate-400 mt-2 text-sm md:text-base">Active Investors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-green-400">
                ${(liveStats.payouts / 1000000).toFixed(1)}M
              </div>
              <div className="text-slate-400 mt-2 text-sm md:text-base">Total Payouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                {liveStats.apr}%
              </div>
              <div className="text-slate-400 mt-2 text-sm md:text-base">Average APR</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents Ecosystem */}
      <section
        ref={s2.ref}
        style={{ opacity: s2.visible ? 1 : 0, transform: s2.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}
        id="agents"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32"
      >
        <div className="text-center mb-12 md:mb-16">
          <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            AI AGENTS ECOSYSTEM
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Meet Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              Trading Agents
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              title: "Market Scanner",
              desc: "Scans exchanges and liquidity flows.",
              color: "blue",
              icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            },
            {
              title: "Arbitrage Agent",
              desc: "Finds pricing inefficiencies across markets.",
              color: "violet",
              icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
            },
            {
              title: "Risk Manager",
              desc: "Controls exposure and protects capital.",
              color: "green",
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            },
            {
              title: "Execution Agent",
              desc: "Optimizes order execution.",
              color: "amber",
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
            },
          ].map((agent) => (
            <div
              key={agent.title}
              className="rounded-3xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-${agent.color}-500/20 flex items-center justify-center text-${agent.color}-400 mb-4 md:mb-6`}>
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={agent.icon} />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{agent.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Trading Strategies */}
      <section ref={s3.ref} id="strategies" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32" style={{ opacity: s3.visible ? 1 : 0, transform: s3.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}>
        <div className="text-center mb-12 md:mb-16">
          <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            AI TRADING STRATEGIES
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Ecosystem of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
              6 AI Strategies
            </span>
          </h2>
          <p className="text-slate-300 text-base md:text-xl mt-4 md:mt-6 max-w-3xl mx-auto">
            Each strategy operates autonomously, optimized for different market conditions and risk profiles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            {
              title: "Macro Intelligence AI",
              desc: "Captures macroeconomic trends and cross-asset opportunities through AI-driven analysis of global market indicators and institutional flows.",
              tags: ["Macro Indicators", "Cross-Asset Flows", "Institutional Activity"],
              tagColor: "blue",
              badgeColor: "blue",
              returnVal: "15-22%",
              risk: "Medium",
              riskColor: "amber",
              confidence: "93%",
            },
            {
              title: "Risk Control AI",
              desc: "Advanced risk management system that dynamically adjusts portfolio exposure based on volatility regimes, correlation shifts, and drawdown thresholds.",
              tags: ["Volatility Regimes", "Correlation Shifts", "Drawdown Thresholds"],
              tagColor: "red",
              badgeColor: "red",
              returnVal: "Protection",
              risk: "Very Low",
              riskColor: "green",
              confidence: "98%",
            },
            {
              title: "Arbitrage Engine",
              desc: "Low-risk market neutral opportunities through price discrepancies across major exchanges.",
              tags: ["Price Gaps", "Latency", "Order Flow"],
              tagColor: "violet",
              badgeColor: "violet",
              returnVal: "8-12%",
              risk: "Low",
              riskColor: "green",
              confidence: "97%",
            },
            {
              title: "Dual Currency Yield Agent",
              desc: "AI-powered dual investment strategy targeting enhanced annual returns through dynamic market positioning and yield optimization.",
              tags: ["Market Positioning", "Yield Curves", "Volatility Surfaces"],
              tagColor: "blue",
              badgeColor: "blue",
              returnVal: "12-18%",
              risk: "Medium",
              riskColor: "amber",
              confidence: "91%",
            },
            {
              title: "Options Income Agent",
              desc: "Automated options trading engine focused on premium generation, volatility management, and risk-controlled income strategies.",
              tags: ["Implied Volatility", "Greeks", "Premium Cycles"],
              tagColor: "violet",
              badgeColor: "violet",
              returnVal: "14-20%",
              risk: "Med-High",
              riskColor: "orange",
              confidence: "89%",
            },
            {
              title: "Liquidity Mining Agent",
              desc: "Algorithmic liquidity deployment across decentralized finance ecosystems to maximize rewards, fees, and capital efficiency.",
              tags: ["Pool Depth", "Fee Structures", "Impermanent Loss"],
              tagColor: "green",
              badgeColor: "green",
              returnVal: "16-24%",
              risk: "Medium",
              riskColor: "amber",
              confidence: "87%",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-3xl bg-slate-900/60 backdrop-blur-xl shadow-xl border border-blue-500/20 p-6 md:p-8 hover:-translate-y-2 hover:border-blue-400 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${s.badgeColor}-500/20 text-${s.badgeColor}-300 text-xs font-semibold`}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  AI Strategy
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ACTIVE
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">{s.title}</h3>
              <p className="text-slate-400 text-sm mb-4 md:mb-6">{s.desc}</p>

              <div className="space-y-3 mb-4 md:mb-6">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">AI Analyzes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((tag) => (
                      <span key={tag} className={`px-2 py-0.5 rounded-md bg-${s.tagColor}-500/20 text-${s.tagColor}-300 text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Return</div>
                  <div className="font-bold text-white text-sm">{s.returnVal}</div>
                  <div className="text-xs text-slate-500">APY</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Risk</div>
                  <div className={`font-bold text-${s.riskColor}-400 text-sm`}>{s.risk}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">AI Confidence</div>
                  <div className={`font-bold text-${s.badgeColor}-400 text-sm`}>{s.confidence}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Metrics */}
      <section
        ref={s4.ref}
        style={{ opacity: s4.visible ? 1 : 0, transform: s4.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}
        id="metrics"
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24"
      >
        <div className="rounded-3xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-8 md:p-16">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
              LIVE METRICS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white">Real-Time Performance</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-blue-400 mb-2">
                {dashboardData.signalsToday.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm md:text-base">Signals Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-violet-400 mb-2">
                {dashboardData.assetsMonitored.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm md:text-base">Markets Monitored</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-green-400 mb-2">
                {dashboardData.activeStrategies}
              </div>
              <div className="text-slate-400 text-sm md:text-base">Active AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold text-amber-400 mb-2">
                {dashboardData.executionSpeed}ms
              </div>
              <div className="text-slate-400 text-sm md:text-base">Average Execution</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Dashboard */}
      <section ref={s5.ref} className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24" style={{ opacity: s5.visible ? 1 : 0, transform: s5.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}>
        <div className="text-center mb-8 md:mb-12">
          <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-2 md:mb-3">
            LIVE AI CONTROL CENTER
          </div>
          <h2 className="text-3xl md:text-6xl font-bold text-white">AI Trading Dashboard</h2>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 md:p-10 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Live Activity Log */}
            <div className="bg-slate-950/60 rounded-2xl p-6 md:p-8 border border-blue-500/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 font-semibold text-sm md:text-base">
                    LIVE ACTIVITY LOG
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {dashboardData.logs.length} events
                </div>
              </div>
              <div className="space-y-3 text-slate-300 text-xs md:text-sm max-h-[400px] overflow-y-auto">
                {dashboardData.logs.map((log, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="text-slate-500 font-mono text-xs flex-shrink-0">
                      {log.time}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            log.bot === 'Macro'
                              ? 'bg-blue-500/20 text-blue-300'
                              : log.bot === 'Risk'
                              ? 'bg-red-500/20 text-red-300'
                              : log.bot === 'Arbitrage'
                              ? 'bg-violet-500/20 text-violet-300'
                              : log.bot === 'Dual'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : log.bot === 'Options'
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'bg-green-500/20 text-green-300'
                          }`}
                        >
                          {log.bot}
                        </span>
                      </div>
                      <div className="text-slate-300 text-xs md:text-sm">{log.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Overview */}
            <div className="bg-slate-950/60 rounded-2xl p-6 md:p-8 border border-blue-500/20">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-white">System Overview</h3>
              <div className="space-y-6">
                {[
                  { label: "AI Efficiency", value: dashboardData.aiEfficiency, bar: "bg-blue-500" },
                  { label: "Market Coverage", value: dashboardData.marketCoverage, bar: "bg-violet-500" },
                  { label: "Execution Speed", value: dashboardData.executionSpeed, bar: "bg-green-500" },
                  { label: "Risk Control", value: dashboardData.riskControl, bar: "bg-amber-500" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2 text-sm md:text-base text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.value.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${item.bar} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-700">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                    Active Strategies
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Macro Intelligence', color: 'blue' },
                      { name: 'Risk Control', color: 'red' },
                      { name: 'Arbitrage Engine', color: 'violet' },
                      { name: 'Dual Currency', color: 'cyan' },
                      { name: 'Options Income', color: 'purple' },
                      { name: 'Liquidity Mining', color: 'green' },
                    ].map((strategy) => (
                      <div key={strategy.name} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full bg-${strategy.color}-400 animate-pulse`} />
                        <span className="text-slate-300">{strategy.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Performance Dashboard */}
      <section ref={s9.ref} className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-16 md:py-24" style={{ opacity: s9.visible ? 1 : 0, transform: s9.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        <div className="text-center mb-10 md:mb-14">
          <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-3 font-semibold">LIVE ANALYTICS</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">Performance Dashboard</h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-base md:text-lg">
            Real-time metrics from our autonomous AI trading agents — updated every session.
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {[
            { label: "Total Return (YTD)", value: `+${kpiData.totalReturn}%`, sub: "Since Jan 2026", color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
            { label: "Sharpe Ratio", value: kpiData.sharpeRatio.toFixed(2), sub: "Risk-adjusted return", color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
            { label: "Max Drawdown", value: `${kpiData.maxDrawdown}%`, sub: "Peak-to-trough", color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
            { label: "Win Rate", value: `${kpiData.winRate}%`, sub: "Profitable trades", color: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5" },
          ].map((kpi) => (
            <div key={kpi.label} className={`rounded-2xl border ${kpi.border} ${kpi.bg} backdrop-blur-xl p-4 md:p-5`}>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">{kpi.label}</div>
              <div className={`text-2xl md:text-3xl font-black ${kpi.color} tabular-nums`}>{kpi.value}</div>
              <div className="text-xs text-slate-600 mt-1">{kpi.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Monthly Returns Chart */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white text-base">График доходности по месяцам</h3>
                <p className="text-xs text-slate-500 mt-0.5">Monthly returns 2026</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-32">
              {monthlyReturns.map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-slate-500 font-semibold">{bar.pos ? "+" : ""}{bar.val}%</div>
                  <div className="w-full rounded-t-md transition-all duration-700" style={{
                    height: `${Math.abs(bar.val) * 5}px`,
                    background: bar.pos ? "linear-gradient(to top, #2563eb, #60a5fa)" : "linear-gradient(to top, #dc2626, #f87171)",
                    minHeight: "8px",
                  }} />
                  <div className="text-[10px] text-slate-600">{bar.month}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Equity Curve */}
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-white text-base">Equity Curve</h3>
                <p className="text-xs text-slate-500 mt-0.5">Portfolio growth simulation</p>
              </div>
              <span className="text-xs font-bold text-green-400">+{kpiData.equityGrowth}%</span>
            </div>
            <div className="relative h-32">
              <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,85 C20,80 30,75 50,70 C70,65 80,60 100,52 C120,44 130,48 150,40 C170,32 180,35 200,28 C220,21 240,18 260,14 C280,10 290,8 300,5"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <path
                  d="M0,85 C20,80 30,75 50,70 C70,65 80,60 100,52 C120,44 130,48 150,40 C170,32 180,35 200,28 C220,21 240,18 260,14 C280,10 290,8 300,5 L300,100 L0,100 Z"
                  fill="url(#equityGrad)"
                />
                {/* Drawdown highlight */}
                <path
                  d="M120,44 C125,46 130,50 135,48"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="3,2"
                />
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-600 px-1">
                <span>Jan</span> <span>Feb</span> <span>Mar</span> <span>Apr</span> <span>May</span> <span>Jun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Performance Table */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6">
          <h3 className="font-bold text-white text-base mb-5">Agent Performance Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left pb-3 font-semibold">Agent</th>
                  <th className="text-right pb-3 font-semibold">Return</th>
                  <th className="text-right pb-3 font-semibold">Sharpe</th>
                  <th className="text-right pb-3 font-semibold">Max DD</th>
                  <th className="text-right pb-3 font-semibold">Win Rate</th>
                  <th className="text-right pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agentPerformance.map((row) => (
                  <tr key={row.agent} className="hover:bg-slate-800/20 transition">
                    <td className="py-3">
                      <span className={`font-semibold ${row.color}`}>{row.agent}</span>
                    </td>
                    <td className="py-3 text-right font-bold text-green-400 tabular-nums">+{row.return}%</td>
                    <td className="py-3 text-right text-slate-300 tabular-nums">{row.sharpe}</td>
                    <td className="py-3 text-right text-amber-400 tabular-nums">{row.dd}%</td>
                    <td className="py-3 text-right text-slate-300 tabular-nums">{row.wr}%</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* About Nexus */}
      <section ref={s7.ref} id="about" className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 py-20 md:py-32" style={{ opacity: s7.visible ? 1 : 0, transform: s7.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        <div className="text-center mb-12 md:mb-20">
          <div className="text-blue-400 uppercase tracking-[4px] text-xs md:text-sm mb-3 md:mb-4 font-semibold">
            About Nexus
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white">
            Building the Future of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Financial Intelligence
            </span>
          </h2>
          <p className="text-slate-300 text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
            Nexus is an AI-driven trading infrastructure designed to discover, evaluate
            and execute opportunities across global digital asset markets.
          </p>
          <p className="text-slate-400 text-sm md:text-lg max-w-3xl mx-auto leading-relaxed mt-3 md:mt-4">
            Unlike traditional trading systems that rely on fixed rules, Nexus operates
            through a network of specialized AI agents capable of adapting to changing
            market conditions in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-24">
          <div className="space-y-8 md:space-y-12">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">What We Do</h3>
              <p className="text-slate-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
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
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-slate-300 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">
                AI Agent Architecture
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Market Scanner", desc: "Analyzes thousands of assets and market conditions." },
                  { name: "Signal Engine", desc: "Generates trading signals based on quantitative models." },
                  { name: "Risk Manager", desc: "Controls exposure and portfolio risk." },
                  { name: "Execution Agent", desc: "Optimizes order execution and trade management." },
                  { name: "Portfolio Agent", desc: "Allocates capital between strategies." },
                ].map((agent) => (
                  <div
                    key={agent.name}
                    className="rounded-xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-4 shadow-md hover:border-blue-400 hover:shadow-lg transition"
                  >
                    <div className="font-bold text-white mb-1 text-sm md:text-base">{agent.name}</div>
                    <div className="text-xs md:text-sm text-slate-400">{agent.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="rounded-3xl border border-blue-500/30 bg-slate-900/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl">
              <div className="text-blue-400 uppercase tracking-widest text-xs md:text-sm mb-2">
                NEXUS CORE
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
                Autonomous Trading Intelligence
              </h3>

              <div className="space-y-4 mb-8 md:mb-10">
                {["AI Agents", "Quant Research", "Risk Management", "Automated Execution", "Real-Time Analytics"].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-300 text-sm md:text-base">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-700 pt-6 md:pt-8">
                <div className="text-slate-500 uppercase tracking-wider text-xs mb-4">
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
                      <div className="text-slate-500 text-xs">{tech.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission + Corporate Backing */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
          <div className="rounded-3xl bg-slate-900/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl border border-blue-500/20">
            <div className="text-blue-400 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">
              Our Mission
            </div>
            <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
              Creating a fully autonomous financial intelligence network
            </h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Our mission is to create a fully autonomous financial intelligence
              network capable of identifying opportunities faster than traditional
              market participants while maintaining strict risk control.
            </p>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-6 md:p-10 shadow-2xl relative overflow-hidden">
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
            <div className="text-blue-400 uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 font-semibold">
              Why Nexus
            </div>
            <h3 className="text-2xl md:text-4xl font-bold text-white">
              What Makes Us Different
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                title: "24/7 Monitoring",
                desc: "Markets never sleep. Neither do our AI agents.",
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Multi-Agent System",
                desc: "Independent AI agents collaborate to make decisions.",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                title: "Data-Driven Decisions",
                desc: "No emotions. No guesswork. Only data.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Continuous Learning",
                desc: "Models evolve as market conditions change.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-5 md:p-6 shadow-md hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 md:mb-4">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h4 className="text-base md:text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Block */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { value: "12,847+", label: "Signals Generated Daily", color: "blue" },
            { value: "4,391+", label: "Assets Monitored", color: "blue" },
            { value: "27+", label: "Active Strategies", color: "blue" },
            { value: "99ms", label: "Average Execution Time", color: "green" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 text-center shadow-md"
            >
              <div className={`text-3xl md:text-5xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
              <div className="text-slate-400 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Arkham Wallet */}
      <section ref={s8.ref} className="relative z-10 max-w-5xl mx-auto px-4 md:px-10 py-16 md:py-24" style={{ opacity: s8.visible ? 1 : 0, transform: s8.visible ? "translateY(0)" : "translateY(40px)", transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s" }}>
        <div className="rounded-3xl border border-blue-500/30 bg-slate-900/60 backdrop-blur-xl p-6 md:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute -top-20 -right-20 w-48 md:w-60 h-48 md:h-60 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-xs mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Verified on Arkham Intelligence
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-white">Your NEXO Wallet</h2>
              <p className="text-slate-300 mb-4 md:mb-6 max-w-xl text-sm md:text-base">
                Our treasury wallet is publicly verifiable. Every deposit, every
                transaction — fully transparent on-chain.
              </p>

              <div className="rounded-xl border border-blue-500/20 bg-slate-950/60 p-3 md:p-4 font-mono text-xs md:text-sm text-slate-300 break-all mb-4 md:mb-6">
                <span className="text-slate-500">Address: </span>
                <span className="text-blue-400">
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
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center font-black text-white">
                N
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                  NEXUS Investment Fund
                  <span className="text-xs font-normal text-slate-500">•</span>
                  <span className="text-xs font-medium text-slate-400">A NEXO Company</span>
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
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-400 hover:bg-blue-500/10 transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                Powered by
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black">
                  N
                </div>
                <span className="font-bold text-slate-300 text-sm md:text-base">NEXO</span>
              </div>
              <div className="text-xs text-slate-500 hidden md:block">
                — Leading Crypto Lending Platform
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-blue-400 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-400 transition">
                Terms of Service
              </Link>
              <Link href="/regulatory" className="hover:text-blue-400 transition">
                Regulatory
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAccount, useDisconnect, useSendTransaction, useWriteContract } from "wagmi";
import { parseEther, parseUnits } from "viem";
import ConnectWallet from "../components/ConnectWallet";

const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default function InvestPage() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [asset, setAsset] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("invest_asset") || "ETH";
    return "ETH";
  });
  const [plan, setPlan] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedAsset = localStorage.getItem("invest_asset") || "ETH";
      return localStorage.getItem(`invest_plan_${savedAsset}`) || "Flexible";
    }
    return "Flexible";
  });
  const [amount, setAmount] = useState<string>("");
  const [depositMethod, setDepositMethod] = useState<"wallet" | "manual">("wallet");
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }, []);
    return { ref, visible };
  };
  const sHeader = useScrollReveal();
  const sWhy    = useScrollReveal();
  const sWallet = useScrollReveal();
  const sForm   = useScrollReveal();
  const sFaq    = useScrollReveal();

  const [prices, setPrices] = useState<Record<string, number>>({
    ETH: 1630, BTC: 61000, USDT: 1, SOL: 65, XRP: 1.17, BNB: 580, LINK: 8, NEAR: 2.1,
  });

  useEffect(() => {
    async function loadPrices() {
      try {
        const pairs = ["ETHUSDT","BTCUSDT","SOLUSDT","XRPUSDT","BNBUSDT","LINKUSDT","NEARUSDT"];
        const results = await Promise.all(
          pairs.map((p) => fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${p}`).then((r) => r.json()))
        );
        setPrices({
          ETH: parseFloat(results[0].price),
          BTC: parseFloat(results[1].price),
          USDT: 1,
          SOL: parseFloat(results[2].price),
          XRP: parseFloat(results[3].price),
          BNB: parseFloat(results[4].price),
          LINK: parseFloat(results[5].price),
          NEAR: parseFloat(results[6].price),
        });
      } catch {
        // Fallback: ~$500 equivalent static values
        setPrices({ ETH: 1630, BTC: 61000, USDT: 1, SOL: 65, XRP: 1.17, BNB: 580, LINK: 8, NEAR: 2.1 });
      }
    }
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const MIN_DEPOSITS: Record<string, number> = {
    ETH: 0.1, BTC: 0.005, USDT: 500, SOL: 5, XRP: 500, BNB: 0.5, LINK: 50, NEAR: 200,
  };
  const getMinDeposit = (sym: string): number => MIN_DEPOSITS[sym] ?? 0;

  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { writeContract, isPending: isContractPending } = useWriteContract();

  const assetPlans: Record<string, { name: string; apr: number; lock: string; popular?: boolean }[]> = {
    ETH: [
      { name: "Flexible", apr: 8.87, lock: "No lock period" },
      { name: "30 Days", apr: 11.9, lock: "30 days lock" },
      { name: "90 Days", apr: 13.5, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 14.8, lock: "180 days lock" },
    ],
    BTC: [
      { name: "Flexible", apr: 6.5, lock: "No lock period" },
      { name: "30 Days", apr: 8.2, lock: "30 days lock" },
      { name: "90 Days", apr: 10.1, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 12.0, lock: "180 days lock" },
    ],
    USDT: [
      { name: "Flexible", apr: 10.5, lock: "No lock period" },
      { name: "30 Days", apr: 13.5, lock: "30 days lock" },
      { name: "90 Days", apr: 15.8, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 18.0, lock: "180 days lock" },
    ],
    SOL: [
      { name: "Flexible", apr: 9.4, lock: "No lock period" },
      { name: "30 Days", apr: 12.8, lock: "30 days lock" },
      { name: "90 Days", apr: 15.2, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 17.5, lock: "180 days lock" },
    ],
    XRP: [
      { name: "Flexible", apr: 7.2, lock: "No lock period" },
      { name: "30 Days", apr: 9.8, lock: "30 days lock" },
      { name: "90 Days", apr: 12.3, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 14.1, lock: "180 days lock" },
    ],
    BNB: [
      { name: "Flexible", apr: 8.1, lock: "No lock period" },
      { name: "30 Days", apr: 11.2, lock: "30 days lock" },
      { name: "90 Days", apr: 13.8, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 16.0, lock: "180 days lock" },
    ],
    LINK: [
      { name: "Flexible", apr: 10.2, lock: "No lock period" },
      { name: "30 Days", apr: 13.9, lock: "30 days lock" },
      { name: "90 Days", apr: 16.7, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 19.4, lock: "180 days lock" },
    ],
    NEAR: [
      { name: "Flexible", apr: 11.5, lock: "No lock period" },
      { name: "30 Days", apr: 15.3, lock: "30 days lock" },
      { name: "90 Days", apr: 18.6, lock: "90 days lock", popular: true },
      { name: "180 Days", apr: 21.8, lock: "180 days lock" },
    ],
  };

  const assetConfig: Record<string, { minDeposit: number; symbol: string; network: string }> = {
    ETH: { minDeposit: 0.5, symbol: "ETH", network: "Ethereum" },
    BTC: { minDeposit: 0.01, symbol: "BTC", network: "Bitcoin" },
    USDT: { minDeposit: 1000, symbol: "USDT", network: "ERC20 (Ethereum)" },
    SOL: { minDeposit: 5, symbol: "SOL", network: "Solana" },
    XRP: { minDeposit: 100, symbol: "XRP", network: "XRP Ledger" },
    BNB: { minDeposit: 1, symbol: "BNB", network: "BNB Chain" },
    LINK: { minDeposit: 10, symbol: "LINK", network: "Ethereum" },
    NEAR: { minDeposit: 20, symbol: "NEAR", network: "NEAR Protocol" },
  };

  const depositAddresses: Record<string, string> = {
    ETH: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    USDT: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    BTC: "bc1qflmk4rerlpruf5ge46gc6mlme7q99xgwdrmfxv",
    SOL: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    XRP: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    BNB: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    LINK: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    NEAR: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
  };

  const faqItems = [
    {
      question: "How is APR calculated?",
      answer: "APR (Annual Percentage Rate) is calculated based on our AI trading strategies' historical performance. It reflects the estimated yearly return on your deposit. Actual returns may vary slightly depending on market conditions.",
    },
    {
      question: "When can I withdraw my funds?",
      answer: "For Flexible plans, you can withdraw at any time with no penalty. For locked plans (30, 90, 180 days), withdrawals are available after the lock period ends. Early withdrawals are not available for locked plans.",
    },
    {
      question: "Is my investment safe?",
      answer: "We employ AI-powered risk management systems that continuously monitor and adjust positions. All treasury wallets are publicly verifiable on Arkham Intelligence. However, all investments carry inherent risk — never invest more than you can afford to lose.",
    },
    {
      question: "How do I track my investment?",
      answer: "Once your deposit is confirmed on-chain, your investment details will be visible in your personal dashboard. You'll be able to see real-time profit accrual, lock period countdown, and full transaction history.",
    },
    {
      question: "What networks are supported?",
      answer: "Currently we support Ethereum (ETH and USDT/ERC20) and Bitcoin (BTC). Support for Solana, BNB Chain, XRP Ledger and NEAR Protocol is coming in Q3 2026 as part of our roadmap.",
    },
    {
      question: "Are there any fees?",
      answer: "Nexus AI Capital charges no deposit or management fees. The only costs are standard network gas fees paid to the blockchain itself when sending transactions. These are not controlled by us.",
    },
  ];

  const whyNexus = [
    {
      icon: (
        <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Institutional Security",
      desc: "Multi-sig wallets, cold storage, and AI risk monitoring protect your assets 24/7. All treasury activity is publicly verifiable on-chain.",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "Full Transparency",
      desc: "Every transaction is recorded on-chain. Our wallet is verified on Arkham Intelligence — you can audit every dollar at any time.",
    },
    {
      icon: (
        <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "AI-Powered Returns",
      desc: "Our autonomous agents scan 4,000+ assets and execute thousands of signals daily — delivering consistent returns that manual trading can't match.",
    },
  ];

  const selectedPlan = assetPlans[asset].find((p) => p.name === plan) || assetPlans[asset][0];
  const depositAmount = Number(amount) || 0;
  const profit = (depositAmount * selectedPlan.apr) / 100;
  const total = depositAmount + profit;
  const apr = selectedPlan.apr;
  const dailyProfit = (depositAmount * apr) / 100 / 365;
  const monthlyProfit = (depositAmount * apr) / 100 / 12;
  const quarterlyProfit = (depositAmount * apr) / 100 / 4;
  const yearlyProfit = (depositAmount * apr) / 100;
  const isValidDeposit = getMinDeposit(asset) === 0 || depositAmount >= getMinDeposit(asset);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddresses[asset]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleStartInvest = () => {
    if (!isValidDeposit) return;
    if (depositMethod === "wallet" && !isConnected) return;
    setShowConfirmModal(true);
    setTxStatus("idle");
    setTxHash("");
    setErrorMsg("");
  };

  const handleConfirmPayment = () => {
    setTxStatus("pending");
    setErrorMsg("");
    try {
      if (asset === "USDT") {
        writeContract({
          address: USDT_CONTRACT,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [depositAddresses.USDT as `0x${string}`, parseUnits(amount, 6)],
        }, {
          onSuccess: (hash) => { setTxHash(hash); setTxStatus("success"); },
          onError: (err) => { setErrorMsg(err.message || "Transaction failed"); setTxStatus("error"); },
        });
      } else if (asset === "ETH") {
        sendTransaction({
          to: depositAddresses.ETH as `0x${string}`,
          value: parseEther(amount),
        }, {
          onSuccess: (hash) => { setTxHash(hash); setTxStatus("success"); },
          onError: (err) => { setErrorMsg(err.message || "Transaction failed"); setTxStatus("error"); },
        });
      } else {
        setErrorMsg("Bitcoin deposits are currently available via Manual Transfer only");
        setTxStatus("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unexpected error");
      setTxStatus("error");
    }
  };

  const handleManualSent = () => {
    setTxStatus("success");
    setTxHash("manual-" + Date.now());
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    setTxStatus("idle");
    setTxHash("");
    setErrorMsg("");
  };

  const isProcessing = isTxPending || isContractPending || txStatus === "pending";

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
      <div className="absolute inset-0 bg-slate-950/75 pointer-events-none" />



      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 pt-16 pb-24">

        {/* Header */}
        <div ref={sHeader.ref} style={{ opacity: sHeader.visible ? 1 : 0, transform: sHeader.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0s, transform 0.7s ease 0s" }} className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Investment Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Start Earning Today
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Connect your wallet and put your crypto to work with AI-powered strategies.
          </p>
        </div>

        {/* Why Nexus */}
        <div ref={sWhy.ref} style={{ opacity: sWhy.visible ? 1 : 0, transform: sWhy.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {whyNexus.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="font-bold text-white text-base">{item.title}</div>
              <div className="text-slate-400 text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Wallet Connection */}
        <div ref={sWallet.ref} style={{ opacity: sWallet.visible ? 1 : 0, transform: sWallet.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s" }} className="rounded-3xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-xl mb-6">
          <h2 className="text-xl font-bold mb-5 text-white">Connect Wallet</h2>
          {!isConnected ? (
            <ConnectWallet />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="bg-slate-800/60 rounded-xl p-4 flex-1 border border-slate-700/40">
                <div className="text-sm text-slate-400 mb-1">Connected Wallet</div>
                <div className="font-mono font-semibold break-all text-sm text-white">{address}</div>
              </div>
              <button
                onClick={() => disconnect()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg hover:scale-105 transition-all text-sm"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Investment Form */}
        <div ref={sForm.ref} style={{ opacity: sForm.visible ? 1 : 0, transform: sForm.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }} className="rounded-3xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-xl">

          {/* Choose Asset */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-5 text-white">Choose Asset</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["ETH", "BTC", "USDT", "SOL", "XRP", "BNB", "LINK", "NEAR"].map((item) => {
                const cfg = assetConfig[item];
                const isActive = asset === item;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      const newPlan = assetPlans[item][0].name;
                      setAsset(item);
                      setPlan(newPlan);
                      setAmount("");
                      localStorage.setItem("invest_asset", item);
                      localStorage.setItem(`invest_plan_${item}`, newPlan);
                    }}
                    className={`px-4 py-4 rounded-xl border-2 font-semibold transition-all text-left ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="text-base font-black">{item}</div>
                    <div className={`text-xs mt-0.5 truncate ${isActive ? "text-blue-200" : "text-slate-500"}`}>
                      {cfg.network}
                    </div>
                    <div className={`text-xs mt-1 font-semibold ${isActive ? "text-blue-200" : "text-slate-400"}`}>
                      from {assetPlans[item][0].apr}% APR
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choose Plan */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-5 text-white">Choose Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetPlans[asset].map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setPlan(p.name);
                    localStorage.setItem(`invest_plan_${asset}`, p.name);
                  }}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                    plan === p.name
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-lg shadow-blue-500/20"
                      : "bg-slate-800/50 text-slate-300 border-slate-700/50 hover:border-blue-500/60"
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-900 text-xs font-bold shadow-lg whitespace-nowrap uppercase tracking-wide">
                      Most Popular
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{p.name}</div>
                      <div className={`text-sm mt-0.5 ${plan === p.name ? "text-white/70" : "text-slate-500"}`}>
                        {p.lock}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{p.apr}%</div>
                      <div className={`text-xs ${plan === p.name ? "text-white/70" : "text-slate-500"}`}>APR</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-5 text-white">Deposit Amount</h2>
            <div className="relative">
              {asset === "USDT" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-semibold">$</span>
              )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={prices[asset] ? `Minimum ${getMinDeposit(asset)} ${asset}` : `Loading...`}
                min="0"
                step="any"
                className={`w-full border-2 rounded-xl p-5 ${asset === "USDT" ? "pl-10" : "pl-5"} text-xl font-semibold focus:outline-none transition bg-slate-800/60 text-white placeholder-slate-600 ${
                  amount && !isValidDeposit ? "border-red-500/60" : "border-slate-700/50 focus:border-blue-500"
                }`}
              />
              {asset !== "USDT" && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-semibold">{asset}</span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Minimum deposit: {getMinDeposit(asset)} {assetConfig[asset].symbol}
            </p>
            {amount && !isValidDeposit && (
              <p className="text-red-400 text-sm mt-2">Minimum deposit is {getMinDeposit(asset)} {asset}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                getMinDeposit(asset),
                getMinDeposit(asset) * 2,
                getMinDeposit(asset) * 5,
                getMinDeposit(asset) * 10,
              ].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="px-4 py-2 rounded-lg bg-slate-800/70 border border-slate-700/50 hover:border-blue-500/60 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 text-sm font-medium transition"
                >
                  {val} {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Summary */}
          <div className="rounded-2xl p-6 border border-slate-700/50 bg-slate-800/40 mb-8">
            <h3 className="text-lg font-bold mb-5 text-white">Investment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Asset</span>
                <span className="font-bold text-white">{asset}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan</span>
                <span className="font-bold text-white">{plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Network</span>
                <span className="font-bold text-white text-sm">{assetConfig[asset].network}</span>
              </div>
              <div className="border-t border-slate-700/50 pt-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deposit</span>
                  <span className="font-semibold text-white">{depositAmount} {asset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">APR</span>
                  <span className="font-semibold text-blue-400">{selectedPlan.apr}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Profit</span>
                  <span className="font-semibold text-green-400">{profit.toFixed(4)} {asset}</span>
                </div>
                <div className="border-t border-slate-700/50 pt-3 flex justify-between items-center">
                  <span className="font-bold text-white text-lg">Total Value</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                    {total.toFixed(4)} {asset}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Projection */}
          {isValidDeposit && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-white">Performance Projection</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Daily", value: dailyProfit },
                  { label: "Monthly", value: monthlyProfit },
                  { label: "Quarterly", value: quarterlyProfit },
                  { label: "Yearly", value: yearlyProfit },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="text-slate-500 text-xs mb-1">{item.label}</div>
                    <div className="text-lg font-bold text-green-400">+{item.value.toFixed(4)}</div>
                    <div className="text-xs text-slate-500">{asset}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deposit Method */}
          {isValidDeposit && (
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-white">Deposit Method</h3>
              <div className="space-y-3 mb-6">
                {[
                  { value: "wallet", label: "Connect Wallet", desc: "Instant deposit via Web3 transaction" },
                  { value: "manual", label: "Manual Transfer", desc: "Send funds to deposit address" },
                ].map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                      depositMethod === m.value
                        ? "border-blue-500/60 bg-blue-500/10"
                        : "border-slate-700/50 hover:border-blue-500/40 bg-slate-800/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="depositMethod"
                      value={m.value}
                      checked={depositMethod === m.value}
                      onChange={() => setDepositMethod(m.value as "wallet" | "manual")}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div>
                      <div className="font-semibold text-white">{m.label}</div>
                      <div className="text-sm text-slate-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {depositMethod === "wallet" && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{isConnected ? "Wallet Connected" : "Wallet Required"}</div>
                      <div className="text-sm text-slate-400">
                        {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect your wallet to proceed"}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4">
                    <div className="text-xs text-slate-500 mb-1">Amount</div>
                    <div className="text-xl font-bold text-white">{depositAmount} {asset}</div>
                  </div>
                </div>
              )}

              {depositMethod === "manual" && (
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{asset} Deposit Address</div>
                      <div className="text-sm text-slate-500">Network: {assetConfig[asset].network}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-4 mb-4">
                    <div className="text-xs text-slate-500 mb-1">Address</div>
                    <div className="font-mono text-sm break-all text-slate-200">{depositAddresses[asset]}</div>
                  </div>
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 mb-4 flex flex-col items-center">
                    <div className="w-48 h-48 mb-4">
                      <img
                        src={`/qr-${asset.toLowerCase()}.png`}
                        alt={`${asset} QR Code`}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => { e.currentTarget.src = "/qr-usdt.png"; }}
                      />
                    </div>
                    <div className="text-sm text-slate-400 font-medium">Scan to send {asset}</div>
                  </div>
                  <button
                    onClick={copyAddress}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition shadow-lg"
                  >
                    {copied ? "✓ Address Copied" : "Copy Address"}
                  </button>
                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-xs text-amber-300 leading-relaxed">
                        Send only {asset} to this address. Sending other assets may result in permanent loss.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start Investment Button */}
          <button
            onClick={handleStartInvest}
            disabled={!isValidDeposit || (depositMethod === "wallet" && !isConnected)}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              isValidDeposit && (depositMethod === "manual" || isConnected)
                ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-500/25"
                : "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700/50"
            }`}
          >
            {!isValidDeposit
              ? "Enter Valid Amount"
              : depositMethod === "wallet" && !isConnected
              ? "Connect Wallet To Invest"
              : "Start Investment"}
          </button>

          <p className="text-xs text-slate-600 text-center mt-5 leading-relaxed">
            By investing, you agree to our Terms of Service. Returns are estimates based on current APR and may vary. Capital at risk.
          </p>
        </div>

        {/* FAQ */}
        <div ref={sFaq.ref} style={{ opacity: sFaq.visible ? 1 : 0, transform: sFaq.visible ? "translateY(0)" : "translateY(36px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }} className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know before investing.</p>
          </div>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className="font-semibold text-white text-sm md:text-base pr-4">{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-blue-400" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-700/40 pt-4">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              disabled={isProcessing}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {txStatus === "idle" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">Confirm Investment</h2>
                <p className="text-slate-400 text-center text-sm mb-6">Review the details before proceeding</p>
                <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5 mb-6 space-y-3">
                  {[
                    { label: "Asset", value: asset },
                    { label: "Plan", value: plan },
                    { label: "Network", value: assetConfig[asset].network },
                    { label: "APR", value: `${selectedPlan.apr}%`, color: "text-blue-400" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">{row.label}</span>
                      <span className={`font-bold ${row.color || "text-white"}`}>{row.value}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-700/50 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 text-sm">Amount</span>
                      <span className="font-bold text-white text-lg">{depositAmount} {asset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Expected Profit</span>
                      <span className="font-bold text-green-400">{profit.toFixed(4)} {asset}</span>
                    </div>
                  </div>
                </div>
                {depositMethod === "wallet" ? (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-xs text-amber-300 leading-relaxed">
                        You are about to transfer <strong>{depositAmount} {asset}</strong> to Nexus AI Capital. Your wallet will ask you to confirm and pay network fees.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-blue-300 leading-relaxed">
                        After clicking "I Have Sent Funds", our system will verify your transaction on-chain. Your investment will be activated after network confirmation.
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {depositMethod === "wallet" ? (
                    <button onClick={handleConfirmPayment} disabled={isProcessing} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition disabled:opacity-50">
                      Confirm Payment
                    </button>
                  ) : (
                    <button onClick={handleManualSent} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-green-500/25 transition">
                      I Have Sent Funds
                    </button>
                  )}
                  <button onClick={closeModal} disabled={isProcessing} className="w-full py-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 transition font-medium disabled:opacity-50">
                    Cancel
                  </button>
                </div>
              </>
            )}

            {txStatus === "pending" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Processing Transaction</h2>
                <p className="text-slate-400 text-sm mb-4">
                  {depositMethod === "wallet" ? "Please confirm in your wallet..." : "Verifying your transfer..."}
                </p>
                <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 text-sm text-slate-400">
                  <div className="flex justify-between mb-2">
                    <span>Amount:</span>
                    <span className="font-semibold text-white">{depositAmount} {asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-mono text-xs">{depositAddresses[asset].slice(0, 10)}...{depositAddresses[asset].slice(-6)}</span>
                  </div>
                </div>
              </div>
            )}

            {txStatus === "success" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {depositMethod === "wallet" ? "Transaction Submitted!" : "Funds Confirmed!"}
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  {depositMethod === "wallet"
                    ? "Your investment is being processed. Track it in your dashboard."
                    : "Your investment will be activated after network confirmation (10–30 minutes)."}
                </p>
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 mb-6">
                  <div className="text-xs text-green-400 font-semibold mb-3">Investment Details</div>
                  <div className="space-y-1 text-sm">
                    {[
                      { label: "Asset", value: `${depositAmount} ${asset}` },
                      { label: "Plan", value: plan },
                      { label: "APR", value: `${selectedPlan.apr}%` },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between">
                        <span className="text-green-400/70">{row.label}:</span>
                        <span className="font-semibold text-green-300">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {depositMethod === "wallet" && txHash && !txHash.startsWith("manual") && (
                  <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-3 mb-6">
                    <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
                    <div className="font-mono text-xs break-all text-slate-300">{txHash}</div>
                  </div>
                )}
                <button onClick={closeModal} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition">
                  Go to Dashboard
                </button>
              </div>
            )}

            {txStatus === "error" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Transaction Failed</h2>
                <p className="text-slate-400 text-sm mb-6">{errorMsg || "Something went wrong. Please try again."}</p>
                <div className="space-y-3">
                  <button onClick={() => { setTxStatus("idle"); setErrorMsg(""); }} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition">
                    Try Again
                  </button>
                  <button onClick={closeModal} className="w-full py-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-500 transition font-medium">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";
import { useState } from "react";
import { useAccount, useDisconnect, useSendTransaction, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, parseUnits } from "viem";
import ConnectWallet from "../components/ConnectWallet";

// Минимальный ABI для ERC20 transfer
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

// USDT contract address (ERC20 on Ethereum)
const USDT_CONTRACT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default function InvestPage() {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [asset, setAsset] = useState("ETH");
  const [plan, setPlan] = useState("Flexible");
  const [amount, setAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState<"wallet" | "manual">("wallet");
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Wagmi hooks
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { writeContract, isPending: isContractPending } = useWriteContract();

  const assetPlans: Record<
  string,
  { name: string; apr: number; lock: string }[]
> = {
    ETH: [
      { name: "Flexible", apr: 8.87, lock: "No lock period" },
      { name: "30 Days", apr: 11.9, lock: "30 days lock" },
      { name: "90 Days", apr: 13.5, lock: "90 days lock" },
      { name: "180 Days", apr: 14.8, lock: "180 days lock" },
    ],
    BTC: [
      { name: "Flexible", apr: 6.5, lock: "No lock period" },
      { name: "30 Days", apr: 8.2, lock: "30 days lock" },
      { name: "90 Days", apr: 10.1, lock: "90 days lock" },
      { name: "180 Days", apr: 12.0, lock: "180 days lock" },
    ],
    USDT: [
      { name: "Flexible", apr: 10.5, lock: "No lock period" },
      { name: "30 Days", apr: 13.5, lock: "30 days lock" },
      { name: "90 Days", apr: 15.8, lock: "90 days lock" },
      { name: "180 Days", apr: 18.0, lock: "180 days lock" },
    ],
  };

  const assetConfig: Record<string, { minDeposit: number; symbol: string; network: string }> = {
    ETH: { minDeposit: 0.5, symbol: "ETH", network: "Ethereum" },
    BTC: { minDeposit: 0.01, symbol: "BTC", network: "Bitcoin" },
    USDT: { minDeposit: 1000, symbol: "USDT", network: "ERC20 (Ethereum)" },
  };

  const depositAddresses: Record<string, string> = {
    ETH: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    USDT: "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797",
    BTC: "bc1qflmk4rerlpruf5ge46gc6mlme7q99xgwdrmfxv",
  };

  const selectedPlan = assetPlans[asset].find((p) => p.name === plan) || assetPlans[asset][0];
  const depositAmount = Number(amount) || 0;
  const profit = (depositAmount * selectedPlan.apr) / 100;
  const total = depositAmount + profit;

  const apr = selectedPlan.apr;
  const dailyProfit = (depositAmount * apr) / 100 / 365;
  const monthlyProfit = (depositAmount * apr) / 100 / 12;
  const quarterlyProfit = (depositAmount * apr) / 100 / 4;
  const yearlyProfit = (depositAmount * apr) / 100;

  const isValidDeposit = depositAmount >= assetConfig[asset].minDeposit;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(depositAddresses[asset]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Открыть модалку подтверждения
  const handleStartInvest = () => {
    if (!isValidDeposit) return;
    if (depositMethod === "wallet" && !isConnected) return;
    setShowConfirmModal(true);
    setTxStatus("idle");
    setTxHash("");
    setErrorMsg("");
  };

  // Подтвердить и отправить транзакцию
  const handleConfirmPayment = () => {
    setTxStatus("pending");
    setErrorMsg("");

    try {
      if (asset === "USDT") {
        // USDT - вызов контракта ERC20
        writeContract({
          address: USDT_CONTRACT,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [
            depositAddresses.USDT as `0x${string}`,
            parseUnits(amount, 6), // USDT имеет 6 decimals
          ],
        }, {
          onSuccess: (hash) => {
            setTxHash(hash);
            setTxStatus("success");
          },
          onError: (err) => {
            setErrorMsg(err.message || "Transaction failed");
            setTxStatus("error");
          },
        });
      } else if (asset === "ETH") {
        // ETH - нативная транзакция
        sendTransaction({
          to: depositAddresses.ETH as `0x${string}`,
          value: parseEther(amount),
        }, {
          onSuccess: (hash) => {
            setTxHash(hash);
            setTxStatus("success");
          },
          onError: (err) => {
            setErrorMsg(err.message || "Transaction failed");
            setTxStatus("error");
          },
        });
      } else {
        // BTC - пока только manual (Bitcoin не поддерживается через wagmi напрямую)
        setErrorMsg("Bitcoin deposits are currently available via Manual Transfer only");
        setTxStatus("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Unexpected error");
      setTxStatus("error");
    }
  };

  // Manual transfer - подтверждение отправки
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
    <main className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Investment Portal
          </h1>
          <p className="text-slate-600 text-lg">
            Connect your wallet and start earning with AI-powered strategies.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold mb-6">Connect Wallet</h2>
          {!isConnected ? (
            <ConnectWallet />
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="bg-slate-100 rounded-xl p-4 flex-1">
                <div className="text-sm text-slate-500">Connected Wallet</div>
                <div className="font-mono font-semibold break-all text-sm">
                  {address}
                </div>
              </div>
              <button
                onClick={() => disconnect()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>

        {/* Investment Form */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200">
          {/* Choose Asset */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose Asset</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["ETH", "BTC", "USDT"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setAsset(item);
                    setPlan(assetPlans[item][0].name);
                  }}
                  className={`px-6 py-4 rounded-xl border-2 font-semibold transition-all ${
                    asset === item
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-lg"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-500"
                  }`}
                >
                  <div className="text-lg">{item}</div>
                  <div className={`text-xs mt-1 ${asset === item ? "text-white/80" : "text-slate-500"}`}>
                    {assetConfig[item].network}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Choose Plan */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetPlans[asset].map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPlan(p.name)}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    plan === p.name
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-lg"
                      : "bg-white text-slate-700 border-slate-200 hover:border-blue-500"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{p.name}</div>
                      <div className={`text-sm ${plan === p.name ? "text-white/80" : "text-slate-500"}`}>
                        {p.lock}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{p.apr}%</div>
                      <div className={`text-xs ${plan === p.name ? "text-white/80" : "text-slate-500"}`}>APR</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Amount */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Deposit Amount</h2>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-semibold">
                {asset === "USDT" ? "$" : ""}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Minimum ${assetConfig[asset].minDeposit} ${asset}`}
                min="0"
                step="any"
                className={`w-full border-2 rounded-xl p-5 ${
                  asset === "USDT" ? "pl-10" : "pl-5"
                } text-xl font-semibold focus:border-blue-600 focus:outline-none transition ${
                  amount && !isValidDeposit ? "border-red-300 bg-red-50" : "border-slate-200"
                }`}
              />
              {asset !== "USDT" && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-semibold">
                  {asset}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Minimum deposit: {assetConfig[asset].minDeposit} {assetConfig[asset].symbol}
            </p>
            {amount && !isValidDeposit && (
              <p className="text-red-500 text-sm mt-2">
                Minimum deposit is {assetConfig[asset].minDeposit} {asset}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                assetConfig[asset].minDeposit,
                assetConfig[asset].minDeposit * 2,
                assetConfig[asset].minDeposit * 5,
                assetConfig[asset].minDeposit * 10,
              ].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-600 text-sm font-medium transition"
                >
                  {val} {asset}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Investment Summary</h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-600">Asset</span>
                <span className="font-bold text-slate-900 text-lg">{asset}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-600">Plan</span>
                <span className="font-bold text-slate-900 text-lg">{plan}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-600">Network</span>
                <span className="font-bold text-slate-900 text-lg">{assetConfig[asset].network}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-3">
                  <span className="text-slate-600">Deposit</span>
                  <span className="font-semibold text-slate-900">{depositAmount} {asset}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-3">
                  <span className="text-slate-600">APR</span>
                  <span className="font-semibold text-blue-600">{selectedPlan.apr}%</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-3">
                  <span className="text-slate-600">Expected Profit</span>
                  <span className="font-semibold text-green-600">{profit.toFixed(4)} {asset}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-bold text-slate-900 text-lg">Total Value</span>
                  <span className="font-bold text-slate-900 text-2xl bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    {total.toFixed(4)} {asset}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Projection */}
          {isValidDeposit && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-slate-900">Performance Projection</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-slate-500 text-sm">Daily</div>
                  <div className="text-xl font-bold text-green-600">{dailyProfit.toFixed(4)} {asset}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-slate-500 text-sm">Monthly</div>
                  <div className="text-xl font-bold text-green-600">{monthlyProfit.toFixed(4)} {asset}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-slate-500 text-sm">Quarterly</div>
                  <div className="text-xl font-bold text-green-600">{quarterlyProfit.toFixed(4)} {asset}</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-slate-500 text-sm">Yearly</div>
                  <div className="text-xl font-bold text-green-600">{yearlyProfit.toFixed(4)} {asset}</div>
                </div>
              </div>
            </div>
          )}

          {/* Deposit Method */}
          {isValidDeposit && (
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-6 text-slate-900">Deposit Method</h3>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="depositMethod"
                    value="wallet"
                    checked={depositMethod === "wallet"}
                    onChange={() => setDepositMethod("wallet")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Connect Wallet</div>
                    <div className="text-sm text-slate-500">Instant deposit via Web3 transaction</div>
                  </div>
                </label>
                <label className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-200 cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="radio"
                    name="depositMethod"
                    value="manual"
                    checked={depositMethod === "manual"}
                    onChange={() => setDepositMethod("manual")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">Manual Transfer</div>
                    <div className="text-sm text-slate-500">Send funds to deposit address</div>
                  </div>
                </label>
              </div>

              {depositMethod === "wallet" && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {isConnected ? "Wallet Connected" : "Wallet Required"}
                      </div>
                      <div className="text-sm text-slate-600">
                        {isConnected
                          ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                          : "Connect your wallet to proceed"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="text-sm text-slate-500 mb-1">Amount</div>
                    <div className="text-xl font-bold text-slate-900">{depositAmount} {asset}</div>
                  </div>
                </div>
              )}

              {depositMethod === "manual" && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{asset} Deposit Address</div>
                      <div className="text-sm text-slate-500">Network: {assetConfig[asset].network}</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 mb-4">
                    <div className="text-xs text-slate-500 mb-1">Address</div>
                    <div className="font-mono text-sm break-all text-slate-900">{depositAddresses[asset]}</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 mb-4 flex flex-col items-center">
                    <div className="w-48 h-48 mb-4">
                      <img
                        src={`/qr-${asset.toLowerCase()}.png`}
                        alt={`${asset} QR Code`}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/qr-usdt.png";
                        }}
                      />
                    </div>
                    <div className="text-sm text-slate-600 font-medium">Scan to send {asset}</div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={copyAddress}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition shadow-lg"
                    >
                      {copied ? "✓ Address Copied" : "Copy Address"}
                    </button>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-xs text-amber-800 leading-relaxed">
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
            className={`w-full mt-8 py-4 rounded-xl font-bold text-lg transition ${
              isValidDeposit && (depositMethod === "manual" || isConnected)
                ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-500/25"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            {!isValidDeposit
              ? "Enter Valid Amount"
              : depositMethod === "wallet" && !isConnected
              ? "Connect Wallet To Invest"
              : "Start Investment"}
          </button>

          <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
            By investing, you agree to our Terms of Service. Returns are estimates based on current APR and may vary.
            Capital at risk.
          </p>
        </div>
      </div>

      {/* ===== CONFIRMATION MODAL ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={closeModal}
              disabled={isProcessing}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* IDLE STATE - Confirm details */}
            {txStatus === "idle" && (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-2">
                  Confirm Investment
                </h2>
                <p className="text-slate-600 text-center text-sm mb-6">
                  Review the details before proceeding
                </p>

                <div className="bg-slate-50 rounded-2xl p-5 mb-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Asset</span>
                    <span className="font-bold text-slate-900">{asset}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Plan</span>
                    <span className="font-bold text-slate-900">{plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">Network</span>
                    <span className="font-bold text-slate-900 text-sm">{assetConfig[asset].network}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-sm">APR</span>
                    <span className="font-bold text-blue-600">{selectedPlan.apr}%</span>
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-600 text-sm">Amount</span>
                      <span className="font-bold text-slate-900 text-lg">{depositAmount} {asset}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 text-sm">Expected Profit</span>
                      <span className="font-bold text-green-600">{profit.toFixed(4)} {asset}</span>
                    </div>
                  </div>
                </div>

                {depositMethod === "wallet" ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="text-xs text-amber-800 leading-relaxed">
                        You are about to transfer <strong>{depositAmount} {asset}</strong> to Nexus AI Capital.
                        Your wallet will ask you to confirm the transaction and pay network fees.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-xs text-blue-800 leading-relaxed">
                        After clicking "I Have Sent Funds", our system will verify your transaction on the blockchain.
                        Your investment will be activated after network confirmation.
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {depositMethod === "wallet" ? (
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Payment
                    </button>
                  ) : (
                    <button
                      onClick={handleManualSent}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg shadow-xl shadow-green-500/25 transition"
                    >
                      I Have Sent Funds
                    </button>
                  )}

                  <button
                    onClick={closeModal}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* PENDING STATE */}
            {txStatus === "pending" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Processing Transaction
                </h2>
                <p className="text-slate-600 text-sm mb-4">
                  {depositMethod === "wallet"
                    ? "Please confirm the transaction in your wallet..."
                    : "Verifying your transfer..."}
                </p>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <div className="flex justify-between mb-2">
                    <span>Amount:</span>
                    <span className="font-semibold">{depositAmount} {asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="font-mono text-xs">
                      {depositAddresses[asset].slice(0, 10)}...{depositAddresses[asset].slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS STATE */}
            {txStatus === "success" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {depositMethod === "wallet" ? "Transaction Submitted!" : "Funds Confirmed!"}
                </h2>
                <p className="text-slate-600 text-sm mb-6">
                  {depositMethod === "wallet"
                    ? "Your investment is being processed. You can track it in your dashboard."
                    : "Your investment will be activated after network confirmation (usually 10-30 minutes)."}
                </p>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <div className="text-xs text-green-700 font-semibold mb-2">Investment Details</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Asset:</span>
                      <span className="font-semibold text-green-900">{depositAmount} {asset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Plan:</span>
                      <span className="font-semibold text-green-900">{plan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">APR:</span>
                      <span className="font-semibold text-green-900">{selectedPlan.apr}%</span>
                    </div>
                  </div>
                </div>

                {depositMethod === "wallet" && txHash && !txHash.startsWith("manual") && (
                  <div className="bg-slate-50 rounded-xl p-3 mb-6">
                    <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
                    <div className="font-mono text-xs break-all text-slate-700">{txHash}</div>
                  </div>
                )}

                <button
                  onClick={closeModal}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {txStatus === "error" && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Transaction Failed
                </h2>
                <p className="text-slate-600 text-sm mb-6">
                  {errorMsg || "Something went wrong. Please try again."}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setTxStatus("idle");
                      setErrorMsg("");
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold text-lg shadow-xl shadow-blue-500/25 transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition font-medium"
                  >
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
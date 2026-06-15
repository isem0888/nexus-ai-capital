"use client";
import { useState, useEffect } from "react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  wallet: string;
  balance: number;
}

function fmtTimeLeft(ms: number): string {
  if (ms <= 0) return "Available now";
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function WithdrawModal({ isOpen, onClose, onSuccess, wallet, balance }: WithdrawModalProps) {
  const [assetBalances, setAssetBalances] = useState<Record<string, number>>({});
  const [lockedPlans, setLockedPlans] = useState<Array<{ asset: string; plan: string; unlockAt: number }>>([]);
  const [asset, setAsset] = useState("");
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [now, setNow] = useState(Date.now());

  // Tick every second for countdown
  useEffect(() => {
    if (!isOpen) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !wallet) return;

    async function loadAssets() {
      let investments: any[] = [];

      try {
        const res = await fetch(`/api/investments?address=${wallet}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) investments = data;
        }
      } catch {}

      if (investments.length === 0) {
        try {
          const key = `nx_inv_${wallet}`;
          investments = JSON.parse(localStorage.getItem(key) || "[]");
        } catch {}
      }

      const nowMs = Date.now();
      const map: Record<string, number> = {};
      const locked: Array<{ asset: string; plan: string; unlockAt: number }> = [];

      investments.forEach((inv: any) => {
        const isFlexible = inv.plan === "Flexible";
        const investedMs = new Date(inv.investedAt).getTime();
        const settlementMs = inv.settlementAt ? new Date(inv.settlementAt).getTime() : null;

        if (isFlexible) {
          // 24h lock temporarily disabled — Flexible withdrawals available immediately
          map[inv.asset] = (map[inv.asset] || 0) + (Number(inv.amount) || 0);
        } else {
          if (settlementMs && settlementMs > nowMs) {
            locked.push({ asset: inv.asset, plan: inv.plan, unlockAt: settlementMs });
          } else {
            map[inv.asset] = (map[inv.asset] || 0) + (Number(inv.amount) || 0);
          }
        }
      });

      setAssetBalances(map);
      setLockedPlans(locked);

      const first = Object.keys(map)[0];
      if (first) setAsset(first);
    }

    loadAssets();
  }, [isOpen, wallet]);

  const availableAssets = Object.keys(assetBalances);
  const amountNum = Number(amount) || 0;
  const maxAmount = assetBalances[asset] || 0;

  const handleWithdraw = async () => {
    setError("");
    if (!destinationAddress) { setError("Please enter destination address"); return; }
    if (amountNum <= 0) { setError("Please enter valid amount"); return; }
    if (amountNum > maxAmount) { setError(`Insufficient balance. Max: ${maxAmount.toFixed(6)} ${asset}`); return; }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, asset, amount: amountNum, destination_address: destinationAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        onSuccess?.();
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setAmount("");
          setDestinationAddress("");
        }, 3000);
      } else {
        setError(data.error || "Withdrawal failed");
      }
    } catch {
      setError("Server connection error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const hasAnything = availableAssets.length > 0 || lockedPlans.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full relative shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Withdraw Funds</h2>
        <p className="text-slate-500 text-center mb-6 text-sm">Transfer your assets to an external wallet</p>

        {/* Total USD balance */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="text-xs text-slate-500 mb-1">Total Portfolio Value</div>
          <div className="text-2xl font-bold text-slate-900">${balance.toLocaleString()}</div>
        </div>

        {/* Locked plans countdowns */}
        {lockedPlans.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Locked Plans</div>
            {lockedPlans.map((lp, i) => {
              return (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">{lp.asset} · {lp.plan}</div>
                      <div className="text-xs text-slate-500">Available in</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-amber-600 text-sm">{fmtTimeLeft(lp.unlockAt - now)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {availableAssets.length === 0 && lockedPlans.length === 0 && (
          <div className="text-center py-6">
            <div className="text-slate-400 text-sm font-semibold mb-1">No investments found</div>
            <div className="text-slate-500 text-xs">Make an investment first to be able to withdraw.</div>
          </div>
        )}

        {availableAssets.length > 0 && (
          <div className="space-y-4">
            {availableAssets.length > 0 && (
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available to Withdraw</div>
            )}
            {/* Asset Selection */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Asset</label>
              <div className={`grid gap-2 ${availableAssets.length <= 3 ? `grid-cols-${availableAssets.length}` : "grid-cols-3"}`}>
                {availableAssets.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAsset(a); setAmount(""); }}
                    className={`py-3 rounded-xl font-semibold transition ${
                      asset === a
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {asset && (
                <div className="mt-2 text-xs text-slate-500">
                  Available: <span className="font-semibold text-slate-700">{maxAmount.toFixed(6)} {asset}</span>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition pr-20"
                />
                <button
                  onClick={() => setAmount(maxAmount.toFixed(6))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-50 transition"
                >
                  MAX
                </button>
              </div>
              <div className="text-xs text-slate-500 mt-1">Min: 0.01 {asset} • Fee: ~$2.50</div>
            </div>

            {/* Destination Address */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">Destination Address</label>
              <input
                type="text"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                placeholder={`Enter ${asset} address`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-600 text-sm">
                ✓ Withdrawal request submitted successfully!
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !amount || !destinationAddress}
              className={`w-full py-4 rounded-xl font-bold text-lg transition ${
                isProcessing || !amount || !destinationAddress
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-xl shadow-green-500/25"
              }`}
            >
              {isProcessing ? "Processing..." : `Withdraw ${amount || "0"} ${asset}`}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs text-slate-500 leading-relaxed">
              Withdrawals are processed within 24 hours. Please ensure the destination address is correct.
              Incorrect addresses may result in permanent loss of funds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
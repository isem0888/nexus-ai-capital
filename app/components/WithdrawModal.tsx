"use client";
import { useState } from "react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: string;
  balance: number;
}

export default function WithdrawModal({ isOpen, onClose, wallet, balance }: WithdrawModalProps) {
  const [asset, setAsset] = useState("ETH");
  const [amount, setAmount] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const amountNum = Number(amount) || 0;

  const handleWithdraw = async () => {
    setError("");

    if (!destinationAddress) {
      setError("Please enter destination address");
      return;
    }

    if (amountNum <= 0) {
      setError("Please enter valid amount");
      return;
    }

    if (amountNum > balance) {
      setError("Insufficient balance");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet,
          asset,
          amount: amountNum,
          destination_address: destinationAddress,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setAmount("");
          setDestinationAddress("");
        }, 3000);
      } else {
        setError(data.error || "Withdrawal failed");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
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
        <p className="text-slate-500 text-center mb-6 text-sm">
          Transfer your assets to an external wallet
        </p>

        {/* Balance */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <div className="text-xs text-slate-500 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-slate-900">${balance.toLocaleString()}</div>
        </div>

        <div className="space-y-4">
          {/* Asset Selection */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">Asset</label>
            <div className="grid grid-cols-3 gap-2">
              {(["ETH", "USDT", "BTC"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAsset(a)}
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
          </div>

          {/* Amount */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
            <div className="text-xs text-slate-500 mt-1">
              Min: 0.01 {asset} • Fee: ~$2.50
            </div>
          </div>

          {/* Destination Address */}
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2">
              Destination Address
            </label>
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder={`Enter ${asset} address`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-600 text-sm">
              ✓ Withdrawal request submitted successfully!
            </div>
          )}

          {/* Submit Button */}
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

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>

        {/* Warning */}
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
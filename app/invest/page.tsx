"use client";
import { useState, useEffect } from "react";
import { useAccount, useWalletClient, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import ConnectWallet from "../components/ConnectWallet";

// ERC-20 ABI для USDT
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

// Адреса
const PLATFORM_ADDRESS = "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797";
const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

export default function InvestPage() {
  const [selectedAsset, setSelectedAsset] = useState<"ETH" | "BTC" | "USDT">("ETH");
  const [amount, setAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("flexible");
  const [copied, setCopied] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationStep, setConfirmationStep] = useState<"processing" | "confirmed" | "error">("processing");
  const { disconnect } = useDisconnect();

  // Актуальные цены
  const [prices, setPrices] = useState({
    ETH: 0,
    BTC: 0,
    USDT: 1,
  });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Загрузка актуальных цен с CoinGecko
  useEffect(() => {
    async function loadPrices() {
      setIsLoadingPrice(true);
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
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Price loading error:", error);
      } finally {
        setIsLoadingPrice(false);
      }
    }
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const minDeposits = {
    ETH: 0.5,
    BTC: 0.01,
    USDT: 1000,
  };

  const aprRates = {
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

  const currentAPR =
    aprRates[selectedAsset as keyof typeof aprRates][
      selectedPlan as keyof typeof aprRates.ETH
    ];
  const amountNum = Number(amount) || 0;
  const currentPrice = prices[selectedAsset as keyof typeof prices];
  const portfolioValue = amountNum * currentPrice;
  const annualReward = (amountNum * currentAPR) / 100;
  const dailyIncome = annualReward / 365;
  const monthlyIncome = annualReward / 12;
  const quarterlyIncome = annualReward / 4;
  const totalAfterYear = amountNum + annualReward;

  const copyAddress = () => {
    let addressToCopy = "";
    if (selectedAsset === "ETH" || selectedAsset === "USDT") {
      addressToCopy = "0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797";
    } else if (selectedAsset === "BTC") {
      addressToCopy = "bc1qflmk4rerlpruf5ge46gc6mlme7q99xgwdrmfxv";
    }
    navigator.clipboard.writeText(addressToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Отправка депозита через Next.js API
  const sendDepositToBackend = async (transactionHash?: string) => {
    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet: address,
          asset: selectedAsset,
          amount: amountNum,
          plan: selectedPlan || "flexible",
          txHash: transactionHash || null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("✓ Deposit recorded in database");
        return true;
      } else {
        console.error("Failed to record deposit:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Backend connection error:", error);
      return false;
    }
  };

  const sendTelegramNotification = async (transactionHash?: string) => {
    const message = ` <b>New Investment Request</b>
<b>Wallet:</b> ${address}
<b>Asset:</b> ${selectedAsset}
<b>Amount:</b> ${amountNum} ${selectedAsset}
<b>Plan:</b> ${selectedPlan}
<b>APR:</b> ${currentAPR}%
<b>Estimated Value:</b> $${portfolioValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
<b>Current Price:</b> $${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
${
  transactionHash
    ? `<b>Transaction Hash:</b>\n<a href="https://etherscan.io/tx/${transactionHash}">${transactionHash}</a>`
    : `<b>Payment Method:</b>\nManual Transfer`
}`.trim();

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }
      return true;
    } catch (error) {
      console.error("Notification error:", error);
      return false;
    }
  };

  // Показ модального окна подтверждения
  const showConfirmation = (step: "processing" | "confirmed" | "error" = "processing") => {
    setConfirmationStep(step);
    setShowConfirmationModal(true);
  };

  // Закрытие модального окна
  const closeConfirmation = () => {
    setShowConfirmationModal(false);
    if (confirmationStep === "confirmed") {
      setPaymentSent(true);
    }
  };

  const handlePayWithWallet = async () => {
    setError("");
    if (!walletClient || !address) {
      setError("Please connect your wallet first");
      return;
    }
    if (amountNum === 0) {
      setError("Please enter amount");
      return;
    }
    if (chain?.id !== 1) {
      setError("Please switch to Ethereum Mainnet network");
      return;
    }

    try {
      setIsSending(true);
      showConfirmation("processing");
      let transactionHash = "";

      if (selectedAsset === "ETH") {
        const tx = await walletClient.sendTransaction({
          to: PLATFORM_ADDRESS as `0x${string}`,
          value: ethers.parseEther(amount.toString()),
        });
        transactionHash = tx;
        setTxHash(tx);

        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const txResponse = await provider.getTransaction(tx);
        if (txResponse) {
          await txResponse.wait();
        }
      } else if (selectedAsset === "USDT") {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          [...ERC20_ABI, "function balanceOf(address) view returns (uint256)"],
          signer
        );

        const balance = await usdtContract.balanceOf(address);
        const amountInSmallestUnit = ethers.parseUnits(amount.toString(), 6);

        if (balance < amountInSmallestUnit) {
          const balanceFormatted = ethers.formatUnits(balance, 6);
          setError(`Insufficient USDT balance. You have: ${balanceFormatted} USDT`);
          setIsSending(false);
          setShowConfirmationModal(false);
          return;
        }

        const tx = await usdtContract.transfer(PLATFORM_ADDRESS, amountInSmallestUnit);
        transactionHash = tx.hash;
        setTxHash(tx.hash);
        await tx.wait();
      }

      await sendDepositToBackend(transactionHash);
      await sendTelegramNotification(transactionHash);

      setConfirmationStep("confirmed");
    } catch (err: any) {
      console.error("Payment error:", err);

      let errorMessage = "Payment failed. Please try again.";
      if (err.code === "ACTION_REJECTED" || err.message?.includes("User rejected")) {
        errorMessage = "Transaction rejected by user";
      } else if (err.message?.includes("invalid EIP-1193")) {
        errorMessage = "Wallet connection lost. Please refresh page and reconnect wallet.";
      } else if (err.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient ETH for gas fees";
      } else if (err.reason) {
        errorMessage = err.reason;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setConfirmationStep("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleManualPayment = async () => {
    setError("");
    if (!address) {
      setError("Please connect your wallet first");
      return;
    }
    if (amountNum === 0) {
      setError("Please enter amount");
      return;
    }

    try {
      setIsSending(true);
      showConfirmation("processing");

      const dbSuccess = await sendDepositToBackend();
      const tgSuccess = await sendTelegramNotification();

      if (tgSuccess) {
        setConfirmationStep("confirmed");
      } else {
        setConfirmationStep("error");
        setError("Failed to process investment");
      }
    } catch (err) {
      setError("Error processing payment");
      setConfirmationStep("error");
    } finally {
      setIsSending(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setPaymentSent(false);
    setTxHash("");
    setError("");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-10 py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="text-blue-600 uppercase tracking-[4px] text-sm mb-3 font-semibold">
            Nexus Investment Platform
          </div>
          <h1 className="text-5xl font-bold mb-4 text-slate-900">
            Complete Your Investment
          </h1>
          <p className="text-slate-600 text-lg">
            Review your investment details, choose a plan and fund your portfolio.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose Asset</h2>

            <div className="grid grid-cols-3 gap-4">
              {(["ETH", "BTC", "USDT"] as const).map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={
                    selectedAsset === asset
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl p-5 font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300"
                      : "bg-slate-100 text-slate-700 border border-slate-200 rounded-xl p-5 font-semibold hover:bg-slate-200 transition-all duration-300"
                  }
                >
                  {asset}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-900">Amount</h2>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9.]/g, "");
                const parts = value.split(".");
                if (parts.length > 2) {
                  value = parts[0] + "." + parts.slice(1).join("");
                }
                if (value.length > 1 && value.startsWith("0") && !value.startsWith("0.")) {
                  value = value.replace(/^0+/, "");
                }
                setAmount(value);
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
            <div className="text-slate-500 text-sm mt-2">
              Minimum deposit: {minDeposits[selectedAsset as keyof typeof minDeposits]}{" "}
              {selectedAsset}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-900">Investment Plan</h2>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            >
              {selectedAsset === "ETH" && (
                <>
                  <option value="flexible">Flexible (7.44% - 10.31% APR)</option>
                  <option value="30">Fixed 30 Days (11.9% APR)</option>
                  <option value="60">Fixed 60 Days (13.2% APR)</option>
                  <option value="180">Fixed 180 Days (14.8% APR)</option>
                </>
              )}
              {selectedAsset === "BTC" && (
                <>
                  <option value="flexible">Flexible (5.2% - 8.1% APR)</option>
                  <option value="30">Fixed 30 Days (9.6% APR)</option>
                  <option value="60">Fixed 60 Days (10.7% APR)</option>
                  <option value="180">Fixed 180 Days (11.9% APR)</option>
                </>
              )}
              {selectedAsset === "USDT" && (
                <>
                  <option value="flexible">Flexible (10.4% - 13.0% APR)</option>
                  <option value="30">Fixed 30 Days (14.21% APR)</option>
                  <option value="60">Fixed 60 Days (15.1% APR)</option>
                  <option value="180">Fixed 180 Days (16.0% APR)</option>
                </>
              )}
            </select>

            {/* Benefits Section */}
            <div className="mt-10">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-green-600 text-2xl font-bold">{currentAPR}%</div>
                  <div className="text-slate-500 text-sm mt-1">Current APR</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-blue-600 text-2xl font-bold">AI</div>
                  <div className="text-slate-500 text-sm mt-1">24/7 Trading</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                  <div className="text-green-600 text-2xl font-bold">365</div>
                  <div className="text-slate-500 text-sm mt-1">Days Yield</div>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-900">Investment Benefits</h3>
                <div className="space-y-3 text-slate-600">
                  <div>✓ AI-Powered Portfolio Management</div>
                  <div>✓ Daily Performance Monitoring</div>
                  <div>✓ Professional Risk Management</div>
                  <div>✓ Automated Trading Strategies</div>
                  <div>✓ Quarterly Profit Distribution</div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="text-blue-700 font-semibold mb-2">NexusAI Investment Platform</div>
                <div className="text-slate-600 text-sm leading-6">
                  Funds are managed using AI-powered trading systems, liquidity strategies and
                  on-chain analytics to maximize long-term portfolio growth while maintaining
                  controlled risk exposure.
                </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <h3 className="text-amber-700 font-bold mb-3">Important Notice</h3>
                <ul className="text-slate-600 text-sm space-y-2">
                  <li>• Send funds only to the address shown on the right.</li>
                  <li>• Deposits are usually confirmed within 5–30 minutes.</li>
                  <li>• Incorrect network transfers may result in loss of funds.</li>
                  <li>• Minimum investment amount is 1000 USDT equivalent.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Deposit Information</h2>

            <div className="space-y-5">
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Asset</span>
                <span className="font-semibold text-slate-900">{selectedAsset}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">
                  {amountNum} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Estimated Value</span>
                <span className="text-slate-900 font-bold">${formatPrice(portfolioValue)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Current Price</span>
                <div className="text-right">
                  <span className="text-blue-600 font-bold">${formatPrice(currentPrice)}</span>
                  {isLoadingPrice && (
                    <div className="text-xs text-blue-600 mt-1">Updating...</div>
                  )}
                  {lastUpdate && (
                    <div className="text-xs text-slate-400 mt-1">
                      Updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Plan</span>
                <span className="text-blue-600 font-semibold">{selectedPlan}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">APR</span>
                <span className="text-green-600 font-bold">{currentAPR}%</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Annual Reward</span>
                <span className="font-semibold text-slate-900">
                  {annualReward.toFixed(4)} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Daily Income</span>
                <span className="font-semibold text-slate-900">
                  {dailyIncome.toFixed(4)} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Monthly Income</span>
                <span className="font-semibold text-slate-900">
                  {monthlyIncome.toFixed(4)} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-slate-100">
                <span className="text-slate-500">Quarterly Income</span>
                <span className="font-semibold text-slate-900">
                  {quarterlyIncome.toFixed(4)} {selectedAsset}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total After 1 Year</span>
                <span className="text-green-600 font-bold text-lg">
                  {totalAfterYear.toFixed(4)} {selectedAsset}
                </span>
              </div>
            </div>

            {/* Deposit Block */}
            <div className="mt-10 border border-slate-200 rounded-2xl p-5 bg-slate-50">
              <div className="mb-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="text-slate-500 text-sm">Amount To Deposit</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {amountNum || 0} {selectedAsset}
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4 text-slate-900">Deposit Address</h3>

              {selectedAsset === "ETH" && (
                <>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex justify-center">
                    <img src="/qr-eth.png" alt="ETH QR" className="w-48 rounded-lg" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 break-all text-sm text-slate-700 font-mono">
                    0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797
                  </div>
                </>
              )}

              {selectedAsset === "BTC" && (
                <>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex justify-center">
                    <img src="/qr-btc.png" alt="BTC QR" className="w-48 rounded-lg" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 break-all text-sm text-slate-700 font-mono">
                    bc1qflmk4rerlpruf5ge46gc6mlme7q99xgwdrmfxv
                  </div>
                </>
              )}

              {selectedAsset === "USDT" && (
                <>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 flex justify-center">
                    <img src="/qr-usdt.png" alt="USDT QR" className="w-48 rounded-lg" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 break-all text-sm text-slate-700 font-mono">
                    0x438DEF8FaaA44b9AE4693C07C04b7b47C4a2d797
                  </div>
                </>
              )}

              <div className="mt-4 bg-white rounded-xl p-4 border border-slate-200">
                {selectedAsset === "ETH" && (
                  <>
                    <div className="text-blue-600 font-semibold">Network: Ethereum (ERC-20)</div>
                    <div className="text-slate-500 text-sm mt-2">Send only ETH to this address.</div>
                  </>
                )}
                {selectedAsset === "BTC" && (
                  <>
                    <div className="text-orange-600 font-semibold">Network: Bitcoin</div>
                    <div className="text-slate-500 text-sm mt-2">Send only BTC to this address.</div>
                  </>
                )}
                {selectedAsset === "USDT" && (
                  <>
                    <div className="text-green-600 font-semibold">Network: Ethereum (ERC-20)</div>
                    <div className="text-slate-500 text-sm mt-2">
                      Send only USDT ERC-20 to this address.
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={copyAddress}
              className="w-full mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition py-3 shadow-lg shadow-blue-500/25"
            >
              Copy Address
            </button>

            {copied && (
              <div className="mt-3 text-green-600 text-center text-sm font-medium">
                ✓ Address copied successfully
              </div>
            )}

            {isConnected && address && (
              <div className="mt-6 mb-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-green-700 font-semibold">Connected Wallet</div>
                    <div className="text-slate-700 text-sm break-all mt-2 font-mono">{address}</div>
                    {chain && chain.id !== 1 && (
                      <div className="text-red-600 text-xs mt-2">
                        Wrong network. Please switch to Ethereum Mainnet.
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="ml-4 px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-sm font-semibold transition"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}

            {!isConnected && (
              <div className="mt-6">
                <ConnectWallet />
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-red-600 font-bold">Error</div>
                <div className="text-slate-600 text-sm mt-2">{error}</div>
              </div>
            )}

            {isConnected && !paymentSent && (
              <div className="space-y-3 mt-6">
                {(selectedAsset === "ETH" || selectedAsset === "USDT") && (
                  <button
                    onClick={handlePayWithWallet}
                    disabled={isSending || amountNum === 0 || chain?.id !== 1}
                    className={`w-full rounded-xl py-4 font-bold text-lg transition ${
                      isSending || amountNum === 0 || chain?.id !== 1
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-500/25"
                    }`}
                  >
                    {isSending
                      ? "Processing Transaction..."
                      : amountNum === 0
                      ? "Launch Investment"
                      : chain?.id !== 1
                      ? "Switch to Ethereum Mainnet"
                      : `Launch Investment • ${amountNum} ${selectedAsset}`}
                  </button>
                )}

                {selectedAsset === "BTC" && (
                  <button
                    onClick={handleManualPayment}
                    disabled={isSending || amountNum === 0}
                    className={`w-full rounded-xl py-4 font-bold text-lg transition ${
                      isSending || amountNum === 0
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-blue-500/25"
                    }`}
                  >
                    {isSending
                      ? "Sending..."
                      : amountNum === 0
                      ? "Launch Investment"
                      : "I Have Sent BTC Manually"}
                  </button>
                )}

                {(selectedAsset === "ETH" || selectedAsset === "USDT") && (
                  <button
                    onClick={handleManualPayment}
                    disabled={isSending || amountNum === 0}
                    className={`w-full rounded-xl py-3 font-semibold transition border border-slate-200 ${
                      isSending || amountNum === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    I Sent Manually (without wallet)
                  </button>
                )}
              </div>
            )}

            {paymentSent && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-green-700 font-bold text-lg">✓ Investment Created Successfully</div>
                <div className="text-slate-600 text-sm mt-2">
                  Your investment has been recorded. Redirecting to dashboard...
                </div>
                {txHash && (
                  <div className="mt-3">
                    <div className="text-slate-500 text-xs">Transaction Hash:</div>
                    <a
                      href={`https://etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs break-all hover:underline"
                    >
                      {txHash}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ ИНВЕСТИЦИИ */}
      {/* ============================================ */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            
            {/* Кнопка закрытия (только если confirmed) */}
            {confirmationStep === "confirmed" && (
              <button
                onClick={closeConfirmation}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* ===== ШАГ 1: PROCESSING ===== */}
            {confirmationStep === "processing" && (
              <div className="text-center">
                {/* Анимированный спиннер */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                    <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-violet-600 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Investment</h2>
                <p className="text-slate-600 mb-6">
                  Please wait while we process your {amountNum} {selectedAsset} investment...
                </p>

                {/* Прогресс-бар */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-violet-600 rounded-full animate-[progress_3s_ease-in-out_infinite]" />
                </div>

                {/* Шаги обработки */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 text-sm">Transaction submitted</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                    </div>
                    <span className="text-slate-700 text-sm">Confirming on blockchain...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <span className="text-slate-400 text-sm">Recording in database</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    </div>
                    <span className="text-slate-400 text-sm">Activating AI strategy</span>
                  </div>
                </div>
              </div>
            )}

            {/* ===== ШАГ 2: CONFIRMED ===== */}
            {confirmationStep === "confirmed" && (
              <div className="text-center">
                {/* Успешная анимация */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-[scaleIn_0.5s_ease-out]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-600 animate-[checkmark_0.5s_ease-out_0.3s_both]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {/* Конфетти-эффект */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-blue-500 animate-[confetti_1s_ease-out]" />
                    <div className="absolute -top-1 -right-3 w-3 h-3 rounded-full bg-violet-500 animate-[confetti_1s_ease-out_0.1s]" />
                    <div className="absolute -bottom-2 -left-1 w-3 h-3 rounded-full bg-green-500 animate-[confetti_1s_ease-out_0.2s]" />
                    <div className="absolute -bottom-1 -right-2 w-4 h-4 rounded-full bg-amber-500 animate-[confetti_1s_ease-out_0.3s]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Investment Confirmed! 🎉</h2>
                <p className="text-slate-600 mb-6">
                  Your investment of <span className="font-bold text-green-600">{amountNum} {selectedAsset}</span> has been successfully processed.
                </p>

                {/* Детали инвестиции */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-left">
                  <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Investment Details</div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Asset</span>
                      <span className="font-semibold text-slate-900 text-sm">{selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Amount</span>
                      <span className="font-semibold text-slate-900 text-sm">{amountNum} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Value</span>
                      <span className="font-semibold text-slate-900 text-sm">${formatPrice(portfolioValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">APR</span>
                      <span className="font-semibold text-green-600 text-sm">{currentAPR}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Plan</span>
                      <span className="font-semibold text-blue-600 text-sm capitalize">{selectedPlan}</span>
                    </div>
                    {txHash && (
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-xs text-slate-500 mb-1">Transaction Hash</div>
                        <a
                          href={`https://etherscan.io/tx/${txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-xs break-all hover:underline font-mono"
                        >
                          {txHash.slice(0, 10)}...{txHash.slice(-8)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Прогноз дохода */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6">
                  <div className="text-xs text-green-700 font-semibold mb-2">Expected Annual Income</div>
                  <div className="text-2xl font-bold text-green-700">
                    +{annualReward.toFixed(4)} {selectedAsset}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    ≈ ${formatPrice(annualReward * currentPrice)} per year
                  </div>
                </div>

                {/* Кнопки */}
                <div className="space-y-3">
                  <button
                    onClick={closeConfirmation}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition shadow-lg shadow-blue-500/25"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setShowConfirmationModal(false);
                      setAmount("");
                      setTxHash("");
                    }}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium"
                  >
                    Make Another Investment
                  </button>
                </div>
              </div>
            )}

            {/* ===== ШАГ 3: ERROR ===== */}
            {confirmationStep === "error" && (
              <div className="text-center">
                {/* Иконка ошибки */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full bg-red-100" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Processing Failed</h2>
                <p className="text-slate-600 mb-6">
                  There was an issue processing your investment. Please try again or contact support.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                    <div className="text-xs text-red-700 font-semibold mb-1">Error Details</div>
                    <div className="text-red-600 text-sm">{error}</div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={closeConfirmation}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold hover:from-blue-500 hover:to-violet-500 transition shadow-lg shadow-blue-500/25"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        @keyframes checkmark {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx, 20px), var(--ty, -30px)) scale(0); }
        }
      `}</style>
    </main>
  );
}

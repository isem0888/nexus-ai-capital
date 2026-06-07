"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WithdrawModal from "../components/WithdrawModal"; // Импортируем модалку

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalBalance: 0,
    activeInvestments: 0,
    totalEarned: 0,
    pendingWithdrawals: 0,
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false); // Состояние для модалки

  // Загрузка данных дашборда по адресу кошелька
  useEffect(() => {
    if (!address) return;

    const loadDashboard = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/dashboard/${address}`);
        const data = await res.json();

        setStats({
          totalBalance: data.totalBalance || 0,
          activeInvestments: data.activeInvestments || 0,
          totalEarned: data.totalEarned || 0,
          pendingWithdrawals: data.pendingWithdrawals || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
    const interval = setInterval(loadDashboard, 10000);
    return () => clearInterval(interval);
  }, [address]);

  // Если кошелёк не подключен - возвращаем на главную
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-600">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-24">
      <div className="max-w-7xl mx-auto px-10 py-20">
        {/* Profile Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {address?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  Wallet Connected
                </div>
                <div className="text-slate-500 mt-1 font-mono text-sm">
                  {address}
                </div>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Active
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-100 transition font-semibold text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Your Investment Dashboard
          </h1>
          <p className="text-slate-500">
            Track your portfolio performance and manage your investments.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "investments", label: "My Investments", icon: "💼" },
            { id: "transactions", label: "Transactions", icon: "📜" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition rounded-full flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && <OverviewSection stats={stats} />}
        {activeTab === "investments" && <InvestmentsSection />}
        {activeTab === "transactions" && <TransactionsSection />}
        {activeTab === "settings" && <SettingsSection address={address} />}

        {/* Withdraw Modal - добавляем модалку */}
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          wallet={address || ""}
          balance={stats.totalBalance}
        />
      </div>
    </main>
  );
}

// Overview Section
function OverviewSection({ stats }: any) {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-semibold">
              +0.00%
            </div>
          </div>
          <div className="text-slate-500 text-sm mb-1">Total Balance</div>
          <div className="text-3xl font-bold text-blue-600">
            ${stats.totalBalance.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-slate-500 text-sm mb-1">Active Investments</div>
          <div className="text-3xl font-bold text-violet-600">
            {stats.activeInvestments}
          </div>
          <div className="text-slate-500 text-sm mt-2">Active plans</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="text-slate-500 text-sm mb-1">Total Earned</div>
          <div className="text-3xl font-bold text-green-600">
            ${stats.totalEarned.toLocaleString()}
          </div>
          <div className="text-slate-500 text-sm mt-2">Lifetime earnings</div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-slate-500 text-sm mb-1">Pending Withdrawals</div>
          <div className="text-3xl font-bold text-amber-600">
            ${stats.pendingWithdrawals.toLocaleString()}
          </div>
          <div className="text-slate-500 text-sm mt-2">Processing</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/invest"
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 rounded-2xl p-6 text-center transition shadow-lg shadow-blue-500/25 text-white"
          >
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-lg">New Investment</div>
            <div className="text-sm text-white/80 mt-1">Start earning today</div>
          </Link>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-2xl p-6 text-center transition shadow-lg shadow-green-500/25 text-white"
          >
            <div className="text-3xl mb-2">📤</div>
            <div className="font-bold text-lg">Withdraw Funds</div>
            <div className="text-sm text-white/80 mt-1">Cash out anytime</div>
          </button>

          <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-2xl p-6 text-center transition shadow-lg shadow-amber-500/25 text-white">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold text-lg">View Reports</div>
            <div className="text-sm text-white/80 mt-1">Track performance</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Recent Activity</h2>
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-xl font-semibold text-slate-700">No recent activity</div>
          <div className="text-slate-500 text-sm mt-2">Your transactions will appear here</div>
        </div>
      </div>
    </div>
  );
}

// Investments Section
function InvestmentsSection() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">My Investments</h2>
        <Link
          href="/invest"
          className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 px-6 py-3 rounded-xl font-semibold transition text-white shadow-lg shadow-blue-500/25"
        >
          New Investment
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-slate-900">No active investments</div>
          <div className="text-slate-500 mt-2">
            Start your first investment to see it here
          </div>
          <Link
            href="/invest"
            className="inline-block mt-8 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 px-8 py-4 rounded-xl font-semibold transition text-white shadow-lg shadow-blue-500/25"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

// Transactions Section
function TransactionsSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Transaction History</h2>
      <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-xl">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-slate-900">No transactions yet</div>
          <div className="text-slate-500 mt-2">
            Your transaction history will be displayed here
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Section
function SettingsSection({ address }: { address: string | undefined }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-900">Settings</h2>

      {/* Profile Information */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-bold mb-6 text-slate-900">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-600 mb-2 font-medium">Wallet Address</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-700 break-all">
              {address || "Not connected"}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-semibold text-green-700">Wallet Connected</div>
                <div className="text-sm text-green-600">Your wallet is securely connected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
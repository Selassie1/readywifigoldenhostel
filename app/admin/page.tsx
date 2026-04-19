// app/admin/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Upload,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Wifi,
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  MessageSquare,
  Trash2,
  X,
  LogOut,
  Shield,
  Tv2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface DashboardStats {
  totalVouchers: number;
  unusedVouchers: number;
  soldVouchers: number;
  totalSales: number;
  totalRevenue: number;
  paidSales: number;
  paidRevenue: number;
  totalPpsk: number;
  unusedPpsk: number;
  assignedPpsk: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<{
    weeklySales: { name: string; sales: number }[];
    revenueByPlan: { name: string; value: number }[];
  }>({ weeklySales: [], revenueByPlan: [] });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showManualVerify, setShowManualVerify] = useState(false);
  const [showClearDatabase, setShowClearDatabase] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth/check");
      const data = await response.json();

      if (data.authenticated) {
        setAuthenticated(true);
        fetchStats();
      } else {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setModalMessage("Logout failed");
      setShowError(true);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch voucher stats
      const voucherResponse = await fetch("/api/admin/vouchers/list?limit=1");
      const voucherData = await voucherResponse.json();

      // Fetch sales stats
      const salesResponse = await fetch("/api/admin/sales/list?limit=1");
      const salesData = await salesResponse.json();

    // Fetch PPSK stats
      const ppskResponse = await fetch("/api/admin/ppsk/list?limit=1");
      const ppskData = await ppskResponse.json();

      setStats({
        totalVouchers: voucherData.pagination?.total || 0,
        unusedVouchers: voucherData.statusCounts?.unused || 0,
        soldVouchers: voucherData.statusCounts?.sold || 0,
        totalSales: salesData.summary?.totalSales || 0,
        totalRevenue: salesData.summary?.totalRevenue || 0,
        paidSales: salesData.summary?.paidSales || 0,
        paidRevenue: salesData.summary?.paidRevenue || 0,
        totalPpsk: (ppskData.statusCounts?.unused || 0) + (ppskData.statusCounts?.assigned || 0),
        unusedPpsk: ppskData.statusCounts?.unused || 0,
        assignedPpsk: ppskData.statusCounts?.assigned || 0,
      });

      if (salesData.chartData) {
        setChartData({
          weeklySales: salesData.chartData.weeklySales || [],
          revenueByPlan: salesData.chartData.revenueByPlan || [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fixSalesData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/fix-sales", { method: "POST" });
      const result = await response.json();

      if (result.success) {
        setModalMessage(
          `Sales data fixed! Updated ${result.stats.salesUpdated} sales and fixed ${result.stats.vouchersFixed} vouchers.`
        );
        setShowSuccess(true);
        fetchStats(); // Refresh stats
      } else {
        setModalMessage("Failed to fix sales data");
        setShowError(true);
      }
    } catch (error) {
      console.error("Failed to fix sales data:", error);
      setModalMessage("Failed to fix sales data");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const manualVerifyPayment = async () => {
    if (!paymentRef.trim()) {
      setModalMessage("Please enter a payment reference");
      setShowError(true);
      return;
    }

    try {
      setVerifying(true);
      const response = await fetch(
        `/api/payments/verify?reference=${paymentRef}`
      );
      const result = await response.json();

      if (result.success) {
        const ppskDetail = result.data.ppskPassword ? `\nPPSK Code: ${result.data.ppskPassword}` : "";
        setModalMessage(
          `Payment verified successfully!\nVoucher Code: ${result.data.voucherCode}${ppskDetail}\nPlan: ${result.data.plan}\nAmount: GHS ${(result.data.amount || 0).toFixed(2)}`
        );
        setShowSuccess(true);
        setPaymentRef("");
        setShowManualVerify(false);
        fetchStats(); // Refresh stats
      } else {
        setModalMessage(`Verification failed: ${result.error}`);
        setShowError(true);
      }
    } catch (error) {
      console.error("Manual verification error:", error);
      setModalMessage("Failed to verify payment");
      setShowError(true);
    } finally {
      setVerifying(false);
    }
  };

  const clearDatabase = async () => {
    try {
      const response = await fetch("/api/admin/clear-database", {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setModalMessage("Database cleared successfully!");
        setShowSuccess(true);
        setShowClearDatabase(false);
        fetchStats(); // Refresh stats
      } else {
        setModalMessage("Failed to clear database");
        setShowError(true);
      }
    } catch (error) {
      console.error("Clear database error:", error);
      setModalMessage("Error clearing database");
      setShowError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-deep)" }}>
        <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-2xl shadow-violet-500/30">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      {/* Header */}
      <header className="relative z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">Admin Dashboard</h1>
                <p className="text-[10px] text-slate-600 leading-none">ReadyWifi · Golden Hostel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors border border-white/8 hover:border-white/15 rounded-lg">
                <ArrowLeft className="h-3.5 w-3.5" /><span className="hidden sm:inline">Back to Site</span>
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors border border-white/8 hover:border-red-500/30 rounded-lg">
                <LogOut className="h-3.5 w-3.5" /><span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <Package className="h-5 w-5 text-blue-400" />, color: "from-blue-500 to-indigo-600", glow: "rgba(99,102,241,0.15)", label: "Voucher Inventory", sub: "Total codes", val: stats?.totalVouchers || 0, hoverBorder: "rgba(99,102,241,0.3)" },
            { icon: <CheckCircle className="h-5 w-5 text-green-400" />, color: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.12)", label: "Ready to Sell", sub: "Unused codes", val: stats?.unusedVouchers || 0, hoverBorder: "rgba(34,197,94,0.3)" },
            { icon: <ShoppingCart className="h-5 w-5 text-amber-400" />, color: "from-amber-500 to-orange-600", glow: "rgba(251,191,36,0.12)", label: "Transactions", sub: "All sales", val: stats?.totalSales || 0, hoverBorder: "rgba(251,191,36,0.3)" },
            { icon: <DollarSign className="h-5 w-5 text-violet-400" />, color: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.12)", label: "Total Revenue", sub: "Completed sales", val: `GHS ${(stats?.paidRevenue || 0).toFixed(2)}`, hoverBorder: "rgba(139,92,246,0.3)" },
          ].map((c, i) => (
            <div key={i} className="glass-strong rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.glow}, rgba(255,255,255,0.03))`, border: "1px solid rgba(255,255,255,0.07)" }}>
                  {c.icon}
                </div>
                <p className="text-2xl font-bold text-white">{c.val}</p>
              </div>
              <p className="text-sm font-semibold text-slate-300">{c.label}</p>
              <p className="text-xs text-slate-600">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* PPSK Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: <Tv2 className="h-5 w-5 text-fuchsia-400" />, glow: "rgba(217,70,239,0.1)", label: "PPSK Inventory", sub: "TV/Console passwords", val: stats?.totalPpsk || 0 },
            { icon: <Unlock className="h-5 w-5 text-green-400" />, glow: "rgba(34,197,94,0.1)", label: "PPSK Available", sub: "Ready to assign", val: stats?.unusedPpsk || 0 },
            { icon: <Lock className="h-5 w-5 text-violet-400" />, glow: "rgba(139,92,246,0.1)", label: "PPSK Assigned", sub: "Already distributed", val: stats?.assignedPpsk || 0 },
          ].map((c, i) => (
            <div key={i} className="glass-strong rounded-2xl border border-white/6 p-5 hover:border-white/12 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.glow}, rgba(255,255,255,0.03))`, border: "1px solid rgba(255,255,255,0.07)" }}>{c.icon}</div>
                <p className="text-2xl font-bold text-white">{c.val}</p>
              </div>
              <p className="text-sm font-semibold text-slate-300">{c.label}</p>
              <p className="text-xs text-slate-600">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { href: "/admin/vouchers/upload", icon: <Upload className="h-6 w-6" />, label: "Upload Vouchers", sub: "Import CSV", grad: "from-blue-500 to-indigo-600", glow: "rgba(99,102,241,0.15)" },
              { href: "/admin/ppsk", icon: <Tv2 className="h-6 w-6" />, label: "Upload PPSK", sub: "TV passwords", grad: "from-fuchsia-500 to-pink-600", glow: "rgba(217,70,239,0.12)" },
              { href: "/admin/vouchers", icon: <Package className="h-6 w-6" />, label: "Manage Vouchers", sub: "Inventory", grad: "from-green-500 to-emerald-600", glow: "rgba(34,197,94,0.12)" },
              { href: "/admin/ppsk/list", icon: <Lock className="h-6 w-6" />, label: "Manage PPSK", sub: "TV inventory", grad: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.12)" },
              { href: "/admin/sales", icon: <ShoppingCart className="h-6 w-6" />, label: "View Sales", sub: "Transactions", grad: "from-amber-500 to-orange-600", glow: "rgba(251,191,36,0.12)" },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="glass-strong rounded-2xl border border-white/6 p-4 text-center hover:border-white/12 transition-all duration-300 group hover:-translate-y-0.5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.grad} flex items-center justify-center text-white mx-auto mb-3 shadow-lg`}>
                  {a.icon}
                </div>
                <p className="text-xs font-semibold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">{a.label}</p>
                <p className="text-[10px] text-slate-600">{a.sub}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Tools */}
        <div className="glass-strong rounded-2xl border border-white/6 p-6 mb-6">
          <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-400" />Admin Tools
          </h2>
          <p className="text-xs text-slate-600 mb-5">Support and system management</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { onClick: () => setShowManualVerify(true), icon: <Search className="h-6 w-6" />, label: "Manual Verification", sub: "Verify payment & resend code", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)", ic: "text-indigo-400" },
              { onClick: fixSalesData, icon: <RefreshCw className="h-6 w-6" />, label: "Fix Sales Data", sub: "Sync voucher and sales status", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.25)", ic: "text-orange-400" },
              { onClick: () => setShowClearDatabase(true), icon: <Trash2 className="h-6 w-6" />, label: "Clear Database", sub: "Reset all data (irreversible)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", ic: "text-red-400" },
            ].map((t, i) => (
              <button key={i} onClick={t.onClick}
                className="rounded-xl p-5 text-center hover:brightness-110 transition-all duration-200 group border"
                style={{ background: t.bg, borderColor: t.border }}>
                <div className={`text-center mx-auto mb-3 ${t.ic}`}>{t.icon}</div>
                <p className={`text-sm font-semibold mb-1 ${t.ic}`}>{t.label}</p>
                <p className="text-xs text-slate-500">{t.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="glass-strong rounded-2xl border border-white/6 p-6 mb-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-400" />System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { dot: "bg-green-400", animate: true, title: "System Health", val: "All systems operational", sub: "Last checked: Just now" },
              { dot: "bg-indigo-400", animate: false, title: "Sales Activity", val: `${stats?.soldVouchers || 0} vouchers sold`, sub: `Revenue: GHS ${(stats?.paidRevenue || 0).toFixed(2)}` },
              { dot: "bg-amber-400", animate: false, title: "Inventory", val: `${stats?.unusedVouchers || 0} available`, sub: `Total: ${stats?.totalVouchers || 0} vouchers` },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${s.dot} ${s.animate ? "animate-pulse" : ""}`} />
                  <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-slate-400 mb-1">{s.val}</p>
                <p className="text-xs text-slate-600">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="glass-strong rounded-2xl border border-white/6 p-6">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />Analytics Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h3 className="text-sm font-semibold text-white mb-4">Weekly Sales</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.weeklySales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="sales" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                      itemStyle={{ color: "#22d3ee" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl p-5 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h3 className="text-sm font-semibold text-white mb-4">Revenue by Plan</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.revenueByPlan} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} axisLine={{ stroke: "#334155" }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px", color: "#f8fafc" }}
                      itemStyle={{ color: "#a855f7" }}
                      cursor={{ fill: "#334155", opacity: 0.4 }}
                    />
                    <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Verification Modal */}
      {showManualVerify && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-strong rounded-2xl border border-white/10 p-7 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-indigo-400" />Manual Verification
              </h3>
              <button onClick={() => setShowManualVerify(false)} className="text-slate-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-sm text-slate-400 mb-5">Enter the payment reference to verify and resend the voucher code to the customer.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Payment Reference</label>
                <input type="text" value={paymentRef} onChange={e => setPaymentRef(e.target.value)}
                  placeholder="e.g., WEB_1234567890_abc123"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }} />
              </div>
              <div className="flex gap-3">
                <button onClick={manualVerifyPayment} disabled={verifying}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  {verifying ? "Verifying…" : "Verify Payment"}
                </button>
                <button onClick={() => setShowManualVerify(false)}
                  className="px-5 py-3 rounded-xl text-sm glass border border-white/8 text-slate-400 hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Database Modal */}
      {showClearDatabase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-strong rounded-2xl border border-red-500/20 p-7 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-400" />Clear Database
              </h3>
              <button onClick={() => setShowClearDatabase(false)} className="text-slate-500 hover:text-white transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="rounded-xl p-4 mb-5 border border-red-500/20" style={{ background: "rgba(239,68,68,0.08)" }}>
              <div className="flex gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-red-400">Irreversible Action</span>
              </div>
              <p className="text-xs text-red-200/70">This will permanently delete all vouchers, PPSK passwords, sales, and logs. This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={clearDatabase}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(135deg, #dc2626, #db2777)" }}>Clear Database</button>
              <button onClick={() => setShowClearDatabase(false)}
                className="px-5 py-3 rounded-xl text-sm glass border border-white/8 text-slate-400 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Success!</h3>
              <p className="text-slate-400 mb-6 whitespace-pre-line">
                {modalMessage}
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Error</h3>
              <p className="text-slate-400 mb-6 whitespace-pre-line">
                {modalMessage}
              </p>
              <button
                onClick={() => setShowError(false)}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

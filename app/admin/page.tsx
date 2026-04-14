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
        setModalMessage(
          `Payment verified successfully!\nVoucher Code: ${result.data.voucherCode}\nPlan: ${result.data.plan}\nAmount: GHS ${result.data.amount}`
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-500/30 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg">
                <Wifi className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Admin Dashboard
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  ReadyWifi Management System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/"
                className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Back to Site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-red-500/50"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          {/* Total Vouchers Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg lg:rounded-xl group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.totalVouchers || 0}
                </p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
              Voucher Inventory
            </h3>
            <p className="text-xs text-slate-500 hidden sm:block">
              All voucher codes in system
            </p>
          </div>

          {/* Available Vouchers Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg lg:rounded-xl group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.unusedVouchers || 0}
                </p>
                <p className="text-xs text-slate-400">Available</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
              Ready to Sell
            </h3>
            <p className="text-xs text-slate-500 hidden sm:block">
              Unused voucher codes
            </p>
          </div>

          {/* Total Sales Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-amber-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg lg:rounded-xl group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-amber-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.totalSales || 0}
                </p>
                <p className="text-xs text-slate-400">Sales</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
              Total Transactions
            </h3>
            <p className="text-xs text-slate-500 hidden sm:block">
              All sales processed
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg lg:rounded-xl group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  GHS {stats?.paidRevenue || 0}
                </p>
                <p className="text-xs text-slate-400">Revenue</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
              Total Revenue
            </h3>
            <p className="text-xs text-slate-500 hidden sm:block">
              From completed sales
            </p>
          </div>
        </div>

        {/* PPSK Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg lg:rounded-xl">
                <Tv2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.totalPpsk || 0}
                </p>
                <p className="text-xs text-slate-400">Total</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">PPSK Inventory</h3>
            <p className="text-xs text-slate-500 hidden sm:block">All TV/Console passwords</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg lg:rounded-xl">
                <Unlock className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.unusedPpsk || 0}
                </p>
                <p className="text-xs text-slate-400">Available</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">PPSK Available</h3>
            <p className="text-xs text-slate-500 hidden sm:block">Ready to assign</p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg lg:rounded-xl">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {stats?.assignedPpsk || 0}
                </p>
                <p className="text-xs text-slate-400">Assigned</p>
              </div>
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">PPSK Assigned</h3>
            <p className="text-xs text-slate-500 hidden sm:block">Already distributed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <Activity className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-cyan-400" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link
              href="/admin/vouchers/upload"
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-cyan-500/10"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors">
                  Upload Vouchers
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Import voucher codes from CSV files
                </p>
              </div>
            </Link>

            {/* PPSK Upload Card */}
            <Link
              href="/admin/ppsk"
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  <Tv2 className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors">
                  Upload PPSK
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  TV &amp; Console passwords (PPSK)
                </p>
              </div>
            </Link>

            <Link
              href="/admin/vouchers"
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-green-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-green-500/10"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-green-300 transition-colors">
                  Manage Vouchers
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  View and manage voucher inventory
                </p>
              </div>
            </Link>

            {/* PPSK List Card */}
            <Link
              href="/admin/ppsk/list"
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-purple-500/10"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-purple-300 transition-colors">
                  Manage PPSK
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  View TV/Console password inventory
                </p>
              </div>
            </Link>

            <Link
              href="/admin/sales"
              className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 hover:border-amber-500/50 transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-amber-500/10"
            >
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                  <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-amber-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-amber-300 transition-colors">
                  View Sales
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Monitor sales and transaction history
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Admin Tools */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-cyan-400" />
            Admin Tools
          </h2>
          <p className="text-slate-400 mb-4 sm:mb-6 text-sm sm:text-base">
            Customer support and system management tools
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <button
              onClick={() => setShowManualVerify(true)}
              className="flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-cyan-500/30 transition-colors">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2 group-hover:text-cyan-300 transition-colors">
                  Manual Verification
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Verify payment and resend voucher code
                </p>
              </div>
            </button>

            <button
              onClick={fixSalesData}
              className="flex items-center justify-center px-6 py-8 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-xl hover:from-orange-500/30 hover:to-amber-500/30 hover:border-orange-500/50 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/30 transition-colors">
                  <RefreshCw className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
                  Fix Sales Data
                </h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Sync voucher and sales status
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowClearDatabase(true)}
              className="flex items-center justify-center px-6 py-8 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-500/50 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500/30 transition-colors">
                  <Trash2 className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                  Clear Database
                </h3>
                <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  Reset all data (irreversible)
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-cyan-400" />
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <h3 className="text-lg font-semibold text-white">
                  System Health
                </h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                All systems operational
              </p>
              <p className="text-xs text-slate-500">Last checked: Just now</p>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-white">
                  Sales Activity
                </h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                {stats?.soldVouchers || 0} vouchers sold today
              </p>
              <p className="text-xs text-slate-500">
                Revenue: GHS {stats?.paidRevenue || 0}
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-3"></div>
                <h3 className="text-lg font-semibold text-white">Inventory</h3>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                {stats?.unusedVouchers || 0} vouchers available
              </p>
              <p className="text-xs text-slate-500">
                Total: {stats?.totalVouchers || 0} vouchers
              </p>
            </div>
      </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 mt-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <BarChart3 className="h-6 w-6 mr-3 text-cyan-400" />
            Analytics Overview
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Sales</h3>
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

            {/* Revenue Distribution */}
            <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/30">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue by Plan</h3>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Search className="h-5 w-5 mr-2 text-cyan-400" />
                Manual Verification
              </h3>
              <button
                onClick={() => setShowManualVerify(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-400 mb-6">
              Enter the payment reference to verify and resend the voucher code
              to the customer.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  placeholder="e.g., WEB_1234567890_abc123"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={manualVerifyPayment}
                  disabled={verifying}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying ? "Verifying..." : "Verify Payment"}
                </button>
                <button
                  onClick={() => setShowManualVerify(false)}
                  className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Database Modal */}
      {showClearDatabase && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Trash2 className="h-5 w-5 mr-2 text-red-400" />
                Clear Database
              </h3>
              <button
                onClick={() => setShowClearDatabase(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-400 font-semibold">Warning</span>
                </div>
                <p className="text-red-300 text-sm">
                  This action will permanently delete all data including
                  vouchers, sales, and logs. This cannot be undone.
                </p>
              </div>
              <p className="text-slate-400 text-sm">
                Are you sure you want to proceed? Type "DELETE" to confirm.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearDatabase}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300"
              >
                Clear Database
              </button>
              <button
                onClick={() => setShowClearDatabase(false)}
                className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
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

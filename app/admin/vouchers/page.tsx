// app/admin/vouchers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Wifi,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Upload,
} from "lucide-react";

interface Voucher {
  _id: string;
  code: string;
  plan: string;
  status: string;
  batchId: string;
  soldToPhone?: string;
  soldChannel?: string;
  soldAt?: string;
  createdAt: string;
}

interface VoucherListResponse {
  vouchers: Voucher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  statusCounts: Record<string, number>;
}

export default function VoucherListPage() {
  const [data, setData] = useState<VoucherListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    plan: "",
    status: "",
    batchId: "",
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchVouchers();
  }, [filters]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.plan) params.append("plan", filters.plan);
      if (filters.status) params.append("status", filters.status);
      if (filters.batchId) params.append("batchId", filters.batchId);
      params.append("page", filters.page.toString());
      params.append("limit", "20");

      const response = await fetch(`/api/admin/vouchers/list?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      unused: "badge-success",
      sold: "badge-warning",
      expired: "badge-danger",
      reserved: "badge-gray",
    };
    return `badge ${styles[status as keyof typeof styles] || "badge-gray"}`;
  };

  const getPlanName = (plan: string) => {
    // To add a new plan later, add its id → display name mapping here.
    const plans: Record<string, string> = {
      unlimited: "Unlimited",
    };
    return plans[plan] || plan;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/admin"
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Back</span>
              </Link>
              <div className="h-4 sm:h-6 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">
                    Vouchers
                  </h1>
                </div>
              </div>
            </div>
            <Link
              href="/admin/vouchers/upload"
              className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg text-xs sm:text-sm font-medium"
            >
              <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Upload Vouchers</span>
              <span className="sm:hidden">Upload</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Overview */}
        {data?.statusCounts && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg lg:rounded-xl group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {data.pagination.total}
                  </p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
                All Vouchers
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                Total voucher count
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-green-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg lg:rounded-xl group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {data.statusCounts.unused || 0}
                  </p>
                  <p className="text-xs text-slate-400">Available</p>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
                Ready to Sell
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                Unused vouchers
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-amber-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg lg:rounded-xl group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-300">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {data.statusCounts.sold || 0}
                  </p>
                  <p className="text-xs text-slate-400">Sold</p>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
                Sold Vouchers
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                Already purchased
              </p>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-3 sm:p-4 lg:p-6 hover:border-red-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg lg:rounded-xl group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-red-400" />
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                    {data.statusCounts.expired || 0}
                  </p>
                  <p className="text-xs text-slate-400">Expired</p>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-1">
                Expired Vouchers
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                No longer valid
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2 sm:mr-3 text-cyan-400" />
              Filters
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 sm:px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50"
            >
              {showFilters ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm">
                {showFilters ? "Hide" : "Show"} Filters
              </span>
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4 sm:space-y-6">
              {/* Plan Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Plan
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "", name: "All Plans", data: "All" },
                    { id: "unlimited", name: "Unlimited", data: "Unlimited" },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() =>
                        setFilters({ ...filters, plan: plan.id, page: 1 })
                      }
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        filters.plan === plan.id
                          ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-white">
                          {plan.name}
                        </h3>
                        {filters.plan === plan.id && (
                          <CheckCircle className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300">
                        {plan.data}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      id: "",
                      name: "All Status",
                      icon: Package,
                      color: "slate",
                    },
                    {
                      id: "unused",
                      name: "Unused",
                      icon: CheckCircle,
                      color: "green",
                    },
                    { id: "sold", name: "Sold", icon: Clock, color: "amber" },
                    {
                      id: "expired",
                      name: "Expired",
                      icon: XCircle,
                      color: "red",
                    },
                  ].map((status) => {
                    const Icon = status.icon;
                    return (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, status: status.id, page: 1 })
                        }
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          filters.status === status.id
                            ? `border-${status.color}-500/50 bg-${status.color}-500/10 shadow-lg shadow-${status.color}-500/10`
                            : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <Icon
                              className={`h-4 w-4 text-${status.color}-400`}
                            />
                            <h3 className="text-sm sm:text-base font-semibold text-white">
                              {status.name}
                            </h3>
                          </div>
                          {filters.status === status.id && (
                            <CheckCircle className="h-4 w-4 text-cyan-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Batch ID Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Batch ID
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.batchId}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        batchId: e.target.value,
                        page: 1,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                    placeholder="Enter batch ID to search..."
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Vouchers Table */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Sold To
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800/50 divide-y divide-slate-700/30">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan-500/30 border-t-cyan-500"></div>
                        <p className="text-slate-400 text-sm">
                          Loading vouchers...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : data?.vouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-lg font-medium">
                            No vouchers found
                          </p>
                          <p className="text-slate-500 text-sm">
                            Try adjusting your filters
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.vouchers.map((voucher) => (
                    <tr
                      key={voucher._id}
                      className="hover:bg-slate-700/30 transition-colors duration-200"
                    >
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <code className="text-sm font-mono bg-slate-700/50 text-cyan-400 px-3 py-2 rounded-lg border border-slate-600/50">
                          {voucher.code}
                        </code>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {getPlanName(voucher.plan)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            voucher.status === "unused"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : voucher.status === "sold"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : voucher.status === "expired"
                              ? "bg-red-500/20 text-red-300 border border-red-500/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                          }`}
                        >
                          {voucher.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-mono">
                        {voucher.batchId}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {voucher.soldToPhone || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {voucher.soldChannel ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-600/50 text-slate-300">
                            {voucher.soldChannel}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {formatDate(voucher.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="bg-slate-700/50 px-4 sm:px-6 py-4 flex items-center justify-between border-t border-slate-700/50">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page === 1}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page === data.pagination.pages}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-slate-300">
                    Showing{" "}
                    <span className="font-medium text-white">
                      {(filters.page - 1) * 20 + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-white">
                      {Math.min(filters.page * 20, data.pagination.total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-white">
                      {data.pagination.total}
                    </span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page - 1 })
                      }
                      disabled={filters.page === 1}
                      className="px-4 py-2 bg-slate-600 text-white rounded-l-lg hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-slate-600"
                    >
                      Previous
                    </button>
                    <div className="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-medium border-t border-b border-slate-600">
                      Page {filters.page} of {data.pagination.pages}
                    </div>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, page: filters.page + 1 })
                      }
                      disabled={filters.page === data.pagination.pages}
                      className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium border border-slate-600"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

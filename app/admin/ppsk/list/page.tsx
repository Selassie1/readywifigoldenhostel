// app/admin/ppsk/list/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Tv2,
  Upload,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  CheckCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

interface PpskPassword {
  _id: string;
  password: string;
  status: "unused" | "assigned";
  batchId: string;
  assignedToPhone?: string;
  assignedChannel?: string;
  assignedAt?: string;
  createdAt: string;
}

export default function PpskListPage() {
  const [passwords, setPasswords] = useState<PpskPassword[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    limit: 50,
  });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPasswords();
  }, [page, statusFilter]);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/ppsk/list?${params}`);
      const data = await res.json();
      setPasswords(data.passwords || []);
      setPagination(data.pagination || { total: 0, pages: 1, limit: 50 });
      setStatusCounts(data.statusCounts || {});
    } catch {
      toast.error("Failed to load PPSK passwords");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPasswords();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusBadge = (status: string) =>
    status === "unused" ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
        <Unlock className="h-3 w-3 mr-1" />
        Unused
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
        <Lock className="h-3 w-3 mr-1" />
        Assigned
      </span>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-slate-600" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Tv2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    PPSK Passwords
                  </h1>
                  <p className="text-xs text-slate-400">
                    TV &amp; Console Access Inventory
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/admin/ppsk"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-semibold shadow"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload More
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-4">
            <p className="text-xs text-slate-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-white">
              {(statusCounts.unused || 0) + (statusCounts.assigned || 0)}
            </p>
          </div>
          <div className="bg-green-500/10 rounded-xl border border-green-500/20 p-4">
            <p className="text-xs text-green-400 mb-1">Available</p>
            <p className="text-2xl font-bold text-green-400">
              {statusCounts.unused || 0}
            </p>
          </div>
          <div className="bg-purple-500/10 rounded-xl border border-purple-500/20 p-4">
            <p className="text-xs text-purple-400 mb-1">Assigned</p>
            <p className="text-2xl font-bold text-purple-400">
              {statusCounts.assigned || 0}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by password..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
              >
                Search
              </button>
            </form>

            {/* Status filter */}
            <div className="flex gap-2">
              {[
                { id: "", label: "All" },
                { id: "unused", label: "Available" },
                { id: "assigned", label: "Assigned" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setStatusFilter(f.id);
                    setPage(1);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    statusFilter === f.id
                      ? "bg-purple-600 text-white"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                onClick={() => fetchPasswords()}
                className="p-2 bg-slate-700/50 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white transition"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            </div>
          ) : passwords.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No PPSK passwords found</p>
              <p className="text-slate-500 text-sm mt-1">
                Upload a CSV from the Upload PPSK page
              </p>
              <Link
                href="/admin/ppsk"
                className="inline-flex items-center mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Passwords
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50 bg-slate-700/30">
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">#</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Password</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Assigned To</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Assigned At</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Batch</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-semibold">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passwords.map((pw, i) => (
                      <tr
                        key={pw._id}
                        className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {(page - 1) * 50 + i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <code className="font-mono text-purple-300 bg-slate-700/50 px-2 py-1 rounded text-xs">
                            {pw.password}
                          </code>
                        </td>
                        <td className="px-4 py-3">{statusBadge(pw.status)}</td>
                        <td className="px-4 py-3 text-slate-300 text-xs">
                          {pw.assignedToPhone || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {pw.assignedAt ? formatDate(pw.assignedAt) : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">
                          {pw.batchId?.slice(0, 12)}…
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(pw.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-slate-700/30">
                {passwords.map((pw, i) => (
                  <div key={pw._id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-purple-300 bg-slate-700/50 px-2 py-1 rounded text-xs">
                        {pw.password}
                      </code>
                      {statusBadge(pw.status)}
                    </div>
                    {pw.assignedToPhone && (
                      <p className="text-xs text-slate-400">
                        Assigned to: <span className="text-white">{pw.assignedToPhone}</span>
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Added: {formatDate(pw.createdAt)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-4 border-t border-slate-700/30">
                  <p className="text-xs text-slate-400">
                    {pagination.total} total · Page {page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 bg-slate-700/50 text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="p-2 bg-slate-700/50 text-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

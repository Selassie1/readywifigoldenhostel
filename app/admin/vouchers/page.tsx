// app/admin/vouchers/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Package, Search, Filter, Eye, EyeOff,
  CheckCircle, Clock, XCircle, Upload, Wifi,
} from "lucide-react";

interface Voucher {
  _id: string; code: string; plan: string; status: string;
  batchId: string; soldToPhone?: string; soldChannel?: string;
  soldAt?: string; createdAt: string;
}
interface VoucherListResponse {
  vouchers: Voucher[];
  pagination: { page: number; limit: number; total: number; pages: number };
  statusCounts: Record<string, number>;
}

/* ── shared sub-components ───────────────────────────────────────── */
const AdminHeader = ({ title, sub, icon, right }: {
  title: string; sub?: string; icon: React.ReactNode; right?: React.ReactNode;
}) => (
  <header className="relative z-20 glass border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />Back
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
              {icon}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">{title}</h1>
              {sub && <p className="text-[10px] text-slate-600 leading-none">{sub}</p>}
            </div>
          </div>
        </div>
        {right}
      </div>
    </div>
  </header>
);

export default function VoucherListPage() {
  const [data, setData] = useState<VoucherListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ plan: "", status: "", batchId: "", page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchVouchers(); }, [filters]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filters.plan)    p.append("plan", filters.plan);
      if (filters.status)  p.append("status", filters.status);
      if (filters.batchId) p.append("batchId", filters.batchId);
      p.append("page", filters.page.toString());
      p.append("limit", "20");
      const res = await fetch(`/api/admin/vouchers/list?${p}`);
      setData(await res.json());
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const statusColors: Record<string, string> = {
    unused:   "bg-green-500/15 text-green-400 border-green-500/25",
    sold:     "bg-amber-500/15 text-amber-400 border-amber-500/25",
    expired:  "bg-red-500/15 text-red-400 border-red-500/25",
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />

      <AdminHeader
        title="Vouchers"
        sub="Inventory management"
        icon={<Package className="h-4 w-4" />}
        right={
          <Link href="/admin/vouchers/upload"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Upload className="h-3.5 w-3.5" /><span className="hidden sm:inline">Upload Vouchers</span>
          </Link>
        }
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stat cards */}
        {data?.statusCounts && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "All Vouchers",    sub: "Total", val: data.pagination.total,           icon: <Package className="h-4 w-4 text-blue-400" />,  glow: "rgba(99,102,241,0.12)" },
              { label: "Ready to Sell",   sub: "Unused", val: data.statusCounts.unused || 0,  icon: <CheckCircle className="h-4 w-4 text-green-400" />, glow: "rgba(34,197,94,0.1)" },
              { label: "Sold Vouchers",   sub: "Sold",   val: data.statusCounts.sold || 0,    icon: <Clock className="h-4 w-4 text-amber-400" />,    glow: "rgba(251,191,36,0.1)" },
              { label: "Expired",         sub: "Invalid",val: data.statusCounts.expired || 0, icon: <XCircle className="h-4 w-4 text-red-400" />,    glow: "rgba(239,68,68,0.1)" },
            ].map((c, i) => (
              <div key={i} className="glass-strong rounded-2xl border border-white/6 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg,${c.glow},rgba(255,255,255,0.02))`, border: "1px solid rgba(255,255,255,0.07)" }}>{c.icon}</div>
                  <p className="text-xl font-bold text-white">{c.val}</p>
                </div>
                <p className="text-xs font-semibold text-slate-300">{c.label}</p>
                <p className="text-[10px] text-slate-600">{c.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="glass-strong rounded-2xl border border-white/6 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-white flex items-center gap-2"><Filter className="h-3.5 w-3.5 text-indigo-400" />Filters</h2>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-400 hover:text-white rounded-lg border border-white/8 transition-colors">
              {showFilters ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>
          {showFilters && (
            <div className="space-y-4 pt-2 border-t border-white/5">
              {/* Status pills */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: "All" }, { id: "unused", name: "Unused" }, { id: "sold", name: "Sold" }, { id: "expired", name: "Expired" }].map(s => (
                    <button key={s.id} onClick={() => setFilters({ ...filters, status: s.id, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.status === s.id ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                      style={filters.status !== s.id ? { background: "rgba(255,255,255,0.04)" } : {}}>
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Batch ID */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Batch ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                  <input type="text" value={filters.batchId}
                    onChange={e => setFilters({ ...filters, batchId: e.target.value, page: 1 })}
                    className={`${inputCls} pl-9`} style={inputStyle} placeholder="Search by batch ID…" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="glass-strong rounded-2xl border border-white/6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Code", "Plan", "Status", "Batch ID", "Sold To", "Channel", "Created"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-600">Loading vouchers…</p>
                  </td></tr>
                ) : data?.vouchers.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <Package className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No vouchers found</p>
                    <p className="text-xs text-slate-700 mt-1">Try adjusting your filters</p>
                  </td></tr>
                ) : data?.vouchers.map(v => (
                  <tr key={v._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <code className="text-xs font-mono text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.08)" }}>{v.code}</code>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border text-indigo-300 bg-indigo-500/10 border-indigo-500/20 capitalize">{v.plan}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border capitalize ${statusColors[v.status] || "bg-slate-500/15 text-slate-400 border-slate-500/25"}`}>{v.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 font-mono">{v.batchId?.slice(0, 10)}…</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400">{v.soldToPhone || "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {v.soldChannel ? <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-slate-400 border border-white/8">{v.soldChannel.toUpperCase()}</span> : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">{formatDate(v.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs text-slate-600">
                {(filters.page - 1) * 20 + 1}–{Math.min(filters.page * 20, data.pagination.total)} of {data.pagination.total}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setFilters({ ...filters, page: filters.page - 1 })} disabled={filters.page === 1}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
                  Previous
                </button>
                <span className="px-3 py-1.5 text-xs text-slate-500">Page {filters.page} of {data.pagination.pages}</span>
                <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page === data.pagination.pages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

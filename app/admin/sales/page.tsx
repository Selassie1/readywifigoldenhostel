// app/admin/sales/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ShoppingCart, Search, Filter, RefreshCw, Mail,
  CheckCircle, Clock, XCircle, DollarSign, TrendingUp,
  Eye, EyeOff, Calendar, Globe, Smartphone, Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

interface Sale {
  _id: string; saleId: string; phone: string; plan: string;
  amount: number; currency: string; channel: string;
  status: string; voucherCode?: string; createdAt: string;
}
interface SalesListResponse {
  sales: Sale[];
  pagination: { page: number; limit: number; total: number; pages: number };
  summary: { totalSales: number; totalRevenue: number; paidSales: number; paidRevenue: number };
}

export default function SalesListPage() {
  const [data, setData]           = useState<SalesListResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [filters, setFilters]     = useState({ plan: "", status: "", channel: "", startDate: "", endDate: "", month: "", page: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const [resendingSms, setResendingSms] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  useEffect(() => { fetchSales(); }, [filters]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (filters.plan)      p.append("plan",      filters.plan);
      if (filters.status)    p.append("status",    filters.status);
      if (filters.channel)   p.append("channel",   filters.channel);
      if (filters.startDate) p.append("startDate", filters.startDate);
      if (filters.endDate)   p.append("endDate",   filters.endDate);
      p.append("page", filters.page.toString()); p.append("limit", "20");
      const res = await fetch(`/api/admin/sales/list?${p}`);
      setData(await res.json());
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const resendSms = async (saleId: string) => {
    setResendingSms(saleId);
    try {
      const res    = await fetch("/api/admin/sms/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ saleId }) });
      const result = await res.json();
      result.success ? toast.success("SMS resent successfully") : toast.error(result.error || "Failed to resend SMS");
    } catch { toast.error("Failed to resend SMS"); } finally { setResendingSms(null); }
  };

  const deleteOrder = async (saleId: string) => {
    if (!confirm(`Delete order ${saleId}? This cannot be undone.`)) return;
    setDeletingOrder(saleId);
    try {
      const res    = await fetch(`/api/admin/sales/${encodeURIComponent(saleId)}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        toast.success("Order deleted");
        setData(prev => prev ? { ...prev, sales: prev.sales.filter(s => s.saleId !== saleId) } : prev);
      } else { toast.error(result.error || "Delete failed"); }
    } catch { toast.error("Delete failed"); } finally { setDeletingOrder(null); }
  };

  const getPlanName = (plan: string) => ({ basic: "Basic", pro: "Pro", unlimited: "Unlimited" }[plan] || plan);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const selectMonth = (idx: number) => {
    const year = new Date().getFullYear();
    const pad = (n: number) => String(n).padStart(2, "0");
    const lastDay = new Date(year, idx + 1, 0).getDate();
    setFilters({ ...filters, month: String(idx), startDate: `${year}-${pad(idx + 1)}-01`, endDate: `${year}-${pad(idx + 1)}-${pad(lastDay)}`, page: 1 });
  };

  const clearMonth = () => setFilters({ ...filters, month: "", startDate: "", endDate: "", page: 1 });

  const statusColors: Record<string, string> = {
    completed: "bg-green-500/15 text-green-400 border-green-500/25",
    pending:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
    failed:    "bg-red-500/15 text-red-400 border-red-500/25",
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl text-white placeholder-slate-600 text-xs focus:outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };

  const PlanPill = ({ plan }: { plan: string }) => {
    const colors: Record<string, string> = { basic: "text-sky-400 border-sky-500/25 bg-sky-500/10", pro: "text-violet-400 border-violet-500/25 bg-violet-500/10", unlimited: "text-indigo-400 border-indigo-500/25 bg-indigo-500/10" };
    return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${colors[plan] || "text-slate-400 border-slate-500/25 bg-slate-500/10"}`}>{getPlanName(plan)}</span>;
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs group">
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />Back
              </Link>
              <div className="h-4 w-px bg-white/10" />
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg"><ShoppingCart className="h-4 w-4" /></div>
              <div>
                <h1 className="text-sm font-bold text-white">Sales</h1>
                <p className="text-[10px] text-slate-600">Transaction history</p>
              </div>
            </div>
            <button onClick={fetchSales}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg border border-white/8 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <RefreshCw className="h-3.5 w-3.5" /><span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        {data?.summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "All Sales",      sub: "Total transactions", val: data.summary.totalSales,    icon: <ShoppingCart className="h-4 w-4 text-amber-400" />,  glow: "rgba(251,191,36,0.12)" },
              { label: "Completed",      sub: "Successfully paid",  val: data.summary.paidSales,     icon: <CheckCircle className="h-4 w-4 text-green-400" />,   glow: "rgba(34,197,94,0.1)" },
              { label: "Total Revenue",  sub: "Net of Paystack fees",   val: `GHS ${data.summary.totalRevenue}`, icon: <DollarSign className="h-4 w-4 text-indigo-400" />,  glow: "rgba(99,102,241,0.1)" },
              { label: "Paid Revenue",   sub: "Completed, net of fees",  val: `GHS ${data.summary.paidRevenue}`,  icon: <TrendingUp className="h-4 w-4 text-violet-400" />, glow: "rgba(139,92,246,0.1)" },
            ].map((c, i) => (
              <div key={i} className="glass-strong rounded-2xl border border-white/6 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg,${c.glow},rgba(255,255,255,0.02))`, border: "1px solid rgba(255,255,255,0.07)" }}>{c.icon}</div>
                  <p className="text-lg font-bold text-white">{c.val}</p>
                </div>
                <p className="text-xs font-semibold text-slate-300">{c.label}</p>
                <p className="text-[10px] text-slate-600">{c.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="glass-strong rounded-2xl border border-white/6 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-white flex items-center gap-2"><Filter className="h-3.5 w-3.5 text-indigo-400" />Filters</h2>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-400 hover:text-white rounded-lg border border-white/8 transition-colors">
              {showFilters ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          {showFilters && (
            <div className="space-y-4 pt-3 border-t border-white/5">
              {/* Plans */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Plan</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: "All" }, { id: "basic", name: "Basic" }, { id: "pro", name: "Pro" }, { id: "unlimited", name: "Unlimited" }].map(pl => (
                    <button key={pl.id} onClick={() => setFilters({ ...filters, plan: pl.id, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.plan === pl.id ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                      style={filters.plan !== pl.id ? { background: "rgba(255,255,255,0.04)" } : {}}>
                      {pl.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: "All" }, { id: "pending", name: "Pending" }, { id: "completed", name: "Completed" }, { id: "failed", name: "Failed" }].map(st => (
                    <button key={st.id} onClick={() => setFilters({ ...filters, status: st.id, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.status === st.id ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                      style={filters.status !== st.id ? { background: "rgba(255,255,255,0.04)" } : {}}>
                      {st.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Channel */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Channel</label>
                <div className="flex flex-wrap gap-2">
                  {[{ id: "", name: "All" }, { id: "web", name: "Web" }, { id: "ussd", name: "USSD" }].map(ch => (
                    <button key={ch.id} onClick={() => setFilters({ ...filters, channel: ch.id, page: 1 })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.channel === ch.id ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                      style={filters.channel !== ch.id ? { background: "rgba(255,255,255,0.04)" } : {}}>
                      {ch.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* Month quick-filter */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Month ({new Date().getFullYear()})</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={clearMonth}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.month === "" && !filters.startDate ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                    style={filters.month !== "" || filters.startDate ? { background: "rgba(255,255,255,0.04)" } : {}}>
                    All
                  </button>
                  {MONTHS.map((m, idx) => (
                    <button key={m} onClick={() => selectMonth(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filters.month === String(idx) ? "bg-indigo-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                      style={filters.month !== String(idx) ? { background: "rgba(255,255,255,0.04)" } : {}}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Date range */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">Custom Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: filters.startDate, onChange: (v: string) => setFilters({ ...filters, startDate: v, month: "", page: 1 }) },
                    { val: filters.endDate,   onChange: (v: string) => setFilters({ ...filters, endDate:   v, month: "", page: 1 }) },
                  ].map((d, i) => (
                    <div key={i} className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                      <input type="date" value={d.val} onChange={e => d.onChange(e.target.value)}
                        className={`${inputCls} pl-9`} style={inputStyle} />
                    </div>
                  ))}
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
                  {["Sale ID", "Phone", "Plan", "Amount", "Channel", "Status", "Voucher", "Date", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {loading ? (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-600">Loading sales…</p>
                  </td></tr>
                ) : data?.sales.length === 0 ? (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <ShoppingCart className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No sales found</p>
                    <p className="text-xs text-slate-700 mt-1">Try adjusting your filters</p>
                  </td></tr>
                ) : data?.sales.map(sale => (
                  <tr key={sale._id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-indigo-300">{sale.saleId}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-300">{sale.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><PlanPill plan={sale.plan} /></td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-white">GHS {sale.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }}>{sale.channel.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border capitalize ${statusColors[sale.status] || "bg-slate-500/15 text-slate-400 border-slate-500/25"}`}>{sale.status}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {sale.voucherCode
                        ? <code className="font-mono text-indigo-300 px-2 py-1 rounded text-[11px] border border-indigo-500/20" style={{ background: "rgba(99,102,241,0.08)" }}>{sale.voucherCode}</code>
                        : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600">{formatDate(sale.createdAt)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {sale.status === "completed" && sale.voucherCode && (
                          <button onClick={() => resendSms(sale.saleId)} disabled={resendingSms === sale.saleId}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-indigo-300 rounded-lg border border-indigo-500/25 hover:border-indigo-500/50 hover:text-indigo-200 disabled:opacity-40 transition-all"
                            style={{ background: "rgba(99,102,241,0.08)" }}>
                            {resendingSms === sale.saleId
                              ? <><div className="w-3 h-3 border border-indigo-400/40 border-t-indigo-400 rounded-full animate-spin" />Sending</>
                              : <><Mail className="h-3 w-3" />Resend SMS</>}
                          </button>
                        )}
                        <button onClick={() => deleteOrder(sale.saleId)} disabled={deletingOrder === sale.saleId}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-red-400 rounded-lg border border-red-500/25 hover:border-red-500/50 hover:text-red-300 disabled:opacity-40 transition-all"
                          style={{ background: "rgba(239,68,68,0.07)" }}
                          title="Delete order">
                          {deletingOrder === sale.saleId
                            ? <div className="w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                            : <Trash2 className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>
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
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>Previous</button>
                <span className="px-3 py-1.5 text-xs text-slate-500">Page {filters.page} of {data.pagination.pages}</span>
                <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })} disabled={filters.page === data.pagination.pages}
                  className="px-3 py-1.5 text-xs rounded-lg border border-white/8 text-slate-400 hover:text-white disabled:opacity-30 transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

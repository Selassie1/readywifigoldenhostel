// app/admin/ppsk/list/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, Tv2, Upload, Search, RefreshCw,
  ChevronLeft, ChevronRight, Lock, Unlock, Package,
} from "lucide-react";
import toast from "react-hot-toast";

interface PpskPassword {
  _id: string; password: string; status: "unused" | "assigned";
  batchId: string; assignedToPhone?: string; assignedChannel?: string;
  assignedAt?: string; createdAt: string;
}

export default function PpskListPage() {
  const [passwords, setPasswords]   = useState<PpskPassword[]>([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch]         = useState("");
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, limit: 50 });
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  useEffect(() => { fetchPasswords(); }, [page, statusFilter]);

  const fetchPasswords = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(), limit: "50",
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      const res  = await fetch(`/api/admin/ppsk/list?${params}`);
      const data = await res.json();
      setPasswords(data.passwords || []);
      setPagination(data.pagination || { total: 0, pages: 1, limit: 50 });
      setStatusCounts(data.statusCounts || {});
    } catch { toast.error("Failed to load PPSK passwords"); }
    finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchPasswords(); };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const StatusBadge = ({ status }: { status: string }) =>
    status === "unused" ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/15 text-green-400 border border-green-500/25">
        <Unlock className="h-3 w-3" />Unused
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/25">
        <Lock className="h-3 w-3" />Assigned
      </span>
    );

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };

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
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white shadow-lg"><Tv2 className="h-4 w-4" /></div>
              <div>
                <h1 className="text-sm font-bold text-white">PPSK Passwords</h1>
                <p className="text-[10px] text-slate-600">TV &amp; Console Access Inventory</p>
              </div>
            </div>
            <Link href="/admin/ppsk"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all"
              style={{ background: "linear-gradient(135deg,#d946ef,#ec4899)" }}>
              <Upload className="h-3.5 w-3.5" /><span className="hidden sm:inline">Upload More</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total",     val: (statusCounts.unused || 0) + (statusCounts.assigned || 0), color: "text-white",       bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
            { label: "Available", val: statusCounts.unused || 0,   color: "text-green-400",   bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
            { label: "Assigned",  val: statusCounts.assigned || 0, color: "text-fuchsia-400", bg: "rgba(217,70,239,0.08)", border: "rgba(217,70,239,0.2)" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 border" style={{ background: s.bg, borderColor: s.border }}>
              <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-strong rounded-2xl border border-white/6 p-4 mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by password…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-white placeholder-slate-600 text-xs focus:outline-none transition-all"
                  style={inputStyle} />
              </div>
              <button type="submit" className="px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all"
                style={{ background: "linear-gradient(135deg,#d946ef,#ec4899)" }}>Search</button>
            </form>
            <div className="flex gap-2">
              {[{ id: "", label: "All" }, { id: "unused", label: "Available" }, { id: "assigned", label: "Assigned" }].map(f => (
                <button key={f.id} onClick={() => { setStatusFilter(f.id); setPage(1); }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${statusFilter === f.id ? "bg-fuchsia-600 text-white" : "text-slate-400 border border-white/8 hover:text-white"}`}
                  style={statusFilter !== f.id ? { background: "rgba(255,255,255,0.04)" } : {}}>
                  {f.label}
                </button>
              ))}
              <button onClick={fetchPasswords} className="p-2 rounded-lg text-slate-500 hover:text-white transition-colors border border-white/8" style={{ background: "rgba(255,255,255,0.04)" }} title="Refresh">
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="glass-strong rounded-2xl border border-white/6 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-fuchsia-500/30 border-t-fuchsia-500 rounded-full animate-spin mb-3" />
              <p className="text-xs text-slate-600">Loading passwords…</p>
            </div>
          ) : passwords.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-10 w-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">No PPSK passwords found</p>
              <p className="text-xs text-slate-700 mt-1">Upload a CSV from the Upload PPSK page</p>
              <Link href="/admin/ppsk" className="inline-flex items-center mt-4 gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg" style={{ background: "linear-gradient(135deg,#d946ef,#ec4899)" }}>
                <Upload className="h-3.5 w-3.5" />Upload Passwords
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["#", "Password", "Status", "Assigned To", "Assigned At", "Batch", "Added"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {passwords.map((pw, i) => (
                      <tr key={pw._id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 text-[11px] text-slate-700">{(page - 1) * 50 + i + 1}</td>
                        <td className="px-4 py-3">
                          <code className="font-mono text-fuchsia-300 px-2 py-1 rounded text-[11px] border border-fuchsia-500/20" style={{ background: "rgba(217,70,239,0.07)" }}>{pw.password}</code>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={pw.status} /></td>
                        <td className="px-4 py-3 text-xs text-slate-400">{pw.assignedToPhone || "—"}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{pw.assignedAt ? formatDate(pw.assignedAt) : "—"}</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600 font-mono">{pw.batchId?.slice(0, 12)}…</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{formatDate(pw.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-white/[0.04]">
                {passwords.map(pw => (
                  <div key={pw._id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-fuchsia-300 px-2 py-1 rounded text-[11px] border border-fuchsia-500/20" style={{ background: "rgba(217,70,239,0.07)" }}>{pw.password}</code>
                      <StatusBadge status={pw.status} />
                    </div>
                    {pw.assignedToPhone && <p className="text-xs text-slate-500">Assigned to: <span className="text-white">{pw.assignedToPhone}</span></p>}
                    <p className="text-xs text-slate-700">Added: {formatDate(pw.createdAt)}</p>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <p className="text-xs text-slate-600">{pagination.total} total · Page {page} of {pagination.pages}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="p-1.5 rounded-lg border border-white/8 text-slate-400 disabled:opacity-30 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                      className="p-1.5 rounded-lg border border-white/8 text-slate-400 disabled:opacity-30 hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.04)" }}>
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

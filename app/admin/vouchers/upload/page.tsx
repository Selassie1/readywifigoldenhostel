// app/admin/vouchers/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, ArrowLeft, FileText, CheckCircle, AlertCircle, Info, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function VoucherUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile]   = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan]   = useState("unlimited");
  const [uploading, setUploading]         = useState(false);
  const [uploadResult, setUploadResult]   = useState<any>(null);

  // To add a new plan later, add an entry here.
  const plans = [
    { id: "basic",     name: "Basic",     data: "30GB",      duration: "30 Days", grad: "from-sky-500 to-blue-600" },
    { id: "pro",       name: "Pro",       data: "95GB",      duration: "30 Days", grad: "from-violet-500 to-purple-600" },
    { id: "unlimited", name: "Unlimited", data: "Unlimited", duration: "30 Days", grad: "from-blue-500 to-indigo-600" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv") { toast.error("Please select a CSV file"); return; }
    setSelectedFile(file); setUploadResult(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) { toast.error("Please select a file"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("plan", selectedPlan);
      const res    = await fetch("/api/admin/vouchers/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setUploadResult(result); toast.success("Vouchers uploaded successfully!");
        setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "";
      } else { toast.error(result.error || "Upload failed"); }
    } catch { toast.error("Upload failed"); } finally { setUploading(false); }
  };

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors text-xs group">
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />Back
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Upload Vouchers</h1>
              <p className="text-[10px] text-slate-600">Import voucher codes from CSV</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upload Form */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <Upload className="h-4 w-4 text-indigo-400" />Upload CSV File
            </h2>
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Plan selector */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-3">Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map(plan => (
                    <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${selectedPlan === plan.id ? "border-indigo-500/50 bg-indigo-500/10" : "border-white/6 hover:border-white/12"}`}
                      style={selectedPlan !== plan.id ? { background: "rgba(255,255,255,0.03)" } : {}}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{plan.name}</span>
                        {selectedPlan === plan.id && <CheckCircle className="h-3.5 w-3.5 text-indigo-400" />}
                      </div>
                      <p className="text-[10px] text-slate-400">{plan.data}</p>
                      <p className="text-[10px] text-slate-600">{plan.duration}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">CSV File</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-indigo-500/40 transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="h-7 w-7 text-indigo-400" />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-sm text-slate-400">Click to select CSV file</p>
                      <p className="text-xs text-slate-700 mt-1">Only .csv files are accepted</p>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" disabled={!selectedFile || uploading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: selectedFile && !uploading ? "0 0 20px rgba(99,102,241,0.3)" : "none" }}>
                {uploading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…</>
                  : <><Upload className="h-4 w-4" />Upload Vouchers</>}
              </button>
            </form>
          </div>

          {/* Sidebar instructions */}
          <div className="space-y-4">
            {/* Format */}
            <div className="glass-strong rounded-2xl border border-white/6 p-5">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Info className="h-3.5 w-3.5 text-indigo-400" />CSV Format</h3>
              <p className="text-xs text-slate-400 mb-3">Your CSV file should have a column named <code className="px-1.5 py-0.5 rounded text-indigo-300 text-[11px]" style={{ background: "rgba(99,102,241,0.12)" }}>code</code> with the voucher codes.</p>
              <div className="rounded-xl p-3 font-mono text-[11px] text-slate-400 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                code<br />ABC12345<br />DEF67890<br />GHI11111
              </div>
            </div>
            {/* Steps */}
            <div className="glass-strong rounded-2xl border border-white/6 p-5">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-amber-400" />Upload Steps</h3>
              <div className="space-y-2.5">
                {["Select the plan for the vouchers", "Choose your CSV file", "Click upload to process", "Review the upload results"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {uploadResult && (
          <div className="mt-6 glass-strong rounded-2xl border border-green-500/20 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <h3 className="text-sm font-bold text-white">Upload Complete</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: "Total Codes", val: uploadResult.stats.total, color: "text-white", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
                { label: "Duplicates",  val: uploadResult.stats.duplicates, color: "text-amber-400", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
                { label: "Imported",    val: uploadResult.stats.imported, color: "text-green-400", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 border" style={{ background: s.bg, borderColor: s.border }}>
                  <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-indigo-500/20 text-xs" style={{ background: "rgba(99,102,241,0.08)" }}>
              <span className="text-slate-500">Batch ID: </span>
              <code className="font-mono text-indigo-300">{uploadResult.batchId}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

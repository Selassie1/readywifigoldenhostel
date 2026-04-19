// app/admin/ppsk/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, ArrowLeft, FileText, CheckCircle, AlertCircle, Info, Tv2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PpskUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading]       = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) { toast.error("Please select a CSV file"); return; }
    setSelectedFile(file); setUploadResult(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) { toast.error("Please select a file"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res    = await fetch("/api/admin/ppsk/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.success) {
        setUploadResult(result); toast.success("PPSK passwords uploaded successfully!");
        setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "";
      } else { toast.error(result.error || "Upload failed"); }
    } catch { toast.error("Upload failed"); } finally { setUploading(false); }
  };

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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white shadow-lg">
              <Tv2 className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Upload PPSK Passwords</h1>
              <p className="text-[10px] text-slate-600">For Smart TVs &amp; Gaming Consoles</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upload Form */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
              <Upload className="h-4 w-4 text-fuchsia-400" />Upload CSV File
            </h2>
            <form onSubmit={handleUpload} className="space-y-5">
              {/* Plan badge */}
              <div className="rounded-xl p-4 border border-fuchsia-500/30" style={{ background: "rgba(217,70,239,0.08)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Unlimited Plan</h3>
                    <p className="text-xs text-slate-400 mt-0.5">📺 TV / Console PPSK passwords</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-fuchsia-400" />
                </div>
              </div>

              {/* Drop zone */}
              <div>
                <label className="block text-[11px] text-slate-500 mb-2">CSV File</label>
                <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-fuchsia-500/40 transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="h-7 w-7 text-fuchsia-400" />
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
                style={{ background: "linear-gradient(135deg,#d946ef,#ec4899)", boxShadow: selectedFile && !uploading ? "0 0 20px rgba(217,70,239,0.3)" : "none" }}>
                {uploading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…</>
                  : <><Upload className="h-4 w-4" />Upload Passwords</>}
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="glass-strong rounded-2xl border border-white/6 p-5">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Info className="h-3.5 w-3.5 text-fuchsia-400" />CSV Format</h3>
              <p className="text-xs text-slate-400 mb-3">Your CSV must have a column named <code className="px-1.5 py-0.5 rounded text-fuchsia-300 text-[11px]" style={{ background: "rgba(217,70,239,0.1)" }}>password</code> with the Omada PPSK values.</p>
              <div className="rounded-xl p-3 font-mono text-[11px] text-slate-400 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                password<br />MySecurePass1<br />MySecurePass2<br />MySecurePass3
              </div>
            </div>
            <div className="glass-strong rounded-2xl border border-white/6 p-5">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><AlertCircle className="h-3.5 w-3.5 text-amber-400" />How PPSK Works</h3>
              <div className="space-y-2.5">
                {[
                  { n: "1", c: "bg-fuchsia-600/20 text-fuchsia-400", t: "Upload PPSK passwords from your Omada controller" },
                  { n: "2", c: "bg-fuchsia-600/20 text-fuchsia-400", t: "When a customer buys Unlimited, they automatically receive one password" },
                  { n: "3", c: "bg-fuchsia-600/20 text-fuchsia-400", t: "Password shown on success page and sent via SMS" },
                  { n: "⚠", c: "bg-amber-600/20 text-amber-400",    t: "Each PPSK binds permanently to the first device connecting — keep stock topped up" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <div className={`w-5 h-5 rounded-full ${s.c} font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5`}>{s.n}</div>
                    {s.t}
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
                { label: "Total Passwords", val: uploadResult.stats.total, color: "text-white", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)" },
                { label: "Duplicates",      val: uploadResult.stats.duplicates, color: "text-amber-400", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
                { label: "Imported",        val: uploadResult.stats.imported, color: "text-green-400", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 border" style={{ background: s.bg, borderColor: s.border }}>
                  <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 border border-fuchsia-500/20 text-xs" style={{ background: "rgba(217,70,239,0.07)" }}>
              <span className="text-slate-500">Batch ID: </span>
              <code className="font-mono text-fuchsia-300">{uploadResult.batchId}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

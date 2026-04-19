// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Eye, EyeOff, Shield, AlertCircle, Wifi } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { toast.error("Please enter the admin password"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) { toast.success("Login successful!"); router.push("/admin"); }
      else               { toast.error(data.error || "Invalid password"); }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      {/* Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 rounded-full opacity-15 pointer-events-none"
           style={{ background: "radial-gradient(ellipse, #6366f1, transparent)", filter: "blur(80px)" }} />

      <div className="relative z-10 w-full max-w-md">
        {/* Back link */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Site
          </Link>

          {/* Logo */}
          <div className="flex flex-col items-center mt-4">
            <div className="relative mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-[var(--bg-deep)] flex items-center justify-center">
                <Lock className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-slate-500">ReadyWifi</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
            <p className="text-slate-500 text-sm">Enter the admin password to continue</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl border border-white/8 p-7">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="admin-password">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none transition-all duration-300 disabled:opacity-50"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !password.trim()}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: loading || !password.trim() ? "none" : "0 0 25px rgba(99,102,241,0.35)",
              }}
            >
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Authenticating…</>
              ) : (
                <><Shield className="h-4 w-4" /> Access Dashboard</>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-5 p-4 rounded-xl border border-amber-500/20" style={{ background: "rgba(234,179,8,0.06)" }}>
            <div className="flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-300 mb-1">Security Notice</p>
                <p className="text-xs text-amber-200/60">This is a protected admin area. Only authorised personnel should access this dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">ReadyWifi Admin Dashboard · Golden Hostel</p>
      </div>
    </div>
  );
}

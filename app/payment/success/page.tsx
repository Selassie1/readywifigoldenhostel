// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle, Mail, Copy, Wifi, Tv2, Smartphone,
  AlertTriangle, Router, Lock, ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const [reference, setReference]             = useState("");
  const [voucherCode, setVoucherCode]         = useState("");
  const [ppskPassword, setPpskPassword]       = useState("");
  const [includesTvAccess, setIncludesTvAccess] = useState(false);
  const [paymentData, setPaymentData]         = useState<any>(null);
  const [error, setError]                     = useState("");
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("reference");
    if (ref) { setReference(ref); verifyPayment(ref); }
    else       { setLoading(false); }
  }, []);

  const verifyPayment = async (ref: string) => {
    try {
      setLoading(true);
      const res  = await fetch(`/api/payments/verify?reference=${ref}`);
      const data = await res.json();
      if (data.success && data.data) {
        setVoucherCode(data.data.voucherCode);
        setPpskPassword(data.data.ppskPassword || "");
        setIncludesTvAccess(!!data.data.includesTvAccess);
        setPaymentData(data.data);
        setError("");
      } else {
        setError(data.error || "Payment verification failed");
      }
    } catch {
      setError("Failed to verify payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  /* ── Loading ─────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-deep)" }}>
        <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Wifi className="h-6 w-6 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verifying Payment…</h1>
          <p className="text-slate-400 text-sm">Please wait while we confirm your payment and prepare your access code.</p>
          <div className="mt-5 flex justify-center gap-1.5">
            {[0, 0.15, 0.3].map(d => (
              <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-deep)" }}>
        <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-md w-full">
          <div className="glass-strong rounded-2xl border border-red-500/20 p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(239,68,68,0.1)" }}>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verification Failed</h1>
            <p className="text-slate-400 text-sm mb-7">{error}</p>
            <div className="space-y-3">
              <Link href="/" className="btn-primary w-full py-3 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
                Try Again <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="mailto:mrselasi@gmail.com" className="btn-ghost w-full py-3 px-6 rounded-xl text-sm font-semibold flex items-center justify-center">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-64 rounded-full opacity-15 pointer-events-none"
           style={{ background: "radial-gradient(ellipse, #22c55e, transparent)", filter: "blur(80px)" }} />

      <div className="relative z-10 max-w-lg w-full">
        <div className="glass-strong rounded-2xl border border-green-500/20 overflow-hidden shadow-2xl" style={{ boxShadow: "0 0 60px rgba(34,197,94,0.1)" }}>

          {/* Header */}
          <div className="p-6 text-center border-b border-white/6" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.08))" }}>
            <div className="relative inline-flex mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)" }}>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-ping-slow" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Payment Successful!</h1>
            <p className="text-slate-400 text-sm">Your access code is ready below.</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Summary */}
            {paymentData && (
              <div className="rounded-xl p-4 border border-white/5 grid grid-cols-2 gap-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                {[
                  { label: "Plan", val: paymentData.plan },
                  { label: "Amount", val: `GHS ${paymentData.amount}` },
                  { label: "Phone", val: paymentData.phone },
                  { label: "Status", val: paymentData.status, green: true },
                ].map(r => (
                  <div key={r.label}>
                    <p className="text-[11px] text-slate-500 mb-0.5">{r.label}</p>
                    <p className={`text-sm font-semibold ${r.green ? "text-green-400" : "text-white"} capitalize`}>{r.val}</p>
                  </div>
                ))}
              </div>
            )}

            {includesTvAccess ? (
              <>
                {/* Unlimited — Phones */}
                <div className="rounded-xl border border-indigo-500/30 overflow-hidden">
                  <div className="px-5 py-3 flex items-center gap-3 border-b border-indigo-500/20" style={{ background: "rgba(99,102,241,0.1)" }}>
                    <Smartphone className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">Phones, Tablets &amp; Laptops</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {["Connect to Wi-Fi: Ready Wifi", "A login page will appear automatically."].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                        <p className="text-slate-300">{s}</p>
                      </div>
                    ))}
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                      <div className="flex-1">
                        <p className="text-slate-300 mb-2">Enter your Voucher Code:</p>
                        {voucherCode && (
                          <div className="flex items-center gap-2">
                            <code className="flex-1 font-mono font-bold text-indigo-300 px-4 py-2.5 rounded-lg text-sm tracking-wider text-center border border-indigo-500/30" style={{ background: "rgba(99,102,241,0.08)" }}>
                              {voucherCode}
                            </code>
                            <button onClick={() => copy(voucherCode, "Voucher code")}
                              className="p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex-shrink-0">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unlimited — TV/Console */}
                <div className="rounded-xl border border-fuchsia-500/30 overflow-hidden">
                  <div className="px-5 py-3 flex items-center gap-3 border-b border-fuchsia-500/20" style={{ background: "rgba(217,70,239,0.1)" }}>
                    <Tv2 className="h-4 w-4 text-fuchsia-400" />
                    <span className="text-sm font-semibold text-white">TVs &amp; Gaming Consoles</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {["Connect to Wi-Fi: ReadyWifi_TV/CONSOLE", "Security Type: WPA2"].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-fuchsia-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                        <p className="text-slate-300">{s}</p>
                      </div>
                    ))}
                    <div className="flex items-start gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-fuchsia-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
                      <div className="flex-1">
                        <p className="text-slate-300 mb-2">Enter the password:</p>
                        {ppskPassword && (
                          <div className="flex items-center gap-2">
                            <code className="flex-1 font-mono font-bold text-fuchsia-300 px-4 py-2.5 rounded-lg text-sm tracking-wider text-center border border-fuchsia-500/30" style={{ background: "rgba(217,70,239,0.08)" }}>
                              {ppskPassword}
                            </code>
                            <button onClick={() => copy(ppskPassword, "TV password")}
                              className="p-2.5 rounded-lg bg-fuchsia-600 text-white hover:bg-fuchsia-700 transition-colors flex-shrink-0">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Warning */}
                  <div className="mx-5 mb-5 rounded-xl p-4 border border-red-500/30" style={{ background: "rgba(239,68,68,0.08)" }}>
                    <div className="flex gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-red-400 mb-1">IMPORTANT — Read before connecting</p>
                        <p className="text-xs text-red-200/70 leading-relaxed">This password is locked to a <strong className="text-red-300">1-device limit</strong>. It will permanently bind to the <strong className="text-red-300">VERY FIRST</strong> device that connects. Do <strong className="text-red-300">not</strong> share it with anyone or your TV/Console will be permanently blocked.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Standard plan — voucher only */}
                {voucherCode && (
                  <div className="rounded-xl p-5 border border-indigo-500/30" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))" }}>
                    <h3 className="text-sm font-bold text-white text-center mb-4">Your Voucher Code</h3>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 font-mono font-bold text-indigo-300 px-4 py-3 rounded-xl text-lg tracking-widest text-center border border-indigo-500/30" style={{ background: "rgba(99,102,241,0.08)" }}>
                        {voucherCode}
                      </code>
                      <button onClick={() => copy(voucherCode, "Voucher code")}
                        className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center mt-3 flex items-center justify-center gap-1.5">
                      <Mail className="h-3 w-3" />Also sent to your phone via SMS
                    </p>
                  </div>
                )}

                {/* How to connect */}
                <div className="rounded-xl p-4 border border-white/6" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <h3 className="text-sm font-semibold text-white flex items-center justify-center gap-2 mb-4">
                    <Router className="h-4 w-4 text-indigo-400" />How to Connect
                  </h3>
                  <ul className="space-y-3">
                    {["Connect to 'Ready Wifi' network", "A login page pops up automatically", "Enter your voucher code above", "Enjoy your internet access! 🎉"].map((s, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* SMS notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 p-3 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <Mail className="h-3 w-3 text-indigo-400" />
              <span>All codes have been sent to your phone via SMS</span>
            </div>

            {/* CTA */}
            <Link href="/"
              className="btn-primary w-full py-3.5 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 group">
              Buy Another Voucher
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/refund/page.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock, AlertTriangle, Wifi } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10 pointer-events-none"
           style={{ background: "radial-gradient(ellipse, #6366f1, transparent)", filter: "blur(60px)" }} />

      <header className="relative z-10 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">ReadyWifi</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-5 shadow-xl shadow-amber-500/20">
            <RefreshCw className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Refund Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div className="space-y-6">
          {/* Important notice */}
          <div className="rounded-2xl p-5 border border-amber-500/25" style={{ background: "rgba(234,179,8,0.07)" }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-300 mb-1">Important Notice</p>
                <p className="text-xs text-slate-400">All sales are generally final once a voucher code has been delivered. Refunds are only available under specific circumstances outlined below.</p>
              </div>
            </div>
          </div>

          {/* When refunds ARE available */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5">
              <CheckCircle className="h-4 w-4 text-green-400" />When Refunds Are Available
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Technical Issues", desc: "If you can't use your voucher due to a technical fault and our support team can't resolve it within 24 hours." },
                { title: "Duplicate Payment", desc: "If you were charged multiple times for the same purchase due to a system error on our end." },
                { title: "Wrong Plan", desc: "If you accidentally purchased the wrong plan and contact us within 1 hour before using the voucher." },
                { title: "Service Unavailable", desc: "If the WiFi service is completely unavailable in the coverage area and this wasn't disclosed at purchase." },
              ].map(r => (
                <div key={r.title} className="rounded-xl p-4 border border-green-500/20 flex gap-3" style={{ background: "rgba(34,197,94,0.07)" }}>
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-400 mb-1">{r.title}</p>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* When refunds are NOT available */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5">
              <XCircle className="h-4 w-4 text-red-400" />When Refunds Are NOT Available
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Voucher Already Used", desc: "Once a voucher code has been activated, no refunds will be provided under any circumstances." },
                { title: "Change of Mind", desc: "Refunds are not issued simply because you changed your mind after purchase." },
                { title: "Slow Internet Speed", desc: "Speed depends on factors outside our control (congestion, device, location)." },
                { title: "Expired Voucher", desc: "Vouchers not used within the 30-day validity period are not refundable." },
              ].map(r => (
                <div key={r.title} className="rounded-xl p-4 border border-red-500/20 flex gap-3" style={{ background: "rgba(239,68,68,0.07)" }}>
                  <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">{r.title}</p>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund process */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5">
              <Clock className="h-4 w-4 text-blue-400" />Refund Process
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01", title: "Contact Support", desc: "Email mrselasi@gmail.com with your order details and reason.", color: "from-blue-500 to-indigo-600" },
                { step: "02", title: "Investigation", desc: "Our team reviews your request within 24–48 hours.", color: "from-indigo-500 to-violet-600" },
                { step: "03", title: "Processing", desc: "If approved, refunds are processed to your original payment method within 3–7 business days.", color: "from-violet-500 to-fuchsia-600" },
              ].map(s => (
                <div key={s.step} className="text-center p-4 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-sm font-bold mx-auto mb-3`}>{s.step}</div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs text-slate-500 mb-1">Processing Time</p>
                <p className="text-sm font-semibold text-white">3–7 business days</p>
              </div>
              <div className="rounded-xl p-4 border border-white/5 text-center" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs text-slate-500 mb-1">Request Deadline</p>
                <p className="text-sm font-semibold text-white">Within 7 days of purchase</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="text-base font-semibold text-white mb-4">Get In Touch</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ label: "Email", val: "mrselasi@gmail.com" }, { label: "Phone", val: "+233 55 521 8254" }, { label: "Response", val: "Within 24 hours" }, { label: "Hours", val: "Mon–Fri, 8am–6pm" }].map(c => (
                <div key={c.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                  <p className="text-xs text-slate-300 font-medium">{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 p-5 rounded-2xl text-center border border-white/6" style={{ background: "rgba(99,102,241,0.06)" }}>
          <p className="text-slate-400 text-sm">This refund policy applies to all ReadyWifi purchases.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            {[{ label: "Terms & Conditions", href: "/terms" }, { label: "Privacy Policy", href: "/privacy" }, { label: "FAQ", href: "/faq" }].map(l => (
              <Link key={l.href} href={l.href} className="text-indigo-400 hover:text-indigo-300 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

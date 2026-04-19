// app/privacy/page.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, User, Mail, Wifi } from "lucide-react";

export default function PrivacyPage() {
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
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 mb-5 shadow-xl shadow-green-500/20">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div className="space-y-6">
          {/* Intro */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-3"><Lock className="h-4 w-4 text-green-400" />Introduction</h2>
            <p className="text-slate-400 text-sm leading-relaxed">At ReadyWifi, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our WiFi voucher services.</p>
          </div>

          {/* What we collect */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5"><Database className="h-4 w-4 text-blue-400" />Information We Collect</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "Personal", color: "blue", items: ["Phone number", "Email (if provided)", "Payment info (via Paystack)", "IP address"] },
                { title: "Usage", color: "violet", items: ["Purchase history", "Usage patterns", "Website interactions", "Support comms"] },
                { title: "Technical", color: "green", items: ["Browser type", "Operating system", "Device identifiers", "Log files"] },
              ].map(g => (
                <div key={g.title} className="rounded-xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">{g.title}</h3>
                  <ul className="space-y-1.5">
                    {g.items.map(i => <li key={i} className="text-xs text-slate-400 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-indigo-400 flex-shrink-0" />{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* How we use it */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5"><Eye className="h-4 w-4 text-violet-400" />How We Use Your Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Service Delivery", color: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)", tc: "#4ade80", items: ["Process voucher purchases", "Send SMS notifications", "Provide customer support", "Verify transactions"] },
                { title: "Improvement", color: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)", tc: "#a78bfa", items: ["Analyse usage patterns", "Improve our services", "Develop new features", "Monitor performance"] },
                { title: "Security", color: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", tc: "#f87171", items: ["Prevent fraud", "Ensure security", "Comply with laws", "Protect rights"] },
                { title: "Communication", color: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.2)", tc: "#facc15", items: ["Send important updates", "Respond to enquiries", "Share service changes", "Provide notifications"] },
              ].map(g => (
                <div key={g.title} className="rounded-xl p-4" style={{ background: g.color, border: `1px solid ${g.border}` }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: g.tc }}>{g.title}</h3>
                  <ul className="space-y-1">
                    {g.items.map(i => <li key={i} className="text-xs text-slate-300">• {i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Sharing */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-5"><User className="h-4 w-4 text-orange-400" />Information Sharing</h2>
            <div className="rounded-xl p-4 mb-4 border border-red-500/20" style={{ background: "rgba(239,68,68,0.08)" }}>
              <p className="text-sm font-semibold text-red-400 mb-1">🚫 We do NOT sell your personal data</p>
              <p className="text-xs text-slate-400">We do not sell, trade, or rent your personal information to third parties for marketing purposes.</p>
            </div>
            <p className="text-sm text-slate-400 mb-3">We share information only with:</p>
            <ul className="space-y-2">
              {["Paystack — for secure payment processing", "SMS providers — for voucher code delivery", "Legal authorities — when required by law", "No one else without your explicit consent"].map(i => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />{i}</li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-4"><Shield className="h-4 w-4 text-green-400" />Data Security</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl p-4 border border-green-500/20" style={{ background: "rgba(34,197,94,0.06)" }}>
                <h3 className="text-sm font-semibold text-green-400 mb-3">Security Measures</h3>
                <ul className="space-y-1.5">
                  {["SSL encryption on all transmissions", "Secure servers with regular updates", "Access controls & authentication", "PCI DSS compliant payments"].map(i => (
                    <li key={i} className="text-xs text-slate-400">• {i}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl p-4 border border-amber-500/20" style={{ background: "rgba(234,179,8,0.06)" }}>
                <h3 className="text-sm font-semibold text-amber-400 mb-3">Data Retention</h3>
                <p className="text-xs text-slate-400 leading-relaxed">We retain personal information only as long as necessary. Transaction data is typically kept for 7 years for accounting and legal compliance.</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-strong rounded-2xl border border-white/6 p-6">
            <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-4"><Mail className="h-4 w-4 text-green-400" />Contact Us</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{ label: "Email", val: "mrselasi@gmail.com" }, { label: "Phone", val: "+233 55 521 8254" }, { label: "Location", val: "Tamale, Ghana" }, { label: "Response", val: "Within 48 hours" }].map(c => (
                <div key={c.label} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <p className="text-xs text-slate-500 mb-1">{c.label}</p>
                  <p className="text-xs text-slate-300 font-medium">{c.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 p-5 rounded-2xl text-center border border-white/6" style={{ background: "rgba(99,102,241,0.06)" }}>
          <p className="text-slate-400 text-sm">This Privacy Policy is effective as of {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            {[{ label: "Terms & Conditions", href: "/terms" }, { label: "Refund Policy", href: "/refund" }, { label: "FAQ", href: "/faq" }].map(l => (
              <Link key={l.href} href={l.href} className="text-indigo-400 hover:text-indigo-300 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

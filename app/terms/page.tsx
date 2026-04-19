// app/terms/page.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Wifi } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "1. Acceptance of Terms", content: "By accessing and using ReadyWifi services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "2. Service Description", content: "ReadyWifi provides WiFi voucher services that allow customers to purchase internet access codes for various data plans. Our service includes secure payment processing through Paystack, instant voucher code delivery via SMS, multiple data plan options, and 24/7 network availability." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "3. User Responsibilities", content: "As a user you agree to: provide accurate information during purchase, use the service only for lawful purposes, not share or resell voucher codes without authorisation, maintain the confidentiality of your access codes, and report any issues to our support team immediately." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "4. Payment Terms", content: "All payments are processed securely through Paystack. By making a purchase you agree to pay the full amount shown at checkout, provide valid payment information, accept our refund policy, and understand that all sales are final once a voucher code is delivered." },
    { icon: <AlertTriangle className="h-4 w-4 text-amber-400" />, title: "5. Service Availability", content: "We strive to maintain high uptime but cannot guarantee uninterrupted service. We reserve the right to modify, suspend, or discontinue any part of our service at any time without notice. We are not liable for any downtime or service interruptions." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "6. Limitation of Liability", content: "ReadyWifi shall not be liable for any indirect, incidental, special, consequential, or punitive damages including loss of profits, data, goodwill, or other intangible losses resulting from your use of the service." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "7. Privacy", content: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding your personal information." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. Your continued use of the service after any modifications constitutes acceptance of the updated terms." },
    { icon: <CheckCircle className="h-4 w-4 text-green-400" />, title: "9. Contact", content: "Questions? Email mrselasi@gmail.com or call +233 55 521 8254. We're based in Tamale, Ghana and respond within 24 hours." },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10 pointer-events-none"
           style={{ background: "radial-gradient(ellipse, #6366f1, transparent)", filter: "blur(60px)" }} />

      {/* Nav */}
      <header className="relative z-10 glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">ReadyWifi</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-5 shadow-xl shadow-violet-500/20">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Terms &amp; Conditions</h1>
          <p className="text-slate-400 text-sm">Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="glass-strong rounded-2xl border border-white/6 p-6 hover:border-white/10 transition-all duration-300">
              <h2 className="flex items-center gap-2.5 text-base font-semibold text-white mb-3">
                {s.icon}
                {s.title}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 p-5 rounded-2xl text-center border border-white/6"
             style={{ background: "rgba(99,102,241,0.06)" }}>
          <p className="text-slate-400 text-sm">By using ReadyWifi services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Refund Policy", href: "/refund" }, { label: "FAQ", href: "/faq" }].map(l => (
              <Link key={l.href} href={l.href} className="text-indigo-400 hover:text-indigo-300 transition-colors">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

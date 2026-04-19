// app/faq/page.tsx
"use client";
import Link from "next/link";
import { ArrowLeft, HelpCircle, ChevronDown, Wifi, CreditCard, MessageSquare, Shield } from "lucide-react";
import { useState } from "react";

interface FAQItem { question: string; answer: string; category: string; }

const faqData: FAQItem[] = [
  { question: "How do I purchase a WiFi voucher?", answer: "Select your desired plan, enter your phone number, and complete the payment through our secure Paystack gateway. You'll receive your voucher code via SMS immediately after payment.", category: "General" },
  { question: "What payment methods do you accept?", answer: "We accept all major payment methods including Visa, Mastercard, Mobile Money (MTN, Vodafone, AirtelTigo), and bank transfers through our Paystack integration.", category: "Payment" },
  { question: "How quickly will I receive my voucher code?", answer: "Voucher codes are delivered instantly via SMS to the phone number you provide during checkout. If you don't receive it within 5 minutes, please contact our support team.", category: "General" },
  { question: "How do I use my voucher code?", answer: "Connect to the 'Ready Wifi' network. A login page will pop up automatically — enter your voucher code, and you'll be online instantly.", category: "Usage" },
  { question: "What if I don't receive my voucher code?", answer: "Check your SMS inbox and spam folder. If you still haven't received it, contact us with your order reference number and we'll resend it immediately.", category: "Support" },
  { question: "Can I get a refund?", answer: "Refunds are available under specific circumstances such as technical issues, duplicate payments, or service unavailability. Please see our Refund Policy for full details.", category: "Payment" },
  { question: "How long are voucher codes valid?", answer: "Voucher codes are valid for 30 days from the date of first activation. Unused codes expire after this period and are not refundable.", category: "Usage" },
  { question: "Is my payment information secure?", answer: "Yes. All payments are processed by Paystack, which is PCI DSS compliant. We never store your card details on our servers.", category: "Security" },
  { question: "Can I use it on my TV or gaming console?", answer: "The Unlimited plan includes a PPSK password for smart TVs and gaming consoles. Basic and Pro plans are for phones, tablets, and laptops only.", category: "Usage" },
  { question: "What if I accidentally bought the wrong plan?", answer: "Contact us immediately at mrselasi@gmail.com. If you haven't used the voucher yet, we may be able to exchange it for the correct plan.", category: "Support" },
  { question: "What should I do if the WiFi is slow?", answer: "Internet speed depends on network congestion, device capabilities, and location. Try moving closer to the WiFi router or contact the venue staff for help.", category: "Usage" },
  { question: "Are there any hidden fees?", answer: "No. The price displayed at checkout is the final amount. No hidden fees, taxes, or additional charges.", category: "Payment" },
  { question: "How do I contact customer support?", answer: "Email us at mrselasi@gmail.com or call +233 55 521 8254. We respond within 24 hours.", category: "Support" },
  { question: "What if I lose my voucher code?", answer: "Contact our support team with your order reference number and we can resend your voucher to your registered phone number.", category: "Support" },
  { question: "Can I buy via USSD without internet?", answer: "Yes! Dial *384*20423# on any network to buy a plan using mobile money, even without an internet connection.", category: "General" },
];

const categories = ["All", "General", "Payment", "Usage", "Support", "Security"];
const categoryColors: Record<string, string> = {
  General: "from-blue-500 to-indigo-600", Payment: "from-green-500 to-emerald-600",
  Usage: "from-violet-500 to-purple-600", Support: "from-amber-500 to-orange-600", Security: "from-red-500 to-rose-600",
};
const catIcon = (c: string) => ({
  General: <Wifi className="h-3.5 w-3.5" />, Payment: <CreditCard className="h-3.5 w-3.5" />,
  Usage: <HelpCircle className="h-3.5 w-3.5" />, Support: <MessageSquare className="h-3.5 w-3.5" />, Security: <Shield className="h-3.5 w-3.5" />,
}[c] ?? <HelpCircle className="h-3.5 w-3.5" />);

export default function FAQPage() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number[]>([]);

  const items = cat === "All" ? faqData : faqData.filter(f => f.category === cat);
  const toggle = (i: number) => setOpen(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <div className="fixed inset-0 mesh-grid opacity-20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10 pointer-events-none"
           style={{ background: "radial-gradient(ellipse, #6366f1, transparent)", filter: "blur(60px)" }} />

      <header className="relative z-10 glass border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-5 shadow-xl shadow-violet-500/20">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-400">Everything you need to know about ReadyWifi.</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(c => {
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25" : "glass border border-white/8 text-slate-400 hover:text-white hover:border-white/15"}`}>
                {c !== "All" && catIcon(c)}
                {c}
              </button>
            );
          })}
        </div>

        {/* FAQ accordion */}
        <div className="space-y-3 mb-12">
          {items.map((faq, idx) => {
            const isOpen = open.includes(idx);
            const grad = categoryColors[faq.category] ?? "from-indigo-500 to-violet-600";
            return (
              <div key={idx} className={`glass-strong rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? "border-indigo-500/30" : "border-white/6 hover:border-white/10"}`}>
                <button onClick={() => toggle(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${grad} flex items-center justify-center text-white flex-shrink-0`}>
                      {catIcon(faq.category)}
                    </div>
                    <span className="text-sm font-semibold text-white">{faq.question}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1">
                    <div className="border-t border-white/6 pt-4">
                      <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="rounded-2xl p-8 text-center border border-indigo-500/20" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))" }}>
          <div className="text-3xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Still have questions?</h2>
          <p className="text-slate-400 mb-6 text-sm">Can't find the answer you're looking for? Our support team is here to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:mrselasi@gmail.com"
               className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300"
               style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
              <MessageSquare className="h-4 w-4" />Email Support
            </a>
            <a href="tel:+233555218254"
               className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all duration-300">
              <HelpCircle className="h-4 w-4" />Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

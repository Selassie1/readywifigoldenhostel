// app/buy/[planId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Signal,
  Users,
  CheckCircle,
  Shield,
  Clock,
  Zap,
  Lock,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Wifi } from "lucide-react";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  data: string;
  speed: string;
  devices: string;
  stock: number;
  available: boolean;
  popular?: boolean;
}

interface BuyPageProps {
  params: { planId: string };
}

const PLAN_STYLE: Record<string, { gradient: string; glow: string; icon: string; accentBorder: string }> = {
  basic:     { gradient: "from-sky-500 to-cyan-400",      glow: "rgba(14,165,233,0.25)",   icon: "📶", accentBorder: "rgba(14,165,233,0.3)" },
  pro:       { gradient: "from-indigo-500 to-violet-500", glow: "rgba(99,102,241,0.35)",   icon: "⚡", accentBorder: "rgba(99,102,241,0.4)" },
  unlimited: { gradient: "from-fuchsia-500 to-pink-500",  glow: "rgba(217,70,239,0.25)",  icon: "🚀", accentBorder: "rgba(217,70,239,0.3)" },
};

export default function BuyPage({ params }: BuyPageProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [phone, setPhone] = useState("");

  const style = PLAN_STYLE[params.planId] ?? PLAN_STYLE.basic;

  useEffect(() => { fetchPlan(); }, [params.planId]);

  const fetchPlan = async () => {
    try {
      const res  = await fetch("/api/plans");
      const data = await res.json();
      const found = data.plans.find((p: Plan) => p.id === params.planId);
      if (!found) {
        toast.error("Plan not found");
        router.push("/");
        return;
      }
      setPlan(found);
    } catch {
      toast.error("Failed to load plan details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    setProcessing(true);
    try {
      const res  = await fetch("/api/buy", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ plan: plan.id, phone }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Failed to process purchase");
      }
    } catch {
      toast.error("Failed to process purchase");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-deep)" }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading plan…</p>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>

      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20"
          style={{ background: `radial-gradient(ellipse, ${style.glow} 0%, transparent 70%)`, filter: "blur(80px)" }}
        />
      </div>
      <div className="fixed inset-0 mesh-grid opacity-30 pointer-events-none" />

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="relative z-20 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Plans</span>
            </Link>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Wifi className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-white">ReadyWifi</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── PLAN CARD (left, 2 cols) ────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl glass-strong overflow-hidden border animate-slide-up"
              style={{ borderColor: style.accentBorder, boxShadow: `0 0 40px ${style.glow}` }}
            >
              {/* Gradient top bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${style.gradient}`} />

              <div className="p-6">
                {/* Icon + name */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-3xl mb-2">{style.icon}</div>
                    <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
                    <p className="text-xs text-slate-500">{plan.duration}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-white">GHS {plan.price}</div>
                    <div className="text-xs text-slate-500 mt-0.5">one-time payment</div>
                  </div>
                </div>

                {/* Data highlight */}
                <div
                  className="rounded-xl p-5 mb-6 text-center"
                  style={{ background: `linear-gradient(135deg, ${style.glow}, rgba(255,255,255,0.03))`, border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-4xl font-extrabold gradient-text mb-3">{plan.data}</div>
                  <div className="flex items-center justify-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Signal className="h-3.5 w-3.5 text-yellow-400" />{plan.speed}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-green-400" />{plan.devices}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {["High-speed internet", "30 days validity", "Instant SMS delivery", "24/7 network support"].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Stock */}
                <div className="mt-6 pt-5 border-t border-white/6 flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-1.5 h-1.5 rounded-full ${plan.available ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
                  {plan.available ? `${plan.stock} codes in stock` : "Out of stock"}
                </div>
              </div>
            </div>

            {/* Trust badges below the card */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: <Shield className="h-3.5 w-3.5 text-green-400" />, label: "Secure" },
                { icon: <Zap className="h-3.5 w-3.5 text-yellow-400" />,  label: "Instant" },
                { icon: <Lock className="h-3.5 w-3.5 text-blue-400" />,   label: "Encrypted" },
              ].map(b => (
                <div key={b.label} className="glass rounded-xl p-2.5 flex flex-col items-center gap-1 border border-white/5">
                  {b.icon}
                  <span className="text-[10px] text-slate-500">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PURCHASE FORM (right, 3 cols) ──────────────────────────── */}
          <div className="lg:col-span-3 animate-slide-up delay-100">
            <div className="glass-strong rounded-2xl border border-white/8 overflow-hidden">
              {/* Header */}
              <div className="px-7 pt-7 pb-5 border-b border-white/6">
                <h2 className="text-xl font-bold text-white mb-1">Complete Your Purchase</h2>
                <p className="text-sm text-slate-400">Enter your phone number to receive the voucher code by SMS.</p>
              </div>

              <div className="p-7">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="phone-input">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        id="phone-input"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. 0241234567"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                        onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3 text-indigo-400" />
                      Your access code will be sent to this number via SMS.
                    </p>
                  </div>

                  {/* Order summary */}
                  <div className="rounded-xl p-4 space-y-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Order Summary</p>
                    {[
                      { label: `${plan.name} Plan`, value: `GHS ${plan.price}` },
                      { label: "Data", value: plan.data },
                      { label: "Validity", value: plan.duration },
                      { label: "Speed", value: plan.speed },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{r.label}</span>
                        <span className="text-white font-medium">{r.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-white/6 pt-2.5 mt-2.5 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-white">GHS {plan.price}</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={processing || !plan.available}
                    className="w-full py-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    style={{
                      background: processing || !plan.available
                        ? "rgba(99,102,241,0.3)"
                        : `linear-gradient(135deg, var(--accent-1), var(--accent-2))`,
                      boxShadow: processing || !plan.available ? "none" : "0 0 30px rgba(99,102,241,0.4)",
                    }}
                    onMouseEnter={e => { if (!processing && plan.available) { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                    onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.transform = ""; }}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay GHS {plan.price} with Paystack
                      </>
                    )}
                  </button>

                  {/* Payment methods */}
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-3">Accepted payment methods</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-blue-400" />
                        <span>Debit &amp; Credit Cards</span>
                      </div>
                      <div className="w-px h-3 bg-white/10" />
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-green-400" />
                        <span>Mobile Money</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-600 glass rounded-xl px-4 py-3 border border-white/5">
              <Shield className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span>Payments are secured and processed by <strong className="text-slate-400">Paystack</strong>. ReadyWifi never stores your card details.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

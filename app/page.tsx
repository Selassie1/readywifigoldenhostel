// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Wifi,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  Signal,
  Users,
  CheckCircle,
  Smartphone,
  CreditCard,
  MessageSquare,
  Star,
  ChevronDown,
} from "lucide-react";

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

/* ── tiny hook: fade-in on scroll ────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

/* ── plan accent colours ─────────────────────────────────────────────────── */
const PLAN_STYLE: Record<string, { gradient: string; glow: string; badge: string; icon: string }> = {
  basic: {
    gradient: "from-sky-500 to-cyan-400",
    glow: "rgba(14,165,233,0.2)",
    badge: "",
    icon: "📶",
  },
  pro: {
    gradient: "from-indigo-500 to-violet-500",
    glow: "rgba(99,102,241,0.3)",
    badge: "Most Popular",
    icon: "⚡",
  },
  unlimited: {
    gradient: "from-fuchsia-500 to-pink-500",
    glow: "rgba(217,70,239,0.2)",
    badge: "",
    icon: "🚀",
  },
};

export default function HomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const plansReveal  = useReveal();
  const featReveal   = useReveal();
  const stepsReveal  = useReveal();
  const ctaReveal    = useReveal();

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res  = await fetch("/api/plans");
      const data = await res.json();
      setPlans(data.plans);
    } catch (e) {
      console.error("Failed to fetch plans:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Wifi className="h-5 w-5 text-white" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[var(--bg-deep)] animate-pulse" />
              </div>
              <div>
                <span className="text-lg font-800 text-white tracking-tight">ReadyWifi</span>
                <p className="text-[10px] text-slate-500 leading-none -mt-0.5">Golden Hostel</p>
              </div>
            </Link>

            {/* Nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#plans"    className="text-sm text-slate-400 hover:text-white transition-colors">Plans</a>
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#how"      className="text-sm text-slate-400 hover:text-white transition-colors">How It Works</a>
            </div>

            <Link
              href="/admin/login"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse-glow"
               style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 animate-float"
               style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", filter: "blur(50px)", animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
               style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        {/* Mesh grid overlay */}
        <div className="absolute inset-0 mesh-grid opacity-50 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs text-slate-400 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Now serving Golden Hostel residents
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight animate-slide-up">
            Internet that&nbsp;
            <span className="gradient-text">just&nbsp;works.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            Pick a plan, pay online or via USSD, and get your access code by SMS —
            all in under 2 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
            <a
              href="#plans"
              className="btn-primary px-8 py-3.5 text-sm font-semibold flex items-center gap-2 group"
            >
              View Plans
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how"
              className="btn-ghost px-8 py-3.5 text-sm font-semibold flex items-center gap-2"
            >
              How it works
            </a>
          </div>

          {/* Trust signals */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 animate-fade-in delay-300">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-green-400" />
              <span>Secure Paystack payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-yellow-400" />
              <span>Instant SMS delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>30-day validity</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#plans" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 hover:text-slate-400 transition-colors animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </a>
      </section>

      {/* ── PLANS ────────────────────────────────────────────────────────── */}
      <section id="plans" className="py-24">
        <div ref={plansReveal.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <div className={`text-center mb-16 transition-all duration-700 ${plansReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-semibold">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-slate-400 max-w-xl mx-auto">High-speed internet for every need. All plans include 30 days validity and instant SMS delivery.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {plans.map((plan, i) => {
                const style = PLAN_STYLE[plan.id] ?? PLAN_STYLE.basic;
                const isPopular = !!style.badge;
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl transition-all duration-700 ${plansReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                    style={{
                      transitionDelay: `${i * 100 + 200}ms`,
                      boxShadow: isPopular ? `0 0 60px ${style.glow}` : "none",
                    }}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-3.5 inset-x-0 flex justify-center z-20">
                        <span className={`bg-gradient-to-r ${style.gradient} text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg`}>
                          ⭐ {style.badge}
                        </span>
                      </div>
                    )}

                    <div
                      className={`h-full rounded-2xl glass-strong overflow-hidden flex flex-col ${isPopular ? "border border-indigo-500/40" : "border border-white/6 hover:border-white/12"} card-glow`}
                    >
                      {/* Top accent bar */}
                      <div className={`h-1 w-full bg-gradient-to-r ${style.gradient}`} />

                      <div className="p-7 flex flex-col flex-1">
                        {/* Icon + name */}
                        <div className="flex items-start justify-between mb-6">
                          <div>
                            <div className="text-2xl mb-2">{style.icon}</div>
                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{plan.duration}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">GHS&nbsp;{plan.price}</div>
                            <div className="text-xs text-slate-500">one-time</div>
                          </div>
                        </div>

                        {/* Data highlight */}
                        <div className={`rounded-xl p-4 mb-6 bg-gradient-to-r ${style.gradient} bg-opacity-10`}
                             style={{ background: `linear-gradient(135deg, ${style.glow}, transparent)`, border: "1px solid rgba(255,255,255,0.07)" }}>
                          <div className={`text-3xl font-extrabold gradient-text mb-2`}>{plan.data}</div>
                          <div className="flex gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Signal className="h-3 w-3 text-yellow-400" />{plan.speed}</span>
                            <span className="flex items-center gap-1"><Users className="h-3 w-3 text-green-400" />{plan.devices}</span>
                          </div>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2.5 mb-8 flex-1">
                          {["High-speed internet", "30 days validity", "Instant SMS code", "24/7 supported network"].map(f => (
                            <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                              <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        {plan.available ? (
                          <Link
                            href={`/buy/${plan.id}`}
                            className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 group ${isPopular ? `bg-gradient-to-r ${style.gradient} text-white shadow-lg hover:brightness-110 hover:-translate-y-0.5` : "glass hover:bg-white/8 text-white border border-white/10 hover:border-white/20"}`}
                          >
                            Get {plan.name} Plan
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        ) : (
                          <button disabled className="w-full py-3.5 rounded-xl font-semibold text-sm glass text-slate-500 cursor-not-allowed border border-white/5">
                            Out of Stock
                          </button>
                        )}

                        {/* Stock indicator */}
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
                          <span className={`w-1.5 h-1.5 rounded-full ${plan.available ? "bg-green-400 animate-pulse" : "bg-red-500"}`} />
                          {plan.available ? `${plan.stock} codes available` : "Currently unavailable"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 mesh-grid opacity-30 pointer-events-none" />
        <div ref={stepsReveal.ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className={`text-center mb-16 transition-all duration-700 ${stepsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-semibold">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Up and running in minutes</h2>
            <p className="text-slate-400">No paperwork. No waiting. Three steps to fast internet.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0" />

            {[
              {
                step: "01",
                icon: <Signal className="h-6 w-6 text-white" />,
                bg: "from-blue-500 to-indigo-600",
                title: "Pick a Plan",
                desc: "Choose Basic, Pro, or Unlimited based on your data needs and budget.",
              },
              {
                step: "02",
                icon: <CreditCard className="h-6 w-6 text-white" />,
                bg: "from-indigo-500 to-violet-600",
                title: "Pay Securely",
                desc: "Pay via card, mobile money, or USSD (*384*20423#). Powered by Paystack.",
              },
              {
                step: "03",
                icon: <MessageSquare className="h-6 w-6 text-white" />,
                bg: "from-violet-500 to-fuchsia-600",
                title: "Get Your Code",
                desc: "Receive your voucher code by SMS instantly. Enter it on the Wi-Fi portal and browse.",
              },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`relative text-center transition-all duration-700 ${stepsReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 150 + 200}ms` }}
              >
                <div className="inline-flex flex-col items-center">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center mb-5 shadow-xl mx-auto`}>
                    {s.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full glass-strong border border-white/20 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div ref={featReveal.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className={`text-center mb-16 transition-all duration-700 ${featReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3 font-semibold">Why ReadyWifi</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Built for reliability</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Everything you need to stay connected — nothing you don't.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Zap className="h-6 w-6" />, color: "from-yellow-400 to-orange-500", glow: "rgba(251,191,36,0.15)", title: "Lightning Fast", desc: "Up to 100Mbps speeds on the Unlimited plan — stream, game, and browse without buffering." },
              { icon: <Shield className="h-6 w-6" />, color: "from-green-400 to-emerald-500", glow: "rgba(74,222,128,0.12)", title: "Bank-Grade Security", desc: "All payments processed by Paystack with full encryption. Your data is always safe." },
              { icon: <Clock className="h-6 w-6" />, color: "from-blue-400 to-cyan-500", glow: "rgba(96,165,250,0.12)", title: "Instant Activation", desc: "Your voucher code arrives by SMS seconds after payment confirmation. No delays." },
              { icon: <Smartphone className="h-6 w-6" />, color: "from-violet-400 to-purple-500", glow: "rgba(167,139,250,0.12)", title: "USSD Supported", desc: "No internet? No problem. Dial *384*20423# to buy with mobile money from any phone." },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`glass-strong rounded-2xl p-6 border border-white/6 hover:border-white/12 group transition-all duration-700 hover:-translate-y-1 ${featReveal.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 100 + 200}ms`, "--glow": f.glow } as React.CSSProperties}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} bg-opacity-20 flex items-center justify-center mb-4 text-white shadow-lg`}
                     style={{ background: `linear-gradient(135deg, ${f.glow} 0%, rgba(255,255,255,0.05) 100%)`, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className={`bg-gradient-to-br ${f.color} rounded-lg p-1.5 text-white`}>
                    {f.icon}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div ref={ctaReveal.ref} className="max-w-3xl mx-auto">
          <div
            className={`relative rounded-3xl overflow-hidden p-12 text-center transition-all duration-700 ${ctaReveal.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-30" style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)", filter: "blur(40px)" }} />
            </div>

            <div className="relative z-10">
              <div className="text-4xl mb-4">🌐</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get connected?</h2>
              <p className="text-slate-400 mb-8 text-lg">Join Golden Hostel residents enjoying fast, reliable internet every day.</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#plans" className="btn-primary px-8 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 group">
                  Browse Plans
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Smartphone className="h-4 w-4 text-indigo-400" />
                  <span>Or dial <strong className="text-white">*384*20423#</strong> on any network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white">ReadyWifi</span>
                  <p className="text-[10px] text-slate-600 leading-none">Golden Hostel</p>
                </div>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                Fast, affordable internet vouchers for Golden Hostel residents.
                Pay online or via USSD and get your code by SMS.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Network operational
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Plans</h4>
              <ul className="space-y-2.5">
                {[{ label: "Basic — GHS 50", href: "/buy/basic" }, { label: "Pro — GHS 150", href: "/buy/pro" }, { label: "Unlimited — GHS 300", href: "/buy/unlimited" }].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                <li>mrselasi@gmail.com</li>
                <li>+233 55 521 8254</li>
                <li className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> 24/7 available</li>
                <li>USSD: *384*20423#</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">© 2025 ReadyWifi. All rights reserved.</p>
            <div className="flex flex-wrap gap-5">
              {[{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Refund Policy", href: "/refund" }, { label: "FAQ", href: "/faq" }].map(l => (
                <Link key={l.href} href={l.href} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

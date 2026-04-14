// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Mail,
  Copy,
  Wifi,
  Tv2,
  Smartphone,
  AlertTriangle,
  Router,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const [reference, setReference] = useState<string>("");
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [ppskPassword, setPpskPassword] = useState<string>("");
  const [includesTvAccess, setIncludesTvAccess] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("reference");
    if (ref) {
      setReference(ref);
      verifyPayment(ref);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyPayment = async (reference: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/verify?reference=${reference}`);
      const data = await response.json();

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/30 border-t-cyan-500 mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verifying Payment...</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Please wait while we verify your payment and prepare your access
              codes.
            </p>
            <div className="mt-6 flex justify-center space-x-1">
              {[0, 0.1, 0.2].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Verification Failed</h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">{error}</p>
            <div className="space-y-3">
              <Link
                href="/"
                className="w-full bg-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-300 inline-block shadow-lg"
              >
                Try Again
              </Link>
              <Link
                href="/admin"
                className="w-full bg-slate-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-slate-700 transition-all duration-300 inline-block"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 py-10">
      <div className="max-w-2xl w-full mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">

          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 text-center border-b border-slate-700/50">
            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Payment Successful!</h1>
            {/* <p className="text-slate-300 text-sm">
              {includesTvAccess
                ? "Your voucher & TV/Console password are ready"
                : "Your voucher code is ready"}
            </p> */}
          </div>

          <div className="p-6 space-y-5">

            {/* ── Payment summary ── */}
            {paymentData && (
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs">Plan</p>
                  <p className="text-white font-semibold capitalize">{paymentData.plan}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Amount</p>
                  <p className="text-white font-semibold">GHS {paymentData.amount}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Phone</p>
                  <p className="text-white font-semibold">{paymentData.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Status</p>
                  <p className="text-green-400 font-semibold flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 inline-block" />
                    {paymentData.status}
                  </p>
                </div>
              </div>
            )}

            {includesTvAccess ? (
              /* ═══════════════════════════════════════════════════════════
                 DUAL-SECTION LAYOUT — Unlimited Plan (TV included)
              ══════════════════════════════════════════════════════════ */
              <>
                {/* Section 1 — Phones / Tablets / Laptops */}
                <div className="rounded-2xl border border-cyan-500/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 px-5 py-3 flex items-center space-x-3 border-b border-cyan-500/20">
                    <Smartphone className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                    <h2 className="text-sm font-bold text-white">
                    For Phones, Tablets &amp; Laptops
                    </h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                      <p className="text-slate-300">Connect to the Wi-Fi network: <strong className="text-white">Ready Wifi</strong></p>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                      <p className="text-slate-300">A login page will automatically pop up.</p>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                      <div className="flex-1">
                        <p className="text-slate-300 mb-2">Enter your Voucher Code:</p>
                        {voucherCode && (
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 text-center font-mono font-bold text-cyan-400 bg-slate-700/60 px-4 py-2.5 rounded-lg border border-slate-600/50 text-base tracking-wider break-all">
                              {voucherCode}
                            </code>
                            <button
                              onClick={() => copyToClipboard(voucherCode, "Voucher code")}
                              className="p-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-200 flex-shrink-0"
                              title="Copy voucher"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 — Smart TVs & Gaming Consoles */}
                <div className="rounded-2xl border border-purple-500/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/15 to-pink-500/15 px-5 py-3 flex items-center space-x-3 border-b border-purple-500/20">
                    <Tv2 className="h-5 w-5 text-purple-400 flex-shrink-0" />
                    <h2 className="text-sm font-bold text-white">
                      For TVs &amp; Gaming Consoles
                    </h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                      <p className="text-slate-300">Connect to the Wi-Fi network: <strong className="text-white">ReadyWifi_TV/CONSOLE</strong></p>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                      <p className="text-slate-300">Security Type: <strong className="text-white">WPA2</strong></p>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                      <div className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                      <div className="flex-1">
                        <p className="text-slate-300 mb-2">Password:</p>
                        {ppskPassword && (
                          <div className="flex items-center space-x-2">
                            <code className="flex-1 text-center font-mono font-bold text-purple-400 bg-slate-700/60 px-4 py-2.5 rounded-lg border border-slate-600/50 text-base tracking-wider break-all">
                              {ppskPassword}
                            </code>
                            <button
                              onClick={() => copyToClipboard(ppskPassword, "TV password")}
                              className="p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex-shrink-0"
                              title="Copy TV password"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ⚠️ Critical warning */}
                  <div className="mx-5 mb-5 bg-red-500/10 border border-red-500/40 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-300 font-bold text-sm mb-1">IMPORTANT: Read before connecting</p>
                        <p className="text-red-200/80 text-xs leading-relaxed">
                          This TV/Console password is strictly locked to a{" "}
                          <strong className="text-red-300">1-device limit</strong>. It will permanently
                          bind to the <strong className="text-red-300">VERY FIRST</strong> device that
                          connects to it. Do{" "}
                          <strong className="text-red-300">not</strong> share this password with
                          anyone, or your TV/Console will be permanently blocked from the network.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* ═══════════════════════════════════════════════════════════
                 STANDARD PLAN — Voucher only
              ══════════════════════════════════════════════════════════ */
              <>
                {voucherCode && (
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-white mb-1">Your Voucher Code</h3>
                      <p className="text-slate-400 text-xs">Copy this code to connect to ReadyWifi</p>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <code className="text-xl font-mono font-bold text-cyan-400 bg-slate-700/50 px-4 py-3 rounded-lg border border-slate-600/50 break-all flex-1 text-center">
                        {voucherCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(voucherCode, "Voucher code")}
                        className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-slate-400">
                      <Mail className="h-3 w-3" />
                      <span>You'll also receive this code via SMS</span>
                    </div>
                  </div>
                )}

                {/* How to connect */}
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                  <h3 className="text-sm font-semibold text-white mb-4 flex items-center justify-center">
                    <Router className="h-4 w-4 mr-2 text-cyan-400" />
                    How to Connect
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Connect to ReadyWifi network",
                      "Open browser — login page pops up",
                      "Enter your voucher code above",
                      "Enjoy your internet access!",
                    ].map((step, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-slate-300 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* SMS notice */}
            <div className="flex items-center justify-center text-xs text-slate-400 bg-slate-700/30 rounded-lg p-3">
              <Mail className="h-3 w-3 mr-2 text-cyan-400" />
              <span>All codes have been sent to your phone via SMS</span>
            </div>

            {/* CTA */}
            <Link
              href="/"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl block"
            >
              Buy Another Voucher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

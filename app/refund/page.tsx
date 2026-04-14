// app/refund/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg">
                <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Refund Policy
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  ReadyWifi Refund Guidelines
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 border border-slate-600/50 hover:border-cyan-500/50"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-sm sm:text-base">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8 lg:p-12">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <RefreshCw className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">Refund Policy</h2>
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                General Refund Policy
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                At ReadyWifi, we strive to provide excellent service and
                customer satisfaction. However, due to the digital nature of our
                WiFi voucher services, we have specific refund policies in
                place.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                  <span className="text-amber-400 font-semibold">
                    Important Notice
                  </span>
                </div>
                <p className="text-amber-300 text-sm">
                  All sales are generally final once a voucher code has been
                  delivered. Refunds are only available under specific
                  circumstances as outlined below.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                When Refunds Are Available
              </h3>
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    ✅ Technical Issues
                  </h4>
                  <p className="text-slate-300 text-sm">
                    If you experience technical difficulties that prevent you
                    from using your voucher code, and our support team cannot
                    resolve the issue within 24 hours.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    ✅ Duplicate Payment
                  </h4>
                  <p className="text-slate-300 text-sm">
                    If you were charged multiple times for the same purchase due
                    to a system error on our end.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    ✅ Wrong Plan Purchased
                  </h4>
                  <p className="text-slate-300 text-sm">
                    If you accidentally purchased the wrong data plan and
                    contact us within 1 hour of purchase before using the
                    voucher code.
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="text-green-400 font-semibold mb-2">
                    ✅ Service Unavailable
                  </h4>
                  <p className="text-slate-300 text-sm">
                    If the WiFi service is completely unavailable in your area
                    and this was not disclosed at the time of purchase.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <XCircle className="h-5 w-5 text-red-400 mr-2" />
                When Refunds Are NOT Available
              </h3>
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">
                    ❌ Voucher Code Used
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Once a voucher code has been used or activated, no refunds
                    will be provided.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">
                    ❌ Change of Mind
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Refunds are not available simply because you changed your
                    mind after purchase.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">
                    ❌ Slow Internet Speed
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Refunds are not available due to slow internet speeds, as
                    this is dependent on various factors beyond our control.
                  </p>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">
                    ❌ Expired Voucher
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Refunds are not available for expired voucher codes that
                    were not used within the validity period.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-blue-400 mr-2" />
                Refund Process
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    Step 1: Contact Support
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Email us at mrselasi@gmail.com with your order details and
                    reason for refund request.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    Step 2: Investigation
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Our team will investigate your request within 24-48 hours
                    and verify the circumstances.
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">
                    Step 3: Processing
                  </h4>
                  <p className="text-slate-300 text-sm">
                    If approved, refunds will be processed within 3-7 business
                    days to your original payment method.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                Refund Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Processing Time
                  </h4>
                  <p className="text-slate-300 text-sm">3-7 business days</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-2">
                    Request Deadline
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Within 7 days of purchase
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                Contact Information
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                For refund requests or questions about this policy, please
                contact us:
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-300">
                  <strong>Email:</strong> mrselasi@gmail.com
                  <br />
                  <strong>Phone:</strong> +233 55 521 8254
                  <br />
                  <strong>Response Time:</strong> Within 24 hours
                  <br />
                  <strong>Business Hours:</strong> Monday - Friday, 8:00 AM -
                  6:00 PM GMT
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                Policy Updates
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to update this refund policy at any time.
                Changes will be posted on this page with an updated revision
                date. Continued use of our services after changes constitutes
                acceptance of the new policy.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm text-center">
              This refund policy is effective as of{" "}
              {new Date().toLocaleDateString()} and applies to all ReadyWifi
              services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

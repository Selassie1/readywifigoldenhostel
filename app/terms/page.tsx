// app/terms/page.tsx
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 shadow-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  Terms and Conditions
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm hidden sm:block">
                  ReadyWifi Service Terms
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
              <Shield className="h-6 w-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Terms and Conditions
              </h2>
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
                1. Acceptance of Terms
              </h3>
              <p className="text-slate-300 leading-relaxed">
                By accessing and using ReadyWifi services, you accept and agree
                to be bound by the terms and provision of this agreement. If you
                do not agree to abide by the above, please do not use this
                service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                2. Service Description
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                ReadyWifi provides WiFi voucher services that allow customers to
                purchase internet access codes for various data plans and
                connect to our access points. Our service includes:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Secure payment processing through Paystack</li>
                <li>Instant voucher code delivery via SMS</li>
                <li>24/7 customer support</li>
                <li>Multiple data plan options</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                3. User Responsibilities
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                As a user of our service, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Provide accurate and complete during purchase</li>
                <li>Use the service only for lawful purposes</li>
                <li>Not share or resell voucher codes without authorization</li>
                <li>
                  Maintain the confidentiality of your account information
                </li>
                <li>Report any unauthorized use of your account immediately</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                4. Payment Terms
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                All payments are processed securely through Paystack. By making
                a purchase, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
                <li>Pay the full amount as displayed at checkout</li>
                <li>Provide valid payment information</li>
                <li>Accept our refund policy as outlined separately</li>
                <li>
                  Understand that all sales are final unless otherwise stated
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                5. Service Availability
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We strive to maintain 99.9% uptime, but we cannot guarantee
                uninterrupted service. We reserve the right to modify, suspend,
                or discontinue any part of our service at any time without
                notice. We are not liable for any downtime or service
                interruptions.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                6. Limitation of Liability
              </h3>
              <p className="text-slate-300 leading-relaxed">
                ReadyWifi shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other
                intangible losses, resulting from your use of the service.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                7. Privacy Policy
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the service, to
                understand our practices.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                8. Changes to Terms
              </h3>
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes via email or through our
                website. Your continued use of the service after such
                modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                9. Contact Information
              </h3>
              <p className="text-slate-300 leading-relaxed">
                If you have any questions about these Terms and Conditions,
                please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
                <p className="text-slate-300">
                  <strong>Email:</strong> mrselasi@gmail.com
                  <br />
                  <strong>Phone:</strong> +233 55 521 8254
                  <br />
                  <strong>Address:</strong> Tamale, Ghana
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-slate-400 text-sm text-center">
              By using ReadyWifi services, you acknowledge that you have read,
              understood, and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wifi,
  Smartphone,
  CreditCard,
  CheckCircle,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Globe,
  WifiIcon,
  Signal,
  Users,
  Award,
  Headphones,
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

export default function HomePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/api/plans");
      const data = await response.json();
      setPlans(data.plans);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl">
                <Wifi className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  ReadyWifi
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Premium Internet Solutions
                </p>
              </div>
            </div>
            <Link
              href="/admin/login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-md sm:rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg text-xs sm:text-sm font-medium"
            >
              <span className="hidden sm:inline">Admin Dashboard</span>
              <span className="sm:hidden">Admin</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Fast & Reliable
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Internet Access
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant internet access with our easy-to-use voucher system.
              Affordable, reliable, and activated immediately.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link
                href="/buy/unlimited"
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center group text-sm sm:text-base"
              >
                Get Started
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-slate-400 text-xs sm:text-sm">
                or browse plans below
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              High-speed internet plans for every need. All plans include 30
              days validity.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative group ${
                    plan.popular ? "lg:scale-105 z-10" : "hover:scale-105"
                  } transition-all duration-300 ${
                    !plan.available ? "opacity-50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div
                    className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border ${
                      plan.popular
                        ? "border-cyan-500/50 shadow-cyan-500/20"
                        : "border-slate-700/50 hover:border-cyan-500/30"
                    } transition-all duration-300`}
                  >
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                            plan.popular
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                              : "bg-gradient-to-r from-slate-600 to-slate-700"
                          }`}
                        >
                          <Zap className="h-6 w-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {plan.name}
                        </h3>

                        <div className="text-4xl font-bold text-white mb-2">
                          GHS {plan.price}
                        </div>

                        <div className="text-sm text-slate-400 mb-4">
                          {plan.duration}
                        </div>

                        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">
                          {plan.data}
                        </div>

                        <div className="flex items-center justify-center space-x-4 mb-4 text-xs text-slate-300">
                          <div className="flex items-center">
                            <Signal className="h-3 w-3 mr-1 text-yellow-400" />
                            <span>{plan.speed}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1 text-green-400" />
                            <span>{plan.devices}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span>High-speed internet</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span>30 days validity</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span>24/7 support</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          <span>Instant activation</span>
                        </div>
                      </div>

                      {plan.available ? (
                        <Link
                          href={`/buy/${plan.id}`}
                          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center group ${
                            plan.popular
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-lg"
                              : "bg-slate-700 text-white hover:bg-slate-600"
                          }`}
                        >
                          Get This Plan
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full py-3 px-4 rounded-xl font-semibold bg-slate-700 text-slate-500 cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}

                      <div className="text-center mt-4">
                        <span className="text-xs text-slate-500">
                          {plan.stock} codes available
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose ReadyWifi?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Reliable internet access with cutting-edge technology and
              exceptional service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Global Network
              </h3>
              <p className="text-slate-300 text-sm">
                Connected to a global network infrastructure ensuring maximum
                speed and reliability.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Secure & Safe
              </h3>
              <p className="text-slate-300 text-sm">
                Bank-level security with Paystack integration. Your payment
                information is always protected.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-slate-300 text-sm">
                Experience blazing-fast internet speeds up to 100Mbps+ with our
                premium network.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Instant Access
              </h3>
              <p className="text-slate-300 text-sm">
                Receive your access code via SMS immediately after payment
                confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Connected?
          </h2>
          <p className="text-lg text-slate-300 mb-8">
            Join thousands of satisfied customers enjoying premium internet
            access
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/buy/unlimited"
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
            >
              Get the Unlimited Plan
            </Link>
            <Link
              href="/buy/unlimited"
              className="px-8 py-3 bg-transparent border-2 border-slate-400 text-slate-300 rounded-xl font-semibold hover:bg-slate-600 hover:text-white transition-all duration-300"
            >
              View Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
                  <Wifi className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ReadyWifi</h3>
                  <p className="text-sm text-slate-400">Premium Internet</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Ghana's leading internet service provider with lightning-fast
                speeds and reliable service.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">
                Quick Links
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-cyan-400 transition-colors text-sm"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/buy/unlimited"
                    className="hover:text-cyan-400 transition-colors text-sm"
                  >
                    Unlimited Plan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center text-sm">
                  <Headphones className="h-4 w-4 mr-2 text-cyan-400" />
                  24/7 Customer Service
                </li>
                <li className="text-sm">Email: mrselasi@gmail.com</li>
                <li className="text-sm">Phone: +233 55 521 8254</li>
                <li className="text-sm">Live Chat Available</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-cyan-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-slate-400 text-sm">
                &copy; 2025 ReadyWifi. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/refund"
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  Refund Policy
                </Link>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

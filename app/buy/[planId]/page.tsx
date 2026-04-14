// app/buy/[planId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Zap,
  Signal,
  Users,
  CheckCircle,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
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
  params: {
    planId: string;
  };
}

export default function BuyPage({ params }: BuyPageProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
  });

  useEffect(() => {
    fetchPlan();
  }, [params.planId]);

  const fetchPlan = async () => {
    try {
      const response = await fetch("/api/plans");
      const data = await response.json();
      const selectedPlan = data.plans.find((p: Plan) => p.id === params.planId);

      if (!selectedPlan) {
        toast.error("Plan not found");
        router.push("/");
        return;
      }

      setPlan(selectedPlan);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
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
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan.id,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Paystack checkout
        window.location.href = data.paymentUrl;
      } else {
        toast.error(data.error || "Failed to process purchase");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to process purchase");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading plan details...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Plan not found</h1>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link
              href="/"
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Plans
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        {plan.name} Plan
                      </h1>
                      <p className="text-sm text-slate-400">{plan.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      GHS {plan.price}
                    </div>
                    <div className="text-sm text-slate-400">
                      One-time payment
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Data Highlight */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 mb-6 border border-cyan-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {plan.data}
                    </div>
                    <div className="flex items-center justify-center space-x-6 text-sm text-slate-300">
                      <div className="flex items-center">
                        <Signal className="h-4 w-4 mr-2 text-yellow-400" />
                        <span className="font-medium">{plan.speed}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-green-400" />
                        <span className="font-medium">{plan.devices}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white mb-3">
                    What's Included:
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-slate-300 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      <span>High-speed internet</span>
                    </div>
                    <div className="flex items-center text-slate-300 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      <span>30 days validity</span>
                    </div>
                    <div className="flex items-center text-slate-300 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      <span>24/7 support</span>
                    </div>
                    <div className="flex items-center text-slate-300 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      <span>Instant activation</span>
                    </div>
                  </div>
                </div>

                {/* Stock */}
                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-center text-xs text-slate-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {plan.stock} codes available
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Form */}
          <div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white mb-2">
                  Complete Purchase
                </h2>
                <p className="text-sm text-slate-400">
                  Enter your details to proceed with payment
                </p>
              </div>

              {/* Form */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                      placeholder="+233XXXXXXXXX"
                      required
                    />
                    <p className="text-xs text-slate-400 mt-2">
                      We'll send your access code via SMS
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={processing || !plan.available}
                    className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-3" />
                        Pay GHS {plan.price}
                      </>
                    )}
                  </button>
                </form>

                {/* Payment Info */}
                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-green-400" />
                      Secure Payment
                    </h3>
                    <span className="text-xs text-slate-400">
                      Powered by Paystack
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center">
                      <CreditCard className="h-3 w-3 mr-1 text-cyan-400" />
                      <span>Cards</span>
                    </div>
                    <div className="flex items-center">
                      <Smartphone className="h-3 w-3 mr-1 text-green-400" />
                      <span>Mobile Money</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-yellow-400" />
                      <span>Instant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

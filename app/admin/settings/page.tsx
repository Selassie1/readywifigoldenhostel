// app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Settings,
  Save,
  RefreshCw,
  Wifi,
  Mail,
  Smartphone,
  Globe,
  Shield,
  Database,
  Bell,
  CreditCard,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

interface SettingsData {
  mnotifyApiKey: string;
  mnotifySenderId: string;
  paystackPublicKey: string;
  paystackSecretKey: string;
  supportPhone: string;
  supportEmail: string;
  appUrl: string;
  ussdCode: string;
  maintenanceMode: boolean;
  smsEnabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    mnotifyApiKey: "",
    mnotifySenderId: "",
    paystackPublicKey: "",
    paystackSecretKey: "",
    supportPhone: "",
    supportEmail: "",
    appUrl: "",
    ussdCode: "",
    maintenanceMode: false,
    smsEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, you'd fetch from an API
      // For now, we'll use placeholder data
      setSettings({
        mnotifyApiKey: "••••••••••••••••",
        mnotifySenderId: "ReadyWifi",
        paystackPublicKey: "pk_test_••••••••••••••••",
        paystackSecretKey: "sk_test_••••••••••••••••",
        supportPhone: "+233 XX XXX XXXX",
        supportEmail: "support@readywifi.com",
        appUrl: "https://your-app.vercel.app",
        ussdCode: "*123#",
        maintenanceMode: false,
        smsEnabled: true,
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, you'd save to an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleSecretVisibility = () => {
    setShowSecrets(!showSecrets);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-500/30 border-t-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                href="/admin"
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Back</span>
              </Link>
              <div className="h-4 sm:h-6 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-white">
                    Settings
                  </h1>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg text-xs sm:text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* API Configuration */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <Key className="h-5 w-5 mr-2 sm:mr-3 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                API Configuration
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  MNotify API Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={settings.mnotifyApiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        mnotifyApiKey: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 pr-12"
                    placeholder="Enter MNotify API key"
                  />
                  <button
                    type="button"
                    onClick={toggleSecretVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSecrets ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  MNotify Sender ID
                </label>
                <input
                  type="text"
                  value={settings.mnotifySenderId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      mnotifySenderId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  placeholder="Enter sender ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Paystack Public Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={settings.paystackPublicKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paystackPublicKey: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 pr-12"
                    placeholder="Enter Paystack public key"
                  />
                  <button
                    type="button"
                    onClick={toggleSecretVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSecrets ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Paystack Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecrets ? "text" : "password"}
                    value={settings.paystackSecretKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paystackSecretKey: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 pr-12"
                    placeholder="Enter Paystack secret key"
                  />
                  <button
                    type="button"
                    onClick={toggleSecretVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showSecrets ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* App Configuration */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <Globe className="h-5 w-5 mr-2 sm:mr-3 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                App Configuration
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  App URL
                </label>
                <input
                  type="url"
                  value={settings.appUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, appUrl: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  placeholder="https://your-app.vercel.app"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Your Vercel deployment URL
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  USSD Code
                </label>
                <input
                  type="text"
                  value={settings.ussdCode}
                  onChange={(e) =>
                    setSettings({ ...settings, ussdCode: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  placeholder="*123#"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <label
                    htmlFor="maintenanceMode"
                    className="ml-2 text-sm text-slate-300"
                  >
                    Maintenance Mode
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsEnabled"
                    checked={settings.smsEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, smsEnabled: e.target.checked })
                    }
                    className="h-4 w-4 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                  />
                  <label
                    htmlFor="smsEnabled"
                    className="ml-2 text-sm text-slate-300"
                  >
                    SMS Enabled
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <Bell className="h-5 w-5 mr-2 sm:mr-3 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Support Information
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Support Phone
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) =>
                    setSettings({ ...settings, supportPhone: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
                  placeholder="support@readywifi.com"
                />
              </div>
            </div>
          </div>

          {/* Database Information */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-slate-700/50 p-4 sm:p-6">
            <div className="flex items-center mb-4 sm:mb-6">
              <Database className="h-5 w-5 mr-2 sm:mr-3 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Database Status
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <h3 className="text-sm font-semibold text-white">
                    Connection
                  </h3>
                </div>
                <p className="text-slate-400 text-xs">MongoDB Atlas</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></div>
                  <h3 className="text-sm font-semibold text-white">
                    Collections
                  </h3>
                </div>
                <p className="text-slate-400 text-xs">6 Active</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full mr-3"></div>
                  <h3 className="text-sm font-semibold text-white">Backup</h3>
                </div>
                <p className="text-slate-400 text-xs">Daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

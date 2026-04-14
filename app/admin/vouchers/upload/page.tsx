// app/admin/vouchers/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  Wifi,
  AlertCircle,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function VoucherUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("unlimited");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // To add a new plan later, add an entry to this array.
  const plans = [
    { id: "unlimited", name: "Unlimited", data: "Unlimited", duration: "30 Days" },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Please select a CSV file");
        return;
      }
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("plan", selectedPlan);

      const response = await fetch("/api/admin/vouchers/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result);
        toast.success("Vouchers uploaded successfully");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-slate-600"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Upload Vouchers
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Upload Form */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-cyan-400" />
              Upload CSV File
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Select Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedPlan === plan.id
                          ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : "border-slate-600/50 bg-slate-700/30 hover:border-slate-500/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">
                          {plan.name}
                        </h3>
                        {selectedPlan === plan.id && (
                          <CheckCircle className="h-4 w-4 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-300 mb-1">{plan.data}</p>
                      <p className="text-xs text-slate-400">{plan.duration}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CSV File
                </label>
                <div
                  className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 sm:p-8 text-center hover:border-cyan-500/50 transition-all duration-300 cursor-pointer bg-slate-700/30 hover:bg-slate-700/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-center">
                      <FileText className="h-8 w-8 text-cyan-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-sm text-slate-300">
                        Click to select CSV file
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Only CSV files are accepted
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Vouchers
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-cyan-400" />
                CSV Format Requirements
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  Your CSV file should contain a column named{" "}
                  <code className="bg-slate-700 px-2 py-1 rounded text-cyan-400">
                    code
                  </code>{" "}
                  with voucher codes.
                </p>
                <p>Example format:</p>
                <div className="bg-slate-700/50 p-3 rounded-lg font-mono text-xs border border-slate-600/50">
                  code
                  <br />
                  ABC12345
                  <br />
                  DEF67890
                  <br />
                  GHI11111
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                Upload Process
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    1
                  </div>
                  Select the plan for the vouchers
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    2
                  </div>
                  Choose your CSV file
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    3
                  </div>
                  Click upload to process
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    4
                  </div>
                  Review the upload results
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Results */}
        {uploadResult && (
          <div className="mt-6 sm:mt-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Upload Results</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-slate-700/30 p-4 sm:p-6 rounded-xl border border-slate-600/30">
                <p className="text-sm text-slate-400 mb-2">Total Codes</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {uploadResult.stats.total}
                </p>
              </div>

              <div className="bg-amber-500/10 p-4 sm:p-6 rounded-xl border border-amber-500/20">
                <p className="text-sm text-amber-400 mb-2">Duplicates</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {uploadResult.stats.duplicates}
                </p>
              </div>

              <div className="bg-green-500/10 p-4 sm:p-6 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-400 mb-2">Imported</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {uploadResult.stats.imported}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <p className="text-sm text-cyan-300">
                <strong>Batch ID:</strong>{" "}
                <span className="font-mono text-cyan-400">
                  {uploadResult.batchId}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

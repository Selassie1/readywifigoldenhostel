// app/admin/ppsk/page.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  Tv2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PpskUploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".csv")) {
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

      const response = await fetch("/api/admin/ppsk/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        setUploadResult(result);
        toast.success("PPSK passwords uploaded successfully");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
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
              <div className="h-6 w-px bg-slate-600" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Tv2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    Upload PPSK Passwords
                  </h1>
                  <p className="text-xs text-slate-400">
                    For Smart TVs &amp; Gaming Consoles
                  </p>
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
              <Upload className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-purple-400" />
              Upload CSV File
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Plan badge */}
              <div className="p-4 rounded-xl border-2 border-purple-500/50 bg-purple-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">Unlimited Plan</h3>
                    <p className="text-sm text-slate-300 mt-0.5">
                      📺 TV / Console PPSK passwords
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-purple-400" />
                </div>
              </div>

              {/* File drop zone */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  CSV File
                </label>
                <div
                  className="border-2 border-dashed border-slate-600/50 rounded-xl p-6 sm:p-8 text-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer bg-slate-700/30 hover:bg-slate-700/50"
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
                      <FileText className="h-8 w-8 text-purple-400 mr-3" />
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Passwords
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Instructions */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-purple-400" />
                CSV Format Requirements
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  Your CSV must have a column named{" "}
                  <code className="bg-slate-700 px-2 py-1 rounded text-purple-400">
                    password
                  </code>{" "}
                  containing the Omada PPSK values.
                </p>
                <p>Example format:</p>
                <div className="bg-slate-700/50 p-3 rounded-lg font-mono text-xs border border-slate-600/50">
                  password
                  <br />
                  MySecurePass1
                  <br />
                  MySecurePass2
                  <br />
                  MySecurePass3
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-400" />
                How PPSK works
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    1
                  </div>
                  Upload PPSK passwords from your Omada controller
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    2
                  </div>
                  When a customer buys the Unlimited plan, they automatically
                  receive one password
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    3
                  </div>
                  The password is shown on the success page and sent via SMS
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0 mt-0.5">
                    ⚠
                  </div>
                  Each PPSK binds permanently to the first device — keep stock
                  topped up
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
                <p className="text-sm text-slate-400 mb-2">Total Passwords</p>
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
            <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <p className="text-sm text-purple-300">
                <strong>Batch ID:</strong>{" "}
                <span className="font-mono text-purple-400">
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

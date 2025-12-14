"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 text-white p-6 flex flex-col items-center">
      {/* Header Section */}
      <header className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-2">AI Skin Disease Detector</h1>
        <p className="text-gray-400 text-lg">
          Upload a skin image to detect the condition. Simple, fast, and accurate.
        </p>
      </header>

      {/* Upload Section */}
      <section className="w-full max-w-3xl mb-12">
        <h2 className="text-2xl font-bold mb-4">Upload Image</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-800 rounded-xl h-64 overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-contain max-h-full max-w-full"
              />
            ) : (
              <span className="text-gray-400">No image selected</span>
            )}
          </div>

          {/* File Input and Button */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file:py-2 file:px-4 file:border-0 file:bg-purple-600 file:text-white file:rounded-lg hover:file:bg-purple-700 cursor-pointer"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !file}
              className="w-full py-3 rounded-lg bg-purple-500 hover:bg-purple-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Detect Disease"}
            </button>
            {error && <p className="text-red-400">{error}</p>}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="w-full max-w-3xl mb-12">
          <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col gap-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {preview && (
                <div className="w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden border-2 border-gray-700">
                  <img
                    src={preview}
                    alt="Uploaded"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-purple-400">{result.class}</h3>
                <p className="text-gray-300">Confidence: {(result.confidence * 100).toFixed(2)}%</p>
              </div>
            </div>

            {/* Scores Bar Chart */}
            <div className="flex flex-col gap-2">
              {Object.entries(result.all_scores).map(([key, val]: [string, any]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="w-32 text-gray-200">{key}</span>
                  <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val * 100}%` }}
                      className="h-5 bg-purple-500 rounded"
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-200">{(val * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setResult(null);
                setError(null);
              }}
              className="mt-4 w-full py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition font-semibold"
            >
              Upload Another Image
            </button>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="text-gray-500 text-sm mt-auto text-center">
        Built with ❤️ using Next.js, Tailwind CSS & FastAPI
      </footer>
    </main>
  );
}

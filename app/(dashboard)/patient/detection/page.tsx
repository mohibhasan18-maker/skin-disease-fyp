'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Button } from '@/components/Button';

interface PredictionResult {
  disease?: string;
  class?: string;
  confidence: number;
  confidences?: Record<string, number>;
  severity?: string;
  recommendations?: string;
}

export default function SkinDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      handleFileChange(selected);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const data: any = await api.analyzeSkinImage(formData);
      setResult({
        class: data.disease || data.class || "Unknown",
        confidence: data.confidence || 0,
        confidences: data.confidences || data.all_scores, // handle new 'confidences' or fallback to 'all_scores'
        severity: data.severity,
        recommendations: data.recommendations
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
          AI Optical <span className="text-primary">Diagnostic</span>
        </h1>
        <p className="text-foreground/40 font-medium max-w-2xl mx-auto leading-relaxed">
          Leverage our proprietary neural networks for immediate dermatological screening. High-fidelity imaging ensures maximum diagnostic precision.
        </p>
      </div>

      {/* Upload Section */}
      <div className="glass-card rounded-[2.5rem] p-12 border border-foreground/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-20" />
        
        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`group relative border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-500 cursor-pointer overflow-hidden ${
              dragActive
                ? 'border-primary bg-primary/5 scale-[0.99] shadow-inner shadow-primary/10'
                : 'border-foreground/10 hover:border-primary/40 hover:bg-foreground/[0.02]'
            }`}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />

            <div className="relative z-10 space-y-8">
              <div className="mx-auto w-24 h-24 bg-surface-highest/50 rounded-3xl flex items-center justify-center border border-foreground/5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
                  Initialize Visual Capture
                </h3>
                <p className="text-sm font-medium text-foreground/40 max-w-sm mx-auto uppercase tracking-widest">
                  Secure Transfer Protocol (JPG, PNG) • Max size 10MB
                </p>
              </div>

              <label className="inline-flex items-center px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-primary/20 cursor-pointer">
                Choose Source
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in zoom-in-95 duration-500">
            {/* Image Preview Container */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-[2rem] overflow-hidden border border-foreground/10 shadow-2xl">
                    <img
                    src={preview}
                    alt="Clinical preview"
                    className="max-w-xl w-full h-auto max-h-[400px] object-cover"
                  />
                  {loading && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-1 bg-primary/40 shadow-[0_0_15px_rgba(78,222,163,0.5)] animate-scan" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                </div>
                
                <button
                  onClick={resetUpload}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 hover:rotate-90 shadow-xl shadow-red-500/20 transition-all z-20"
                  aria-label="Remove image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-8 flex items-center gap-3 bg-surface-highest/50 px-4 py-2 rounded-full border border-foreground/5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                  {file?.name} • {(file?.size || 0) / 1024 / 1024 > 1 ? `${((file?.size || 0) / 1024 / 1024).toFixed(1)} MB` : `${((file?.size || 0) / 1024).toFixed(0)} KB`}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                variant="primary"
                size="lg"
                className="min-w-[240px] h-16 !rounded-2xl text-lg shadow-xl shadow-primary/20 bg-primary translate-y-0 active:translate-y-1 transition-all"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    <span>Neural Processing...</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze Specimen
                  </span>
                )}
              </Button>
              
              <button
                onClick={resetUpload}
                disabled={loading}
                className="h-16 px-10 border border-foreground/10 text-foreground/40 rounded-2xl font-bold uppercase tracking-widest text-xs hover:border-foreground/20 hover:text-foreground transition-all disabled:opacity-30 translate-y-0 active:translate-y-1 transition-all"
              >
                Reset Upload
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
               <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10"
        >
          <div className="glass-card rounded-[2.5rem] p-12 border border-foreground/5 shadow-2xll">
            <div className="flex flex-col md:flex-row gap-12">
              {/* Main Classification Circle */}
              <div className="shrink-0 flex flex-col items-center justify-center p-8 bg-surface-highest/50 rounded-[2rem] border border-foreground/5 min-w-[300px]">
                <div className="relative mb-6">
                   <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-foreground/5"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray="364.4"
                      initial={{ strokeDashoffset: 364.4 }}
                      animate={{ strokeDashoffset: 364.4 - (364.4 * result.confidence) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-heading font-extrabold text-foreground">
                      {(result.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest">Confidence</span>
                  </div>
                </div>

                <div className="text-center">
                   <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.2em] mb-1">Primary Prediction</p>
                   <h2 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
                    {result.class}
                  </h2>
                </div>
              </div>

              {/* Detailed Spectrum */}
              <div className="flex-1 space-y-8">
                <div>
                   <h4 className="text-lg font-heading font-extrabold text-foreground tracking-tight mb-2">
                    Condition Spectrum
                  </h4>
                  <p className="text-sm font-medium text-foreground/40">Relative probability distribution across analyzed categories.</p>
                </div>
                {result.class === "Uncertain" && (
                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                    <p className="text-yellow-400 font-medium">
                      ⚠️ Model is not confident. Please upload a clearer skin image.
                    </p>
                  </div>
                )}

                {result.severity && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Severity</h5>
                    <div className="p-4 bg-surface-highest/50 border border-foreground/5 rounded-2xl">
                      <p className={`font-bold capitalize ${result.severity.toLowerCase() === 'high' ? 'text-red-400' : result.severity.toLowerCase() === 'medium' ? 'text-yellow-400' : 'text-primary'}`}>
                        {result.severity}
                      </p>
                    </div>
                  </div>
                )}
                
                {result.recommendations && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">Recommendations</h5>
                    <div className="p-4 bg-surface-highest/50 border border-foreground/5 rounded-2xl">
                      <p className="text-sm text-foreground/70">{result.recommendations}</p>
                    </div>
                  </div>
                )}
                
                {result.confidences && Object.keys(result.confidences).length > 0 && (
                  <div className="space-y-6">
                    {Object.entries(result.confidences || {})
                      .sort(([, a], [, b]) => b - a)
                      .map(([condition, score]) => (
                        <div key={condition} className="space-y-3">
                           <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-widest">{condition}</span>
                            <span className="text-sm font-heading font-extrabold text-foreground">
                               {(score * 100).toFixed(1)}%
                            </span>
                          </div>
                           <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                             <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score * 100}%` }}
                              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                              className={`h-full rounded-full ${score > 0.5 ? 'bg-primary' : score > 0.1 ? 'bg-secondary/60' : 'bg-foreground/20'}`}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Disclaimer & Next steps */}
            <div className="mt-12 pt-10 border-t border-foreground/5 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-4 max-w-xl">
                 <div className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center shrink-0 border border-yellow-400/20">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                 </div>
                 <p className="text-sm font-medium text-foreground/50 leading-relaxed italic">
                  Note: AI predictions are for clinical assistance only and do not replace professional dermatological consultation. Please refer this case to a specialist for valid diagnosis.
                 </p>
              </div>

              <Link href="/patient/consultations">
                <Button
                  variant="primary"
                  size="lg"
                  className="min-w-[280px] h-16 !rounded-2xl text-lg shadow-xl shadow-secondary/20 bg-secondary"
                >
                  Request Specialist Review
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
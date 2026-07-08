'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';

export default function PatientDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await api.getPatientDashboard();
        setData(result);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Identity Data...</div>;
  }

  // Support both snake_case and camelCase from backend
  const recentScans = data?.recent_scans || data?.recentScans || [];
  const recentConsultations = data?.recent_consultations || data?.recentConsultations || [];
  // Dummy fallback if stats aren't exactly matching
  const stats = data?.stats || {
    totalScans: data?.total_scans || recentScans.length || 0,
    activeConsultations: data?.active_consultations || recentConsultations.length || 0,
    completedConsultations: data?.completed_consultations || 0,
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Welcome Section */}
      <div className="relative overflow-hidden glass-card rounded-[2rem] p-10 border border-foreground/5 bg-medical-glow bg-no-repeat bg-center bg-cover shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-heading font-extrabold text-white mb-3 tracking-tight">
              Clinical Greetings, {data?.user?.name || data?.name || 'Patient'}.
            </h2>
            <p className="text-foreground/60 font-medium max-w-lg leading-relaxed">
              Your AI-driven dermatological health profile is summarized below. All diagnostics are end-to-end encrypted.
            </p>
          </div>

          <Link href="/patient/detection">
            <Button
              variant="primary"
              size="lg"
              className="group h-16 px-8 !rounded-2xl text-lg shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Initialize New Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Scans', value: stats.totalScans, color: 'primary', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
          { label: 'Consultations', value: stats.activeConsultations, color: 'secondary', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
          { label: 'Health Score', value: '94%', color: 'accent', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-[1.5rem] p-8 transition-all duration-300 hover:bg-foreground/[0.02] border border-foreground/5 group">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-foreground/30 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-heading font-extrabold text-foreground mt-1 tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Scans */}
        <section className="bg-surface-low/50 rounded-[2rem] p-10 border border-foreground/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
              Diagnostic Insights
            </h3>
            <Link
              href="/patient/history"
              className="text-xs font-bold text-primary hover:text-primary-high transition-colors uppercase tracking-[0.1em]"
            >
              Archive
            </Link>
          </div>

          <div className="space-y-6">
            {recentScans.map((scan: any) => (
              <div key={scan.id} className="flex items-center gap-5 p-5 glass-card rounded-2xl border border-foreground/5 hover:bg-foreground/[0.02] transition-all group">
                <div className="relative shrink-0">
                  <img
                    src={scan.imageUrl}
                    alt="Scan"
                    className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center ${(scan.confidence || scan.prediction?.confidence || 0) > 0.8 ? 'bg-primary' : 'bg-yellow-400'}`}>
                    <svg className="w-2.5 h-2.5 text-on-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate uppercase tracking-wide">
                    {scan.disease || scan.class || scan.prediction?.class || 'Diagnostic Run'}
                  </p>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase mt-1">
                    Analyzed on {new Date(scan.createdAt || scan.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-heading font-extrabold ${(scan.confidence || scan.prediction?.confidence || 0) > 0.8 ? 'text-primary' : 'text-yellow-400'}`}>
                    {((scan.confidence || scan.prediction?.confidence || 0) * 100).toFixed(0)}%
                  </p>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter">Confidence</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Consultations */}
        <section className="bg-surface-low/50 rounded-[2rem] p-10 border border-foreground/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-heading font-extrabold text-foreground tracking-tight">
              Clinical Correspondence
            </h3>
            <Link
              href="/patient/consultations"
              className="text-xs font-bold text-primary hover:text-primary-high transition-colors uppercase tracking-[0.1em]"
            >
              Directory
            </Link>
          </div>

          <div className="space-y-6">
            {recentConsultations.map((consultation: any) => (
              <div key={consultation.id} className="flex items-center gap-5 p-5 glass-card rounded-2xl border border-foreground/5 hover:bg-foreground/[0.02] transition-all group">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center border border-secondary/20 shrink-0">
                  <svg className="w-8 h-8 text-secondary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate uppercase tracking-wide">
                    Specialist Consultation
                  </p>
                  <p className="text-[10px] text-foreground/30 font-bold uppercase mt-1">
                    ID: #{consultation.id.substring(0, 8)} • {new Date(consultation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  consultation.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : consultation.status === 'accepted'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-foreground/5 text-foreground/40 border border-foreground/10'
                }`}>
                  {consultation.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
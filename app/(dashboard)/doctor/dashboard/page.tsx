'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';

export default function DoctorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await api.getDoctorDashboard();
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
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Command Center...</div>;
  }

  // Gracefully handle potential API shapes
  const pendingRequests = data?.pendingRequests || data?.pending_requests || [];
  const activeConsultations = data?.activeConsultations || data?.active_consultations || data?.todayAppointments || [];
  const completedConsultations = data?.completedConsultations || data?.completed_consultations || [];

  const stats = data?.stats || {
    pending: pendingRequests.length,
    active: activeConsultations.length,
    completed: completedConsultations.length || data?.totalPatients || 0
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Clinical <span className="text-primary truncate">Command</span>
          </h1>
          <p className="text-foreground/40 font-medium max-w-2xl leading-relaxed">
            Centralized intelligence hub for specialist triage, diagnostic review, and patient longitudinal tracking.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-surface-highest/50 p-2 rounded-2xl border border-foreground/5 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="pr-4">
            <p className="text-[8px] font-bold text-foreground/30 uppercase tracking-widest">Shift Status</p>
            <p className="text-xs font-bold text-foreground">Active • 08:32 Remaining</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: 'Pending Triage',
            value: stats.pending,
            accent: 'primary',
            icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
          },
          {
            label: 'Active Consults',
            value: stats.active,
            accent: 'secondary',
            icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
          },
          {
            label: 'Cases Resolved',
            value: stats.completed,
            accent: 'primary',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-[2rem] p-8 border border-foreground/5 shadow-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.accent}/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${stat.accent}/10 transition-all duration-700`} />
            <div className="relative space-y-6">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.accent}/10 flex items-center justify-center text-${stat.accent} border border-${stat.accent}/20`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </p>
                <p className="text-4xl font-heading font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sections removed (Triage Queue & Longitudinal Monitoring) as per request */}
    </div>
  );
}
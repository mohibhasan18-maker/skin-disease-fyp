'use client';

import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/Tabs';
import { ResultCard } from '@/components/ResultCard';
import { Button } from '@/components/Button';
import { api } from '@/lib/api-client';

export default function PatientHistory() {
  const [activeTab, setActiveTab] = useState('scans');
  const [scans, setScans] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'scans', label: 'Scan History' },
    { id: 'consultations', label: 'Consultations' },
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const [scansData, consultationsData] = await Promise.all([
          api.getPatientHistory(),
          api.getPatientConsultations(),
        ]);
        setScans(scansData.scans || scansData || []);
        setConsultations(consultationsData.consultations || consultationsData || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Archives...</div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
          Clinical <span className="text-primary truncate">Archives</span>
        </h1>
        <p className="text-foreground/40 font-medium max-w-2xl leading-relaxed">
          Comprehensive longitudinal record of dermatological scans and specialist consultations.
        </p>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-[2.5rem] p-8 border border-foreground/5 shadow-2xl">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab}>
          <div className="mt-10">
            {/* Scans Tab */}
            {activeTab === 'scans' && (
              <section aria-label="Scan history" className="space-y-6">
                {scans.length === 0 ? (
                  <div className="text-center py-20 bg-surface-highest/30 rounded-3xl border border-dashed border-foreground/10">
                    <p className="text-xl font-heading font-extrabold text-foreground/30 tracking-tight mb-6">
                      Zero diagnostic records found.
                    </p>
                    <Button variant="primary" className="!rounded-xl px-10">
                      Initiate First Scan
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {scans.map((scan) => (
                      <ResultCard
                        key={scan.id}
                        disease={scan.disease || scan.class || scan.prediction?.class || 'Unknown'}
                        confidence={scan.confidence || scan.prediction?.confidence || 0}
                        description={scan.notes || scan.recommendations || scan.prediction?.recommendations || ""}
                        date={new Date(scan.createdAt || scan.created_at || new Date())}
                        severity={
                          (scan.confidence || scan.prediction?.confidence || 0) > 0.7
                            ? 'high'
                            : (scan.confidence || scan.prediction?.confidence || 0) > 0.5
                            ? 'medium'
                            : 'low'
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Consultations Tab */}
            {activeTab === 'consultations' && (
              <section aria-label="Consultation history" className="space-y-6">
                {consultations.length === 0 ? (
                  <div className="text-center py-20 bg-surface-highest/30 rounded-3xl border border-dashed border-foreground/10">
                    <p className="text-xl font-heading font-extrabold text-foreground/30 tracking-tight mb-6">
                      No specialist dialogues recorded.
                    </p>
                    <Button variant="primary" className="!rounded-xl px-10">
                      Request Consultation
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {consultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="glass-card rounded-2xl p-6 border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                 <h3 className="text-lg font-heading font-extrabold text-foreground tracking-tight">
                                   Dr. Sarah Johnson
                                 </h3>
                                 <span
                                    className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                                      consultation.status === 'pending'
                                        ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                        : consultation.status === 'accepted'
                                        ? 'bg-primary/10 text-primary border-primary/20'
                                        : 'bg-secondary/10 text-secondary border-secondary/20'
                                    }`}
                                  >
                                    {consultation.status}
                                  </span>
                               </div>
                                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-1">
                                 {new Date(consultation.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                               </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                             <Button variant="outline" size="sm" className="!rounded-xl !h-10 !text-[10px] uppercase font-bold tracking-widest px-6">
                               Details
                             </Button>
                             {consultation.status === 'accepted' && (
                               <Button 
                                 variant="primary" 
                                 size="sm" 
                                 className="!rounded-xl !h-10 !text-[10px] uppercase font-bold tracking-widest px-6 shadow-lg shadow-primary/10"
                               >
                                 Message
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </Tabs>
      </div>

      {/* Analytics Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: 'Diagnostic Volume',
            value: scans.length,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            accent: 'primary'
          },
          {
            label: 'Active Consultations',
            value: consultations.length,
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            ),
            accent: 'secondary'
          },
          {
            label: 'Last Diagnostic Window',
            value: scans[0]?.createdAt ? new Date(scans[0].createdAt).toLocaleDateString() : 'None',
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            accent: 'primary'
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass-card rounded-[2rem] p-8 border border-foreground/5 shadow-xl relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.accent}/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${stat.accent}/10 transition-all duration-700`} />
            
            <div className="relative space-y-6">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.accent}/10 flex items-center justify-center text-${stat.accent} border border-${stat.accent}/20`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-heading font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

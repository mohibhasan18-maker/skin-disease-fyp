'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api-client';

export default function DoctorRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctorRequests();
      setRequests(data.requests || data || []);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateRequestStatus(id, status);
      await loadRequests();
    } catch (err) {
      console.error(`Failed to update status to ${status}`, err);
      alert('Failed to update status');
    }
  };

  const filteredRequests = requests.filter((c: any) => {
    const statusMatch = filterStatus === 'all' || c.status === filterStatus;
    const searchMatch = (c.patientName || c.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Triage Center...</div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
          Triage <span className="text-primary truncate">Center</span>
        </h1>
        <p className="text-foreground/40 font-medium max-w-2xl leading-relaxed">
          Manage incoming diagnostic consultations and prioritize critical medical cases.
        </p>
      </div>

      {/* Filters Section */}
      <section className="space-y-8">
        <div className="glass-card rounded-2xl p-2 border border-foreground/5 bg-foreground/5 shadow-xl">
           <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Filter by patient name or caseload ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!pl-16 !h-16 !bg-transparent !border-none !ring-0 !text-lg !font-medium"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mr-2">Status Workspace:</p>
          {(['all', 'pending', 'accepted', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                filterStatus === status
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'bg-surface-highest/50 text-foreground/40 border-foreground/5 hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </section>

      {/* Requests Grid */}
      <section aria-label="Consultation requests">
        {filteredRequests.length === 0 ? (
          <div className="glass-card rounded-[2rem] py-24 text-center border border-foreground/5">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" />
              </svg>
            </div>
            <p className="text-xl font-heading font-extrabold text-foreground/40 tracking-tight">
              Queue clear. No pending triage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredRequests.map((consultation) => (
              <div
                key={consultation.id}
                className="glass-card rounded-[2rem] p-8 border border-foreground/5 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all relative group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface-highest/50 border border-foreground/5 flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                        {consultation.patientName || consultation.patient_name || 'Patient'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${
                          consultation.status === 'pending' ? 'bg-yellow-500' : 'bg-primary'
                        }`} />
                        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
                          {consultation.status} Case
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">Received</p>
                    <p className="text-sm font-heading font-extrabold text-foreground mt-0.5">
                      {new Date(consultation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-highest/30 rounded-2xl p-6 border border-foreground/5 space-y-4 mb-8">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Diagnostic Intake reason</p>
                    <p className="text-sm font-medium text-foreground/60 leading-relaxed italic">
                      "{consultation.notes || 'Patient reporting acute localized erythema with pruritus in the epidermal region for 72 hours...'}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  {consultation.status === 'pending' && (
                    <>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => handleUpdateStatus(consultation.id, 'accepted')}
                        className="flex-1 !h-14 !rounded-2xl !text-[10px] uppercase font-bold tracking-widest bg-primary"
                      >
                        Accept Case
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleUpdateStatus(consultation.id, 'rejected')}
                        className="flex-1 !h-14 !rounded-2xl !text-[10px] uppercase font-bold tracking-widest"
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {consultation.status === 'accepted' && (
                    <div className="w-full flex items-center justify-center h-14 rounded-2xl border border-secondary/30 bg-secondary/5">
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Active Case • Consultation Documented</p>
                    </div>
                  )}
                  {consultation.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => alert('Show history details')}
                      className="w-full !h-14 !rounded-2xl !text-[10px] uppercase font-bold tracking-widest"
                    >
                      Archive Review
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

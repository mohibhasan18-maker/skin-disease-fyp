'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ChatBubble } from '@/components/ChatBubble';
import { api } from '@/lib/api-client';

// Mock messages for demo
const mockMessages = [
  {
    id: 1,
    sender: 'doctor' as const,
    message: 'Hello, I\'ve reviewed your scan results. The findings suggest a mild dermatitis.',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: 2,
    sender: 'user' as const,
    message: 'Thank you doctor. Is this serious? What should I do?',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: 3,
    sender: 'doctor' as const,
    message: 'It\'s a common condition. I recommend using the prescribed cream twice daily for two weeks.',
    timestamp: new Date(Date.now() - 30000),
  },
];

export default function DoctorConsultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getDoctorConsultations();
        const consList = data.consultations || data || [];
        setConsultations(consList);
        if (consList.length > 0) {
          setSelectedConsultation(consList[0].id);
        }
      } catch (err) {
        console.error('Failed to load consultations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeConsultation = consultations.find(
    (c: any) => c.id === selectedConsultation
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !activeConsultation) return;

    setIsSending(true);
    const userMessage = {
      id: messages.length + 1,
      sender: 'doctor' as const,
      message: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    
    try {
      await api.addConsultationNotes(activeConsultation.id, inputValue);
    } catch (err) {
      console.error('Failed to send notes:', err);
      alert('Failed to save notes');
    }

    setInputValue('');
    setIsSending(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Consultations...</div>;
  }

  return (
    <div className="h-[calc(100vh-14rem)] flex gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Consultations Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col glass-card rounded-[2rem] border border-foreground/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-foreground/5 bg-foreground/[0.02]">
          <h2 className="text-sm font-bold text-foreground/30 uppercase tracking-[0.2em]">Active Cases</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {consultations
            .filter((c: any) => c.status === 'accepted' || c.status === 'completed')
            .map((consultation: any) => (
              <button
                key={consultation.id}
                onClick={() => setSelectedConsultation(consultation.id)}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border group ${
                  selectedConsultation === consultation.id
                    ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/5'
                    : 'bg-transparent border-transparent hover:bg-foreground/[0.03] hover:border-foreground/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                    selectedConsultation === consultation.id
                      ? 'bg-primary/20 border-primary/30 text-primary'
                      : 'bg-surface-highest/50 border-foreground/5 text-foreground/20 group-hover:text-foreground/40'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className={`font-heading font-extrabold text-sm tracking-tight transition-colors ${
                      selectedConsultation === consultation.id ? 'text-foreground' : 'text-foreground/60'
                    }`}>
                      {consultation.patientName || consultation.patient_name || 'Patient'}
                    </p>
                    <p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest mt-0.5">
                      Last Activity • {new Date(consultation.createdAt || new Date()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
        </nav>
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card rounded-[2rem] border border-foreground/5 overflow-hidden shadow-2xl relative">
        {activeConsultation ? (
          <>
            {/* Chat Header */}
            <header className="p-6 border-b border-foreground/5 bg-foreground/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
                    {activeConsultation.patientName || activeConsultation.patient_name || 'Patient'}
                  </h1>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                      Live Consultation Session
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <Button variant="outline" size="sm" className="!rounded-xl !h-10 px-6 !text-[10px] uppercase font-bold tracking-widest">
                   Patient Profile
                 </Button>
                 <Button variant="outline" size="sm" className="!rounded-xl !h-10 px-6 !text-[10px] uppercase font-bold tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/5">
                   Close Case
                 </Button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-medical-glow bg-no-repeat bg-right-bottom bg-[length:400px_400px]">
              {messages.map((msg, idx) => (
                <ChatBubble
                  key={msg.id}
                  message={msg.message}
                  sender={msg.sender}
                  timestamp={msg.timestamp}
                  senderName={msg.sender === 'doctor' ? 'Clinical Specialist' : (activeConsultation.patientName || activeConsultation.patient_name || 'Patient')}
                />
              ))}
              {isSending && (
                <ChatBubble
                  message="..."
                  sender="doctor"
                  timestamp={new Date()}
                  senderName="Clinical Specialist"
                  isLoading
                />
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 bg-surface-highest/30 border-t border-foreground/5">
              <div className="glass-card flex items-center gap-4 p-2 pl-6 rounded-2xl border border-foreground/5 bg-foreground/5 focus-within:border-primary/30 transition-all shadow-inner">
                <input
                  type="text"
                  placeholder="Draft clinical instruction or clinical query..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isSending}
                  className="flex-1 bg-transparent border-none text-foreground text-sm font-medium placeholder:text-foreground/20 focus:ring-0 outline-none"
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isSending}
                  className="!h-12 !w-12 !p-0 !rounded-xl bg-primary shadow-lg shadow-primary/20 shrink-0"
                >
                  <svg className="w-5 h-5 rotate-45 -translate-y-0.5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-foreground/[0.03] border border-foreground/5 flex items-center justify-center text-foreground/10">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="max-w-xs space-y-2">
              <p className="text-xl font-heading font-extrabold text-foreground tracking-tight">Select a Caseload</p>
              <p className="text-sm font-medium text-foreground/30 leading-relaxed">Initialize a secure dialogue session by selecting a patient from the triaged caseload.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

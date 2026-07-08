'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { UserCard } from '@/components/UserCard';
import { Modal } from '@/components/Modal';
import { api } from '@/lib/api-client';

export default function PatientConsultations() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [docsData, consData] = await Promise.all([
          api.getDoctors(),
          api.getPatientConsultations()
        ]);
        // The API returns { doctors: [...] } based on standard REST design or simply an array [...]
        setDoctors(docsData.doctors || docsData || []);
        setConsultations(consData.consultations || consData || []);
      } catch (err) {
        console.error('Failed to load specialists:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchMatch = doctor.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const specialtyMatch =
      filterSpecialty === 'all' || doctor.specialty === filterSpecialty || doctor.specialization === filterSpecialty;
    return searchMatch && specialtyMatch;
  });

  const handleBooking = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setIsBookingOpen(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBooking = async () => {
    if (!selectedDoctor) return;
    setIsSubmitting(true);
    try {
      await api.requestConsultation({
        doctor_id: selectedDoctor,
        date: `${formData.date}T${formData.time}:00`,
        notes: formData.reason,
        scan_id: null // Passing null if no scan is associated here
      });
      setIsBookingOpen(false);
      setFormData({ date: '', time: '', reason: '' });
      // Reload consultations
      const consData = await api.getPatientConsultations();
      setConsultations(consData.consultations || consData || []);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSpecialties = () => {
    const specialties = new Set(doctors.map((d) => d.specialty || d.specialization).filter(Boolean));
    return Array.from(specialties);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Loading Specialists...</div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
          Specialist <span className="text-primary truncate">Directory</span>
        </h1>
        <p className="text-foreground/40 font-medium max-w-2xl leading-relaxed">
          Access our global network of board-certified dermatologists and clinical researchers for remote precision diagnostics.
        </p>
      </div>

      {/* Search and Filters */}
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
              placeholder="Search by specialist name, expertise, or clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!pl-16 !h-16 !bg-transparent !border-none !ring-0 !text-lg !font-medium"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mr-2">Filter by Expertise:</p>
          <button
            onClick={() => setFilterSpecialty('all')}
            className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
              filterSpecialty === 'all'
                ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-surface-highest/50 text-foreground/40 border-foreground/5 hover:border-primary/30 hover:text-foreground'
            }`}
          >
            All Specialties
          </button>
          {getSpecialties().map((specialty) => (
            <button
              key={specialty}
              onClick={() => setFilterSpecialty(specialty)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                filterSpecialty === specialty
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105'
                  : 'bg-surface-highest/50 text-foreground/40 border-foreground/5 hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </section>

      {/* Doctors Grid */}
      <section aria-label="Available doctors">
        {filteredDoctors.length === 0 ? (
          <div className="glass-card rounded-[2rem] py-24 text-center border border-foreground/5">
            <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl font-heading font-extrabold text-foreground/40 tracking-tight">
              No matching specialists found.
            </p>
            <p className="text-sm text-foreground/20 mt-2">Try adjusting your search or filtering by a different specialty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor: any) => {
              const hasActiveConsultation = consultations.some(
                (c: any) =>
                  (c.doctorId === doctor.id || c.doctor_id === doctor.id) && c.status === 'accepted'
              );

              return (
                <UserCard
                  key={doctor.id}
                  name={doctor.name}
                  role="doctor"
                  avatar={doctor.avatar}
                  specialty={doctor.specialty || doctor.specialization}
                  experience={doctor.experience || "10+ years"}
                  rating={doctor.rating || 4.5}
                  availability={doctor.availability?.[0] || doctor.availability || "Available Today"}
                  description={doctor.bio}
                  onAction={() => handleBooking(doctor.id)}
                  actionLabel="Intake Consultation"
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Diagnostic Intake Scheduling"
      >
        <div className="p-2 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="date"
              label="Intake Date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Input
              type="time"
              label="Intake Time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="reason" className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] ml-1">
              Case Narrative & Symptoms
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full px-5 py-4 bg-surface-highest/50 border border-foreground/5 rounded-2xl font-medium text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/30 transition-all resize-none shadow-inner"
              rows={5}
              placeholder="Describe clinical symptoms, duration, and patient history..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsBookingOpen(false)}
              className="flex-1 !h-14 !rounded-2xl uppercase tracking-[0.2em] text-[10px] font-bold"
            >
              Abort
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              isLoading={isSubmitting}
              onClick={handleSubmitBooking}
              className="flex-1 !h-14 !rounded-2xl uppercase tracking-[0.2em] text-[10px] font-bold shadow-xl shadow-primary/20 bg-primary"
            >
              Confirm Schedule
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

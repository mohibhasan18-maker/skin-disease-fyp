'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { api } from '@/lib/api-client';

// Mock doctor data
const mockDoctor = {
  id: 'doc-1',
  name: 'Dr. Sarah Johnson',
  specialization: 'Dermatologist',
  licenseNumber: 'DL-2024-001',
  experience: 12,
  rating: 4.8,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1',
  bio: 'Specialist in skin diseases with 12 years of clinical experience.',
  availability: {
    monday: '09:00 - 17:00',
    tuesday: '09:00 - 17:00',
    wednesday: '09:00 - 17:00',
    thursday: '09:00 - 17:00',
    friday: '09:00 - 17:00',
    saturday: 'Closed',
    sunday: 'Closed',
  },
  consultationFee: 500,
  totalPatients: 250,
  totalConsultations: 1024,
  responseTime: '< 1 hour',
};

export default function DoctorProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    bio: '',
    consultationFee: 0,
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.getMe();
        // Handle potential nested user object or direct response
        const profileData = response.user || response;
        setUser(profileData);
        setFormData({
          name: profileData.name || '',
          specialization: profileData.specialization || profileData.specialty || '',
          bio: profileData.bio || '',
          consultationFee: profileData.consultationFee || profileData.fee || 0,
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await api.updateProfile(formData);
      setIsEditing(false);
      // Refresh user data
      const profile = await api.getMe();
      setUser(profile);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Failed to save profile');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary animate-pulse">Synchronizing Profiles...</div>;
  }

  const profile = {
    ...mockDoctor,
    ...user,
    ...formData,
    // Explicitly override to ensure mock data doesn't leak for critical identity
    name: formData.name || user?.name || 'Practitioner',
    specialization: formData.specialization || user?.specialization || user?.specialty || 'Medical Specialist',
    licenseNumber: user?.licenseNumber || user?.license_number || 'Verification Pending',
    bio: formData.bio || user?.bio || 'Clinical profile details are being updated.',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 font-body pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            Professional <span className="text-primary truncate">Credence</span>
          </h1>
          <p className="text-foreground/40 font-medium max-w-2xl leading-relaxed">
            Configure your clinical identity and practitioners' operational parameters.
          </p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'primary'}
          onClick={() => setIsEditing(!isEditing)}
          className={`!rounded-2xl !h-14 px-8 !text-[10px] uppercase font-bold tracking-widest ${!isEditing ? 'bg-primary' : ''
            }`}
        >
          {isEditing ? 'Discard Changes' : 'Edit Practitioner Profile'}
        </Button>
      </div>

      {/* Profile Section */}
      <div className="glass-card rounded-[3rem] p-10 border border-foreground/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -mr-48 -mt-48" />

        <div className="relative flex flex-col md:flex-row gap-10 mb-12">
          {/* Avatar Container */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-[2.5rem] bg-surface-highest/50 border-2 border-foreground/5 p-1 overflow-hidden shadow-xl flex items-center justify-center">
              {profile.avatar && !profile.avatar.includes('dicebear') ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full rounded-[2.2rem] object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-[2.2rem] bg-primary/10 flex items-center justify-center text-primary text-3xl font-heading font-extrabold">
                  {profile.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-secondary border-4 border-surface flex items-center justify-center text-white shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-heading font-extrabold text-foreground tracking-tight">
                  {profile.name}
                </h2>
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-bold text-primary uppercase tracking-widest">
                  Verified Specialist
                </span>
              </div>
              <p className="text-lg text-foreground/40 font-medium">
                Senior {profile.specialization} • {profile.licenseNumber}
              </p>
            </div>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Clinical Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-heading font-extrabold text-foreground">⭐ {user?.rating || 'N/A'}</span>
                  <span className="text-xs font-bold text-foreground/30">({user?.total_consultations || 0} successful triage)</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em]">Patient Caseload</p>
                <p className="text-xl font-heading font-extrabold text-foreground">👥 {user?.total_patients || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Clinical Tenure', value: `${profile.experience || user?.experience || 0} Years`, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Total Volume', value: profile.totalConsultations || user?.total_consultations || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Avg Latency', value: profile.responseTime || user?.response_time || 'N/A', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { label: 'Consult Fee', value: `₹${profile.consultationFee || user?.fee || 0}`, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-[2rem] bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.04] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-surface-highest/50 border border-foreground/5 flex items-center justify-center text-foreground/20 mb-4 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-heading font-extrabold text-foreground tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Editable Fields */}
        <div className="space-y-8 pt-12 border-t border-foreground/5">
          <h3 className="text-sm font-bold text-foreground/30 uppercase tracking-[0.2em] mb-4">Identity Configuration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-4">Full Practitioner Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="!h-16 !rounded-[1.25rem] !bg-foreground/5 !border-none !px-6 !text-lg !font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-4">Clinical Specialization</label>
              <Input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={!isEditing}
                className="!h-16 !rounded-[1.25rem] !bg-foreground/5 !border-none !px-6 !text-lg !font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-4">Clinical Biography & Philosophy</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-6 py-5 rounded-[1.25rem] bg-foreground/5 border-none text-lg font-medium placeholder:text-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all min-h-[160px] ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
                }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest ml-4">Consultation Fee</label>
              <Input
                name="consultationFee"
                type="number"
                value={formData.consultationFee}
                onChange={handleChange}
                disabled={!isEditing}
                className="!h-16 !rounded-[1.25rem] !bg-foreground/5 !border-none !px-6 !text-lg !font-medium"
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-4 mt-12 pt-12 border-t border-foreground/5">
            <Button
              variant="primary"
              onClick={handleSave}
              className="flex-1 !h-16 !rounded-2xl !text-[10px] uppercase font-bold tracking-widest bg-primary"
            >
              Commit Changes to Registry
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 !h-16 !rounded-2xl !text-[10px] uppercase font-bold tracking-widest"
            >
              Discard
            </Button>
          </div>
        )}
      </div>

      {/* Availability Section */}
      <section className="glass-card rounded-[3rem] p-10 border border-foreground/5 shadow-2xl relative overflow-hidden">
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight mb-8 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-secondary rounded-full" />
          Shift Allocation & Availability
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(profile.availability || mockDoctor.availability).map(([day, hours]: [string, any]) => (
            <div
              key={day}
              className="p-6 rounded-[2rem] bg-foreground/[0.02] border border-foreground/5 flex flex-col gap-1 group hover:bg-foreground/[0.04] transition-all"
            >
              <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest capitalize">
                {day}
              </span>
              <span className={`text-lg font-heading font-extrabold tracking-tight ${hours === 'Closed' ? 'text-foreground/20' : 'text-foreground'
                }`}>
                {hours}
              </span>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-12 flex gap-4">
            <Button variant="primary" className="!rounded-2xl !h-14 px-8 !text-[10px] uppercase font-bold tracking-widest bg-secondary">
              Update Availability Matrix
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

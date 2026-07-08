// Core types for the healthcare platform

export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  medicalHistory?: string[];
  allergies?: string[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  experience: number; // years
  rating: number;
  availability: Availability[];
  bio?: string;
}

export interface Availability {
  day: string; // 'monday', 'tuesday', etc.
  startTime: string; // '09:00'
  endTime: string; // '17:00'
}

export interface PredictionResult {
  class: string;
  confidence: number;
  allScores: Record<string, number>;
}

export interface Scan {
  id: string;
  patientId: string;
  imageUrl: string;
  prediction: PredictionResult;
  createdAt: Date;
  notes?: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  scanId?: string;
  scheduledAt?: Date;
  createdAt: Date;
  notes?: string;
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  attachments?: string[]; // image URLs
}

export interface DoctorCard {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: number;
  avatar?: string;
  availability: string[]; // e.g., ['Mon 9-5', 'Wed 10-4']
  bio?: string;
}
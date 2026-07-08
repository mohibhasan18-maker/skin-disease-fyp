// Mock data for UI development

import { Patient, Doctor, Scan, Consultation, Message, DoctorCard } from './types';

export const mockPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Ali Raza',
    email: 'ali.raza@email.com',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop',
    createdAt: new Date('2024-01-15'),
    medicalHistory: ['Hypertension', 'Diabetes'],
    allergies: ['Penicillin'],
  },
  {
    id: 'p2',
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@email.com',
    role: 'patient',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop',
    createdAt: new Date('2024-02-20'),
    medicalHistory: ['Asthma'],
    allergies: ['Sulfa drugs'],
  },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Ayesha Khan',
    email: 'ayesha.khan@clinic.com',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1594824812377-08cd57479905?q=80&w=256&h=256&auto=format&fit=crop',
    createdAt: new Date('2023-06-01'),
    specialization: 'Dermatology',
    licenseNumber: 'MD123456',
    experience: 8,
    rating: 4.8,
    bio: 'Board-certified dermatologist with 8 years of experience in skin disease diagnosis and treatment.',
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'wednesday', startTime: '10:00', endTime: '16:00' },
      { day: 'friday', startTime: '09:00', endTime: '15:00' },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Bilal Tariq',
    email: 'bilal.tariq@clinic.com',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&auto=format&fit=crop',
    createdAt: new Date('2023-08-15'),
    specialization: 'Dermatology',
    licenseNumber: 'MD789012',
    experience: 12,
    rating: 4.9,
    bio: 'Specialist in skin cancer detection and cosmetic dermatology with over 12 years of practice.',
    availability: [
      { day: 'tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'saturday', startTime: '10:00', endTime: '14:00' },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Sana Malik',
    email: 'sana.malik@clinic.com',
    role: 'doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71cc197ec2?q=80&w=256&h=256&auto=format&fit=crop',
    createdAt: new Date('2023-11-01'),
    specialization: 'Pediatric Dermatology',
    licenseNumber: 'MD345678',
    experience: 6,
    rating: 4.7,
    bio: "Pediatric dermatologist focused on children's skin conditions and allergies.",
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '17:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'thursday', startTime: '10:00', endTime: '16:00' },
    ],
  },
];

export const mockScans: Scan[] = [
  {
    id: 's1',
    patientId: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1600627225432-82de96999068?q=80&w=1000&auto=format&fit=crop',
    prediction: {
      class: 'Melanoma',
      confidence: 0.87,
      allScores: {
        'Melanoma': 0.87,
        'Basal Cell Carcinoma': 0.08,
        'Squamous Cell Carcinoma': 0.03,
        'Benign Keratosis': 0.02,
      },
    },
    createdAt: new Date('2024-03-15T10:30:00'),
    notes: 'Suspicious mole on upper arm',
  },
  {
    id: 's2',
    patientId: 'p1',
    imageUrl: 'https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop',
    prediction: {
      class: 'Benign Keratosis',
      confidence: 0.92,
      allScores: {
        'Benign Keratosis': 0.92,
        'Melanoma': 0.05,
        'Basal Cell Carcinoma': 0.02,
        'Squamous Cell Carcinoma': 0.01,
      },
    },
    createdAt: new Date('2024-03-20T14:15:00'),
    notes: 'Routine check of facial lesion',
  },
];

export const mockConsultations: Array<Consultation & { patientName: string }> = [
  {
    id: 'c1',
    patientId: 'p1',
    doctorId: 'd1',
    patientName: 'Ali Raza',
    status: 'pending',
    scanId: 's1',
    createdAt: new Date('2024-03-15T11:00:00'),
    notes: 'Urgent consultation requested for suspicious mole',
  },
  {
    id: 'c2',
    patientId: 'p1',
    doctorId: 'd2',
    patientName: 'Ali Raza',
    status: 'accepted',
    scanId: 's2',
    scheduledAt: new Date('2024-03-25T10:00:00'),
    createdAt: new Date('2024-03-20T15:00:00'),
    notes: 'Follow-up consultation for benign keratosis',
  },
  {
    id: 'c3',
    patientId: 'p2',
    doctorId: 'd1',
    patientName: 'Fatima Ahmed',
    status: 'completed',
    scanId: 's2',
    scheduledAt: new Date('2024-03-10T14:00:00'),
    createdAt: new Date('2024-03-08T10:00:00'),
    notes: 'Initial skin check and assessment',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    consultationId: 'c2',
    senderId: 'p1',
    content: 'Hello Dr. Bilal, I have some questions about the results from my recent scan.',
    timestamp: new Date('2024-03-21T09:00:00'),
  },
  {
    id: 'm2',
    consultationId: 'c2',
    senderId: 'd2',
    content: 'Hi Ali, I\'d be happy to discuss your results. The scan shows a benign keratosis, which is common and usually harmless. Let\'s schedule a follow-up to examine it in person.',
    timestamp: new Date('2024-03-21T09:15:00'),
  },
];

export const mockDoctorCards: DoctorCard[] = mockDoctors.map(doctor => ({
  id: doctor.id,
  name: doctor.name,
  specialization: doctor.specialization,
  rating: doctor.rating,
  experience: doctor.experience,
  avatar: doctor.avatar,
  availability: doctor.availability.map(a =>
    `${a.day.charAt(0).toUpperCase() + a.day.slice(1)} ${a.startTime}-${a.endTime}`
  ),
  bio: doctor.bio,
}));
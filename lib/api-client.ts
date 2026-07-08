const DEFAULT_API_BASE_URL = 'http://localhost:8000/api';
type RequestPayload = Record<string, unknown>;

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, '');

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || 'An error occurred during the request.');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: RequestPayload) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  signup: (data: RequestPayload) => fetchWithAuth('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchWithAuth('/auth/me', { method: 'GET' }),
  
  // Users
  updateProfile: (data: RequestPayload) => fetchWithAuth('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),
  
  // Doctors
  getDoctors: () => fetchWithAuth('/doctors', { method: 'GET' }),

  // Patient Flows
  getPatientDashboard: () => fetchWithAuth('/patient/dashboard', { method: 'GET' }),
  analyzeSkinImage: (formData: FormData) => fetchWithAuth('/patient/detection/analyze', { method: 'POST', body: formData }),
  getPatientHistory: () => fetchWithAuth('/patient/detection/history', { method: 'GET' }),
  getPatientConsultations: () => fetchWithAuth('/patient/consultations', { method: 'GET' }),
  requestConsultation: (data: RequestPayload) => fetchWithAuth('/patient/consultations/request', { method: 'POST', body: JSON.stringify(data) }),

  // Doctor Flows
  getDoctorDashboard: () => fetchWithAuth('/doctor/dashboard', { method: 'GET' }),
  getDoctorRequests: () => fetchWithAuth('/doctor/requests', { method: 'GET' }),
  updateRequestStatus: (requestId: string, status: string) => fetchWithAuth(`/doctor/requests/${requestId}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' }),
  getDoctorConsultations: () => fetchWithAuth('/doctor/consultations', { method: 'GET' }),
  addConsultationNotes: (consultationId: string, notes: string) => fetchWithAuth(`/doctor/consultations/${consultationId}/notes`, { method: 'POST', body: JSON.stringify({ notes }) }),
};

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age?: number;
  gender: string;
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  condition: string;
  lastVisit: string;
  medicalHistory?: MedicalHistoryItem[];
  notes?: string;
  appointments?: Appointment[];
  healthMetrics?: HealthMetric[];
}

export interface MedicalHistoryItem {
  condition: string;
  date: string;
  notes: string;
}

export interface HealthMetric {
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  bloodOxygen: number;
  temperature: number;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  type: 'Check-up' | 'Follow-up' | 'Consultation' | 'Emergency' | 'Procedure';
  doctor: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  notes?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
} 

// Health Metrics Types
export interface HealthMetric {
  id: number;
  patientId: number;
  dateRecorded: string;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
  bloodOxygen: number;
  notes?: string;
}

// Appointment Types
export interface Appointment {
  id: number;
  patientId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Prescription Types
export interface Prescription {
  id: number;
  patientId: number;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  doctor: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Mock Health Metrics Data
export const mockHealthMetrics: HealthMetric[] = [
  {
    id: 1,
    patientId: 1,
    dateRecorded: "2025-04-22",
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    temperature: 36.6,
    bloodOxygen: 98,
    notes: "Regular checkup"
  },
  {
    id: 2,
    patientId: 1,
    dateRecorded: "2025-04-21",
    bloodPressure: { systolic: 118, diastolic: 79 },
    heartRate: 70,
    temperature: 36.5,
    bloodOxygen: 99,
    notes: "After exercise"
  },
  {
    id: 3,
    patientId: 1,
    dateRecorded: "2025-04-20",
    bloodPressure: { systolic: 122, diastolic: 82 },
    heartRate: 75,
    temperature: 36.7,
    bloodOxygen: 97,
    notes: "Morning reading"
  }
];

// Mock Appointments Data
export const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    doctorName: "Dr. Sarah Smith",
    specialty: "Cardiology",
    date: "2025-04-25",
    time: "10:00 AM",
    status: "scheduled",
    notes: "Regular heart checkup"
  },
  {
    id: 2,
    patientId: 1,
    doctorName: "Dr. James Wilson",
    specialty: "General Medicine",
    date: "2025-05-02",
    time: "2:30 PM",
    status: "scheduled",
    notes: "Annual physical examination"
  },
  {
    id: 3,
    patientId: 1,
    doctorName: "Dr. Emily Brown",
    specialty: "Endocrinology",
    date: "2025-04-15",
    time: "11:15 AM",
    status: "completed",
    notes: "Diabetes monitoring"
  }
];

// Mock Prescriptions Data
export const mockPrescriptions: Prescription[] = [
  {
    id: 1,
    patientId: 1,
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2025-04-01",
    endDate: "2025-07-01",
    doctor: "Dr. Sarah Smith",
    notes: "Take in the morning",
    status: "active"
  },
  {
    id: 2,
    patientId: 1,
    medication: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2025-04-01",
    endDate: "2025-10-01",
    doctor: "Dr. Emily Brown",
    notes: "Take with meals",
    status: "active"
  },
  {
    id: 3,
    patientId: 1,
    medication: "Aspirin",
    dosage: "81mg",
    frequency: "Once daily",
    startDate: "2025-04-01",
    endDate: "2025-07-01",
    doctor: "Dr. James Wilson",
    notes: "Take with food",
    status: "active"
  },
  {
    id: 4,
    patientId: 1,
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: "2025-03-15",
    endDate: "2025-03-22",
    doctor: "Dr. James Wilson",
    notes: "Course completed",
    status: "completed"
  }
];

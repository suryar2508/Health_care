export interface HealthMetric {
  id: string;
  timestamp: string;
  heartRate: number;
  bloodOxygen: number;
  temperature: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  notes?: string;
}

export interface MedicalHistory {
  id: string;
  condition: string;
  diagnosis: string;
  diagnosisDate: string;
  treatment: string;
  medications: string[];
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface PatientNote {
  id: string;
  timestamp: string;
  category: 'general' | 'symptoms' | 'medication' | 'follow-up' | 'lab-results';
  content: string;
  author: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  phoneNumber: string;
  address: string;
  condition: string;
  lastVisit: string;
  medicalHistory: MedicalHistory[];
  notes: PatientNote[];
  healthMetrics: HealthMetric[];
  allergies: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    expiryDate: string;
  };
}

// Sample data for testing
export const samplePatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    dateOfBirth: "1980-05-15",
    gender: "male",
    bloodGroup: "O+",
    phoneNumber: "+1-555-0123",
    address: "123 Main St, City, State",
    condition: "Hypertension",
    lastVisit: "2024-03-15",
    medicalHistory: [
      {
        id: "MH001",
        condition: "Hypertension",
        diagnosis: "Essential Hypertension",
        diagnosisDate: "2020-01-10",
        treatment: "Lifestyle modification and medication",
        medications: ["Lisinopril 10mg", "Amlodipine 5mg"],
        status: "chronic",
        notes: "Regular blood pressure monitoring required"
      },
      {
        id: "MH002",
        condition: "Type 2 Diabetes",
        diagnosis: "T2DM",
        diagnosisDate: "2021-03-20",
        treatment: "Oral medication and diet control",
        medications: ["Metformin 500mg"],
        status: "chronic",
        notes: "HbA1c monitoring every 3 months"
      }
    ],
    notes: [
      {
        id: "N001",
        timestamp: "2024-03-15T10:30:00",
        category: "follow-up",
        content: "Patient reported improved blood pressure readings. Continue current medication.",
        author: "Dr. Sarah Johnson"
      },
      {
        id: "N002",
        timestamp: "2024-03-15T10:35:00",
        category: "lab-results",
        content: "HbA1c: 6.8% - Improved from last reading",
        author: "Dr. Sarah Johnson"
      }
    ],
    healthMetrics: [
      {
        id: "HM001",
        timestamp: "2024-03-15T10:00:00",
        heartRate: 72,
        bloodOxygen: 98,
        temperature: 36.8,
        bloodPressure: {
          systolic: 128,
          diastolic: 82
        },
        notes: "Within normal range"
      },
      {
        id: "HM002",
        timestamp: "2024-03-14T10:00:00",
        heartRate: 75,
        bloodOxygen: 97,
        temperature: 36.6,
        bloodPressure: {
          systolic: 132,
          diastolic: 85
        }
      }
    ],
    allergies: ["Penicillin", "Shellfish"],
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2020-01-15"
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2021-03-25"
      }
    ],
    insurance: {
      provider: "Blue Cross",
      policyNumber: "BC123456789",
      groupNumber: "GROUP001",
      expiryDate: "2024-12-31"
    }
  },
  {
    id: "P002",
    name: "Emma Wilson",
    dateOfBirth: "1992-08-22",
    gender: "female",
    bloodGroup: "A-",
    phoneNumber: "+1-555-0124",
    address: "456 Oak Ave, City, State",
    condition: "Asthma",
    lastVisit: "2024-03-14",
    medicalHistory: [
      {
        id: "MH003",
        condition: "Asthma",
        diagnosis: "Mild Persistent Asthma",
        diagnosisDate: "2018-06-15",
        treatment: "Inhaled corticosteroids and rescue inhaler",
        medications: ["Fluticasone 250mcg", "Albuterol"],
        status: "chronic",
        notes: "Trigger: Exercise and cold weather"
      }
    ],
    notes: [
      {
        id: "N003",
        timestamp: "2024-03-14T14:20:00",
        category: "symptoms",
        content: "Patient reported increased use of rescue inhaler during exercise",
        author: "Dr. Michael Brown"
      }
    ],
    healthMetrics: [
      {
        id: "HM003",
        timestamp: "2024-03-14T14:00:00",
        heartRate: 68,
        bloodOxygen: 96,
        temperature: 36.7,
        bloodPressure: {
          systolic: 118,
          diastolic: 75
        }
      }
    ],
    allergies: ["Dust mites", "Pollen"],
    medications: [
      {
        name: "Fluticasone",
        dosage: "250mcg",
        frequency: "Twice daily",
        startDate: "2018-06-20"
      },
      {
        name: "Albuterol",
        dosage: "90mcg",
        frequency: "As needed",
        startDate: "2018-06-20"
      }
    ],
    insurance: {
      provider: "Aetna",
      policyNumber: "AE987654321",
      groupNumber: "GROUP002",
      expiryDate: "2024-12-31"
    }
  }
];

// Function to generate additional sample patients
export function generateSamplePatients(count: number): Patient[] {
  const patients: Patient[] = [];
  const conditions = ["Hypertension", "Diabetes", "Asthma", "Arthritis", "Heart Disease"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const medications = ["Metformin", "Lisinopril", "Atorvastatin", "Aspirin", "Metoprolol"];
  
  for (let i = 3; i <= count; i++) {
    const patientId = `P${i.toString().padStart(3, '0')}`;
    const randomDate = new Date(1960 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28));
    
    patients.push({
      id: patientId,
      name: `Patient ${i}`,
      dateOfBirth: randomDate.toISOString().split('T')[0],
      gender: Math.random() > 0.5 ? "male" : "female",
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      phoneNumber: `+1-555-${(1000 + i).toString().padStart(4, '0')}`,
      address: `${100 + i} Sample St, City, State`,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      medicalHistory: [],
      notes: [],
      healthMetrics: [],
      allergies: [],
      medications: [{
        name: medications[Math.floor(Math.random() * medications.length)],
        dosage: "10mg",
        frequency: "Once daily",
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }],
      insurance: {
        provider: "Insurance Co",
        policyNumber: `POL${i.toString().padStart(6, '0')}`,
        groupNumber: "GROUP001",
        expiryDate: "2024-12-31"
      }
    });
  }
  
  return [...samplePatients, ...patients];
} 
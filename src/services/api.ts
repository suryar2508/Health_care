import axios from 'axios';
import { PrescriptionData } from '@/types/prescription';

// API configuration
const API_BASE_URL = 'http://localhost:3000/api';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
const endpoints = {
  patients: '/patients',
  doctors: '/doctors',
  appointments: '/appointments',
  prescriptions: '/prescriptions',
  medicalRecords: '/medical-records',
  billing: '/billing',
  auth: '/auth'
};

// Mock data for development
const mockUsers = {
  'admin@smartvital.com': {
    email: 'admin@smartvital.com',
    password: 'admin123',
    name: 'Admin User',
    userType: 'admin'
  },
  'doctor@smartvital.com': {
    email: 'doctor@smartvital.com',
    password: 'doctor123',
    name: 'Dr. John Smith',
    userType: 'doctor'
  },
  'patient@smartvital.com': {
    email: 'patient@smartvital.com',
    password: 'patient123',
    name: 'Jane Doe',
    userType: 'patient'
  },
  'pharmacist@smartvital.com': {
    email: 'pharmacist@smartvital.com',
    password: 'pharma123',
    name: 'Sarah Johnson',
    userType: 'pharmacist'
  }
};

// Mock doctors data with authentication
const mockDoctors = [
  {
    id: 'D001',
    name: 'Dr. John Smith',
    email: 'john.smith@smartvital.com',
    password: 'doctor123', // In real app, this would be hashed
    phone: '+1 234-567-8901',
    specialization: 'Cardiology',
    experience: 10,
    qualification: 'MD, Cardiology',
    status: 'active',
    department: 'Cardiology',
    schedule: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM'
    },
    patients: 150,
    appointments: 25,
    role: 'doctor'
  },
  {
    id: 'D002',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@smartvital.com',
    password: 'doctor123', // In real app, this would be hashed
    phone: '+1 234-567-8902',
    specialization: 'Pediatrics',
    experience: 8,
    qualification: 'MD, Pediatrics',
    status: 'active',
    department: 'Pediatrics',
    schedule: {
      monday: '10:00 AM - 6:00 PM',
      tuesday: '10:00 AM - 6:00 PM',
      wednesday: '10:00 AM - 6:00 PM',
      thursday: '10:00 AM - 6:00 PM',
      friday: '10:00 AM - 6:00 PM'
    },
    patients: 120,
    appointments: 20,
    role: 'doctor'
  }
];

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  insuranceInfo?: string;
  medicalHistory?: string;
  assignedDoctor?: string;
  status: 'active' | 'inactive';
  loginCredentials?: {
    username: string;
    password: string;
  };
  vitalSigns?: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    lastUpdated: string;
  };
  healthConditions?: {
    condition: string;
    diagnosisDate: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'resolved' | 'chronic';
    notes?: string;
  }[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
  }[];
  allergies?: {
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
  }[];
  vaccinations?: {
    name: string;
    date: string;
    administeredBy: string;
    nextDueDate?: string;
  }[];
  labResults?: {
    testName: string;
    date: string;
    result: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  chronicConditions?: {
    diabetes?: {
      type: 'Type 1' | 'Type 2' | 'Gestational';
      diagnosisDate: string;
      lastA1C: number;
      lastUpdated: string;
    };
    hypertension?: {
      diagnosisDate: string;
      lastReading: {
        systolic: number;
        diastolic: number;
        date: string;
      };
    };
    asthma?: {
      severity: 'mild' | 'moderate' | 'severe';
      lastAttack: string;
      triggers: string[];
    };
    heartDisease?: {
      type: string;
      diagnosisDate: string;
      lastEKG: string;
      medications: string[];
    };
  };
  lifestyleFactors?: {
    smoking: {
      status: 'never' | 'former' | 'current';
      packYears?: number;
      quitDate?: string;
    };
    alcohol: {
      status: 'never' | 'occasional' | 'regular';
      unitsPerWeek?: number;
    };
    exercise: {
      frequency: 'never' | 'occasional' | 'regular';
      type?: string[];
      duration?: number;
    };
    diet: {
      type: 'omnivore' | 'vegetarian' | 'vegan' | 'other';
      restrictions?: string[];
    };
  };
  familyHistory?: {
    conditions: {
      condition: string;
      relation: string;
      ageOfOnset?: number;
    }[];
  };
  lastCheckup?: {
    date: string;
    doctor: string;
    notes: string;
    nextAppointment?: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    coverageType: string;
    effectiveDate: string;
    expiryDate: string;
    copay: {
      primary: number;
      specialist: number;
      emergency: number;
    };
    deductible: {
      individual: number;
      family: number;
    };
    outOfPocketMax: {
      individual: number;
      family: number;
    };
  };
  billingHistory?: {
    date: string;
    amount: number;
    status: string;
    description: string;
  }[];
  appointmentHistory?: {
    date: string;
    doctor: string;
    type: string;
    notes: string;
  }[];
  documents?: {
    type: string;
    name: string;
    date: string;
    url: string;
  }[];
  notes?: {
    date: string;
    author: string;
    content: string;
  }[];
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  }[];
  preferredPharmacy?: {
    name: string;
    address: string;
    phone: string;
  };
  preferredHospital?: {
    name: string;
    address: string;
    phone: string;
  };
  languagePreference?: string;
  communicationPreference?: string;
  privacySettings?: {
    shareWithFamily: boolean;
    shareWithDoctors: boolean;
    shareWithInsurance: boolean;
  };
  lastUpdated: string;
}

// Mock prescription data for ML training simulation
const mockPrescriptions: PrescriptionData[] = [
  {
    id: '1',
    imageUrl: '/prescriptions/prescription1.jpg',
    uploadDate: new Date().toISOString(),
    status: 'analyzed',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        price: 25.99,
        category: 'Antihypertensive',
        manufacturer: 'AstraZeneca',
        expiryDate: '2024-12-31'
      }
    ],
    doctorName: 'Dr. Sarah Johnson',
    prescriptionDate: '2024-01-15',
    analysis: {
      totalCost: 25.99,
      insuranceCoverage: 20.79,
      patientShare: 5.20,
      notes: ['Medication is covered by insurance'],
      warnings: ['Take with food to avoid stomach upset'],
      interactions: ['Avoid potassium supplements'],
      results: [
        {
          status: 'success',
          message: 'Prescription analyzed successfully',
          details: [
            {
              type: 'medication',
              severity: 'low',
              description: 'Standard dosage for hypertension'
            }
          ]
        }
      ]
    },
    bill: {
      billNumber: 'BILL-001',
      generatedDate: '2024-01-15',
      dueDate: '2024-02-15',
      status: 'pending',
      items: [
        {
          medication: 'Lisinopril',
          quantity: 30,
          unitPrice: 25.99,
          total: 25.99
        }
      ],
      subtotal: 25.99,
      tax: 2.60,
      discount: 0,
      total: 28.59
    }
  },
  {
    id: '2',
    imageUrl: '/prescriptions/prescription2.jpg',
    uploadDate: new Date().toISOString(),
    status: 'analyzed',
    medications: [
      {
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '60 days',
        quantity: 120,
        price: 15.99,
        category: 'Antidiabetic',
        manufacturer: 'Merck',
        expiryDate: '2024-12-31'
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '30 days',
        quantity: 30,
        price: 35.99,
        category: 'Statin',
        manufacturer: 'Pfizer',
        expiryDate: '2024-12-31'
      }
    ],
    doctorName: 'Dr. Michael Chen',
    prescriptionDate: '2024-01-10',
    analysis: {
      totalCost: 51.98,
      insuranceCoverage: 41.58,
      patientShare: 10.40,
      notes: ['Both medications are covered by insurance'],
      warnings: ['Take Metformin with meals', 'Avoid grapefruit with Atorvastatin'],
      interactions: ['Monitor blood sugar levels regularly'],
      results: [
        {
          status: 'success',
          message: 'Prescription analyzed successfully',
          details: [
            {
              type: 'medication',
              severity: 'low',
              description: 'Standard combination for diabetes and cholesterol'
            }
          ]
        }
      ]
    },
    bill: {
      billNumber: 'BILL-002',
      generatedDate: '2024-01-10',
      dueDate: '2024-02-10',
      status: 'pending',
      items: [
        {
          medication: 'Metformin',
          quantity: 120,
          unitPrice: 15.99,
          total: 15.99
        },
        {
          medication: 'Atorvastatin',
          quantity: 30,
          unitPrice: 35.99,
          total: 35.99
        }
      ],
      subtotal: 51.98,
      tax: 5.20,
      discount: 0,
      total: 57.18
    }
  },
  // Add more mock prescriptions with different scenarios...
  {
    id: '3',
    imageUrl: '/prescriptions/prescription3.jpg',
    uploadDate: new Date().toISOString(),
    status: 'analyzed',
    medications: [
      {
        name: 'Albuterol',
        dosage: '90mcg',
        frequency: 'As needed',
        duration: '30 days',
        quantity: 1,
        price: 45.99,
        category: 'Bronchodilator',
        manufacturer: 'GSK',
        expiryDate: '2024-12-31'
      }
    ],
    doctorName: 'Dr. Emily Wilson',
    prescriptionDate: '2024-01-05',
    analysis: {
      totalCost: 45.99,
      insuranceCoverage: 36.79,
      patientShare: 9.20,
      notes: ['Rescue inhaler for asthma'],
      warnings: ['Use only as needed for shortness of breath'],
      interactions: ['May interact with beta-blockers'],
      results: [
        {
          status: 'success',
          message: 'Prescription analyzed successfully',
          details: [
            {
              type: 'medication',
              severity: 'medium',
              description: 'Emergency medication - ensure proper usage instructions'
            }
          ]
        }
      ]
    },
    bill: {
      billNumber: 'BILL-003',
      generatedDate: '2024-01-05',
      dueDate: '2024-02-05',
      status: 'pending',
      items: [
        {
          medication: 'Albuterol',
          quantity: 1,
          unitPrice: 45.99,
          total: 45.99
        }
      ],
      subtotal: 45.99,
      tax: 4.60,
      discount: 0,
      total: 50.59
    }
  }
];

interface AIAnalysisRequest {
  patientId: string;
  message: string;
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>;
}

interface AIAnalysisResponse {
  analysis: string;
  recommendations: string[];
  warnings: string[];
  costAnalysis: {
    currentCost: number;
    potentialSavings: number;
    alternatives: Array<{
      name: string;
      cost: number;
      effectiveness: 'high' | 'medium' | 'low';
    }>;
  };
}

interface MedicationReminder {
  medication: string;
  time: string;
  frequency: string;
  duration: string;
  patientId: string;
  status: 'active' | 'completed' | 'cancelled';
}

// API service class
class ApiService {
  private static instance: ApiService;
  private token: string | null = null;
  private isBackendAvailable: boolean = false;
  private mockPatients: Patient[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8900',
      age: 35,
      gender: 'Male',
      bloodGroup: 'A+',
      address: '123 Main St, City, State',
      emergencyContact: '+1 987-654-3210',
      insuranceInfo: 'Health Insurance Co. #12345',
      medicalHistory: 'Hypertension',
      assignedDoctor: 'Dr. Smith',
      status: 'active',
      loginCredentials: {
        username: 'john.doe',
        password: 'Patient@123'
      },
      vitalSigns: {
        heartRate: 75,
        bloodPressure: {
          systolic: 120,
          diastolic: 80
        },
        temperature: 37.0,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        lastUpdated: new Date().toISOString()
      },
      chronicConditions: {
        hypertension: {
          diagnosisDate: '2020-01-15',
          lastReading: {
            systolic: 120,
            diastolic: 80,
            date: new Date().toISOString()
          }
        }
      },
      healthConditions: [
        {
          condition: 'Hypertension',
          diagnosisDate: '2020-01-15',
          severity: 'mild',
          status: 'active',
          notes: 'Well controlled with medication'
        }
      ],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: '2020-01-15',
          prescribedBy: 'Dr. Smith'
        }
      ],
      allergies: [
        {
          allergen: 'Penicillin',
          reaction: 'Rash',
          severity: 'moderate'
        }
      ],
      vaccinations: [
        {
          name: 'COVID-19',
          date: '2021-03-15',
          administeredBy: 'Dr. Smith',
          nextDueDate: '2022-03-15'
        }
      ],
      labResults: [
        {
          testName: 'Complete Blood Count',
          date: '2023-01-15',
          result: 'Normal',
          referenceRange: 'Within normal limits',
          status: 'normal'
        }
      ],
      lifestyleFactors: {
        smoking: {
          status: 'never'
        },
        alcohol: {
          status: 'occasional',
          unitsPerWeek: 2
        },
        exercise: {
          frequency: 'regular',
          type: ['Walking', 'Swimming'],
          duration: 30
        },
        diet: {
          type: 'omnivore',
          restrictions: ['Low sodium']
        }
      },
      familyHistory: {
        conditions: [
          {
            condition: 'Heart Disease',
            relation: 'Father',
            ageOfOnset: 55
          }
        ]
      },
      lastCheckup: {
        date: '2023-12-01',
        doctor: 'Dr. Smith',
        notes: 'Regular checkup, all vitals normal',
        nextAppointment: '2024-06-01'
      },
      insuranceDetails: {
        provider: 'Health Insurance Co.',
        policyNumber: '12345',
        groupNumber: '67890',
        coverageType: 'PPO',
        effectiveDate: '2023-01-01',
        expiryDate: '2023-12-31',
        copay: {
          primary: 20,
          specialist: 40,
          emergency: 100
        },
        deductible: {
          individual: 1000,
          family: 2000
        },
        outOfPocketMax: {
          individual: 5000,
          family: 10000
        }
      },
      billingHistory: [
        {
          date: '2023-12-01',
          amount: 150,
          status: 'paid',
          description: 'Regular checkup'
        }
      ],
      appointmentHistory: [
        {
          date: '2023-12-01',
          doctor: 'Dr. Smith',
          type: 'Regular checkup',
          notes: 'All vitals normal'
        }
      ],
      documents: [
        {
          type: 'Medical Records',
          name: 'Complete Medical History',
          date: '2023-12-01',
          url: '/documents/medical-history.pdf'
        }
      ],
      notes: [
        {
          date: '2023-12-01',
          author: 'Dr. Smith',
          content: 'Patient is doing well, continue current medication'
        }
      ],
      emergencyContacts: [
        {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 987-654-3210',
          address: '123 Main St, City, State'
        }
      ],
      preferredPharmacy: {
        name: 'CVS Pharmacy',
        address: '456 Pharmacy St, City, State',
        phone: '+1 234-567-8901'
      },
      preferredHospital: {
        name: 'City General Hospital',
        address: '789 Hospital Ave, City, State',
        phone: '+1 234-567-8902'
      },
      languagePreference: 'English',
      communicationPreference: 'Email',
      privacySettings: {
        shareWithFamily: true,
        shareWithDoctors: true,
        shareWithInsurance: true
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 234-567-8901',
      age: 28,
      gender: 'Female',
      bloodGroup: 'O+',
      address: '456 Oak Ave, City, State',
      emergencyContact: '+1 987-654-3211',
      insuranceInfo: 'Medical Insurance Co. #67890',
      medicalHistory: 'Asthma',
      assignedDoctor: 'Dr. Wilson',
      status: 'active',
      loginCredentials: {
        username: 'sarah.j',
        password: 'Patient@123'
      },
      vitalSigns: {
        heartRate: 72,
        bloodPressure: {
          systolic: 118,
          diastolic: 75
        },
        temperature: 36.8,
        respiratoryRate: 14,
        oxygenSaturation: 97,
        lastUpdated: new Date().toISOString()
      },
      chronicConditions: {
        asthma: {
          severity: 'mild',
          lastAttack: '2023-11-15',
          triggers: ['Pollen', 'Dust']
        }
      },
      healthConditions: [
        {
          condition: 'Asthma',
          diagnosisDate: '2018-05-20',
          severity: 'mild',
          status: 'active',
          notes: 'Well controlled with inhaler'
        }
      ],
      medications: [
        {
          name: 'Albuterol',
          dosage: '90mcg',
          frequency: 'As needed',
          startDate: '2018-05-20',
          prescribedBy: 'Dr. Wilson'
        }
      ],
      allergies: [
        {
          allergen: 'Pollen',
          reaction: 'Asthma attack',
          severity: 'moderate'
        }
      ],
      vaccinations: [
        {
          name: 'Influenza',
          date: '2023-10-01',
          administeredBy: 'Dr. Wilson',
          nextDueDate: '2024-10-01'
        }
      ],
      labResults: [
        {
          testName: 'Pulmonary Function Test',
          date: '2023-11-15',
          result: 'Normal',
          referenceRange: 'Within normal limits',
          status: 'normal'
        }
      ],
      lifestyleFactors: {
        smoking: {
          status: 'never'
        },
        alcohol: {
          status: 'occasional',
          unitsPerWeek: 1
        },
        exercise: {
          frequency: 'regular',
          type: ['Yoga', 'Swimming'],
          duration: 45
        },
        diet: {
          type: 'vegetarian',
          restrictions: ['No nuts']
        }
      },
      familyHistory: {
        conditions: [
          {
            condition: 'Asthma',
            relation: 'Mother',
            ageOfOnset: 30
          }
        ]
      },
      lastCheckup: {
        date: '2023-11-15',
        doctor: 'Dr. Wilson',
        notes: 'Asthma well controlled',
        nextAppointment: '2024-05-15'
      },
      insuranceDetails: {
        provider: 'Medical Insurance Co.',
        policyNumber: '67890',
        groupNumber: '12345',
        coverageType: 'HMO',
        effectiveDate: '2023-01-01',
        expiryDate: '2023-12-31',
        copay: {
          primary: 15,
          specialist: 30,
          emergency: 75
        },
        deductible: {
          individual: 800,
          family: 1600
        },
        outOfPocketMax: {
          individual: 4000,
          family: 8000
        }
      },
      billingHistory: [
        {
          date: '2023-11-15',
          amount: 120,
          status: 'paid',
          description: 'Regular checkup'
        }
      ],
      appointmentHistory: [
        {
          date: '2023-11-15',
          doctor: 'Dr. Wilson',
          type: 'Regular checkup',
          notes: 'Asthma well controlled'
        }
      ],
      documents: [
        {
          type: 'Medical Records',
          name: 'Asthma Management Plan',
          date: '2023-11-15',
          url: '/documents/asthma-plan.pdf'
        }
      ],
      notes: [
        {
          date: '2023-11-15',
          author: 'Dr. Wilson',
          content: 'Continue current asthma management plan'
        }
      ],
      emergencyContacts: [
        {
          name: 'Michael Johnson',
          relationship: 'Spouse',
          phone: '+1 987-654-3211',
          address: '456 Oak Ave, City, State'
        }
      ],
      preferredPharmacy: {
        name: 'Walgreens',
        address: '789 Pharmacy St, City, State',
        phone: '+1 234-567-8902'
      },
      preferredHospital: {
        name: 'City Medical Center',
        address: '123 Hospital Ave, City, State',
        phone: '+1 234-567-8903'
      },
      languagePreference: 'English',
      communicationPreference: 'Text',
      privacySettings: {
        shareWithFamily: true,
        shareWithDoctors: true,
        shareWithInsurance: true
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 234-567-8902',
      age: 45,
      gender: 'Male',
      bloodGroup: 'B+',
      address: '789 Pine Rd, City, State',
      emergencyContact: '+1 987-654-3212',
      insuranceInfo: 'Life Insurance Co. #13579',
      medicalHistory: 'Type 2 Diabetes',
      assignedDoctor: 'Dr. Davis',
      status: 'active',
      loginCredentials: {
        username: 'michael.b',
        password: 'Patient@123'
      },
      vitalSigns: {
        heartRate: 78,
        bloodPressure: {
          systolic: 125,
          diastolic: 82
        },
        temperature: 37.1,
        respiratoryRate: 15,
        oxygenSaturation: 98,
        lastUpdated: new Date().toISOString()
      },
      chronicConditions: {
        diabetes: {
          type: 'Type 2',
          diagnosisDate: '2019-03-10',
          lastA1C: 6.5,
          lastUpdated: new Date().toISOString()
        }
      },
      healthConditions: [
        {
          condition: 'Type 2 Diabetes',
          diagnosisDate: '2019-03-10',
          severity: 'moderate',
          status: 'active',
          notes: 'Well controlled with diet and medication'
        }
      ],
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: '2019-03-10',
          prescribedBy: 'Dr. Davis'
        }
      ],
      allergies: [
        {
          allergen: 'Shellfish',
          reaction: 'Hives',
          severity: 'mild'
        }
      ],
      vaccinations: [
        {
          name: 'COVID-19',
          date: '2021-04-15',
          administeredBy: 'Dr. Davis',
          nextDueDate: '2022-04-15'
        }
      ],
      labResults: [
        {
          testName: 'Hemoglobin A1C',
          date: '2023-12-01',
          result: '6.5%',
          referenceRange: '4.0-5.6%',
          status: 'abnormal'
        }
      ],
      lifestyleFactors: {
        smoking: {
          status: 'former',
          quitDate: '2018-01-01'
        },
        alcohol: {
          status: 'occasional',
          unitsPerWeek: 3
        },
        exercise: {
          frequency: 'regular',
          type: ['Walking', 'Cycling'],
          duration: 40
        },
        diet: {
          type: 'omnivore',
          restrictions: ['Low carb', 'No shellfish']
        }
      },
      familyHistory: {
        conditions: [
          {
            condition: 'Diabetes',
            relation: 'Father',
            ageOfOnset: 50
          }
        ]
      },
      lastCheckup: {
        date: '2023-12-01',
        doctor: 'Dr. Davis',
        notes: 'Diabetes well controlled',
        nextAppointment: '2024-06-01'
      },
      insuranceDetails: {
        provider: 'Life Insurance Co.',
        policyNumber: '13579',
        groupNumber: '24680',
        coverageType: 'PPO',
        effectiveDate: '2023-01-01',
        expiryDate: '2023-12-31',
        copay: {
          primary: 25,
          specialist: 50,
          emergency: 150
        },
        deductible: {
          individual: 1500,
          family: 3000
        },
        outOfPocketMax: {
          individual: 6000,
          family: 12000
        }
      },
      billingHistory: [
        {
          date: '2023-12-01',
          amount: 180,
          status: 'paid',
          description: 'Regular checkup'
        }
      ],
      appointmentHistory: [
        {
          date: '2023-12-01',
          doctor: 'Dr. Davis',
          type: 'Regular checkup',
          notes: 'Diabetes well controlled'
        }
      ],
      documents: [
        {
          type: 'Medical Records',
          name: 'Diabetes Management Plan',
          date: '2023-12-01',
          url: '/documents/diabetes-plan.pdf'
        }
      ],
      notes: [
        {
          date: '2023-12-01',
          author: 'Dr. Davis',
          content: 'Continue current diabetes management plan'
        }
      ],
      emergencyContacts: [
        {
          name: 'Lisa Brown',
          relationship: 'Spouse',
          phone: '+1 987-654-3212',
          address: '789 Pine Rd, City, State'
        }
      ],
      preferredPharmacy: {
        name: 'Rite Aid',
        address: '321 Pharmacy St, City, State',
        phone: '+1 234-567-8903'
      },
      preferredHospital: {
        name: 'City Memorial Hospital',
        address: '456 Hospital Ave, City, State',
        phone: '+1 234-567-8904'
      },
      languagePreference: 'English',
      communicationPreference: 'Phone',
      privacySettings: {
        shareWithFamily: true,
        shareWithDoctors: true,
        shareWithInsurance: true
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.wilson@example.com',
      phone: '+1 234-567-8903',
      age: 32,
      gender: 'Female',
      bloodGroup: 'AB+',
      address: '321 Elm St, City, State',
      emergencyContact: '+1 987-654-3213',
      insuranceInfo: 'Family Insurance Co. #24680',
      medicalHistory: 'None',
      assignedDoctor: 'Dr. Davis',
      status: 'active',
      loginCredentials: {
        username: 'emily.w',
        password: 'Patient@123'
      },
      vitalSigns: {
        heartRate: 68,
        bloodPressure: {
          systolic: 115,
          diastolic: 75
        },
        temperature: 36.9,
        respiratoryRate: 14,
        oxygenSaturation: 99,
        lastUpdated: new Date().toISOString()
      },
      chronicConditions: {},
      healthConditions: [],
      medications: [],
      allergies: [],
      vaccinations: [
        {
          name: 'COVID-19',
          date: '2021-05-01',
          administeredBy: 'Dr. Davis',
          nextDueDate: '2022-05-01'
        }
      ],
      labResults: [
        {
          testName: 'Complete Blood Count',
          date: '2023-11-15',
          result: 'Normal',
          referenceRange: 'Within normal limits',
          status: 'normal'
        }
      ],
      lifestyleFactors: {
        smoking: {
          status: 'never'
        },
        alcohol: {
          status: 'occasional',
          unitsPerWeek: 2
        },
        exercise: {
          frequency: 'regular',
          type: ['Running', 'Yoga'],
          duration: 60
        },
        diet: {
          type: 'vegetarian',
          restrictions: []
        }
      },
      familyHistory: {
        conditions: []
      },
      lastCheckup: {
        date: '2023-11-15',
        doctor: 'Dr. Davis',
        notes: 'All vitals normal',
        nextAppointment: '2024-05-15'
      },
      insuranceDetails: {
        provider: 'Family Insurance Co.',
        policyNumber: '24680',
        groupNumber: '13579',
        coverageType: 'HMO',
        effectiveDate: '2023-01-01',
        expiryDate: '2023-12-31',
        copay: {
          primary: 15,
          specialist: 30,
          emergency: 75
        },
        deductible: {
          individual: 800,
          family: 1600
        },
        outOfPocketMax: {
          individual: 4000,
          family: 8000
        }
      },
      billingHistory: [
        {
          date: '2023-11-15',
          amount: 100,
          status: 'paid',
          description: 'Regular checkup'
        }
      ],
      appointmentHistory: [
        {
          date: '2023-11-15',
          doctor: 'Dr. Davis',
          type: 'Regular checkup',
          notes: 'All vitals normal'
        }
      ],
      documents: [
        {
          type: 'Medical Records',
          name: 'Complete Medical History',
          date: '2023-11-15',
          url: '/documents/medical-history.pdf'
        }
      ],
      notes: [
        {
          date: '2023-11-15',
          author: 'Dr. Davis',
          content: 'Patient is healthy, continue current lifestyle'
        }
      ],
      emergencyContacts: [
        {
          name: 'James Wilson',
          relationship: 'Spouse',
          phone: '+1 987-654-3213',
          address: '321 Elm St, City, State'
        }
      ],
      preferredPharmacy: {
        name: 'CVS Pharmacy',
        address: '654 Pharmacy St, City, State',
        phone: '+1 234-567-8904'
      },
      preferredHospital: {
        name: 'City General Hospital',
        address: '789 Hospital Ave, City, State',
        phone: '+1 234-567-8905'
      },
      languagePreference: 'English',
      communicationPreference: 'Email',
      privacySettings: {
        shareWithFamily: true,
        shareWithDoctors: true,
        shareWithInsurance: true
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '+1 234-567-8904',
      age: 50,
      gender: 'Male',
      bloodGroup: 'A-',
      address: '654 Maple Dr, City, State',
      emergencyContact: '+1 987-654-3214',
      insuranceInfo: 'Senior Insurance Co. #35791',
      medicalHistory: 'Heart Disease',
      assignedDoctor: 'Dr. Miller',
      status: 'active',
      loginCredentials: {
        username: 'david.l',
        password: 'Patient@123'
      },
      vitalSigns: {
        heartRate: 72,
        bloodPressure: {
          systolic: 130,
          diastolic: 85
        },
        temperature: 37.0,
        respiratoryRate: 15,
        oxygenSaturation: 97,
        lastUpdated: new Date().toISOString()
      },
      chronicConditions: {
        heartDisease: {
          type: 'Coronary Artery Disease',
          diagnosisDate: '2020-06-15',
          lastEKG: '2023-12-01',
          medications: ['Aspirin', 'Atorvastatin']
        }
      },
      healthConditions: [
        {
          condition: 'Coronary Artery Disease',
          diagnosisDate: '2020-06-15',
          severity: 'moderate',
          status: 'active',
          notes: 'Stable with medication'
        }
      ],
      medications: [
        {
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          startDate: '2020-06-15',
          prescribedBy: 'Dr. Miller'
        },
        {
          name: 'Atorvastatin',
          dosage: '40mg',
          frequency: 'Once daily',
          startDate: '2020-06-15',
          prescribedBy: 'Dr. Miller'
        }
      ],
      allergies: [
        {
          allergen: 'Penicillin',
          reaction: 'Rash',
          severity: 'mild'
        }
      ],
      vaccinations: [
        {
          name: 'COVID-19',
          date: '2021-03-01',
          administeredBy: 'Dr. Miller',
          nextDueDate: '2022-03-01'
        }
      ],
      labResults: [
        {
          testName: 'Lipid Panel',
          date: '2023-12-01',
          result: 'Normal',
          referenceRange: 'Within normal limits',
          status: 'normal'
        }
      ],
      lifestyleFactors: {
        smoking: {
          status: 'former',
          quitDate: '2019-01-01'
        },
        alcohol: {
          status: 'occasional',
          unitsPerWeek: 2
        },
        exercise: {
          frequency: 'regular',
          type: ['Walking', 'Swimming'],
          duration: 30
        },
        diet: {
          type: 'omnivore',
          restrictions: ['Low fat', 'Low sodium']
        }
      },
      familyHistory: {
        conditions: [
          {
            condition: 'Heart Disease',
            relation: 'Father',
            ageOfOnset: 55
          }
        ]
      },
      lastCheckup: {
        date: '2023-12-01',
        doctor: 'Dr. Miller',
        notes: 'Heart condition stable',
        nextAppointment: '2024-06-01'
      },
      insuranceDetails: {
        provider: 'Senior Insurance Co.',
        policyNumber: '35791',
        groupNumber: '24680',
        coverageType: 'PPO',
        effectiveDate: '2023-01-01',
        expiryDate: '2023-12-31',
        copay: {
          primary: 20,
          specialist: 40,
          emergency: 100
        },
        deductible: {
          individual: 1000,
          family: 2000
        },
        outOfPocketMax: {
          individual: 5000,
          family: 10000
        }
      },
      billingHistory: [
        {
          date: '2023-12-01',
          amount: 200,
          status: 'paid',
          description: 'Regular checkup'
        }
      ],
      appointmentHistory: [
        {
          date: '2023-12-01',
          doctor: 'Dr. Miller',
          type: 'Regular checkup',
          notes: 'Heart condition stable'
        }
      ],
      documents: [
        {
          type: 'Medical Records',
          name: 'Heart Disease Management Plan',
          date: '2023-12-01',
          url: '/documents/heart-plan.pdf'
        }
      ],
      notes: [
        {
          date: '2023-12-01',
          author: 'Dr. Miller',
          content: 'Continue current heart disease management plan'
        }
      ],
      emergencyContacts: [
        {
          name: 'Mary Lee',
          relationship: 'Spouse',
          phone: '+1 987-654-3214',
          address: '654 Maple Dr, City, State'
        }
      ],
      preferredPharmacy: {
        name: 'Walgreens',
        address: '987 Pharmacy St, City, State',
        phone: '+1 234-567-8905'
      },
      preferredHospital: {
        name: 'City Medical Center',
        address: '123 Hospital Ave, City, State',
        phone: '+1 234-567-8906'
      },
      languagePreference: 'English',
      communicationPreference: 'Phone',
      privacySettings: {
        shareWithFamily: true,
        shareWithDoctors: true,
        shareWithInsurance: true
      },
      lastUpdated: new Date().toISOString()
    }
  ];

  private constructor() {
    // Initialize axios instance
    api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Check if backend is available
    this.checkBackendAvailability();
  }

  private async checkBackendAvailability() {
    try {
      await api.get('/health');
      this.isBackendAvailable = true;
      console.log('Backend is available');
    } catch (error) {
      this.isBackendAvailable = false;
      console.log('Backend is not available, using mock data');
    }
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication methods
  async login(email: string, password: string) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(endpoints.auth + '/login', { email, password });
        this.token = response.data.token;
        return response.data;
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    } else {
      // Use mock data in development
      const user = mockUsers[email];
      if (user && user.password === password) {
        const mockToken = 'mock-token-' + Math.random();
        this.token = mockToken;
        return {
          token: mockToken,
          user: {
            email: user.email,
            name: user.name,
            userType: user.userType
          }
        };
      }
      throw new Error('Invalid credentials');
    }
  }

  async logout() {
    if (this.isBackendAvailable) {
      try {
        await api.post(endpoints.auth + '/logout');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    // Clear token in both cases
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Doctor methods
  async getDoctors() {
    if (this.isBackendAvailable) {
      const response = await api.get(endpoints.doctors);
      return response.data;
    } else {
      return { data: mockDoctors };
    }
  }

  async getDoctorById(id: string) {
    if (this.isBackendAvailable) {
      const response = await api.get(`${endpoints.doctors}/${id}`);
      return response.data;
    } else {
      const doctor = mockDoctors.find(d => d.id === id);
      if (!doctor) throw new Error('Doctor not found');
      return { data: doctor };
    }
  }

  async createDoctor(doctorData: any) {
    if (this.isBackendAvailable) {
      const response = await api.post(endpoints.doctors, doctorData);
      return response.data;
    } else {
      const newDoctor = {
        id: 'D' + (mockDoctors.length + 1).toString().padStart(3, '0'),
        ...doctorData,
        status: doctorData.status || 'active',
        patients: 0,
        appointments: 0,
        role: 'doctor',
        schedule: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM'
        }
      };
      mockDoctors.push(newDoctor);
      return { data: newDoctor };
    }
  }

  async updateDoctor(id: string, doctorData: any) {
    if (this.isBackendAvailable) {
      const response = await api.put(`${endpoints.doctors}/${id}`, doctorData);
      return response.data;
    } else {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDoctors[index] = { ...mockDoctors[index], ...doctorData };
        return { data: mockDoctors[index] };
      }
      throw new Error('Doctor not found');
    }
  }

  async deleteDoctor(id: string) {
    if (this.isBackendAvailable) {
      await api.delete(`${endpoints.doctors}/${id}`);
    } else {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDoctors.splice(index, 1);
      } else {
        throw new Error('Doctor not found');
      }
    }
  }

  async updateDoctorStatus(id: string, status: 'active' | 'inactive') {
    if (this.isBackendAvailable) {
      const response = await api.patch(`${endpoints.doctors}/${id}/status`, { status });
      return response.data;
    } else {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDoctors[index].status = status;
        return { data: mockDoctors[index] };
      }
      throw new Error('Doctor not found');
    }
  }

  async getDoctorSchedule(id: string) {
    if (this.isBackendAvailable) {
      const response = await api.get(`${endpoints.doctors}/${id}/schedule`);
      return response.data;
    } else {
      const doctor = mockDoctors.find(d => d.id === id);
      if (!doctor) throw new Error('Doctor not found');
      return { data: doctor.schedule };
    }
  }

  async updateDoctorSchedule(id: string, schedule: any) {
    if (this.isBackendAvailable) {
      const response = await api.put(`${endpoints.doctors}/${id}/schedule`, schedule);
      return response.data;
    } else {
      const index = mockDoctors.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDoctors[index].schedule = schedule;
        return { data: mockDoctors[index] };
      }
      throw new Error('Doctor not found');
    }
  }

  // Patient methods
  async getPatients(): Promise<{ data: Patient[] }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.get(endpoints.patients);
        return response.data;
      } else {
        // Return mock data
        return { data: this.mockPatients };
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  async createPatient(patientData: Omit<Patient, 'id'>): Promise<{ data: Patient }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.post(endpoints.patients, patientData);
        return response.data;
      } else {
        // For mock data, add the new patient
        const newPatient = {
          id: Math.random().toString(36).substr(2, 9),
          ...patientData,
          lastUpdated: new Date().toISOString()
        };
        this.mockPatients.push(newPatient);
        return { data: newPatient };
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<{ data: Patient }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.put(`${endpoints.patients}/${id}`, patientData);
        return response.data;
      } else {
        // For mock data, update the patient
        const index = this.mockPatients.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockPatients[index] = {
            ...this.mockPatients[index],
            ...patientData,
            lastUpdated: new Date().toISOString()
          };
          return { data: this.mockPatients[index] };
        }
        throw new Error('Patient not found');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  async deletePatient(id: string): Promise<void> {
    try {
      if (this.isBackendAvailable) {
        await api.delete(`${endpoints.patients}/${id}`);
      } else {
        // For mock data, remove the patient
        this.mockPatients = this.mockPatients.filter(p => p.id !== id);
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  async importPatients(patients: Omit<Patient, 'id'>[]): Promise<{ data: Patient[] }> {
    try {
      if (this.isBackendAvailable) {
        // First, check if patients already exist
        const existingPatients = await this.getPatients();
        const existingEmails = new Set(existingPatients.data.map(p => p.email));

        // Filter out patients that already exist
        const newPatients = patients.filter(p => !existingEmails.has(p.email));

        if (newPatients.length === 0) {
          throw new Error('All patients already exist in the database');
        }

        // Import only new patients
        const response = await api.post(`${endpoints.patients}/import`, { 
          patients: newPatients,
          updateExisting: false // Don't update existing patients
        });
        return response.data;
      }
      // Return mock response if backend is not available
      return {
        data: patients.map(patient => ({
          id: Math.random().toString(36).substr(2, 9),
          ...patient
        }))
      };
    } catch (error) {
      console.error('Error importing patients:', error);
      throw error;
    }
  }

  async updatePatientsFromExcel(patients: Omit<Patient, 'id'>[]): Promise<{ data: Patient[] }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.post(`${endpoints.patients}/import`, { 
          patients,
          updateExisting: true // Update existing patients
        });
        return response.data;
      }
      // Return mock response if backend is not available
      return {
        data: patients.map(patient => ({
          id: Math.random().toString(36).substr(2, 9),
          ...patient
        }))
      };
    } catch (error) {
      console.error('Error updating patients:', error);
      throw error;
    }
  }

  async deletePatientsByEmails(emails: string[]): Promise<void> {
    try {
      if (this.isBackendAvailable) {
        await api.post(`${endpoints.patients}/delete-by-emails`, { emails });
      }
      // No need to return anything for mock data
    } catch (error) {
      console.error('Error deleting patients by emails:', error);
      throw error;
    }
  }

  async getPatientByEmail(email: string): Promise<{ data: Patient | null }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.get(`${endpoints.patients}/by-email/${email}`);
        return response.data;
      }
      // Return mock response if backend is not available
      return { data: null };
    } catch (error) {
      console.error('Error getting patient by email:', error);
      throw error;
    }
  }

  async updatePatientByEmail(email: string, patientData: Partial<Patient>): Promise<{ data: Patient }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.put(`${endpoints.patients}/by-email/${email}`, patientData);
        return response.data;
      }
      // Return mock response if backend is not available
      return {
        data: {
          id: Math.random().toString(36).substr(2, 9),
          ...patientData
        } as Patient
      };
    } catch (error) {
      console.error('Error updating patient by email:', error);
      throw error;
    }
  }

  async deletePatientByEmail(email: string): Promise<void> {
    try {
      if (this.isBackendAvailable) {
        await api.delete(`${endpoints.patients}/by-email/${email}`);
      }
      // No need to return anything for mock data
    } catch (error) {
      console.error('Error deleting patient by email:', error);
      throw error;
    }
  }

  async exportPatients(): Promise<{ data: Patient[] }> {
    try {
      if (this.isBackendAvailable) {
        const response = await api.get(`${endpoints.patients}/export`);
        return response.data;
      }
      // Return mock data if backend is not available
      return {
        data: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 234-567-8900',
            age: 35,
            gender: 'Male',
            bloodGroup: 'A+',
            address: '123 Main St, City, State',
            emergencyContact: '+1 987-654-3210',
            insuranceInfo: 'Health Insurance Co. #12345',
            medicalHistory: 'Hypertension',
            assignedDoctor: 'Dr. Smith',
            status: 'active',
            loginCredentials: {
              username: 'john.doe',
              password: 'Patient@123'
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error exporting patients:', error);
      throw error;
    }
  }

  // Appointment methods
  async getAppointments() {
    return api.get(endpoints.appointments);
  }

  async createAppointment(appointmentData: any) {
    return api.post(endpoints.appointments, appointmentData);
  }

  async updateAppointmentStatus(id: string, status: string) {
    return api.patch(`${endpoints.appointments}/${id}/status`, { status });
  }

  // Prescription methods
  async getPrescriptions() {
    return api.get(endpoints.prescriptions);
  }

  async createPrescription(prescriptionData: any) {
    return api.post(endpoints.prescriptions, prescriptionData);
  }

  async refillPrescription(id: string) {
    return api.post(`${endpoints.prescriptions}/${id}/refill`);
  }

  // Medical Records methods
  async getMedicalRecords(patientId: string) {
    return api.get(`${endpoints.medicalRecords}/${patientId}`);
  }

  async addMedicalRecord(recordData: any) {
    return api.post(endpoints.medicalRecords, recordData);
  }

  // Billing methods
  async getBillingRecords(patientId: string) {
    return api.get(`${endpoints.billing}/${patientId}`);
  }

  async createBillingRecord(billingData: any) {
    return api.post(endpoints.billing, billingData);
  }

  async updatePaymentStatus(id: string, status: string) {
    return api.patch(`${endpoints.billing}/${id}/payment-status`, { status });
  }

  // Doctor authentication
  async doctorLogin(email: string, password: string) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(endpoints.auth + '/doctor/login', { email, password });
        this.token = response.data.token;
        return response.data;
      } catch (error) {
        throw new Error('Invalid credentials');
      }
    } else {
      // Use mock data in development
      const doctor = mockDoctors.find(d => d.email === email);
      if (doctor && doctor.password === password) {
        const mockToken = 'mock-token-' + Math.random();
        this.token = mockToken;
        return {
          token: mockToken,
          user: {
            id: doctor.id,
            email: doctor.email,
            name: doctor.name,
            role: 'doctor'
          }
        };
      }
      throw new Error('Invalid credentials');
    }
  }

  // Get doctor profile
  async getDoctorProfile() {
    if (this.isBackendAvailable) {
      const response = await api.get(endpoints.doctors + '/profile');
      return response.data;
    } else {
      // In mock mode, return the first doctor's data
      return { data: mockDoctors[0] };
    }
  }

  async deleteAllPatients(): Promise<void> {
    try {
      if (this.isBackendAvailable) {
        await api.delete(`${endpoints.patients}/all`);
      } else {
        // For mock data, clear the patients array
        this.mockPatients = [];
      }
    } catch (error) {
      console.error('Error deleting all patients:', error);
      throw error;
    }
  }

  // Prescription endpoints
  async getAllPrescriptions(patientId: string): Promise<PrescriptionData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPrescriptions;
  }

  async createPrescription(prescription: PrescriptionData): Promise<PrescriptionData> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    mockPrescriptions.unshift(prescription);
    return prescription;
  }

  async deletePrescription(prescriptionId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPrescriptions.findIndex(p => p.id === prescriptionId);
    if (index !== -1) {
      mockPrescriptions.splice(index, 1);
    }
  }

  async getPrescriptionImages(patientId: string): Promise<Blob> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return new Blob(['mock image data'], { type: 'image/jpeg' });
  }

  async analyzePrescriptionWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(`${API_BASE_URL}/api/ai/analyze`, request);
        return response.data;
      } catch (error) {
        console.error('Error analyzing prescription with AI:', error);
        throw error;
      }
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        analysis: "Based on your prescription history, I've analyzed your medications and found some important insights. Your current medication regimen is generally well-balanced, but there are a few considerations to keep in mind.",
        recommendations: [
          "Consider taking Lisinopril in the morning to better control blood pressure",
          "Monitor for any signs of dizziness when starting new medications",
          "Keep track of any side effects and report them to your doctor"
        ],
        warnings: [
          "Avoid grapefruit juice while taking Atorvastatin",
          "Be cautious with over-the-counter pain medications"
        ],
        costAnalysis: {
          currentCost: 125.99,
          potentialSavings: 45.50,
          alternatives: [
            {
              name: "Generic Lisinopril",
              cost: 15.99,
              effectiveness: "high"
            },
            {
              name: "Alternative Statin",
              cost: 25.99,
              effectiveness: "medium"
            }
          ]
        }
      };
    }
  }

  async analyzePrescriptionWithOCR(formData: FormData) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(`${API_BASE_URL}/api/prescriptions/ocr`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error analyzing prescription with OCR:', error);
        throw error;
      }
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        data: {
          doctorName: 'Dr. Sarah Johnson',
          prescriptionDate: new Date().toISOString(),
          medications: [
            {
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              duration: '30 days',
              quantity: 30,
              time: '09:00'
            },
            {
              name: 'Atorvastatin',
              dosage: '20mg',
              frequency: 'Once daily',
              duration: '30 days',
              quantity: 30,
              time: '20:00'
            }
          ],
          analysis: {
            totalCost: 51.98,
            insuranceCoverage: 41.58,
            patientShare: 10.40,
            notes: ['Both medications are covered by insurance'],
            warnings: ['Take Atorvastatin at bedtime'],
            interactions: ['Monitor blood pressure regularly']
          }
        }
      };
    }
  }

  async setupMedicationReminders(patientId: string, reminders: MedicationReminder[]) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(`${API_BASE_URL}/api/reminders`, {
          patientId,
          reminders
        });
        return response.data;
      } catch (error) {
        console.error('Error setting up medication reminders:', error);
        throw error;
      }
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        message: 'Reminders set up successfully',
        reminders: reminders.map(reminder => ({
          ...reminder,
          id: Math.random().toString(36).substr(2, 9)
        }))
      };
    }
  }

  async getMedicationReminders(patientId: string) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.get(`${API_BASE_URL}/api/reminders/${patientId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching medication reminders:', error);
        throw error;
      }
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        reminders: [
          {
            id: '1',
            medication: 'Lisinopril',
            time: '09:00',
            frequency: 'Once daily',
            duration: '30 days',
            patientId,
            status: 'active'
          },
          {
            id: '2',
            medication: 'Atorvastatin',
            time: '20:00',
            frequency: 'Once daily',
            duration: '30 days',
            patientId,
            status: 'active'
          }
        ]
      };
    }
  }

  async updateReminderStatus(reminderId: string, status: 'active' | 'completed' | 'cancelled') {
    if (this.isBackendAvailable) {
      try {
        const response = await api.patch(`${API_BASE_URL}/api/reminders/${reminderId}`, { status });
        return response.data;
      } catch (error) {
        console.error('Error updating reminder status:', error);
        throw error;
      }
    } else {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: 'Reminder status updated successfully'
      };
    }
  }

  async getVitalSigns() {
    if (this.isBackendAvailable) {
      try {
        const response = await api.get(`${API_BASE_URL}/vital-signs`);
        return response.data;
      } catch (error) {
        console.error('Error fetching vital signs:', error);
        throw error;
      }
    } else {
      // Mock data for development
      return {
        bloodPressure: [
          { date: '2024-01-01', systolic: 120, diastolic: 80 },
          { date: '2024-01-02', systolic: 118, diastolic: 78 }
        ],
        heartRate: [
          { date: '2024-01-01', rate: 72 },
          { date: '2024-01-02', rate: 75 }
        ],
        temperature: [
          { date: '2024-01-01', temp: 36.8 },
          { date: '2024-01-02', temp: 36.9 }
        ],
        weight: [
          { date: '2024-01-01', weight: 70 },
          { date: '2024-01-02', weight: 70.2 }
        ]
      };
    }
  }

  async addVitalSigns(data: any) {
    if (this.isBackendAvailable) {
      try {
        const response = await api.post(`${API_BASE_URL}/vital-signs`, data);
        return response.data;
      } catch (error) {
        console.error('Error adding vital signs:', error);
        throw error;
      }
    } else {
      // Mock success response for development
      return { message: 'Vital signs added successfully' };
    }
  }

  // Doctor Dashboard API functions
  async getDoctorAppointments() {
    try {
      const response = await api.get('/api/appointments/doctor', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  }

  async getDoctorStats() {
    try {
      const response = await api.get('/api/doctors/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor stats:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(id: string, status: string) {
    try {
      const response = await api.patch(
        `/api/appointments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  }

  async createAppointment(appointmentData: {
    doctorId: string;
    date: string;
    time: string;
    type: 'checkup' | 'consultation' | 'follow-up' | 'emergency';
    notes?: string;
  }) {
    try {
      const response = await api.post('/api/appointments', appointmentData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }
}

// Export the singleton instance
export default ApiService.getInstance(); 
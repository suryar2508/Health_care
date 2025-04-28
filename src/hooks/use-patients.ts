import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Patient, Appointment } from '@/types/patient';

export const usePatients = () => {
  const { toast } = useToast();
  const [patientsList, setPatientsList] = useState<Patient[]>([
    {
      id: 'P001',
      name: 'John Smith',
      dateOfBirth: '1980-05-15',
      age: 43,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '+1 (555) 123-4567',
      address: '123 Main St, Anytown, USA',
      condition: 'Stable',
      lastVisit: '2023-10-15',
      medicalHistory: [
        {
          condition: 'Hypertension',
          date: '2022-03-10',
          notes: 'Diagnosed with mild hypertension. Prescribed medication.'
        },
        {
          condition: 'Appendectomy',
          date: '2015-08-22',
          notes: 'Surgical removal of appendix. Recovery was uneventful.'
        }
      ],
      notes: 'Patient has a family history of heart disease. Regular check-ups recommended.',
      appointments: [
        {
          id: 'A001',
          date: '2023-12-20',
          time: '09:00',
          type: 'Check-up',
          doctor: 'Dr. Johnson',
          status: 'Scheduled',
          notes: 'Annual physical examination',
          followUpRequired: true,
          followUpDate: '2024-03-20'
        },
        {
          id: 'A002',
          date: '2023-10-15',
          time: '10:30',
          type: 'Follow-up',
          doctor: 'Dr. Johnson',
          status: 'Completed',
          notes: 'Blood pressure stable. Continue current medication.'
        }
      ],
      healthMetrics: [
        {
          date: '2023-12-01',
          bloodPressure: { systolic: 128, diastolic: 82 },
          heartRate: 72,
          bloodOxygen: 98,
          temperature: 36.8
        },
        {
          date: '2023-11-15',
          bloodPressure: { systolic: 132, diastolic: 85 },
          heartRate: 75,
          bloodOxygen: 97,
          temperature: 36.7
        }
      ]
    },
    {
      id: 'P002',
      name: 'Emily Johnson',
      dateOfBirth: '1992-11-30',
      age: 31,
      gender: 'Female',
      bloodGroup: 'A-',
      phoneNumber: '+1 (555) 234-5678',
      address: '456 Oak Ave, Somewhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-02',
      medicalHistory: [
        {
          condition: 'Asthma',
          date: '2010-05-18',
          notes: 'Diagnosed with mild asthma. Inhaler prescribed.'
        }
      ],
      notes: 'Allergic to penicillin. Prefers morning appointments.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P003',
      name: 'Michael Brown',
      dateOfBirth: '1975-03-22',
      age: 48,
      gender: 'Male',
      bloodGroup: 'B+',
      phoneNumber: '+1 (555) 345-6789',
      address: '789 Pine Rd, Nowhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-05',
      medicalHistory: [
        {
          condition: 'Diabetes Type 2',
          date: '2018-09-14',
          notes: 'Diagnosed with Type 2 diabetes. Started on metformin.'
        },
        {
          condition: 'Heart Attack',
          date: '2021-04-30',
          notes: 'Mild heart attack. Stent procedure performed.'
        }
      ],
      notes: 'Requires frequent monitoring of blood sugar levels. Family history of heart disease.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P004',
      name: 'Sarah Williams',
      dateOfBirth: '1988-07-12',
      age: 35,
      gender: 'Female',
      bloodGroup: 'AB+',
      phoneNumber: '+1 (555) 456-7890',
      address: '101 Elm St, Everywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-28',
      medicalHistory: [
        {
          condition: 'Migraine',
          date: '2015-02-20',
          notes: 'Chronic migraines. Prescribed preventive medication.'
        }
      ],
      notes: 'Experiences migraines during stressful periods. Recommended stress management techniques.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P005',
      name: 'David Miller',
      dateOfBirth: '1965-09-08',
      age: 58,
      gender: 'Male',
      bloodGroup: 'O-',
      phoneNumber: '+1 (555) 567-8901',
      address: '202 Maple Dr, Anywhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-10',
      medicalHistory: [
        {
          condition: 'COPD',
          date: '2010-11-05',
          notes: 'Diagnosed with Chronic Obstructive Pulmonary Disease.'
        },
        {
          condition: 'Pneumonia',
          date: '2022-01-15',
          notes: 'Severe pneumonia. Hospitalized for 5 days.'
        }
      ],
      notes: 'Former smoker. Requires oxygen therapy at night. Regular pulmonary function tests needed.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P006',
      name: 'Jennifer Davis',
      dateOfBirth: '1995-04-25',
      age: 28,
      gender: 'Female',
      bloodGroup: 'A+',
      phoneNumber: '+1 (555) 678-9012',
      address: '303 Cedar Ln, Someplace, USA',
      condition: 'Stable',
      lastVisit: '2023-11-15',
      medicalHistory: [
        {
          condition: 'Anxiety',
          date: '2018-06-10',
          notes: 'Diagnosed with generalized anxiety disorder. Started on medication.'
        }
      ],
      notes: 'Responds well to cognitive behavioral therapy. Regular follow-ups recommended.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P007',
      name: 'Robert Wilson',
      dateOfBirth: '1972-12-18',
      age: 51,
      gender: 'Male',
      bloodGroup: 'B-',
      phoneNumber: '+1 (555) 789-0123',
      address: '404 Birch Ave, Nowhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-05',
      medicalHistory: [
        {
          condition: 'Arthritis',
          date: '2015-08-22',
          notes: 'Diagnosed with osteoarthritis in knees. Physical therapy recommended.'
        }
      ],
      notes: 'Experiences joint pain during cold weather. Recommended low-impact exercise.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P008',
      name: 'Lisa Anderson',
      dateOfBirth: '1983-01-30',
      age: 40,
      gender: 'Female',
      bloodGroup: 'O+',
      phoneNumber: '+1 (555) 890-1234',
      address: '505 Spruce St, Anywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-20',
      medicalHistory: [
        {
          condition: 'Hypothyroidism',
          date: '2012-04-15',
          notes: 'Diagnosed with hypothyroidism. Started on thyroid replacement therapy.'
        }
      ],
      notes: 'Requires regular thyroid function tests. Medication adherence is good.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P009',
      name: 'James Taylor',
      dateOfBirth: '1958-06-14',
      age: 65,
      gender: 'Male',
      bloodGroup: 'AB-',
      phoneNumber: '+1 (555) 901-2345',
      address: '606 Fir Rd, Somewhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-08',
      medicalHistory: [
        {
          condition: 'Heart Failure',
          date: '2019-03-10',
          notes: 'Diagnosed with congestive heart failure. Started on medication.'
        },
        {
          condition: 'Kidney Disease',
          date: '2020-07-22',
          notes: 'Stage 3 chronic kidney disease. Dietary modifications recommended.'
        }
      ],
      notes: 'Requires careful monitoring of fluid intake and sodium levels. Regular cardiac and renal function tests.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P010',
      name: 'Michelle Garcia',
      dateOfBirth: '1990-08-05',
      age: 33,
      gender: 'Female',
      bloodGroup: 'A-',
      phoneNumber: '+1 (555) 012-3456',
      address: '707 Redwood Blvd, Everywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-12',
      medicalHistory: [
        {
          condition: 'Lupus',
          date: '2015-11-30',
          notes: 'Diagnosed with systemic lupus erythematosus. Started on immunosuppressive therapy.'
        }
      ],
      notes: 'Requires regular monitoring for disease activity. Avoids sun exposure due to photosensitivity.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P011',
      name: 'Thomas Martinez',
      dateOfBirth: '1978-02-28',
      age: 45,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '+1 (555) 123-4567',
      address: '808 Cypress Ave, Anywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-05',
      medicalHistory: [
        {
          condition: 'Sleep Apnea',
          date: '2016-09-12',
          notes: 'Diagnosed with obstructive sleep apnea. CPAP therapy initiated.'
        }
      ],
      notes: 'Reports improved sleep quality with CPAP. Regular sleep study recommended every 2 years.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P012',
      name: 'Patricia Lee',
      dateOfBirth: '1962-10-15',
      age: 61,
      gender: 'Female',
      bloodGroup: 'B+',
      phoneNumber: '+1 (555) 234-5678',
      address: '909 Willow Ln, Somewhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-15',
      medicalHistory: [
        {
          condition: 'Stroke',
          date: '2021-05-20',
          notes: 'Ischemic stroke affecting left side. Rehabilitation ongoing.'
        },
        {
          condition: 'Atrial Fibrillation',
          date: '2021-05-20',
          notes: 'Diagnosed with AFib. Started on anticoagulation therapy.'
        }
      ],
      notes: 'Requires physical therapy for left-sided weakness. Regular INR monitoring for anticoagulation.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P013',
      name: 'Daniel White',
      dateOfBirth: '1985-04-10',
      age: 38,
      gender: 'Male',
      bloodGroup: 'A+',
      phoneNumber: '+1 (555) 345-6789',
      address: '1010 Aspen Dr, Nowhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-20',
      medicalHistory: [
        {
          condition: 'Crohn\'s Disease',
          date: '2010-07-18',
          notes: 'Diagnosed with Crohn\'s disease. Started on biologic therapy.'
        }
      ],
      notes: 'Disease in remission. Regular colonoscopy every 2 years. Maintains strict diet.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P014',
      name: 'Nancy Clark',
      dateOfBirth: '1955-12-22',
      age: 68,
      gender: 'Female',
      bloodGroup: 'O-',
      phoneNumber: '+1 (555) 456-7890',
      address: '1111 Juniper Rd, Anywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-25',
      medicalHistory: [
        {
          condition: 'Osteoporosis',
          date: '2018-02-14',
          notes: 'Diagnosed with osteoporosis. Started on bisphosphonate therapy.'
        },
        {
          condition: 'Hip Fracture',
          date: '2019-08-30',
          notes: 'Fractured right hip. Surgical repair performed.'
        }
      ],
      notes: 'High fall risk. Home safety assessment recommended. Regular bone density scans.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P015',
      name: 'Christopher Hall',
      dateOfBirth: '1970-07-08',
      age: 53,
      gender: 'Male',
      bloodGroup: 'AB+',
      phoneNumber: '+1 (555) 567-8901',
      address: '1212 Sycamore St, Somewhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-12',
      medicalHistory: [
        {
          condition: 'Liver Disease',
          date: '2015-11-05',
          notes: 'Diagnosed with non-alcoholic steatohepatitis. Lifestyle modifications recommended.'
        },
        {
          condition: 'Diabetes Type 2',
          date: '2017-03-22',
          notes: 'Diagnosed with Type 2 diabetes. Started on medication.'
        }
      ],
      notes: 'Requires regular liver function tests. Strict glycemic control needed. Weight management is a priority.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P016',
      name: 'Susan Turner',
      dateOfBirth: '1987-09-30',
      age: 36,
      gender: 'Female',
      bloodGroup: 'B-',
      phoneNumber: '+1 (555) 678-9012',
      address: '1313 Magnolia Ave, Everywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-08',
      medicalHistory: [
        {
          condition: 'Endometriosis',
          date: '2012-06-15',
          notes: 'Diagnosed with endometriosis. Hormonal therapy initiated.'
        }
      ],
      notes: 'Experiences pelvic pain during menstruation. Regular gynecological follow-ups.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P017',
      name: 'Kevin Rodriguez',
      dateOfBirth: '1968-03-17',
      age: 55,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '+1 (555) 789-0123',
      address: '1414 Dogwood Ln, Anywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-10',
      medicalHistory: [
        {
          condition: 'Prostate Cancer',
          date: '2020-01-10',
          notes: 'Diagnosed with localized prostate cancer. Radiation therapy completed.'
        }
      ],
      notes: 'Cancer in remission. Regular PSA monitoring. Experiencing some urinary incontinence.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P018',
      name: 'Margaret Thompson',
      dateOfBirth: '1950-05-20',
      age: 73,
      gender: 'Female',
      bloodGroup: 'A-',
      phoneNumber: '+1 (555) 890-1234',
      address: '1515 Holly Rd, Somewhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-18',
      medicalHistory: [
        {
          condition: 'Alzheimer\'s Disease',
          date: '2018-09-12',
          notes: 'Diagnosed with early-stage Alzheimer\'s. Started on medication to slow progression.'
        },
        {
          condition: 'Falls',
          date: '2022-04-30',
          notes: 'Multiple falls at home. Home safety modifications recommended.'
        }
      ],
      notes: 'Requires caregiver assistance. Memory assessment every 6 months. Home safety evaluation completed.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P019',
      name: 'Joseph Allen',
      dateOfBirth: '1982-11-05',
      age: 41,
      gender: 'Male',
      bloodGroup: 'B+',
      phoneNumber: '+1 (555) 901-2345',
      address: '1616 Cypress Blvd, Nowhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-25',
      medicalHistory: [
        {
          condition: 'Psoriasis',
          date: '2010-04-18',
          notes: 'Diagnosed with moderate to severe psoriasis. Topical and systemic treatments initiated.'
        }
      ],
      notes: 'Disease well-controlled with current treatment. Regular dermatological follow-ups.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P020',
      name: 'Dorothy King',
      dateOfBirth: '1945-08-12',
      age: 78,
      gender: 'Female',
      bloodGroup: 'O-',
      phoneNumber: '+1 (555) 012-3456',
      address: '1717 Elm St, Anywhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-05',
      medicalHistory: [
        {
          condition: 'Heart Failure',
          date: '2015-07-22',
          notes: 'Diagnosed with congestive heart failure. Started on medication.'
        },
        {
          condition: 'COPD',
          date: '2017-11-10',
          notes: 'Diagnosed with Chronic Obstructive Pulmonary Disease. Inhaler therapy initiated.'
        }
      ],
      notes: 'Requires oxygen therapy. Regular cardiac and pulmonary function tests. Limited mobility.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P021',
      name: 'Steven Wright',
      dateOfBirth: '1975-01-28',
      age: 48,
      gender: 'Male',
      bloodGroup: 'A+',
      phoneNumber: '+1 (555) 123-4567',
      address: '1818 Maple Ave, Somewhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-15',
      medicalHistory: [
        {
          condition: 'Migraine',
          date: '2005-06-14',
          notes: 'Chronic migraines. Preventive and abortive medications prescribed.'
        }
      ],
      notes: 'Experiences 2-3 migraines per month. Trigger identification ongoing. Stress management techniques recommended.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P022',
      name: 'Betty Adams',
      dateOfBirth: '1952-04-15',
      age: 71,
      gender: 'Female',
      bloodGroup: 'AB-',
      phoneNumber: '+1 (555) 234-5678',
      address: '1919 Oak Rd, Everywhere, USA',
      condition: 'Stable',
      lastVisit: '2023-10-30',
      medicalHistory: [
        {
          condition: 'Rheumatoid Arthritis',
          date: '2010-09-20',
          notes: 'Diagnosed with rheumatoid arthritis. Disease-modifying therapy initiated.'
        }
      ],
      notes: 'Disease in low activity. Regular rheumatology follow-ups. Joint protection techniques recommended.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P023',
      name: 'George Baker',
      dateOfBirth: '1960-07-22',
      age: 63,
      gender: 'Male',
      bloodGroup: 'O+',
      phoneNumber: '+1 (555) 345-6789',
      address: '2020 Pine Ln, Anywhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-20',
      medicalHistory: [
        {
          condition: 'Lung Cancer',
          date: '2022-03-10',
          notes: 'Diagnosed with non-small cell lung cancer. Chemotherapy and radiation completed.'
        },
        {
          condition: 'Emphysema',
          date: '2018-11-05',
          notes: 'Diagnosed with emphysema. Inhaler therapy initiated.'
        }
      ],
      notes: 'Cancer in remission. Regular imaging and pulmonary function tests. Smoking cessation counseling ongoing.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P024',
      name: 'Helen Carter',
      dateOfBirth: '1988-12-08',
      age: 35,
      gender: 'Female',
      bloodGroup: 'B+',
      phoneNumber: '+1 (555) 456-7890',
      address: '2121 Birch St, Somewhere, USA',
      condition: 'Stable',
      lastVisit: '2023-11-05',
      medicalHistory: [
        {
          condition: 'Irritable Bowel Syndrome',
          date: '2015-02-18',
          notes: 'Diagnosed with IBS. Dietary modifications and medication prescribed.'
        }
      ],
      notes: 'Symptoms well-controlled with current treatment. Low FODMAP diet recommended.',
      appointments: [],
      healthMetrics: []
    },
    {
      id: 'P025',
      name: 'Edward Mitchell',
      dateOfBirth: '1948-06-30',
      age: 75,
      gender: 'Male',
      bloodGroup: 'A-',
      phoneNumber: '+1 (555) 567-8901',
      address: '2222 Cedar Blvd, Nowhere, USA',
      condition: 'Critical',
      lastVisit: '2023-12-10',
      medicalHistory: [
        {
          condition: 'Parkinson\'s Disease',
          date: '2015-10-12',
          notes: 'Diagnosed with Parkinson\'s disease. Levodopa therapy initiated.'
        },
        {
          condition: 'Orthostatic Hypotension',
          date: '2018-04-22',
          notes: 'Experiencing drops in blood pressure upon standing. Medication adjustments made.'
        }
      ],
      notes: 'Disease progression monitored. Physical therapy for gait and balance. Caregiver assistance required.',
      appointments: [],
      healthMetrics: []
    }
  ]);

  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patientsList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patientsList.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.condition.toLowerCase().includes(query)
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patientsList]);

  const addPatient = (patient: Patient) => {
    setPatientsList([...patientsList, patient]);
    
    toast({
      title: "Patient added",
      description: `${patient.name} has been added to your patient list.`
    });
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatientsList(
      patientsList.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
    
    toast({
      title: "Patient updated",
      description: `${updatedPatient.name}'s information has been updated.`
    });
  };

  const deletePatient = (id: string) => {
    const patientToDelete = patientsList.find(p => p.id === id);
    setPatientsList(patientsList.filter((patient) => patient.id !== id));
    
    toast({
      title: "Patient deleted",
      description: `${patientToDelete?.name} has been removed from your patient list.`
    });
  };

  const getPatientById = (id: string) => {
    return patientsList.find((patient) => patient.id === id);
  };

  // New functions for appointment management
  const addAppointment = (patientId: string, appointment: Appointment) => {
    const patient = getPatientById(patientId);
    if (!patient) return;

    const updatedPatient = {
      ...patient,
      appointments: [...(patient.appointments || []), appointment]
    };

    updatePatient(updatedPatient);
    toast({
      title: "Appointment added",
      description: `Appointment scheduled for ${patient.name} on ${appointment.date} at ${appointment.time}.`
    });
  };

  const updateAppointment = (patientId: string, appointmentId: string, updatedAppointment: Appointment) => {
    const patient = getPatientById(patientId);
    if (!patient || !patient.appointments) return;

    const updatedAppointments = patient.appointments.map(appointment => 
      appointment.id === appointmentId ? updatedAppointment : appointment
    );

    const updatedPatient = {
      ...patient,
      appointments: updatedAppointments
    };

    updatePatient(updatedPatient);
    toast({
      title: "Appointment updated",
      description: `Appointment for ${patient.name} has been updated.`
    });
  };

  const deleteAppointment = (patientId: string, appointmentId: string) => {
    const patient = getPatientById(patientId);
    if (!patient || !patient.appointments) return;

    const updatedAppointments = patient.appointments.filter(appointment => 
      appointment.id !== appointmentId
    );

    const updatedPatient = {
      ...patient,
      appointments: updatedAppointments
    };

    updatePatient(updatedPatient);
    toast({
      title: "Appointment cancelled",
      description: `Appointment for ${patient.name} has been cancelled.`
    });
  };

  // New functions for health metrics
  const addHealthMetric = (patientId: string, healthMetric: any) => {
    const patient = getPatientById(patientId);
    if (!patient) return;

    const updatedPatient = {
      ...patient,
      healthMetrics: [...(patient.healthMetrics || []), healthMetric]
    };

    updatePatient(updatedPatient);
    toast({
      title: "Health metrics added",
      description: `New health metrics recorded for ${patient.name}.`
    });
  };

  const getUpcomingAppointments = (patientId: string) => {
    const patient = getPatientById(patientId);
    if (!patient || !patient.appointments) return [];

    const today = new Date();
    return patient.appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today && appointment.status === 'Scheduled';
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPastAppointments = (patientId: string) => {
    const patient = getPatientById(patientId);
    if (!patient || !patient.appointments) return [];

    const today = new Date();
    return patient.appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate < today || appointment.status !== 'Scheduled';
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    patients: filteredPatients,
    allPatients: patientsList,
    searchQuery,
    setSearchQuery,
    selectedPatient,
    setSelectedPatient,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addHealthMetric,
    getUpcomingAppointments,
    getPastAppointments
  };
};

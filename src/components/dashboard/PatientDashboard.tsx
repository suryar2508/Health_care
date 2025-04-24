
import { useState } from "react";
import { Patient } from "@/components/patients/PatientForm";
import { PatientList } from "./patients/PatientList";
import { PatientDetails } from "./patients/PatientDetails";

const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients] = useState<Patient[]>([
    { 
      id: 1, 
      name: "John Doe",
      dateOfBirth: "1980-04-15",
      age: 45,
      gender: "male",
      bloodGroup: "O+",
      phoneNumber: "+1 234-567-8901",
      address: "123 Main St, Cityville, ST 12345",
      condition: "Hypertension",
      lastVisit: "2025-04-15",
      medicalHistory: "Prior heart surgery in 2020",
      notes: "Regular checkups required"
    },
    { 
      id: 2, 
      name: "Sarah Johnson",
      dateOfBirth: "1993-08-22",
      age: 32,
      gender: "female",
      bloodGroup: "A+",
      phoneNumber: "+1 234-567-8902",
      address: "456 Oak Ave, Townsburg, ST 12346",
      condition: "Diabetes Type 2",
      lastVisit: "2025-04-10",
      medicalHistory: "Family history of diabetes",
      notes: "Monitoring blood sugar levels"
    },
    { 
      id: 3, 
      name: "Robert Brown",
      dateOfBirth: "1967-11-30",
      age: 58,
      gender: "male",
      bloodGroup: "B-",
      phoneNumber: "+1 234-567-8903",
      address: "789 Pine Rd, Villagetown, ST 12347",
      condition: "Arthritis",
      lastVisit: "2025-03-28",
      medicalHistory: "Joint replacement in 2018",
      notes: "Physical therapy ongoing"
    }
  ]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  if (selectedPatient) {
    return (
      <PatientDetails
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <PatientList
      patients={patients}
      onSelectPatient={handleSelectPatient}
    />
  );
};

export default PatientDashboard;

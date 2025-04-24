
import { useState } from "react";
import { Patient } from "@/components/patients/PatientForm";
import { PatientList } from "./patients/PatientList";
import { PatientDetails } from "./patients/PatientDetails";

const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients] = useState<Patient[]>([
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2025-04-15" },
    { id: 2, name: "Sarah Johnson", age: 32, condition: "Diabetes Type 2", lastVisit: "2025-04-10" },
    { id: 3, name: "Robert Brown", age: 58, condition: "Arthritis", lastVisit: "2025-03-28" },
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

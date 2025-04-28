import { useState } from "react";
import { Patient } from "@/data/patientHealthMetrics";
import { PatientList } from "./patients/PatientList";
import { PatientDetails } from "./patients/PatientDetails";
import { usePatients } from "@/hooks/use-patients";
import { generateSamplePatients } from "@/data/patientHealthMetrics";

const PatientDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { patients: existingPatients, addPatient, updatePatient, deletePatient } = usePatients();
  
  // Generate 25 patients if we don't have enough
  const patients = existingPatients.length < 25 
    ? generateSamplePatients(25) 
    : existingPatients;

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleAddPatient = (patient: Patient) => {
    addPatient(patient);
  };

  const handleUpdatePatient = (patient: Patient) => {
    updatePatient(patient);
  };

  const handleDeletePatient = (patientId: string) => {
    deletePatient(patientId);
  };

  if (selectedPatient) {
    return (
      <PatientDetails
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    );
  }

  return (
    <PatientList
      patients={patients}
      onSelectPatient={handleSelectPatient}
      onAddPatient={handleAddPatient}
      onUpdatePatient={handleUpdatePatient}
      onDeletePatient={handleDeletePatient}
    />
  );
};

export default PatientDashboard;

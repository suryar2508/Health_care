
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Patient } from "@/components/patients/PatientForm";

export function usePatients() {
  const { toast } = useToast();
  const [patientsList, setPatientsList] = useState<Patient[]>([
    { 
      id: 1, 
      name: "John Doe",
      dateOfBirth: "1980-01-01",
      age: 45,
      gender: "male",
      bloodGroup: "O+",
      phoneNumber: "+1 234-567-8901",
      address: "123 Main St, City, State",
      condition: "Hypertension",
      lastVisit: "2025-04-15",
      medicalHistory: "None",
      notes: "Regular checkup required"
    },
    { 
      id: 2, 
      name: "Sarah Johnson",
      dateOfBirth: "1990-05-15",
      age: 32,
      gender: "female",
      bloodGroup: "A+",
      phoneNumber: "+1 234-567-8902",
      address: "456 Oak Ave, City, State",
      condition: "Diabetes Type 2",
      lastVisit: "2025-04-10",
      medicalHistory: "Family history of diabetes",
      notes: "Blood sugar monitoring"
    }
  ]);

  const addPatient = (patientData: Omit<Patient, "id">) => {
    const newId = patientsList.length > 0 
      ? Math.max(...patientsList.map(p => p.id)) + 1 
      : 1;
    
    const newPatient = { id: newId, ...patientData };
    setPatientsList([...patientsList, newPatient]);
    
    toast({
      title: "Patient added",
      description: `${patientData.name} has been added to your patient list.`
    });
  };

  const updatePatient = (patientId: number, patientData: Omit<Patient, "id">) => {
    const updatedPatients = patientsList.map(patient => 
      patient.id === patientId 
        ? { ...patient, ...patientData } 
        : patient
    );
    
    setPatientsList(updatedPatients);
    
    toast({
      title: "Patient updated",
      description: `${patientData.name}'s information has been updated.`
    });
  };

  const deletePatient = (patientId: number) => {
    const patient = patientsList.find(p => p.id === patientId);
    if (!patient) return;

    const filteredPatients = patientsList.filter(
      patient => patient.id !== patientId
    );
    
    setPatientsList(filteredPatients);
    
    toast({
      title: "Patient deleted",
      description: `${patient.name} has been removed from your patient list.`
    });
  };

  const getPatientById = (patientId: number) => {
    return patientsList.find(p => p.id === patientId);
  };

  return {
    patients: patientsList,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById
  };
}

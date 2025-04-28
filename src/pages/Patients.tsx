import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient, PatientForm } from "@/components/patients/PatientForm";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { PatientSearchBar } from "@/components/patients/PatientSearchBar";
import { usePatients } from "@/hooks/use-patients";
import { AllPatientsTab } from "@/components/patients/tabs/AllPatientsTab";
import { RecentVisitsTab } from "@/components/patients/tabs/RecentVisitsTab";
import { CriticalConditionsTab } from "@/components/patients/tabs/CriticalConditionsTab";

const Patients = () => {
  const [userData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const { 
    patients: patientsList, 
    addPatient, 
    updatePatient, 
    deletePatient, 
    getPatientById 
  } = usePatients();

  // Only filter if there's a search query
  const filteredPatients = searchQuery 
    ? patientsList.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : patientsList; // Show all patients if no search query

  const handleViewPatient = (patientId: number) => {
    const patient = getPatientById(patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsEditDialogOpen(true);
    }
  };

  const handleDeletePatient = () => {
    if (!selectedPatient) return;
    deletePatient(selectedPatient.id);
    setIsDeleteDialogOpen(false);
    setSelectedPatient(null);
  };

  const openDeleteDialog = (patientId: number) => {
    const patient = getPatientById(patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsDeleteDialogOpen(true);
    }
  };

  return (
    <Layout userName={userData?.name} userRole={userData?.role}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Patient Management</h2>
          <Button onClick={() => setIsAddDialogOpen(true)}>Add New Patient</Button>
        </div>

        <PatientSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="recent">Recent Visits</TabsTrigger>
            <TabsTrigger value="critical">Critical Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <AllPatientsTab
              patients={filteredPatients}
              onView={handleViewPatient}
              onDelete={openDeleteDialog}
            />
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <RecentVisitsTab
              patients={filteredPatients}
              onView={handleViewPatient}
              onDelete={openDeleteDialog}
            />
          </TabsContent>
          
          <TabsContent value="critical" className="space-y-4">
            <CriticalConditionsTab
              patients={filteredPatients}
              onView={handleViewPatient}
              onDelete={openDeleteDialog}
            />
          </TabsContent>
        </Tabs>
      </div>

      <PatientForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={addPatient}
        title="Add New Patient"
      />

      {selectedPatient && (
        <PatientForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedPatient(null);
          }}
          onSubmit={(data) => updatePatient(selectedPatient.id, data)}
          patient={selectedPatient}
          title={`Edit Patient: ${selectedPatient.name}`}
        />
      )}

      {selectedPatient && (
        <DeletePatientDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedPatient(null);
          }}
          onConfirm={handleDeletePatient}
          patientName={selectedPatient.name}
        />
      )}
    </Layout>
  );
};

export default Patients;

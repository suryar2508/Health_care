import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Patient, PatientForm } from "@/components/patients/PatientForm";
import { DeletePatientDialog } from "@/components/patients/DeletePatientDialog";
import { PatientSearchBar } from "@/components/patients/PatientSearchBar";
import { PatientTable } from "@/components/patients/PatientTable";
import { RecentPatientsTable } from "@/components/patients/RecentPatientsTable";
import { CriticalPatientsTable } from "@/components/patients/CriticalPatientsTable";

const Patients = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patientsList.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = (patientData: Omit<Patient, "id">) => {
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

  const handleEditPatient = (patientData: Omit<Patient, "id">) => {
    if (!selectedPatient) return;
    
    const updatedPatients = patientsList.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, ...patientData } 
        : patient
    );
    
    setPatientsList(updatedPatients);
    
    toast({
      title: "Patient updated",
      description: `${patientData.name}'s information has been updated.`
    });
  };

  const handleDeletePatient = () => {
    if (!selectedPatient) return;
    
    const filteredPatients = patientsList.filter(
      patient => patient.id !== selectedPatient.id
    );
    
    setPatientsList(filteredPatients);
    
    toast({
      title: "Patient deleted",
      description: `${selectedPatient.name} has been removed from your patient list.`
    });
    
    setIsDeleteDialogOpen(false);
  };

  const handleViewPatient = (patientId: number) => {
    const patient = patientsList.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (patientId: number) => {
    const patient = patientsList.find(p => p.id === patientId);
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
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>
                  Manage your patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientTable 
                  patients={filteredPatients}
                  onView={handleViewPatient}
                  onDelete={openDeleteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Visits</CardTitle>
                <CardDescription>
                  Patients who visited in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatientsTable
                  patients={filteredPatients}
                  onView={handleViewPatient}
                  onDelete={openDeleteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="critical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Conditions</CardTitle>
                <CardDescription>
                  Patients requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CriticalPatientsTable
                  patients={filteredPatients}
                  onView={handleViewPatient}
                  onDelete={openDeleteDialog}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <PatientForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddPatient}
        title="Add New Patient"
      />

      {selectedPatient && (
        <PatientForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedPatient(null);
          }}
          onSubmit={handleEditPatient}
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

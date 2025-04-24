
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicineReminderList } from "@/components/health/MedicineReminderList";
import { HealthMetricsGrid } from "./metrics/HealthMetricsGrid";
import { WeeklyHealthMetrics } from "./overview/WeeklyHealthMetrics";
import { HealthMetricsOverview } from "./metrics/HealthMetricsOverview";
import { DietRecommendations } from "./diet/DietRecommendations";
import { Button } from "@/components/ui/button";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { PrescriptionsList } from "./PrescriptionsList";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Patient } from "@/components/patients/PatientForm";

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
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Patient Details</h2>
            <p className="text-muted-foreground">
              Viewing details for {selectedPatient.name}
            </p>
          </div>
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            Back to Patients List
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{selectedPatient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{selectedPatient.age}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Condition</p>
                <p className="font-medium">{selectedPatient.condition}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Visit</p>
                <p className="font-medium">{selectedPatient.lastVisit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health-metrics">Health Metrics</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <HealthMetricsGrid />
            <WeeklyHealthMetrics />
            <DietRecommendations />
          </TabsContent>

          <TabsContent value="health-metrics" className="space-y-4">
            <HealthMetricsOverview />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentsList />
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <PrescriptionsList />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Patient List</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
          <CardDescription>View and manage your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;


import { Patient } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicineReminderList } from "@/components/health/MedicineReminderList";
import { HealthMetricsGrid } from "../metrics/HealthMetricsGrid";
import { WeeklyHealthMetrics } from "../overview/WeeklyHealthMetrics";
import { HealthMetricsOverview } from "../metrics/HealthMetricsOverview";
import { DietRecommendations } from "../diet/DietRecommendations";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { PrescriptionsList } from "../PrescriptionsList";

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
}

export function PatientDetails({ patient, onBack }: PatientDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Patient Details</h2>
          <p className="text-muted-foreground">
            Viewing details for {patient.name}
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
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
              <p className="font-medium">{patient.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">{patient.age}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-medium">{patient.condition}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Visit</p>
              <p className="font-medium">{patient.lastVisit}</p>
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

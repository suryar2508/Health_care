
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicineReminderList } from "@/components/health/MedicineReminderList";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { HealthMetricsGrid } from "./metrics/HealthMetricsGrid";
import { WeeklyHealthMetrics } from "./overview/WeeklyHealthMetrics";
import { HealthMetricsOverview } from "./metrics/HealthMetricsOverview";
import { DietRecommendations } from "./diet/DietRecommendations";
import { Button } from "@/components/ui/button";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { PrescriptionsList } from "./PrescriptionsList";

const PatientDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Patient Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health-metrics">Health Metrics</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <HealthMetricsGrid />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <WeeklyHealthMetrics />
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Medicine Schedule</CardTitle>
                <CardDescription>Your upcoming medication reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <MedicineReminderList />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled doctor appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments limit={3} />
              </CardContent>
            </Card>
            <DietRecommendations />
          </div>
        </TabsContent>

        <TabsContent value="health-metrics" className="space-y-4">
          <HealthMetricsOverview />
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">All Appointments</h3>
                <p className="text-muted-foreground">
                  Manage your scheduled appointments
                </p>
              </div>
              <Button>
                Schedule New Appointment
              </Button>
            </div>
            <AppointmentsList />
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <PrescriptionsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;

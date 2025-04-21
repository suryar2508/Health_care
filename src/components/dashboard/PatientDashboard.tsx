
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthVitalsCard } from "@/components/health/HealthVitalsCard";
import { MedicineReminderList } from "@/components/health/MedicineReminderList";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { AreaChart, Bar, BarChart, ResponsiveContainer } from "recharts";

// Mock data for the charts
const healthData = [
  { name: "Mon", systolic: 125, diastolic: 85, heart: 75 },
  { name: "Tue", systolic: 128, diastolic: 82, heart: 72 },
  { name: "Wed", systolic: 130, diastolic: 88, heart: 80 },
  { name: "Thu", systolic: 120, diastolic: 80, heart: 70 },
  { name: "Fri", systolic: 125, diastolic: 84, heart: 74 },
  { name: "Sat", systolic: 132, diastolic: 86, heart: 76 },
  { name: "Sun", systolic: 126, diastolic: 82, heart: 72 },
];

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <HealthVitalsCard
              title="Blood Pressure"
              value="125/82"
              unit="mmHg"
              status="normal"
              icon="heart"
              change="3% higher than last week"
            />
            <HealthVitalsCard
              title="Heart Rate"
              value="72"
              unit="bpm"
              status="normal"
              icon="heart"
              change="Stable compared to last week"
            />
            <HealthVitalsCard
              title="Blood Oxygen"
              value="98"
              unit="%"
              status="normal"
              icon="heart"
              change="1% higher than last week"
            />
            <HealthVitalsCard
              title="Temperature"
              value="36.8"
              unit="°C"
              status="normal"
              icon="thermometer"
              change="Normal range"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Health Metrics</CardTitle>
                <CardDescription>
                  Your blood pressure and heart rate over the past week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={healthData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4c9aff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4c9aff" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#50C878" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#50C878" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9F5A" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FF9F5A" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Bar dataKey="systolic" stroke="#4c9aff" fill="url(#colorSystolic)" name="Systolic" />
                    <Bar dataKey="diastolic" stroke="#50C878" fill="url(#colorDiastolic)" name="Diastolic" />
                    <Bar dataKey="heart" stroke="#FF9F5A" fill="url(#colorHeart)" name="Heart Rate" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Medicine Schedule</CardTitle>
                <CardDescription>
                  Your upcoming medication reminders
                </CardDescription>
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
                <CardDescription>
                  Your scheduled doctor appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments limit={3} />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Diet Recommendations</CardTitle>
                <CardDescription>
                  Based on your health profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-success" />
                    <div>
                      <p className="font-medium">Include more fiber-rich foods</p>
                      <p className="text-sm text-muted-foreground">Whole grains, vegetables, and fruits</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-success" />
                    <div>
                      <p className="font-medium">Reduce sodium intake</p>
                      <p className="text-sm text-muted-foreground">Limit processed foods and added salt</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-healthcare-warning" />
                    <div>
                      <p className="font-medium">Avoid excessive caffeine</p>
                      <p className="text-sm text-muted-foreground">Can increase blood pressure temporarily</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="health-metrics" className="space-y-4">
          <h3 className="text-xl font-semibold">Health Metrics Details</h3>
          <p className="text-muted-foreground">
            A more detailed view of your health metrics will be shown here
          </p>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4">
          <h3 className="text-xl font-semibold">All Appointments</h3>
          <p className="text-muted-foreground">
            A complete list of past and upcoming appointments will be shown here
          </p>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <h3 className="text-xl font-semibold">All Prescriptions</h3>
          <p className="text-muted-foreground">
            A complete list of your prescriptions will be shown here
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDashboard;

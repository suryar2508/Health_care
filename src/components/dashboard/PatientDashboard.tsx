import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthVitalsCard } from "@/components/health/HealthVitalsCard";
import { MedicineReminderList } from "@/components/health/MedicineReminderList";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { mockHealthMetrics, mockAppointments } from "@/utils/mockData";
import { AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area } from "recharts";

const PatientDashboard = () => {
  // Get the latest health metric
  const latestMetric = mockHealthMetrics[0];

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
              value={`${latestMetric.bloodPressure.systolic}/${latestMetric.bloodPressure.diastolic}`}
              unit="mmHg"
              status={
                latestMetric.bloodPressure.systolic < 120 && latestMetric.bloodPressure.diastolic < 80 
                  ? "normal" 
                  : latestMetric.bloodPressure.systolic >= 140 || latestMetric.bloodPressure.diastolic >= 90 
                    ? "critical" 
                    : "warning"
              }
              icon="heart"
              change="Based on last reading"
            />
            <HealthVitalsCard
              title="Heart Rate"
              value={latestMetric.heartRate.toString()}
              unit="bpm"
              status={
                latestMetric.heartRate >= 60 && latestMetric.heartRate <= 100 
                  ? "normal" 
                  : "warning"
              }
              icon="heart"
              change="Current reading"
            />
            <HealthVitalsCard
              title="Blood Oxygen"
              value={latestMetric.bloodOxygen.toString()}
              unit="%"
              status={latestMetric.bloodOxygen >= 95 ? "normal" : "critical"}
              icon="heart"
              change="Current reading"
            />
            <HealthVitalsCard
              title="Temperature"
              value={latestMetric.temperature.toString()}
              unit="°C"
              status={
                latestMetric.temperature >= 36.5 && latestMetric.temperature <= 37.5 
                  ? "normal" 
                  : "warning"
              }
              icon="thermometer"
              change="Current reading"
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
                    data={mockHealthMetrics}
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
          <Card>
            <CardHeader>
              <CardTitle>Health Metrics History</CardTitle>
              <CardDescription>Your health measurements over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockHealthMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateRecorded" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="bloodPressure.systolic" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Systolic BP"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bloodPressure.diastolic" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    name="Diastolic BP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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

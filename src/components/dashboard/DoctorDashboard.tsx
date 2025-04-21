
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingAppointments } from "@/components/appointments/UpcomingAppointments";
import { BarChart, ResponsiveContainer } from "recharts";
import { Calendar } from "lucide-react";

// Mock data for the charts
const appointmentData = [
  { name: "Mon", appointments: 8 },
  { name: "Tue", appointments: 12 },
  { name: "Wed", appointments: 10 },
  { name: "Thu", appointments: 15 },
  { name: "Fri", appointments: 9 },
  { name: "Sat", appointments: 5 },
  { name: "Sun", appointments: 0 },
];

const DoctorDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Patients
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">
                  +4% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Appointments
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3 pending confirmations
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Reports
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Require your review
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Critical Alerts
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Patients need attention
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Weekly Appointments</CardTitle>
                <CardDescription>
                  Your scheduled appointments for this week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appointmentData}>
                    {/* Chart implementation would be here */}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your appointments for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingAppointments isDoctor={true} limit={5} />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Patient Updates</CardTitle>
                <CardDescription>
                  Recent changes in patient conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-healthcare-primary flex items-center justify-center text-white font-semibold">
                      JD
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-muted-foreground">Blood pressure elevated to 140/90 mmHg</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </li>
                  <li className="flex items-center gap-4 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-healthcare-secondary flex items-center justify-center text-white font-semibold">
                      SJ
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-sm text-muted-foreground">Medication side effects reported</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-healthcare-accent flex items-center justify-center text-white font-semibold">
                      RB
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Robert Brown</h4>
                      <p className="text-sm text-muted-foreground">Heart rate irregularity detected</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Medicine Inventory</CardTitle>
                <CardDescription>
                  Low stock alert
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Amoxicillin 500mg</p>
                      <p className="text-sm text-muted-foreground">10 left</p>
                    </div>
                    <Button variant="outline" size="sm">Order</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Lisinopril 10mg</p>
                      <p className="text-sm text-muted-foreground">5 left</p>
                    </div>
                    <Button variant="outline" size="sm">Order</Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Insulin</p>
                      <p className="text-sm text-muted-foreground">3 left</p>
                    </div>
                    <Button variant="outline" size="sm">Order</Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="patients" className="space-y-4">
          <h3 className="text-xl font-semibold">Patient Management</h3>
          <p className="text-muted-foreground">
            A list of all your patients will be shown here
          </p>
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4">
          <h3 className="text-xl font-semibold">All Appointments</h3>
          <p className="text-muted-foreground">
            A complete list of past and upcoming appointments will be shown here
          </p>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-4">
          <h3 className="text-xl font-semibold">Prescription Management</h3>
          <p className="text-muted-foreground">
            A list of prescriptions you've issued will be shown here
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;

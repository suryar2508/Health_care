import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  ClipboardList,
  UserCheck
} from "lucide-react";
import apiService from "@/services/api";

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  qualification: string;
  department: string;
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  patients: number;
  appointments: number;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  medicalHistory: string;
  assignedDoctor: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  type: string;
  notes: string;
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDoctorProfile();
    loadPatients();
    loadAppointments();
  }, []);

  const loadDoctorProfile = async () => {
    try {
      const response = await apiService.getDoctorProfile();
      setDoctor(response.data);
    } catch (error) {
      console.error("Error loading doctor profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load doctor profile",
      });
    }
  };

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data.filter((patient: Patient) => 
        patient.assignedDoctor === doctor?.id
      ));
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await apiService.getAppointments();
      setAppointments(response.data.filter((appointment: Appointment) => 
        appointment.doctorId === doctor?.id
      ));
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>Doctor profile not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Welcome,</span>
          <span className="font-semibold">{doctor.name}</span>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctor.patients}</div>
                <p className="text-xs text-muted-foreground">
                  Patients under your care
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appointments.filter(a => a.status === "scheduled").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Scheduled appointments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Specialization</CardTitle>
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctor.specialization}</div>
                <p className="text-xs text-muted-foreground">
                  Your medical specialty
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Experience</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctor.experience} years</div>
                <p className="text-xs text-muted-foreground">
                  Years of experience
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map((patient) => (
                  <Card key={patient.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-1" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 mr-1" />
                          Age: {patient.age}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Gender: {patient.gender}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">
                          {patients.find(p => p.id === appointment.patientId)?.name}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-4 w-4 mr-1" />
                          {appointment.type}
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === "scheduled" 
                            ? "bg-blue-100 text-blue-800"
                            : appointment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Your Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(doctor.schedule).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center p-4 border rounded-lg">
                    <span className="font-medium capitalize">{day}</span>
                    <span className="text-muted-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
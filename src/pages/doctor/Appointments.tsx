import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import { DoctorAppointmentsProps } from "@/types/pages";

export default function DoctorAppointments({ children }: DoctorAppointmentsProps) {
  const appointments = {
    today: [
      {
        id: 1,
        patient: "John Doe",
        type: "Follow-up",
        date: "2024-03-25",
        time: "09:00 AM",
        status: "Confirmed",
        notes: "Regular check-up"
      },
      {
        id: 2,
        patient: "Jane Smith",
        type: "New Patient",
        date: "2024-03-25",
        time: "10:30 AM",
        status: "Confirmed",
        notes: "Initial consultation"
      }
    ],
    upcoming: [
      {
        id: 3,
        patient: "Mike Johnson",
        type: "Consultation",
        date: "2024-03-26",
        time: "02:00 PM",
        status: "Pending",
        notes: "Follow-up after surgery"
      },
      {
        id: 4,
        patient: "Sarah Wilson",
        type: "Check-up",
        date: "2024-03-27",
        time: "11:00 AM",
        status: "Confirmed",
        notes: "Annual physical"
      }
    ],
    past: [
      {
        id: 5,
        patient: "David Brown",
        type: "Follow-up",
        date: "2024-03-24",
        time: "03:30 PM",
        status: "Completed",
        notes: "Medication review"
      },
      {
        id: 6,
        patient: "Emily Davis",
        type: "Consultation",
        date: "2024-03-23",
        time: "01:00 PM",
        status: "Completed",
        notes: "Test results review"
      }
    ]
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button>Schedule New Appointment</Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {appointments.today.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.patient}</CardTitle>
                <CardDescription>{appointment.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {appointment.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Notes: {appointment.notes}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Patient</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="outline" size="sm">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {appointments.upcoming.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.patient}</CardTitle>
                <CardDescription>{appointment.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {appointment.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Notes: {appointment.notes}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Patient</Button>
                  <Button variant="outline" size="sm">Reschedule</Button>
                  <Button variant="outline" size="sm">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {appointments.past.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.patient}</CardTitle>
                <CardDescription>{appointment.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {appointment.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Notes: {appointment.notes}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Patient</Button>
                  <Button variant="outline" size="sm">View Notes</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
} 
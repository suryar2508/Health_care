import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const appointments = {
    upcoming: [
      {
        id: 1,
        doctor: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        date: "2024-03-25",
        time: "10:00 AM",
        location: "Main Hospital, Room 302",
        status: "Confirmed"
      },
      {
        id: 2,
        doctor: "Dr. Michael Chen",
        specialty: "Dermatology",
        date: "2024-04-01",
        time: "2:30 PM",
        location: "Medical Center, Suite 105",
        status: "Pending"
      }
    ],
    past: [
      {
        id: 3,
        doctor: "Dr. Emily Brown",
        specialty: "General Medicine",
        date: "2024-03-15",
        time: "11:00 AM",
        location: "Main Hospital, Room 201",
        status: "Completed"
      },
      {
        id: 4,
        doctor: "Dr. James Wilson",
        specialty: "Orthopedics",
        date: "2024-03-10",
        time: "3:00 PM",
        location: "Medical Center, Suite 203",
        status: "Completed"
      }
    ]
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Button>Book New Appointment</Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {appointments.upcoming.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>{appointment.doctor}</CardTitle>
                <CardDescription>{appointment.specialty}</CardDescription>
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
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {appointment.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
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
                <CardTitle>{appointment.doctor}</CardTitle>
                <CardDescription>{appointment.specialty}</CardDescription>
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
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Status: {appointment.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Book Follow-up</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

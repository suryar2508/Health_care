import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, Calendar, Clock, User } from "lucide-react";

export default function AdminAppointments() {
  const appointments = [
    {
      id: "A001",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      date: "2024-03-25",
      time: "09:00 AM",
      type: "Follow-up",
      status: "Confirmed"
    },
    {
      id: "A002",
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      date: "2024-03-25",
      time: "10:30 AM",
      type: "New Patient",
      status: "Confirmed"
    },
    {
      id: "A003",
      patient: "Mike Johnson",
      doctor: "Dr. Emily Brown",
      date: "2024-03-26",
      time: "02:00 PM",
      type: "Consultation",
      status: "Pending"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment List</CardTitle>
          <CardDescription>Manage all appointments in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.patient}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === "Confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 
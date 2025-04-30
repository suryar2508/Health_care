import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal, FileText, Calendar } from "lucide-react";

export default function DoctorPatients() {
  const patients = [
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      gender: "Male",
      condition: "Hypertension",
      lastVisit: "2024-03-15",
      nextAppointment: "2024-04-15",
      status: "Active"
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      condition: "Diabetes",
      lastVisit: "2024-03-18",
      nextAppointment: "2024-04-18",
      status: "Active"
    },
    {
      id: "P003",
      name: "Mike Johnson",
      age: 28,
      gender: "Male",
      condition: "Asthma",
      lastVisit: "2024-03-10",
      nextAppointment: "2024-04-10",
      status: "Active"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Manage your patient records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appointment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.nextAppointment}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      patient.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {patient.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Calendar className="h-4 w-4" />
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
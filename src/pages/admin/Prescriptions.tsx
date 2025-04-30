import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MoreHorizontal } from "lucide-react";

export default function AdminPrescriptions() {
  const prescriptions = [
    {
      id: "RX001",
      patient: "John Doe",
      doctor: "Dr. Sarah Johnson",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      startDate: "2024-03-01",
      endDate: "2024-06-01",
      status: "Active"
    },
    {
      id: "RX002",
      patient: "Jane Smith",
      doctor: "Dr. Michael Chen",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      status: "Active"
    },
    {
      id: "RX003",
      patient: "Mike Johnson",
      doctor: "Dr. Emily Brown",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      startDate: "2024-01-10",
      endDate: "2024-01-24",
      status: "Completed"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prescriptions</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Prescription
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription List</CardTitle>
          <CardDescription>Manage medication prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions..."
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
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.id}</TableCell>
                  <TableCell>{prescription.patient}</TableCell>
                  <TableCell>{prescription.doctor}</TableCell>
                  <TableCell>{prescription.medication}</TableCell>
                  <TableCell>{prescription.dosage}</TableCell>
                  <TableCell>{prescription.frequency}</TableCell>
                  <TableCell>{prescription.startDate}</TableCell>
                  <TableCell>{prescription.endDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      prescription.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {prescription.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
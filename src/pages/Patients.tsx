import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  status: "Active" | "Inactive";
  condition?: string;
}

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const patients: Patient[] = [
    {
      id: "1",
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com",
      lastVisit: "2024-03-15",
      status: "Active",
      condition: "Hypertension"
    },
    {
      id: "2",
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@example.com",
      lastVisit: "2024-03-10",
      status: "Active",
      condition: "Diabetes"
    },
    {
      id: "3",
      name: "Robert Johnson",
      age: 58,
      gender: "Male",
      phone: "+1 (555) 456-7890",
      email: "robert.johnson@example.com",
      lastVisit: "2024-02-28",
      status: "Inactive",
      condition: "Arthritis"
    },
  ];

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.condition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentPatients = filteredPatients.filter(patient => 
    new Date(patient.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const criticalPatients = filteredPatients.filter(patient => 
    ["Hypertension", "Diabetes", "Heart Disease"].includes(patient.condition || "")
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Button>Add New Patient</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="recent">Recent Visits</TabsTrigger>
          <TabsTrigger value="critical">Critical Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4">
            {recentPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <div className="grid gap-4">
            {criticalPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <p className="text-muted-foreground">No patients found</p>
            <Button className="mt-4">Add Your First Patient</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-xl">{patient.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {patient.age} years old • {patient.gender}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          patient.status === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        }`}>
          {patient.status}
        </span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{patient.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{patient.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last Visit: {patient.lastVisit}</span>
          </div>
        </div>
        
        {patient.condition && (
          <div className="mt-4 p-2 bg-muted rounded-md">
            <p className="text-sm">
              <span className="font-medium">Condition: </span>
              {patient.condition}
            </p>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm">View Details</Button>
          <Button variant="outline" size="sm">Schedule Appointment</Button>
          <Button variant="outline" size="sm">View History</Button>
        </div>
      </CardContent>
    </Card>
  );
}

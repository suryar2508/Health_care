
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Patients = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Mock patient data - in real app, this would come from Supabase
  const patientsList = [
    { id: 1, name: "John Doe", age: 45, condition: "Hypertension", lastVisit: "2025-04-15" },
    { id: 2, name: "Sarah Johnson", age: 32, condition: "Diabetes Type 2", lastVisit: "2025-04-10" },
    { id: 3, name: "Robert Brown", age: 58, condition: "Arthritis", lastVisit: "2025-03-28" },
    { id: 4, name: "Emily Davis", age: 29, condition: "Asthma", lastVisit: "2025-04-05" },
    { id: 5, name: "Michael Wilson", age: 41, condition: "High Cholesterol", lastVisit: "2025-04-18" }
  ];

  // Filter patients based on search query
  const filteredPatients = patientsList.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewPatient = (patientId: number) => {
    toast({
      title: "Patient selected",
      description: `Viewing details for patient ID: ${patientId}`,
    });
    // In a real app with Supabase, you would navigate to a patient detail page here
  };

  return (
    <Layout userName={userData?.name} userRole={userData?.role}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Patient Management</h2>
          <Button>Add New Patient</Button>
        </div>

        <div className="relative w-full max-w-sm">
          <Input 
            type="search" 
            placeholder="Search patients..." 
            className="w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="recent">Recent Visits</TabsTrigger>
            <TabsTrigger value="critical">Critical Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient List</CardTitle>
                <CardDescription>
                  Manage your patient records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-left font-medium">Name</th>
                        <th className="py-3 px-2 text-left font-medium">Age</th>
                        <th className="py-3 px-2 text-left font-medium">Condition</th>
                        <th className="py-3 px-2 text-left font-medium">Last Visit</th>
                        <th className="py-3 px-2 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map(patient => (
                          <tr key={patient.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{patient.name}</td>
                            <td className="py-3 px-2">{patient.age}</td>
                            <td className="py-3 px-2">{patient.condition}</td>
                            <td className="py-3 px-2">{patient.lastVisit}</td>
                            <td className="py-3 px-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient.id)}>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center">
                            No patients found matching your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Visits</CardTitle>
                <CardDescription>
                  Patients who visited in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Recent visits will be shown here.</p>
                {/* Once connected to Supabase, you would fetch and display recent patients here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="critical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Conditions</CardTitle>
                <CardDescription>
                  Patients requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Critical patients will be shown here.</p>
                {/* Once connected to Supabase, you would fetch and display critical patients here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Patients;

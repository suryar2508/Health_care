
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";

const Prescriptions = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );

  // Mock prescription data - in real app, this would come from Supabase
  const prescriptionsList = [
    { 
      id: 1, 
      medication: "Amoxicillin", 
      dosage: "500mg", 
      frequency: "3 times daily", 
      startDate: "2025-04-10", 
      endDate: "2025-04-20",
      doctor: "Dr. Sarah Smith",
      notes: "Take with food"
    },
    { 
      id: 2, 
      medication: "Lisinopril", 
      dosage: "10mg", 
      frequency: "Once daily", 
      startDate: "2025-03-15", 
      endDate: "2025-06-15",
      doctor: "Dr. James Wilson",
      notes: "Take in the morning"
    },
    { 
      id: 3, 
      medication: "Metformin", 
      dosage: "850mg", 
      frequency: "Twice daily", 
      startDate: "2025-02-20", 
      endDate: "2025-05-20",
      doctor: "Dr. Sarah Smith",
      notes: "Take with meals"
    }
  ];

  const handleViewPrescription = (id: number) => {
    toast({
      title: "Prescription details",
      description: `Viewing prescription ID: ${id}`,
    });
    // In a real app with Supabase, you would show detailed prescription information
  };

  return (
    <Layout userName={userData?.name} userRole={userData?.role}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Prescriptions</h2>
          {userData?.role === "Doctor" && (
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Write New Prescription
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prescriptionsList.map(prescription => (
            <Card key={prescription.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {prescription.medication}
                </CardTitle>
                <CardDescription>{prescription.dosage}, {prescription.frequency}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-sm font-medium">Start Date:</div>
                    <div className="text-sm">{prescription.startDate}</div>
                    
                    <div className="text-sm font-medium">End Date:</div>
                    <div className="text-sm">{prescription.endDate}</div>
                    
                    <div className="text-sm font-medium">Prescribed by:</div>
                    <div className="text-sm">{prescription.doctor}</div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="text-sm font-medium mb-1">Notes:</div>
                    <div className="text-sm">{prescription.notes}</div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={() => handleViewPrescription(prescription.id)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {prescriptionsList.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Prescriptions</h3>
              <p className="text-muted-foreground text-center mt-1">
                You don't have any prescriptions yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Prescriptions;

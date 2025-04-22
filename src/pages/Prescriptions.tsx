
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { mockPrescriptions } from "@/utils/mockData";
import { Badge } from "@/components/ui/badge";

const Prescriptions = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );

  const handleViewPrescription = (id: number) => {
    toast({
      title: "Prescription details",
      description: `Viewing prescription ID: ${id}`,
    });
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
          {mockPrescriptions.map(prescription => (
            <Card key={prescription.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {prescription.medication}
                  </div>
                  <Badge 
                    variant={
                      prescription.status === 'active' 
                        ? 'default' 
                        : prescription.status === 'completed' 
                          ? 'secondary' 
                          : 'destructive'
                    }
                  >
                    {prescription.status}
                  </Badge>
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
      </div>
    </Layout>
  );
};

export default Prescriptions;

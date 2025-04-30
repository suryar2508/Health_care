import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Pill, User } from "lucide-react";

export default function Prescriptions() {
  const prescriptions = {
    active: [
      {
        id: 1,
        medication: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        startDate: "2024-03-01",
        endDate: "2024-06-01",
        prescribedBy: "Dr. Sarah Johnson",
        instructions: "Take with food in the morning",
        refills: 2
      },
      {
        id: 2,
        medication: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        startDate: "2024-02-15",
        endDate: "2024-05-15",
        prescribedBy: "Dr. Michael Chen",
        instructions: "Take with meals",
        refills: 1
      }
    ],
    past: [
      {
        id: 3,
        medication: "Amoxicillin",
        dosage: "500mg",
        frequency: "Three times daily",
        startDate: "2024-01-10",
        endDate: "2024-01-24",
        prescribedBy: "Dr. Emily Brown",
        instructions: "Take with water",
        refills: 0
      }
    ]
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <Button>Request Refill</Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {prescriptions.active.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <CardTitle>{prescription.medication}</CardTitle>
                <CardDescription>{prescription.dosage}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <span>Frequency: {prescription.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start Date: {prescription.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>End Date: {prescription.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Prescribed by: {prescription.prescribedBy}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Instructions: {prescription.instructions}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Refills remaining: {prescription.refills}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">Request Refill</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {prescriptions.past.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <CardTitle>{prescription.medication}</CardTitle>
                <CardDescription>{prescription.dosage}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    <span>Frequency: {prescription.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Start Date: {prescription.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>End Date: {prescription.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Prescribed by: {prescription.prescribedBy}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Instructions: {prescription.instructions}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

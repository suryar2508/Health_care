
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, RefreshCcw, Clock } from "lucide-react";
import { mockPrescriptions } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

export const PrescriptionsList = () => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);

  const handleRefill = (id: number) => {
    // In a real app, this would send a request to the backend
    toast({
      title: "Refill requested",
      description: "Your prescription refill request has been submitted.",
    });
    
    // Update the UI to show the refill is in progress
    const updatedPrescriptions = prescriptions.map(p => 
      p.id === id ? { ...p, refillRequested: true } : p
    );
    setPrescriptions(updatedPrescriptions);
  };

  const handleViewDetails = (id: number) => {
    toast({
      title: "Prescription details",
      description: `Viewing prescription ID: ${id}`,
    });
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            Prescriptions
          </div>
        </CardTitle>
        <CardDescription>Your current and past prescriptions</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Prescribed By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p) => {
                const remainingDays = getRemainingDays(p.endDate);
                const isActive = p.status === "active";
                const isRefillable = isActive && remainingDays < 7; // Allow refill requests when less than 7 days remaining
                
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <span className="font-medium text-base">{p.medication}</span>
                    </TableCell>
                    <TableCell>{p.dosage}</TableCell>
                    <TableCell>{p.frequency}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{p.startDate} →</span>
                        <span className="text-sm">{p.endDate}</span>
                        {isActive && remainingDays <= 7 && (
                          <div className="mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-healthcare-warning" />
                            <span className="text-xs text-healthcare-warning">
                              {remainingDays <= 0 
                                ? "Expired" 
                                : `${remainingDays} day${remainingDays === 1 ? "" : "s"} left`}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{p.doctor}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(p.id)}
                        >
                          Details
                        </Button>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRefill(p.id)}
                                  disabled={!isRefillable || p.refillRequested}
                                  className={isRefillable && !p.refillRequested ? "bg-primary/10" : ""}
                                >
                                  <RefreshCcw className="h-4 w-4 mr-1" />
                                  {p.refillRequested ? "Requested" : "Refill"}
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {!isActive 
                                ? "Only active prescriptions can be refilled" 
                                : remainingDays > 7 
                                  ? "Refills available when 7 days or less remain" 
                                  : p.refillRequested 
                                    ? "Refill already requested"
                                    : "Request medication refill"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {prescriptions.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No prescriptions found.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

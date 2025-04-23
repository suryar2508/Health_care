
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
import { FileText } from "lucide-react";
import { mockPrescriptions } from "@/utils/mockData";

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

export const PrescriptionsList = () => (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPrescriptions.map((p) => (
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
                  <span className="block">{p.startDate} →</span>
                  <span className="block">{p.endDate}</span>
                </TableCell>
                <TableCell>
                  <span>{p.doctor}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {mockPrescriptions.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No prescriptions found.</div>
        )}
      </div>
    </CardContent>
  </Card>
);

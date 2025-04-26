
import { Patient } from "@/components/patients/PatientForm";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface CriticalPatientsTableProps {
  patients: Patient[];
  onView: (patientId: number) => void;
  onDelete: (patientId: number) => void;
}

export function CriticalPatientsTable({ patients, onView, onDelete }: CriticalPatientsTableProps) {
  const criticalPatients = patients.filter(patient => {
    const criticalConditions = [
      "heart", "stroke", "cancer", "critical", "emergency", 
      "severe", "hypertension"
    ];
    return criticalConditions.some(cond => 
      patient.condition.toLowerCase().includes(cond)
    );
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {criticalPatients.length > 0 ? (
            criticalPatients.map(patient => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView(patient.id)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(patient.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No critical condition patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

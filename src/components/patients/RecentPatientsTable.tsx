
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

interface RecentPatientsTableProps {
  patients: Patient[];
  onView: (patientId: number) => void;
  onDelete: (patientId: number) => void;
}

export function RecentPatientsTable({ patients, onView, onDelete }: RecentPatientsTableProps) {
  const recentPatients = patients.filter(patient => {
    // Calculate if visit was within the last 7 days
    const visitDate = new Date(patient.lastVisit);
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    return visitDate >= sevenDaysAgo;
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
          {recentPatients.length > 0 ? (
            recentPatients.map(patient => (
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
                No recent patients found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


import { Patient } from "@/components/patients/PatientForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientTable } from "@/components/patients/PatientTable";

interface AllPatientsTabProps {
  patients: Patient[];
  onView: (patientId: number) => void;
  onDelete: (patientId: number) => void;
}

export function AllPatientsTab({ patients, onView, onDelete }: AllPatientsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient List</CardTitle>
        <CardDescription>
          Manage your patient records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PatientTable 
          patients={patients}
          onView={onView}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}

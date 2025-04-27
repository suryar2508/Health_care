
import { Patient } from "@/components/patients/PatientForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CriticalPatientsTable } from "@/components/patients/CriticalPatientsTable";

interface CriticalConditionsTabProps {
  patients: Patient[];
  onView: (patientId: number) => void;
  onDelete: (patientId: number) => void;
}

export function CriticalConditionsTab({ patients, onView, onDelete }: CriticalConditionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Conditions</CardTitle>
        <CardDescription>
          Patients requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CriticalPatientsTable
          patients={patients}
          onView={onView}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}

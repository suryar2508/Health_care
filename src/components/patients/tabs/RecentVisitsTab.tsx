
import { Patient } from "@/components/patients/PatientForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentPatientsTable } from "@/components/patients/RecentPatientsTable";

interface RecentVisitsTabProps {
  patients: Patient[];
  onView: (patientId: number) => void;
  onDelete: (patientId: number) => void;
}

export function RecentVisitsTab({ patients, onView, onDelete }: RecentVisitsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patient Visits</CardTitle>
        <CardDescription>
          Patients who visited in the last 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentPatientsTable
          patients={patients}
          onView={onView}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}

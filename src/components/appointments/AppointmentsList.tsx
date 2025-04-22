import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock data for appointments (we'll keep using the same data structure)
const mockAppointments = [
  {
    id: 1,
    patientName: "John Doe",
    doctorName: "Dr. Sarah Smith",
    date: "2025-04-22",
    time: "10:00 AM",
    status: "scheduled",
    type: "Regular Checkup",
  },
  {
    id: 2,
    patientName: "Emma Wilson",
    doctorName: "Dr. James Brown",
    date: "2025-04-22",
    time: "11:30 AM",
    status: "scheduled",
    type: "Blood Test",
  },
  {
    id: 3,
    patientName: "Michael Johnson",
    doctorName: "Dr. Sarah Smith",
    date: "2025-04-23",
    time: "09:15 AM",
    status: "scheduled",
    type: "Follow-up",
  },
  {
    id: 4,
    patientName: "Sophia Martinez",
    doctorName: "Dr. James Brown",
    date: "2025-04-24",
    time: "02:00 PM",
    status: "scheduled",
    type: "Consultation",
  },
  {
    id: 5,
    patientName: "Robert Brown",
    doctorName: "Dr. Sarah Smith",
    date: "2025-04-25",
    time: "03:30 PM",
    status: "scheduled",
    type: "Prescription Renewal",
  },
];

type AppointmentsListProps = {
  isDoctor?: boolean;
};

export function AppointmentsList({ isDoctor = false }: AppointmentsListProps) {
  const { toast } = useToast();

  const cancelAppointment = (id: number) => {
    toast({
      title: "Appointment cancelled",
      description: "The appointment has been cancelled successfully",
    });
  };

  const rescheduleAppointment = (id: number) => {
    toast({
      title: "Reschedule requested",
      description: "Please select a new date and time",
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{isDoctor ? "Patient" : "Doctor"}</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {isDoctor ? appointment.patientName : appointment.doctorName}
                </TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {appointment.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    {appointment.time}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rescheduleAppointment(appointment.id)}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => cancelAppointment(appointment.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

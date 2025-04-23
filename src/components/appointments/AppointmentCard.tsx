
import { Calendar, Clock, Edit, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/utils/mockData"; // Import type

type AppointmentCardProps = {
  appointment: Appointment;
  isDoctor?: boolean;
  onReschedule?: (id: number) => void;
  onCancel?: (id: number) => void;
  hideActions?: boolean;
};

export function AppointmentCard({
  appointment,
  isDoctor = false,
  onReschedule,
  onCancel,
  hideActions = false,
}: AppointmentCardProps) {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-md shadow-md bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-lg">
            {isDoctor ? appointment.patientId : appointment.doctorName}
          </h4>
          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
          <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
            ${appointment.status === "scheduled"
              ? "bg-primary/10 text-primary"
              : appointment.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-destructive/10 text-destructive"
            }`}>
            {appointment.status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{appointment.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{appointment.time}</span>
          </div>
        </div>
      </div>
      {!hideActions && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReschedule && onReschedule(appointment.id)}
          >
            <Pencil className="w-4 h-4 mr-1" /> Reschedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onCancel && onCancel(appointment.id)}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

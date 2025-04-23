
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AppointmentCard } from "./AppointmentCard";
import { mockAppointments } from "@/utils/mockData";

type UpcomingAppointmentsProps = {
  isDoctor?: boolean;
  limit?: number;
};

export function UpcomingAppointments({ isDoctor = false, limit = 3 }: UpcomingAppointmentsProps) {
  const { toast } = useToast();
  const appointments = mockAppointments.slice(0, limit);

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
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isDoctor={isDoctor}
            onReschedule={rescheduleAppointment}
            onCancel={cancelAppointment}
            hideActions={limit < 4}
          />
        ))
      ) : (
        <p className="text-center text-muted-foreground py-4">
          No upcoming appointments
        </p>
      )}
      {appointments.length > 0 && (
        <div className="text-center">
          <Button variant="ghost">View All Appointments</Button>
        </div>
      )}
    </div>
  );
}

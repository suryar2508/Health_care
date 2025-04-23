
import { AppointmentCard } from "./AppointmentCard";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments } from "@/utils/mockData";

type AppointmentsListProps = {
  isDoctor?: boolean;
  filterStatus?: 'scheduled' | 'completed' | 'cancelled' | 'all';
};

export function AppointmentsList({ 
  isDoctor = false, 
  filterStatus = 'all'
}: AppointmentsListProps) {
  const { toast } = useToast();

  // Filter appointments based on the status
  const filteredAppointments = filterStatus === 'all' 
    ? mockAppointments 
    : mockAppointments.filter(app => app.status === filterStatus);

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
    <div className="flex flex-col gap-4">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            isDoctor={isDoctor}
            onReschedule={rescheduleAppointment}
            onCancel={cancelAppointment}
          />
        ))
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          No appointments found.
        </p>
      )}
    </div>
  );
}

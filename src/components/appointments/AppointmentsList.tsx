
import { AppointmentCard } from "./AppointmentCard";
import { useToast } from "@/hooks/use-toast";
import { mockAppointments } from "@/utils/mockData";

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
    <div className="flex flex-col gap-4">
      {mockAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          isDoctor={isDoctor}
          onReschedule={rescheduleAppointment}
          onCancel={cancelAppointment}
        />
      ))}
    </div>
  );
}

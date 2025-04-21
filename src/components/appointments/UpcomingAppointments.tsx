
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for appointments
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
          <div
            key={appointment.id}
            className="flex flex-col space-y-3 p-4 border rounded-md"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">
                  {isDoctor ? appointment.patientName : appointment.doctorName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {appointment.type}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
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
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => rescheduleAppointment(appointment.id)}>
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive" onClick={() => cancelAppointment(appointment.id)}>
                Cancel
              </Button>
            </div>
          </div>
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

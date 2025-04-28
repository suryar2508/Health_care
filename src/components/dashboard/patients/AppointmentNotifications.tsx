import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { format, addMinutes, isBefore, isToday } from 'date-fns';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Appointment } from '@/types/patient';

interface AppointmentNotificationsProps {
  appointments: Appointment[];
  onDismissNotification: (appointmentId: string) => void;
  onSnoozeNotification: (appointmentId: string, duration: number) => void;
}

export const AppointmentNotifications: React.FC<AppointmentNotificationsProps> = ({
  appointments,
  onDismissNotification,
  onSnoozeNotification,
}) => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Filter upcoming appointments that have reminders enabled
    const upcoming = appointments.filter(appointment => {
      if (!appointment.reminderEnabled) return false;
      
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
      
      // Check if appointment is today or in the future
      return (isToday(appointmentDateTime) || isBefore(now, appointmentDateTime)) &&
             appointment.status === 'scheduled';
    });

    setUpcomingAppointments(upcoming);

    // Set up notifications for upcoming appointments
    upcoming.forEach(appointment => {
      const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
      
      // Calculate time until appointment
      const timeUntilAppointment = appointmentDateTime.getTime() - now.getTime();
      
      // Set notifications at different intervals
      if (timeUntilAppointment > 0) {
        // 24 hours before
        if (timeUntilAppointment <= 24 * 60 * 60 * 1000) {
          showNotification(appointment, '24 hours');
        }
        
        // 1 hour before
        if (timeUntilAppointment <= 60 * 60 * 1000) {
          showNotification(appointment, '1 hour');
        }
        
        // 30 minutes before
        if (timeUntilAppointment <= 30 * 60 * 1000) {
          showNotification(appointment, '30 minutes');
        }
        
        // 15 minutes before
        if (timeUntilAppointment <= 15 * 60 * 1000) {
          showNotification(appointment, '15 minutes');
        }
      }
    });
  }, [appointments]);

  const showNotification = (appointment: Appointment, timeFrame: string) => {
    toast(
      <div className="flex flex-col gap-2">
        <div className="font-semibold">
          Upcoming Appointment {timeFrame} from now
        </div>
        <div className="text-sm">
          With Dr. {appointment.doctor} at {appointment.time}
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSnoozeNotification(appointment.id, 5)}
          >
            Snooze 5m
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSnoozeNotification(appointment.id, 15)}
          >
            Snooze 15m
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onDismissNotification(appointment.id)}
          >
            Dismiss
          </Button>
        </div>
      </div>,
      {
        duration: 0, // Persist until dismissed
        icon: <Bell className="h-5 w-5" />,
      }
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Appointment Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No upcoming appointment reminders
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
                const timeUntil = appointmentDateTime.getTime() - new Date().getTime();
                const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));
                const minutesUntil = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

                return (
                  <Card key={appointment.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {format(appointmentDateTime, 'MMMM d, yyyy')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <span>
                              In {hoursUntil > 0 ? `${hoursUntil}h ` : ''}
                              {minutesUntil}m
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className="bg-primary/10">
                            Dr. {appointment.doctor}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onSnoozeNotification(appointment.id, 5)}
                            >
                              Snooze
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => onDismissNotification(appointment.id)}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}; 
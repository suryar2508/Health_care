import React, { useState } from 'react';
import { format, parseISO, isBefore, isAfter, addMinutes } from 'date-fns';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Appointment } from '@/types/patient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AppointmentReschedulerProps {
  appointment: Appointment;
  existingAppointments: Appointment[];
  onReschedule: (newDate: string, newTime: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const AppointmentRescheduler: React.FC<AppointmentReschedulerProps> = ({
  appointment,
  existingAppointments,
  onReschedule,
  onCancel,
  isLoading = false
}) => {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [error, setError] = useState<string | null>(null);

  const checkForConflicts = (date: string, time: string): boolean => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const appointmentEndTime = addMinutes(appointmentDateTime, parseInt(appointment.duration || '30'));

    return existingAppointments.some(existing => {
      if (existing.id === appointment.id) return false;

      const existingDateTime = new Date(`${existing.date}T${existing.time}`);
      const existingEndTime = addMinutes(existingDateTime, parseInt(existing.duration || '30'));

      return (
        (appointmentDateTime >= existingDateTime && appointmentDateTime < existingEndTime) ||
        (appointmentEndTime > existingDateTime && appointmentEndTime <= existingEndTime) ||
        (appointmentDateTime <= existingDateTime && appointmentEndTime >= existingEndTime)
      );
    });
  };

  const validateDateTime = (date: string, time: string): boolean => {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (isBefore(selectedDateTime, now)) {
      setError('Cannot schedule appointments in the past');
      return false;
    }

    if (checkForConflicts(date, time)) {
      setError('This time slot conflicts with another appointment');
      return false;
    }

    setError(null);
    return true;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setNewDate(date);
    validateDateTime(date, newTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setNewTime(time);
    validateDateTime(newDate, time);
  };

  const handleSubmit = () => {
    if (validateDateTime(newDate, newTime)) {
      onReschedule(newDate, newTime);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Reschedule Appointment</h3>
        <p className="text-sm text-muted-foreground">
          Current appointment: {format(parseISO(appointment.date), 'PPP')} at {appointment.time}
        </p>
        {appointment.doctor && (
          <p className="text-sm text-muted-foreground">
            Doctor: {appointment.doctor.name} ({appointment.doctor.specialization})
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">New Date</Label>
            <Input
              id="date"
              type="date"
              value={newDate}
              onChange={handleDateChange}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">New Time</Label>
            <Input
              id="time"
              type="time"
              value={newTime}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || !!error}>
          {isLoading ? 'Rescheduling...' : 'Reschedule'}
        </Button>
      </DialogFooter>
    </div>
  );
}; 
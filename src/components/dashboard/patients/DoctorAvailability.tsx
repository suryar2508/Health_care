import React, { useState } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  appointmentId?: string;
}

interface DoctorAvailabilityProps {
  doctorId: string;
  doctorName: string;
  availability: {
    date: string;
    slots: TimeSlot[];
  }[];
  onSlotSelect: (date: string, slot: TimeSlot) => void;
}

export const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({
  doctorId,
  doctorName,
  availability,
  onSlotSelect
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAvailabilityForDate = (date: Date) => {
    return availability.find(a => isSameDay(parseISO(a.date), date));
  };

  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (!slot.isAvailable) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />
          Booked
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dr. {doctorName}'s Availability
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'day' | 'week')}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'day' ? -1 : -7))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(addDays(selectedDate, viewMode === 'day' ? 1 : 7))}
            >
              Next
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'day' ? (
          <div className="space-y-4">
            <div className="text-lg font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getAvailabilityForDate(selectedDate)?.slots.map((slot, index) => (
                <Card key={index} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {formatTime(slot.start)} - {formatTime(slot.end)}
                      </span>
                    </div>
                    {getSlotStatus(slot)}
                  </div>
                  {slot.isAvailable && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => onSlotSelect(format(selectedDate, 'yyyy-MM-dd'), slot)}
                    >
                      Book Slot
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <Card key={day.toString()} className="p-2">
                  <div className="text-center font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {format(day, 'MMM d')}
                  </div>
                  <div className="mt-2 space-y-1">
                    {getAvailabilityForDate(day)?.slots
                      .filter(slot => slot.isAvailable)
                      .slice(0, 3)
                      .map((slot, index) => (
                        <div
                          key={index}
                          className="text-xs text-center p-1 bg-green-50 text-green-700 rounded"
                        >
                          {formatTime(slot.start)}
                        </div>
                      ))}
                    {getAvailabilityForDate(day)?.slots.filter(slot => slot.isAvailable).length > 3 && (
                      <div className="text-xs text-center text-muted-foreground">
                        +{getAvailabilityForDate(day)!.slots.filter(slot => slot.isAvailable).length - 3} more
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
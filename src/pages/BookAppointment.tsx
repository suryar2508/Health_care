import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Search,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays, isToday, isTomorrow } from "date-fns";
import { cn } from "@/lib/utils";
import api from '@/services/api';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  patients: number;
  schedule: {
    [key: string]: string;
  };
  availability: {
    [key: string]: string[];
  };
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [appointmentType, setAppointmentType] = useState<'checkup' | 'consultation' | 'follow-up' | 'emergency'>('checkup');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDoctor) return;
    
    try {
      const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase();
      const availableSlots = selectedDoctor.availability[dayOfWeek] || [];
      
      const slots = availableSlots.map(time => ({
        time,
        isAvailable: true // In a real app, you'd check if the slot is already booked
      }));
      
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    try {
      await api.createAppointment({
        doctorId: selectedDoctor.id,
        date: selectedDate.toISOString(),
        time: selectedTime,
        type: appointmentType,
        notes,
      });
      
      setIsBookingDialogOpen(false);
      navigate('/appointments');
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || 
                                doctor.specialization.toLowerCase() === specializationFilter.toLowerCase();
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book an Appointment</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Doctor Selection Section */}
        <div className="md:col-span-3">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specializations</SelectItem>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doctor) => (
              <Card 
                key={doctor.id}
                className={cn(
                  "cursor-pointer transition-all",
                  selectedDoctor?.id === doctor.id && "border-primary"
                )}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm">{doctor.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Stethoscope className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doctor.patients} patients
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doctor.schedule.monday} - {doctor.schedule.friday}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Booking Section */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDoctor ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Select Date</h3>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Available Time Slots</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedTime(slot.time)}
                          className="w-full"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Appointment Type</h3>
                    <Select
                      value={appointmentType}
                      onValueChange={(value) => setAppointmentType(value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Checkup</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Notes</h3>
                    <Input
                      placeholder="Any specific concerns or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => setIsBookingDialogOpen(true)}
                    disabled={!selectedTime}
                  >
                    Book Appointment
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Select a doctor to schedule an appointment
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription>
              Please review your appointment details before confirming.
            </DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Doctor</h4>
                <p>{selectedDoctor.name} - {selectedDoctor.specialization}</p>
              </div>
              <div>
                <h4 className="font-medium">Date & Time</h4>
                <p>{format(selectedDate, 'PPP')} at {selectedTime}</p>
              </div>
              <div>
                <h4 className="font-medium">Type</h4>
                <p className="capitalize">{appointmentType}</p>
              </div>
              {notes && (
                <div>
                  <h4 className="font-medium">Notes</h4>
                  <p>{notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookAppointment; 
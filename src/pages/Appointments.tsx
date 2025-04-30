import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Loader2,
  Users,
  CalendarDays,
  CheckSquare,
  RefreshCw,
  Send,
  FileText,
  Bell,
  BellOff,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  XCircle2,
  History,
  FileUp,
  Paperclip
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/components/ui/use-toast";
import api from '@/services/api';
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AppointmentHistory {
  id: string;
  appointmentId: string;
  action: 'created' | 'updated' | 'confirmed' | 'cancelled' | 'rescheduled';
  timestamp: string;
  userId: string;
  changes: Record<string, any>;
}

interface AppointmentNote {
  id: string;
  appointmentId: string;
  content: string;
  attachments: string[];
  createdAt: string;
  createdBy: string;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'checkup' | 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminder?: boolean;
  confirmed?: boolean;
  history?: AppointmentHistory[];
  appointmentNotes?: AppointmentNote[];
  patient: {
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialization: string;
  };
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AppointmentStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isSendMessageDialogOpen, setIsSendMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [quickFilters, setQuickFilters] = useState({
    today: false,
    tomorrow: false,
    thisWeek: false,
    past: false
  });
  const [selectedTab, setSelectedTab] = useState('details');
  const [noteContent, setNoteContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Form state for new appointment
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    date: new Date(),
    time: '',
    type: 'checkup' as const,
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.getAppointments();
      setAppointments(response.data);
      setError(null);
      calculateStats(response.data);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.getDoctors();
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.getPatients();
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const calculateStats = (appointments: Appointment[]) => {
    const today = new Date();
    const stats = {
      total: appointments.length,
      today: appointments.filter(a => isToday(new Date(a.date))).length,
      upcoming: appointments.filter(a => 
        new Date(a.date) > today && 
        a.status === 'scheduled'
      ).length,
      completed: appointments.filter(a => a.status === 'completed').length
    };
    setStats(stats);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.patientId) errors.patientId = 'Patient is required';
    if (!formData.doctorId) errors.doctorId = 'Doctor is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.type) errors.type = 'Type is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAppointment = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await api.createAppointment(formData);
      setAppointments(prev => [...prev, response.data]);
      calculateStats([...appointments, response.data]);
      setIsAddDialogOpen(false);
      toast({
        title: 'Appointment Created',
        description: 'The appointment has been successfully created.',
      });
      resetForm();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create appointment. Please try again.',
        variant: 'destructive',
      });
      console.error('Error creating appointment:', err);
    }
  };

  const handleUpdateAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const response = await api.updateAppointmentStatus(selectedAppointment.id, selectedAppointment.status);
      setAppointments(prev => 
        prev.map(app => app.id === selectedAppointment.id ? response.data : app)
      );
      calculateStats(appointments.map(app => app.id === selectedAppointment.id ? response.data : app));
      setIsEditDialogOpen(false);
      toast({
        title: 'Appointment Updated',
        description: 'The appointment has been successfully updated.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update appointment. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating appointment:', err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      await api.updateAppointmentStatus(id, 'cancelled');
      setAppointments(prev => prev.filter(app => app.id !== id));
      toast({
        title: 'Appointment Cancelled',
        description: 'The appointment has been successfully cancelled.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment. Please try again.',
        variant: 'destructive',
      });
      console.error('Error cancelling appointment:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      date: new Date(),
      time: '',
      type: 'checkup',
      notes: '',
    });
  };

  const handleToggleReminder = async (id: string, currentStatus: boolean) => {
    try {
      const response = await api.updateAppointmentReminder(id, !currentStatus);
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, reminder: !currentStatus } : app)
      );
      toast({
        title: currentStatus ? 'Reminder Disabled' : 'Reminder Enabled',
        description: `Appointment reminder has been ${currentStatus ? 'disabled' : 'enabled'}.`,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update reminder status.',
        variant: 'destructive',
      });
      console.error('Error updating reminder:', err);
    }
  };

  const handleSendMessage = async (appointment: Appointment) => {
    try {
      await api.sendAppointmentMessage(appointment.id, messageContent);
      setIsSendMessageDialogOpen(false);
      setMessageContent('');
      toast({
        title: 'Message Sent',
        description: 'The message has been sent successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
      console.error('Error sending message:', err);
    }
  };

  const handleQuickFilter = (filter: keyof typeof quickFilters) => {
    setQuickFilters(prev => {
      const newFilters = { ...prev, [filter]: !prev[filter] };
      if (newFilters[filter]) {
        // Apply the selected filter
        const today = new Date();
        switch (filter) {
          case 'today':
            setDateFilter(today);
            break;
          case 'tomorrow':
            setDateFilter(addDays(today, 1));
            break;
          case 'thisWeek':
            // Logic for this week filter
            break;
          case 'past':
            // Logic for past appointments filter
            break;
        }
      } else {
        // Clear the filter
        setDateFilter(undefined);
      }
      return newFilters;
    });
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      const response = await api.confirmAppointment(id);
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, confirmed: true } : app)
      );
      toast({
        title: 'Appointment Confirmed',
        description: 'The appointment has been confirmed.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to confirm appointment.',
        variant: 'destructive',
      });
      console.error('Error confirming appointment:', err);
    }
  };

  const handleAddNote = async (appointmentId: string) => {
    try {
      const formData = new FormData();
      formData.append('content', noteContent);
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const response = await api.addAppointmentNote(appointmentId, formData);
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? { 
          ...app, 
          appointmentNotes: [...(app.appointmentNotes || []), response.data] 
        } : app)
      );
      setNoteContent('');
      setAttachments([]);
      toast({
        title: 'Note Added',
        description: 'The note has been added successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to add note.',
        variant: 'destructive',
      });
      console.error('Error adding note:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = dateFilter ? new Date(appointment.date).toDateString() === dateFilter.toDateString() : true;
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    
    // Apply quick filters
    const today = new Date();
    const appointmentDate = new Date(appointment.date);
    const matchesQuickFilters = 
      (!quickFilters.today || isToday(appointmentDate)) &&
      (!quickFilters.tomorrow || isTomorrow(appointmentDate)) &&
      (!quickFilters.thisWeek || (appointmentDate > today && appointmentDate <= addDays(today, 7))) &&
      (!quickFilters.past || appointmentDate < today);

    return matchesSearch && matchesDate && matchesStatus && matchesType && matchesQuickFilters;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchAppointments()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Appointment
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={quickFilters.today ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter('today')}
        >
          <CalendarCheck className="h-4 w-4 mr-2" />
          Today
        </Button>
        <Button
          variant={quickFilters.tomorrow ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter('tomorrow')}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Tomorrow
        </Button>
        <Button
          variant={quickFilters.thisWeek ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter('thisWeek')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          This Week
        </Button>
        <Button
          variant={quickFilters.past ? "default" : "outline"}
          size="sm"
          onClick={() => handleQuickFilter('past')}
        >
          <CalendarX className="h-4 w-4 mr-2" />
          Past
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.today} today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled appointments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Past appointments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">
              Appointments today
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <CalendarComponent
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                className="w-[200px]"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(new Date(appointment.date), 'PPP')}
                      <ClockIcon className="h-4 w-4 ml-2" />
                      {appointment.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{appointment.patient.name}</span>
                      <span className="text-sm text-muted-foreground">{appointment.patient.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{appointment.doctor.name}</span>
                      <span className="text-sm text-muted-foreground">{appointment.doctor.specialization}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{appointment.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'capitalize',
                        appointment.status === 'scheduled' && 'bg-blue-50 text-blue-700 border-blue-200',
                        appointment.status === 'completed' && 'bg-green-50 text-green-700 border-green-200',
                        appointment.status === 'cancelled' && 'bg-red-50 text-red-700 border-red-200',
                        appointment.status === 'no-show' && 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      )}
                    >
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleReminder(appointment.id, appointment.reminder || false)}>
                          {appointment.reminder ? (
                            <>
                              <BellOff className="mr-2 h-4 w-4" />
                              Disable Reminder
                            </>
                          ) : (
                            <>
                              <Bell className="mr-2 h-4 w-4" />
                              Enable Reminder
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsSendMessageDialogOpen(true);
                        }}>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteAppointment(appointment.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Appointment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment for a patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="patient" className="text-right">
                Patient
              </label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.patientId && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">{formErrors.patientId}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="doctor" className="text-right">
                Doctor
              </label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="date" className="text-right">
                Date
              </label>
              <CalendarComponent
                mode="single"
                selected={formData.date}
                onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="time" className="text-right">
                Time
              </label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="type" className="text-right">
                Type
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as typeof formData.type }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Checkup</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="notes" className="text-right">
                Notes
              </label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAppointment}>
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View and manage appointment details.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="date" className="text-right">
                      Date
                    </label>
                    <CalendarComponent
                      mode="single"
                      selected={new Date(selectedAppointment.date)}
                      onSelect={(date) => setSelectedAppointment(prev => prev ? { ...prev, date: date?.toISOString() || '' } : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="time" className="text-right">
                      Time
                    </label>
                    <Input
                      id="time"
                      type="time"
                      value={selectedAppointment.time}
                      onChange={(e) => setSelectedAppointment(prev => prev ? { ...prev, time: e.target.value } : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right">
                      Type
                    </label>
                    <Select
                      value={selectedAppointment.type}
                      onValueChange={(value) => setSelectedAppointment(prev => prev ? { ...prev, type: value as typeof prev.type } : null)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkup">Checkup</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right">
                      Status
                    </label>
                    <Select
                      value={selectedAppointment.status}
                      onValueChange={(value) => setSelectedAppointment(prev => prev ? { ...prev, status: value as typeof prev.status } : null)}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="notes" className="text-right">
                      Notes
                    </label>
                    <Input
                      id="notes"
                      value={selectedAppointment.notes || ''}
                      onChange={(e) => setSelectedAppointment(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    {!selectedAppointment.confirmed && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleConfirmAppointment(selectedAppointment.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Confirm Appointment
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                    >
                      <XCircle2 className="mr-2 h-4 w-4" />
                      Cancel Appointment
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add a note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-primary"
                      >
                        <Paperclip className="h-4 w-4" />
                        Attach Files
                      </label>
                      {attachments.length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {attachments.length} file(s) selected
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddNote(selectedAppointment.id)}
                      disabled={!noteContent.trim()}
                    >
                      Add Note
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {selectedAppointment.appointmentNotes?.map((note) => (
                      <Card key={note.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(note.createdAt), 'PPP p')}
                            </div>
                            <div className="text-sm font-medium">
                              {note.createdBy}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{note.content}</p>
                          {note.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {note.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <FileUp className="h-4 w-4" />
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className="space-y-4">
                  {selectedAppointment.history?.map((entry) => (
                    <Card key={entry.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">
                            {entry.action.charAt(0).toUpperCase() + entry.action.slice(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(entry.timestamp), 'PPP p')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Object.entries(entry.changes).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <span className="font-medium">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={isSendMessageDialogOpen} onOpenChange={setIsSendMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to the patient about their appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="message" className="text-right">
                Message
              </label>
              <Input
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="col-span-3"
                placeholder="Enter your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedAppointment && handleSendMessage(selectedAppointment)}
              disabled={!messageContent.trim()}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments; 
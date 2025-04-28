import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore, isToday, parseISO, startOfDay } from 'date-fns';
import { Calendar, Clock, User, FileText, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, CalendarDays, CalendarCheck, CalendarX, CalendarClock, Filter, Search, ChevronDown, ChevronUp, Bell, BellOff, BellRing, BarChart, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Appointment } from '@/types/patient';
import { AppointmentNotifications } from './AppointmentNotifications';
import { AppointmentStats } from './AppointmentStats';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AppointmentExport } from './AppointmentExport';
import { AppointmentCalendar } from './AppointmentCalendar';
import { toast } from '@/components/ui/use-toast';

interface PatientAppointmentsProps {
  patientId: string;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  onUpdateAppointment: (appointmentId: string, appointment: Partial<Appointment>) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  patientId,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: '',
    doctor: '',
    status: 'scheduled',
    notes: '',
    followUpRequired: false,
    followUpDate: '',
    isRecurring: false,
    recurrencePattern: 'weekly',
    reminderEnabled: true,
    reminderTime: '30',
    duration: '30',
    priority: 'normal',
    location: '',
    attachments: [] as string[],
    tags: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [dismissedNotifications, setDismedNotifications] = useState<string[]>([]);
  const [snoozedNotifications, setSnoozedNotifications] = useState<Record<string, Date>>({});

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter by tab
    if (activeTab === 'upcoming' && !isAfter(appointmentDate, today) && !isToday(appointmentDate)) {
      return false;
    }
    if (activeTab === 'past' && !isBefore(appointmentDate, today) && !isToday(appointmentDate)) {
      return false;
    }
    if (activeTab === 'today' && !isToday(appointmentDate)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !appointment.notes?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filterStatus && appointment.status !== filterStatus) {
      return false;
    }
    
    return true;
  });

  // Sort appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = parseISO(a.date);
    const dateB = parseISO(b.date);
    return activeTab === 'upcoming' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.date) {
      errors.date = 'Date is required';
    }
    
    if (!formData.time) {
      errors.time = 'Time is required';
    }
    
    if (!formData.type) {
      errors.type = 'Appointment type is required';
    }
    
    if (!formData.doctor) {
      errors.doctor = 'Doctor is required';
    }
    
    if (formData.followUpRequired && !formData.followUpDate) {
      errors.followUpDate = 'Follow-up date is required when follow-up is needed';
    }
    
    if (formData.isRecurring && !formData.recurrencePattern) {
      errors.recurrencePattern = 'Recurrence pattern is required for recurring appointments';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAppointment = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newAppointment = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onAddAppointment(newAppointment);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: 'Appointment Added',
        description: 'The appointment has been successfully scheduled.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAppointment = () => {
    if (selectedAppointment) {
      onUpdateAppointment(selectedAppointment.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
      toast({
        title: 'Appointment Updated',
        description: 'The appointment has been successfully updated.',
      });
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      onDeleteAppointment(appointmentId);
      toast({
        title: 'Appointment Deleted',
        description: 'The appointment has been successfully deleted.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      type: '',
      doctor: '',
      status: 'scheduled',
      notes: '',
      followUpRequired: false,
      followUpDate: '',
      isRecurring: false,
      recurrencePattern: 'weekly',
      reminderEnabled: true,
      reminderTime: '30',
      duration: '30',
      priority: 'normal',
      location: '',
      attachments: [],
      tags: [],
    });
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      doctor: appointment.doctor,
      status: appointment.status,
      notes: appointment.notes || '',
      followUpRequired: appointment.followUpRequired || false,
      followUpDate: appointment.followUpDate || '',
      isRecurring: false,
      recurrencePattern: 'weekly',
      reminderEnabled: true,
      reminderTime: '30',
    });
    setIsEditDialogOpen(true);
  };

  const handleDateSelect = (date: Date) => {
    setFormData(prev => ({
      ...prev,
      date: format(date, 'yyyy-MM-dd'),
    }));
    setIsAddDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <CalendarClock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CalendarCheck className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <CalendarX className="h-4 w-4 text-red-500" />;
      case 'no-show':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup':
        return <Stethoscope className="h-4 w-4 text-blue-500" />;
      case 'followup':
        return <CalendarCheck className="h-4 w-4 text-green-500" />;
      case 'consultation':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'emergency':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getReminderIcon = (enabled: boolean) => {
    return enabled ? 
      <BellRing className="h-4 w-4 text-blue-500" /> : 
      <BellOff className="h-4 w-4 text-gray-400" />;
  };

  const toggleReminder = (appointmentId: string, currentValue: boolean) => {
    onUpdateAppointment(appointmentId, { reminderEnabled: !currentValue });
  };

  const handleDismissNotification = (appointmentId: string) => {
    setDismedNotifications(prev => [...prev, appointmentId]);
  };

  const handleSnoozeNotification = (appointmentId: string, duration: number) => {
    const snoozeUntil = new Date();
    snoozeUntil.setMinutes(snoozeUntil.getMinutes() + duration);
    setSnoozedNotifications(prev => ({
      ...prev,
      [appointmentId]: snoozeUntil
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Appointments</h3>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'calendar')}>
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Appointment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkup">Regular Checkup</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label htmlFor="isRecurring">Recurring Appointment</Label>
                </div>
                {formData.isRecurring && (
                  <div className="space-y-2">
                    <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                    <Select
                      value={formData.recurrencePattern}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, recurrencePattern: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recurrence pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reminderEnabled"
                    checked={formData.reminderEnabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminderEnabled: checked }))}
                  />
                  <Label htmlFor="reminderEnabled">Enable Reminder</Label>
                </div>
                {formData.reminderEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Reminder Time (minutes before)</Label>
                    <Select
                      value={formData.reminderTime}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, reminderTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>Add Appointment</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{appointment.type}</h3>
                      <Badge variant={getStatusVariant(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(parseISO(appointment.date), 'PPP')}
                      <Clock className="h-4 w-4 ml-2" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Dr. {appointment.doctor}
                    </div>
                    {appointment.notes && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mt-0.5" />
                        <span>{appointment.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <AppointmentCalendar
          appointments={filteredAppointments}
          onAppointmentClick={handleAppointmentClick}
          onDateSelect={handleDateSelect}
        />
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checkup">Regular Checkup</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-doctor">Doctor</Label>
              <Input
                id="edit-doctor"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                placeholder="Doctor's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about the appointment"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-followUpRequired">Follow-up Required</Label>
              <Select
                value={formData.followUpRequired?.toString()}
                onValueChange={(value) => setFormData({ ...formData, followUpRequired: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select if follow-up is required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.followUpRequired && (
              <div className="space-y-2">
                <Label htmlFor="edit-followUpDate">Follow-up Date</Label>
                <Input
                  id="edit-followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-reminderEnabled"
                checked={formData.reminderEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
              />
              <Label htmlFor="edit-reminderEnabled">Enable Reminder</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAppointment}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const getStatusVariant = (status: string): 'default' | 'success' | 'destructive' | 'warning' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'destructive';
    case 'no-show':
      return 'warning';
    default:
      return 'default';
  }
}; 
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Appointment } from '@/types/patient';

interface PatientAppointmentsProps {
  patientId: string;
  appointments: Appointment[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateAppointment: (appointmentId: string, appointment: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
}

export const PatientAppointments: React.FC<PatientAppointmentsProps> = ({
  patientId,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Form states for adding/editing appointments
  const [formData, setFormData] = useState<Partial<Appointment>>({
    date: '',
    time: '',
    type: 'Check-up',
    doctor: '',
    status: 'Scheduled',
    notes: '',
    followUpRequired: false,
    followUpDate: ''
  });

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today && appointment.status === 'Scheduled';
    } else if (activeTab === 'past') {
      return appointmentDate < today || appointment.status !== 'Scheduled';
    }
    return true;
  });

  // Sort appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return activeTab === 'upcoming' 
      ? dateA.getTime() - dateB.getTime() 
      : dateB.getTime() - dateA.getTime();
  });

  const handleAddAppointment = () => {
    if (!formData.date || !formData.time || !formData.type || !formData.doctor) {
      return;
    }

    const newAppointment: Appointment = {
      id: `A${Date.now()}`,
      date: formData.date,
      time: formData.time,
      type: formData.type as 'Check-up' | 'Follow-up' | 'Consultation' | 'Emergency' | 'Procedure',
      doctor: formData.doctor,
      status: formData.status as 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show',
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate
    };

    onAddAppointment(newAppointment);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditAppointment = () => {
    if (!selectedAppointment || !formData.date || !formData.time || !formData.type || !formData.doctor) {
      return;
    }

    const updatedAppointment: Appointment = {
      ...selectedAppointment,
      date: formData.date,
      time: formData.time,
      type: formData.type as 'Check-up' | 'Follow-up' | 'Consultation' | 'Emergency' | 'Procedure',
      doctor: formData.doctor,
      status: formData.status as 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show',
      notes: formData.notes,
      followUpRequired: formData.followUpRequired,
      followUpDate: formData.followUpDate
    };

    onUpdateAppointment(selectedAppointment.id, updatedAppointment);
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    onDeleteAppointment(appointmentId);
  };

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      date: appointment.date,
      time: appointment.time,
      type: appointment.type,
      doctor: appointment.doctor,
      status: appointment.status,
      notes: appointment.notes,
      followUpRequired: appointment.followUpRequired,
      followUpDate: appointment.followUpDate
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      type: 'Check-up',
      doctor: '',
      status: 'Scheduled',
      notes: '',
      followUpRequired: false,
      followUpDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case 'No-show':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">No-show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Check-up':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Follow-up':
        return <AlertCircle className="h-4 w-4 text-green-500" />;
      case 'Consultation':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'Emergency':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'Procedure':
        return <FileText className="h-4 w-4 text-orange-500" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Appointment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Appointment</DialogTitle>
              <DialogDescription>
                Schedule a new appointment for the patient.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="col-span-3"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Time</Label>
                <Input
                  id="time"
                  type="time"
                  className="col-span-3"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">Doctor</Label>
                <Input
                  id="doctor"
                  className="col-span-3"
                  value={formData.doctor}
                  onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="No-show">No-show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  className="col-span-3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followUpRequired" className="text-right">Follow-up</Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="followUpRequired"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="followUpRequired">Follow-up required</Label>
                </div>
              </div>
              {formData.followUpRequired && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="followUpDate" className="text-right">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    className="col-span-3"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAppointment}>Add Appointment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {sortedAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No upcoming appointments scheduled.
              </CardContent>
            </Card>
          ) : (
            sortedAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(appointment.type)}
                      <CardTitle className="text-lg">{appointment.type}</CardTitle>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <CardDescription>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{appointment.doctor}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                {appointment.notes && (
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </CardContent>
                )}
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(appointment)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteAppointment(appointment.id)}>
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {sortedAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No past appointments found.
              </CardContent>
            </Card>
          ) : (
            sortedAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(appointment.type)}
                      <CardTitle className="text-lg">{appointment.type}</CardTitle>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <CardDescription>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(appointment.date), 'EEEE, MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{appointment.doctor}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                {appointment.notes && (
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </CardContent>
                )}
                {appointment.followUpRequired && appointment.followUpDate && (
                  <CardFooter className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Follow-up scheduled for {format(new Date(appointment.followUpDate), 'MMMM d, yyyy')}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(appointment)}>
                      Edit
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>
              Update appointment details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right">Date</Label>
              <Input
                id="edit-date"
                type="date"
                className="col-span-3"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right">Time</Label>
              <Input
                id="edit-time"
                type="time"
                className="col-span-3"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Check-up">Check-up</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Procedure">Procedure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doctor" className="text-right">Doctor</Label>
              <Input
                id="edit-doctor"
                className="col-span-3"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="No-show">No-show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-notes" className="text-right">Notes</Label>
              <Textarea
                id="edit-notes"
                className="col-span-3"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-followUpRequired" className="text-right">Follow-up</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-followUpRequired"
                  checked={formData.followUpRequired}
                  onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="edit-followUpRequired">Follow-up required</Label>
              </div>
            </div>
            {formData.followUpRequired && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-followUpDate" className="text-right">Follow-up Date</Label>
                <Input
                  id="edit-followUpDate"
                  type="date"
                  className="col-span-3"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditAppointment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
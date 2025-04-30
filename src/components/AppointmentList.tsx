import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchAppointments, updateAppointmentStatus } from '../store/slices/appointmentSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  type: 'checkup' | 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  patientName?: string;
  doctorName?: string;
}

const AppointmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, status: 'scheduled' | 'completed' | 'cancelled' | 'no-show') => {
    try {
      await dispatch(updateAppointmentStatus({ id, status }));
      dispatch(fetchAppointments()); // Refresh the list
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? appointment.date === dateFilter : true;
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'no-show':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">No Show</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
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
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="max-w-xs"
          />
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(appointment.date), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {appointment.time}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {appointment.patientName || appointment.patientId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {appointment.doctorName || appointment.doctorId}
                  </div>
                </TableCell>
                <TableCell>{appointment.type}</TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {appointment.status === 'scheduled' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AppointmentList; 
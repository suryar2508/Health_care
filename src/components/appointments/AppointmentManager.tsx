import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAppointments, createAppointment, updateAppointmentStatus } from '../../store/slices/appointmentSlice';
import { Appointment } from '../../store/slices/appointmentSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Table } from '../ui/table';
import { format } from 'date-fns';

export const AppointmentManager: React.FC = () => {
  const dispatch = useDispatch();
  const { appointments, loading, error } = useSelector((state: RootState) => state.appointments);
  
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, '_id'>>({
    patientId: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'checkup',
    status: 'scheduled',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createAppointment(newAppointment));
      setNewAppointment({
        patientId: '',
        doctorId: '',
        date: '',
        time: '',
        type: 'checkup',
        status: 'scheduled',
        notes: '',
      });
    } catch (err) {
      console.error('Failed to create appointment:', err);
    }
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    try {
      await dispatch(updateAppointmentStatus({ id, status }));
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Appointment Management</h2>
      
      {/* Create Appointment Form */}
      <form onSubmit={handleCreateAppointment} className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Schedule New Appointment</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Patient ID"
            value={newAppointment.patientId}
            onChange={(e) => setNewAppointment({ ...newAppointment, patientId: e.target.value })}
            required
          />
          <Input
            label="Doctor ID"
            value={newAppointment.doctorId}
            onChange={(e) => setNewAppointment({ ...newAppointment, doctorId: e.target.value })}
            required
          />
          <Input
            label="Date"
            type="date"
            value={newAppointment.date}
            onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            required
          />
          <Input
            label="Time"
            type="time"
            value={newAppointment.time}
            onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
            required
          />
          <Select
            label="Type"
            value={newAppointment.type}
            onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value as Appointment['type'] })}
            options={[
              { value: 'checkup', label: 'Checkup' },
              { value: 'follow-up', label: 'Follow-up' },
              { value: 'emergency', label: 'Emergency' },
            ]}
          />
          <Input
            label="Notes"
            value={newAppointment.notes}
            onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
          />
        </div>
        <Button type="submit">Schedule Appointment</Button>
      </form>

      {/* Appointments Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table
          columns={[
            { header: 'Patient', accessor: 'patientName' },
            { header: 'Doctor', accessor: 'doctorName' },
            { 
              header: 'Date & Time', 
              accessor: (row: Appointment) => `${format(new Date(row.date), 'MMM dd, yyyy')} at ${row.time}` 
            },
            { header: 'Type', accessor: 'type' },
            { 
              header: 'Status', 
              accessor: (row: Appointment) => (
                <Select
                  value={row.status}
                  onChange={(e) => handleStatusUpdate(row._id, e.target.value as Appointment['status'])}
                  options={[
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'no-show', label: 'No Show' },
                  ]}
                />
              )
            },
            { header: 'Notes', accessor: 'notes' },
          ]}
          data={appointments}
        />
      </div>
    </div>
  );
}; 
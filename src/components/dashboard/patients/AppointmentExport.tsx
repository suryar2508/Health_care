import React from 'react';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Appointment } from '@/types/patient';

interface AppointmentExportProps {
  appointments: Appointment[];
}

export const AppointmentExport: React.FC<AppointmentExportProps> = ({ appointments }) => {
  const [exportFormat, setExportFormat] = React.useState<'csv' | 'ical'>('csv');

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToICal();
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Time',
      'Doctor',
      'Type',
      'Status',
      'Notes',
      'Follow-up Required',
      'Follow-up Date'
    ];

    const rows = appointments.map(appointment => [
      format(new Date(appointment.date), 'yyyy-MM-dd'),
      appointment.time,
      appointment.doctor,
      appointment.type,
      appointment.status,
      appointment.notes || '',
      appointment.followUpRequired ? 'Yes' : 'No',
      appointment.followUpDate ? format(new Date(appointment.followUpDate), 'yyyy-MM-dd') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToICal = () => {
    let icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Smart Vital Guardian//Appointments//EN'
    ];

    appointments.forEach(appointment => {
      const dateStr = appointment.date.replace(/-/g, '');
      const timeStr = appointment.time.replace(/:/g, '') + '00';

      icalContent = [
        ...icalContent,
        'BEGIN:VEVENT',
        `DTSTART:${dateStr}T${timeStr}`,
        `SUMMARY:Appointment with Dr. ${appointment.doctor}`,
        `DESCRIPTION:Type: ${appointment.type}\\nStatus: ${appointment.status}\\nNotes: ${appointment.notes || ''}`,
        'DURATION:PT1H',
        `UID:${appointment.id}@smartvitalguardian.com`,
        'END:VEVENT'
      ];
    });

    icalContent.push('END:VCALENDAR');

    const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `appointments_${format(new Date(), 'yyyy-MM-dd')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Export Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Select value={exportFormat} onValueChange={(value: 'csv' | 'ical') => setExportFormat(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                CSV Spreadsheet
              </div>
            </SelectItem>
            <SelectItem value="ical">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                iCalendar
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardContent>
    </Card>
  );
}; 
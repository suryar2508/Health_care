import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import apiService from '@/services/api';
import Swal from 'sweetalert2';

interface MedicationReminderProps {
  patientId: string;
}

interface Reminder {
  id: string;
  medication: string;
  time: string; // Must be "HH:MM" format (24-hour)
  frequency: string;
  duration: string;
  status: 'active' | 'completed' | 'cancelled';
}

export function MedicationReminder({ patientId }: MedicationReminderProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);

  // Fetch reminders
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await apiService.getMedicationReminders(patientId);
        setReminders(data);
        setLoaded(true);
        console.log('Fetched reminders:', data);
      } catch (error) {
        console.error('Error fetching reminders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch reminders',
          variant: 'destructive',
        });
      }
    };

    fetchReminders();
  }, [patientId]);

  const handleReminderStatus = async (reminderId: string, status: 'completed' | 'cancelled') => {
    try {
      await apiService.updateReminderStatus(reminderId, status);
      setReminders(reminders.map(reminder => 
        reminder.id === reminderId ? { ...reminder, status } : reminder
      ));
      
      Swal.fire({
        title: 'Success!',
        text: `Reminder marked as ${status}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error updating reminder status:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update reminder status',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const showSweetAlertNotification = (reminder: Reminder) => {
    Swal.fire({
      title: `⏰ Time for ${reminder.medication}`,
      html: `
        <div class="text-left">
          <p><strong>Time:</strong> ${reminder.time}</p>
          <p><strong>Frequency:</strong> ${reminder.frequency}</p>
          <p><strong>Duration:</strong> ${reminder.duration}</p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'I took it',
      cancelButtonText: 'I skipped it',
      customClass: {
        confirmButton: 'bg-green-500 hover:bg-green-600 text-white',
        cancelButton: 'bg-red-500 hover:bg-red-600 text-white'
      },
      buttonsStyling: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleReminderStatus(reminder.id, 'completed');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Skipped',
          text: 'Remember to take your medication soon!',
          icon: 'warning',
          timer: 3000
        });
      }
    });
  };

  const checkReminders = () => {
    if (!loaded || reminders.length === 0) return;

    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentDate = now.toDateString();

    console.log(`Checking reminders at ${currentHours}:${currentMinutes}`);

    reminders.forEach(reminder => {
      if (reminder.status !== 'active') return;

      const [reminderHours, reminderMinutes] = reminder.time.split(':').map(Number);
      const reminderKey = `reminder_${reminder.id}_${currentDate}_${reminder.time}`;

      // Check if current time matches reminder time
      if (currentHours === reminderHours && currentMinutes === reminderMinutes) {
        if (!localStorage.getItem(reminderKey)) {
          console.log(`Showing notification for ${reminder.medication}`);
          showSweetAlertNotification(reminder);
          localStorage.setItem(reminderKey, 'true');
          
          // Clear after 24 hours
          setTimeout(() => {
            localStorage.removeItem(reminderKey);
          }, 24 * 60 * 60 * 1000);
        }
      }
    });
  };

  // Setup interval and initial check
  useEffect(() => {
    if (!loaded) return;

    // Check every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Immediate check (in case the component loads at exact reminder time)
    checkReminders();
    
    return () => clearInterval(interval);
  }, [reminders, loaded]);

  // TEST: Force a notification at 16:14 (remove in production)
  useEffect(() => {
    if (loaded && reminders.length > 0) {
      const testTime = "16:14";
      const testReminder = reminders.find(r => r.time === testTime && r.status === 'active');
      
      if (testReminder) {
        console.log('TEST: Simulating reminder for', testTime);
        showSweetAlertNotification(testReminder);
      }
    }
  }, [reminders, loaded]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4 text-green-500" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{reminder.medication}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.frequency}</span>
                      <span>•</span>
                      <span>{reminder.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(reminder.status)}>
                      {getStatusIcon(reminder.status)}
                      <span className="ml-1">{reminder.status}</span>
                    </Badge>
                    {reminder.status === 'active' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReminderStatus(reminder.id, 'completed')}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReminderStatus(reminder.id, 'cancelled')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
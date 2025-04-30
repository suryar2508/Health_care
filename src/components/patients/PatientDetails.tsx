import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Phone, MapPin, Droplet, Activity, FileText, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Patient, HealthMetric } from '@/types/patient';
import { WeeklyHealthMetrics } from '@/components/dashboard/overview/WeeklyHealthMetrics';
import { PatientAppointments } from './PatientAppointments';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
  onAddAppointment?: (appointment: any) => void;
  onUpdateAppointment?: (appointmentId: string, appointment: any) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  onClose,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Generate sample health metrics for the patient
        const generateHealthMetrics = () => {
          const metrics: HealthMetric[] = [];
          const today = new Date();
          
          // Generate 7 days of health metrics
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Generate random values within normal ranges
            const systolic = Math.floor(Math.random() * 20) + 110; // 110-130
            const diastolic = Math.floor(Math.random() * 10) + 70; // 70-80
            const heartRate = Math.floor(Math.random() * 20) + 60; // 60-80
            const bloodOxygen = Math.floor(Math.random() * 3) + 97; // 97-99
            const temperature = (Math.random() * 0.4 + 36.5).toFixed(1); // 36.5-36.9
            
            metrics.push({
              date: date.toISOString(),
              bloodPressure: { systolic, diastolic },
              heartRate,
              bloodOxygen,
              temperature: parseFloat(temperature)
            });
          }
          
          setHealthMetrics(metrics);
        };
        
        generateHealthMetrics();
      } catch (err) {
        setError('Failed to load patient data. Please try again.');
        console.error('Error loading patient data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [patient]);

  // Get the latest health metrics
  const latestMetrics = healthMetrics.length > 0 ? healthMetrics[0] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Patient Data</AlertTitle>
        <AlertDescription>No patient information is available.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{patient.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Date of Birth: {format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')} ({patient.age} years)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>Gender: {patient.gender}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              <span>Blood Group: {patient.bloodGroup}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Phone: {patient.phoneNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Address: {patient.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span>Condition: <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'default'}>{patient.condition}</Badge></span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Last Visit: {patient.lastVisit ? format(new Date(patient.lastVisit), 'MMMM d, yyyy') : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Health Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestMetrics ? (
              <>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Blood Pressure: {latestMetrics.bloodPressure.systolic}/{latestMetrics.bloodPressure.diastolic} mmHg</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Heart Rate: {latestMetrics.heartRate} bpm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Blood Oxygen: {latestMetrics.bloodOxygen}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Temperature: {latestMetrics.temperature}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Recorded: {format(new Date(latestMetrics.date), 'MMMM d, yyyy')}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No health metrics available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical-history">Medical History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyHealthMetrics patientId={patient.id} />
            </CardContent>
          </Card>
          
          {patient.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4">
          <PatientAppointments 
            patientId={patient.id}
            appointments={patient.appointments || []}
            onAddAppointment={onAddAppointment || (() => {})}
            onUpdateAppointment={onUpdateAppointment || (() => {})}
            onDeleteAppointment={onDeleteAppointment || (() => {})}
          />
        </TabsContent>
        
        <TabsContent value="medical-history" className="space-y-4">
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            patient.medicalHistory.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{item.condition}</CardTitle>
                    <Badge variant="outline">{format(new Date(item.date), 'MMMM d, yyyy')}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{item.notes}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                No medical history available.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
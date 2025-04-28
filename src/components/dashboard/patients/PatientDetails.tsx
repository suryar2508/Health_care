import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Calendar, Phone, MapPin, Droplet, Activity, FileText, Clock, Heart, Thermometer, Stethoscope, User, AlertCircle, Plus, Edit, Trash2, Printer, CheckCircle, XCircle, ClipboardList, Pills } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Patient, HealthMetric } from '@/types/patient';
import { WeeklyHealthMetrics } from '@/components/dashboard/overview/WeeklyHealthMetrics';
import { PatientAppointments } from './PatientAppointments';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PatientPrescriptions } from './PatientPrescriptions';

interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
  onAddAppointment?: (appointment: any) => void;
  onUpdateAppointment?: (appointmentId: string, appointment: any) => void;
  onDeleteAppointment?: (appointmentId: string) => void;
  onUpdatePatient: (patientId: string, updatedPatient: Patient) => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patient,
  onClose,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment,
  onUpdatePatient
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
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
  }, [patient]);

  // Get the latest health metrics
  const latestMetrics = healthMetrics.length > 0 ? healthMetrics[0] : null;

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Prepare data for charts
  const chartData = healthMetrics.map(metric => ({
    date: format(new Date(metric.date), 'MM/dd'),
    systolic: metric.bloodPressure.systolic,
    diastolic: metric.bloodPressure.diastolic,
    heartRate: metric.heartRate,
    bloodOxygen: metric.bloodOxygen,
    temperature: metric.temperature
  })).reverse();

  // Calculate health status indicators
  const getBloodPressureStatus = () => {
    if (!latestMetrics) return { status: 'unknown', color: 'bg-gray-500' };
    
    const { systolic, diastolic } = latestMetrics.bloodPressure;
    
    if (systolic < 120 && diastolic < 80) return { status: 'Normal', color: 'bg-green-500' };
    if (systolic < 130 && diastolic < 80) return { status: 'Elevated', color: 'bg-yellow-500' };
    if (systolic < 140 || diastolic < 90) return { status: 'Stage 1 Hypertension', color: 'bg-orange-500' };
    return { status: 'Stage 2 Hypertension', color: 'bg-red-500' };
  };

  const getHeartRateStatus = () => {
    if (!latestMetrics) return { status: 'unknown', color: 'bg-gray-500' };
    
    const { heartRate } = latestMetrics;
    
    if (heartRate < 60) return { status: 'Bradycardia', color: 'bg-blue-500' };
    if (heartRate < 100) return { status: 'Normal', color: 'bg-green-500' };
    if (heartRate < 120) return { status: 'Elevated', color: 'bg-yellow-500' };
    return { status: 'Tachycardia', color: 'bg-red-500' };
  };

  const getBloodOxygenStatus = () => {
    if (!latestMetrics) return { status: 'unknown', color: 'bg-gray-500' };
    
    const { bloodOxygen } = latestMetrics;
    
    if (bloodOxygen >= 95) return { status: 'Normal', color: 'bg-green-500' };
    if (bloodOxygen >= 90) return { status: 'Low', color: 'bg-yellow-500' };
    return { status: 'Critical', color: 'bg-red-500' };
  };

  const getTemperatureStatus = () => {
    if (!latestMetrics) return { status: 'unknown', color: 'bg-gray-500' };
    
    const { temperature } = latestMetrics;
    
    if (temperature < 36.1) return { status: 'Hypothermia', color: 'bg-blue-500' };
    if (temperature < 37.2) return { status: 'Normal', color: 'bg-green-500' };
    if (temperature < 38.3) return { status: 'Elevated', color: 'bg-yellow-500' };
    return { status: 'Fever', color: 'bg-red-500' };
  };

  const bloodPressureStatus = getBloodPressureStatus();
  const heartRateStatus = getHeartRateStatus();
  const bloodOxygenStatus = getBloodOxygenStatus();
  const temperatureStatus = getTemperatureStatus();

  return (
    <div className="space-y-6 p-4 bg-background rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{patient.name}</h2>
          <p className="text-muted-foreground">ID: {patient.id}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date of Birth:</span>
                <span>{format(new Date(patient.dateOfBirth), 'MMMM d, yyyy')} ({calculateAge(patient.dateOfBirth)} years)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Gender:</span>
                <span>{patient.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Blood Group:</span>
                <span>{patient.bloodGroup}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{patient.phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Address:</span>
                <span>{patient.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Condition:</span>
                <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'default'}>{patient.condition}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Last Visit:</span>
                <span>{patient.lastVisit ? format(new Date(patient.lastVisit), 'MMMM d, yyyy') : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Latest Health Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {latestMetrics ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Blood Pressure</span>
                    </div>
                    <Badge variant="outline" className={bloodPressureStatus.color.replace('bg-', 'border-')}>
                      {bloodPressureStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{latestMetrics.bloodPressure.systolic}/{latestMetrics.bloodPressure.diastolic}</span>
                    <span className="text-muted-foreground">mmHg</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <Badge variant="outline" className={heartRateStatus.color.replace('bg-', 'border-')}>
                      {heartRateStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{latestMetrics.heartRate}</span>
                    <span className="text-muted-foreground">bpm</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Blood Oxygen</span>
                    </div>
                    <Badge variant="outline" className={bloodOxygenStatus.color.replace('bg-', 'border-')}>
                      {bloodOxygenStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{latestMetrics.bloodOxygen}</span>
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <Badge variant="outline" className={temperatureStatus.color.replace('bg-', 'border-')}>
                      {temperatureStatus.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{latestMetrics.temperature}</span>
                    <span className="text-muted-foreground">°C</span>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Recorded: {format(new Date(latestMetrics.date), 'MMMM d, yyyy')}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No health metrics available.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Health Trends
              </CardTitle>
              <CardDescription>
                Weekly health metrics visualization
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <WeeklyHealthMetrics patientId={patient.id} />
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Blood Pressure Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#8884d8" name="Systolic" />
                    <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#82ca9d" name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Heart Rate & Blood Oxygen
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#ff7300" name="Heart Rate" />
                    <Line yAxisId="right" type="monotone" dataKey="bloodOxygen" stroke="#00C49F" name="Blood Oxygen" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {patient.notes && (
            <Card className="shadow-md">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p>{patient.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="appointments" className="space-y-4 mt-4">
          <PatientAppointments 
            patientId={patient.id}
            appointments={patient.appointments || []}
            onAddAppointment={onAddAppointment || (() => {})}
            onUpdateAppointment={onUpdateAppointment || (() => {})}
            onDeleteAppointment={onDeleteAppointment || (() => {})}
          />
        </TabsContent>
        
        <TabsContent value="medical" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                  <div className="space-y-4">
                    {patient.medicalHistory.map((item, index) => (
                      <div key={index} className="pl-4 border-l-2">
                        <div className="font-medium">{item.condition}</div>
                        <div className="text-sm text-muted-foreground">
                          Diagnosed: {format(parseISO(item.diagnosisDate), 'PPP')}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medical history available.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pills className="h-5 w-5" />
                  Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PatientPrescriptions
                  patientId={patient.id}
                  prescriptions={patient.prescriptions || []}
                  onAddPrescription={(prescription) => {
                    // Handle adding prescription
                    const updatedPatient = {
                      ...patient,
                      prescriptions: [...(patient.prescriptions || []), prescription],
                    };
                    onUpdatePatient(patient.id, updatedPatient);
                  }}
                  onUpdatePrescription={(id, prescription) => {
                    // Handle updating prescription
                    const updatedPatient = {
                      ...patient,
                      prescriptions: (patient.prescriptions || []).map((p) =>
                        p.id === id ? { ...p, ...prescription } : p
                      ),
                    };
                    onUpdatePatient(patient.id, updatedPatient);
                  }}
                  onDeletePrescription={(id) => {
                    // Handle deleting prescription
                    const updatedPatient = {
                      ...patient,
                      prescriptions: (patient.prescriptions || []).filter((p) => p.id !== id),
                    };
                    onUpdatePatient(patient.id, updatedPatient);
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

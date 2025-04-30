import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Activity, Heart, Bell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { QuickActions } from "@/components/patient/QuickActions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PrescriptionUpload } from "@/components/patient/PrescriptionUpload";
import { PrescriptionManagement } from "@/components/patient/PrescriptionManagement";
import { AICompanion } from "@/components/patient/AICompanion";

export default function PatientDashboard() {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPrescriptionsDialog, setShowPrescriptionsDialog] = useState(false);
  const [showBillsDialog, setShowBillsDialog] = useState(false);
  const [showAICompanionDialog, setShowAICompanionDialog] = useState(false);

  // Mock patient ID - replace with actual patient ID from authentication
  const patientId = "123";

  const recentActivities = [
    {
      id: 1,
      type: "Appointment",
      title: "Follow-up with Dr. Smith",
      date: "2024-03-25",
      time: "10:00 AM",
      status: "Scheduled"
    },
    {
      id: 2,
      type: "Prescription",
      title: "Lisinopril 10mg",
      date: "2024-03-20",
      status: "Active"
    },
    {
      id: 3,
      type: "Health Check",
      title: "Blood Pressure Reading",
      date: "2024-03-19",
      value: "120/80 mmHg"
    }
  ];

  const healthMetrics = [
    {
      id: 1,
      name: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Normal"
    },
    {
      id: 2,
      name: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Normal"
    },
    {
      id: 3,
      name: "Blood Sugar",
      value: "95",
      unit: "mg/dL",
      status: "Normal"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-03-25",
      time: "10:00 AM"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2024-04-01",
      time: "2:30 PM"
    }
  ];

  const handleUploadPrescription = () => {
    setShowUploadDialog(true);
  };

  const handleViewPrescriptions = () => {
    setShowPrescriptionsDialog(true);
  };

  const handleViewBills = () => {
    setShowBillsDialog(true);
  };

  const handleOpenAICompanion = () => {
    setShowAICompanionDialog(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back, John Doe</h1>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Quick Actions */}
      <QuickActions
        patientId={patientId}
        onUploadPrescription={handleUploadPrescription}
        onViewPrescriptions={handleViewPrescriptions}
        onViewBills={handleViewBills}
        onOpenAICompanion={handleOpenAICompanion}
      />

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle className="text-lg">{metric.name}</CardTitle>
              <CardDescription>Last updated: Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value} <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Status: {metric.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Your next scheduled visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{appointment.doctor}</div>
                  <div className="text-sm text-muted-foreground">{appointment.specialty}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{appointment.date}</div>
                  <div className="text-sm text-muted-foreground">{appointment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Your latest health-related activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{activity.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.date} {activity.time && `at ${activity.time}`}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.status || activity.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Prescription</DialogTitle>
          </DialogHeader>
          <PrescriptionUpload
            patientId={patientId}
            onSuccess={() => {
              setShowUploadDialog(false);
              // Refresh prescriptions list
            }}
            onCancel={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showPrescriptionsDialog} onOpenChange={setShowPrescriptionsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Prescriptions</DialogTitle>
          </DialogHeader>
          <PrescriptionManagement patientId={patientId} />
        </DialogContent>
      </Dialog>

      <Dialog open={showBillsDialog} onOpenChange={setShowBillsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Bills</DialogTitle>
          </DialogHeader>
          {/* Add bills content here */}
        </DialogContent>
      </Dialog>

      <Dialog open={showAICompanionDialog} onOpenChange={setShowAICompanionDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>AI Companion</DialogTitle>
          </DialogHeader>
          <AICompanion patientId={patientId} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, FileText, DollarSign, AlertCircle, CheckCircle2, XCircle, Camera, Upload, Clock, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { analyzePrescription } from '@/services/prescriptionAnalysis';
import { PrescriptionData, AnalysisResult } from '@/types/prescription';
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prescriptionMLService } from '@/services/prescriptionML';
import apiService from '@/services/api';

interface PrescriptionUploadProps {
  patientId: string;
  onSuccess: (prescriptionData: PrescriptionData) => void;
  onCancel: () => void;
}

interface MedicationReminder {
  medication: string;
  times: string[];
  frequency: string;
  duration: string;
}

export function PrescriptionUpload({ patientId, onSuccess, onCancel }: PrescriptionUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'analyzing' | 'generating'>('upload');
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'camera'>('file');
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setSelectedFile(selectedFile);
    setIsUploading(true);

    try {
      // Call OCR API
      const formData = new FormData();
      formData.append('prescription', selectedFile);
      formData.append('patientId', patientId);

      const response = await apiService.analyzePrescriptionWithOCR(formData);
      setOcrResult(response.data);
      
      // Extract reminders from OCR result
      const extractedReminders = response.data.medications.map((med: any) => ({
        medication: med.name,
        times: [med.time || '09:00'], // Default time if not specified
        frequency: med.frequency,
        duration: med.duration
      }));
      setReminders(extractedReminders);

      toast({
        title: 'Success',
        description: 'Prescription analyzed successfully',
      });
    } catch (error) {
      console.error('Error analyzing prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze prescription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTimeChange = (medIndex: number, timeIndex: number, time: string) => {
    const updatedReminders = [...reminders];
    updatedReminders[medIndex].times[timeIndex] = time;
    setReminders(updatedReminders);
  };

  const addTimeSlot = (medIndex: number) => {
    const updatedReminders = [...reminders];
    updatedReminders[medIndex].times.push('09:00'); // Default time for new slot
    setReminders(updatedReminders);
  };

  const removeTimeSlot = (medIndex: number, timeIndex: number) => {
    const updatedReminders = [...reminders];
    updatedReminders[medIndex].times.splice(timeIndex, 1);
    setReminders(updatedReminders);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !ocrResult) return;

    setIsUploading(true);
    try {
      // Save prescription with reminders
      const prescriptionData: PrescriptionData = {
        ...ocrResult,
        reminders: reminders.map(reminder => ({
          medication: reminder.medication,
          times: reminder.times,
          frequency: reminder.frequency,
          duration: reminder.duration,
          patientId,
          status: 'active'
        }))
      };

      const response = await apiService.createPrescription(prescriptionData);
      onSuccess(response.data);

      // Set up notifications for each reminder
      await apiService.setupMedicationReminders(patientId, reminders);

      toast({
        title: 'Success',
        description: 'Prescription uploaded and reminders set successfully',
      });
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to save prescription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSeverityColor = (severity: AnalysisResult['details'][0]['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prescription">Upload Prescription</Label>
            <div className="flex items-center gap-4">
              <Input
                id="prescription"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
          </div>

          {ocrResult && (
            <div className="space-y-4">
              <h3 className="font-semibold">Extracted Information</h3>
              <div className="space-y-2">
                <p><strong>Doctor:</strong> {ocrResult.doctorName}</p>
                <p><strong>Date:</strong> {ocrResult.prescriptionDate}</p>
                <p><strong>Medications:</strong></p>
                <ul className="list-disc pl-4">
                  {ocrResult.medications.map((med: any, index: number) => (
                    <li key={index}>
                      {med.name} - {med.dosage} ({med.frequency})
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Set Reminders</h3>
                {reminders.map((reminder, medIndex) => (
                  <div key={medIndex} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{reminder.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          {reminder.frequency} for {reminder.duration}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(medIndex)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {reminder.times.map((time, timeIndex) => (
                        <div key={timeIndex} className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => handleTimeChange(medIndex, timeIndex, e.target.value)}
                            className="w-32"
                          />
                          {reminder.times.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(medIndex, timeIndex)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || !selectedFile || !ocrResult}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
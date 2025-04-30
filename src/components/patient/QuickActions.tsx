import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  AlertCircle,
  DollarSign,
  Brain,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuickActionsProps {
  patientId: string;
  onUploadPrescription: () => void;
  onViewPrescriptions: () => void;
  onViewBills: () => void;
  onOpenAICompanion: () => void;
}

export function QuickActions({
  patientId,
  onUploadPrescription,
  onViewPrescriptions,
  onViewBills,
  onOpenAICompanion,
}: QuickActionsProps) {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={onUploadPrescription}
          >
            <Upload className="h-6 w-6" />
            <span>Upload Prescription</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={onViewPrescriptions}
          >
            <FileText className="h-6 w-6" />
            <span>View Prescriptions</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={onViewBills}
          >
            <DollarSign className="h-6 w-6" />
            <span>View Bills</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={() => window.location.href = `/patient/${patientId}/prescriptions/alerts`}
          >
            <AlertCircle className="h-6 w-6" />
            <span>Prescription Alerts</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2"
            onClick={onOpenAICompanion}
          >
            <Brain className="h-6 w-6" />
            <span>AI Companion</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Download, Eye, Trash2, Upload, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PrescriptionUpload } from './PrescriptionUpload';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiService from '@/services/api';
import { PrescriptionData } from '@/types/prescription';
import { AICompanion } from './AICompanion';
import { MedicationReminder } from './MedicationReminder';

interface PrescriptionManagementProps {
  patientId: string;
}

export function PrescriptionManagement({ patientId }: PrescriptionManagementProps) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionData | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const fetchPrescriptions = async () => {
    try {
      const data = await apiService.getAllPrescriptions(patientId);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch prescriptions',
        variant: 'destructive',
      });
    }
  };

  const handleUploadSuccess = (newPrescription: PrescriptionData) => {
    setShowUploadDialog(false);
    setPrescriptions(prev => [newPrescription, ...prev]);
    toast({
      title: 'Success',
      description: 'Prescription uploaded and analyzed successfully',
    });
  };

  const handleDelete = async (prescriptionId: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await apiService.deletePrescription(prescriptionId);
      setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
      toast({
        title: 'Success',
        description: 'Prescription deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prescription',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (prescription: PrescriptionData) => {
    try {
      const blob = await apiService.getPrescriptionImages(patientId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${prescription.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast({
        title: 'Error',
        description: 'Failed to download prescription',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: 'success' | 'error' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    if (activeTab === 'all') return true;
    return prescription.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Prescriptions</CardTitle>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Prescription
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="ai">AI Companion</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {activeTab === 'ai' ? (
              <AICompanion patientId={patientId} />
            ) : activeTab === 'reminders' ? (
              <MedicationReminder patientId={patientId} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Medications</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        {formatDate(prescription.prescriptionDate)}
                      </TableCell>
                      <TableCell>{prescription.doctorName}</TableCell>
                      <TableCell>{prescription.medications.length}</TableCell>
                      <TableCell>${prescription.analysis.totalCost.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(prescription)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(prescription.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedPrescription} onOpenChange={() => setSelectedPrescription(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            {selectedPrescription && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Date</p>
                    <p>{formatDate(selectedPrescription.prescriptionDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Doctor</p>
                    <p>{selectedPrescription.doctorName}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Status</p>
                    <Badge className={getStatusColor(selectedPrescription.status)}>
                      {selectedPrescription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold">Total Cost</p>
                    <p>${selectedPrescription.analysis.totalCost.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Analysis Results</h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {selectedPrescription.analysis.results.map((result, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.status)}
                            <span className="font-medium">{result.message}</span>
                          </div>
                          {result.details && (
                            <div className="ml-6 space-y-2">
                              {result.details.map((detail, detailIndex) => (
                                <div key={detailIndex} className="flex items-center space-x-2">
                                  <Badge className={getSeverityColor(detail.severity)}>
                                    {detail.type}
                                  </Badge>
                                  <span className="text-sm">{detail.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPrescription.medications.map((medication, index) => (
                        <TableRow key={index}>
                          <TableCell>{medication.name}</TableCell>
                          <TableCell>{medication.dosage}</TableCell>
                          <TableCell>{medication.frequency}</TableCell>
                          <TableCell>{medication.duration}</TableCell>
                          <TableCell>{medication.quantity}</TableCell>
                          <TableCell>${medication.price.toFixed(2)}</TableCell>
                          <TableCell>{medication.category}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedPrescription.analysis.warnings.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-yellow-600">Warnings</h3>
                    <ul className="list-disc list-inside">
                      {selectedPrescription.analysis.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-600">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Bill Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Bill Number</p>
                      <p>{selectedPrescription.bill.billNumber}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status</p>
                      <Badge className={getStatusColor(selectedPrescription.bill.status)}>
                        {selectedPrescription.bill.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold">Generated Date</p>
                      <p>{formatDate(selectedPrescription.bill.generatedDate)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Due Date</p>
                      <p>{formatDate(selectedPrescription.bill.dueDate)}</p>
                    </div>
                  </div>

                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedPrescription.bill.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.medication}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell>${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">
                          Subtotal
                        </TableCell>
                        <TableCell>${selectedPrescription.bill.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          Tax
                        </TableCell>
                        <TableCell>${selectedPrescription.bill.tax.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          Discount
                        </TableCell>
                        <TableCell>${selectedPrescription.bill.discount.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-semibold">
                          Total
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${selectedPrescription.bill.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Prescription Image</h3>
                  <img
                    src={selectedPrescription.imageUrl}
                    alt="Prescription"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionUpload
              patientId={patientId}
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUploadDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
} 
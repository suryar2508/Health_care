import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { FileText, Plus, Edit, Trash2, Printer, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  medications: Medication[];
  instructions: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  followUpDate?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface PatientPrescriptionsProps {
  patientId: string;
  prescriptions: Prescription[];
  onAddPrescription: (prescription: Prescription) => void;
  onUpdatePrescription: (id: string, prescription: Prescription) => void;
  onDeletePrescription: (id: string) => void;
}

export function PatientPrescriptions({
  patientId,
  prescriptions,
  onAddPrescription,
  onUpdatePrescription,
  onDeletePrescription,
}: PatientPrescriptionsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [formData, setFormData] = useState<Partial<Prescription>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    doctor: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    instructions: '',
    status: 'active',
  });

  const handleAddMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...(prev.medications || []), { name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    }));
  };

  const handleRemoveMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications?.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications?.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSubmit = () => {
    if (!formData.doctor || !formData.medications?.length) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      date: formData.date || format(new Date(), 'yyyy-MM-dd'),
      doctor: formData.doctor,
      medications: formData.medications || [],
      instructions: formData.instructions || '',
      status: formData.status || 'active',
      followUpDate: formData.followUpDate,
      notes: formData.notes,
    };

    onAddPrescription(newPrescription);
    setIsAddDialogOpen(false);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      doctor: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      instructions: '',
      status: 'active',
    });

    toast({
      title: 'Success',
      description: 'Prescription added successfully',
    });
  };

  const handleEdit = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setFormData(prescription);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingPrescription || !formData.doctor || !formData.medications?.length) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const updatedPrescription: Prescription = {
      ...editingPrescription,
      ...formData,
    };

    onUpdatePrescription(editingPrescription.id, updatedPrescription);
    setIsEditDialogOpen(false);
    setEditingPrescription(null);
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      doctor: '',
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      instructions: '',
      status: 'active',
    });

    toast({
      title: 'Success',
      description: 'Prescription updated successfully',
    });
  };

  const handleDelete = (id: string) => {
    onDeletePrescription(id);
    toast({
      title: 'Success',
      description: 'Prescription deleted successfully',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prescriptions</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Prescription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input
                    id="doctor"
                    value={formData.doctor}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medications</Label>
                {formData.medications?.map((med, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            value={med.name}
                            onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <Input
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Input
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            value={med.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Instructions</Label>
                        <Textarea
                          value={med.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        />
                      </div>
                      {index > 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveMedication(index)}
                        >
                          Remove Medication
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Prescription['status'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followUpDate">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.followUpDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Add Prescription</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {prescriptions.map((prescription) => (
          <Card key={prescription.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {format(parseISO(prescription.date), 'PPP')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(prescription.status)}`}>
                  {prescription.status}
                </span>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(prescription)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(prescription.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium">Doctor</div>
                  <div className="text-sm text-muted-foreground">{prescription.doctor}</div>
                </div>

                <div>
                  <div className="text-sm font-medium">Medications</div>
                  <div className="space-y-2">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="pl-4 border-l-2">
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {med.dosage} - {med.frequency} for {med.duration}
                        </div>
                        {med.instructions && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {med.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.instructions && (
                  <div>
                    <div className="text-sm font-medium">Instructions</div>
                    <div className="text-sm text-muted-foreground">{prescription.instructions}</div>
                  </div>
                )}

                {prescription.followUpDate && (
                  <div>
                    <div className="text-sm font-medium">Follow-up Date</div>
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(prescription.followUpDate), 'PPP')}
                    </div>
                  </div>
                )}

                {prescription.notes && (
                  <div>
                    <div className="text-sm font-medium">Additional Notes</div>
                    <div className="text-sm text-muted-foreground">{prescription.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input
                  id="doctor"
                  value={formData.doctor}
                  onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Medications</Label>
              {formData.medications?.map((med, index) => (
                <Card key={index} className="p-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Instructions</Label>
                      <Textarea
                        value={med.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMedication(index)}
                      >
                        Remove Medication
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              <Button type="button" variant="outline" onClick={handleAddMedication}>
                Add Medication
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Prescription['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update Prescription</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
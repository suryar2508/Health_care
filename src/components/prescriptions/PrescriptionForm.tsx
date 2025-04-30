import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createPrescription } from '../../store/slices/prescriptionSlice';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  price: number;
}

const PrescriptionForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [medications, setMedications] = useState<Medication[]>([{
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: 1,
    price: 0,
  }]);
  const [patientId, setPatientId] = useState('');
  const [instructions, setInstructions] = useState('');

  const addMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: 1,
      price: 0,
    }]);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
    const newMedications = [...medications];
    newMedications[index] = {
      ...newMedications[index],
      [field]: value,
    };
    setMedications(newMedications);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = medications.reduce((sum, med) => sum + (med.price * med.quantity), 0);
    
    const prescriptionData = {
      patientId,
      doctorId: 'current-doctor-id', // This should come from auth context
      date: new Date().toISOString(),
      medications,
      instructions,
      status: 'pending' as const,
      totalAmount,
    };

    try {
      await dispatch(createPrescription(prescriptionData));
      // Reset form
      setMedications([{
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: 1,
        price: 0,
      }]);
      setPatientId('');
      setInstructions('');
    } catch (error) {
      console.error('Failed to create prescription:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />

          {medications.map((medication, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Medication {index + 1}</h3>
                {medications.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMedication(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Medication Name"
                  value={medication.name}
                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                  required
                />
                <Input
                  label="Dosage"
                  value={medication.dosage}
                  onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  required
                />
                <Input
                  label="Frequency"
                  value={medication.frequency}
                  onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                  required
                />
                <Input
                  label="Duration"
                  value={medication.duration}
                  onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                  required
                />
                <Input
                  label="Quantity"
                  type="number"
                  value={medication.quantity}
                  onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value))}
                  required
                />
                <Input
                  label="Price per Unit"
                  type="number"
                  value={medication.price}
                  onChange={(e) => updateMedication(index, 'price', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={addMedication}>
            Add Another Medication
          </Button>

          <Input
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            multiline
            rows={3}
          />

          <div className="flex justify-end space-x-4">
            <Button type="submit" variant="default">
              Create Prescription
            </Button>
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrescriptionForm; 
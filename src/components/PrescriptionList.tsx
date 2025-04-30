import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchPrescriptions, setSelectedPrescription, refillPrescription } from '../store/slices/prescriptionSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Pill, Calendar, User, Stethoscope, Building2 } from 'lucide-react';
import { format } from 'date-fns';

const PrescriptionList: React.FC = () => {
  const dispatch = useDispatch();
  const { prescriptions, loading, error } = useSelector((state: RootState) => state.prescriptions);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const handlePrescriptionSelect = (prescription: any) => {
    dispatch(setSelectedPrescription(prescription));
  };

  const handleRefill = async (id: string) => {
    try {
      await dispatch(refillPrescription(id));
    } catch (error) {
      console.error('Failed to refill prescription:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.instructions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptions</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline">New Prescription</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Pharmacy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(new Date(prescription.datePrescribed), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {prescription.patientId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {prescription.doctorId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Pill className="h-4 w-4 mr-2" />
                    {prescription.medicationId}
                  </div>
                </TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    {prescription.pharmacy.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prescription.status === 'Active' ? 'bg-green-100 text-green-800' :
                    prescription.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    prescription.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {prescription.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrescriptionSelect(prescription)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRefill(prescription.id)}
                      disabled={prescription.refills <= 0}
                    >
                      Refill
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PrescriptionList; 
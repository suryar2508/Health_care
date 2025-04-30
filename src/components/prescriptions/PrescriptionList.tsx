import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchPrescriptions, updatePrescriptionStatus } from '../../store/slices/prescriptionSlice';
import { Prescription } from '../../store/slices/prescriptionSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Loader2, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const PrescriptionList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { prescriptions, loading, error } = useSelector((state: RootState) => state.prescriptions);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const handleStatusUpdate = async (id: string, status: Prescription['status']) => {
    try {
      await dispatch(updatePrescriptionStatus({ id, status }));
    } catch (error) {
      console.error('Failed to update prescription status:', error);
    }
  };

  const getStatusIcon = (status: Prescription['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Medications</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((prescription) => (
              <TableRow key={prescription._id}>
                <TableCell>
                  {format(new Date(prescription.date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{prescription.patientId}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="text-sm">
                        {med.name} - {med.dosage}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  ${prescription.totalAmount?.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(prescription.status)}
                    <span className="capitalize">{prescription.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(prescription._id, 'completed')}
                      disabled={prescription.status === 'completed'}
                    >
                      Complete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(prescription._id, 'rejected')}
                      disabled={prescription.status === 'rejected'}
                    >
                      Reject
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
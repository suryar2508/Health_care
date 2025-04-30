import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchPatients, setSelectedPatient } from '../store/slices/patientSlice';
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
import { Loader2 } from 'lucide-react';

const PatientList: React.FC = () => {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector((state: RootState) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handlePatientSelect = (patient: any) => {
    dispatch(setSelectedPatient(patient));
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
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
        <CardTitle>Patients</CardTitle>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline">Add Patient</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Insurance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  {patient.firstName} {patient.lastName}
                </TableCell>
                <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.insurance.provider}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Handle edit */}}
                    >
                      Edit
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

export default PatientList; 
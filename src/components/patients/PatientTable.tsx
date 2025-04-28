import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Patient } from '@/types/patient';
import { PatientDetails } from './PatientDetails';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, Trash2 } from 'lucide-react';

interface PatientTableProps {
  patients: Patient[];
  onDeletePatient?: (id: string) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onDeletePatient,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const patientsPerPage = 10;
  const totalPages = Math.ceil(patients.length / patientsPerPage);
  
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedPatient(null);
  };
  
  const handleDeletePatient = (id: string) => {
    if (onDeletePatient) {
      onDeletePatient(id);
    }
  };
  
  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No patients found.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>
                  <Badge variant={patient.condition === 'Critical' ? 'destructive' : 'default'}>
                    {patient.condition}
                  </Badge>
                </TableCell>
                <TableCell>
                  {patient.lastVisit ? format(new Date(patient.lastVisit), 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(patient)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {onDeletePatient && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <PatientDetails
              patient={selectedPatient}
              onClose={handleCloseDetails}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

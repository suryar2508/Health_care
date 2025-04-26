
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ContactFields } from "./form/ContactFields";
import { MedicalFields } from "./form/MedicalFields";

export interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phoneNumber: string;
  address: string;
  condition: string;
  lastVisit: string;
  medicalHistory?: string;
  notes?: string;
}

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: Omit<Patient, "id">) => void;
  patient?: Patient;
  title: string;
}

export function PatientForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  patient,
  title 
}: PatientFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    name: patient?.name || "",
    dateOfBirth: patient?.dateOfBirth || "",
    gender: patient?.gender || "other",
    bloodGroup: patient?.bloodGroup || "O+",
    phoneNumber: patient?.phoneNumber || "",
    address: patient?.address || "",
    condition: patient?.condition || "",
    lastVisit: patient?.lastVisit || new Date().toISOString().split("T")[0],
    medicalHistory: patient?.medicalHistory || "",
    notes: patient?.notes || ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Patient name is required",
        variant: "destructive"
      });
      return;
    }

    // Calculate age from date of birth
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      formData.age = age;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Enter the patient details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <PersonalInfoFields formData={formData} handleChange={handleChange} />
            <ContactFields formData={formData} handleChange={handleChange} />
            <MedicalFields formData={formData} handleChange={handleChange} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

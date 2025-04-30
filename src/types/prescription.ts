export interface AnalysisResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: {
    type: 'medication' | 'dosage' | 'interaction' | 'allergy' | 'insurance';
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  price: number;
  category: string;
  manufacturer: string;
  expiryDate: string;
}

export interface PrescriptionData {
  id: string;
  imageUrl: string;
  uploadDate: string;
  status: 'pending' | 'analyzed' | 'error';
  medications: Medication[];
  doctorName: string;
  prescriptionDate: string;
  analysis: {
    totalCost: number;
    insuranceCoverage: number;
    patientShare: number;
    notes: string[];
    warnings: string[];
    interactions: string[];
    results: AnalysisResult[];
  };
  bill: {
    billNumber: string;
    generatedDate: string;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    items: {
      medication: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
  };
} 
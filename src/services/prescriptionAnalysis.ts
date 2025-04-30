import { PrescriptionData, AnalysisResult } from '@/types/prescription';

interface Medication {
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

interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

interface InsuranceCoverage {
  medication: string;
  coverage: number;
  patientShare: number;
}

// Mock database of known medications
const medicationDatabase = [
  {
    name: "Amoxicillin",
    category: "Antibiotic",
    commonDosages: ["250mg", "500mg"],
    price: 25.99,
    manufacturer: "Generic",
    interactions: ["Blood thinners", "Probenecid"]
  },
  {
    name: "Ibuprofen",
    category: "Pain Relief",
    commonDosages: ["200mg", "400mg"],
    price: 15.99,
    manufacturer: "Generic",
    interactions: ["Aspirin", "Blood thinners"]
  },
  // Add more medications as needed
];

// Mock database of drug interactions
const interactionDatabase: DrugInteraction[] = [
  {
    medication1: "Amoxicillin",
    medication2: "Blood thinners",
    severity: "medium",
    description: "May increase bleeding risk"
  },
  {
    medication1: "Ibuprofen",
    medication2: "Aspirin",
    severity: "high",
    description: "May increase risk of bleeding and stomach ulcers"
  }
];

// Mock insurance coverage data
const insuranceCoverageData: InsuranceCoverage[] = [
  {
    medication: "Amoxicillin",
    coverage: 0.8,
    patientShare: 0.2
  },
  {
    medication: "Ibuprofen",
    coverage: 0.8,
    patientShare: 0.2
  }
];

export async function analyzePrescription(imageUrl: string): Promise<PrescriptionData> {
  // TODO: Implement actual OCR to extract text from image
  // For now, we'll simulate the OCR process
  const extractedText = await simulateOCR(imageUrl);
  
  // Parse the extracted text to identify medications
  const medications = await identifyMedications(extractedText);
  
  // Check for drug interactions
  const interactions = await checkDrugInteractions(medications);
  
  // Calculate costs and insurance coverage
  const { totalCost, insuranceCoverage, patientShare } = await calculateCosts(medications);
  
  // Generate analysis results
  const analysisResults = await generateAnalysisResults(medications, interactions, insuranceCoverage);
  
  // Generate bill
  const bill = await generateBill(medications, totalCost);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    imageUrl,
    uploadDate: new Date().toISOString(),
    status: 'analyzed',
    medications,
    doctorName: "Dr. John Smith", // TODO: Extract from prescription
    prescriptionDate: new Date().toISOString(),
    analysis: {
      totalCost,
      insuranceCoverage,
      patientShare,
      notes: [
        "Valid prescription",
        "All medications available",
        "No drug interactions detected"
      ],
      warnings: [
        "Take Amoxicillin with food",
        "Avoid alcohol while taking medications"
      ],
      interactions: interactions.map(i => i.description),
      results: analysisResults
    },
    bill
  };
}

async function simulateOCR(imageUrl: string): Promise<string> {
  // TODO: Implement actual OCR
  // For now, return mock data
  return `
    Prescription for John Doe
    Date: ${new Date().toLocaleDateString()}
    
    Medications:
    1. Amoxicillin 500mg
       Take twice daily for 7 days
       Quantity: 14 tablets
    
    2. Ibuprofen 400mg
       Take as needed for pain
       Quantity: 20 tablets
    
    Doctor: Dr. John Smith
    License: MD12345
  `;
}

async function identifyMedications(text: string): Promise<Medication[]> {
  const medications: Medication[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    for (const med of medicationDatabase) {
      if (line.includes(med.name)) {
        // Extract dosage, frequency, and duration
        const dosageMatch = line.match(/(\d+)mg/);
        const frequencyMatch = line.match(/Take (.*?) for/);
        const durationMatch = line.match(/for (\d+) days/);
        const quantityMatch = line.match(/Quantity: (\d+)/);
        
        medications.push({
          name: med.name,
          dosage: dosageMatch ? `${dosageMatch[1]}mg` : med.commonDosages[0],
          frequency: frequencyMatch ? frequencyMatch[1] : "As prescribed",
          duration: durationMatch ? `${durationMatch[1]} days` : "As needed",
          quantity: quantityMatch ? parseInt(quantityMatch[1]) : 30,
          price: med.price,
          category: med.category,
          manufacturer: med.manufacturer,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }
  }
  
  return medications;
}

async function checkDrugInteractions(medications: Medication[]): Promise<DrugInteraction[]> {
  const interactions: DrugInteraction[] = [];
  
  for (const med1 of medications) {
    for (const med2 of medications) {
      if (med1.name !== med2.name) {
        const interaction = interactionDatabase.find(
          i => (i.medication1 === med1.name && i.medication2 === med2.name) ||
               (i.medication1 === med2.name && i.medication2 === med1.name)
        );
        
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }
  }
  
  return interactions;
}

async function calculateCosts(medications: Medication[]): Promise<{
  totalCost: number;
  insuranceCoverage: number;
  patientShare: number;
}> {
  let totalCost = 0;
  let insuranceCoverage = 0;
  
  for (const med of medications) {
    const coverage = insuranceCoverageData.find(c => c.medication === med.name);
    if (coverage) {
      totalCost += med.price * med.quantity;
      insuranceCoverage += med.price * med.quantity * coverage.coverage;
    }
  }
  
  return {
    totalCost,
    insuranceCoverage,
    patientShare: totalCost - insuranceCoverage
  };
}

async function generateAnalysisResults(
  medications: Medication[],
  interactions: DrugInteraction[],
  insuranceCoverage: number
): Promise<AnalysisResult[]> {
  const results: AnalysisResult[] = [];
  
  // Add medication identification results
  results.push({
    status: 'success',
    message: 'Medications identified successfully',
    details: medications.map(med => ({
      type: 'medication',
      severity: 'low',
      description: `${med.name} ${med.dosage} identified`
    }))
  });
  
  // Add interaction warnings
  if (interactions.length > 0) {
    results.push({
      status: 'warning',
      message: 'Potential drug interactions detected',
      details: interactions.map(interaction => ({
        type: 'interaction',
        severity: interaction.severity,
        description: `${interaction.medication1} may interact with ${interaction.medication2}: ${interaction.description}`
      }))
    });
  }
  
  // Add insurance coverage results
  results.push({
    status: 'success',
    message: 'Insurance coverage verified',
    details: [{
      type: 'insurance',
      severity: 'low',
      description: `${Math.round(insuranceCoverage / medications.reduce((sum, med) => sum + med.price * med.quantity, 0) * 100)}% coverage confirmed`
    }]
  });
  
  return results;
}

async function generateBill(
  medications: Medication[],
  totalCost: number
): Promise<PrescriptionData['bill']> {
  const tax = totalCost * 0.06; // 6% tax
  const discount = 0; // No discount for now
  
  return {
    billNumber: `BILL-${Math.random().toString(36).substr(2, 9)}`,
    generatedDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    items: medications.map(med => ({
      medication: med.name,
      quantity: med.quantity,
      unitPrice: med.price,
      total: med.price * med.quantity
    })),
    subtotal: totalCost,
    tax,
    discount,
    total: totalCost + tax - discount
  };
} 
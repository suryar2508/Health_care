import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  UserPlus, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  FileSpreadsheet,
  Users,
  Eye,
  Key,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { read, utils, writeFile } from 'xlsx';
import apiService from "@/services/api";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  insuranceInfo?: string;
  medicalHistory?: string;
  assignedDoctor?: string;
  status: 'active' | 'inactive';
  loginCredentials?: {
    username: string;
    password: string;
  };
  healthConditions?: {
    condition: string;
    diagnosisDate: string;
    severity: 'mild' | 'moderate' | 'severe';
    status: 'active' | 'resolved' | 'chronic';
    notes?: string;
  }[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    prescribedBy: string;
  }[];
  allergies?: {
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
  }[];
  vaccinations?: {
    name: string;
    date: string;
    administeredBy: string;
    nextDueDate?: string;
  }[];
  labResults?: {
    testName: string;
    date: string;
    result: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
  vitalSigns?: {
    heartRate: number;
    bloodPressure: {
      systolic: number;
      diastolic: number;
    };
    temperature: number;
    oxygenSaturation: number;
    lastUpdated: string;
  };
  chronicConditions?: {
    diabetes?: {
      type: string;
      lastA1C: number;
      diagnosisDate: string;
    };
    hypertension?: {
      lastReading: {
        systolic: number;
        diastolic: number;
        date: string;
      };
    };
    asthma?: {
      severity: string;
      lastAttack: string;
      triggers: string[];
    };
    heartDisease?: {
      type: string;
      lastEKG: string;
      medications: string[];
    };
  };
  lifestyleFactors?: {
    smoking: {
      status: string;
      quitDate?: string;
    };
    alcohol: {
      status: string;
      unitsPerWeek?: number;
    };
    exercise: {
      frequency: string;
      type?: string[];
    };
    diet: {
      type: string;
      restrictions?: string[];
    };
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    coverageType: string;
    effectiveDate: string;
    expiryDate: string;
  };
  billingHistory?: {
    date: string;
    amount: string;
    status: string;
    description: string;
  }[];
  appointmentHistory?: {
    date: string;
    doctor: string;
    type: string;
    notes: string;
  }[];
  documents?: {
    type: string;
    name: string;
    date: string;
    url: string;
  }[];
  notes?: {
    date: string;
    author: string;
    content: string;
  }[];
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  }[];
  languagePreference?: string;
  communicationPreference?: string;
  preferredPharmacy?: {
    name: string;
  };
  preferredHospital?: {
    name: string;
  };
  privacySettings?: {
    shareWithFamily: boolean;
    shareWithDoctors: boolean;
    shareWithInsurance: boolean;
  };
}

interface PatientManagementProps {
  onPatientUpdated: () => void;
}

const VitalSignsBadge = ({ vitalSigns }: { vitalSigns: Patient['vitalSigns'] }) => {
  if (!vitalSigns) return null;

  const getHeartRateColor = (rate: number) => {
    if (rate > 100) return 'text-red-600';
    if (rate < 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBloodPressureColor = (systolic: number, diastolic: number) => {
    if (systolic > 140 || diastolic > 90) return 'text-red-600';
    if (systolic > 120 || diastolic > 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOxygenColor = (saturation: number) => {
    if (saturation < 95) return 'text-red-600';
    if (saturation < 97) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">HR:</span>
        <span className={`text-xs ${getHeartRateColor(vitalSigns.heartRate)}`}>
          {vitalSigns.heartRate} bpm
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">BP:</span>
        <span className={`text-xs ${getBloodPressureColor(vitalSigns.bloodPressure.systolic, vitalSigns.bloodPressure.diastolic)}`}>
          {vitalSigns.bloodPressure.systolic}/{vitalSigns.bloodPressure.diastolic}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">O₂:</span>
        <span className={`text-xs ${getOxygenColor(vitalSigns.oxygenSaturation)}`}>
          {vitalSigns.oxygenSaturation}%
        </span>
      </div>
      <div className="text-[10px] text-gray-500">
        {new Date(vitalSigns.lastUpdated).toLocaleDateString()}
      </div>
    </div>
  );
};

const HealthStatusBadge = ({ patient }: { patient: Patient }) => {
  const conditions = [
    ...(patient.chronicConditions?.diabetes ? ['Diabetes'] : []),
    ...(patient.chronicConditions?.hypertension ? ['Hypertension'] : []),
    ...(patient.chronicConditions?.asthma ? ['Asthma'] : []),
    ...(patient.chronicConditions?.heartDisease ? ['Heart Disease'] : []),
    ...(patient.healthConditions?.map(c => c.condition) || [])
  ];

  if (conditions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {conditions.map((condition, index) => {
        const severity = patient.healthConditions?.find(c => c.condition === condition)?.severity || 'mild';
        const colorClass = severity === 'severe' ? 'bg-red-100 text-red-800' :
                          severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800';

        return (
          <span
            key={index}
            className={`px-2 py-0.5 rounded-full text-xs ${colorClass}`}
          >
            {condition}
          </span>
        );
      })}
    </div>
  );
};

const ChronicConditionsDisplay = ({ conditions }: { conditions: Patient['chronicConditions'] }) => {
  if (!conditions) return null;

  return (
    <div className="space-y-2">
      {conditions.diabetes && (
        <div className="p-2 bg-gray-50 rounded">
          <p className="font-medium">Diabetes (Type {conditions.diabetes.type})</p>
          <p className="text-sm">Last A1C: {conditions.diabetes.lastA1C}%</p>
          <p className="text-xs text-gray-500">
            Diagnosed: {new Date(conditions.diabetes.diagnosisDate).toLocaleDateString()}
          </p>
        </div>
      )}
      {conditions.hypertension && (
        <div className="p-2 bg-gray-50 rounded">
          <p className="font-medium">Hypertension</p>
          <p className="text-sm">
            Last Reading: {conditions.hypertension.lastReading.systolic}/{conditions.hypertension.lastReading.diastolic} mmHg
          </p>
          <p className="text-xs text-gray-500">
            Date: {new Date(conditions.hypertension.lastReading.date).toLocaleDateString()}
          </p>
        </div>
      )}
      {conditions.asthma && (
        <div className="p-2 bg-gray-50 rounded">
          <p className="font-medium">Asthma ({conditions.asthma.severity})</p>
          <p className="text-sm">Last Attack: {new Date(conditions.asthma.lastAttack).toLocaleDateString()}</p>
          <p className="text-sm">Triggers: {conditions.asthma.triggers.join(', ')}</p>
        </div>
      )}
      {conditions.heartDisease && (
        <div className="p-2 bg-gray-50 rounded">
          <p className="font-medium">Heart Disease ({conditions.heartDisease.type})</p>
          <p className="text-sm">Last EKG: {new Date(conditions.heartDisease.lastEKG).toLocaleDateString()}</p>
          <p className="text-sm">Medications: {conditions.heartDisease.medications.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

const LifestyleFactorsDisplay = ({ factors }: { factors: Patient['lifestyleFactors'] }) => {
  if (!factors) return null;

  return (
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="p-2 bg-gray-50 rounded">
        <p className="font-medium">Smoking</p>
        <p>{factors.smoking.status}</p>
        {factors.smoking.status === 'former' && (
          <p className="text-xs text-gray-500">
            Quit: {new Date(factors.smoking.quitDate!).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="font-medium">Alcohol</p>
        <p>{factors.alcohol.status}</p>
        {factors.alcohol.unitsPerWeek && (
          <p className="text-xs text-gray-500">
            {factors.alcohol.unitsPerWeek} units/week
          </p>
        )}
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="font-medium">Exercise</p>
        <p>{factors.exercise.frequency}</p>
        {factors.exercise.type && (
          <p className="text-xs text-gray-500">
            {factors.exercise.type.join(', ')}
          </p>
        )}
      </div>
      <div className="p-2 bg-gray-50 rounded">
        <p className="font-medium">Diet</p>
        <p>{factors.diet.type}</p>
        {factors.diet.restrictions && (
          <p className="text-xs text-gray-500">
            Restrictions: {factors.diet.restrictions.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};

const HealthDetailsDialog = ({ patient, isOpen, onClose }: { patient: Patient; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Health Details - {patient.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Vital Signs */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Vital Signs</h3>
            <VitalSignsBadge vitalSigns={patient.vitalSigns} />
          </div>

          {/* Chronic Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Chronic Conditions</h3>
            <ChronicConditionsDisplay conditions={patient.chronicConditions} />
          </div>

          {/* Lifestyle Factors */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Lifestyle Factors</h3>
            <LifestyleFactorsDisplay factors={patient.lifestyleFactors} />
          </div>

          {/* Health Conditions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Health Conditions</h3>
            {patient.healthConditions?.length ? (
              <div className="space-y-2">
                {patient.healthConditions.map((condition, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{condition.condition}</p>
                        <p className="text-sm text-gray-600">Diagnosed: {condition.diagnosisDate}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        condition.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        condition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {condition.severity}
                      </span>
                    </div>
                    {condition.notes && (
                      <p className="text-sm text-gray-600 mt-1">{condition.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No health conditions recorded</p>
            )}
          </div>

          {/* Medications */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Medications</h3>
            {patient.medications?.length ? (
              <div className="space-y-2">
                {patient.medications.map((medication, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} - {medication.frequency}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Prescribed by: {medication.prescribedBy}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Start Date: {medication.startDate}
                      {medication.endDate && ` - End Date: ${medication.endDate}`}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No current medications</p>
            )}
          </div>

          {/* Allergies */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Allergies</h3>
            {patient.allergies?.length ? (
              <div className="space-y-2">
                {patient.allergies.map((allergy, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{allergy.allergen}</p>
                        <p className="text-sm text-gray-600">Reaction: {allergy.reaction}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        allergy.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        allergy.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {allergy.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No allergies recorded</p>
            )}
          </div>

          {/* Vaccinations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Vaccinations</h3>
            {patient.vaccinations?.length ? (
              <div className="space-y-2">
                {patient.vaccinations.map((vaccination, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{vaccination.name}</p>
                        <p className="text-sm text-gray-600">
                          Date: {vaccination.date}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        Administered by: {vaccination.administeredBy}
                      </p>
                    </div>
                    {vaccination.nextDueDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Next Due: {vaccination.nextDueDate}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No vaccinations recorded</p>
            )}
          </div>

          {/* Lab Results */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Lab Results</h3>
            {patient.labResults?.length ? (
              <div className="space-y-2">
                {patient.labResults.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{result.testName}</p>
                        <p className="text-sm text-gray-600">
                          Result: {result.result}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === 'critical' ? 'bg-red-100 text-red-800' :
                        result.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Reference Range: {result.referenceRange}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No lab results recorded</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PatientDetailsDialog = ({ patient, isOpen, onClose }: { patient: Patient; isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details - {patient.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Email:</strong> {patient.email}</p>
              <p><strong>Phone:</strong> {patient.phone}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
              <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>Emergency Contact:</strong> {patient.emergencyContact}</p>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Insurance Information</h3>
            {patient.insuranceDetails ? (
              <div className="space-y-2">
                <p><strong>Provider:</strong> {patient.insuranceDetails.provider}</p>
                <p><strong>Policy Number:</strong> {patient.insuranceDetails.policyNumber}</p>
                <p><strong>Group Number:</strong> {patient.insuranceDetails.groupNumber}</p>
                <p><strong>Coverage Type:</strong> {patient.insuranceDetails.coverageType}</p>
                <p><strong>Effective Date:</strong> {new Date(patient.insuranceDetails.effectiveDate).toLocaleDateString()}</p>
                <p><strong>Expiry Date:</strong> {new Date(patient.insuranceDetails.expiryDate).toLocaleDateString()}</p>
              </div>
            ) : (
              <p className="text-gray-500">No insurance information available</p>
            )}
          </div>

          {/* Billing History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Billing History</h3>
            {patient.billingHistory?.length ? (
              <div className="space-y-2">
                {patient.billingHistory.map((bill, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>
                    <p><strong>Amount:</strong> ${bill.amount}</p>
                    <p><strong>Status:</strong> {bill.status}</p>
                    <p><strong>Description:</strong> {bill.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No billing history available</p>
            )}
          </div>

          {/* Appointment History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appointment History</h3>
            {patient.appointmentHistory?.length ? (
              <div className="space-y-2">
                {patient.appointmentHistory.map((appointment, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                    <p><strong>Doctor:</strong> {appointment.doctor}</p>
                    <p><strong>Type:</strong> {appointment.type}</p>
                    <p><strong>Notes:</strong> {appointment.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No appointment history available</p>
            )}
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents</h3>
            {patient.documents?.length ? (
              <div className="space-y-2">
                {patient.documents.map((doc, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p><strong>Type:</strong> {doc.type}</p>
                    <p><strong>Name:</strong> {doc.name}</p>
                    <p><strong>Date:</strong> {new Date(doc.date).toLocaleDateString()}</p>
                    <a href={doc.url} className="text-blue-600 hover:underline">View Document</a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents available</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            {patient.notes?.length ? (
              <div className="space-y-2">
                {patient.notes.map((note, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p><strong>Date:</strong> {new Date(note.date).toLocaleDateString()}</p>
                    <p><strong>Author:</strong> {note.author}</p>
                    <p><strong>Content:</strong> {note.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No notes available</p>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            {patient.emergencyContacts?.length ? (
              <div className="space-y-2">
                {patient.emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p><strong>Name:</strong> {contact.name}</p>
                    <p><strong>Relationship:</strong> {contact.relationship}</p>
                    <p><strong>Phone:</strong> {contact.phone}</p>
                    <p><strong>Address:</strong> {contact.address}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No emergency contacts available</p>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="space-y-2">
              <p><strong>Language:</strong> {patient.languagePreference}</p>
              <p><strong>Communication:</strong> {patient.communicationPreference}</p>
              <p><strong>Preferred Pharmacy:</strong> {patient.preferredPharmacy?.name}</p>
              <p><strong>Preferred Hospital:</strong> {patient.preferredHospital?.name}</p>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Privacy Settings</h3>
            {patient.privacySettings ? (
              <div className="space-y-2">
                <p><strong>Share with Family:</strong> {patient.privacySettings.shareWithFamily ? 'Yes' : 'No'}</p>
                <p><strong>Share with Doctors:</strong> {patient.privacySettings.shareWithDoctors ? 'Yes' : 'No'}</p>
                <p><strong>Share with Insurance:</strong> {patient.privacySettings.shareWithInsurance ? 'Yes' : 'No'}</p>
              </div>
            ) : (
              <p className="text-gray-500">No privacy settings available</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function PatientManagement({ onPatientUpdated }: PatientManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showCredentials, setShowCredentials] = useState<string | null>(null);
  const [selectedPatientForHealth, setSelectedPatientForHealth] = useState<Patient | null>(null);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<Patient | null>(null);
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
  }>({ type: null, message: '' });
  const [importMode, setImportMode] = useState<'new' | 'update'>('new');
  const [importProgress, setImportProgress] = useState<{
    total: number;
    processed: number;
    status: 'idle' | 'processing' | 'completed' | 'error';
  }>({ total: 0, processed: 0, status: 'idle' });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error("Error loading patients:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load patients",
      });
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    medicalHistory: "",
    assignedDoctor: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    insuranceInfo: "",
    status: "active",
    username: "",
    password: ""
  });

  const handleDeleteAllPatients = async () => {
    if (window.confirm("Are you sure you want to delete all patients? This action cannot be undone.")) {
      try {
        await apiService.deleteAllPatients();
        setPatients([]);
        setImportStatus({
          type: 'success',
          message: 'All patients have been deleted successfully'
        });
        onPatientUpdated();
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Failed to delete all patients'
        });
      }
    }
  };

  const handleDeletePatient = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await apiService.deletePatient(id);
        setPatients(prev => prev.filter(p => p.id !== id));
        setImportStatus({
          type: 'success',
          message: 'Patient deleted successfully'
        });
        onPatientUpdated();
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Failed to delete patient'
        });
      }
    }
  };

  const handleCreatePatient = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.createPatient({
        ...formData,
        age: parseInt(formData.age)
      });
      setPatients(prev => [...prev, response.data]);
      setImportStatus({
        type: 'success',
        message: 'Patient added successfully'
      });
      setIsDialogOpen(false);
      resetForm();
      onPatientUpdated();
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to add patient'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePatient = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.updatePatient(id, {
        ...formData,
        age: parseInt(formData.age)
      });
      setPatients(prev => prev.map(p => p.id === id ? response.data : p));
      setImportStatus({
        type: 'success',
        message: 'Patient updated successfully'
      });
      setIsDialogOpen(false);
      resetForm();
      onPatientUpdated();
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to update patient'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus({ type: null, message: '' });
    setImportProgress({ total: 0, processed: 0, status: 'processing' });

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);

        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'age', 'gender'];
        const missingFields = requiredFields.filter(field => !jsonData[0]?.[field]);
        
        if (missingFields.length > 0) {
          setImportStatus({
            type: 'error',
            message: `Missing required fields: ${missingFields.join(', ')}`
          });
          return;
        }

        // Process each row with validation
        const validatedPatients = jsonData.map((row: any) => {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(row.email)) {
            throw new Error(`Invalid email format for ${row.name}`);
          }

          // Validate phone format
          const phoneRegex = /^\+?[\d\s-]{10,}$/;
          if (!phoneRegex.test(row.phone)) {
            throw new Error(`Invalid phone format for ${row.name}`);
          }

          // Validate age
          const age = parseInt(row.age);
          if (isNaN(age) || age < 0 || age > 120) {
            throw new Error(`Invalid age for ${row.name}`);
          }

          // Validate gender
          const validGenders = ['Male', 'Female', 'Other'];
          if (!validGenders.includes(row.gender)) {
            throw new Error(`Invalid gender for ${row.name}`);
          }

          // Validate blood group
          const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
          if (row.bloodGroup && !validBloodGroups.includes(row.bloodGroup)) {
            throw new Error(`Invalid blood group for ${row.name}`);
          }

          // Return validated patient data
          return {
            name: row.name,
            email: row.email,
            phone: row.phone,
            age: age,
            gender: row.gender,
            bloodGroup: row.bloodGroup || '',
            address: row.address || '',
            emergencyContact: row.emergencyContact || '',
            insuranceInfo: row.insuranceInfo || '',
            medicalHistory: row.medicalHistory || '',
            assignedDoctor: row.assignedDoctor || '',
            status: row.status || 'active',
            loginCredentials: {
              username: row.username || row.email,
              password: row.password || 'defaultPassword123'
            }
          };
        });

        setImportProgress(prev => ({ ...prev, total: validatedPatients.length }));

        // Import or update patients based on mode
        const response = importMode === 'new' 
          ? await apiService.importPatients(validatedPatients)
          : await apiService.updatePatientsFromExcel(validatedPatients);

        setImportProgress(prev => ({ ...prev, processed: validatedPatients.length, status: 'completed' }));
        
        // Update the patients list
        if (importMode === 'new') {
          setPatients(prev => [...prev, ...response.data]);
        } else {
          setPatients(prev => {
            const updatedPatients = [...prev];
            response.data.forEach(newPatient => {
              const index = updatedPatients.findIndex(p => p.email === newPatient.email);
              if (index !== -1) {
                updatedPatients[index] = newPatient;
              } else {
                updatedPatients.push(newPatient);
              }
            });
            return updatedPatients;
          });
        }

        setImportStatus({
          type: 'success',
          message: `Successfully ${importMode === 'new' ? 'imported' : 'updated'} ${validatedPatients.length} patients`
        });
        onPatientUpdated();
      } catch (error) {
        setImportProgress(prev => ({ ...prev, status: 'error' }));
        setImportStatus({
          type: 'error',
          message: error.message || "Failed to process Excel file"
        });
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExportPatients = async () => {
    try {
      const response = await apiService.exportPatients();
      const patients = response.data;

      const worksheet = utils.json_to_sheet(patients);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Patients");

      // Generate Excel file
      writeFile(workbook, "patients_export.xlsx");

      setImportStatus({
        type: 'success',
        message: 'Patients exported successfully'
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to export patients'
      });
    }
  };

  const handleDeletePatientsByEmails = async (emails: string[]) => {
    if (window.confirm(`Are you sure you want to delete ${emails.length} patients? This action cannot be undone.`)) {
      try {
        await apiService.deletePatientsByEmails(emails);
        setPatients(prev => prev.filter(p => !emails.includes(p.email)));
        setImportStatus({
          type: 'success',
          message: `Successfully deleted ${emails.length} patients`
        });
        onPatientUpdated();
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Failed to delete patients'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      medicalHistory: "",
      assignedDoctor: "",
      address: "",
      bloodGroup: "",
      emergencyContact: "",
      insuranceInfo: "",
      status: "active",
      username: "",
      password: ""
    });
    setSelectedPatient(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Patient Management</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportPatients}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <div className="relative">
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
                id="excel-import"
              />
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Label htmlFor="excel-import" className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Label>
                </Button>
                <select
                  value={importMode}
                  onChange={(e) => setImportMode(e.target.value as 'new' | 'update')}
                  className="px-2 py-1 border rounded"
                >
                  <option value="new">Import New</option>
                  <option value="update">Update Existing</option>
                </select>
              </div>
            </div>
            <Button variant="outline" onClick={handleDeleteAllPatients}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPatient ? "Edit Patient" : "Add New Patient"}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Input
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      placeholder="Male/Female"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      placeholder="A+, B-, O+, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main St, City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insuranceInfo">Insurance Info</Label>
                    <Input
                      id="insuranceInfo"
                      value={formData.insuranceInfo}
                      onChange={(e) => setFormData({ ...formData, insuranceInfo: e.target.value })}
                      placeholder="Insurance Provider & Policy Number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Input
                      id="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      placeholder="Previous conditions"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                    <Input
                      id="assignedDoctor"
                      value={formData.assignedDoctor}
                      onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                      placeholder="Dr. Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Login Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Login Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="password"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={() => selectedPatient ? handleUpdatePatient(selectedPatient.id) : handleCreatePatient()} 
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : selectedPatient ? "Update" : "Create"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {importStatus.type && (
          <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
            importStatus.type === 'success' ? 'bg-green-50 text-green-800' :
            importStatus.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-yellow-50 text-yellow-800'
          }`}>
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : importStatus.type === 'error' ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <p>{importStatus.message}</p>
          </div>
        )}
        {importProgress.status === 'processing' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Processing {importProgress.processed} of {importProgress.total} patients
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((importProgress.processed / importProgress.total) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(importProgress.processed / importProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Vital Signs</TableHead>
                <TableHead>Health Status</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">No patients found. Import an Excel file to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                patients
                  .filter(patient => 
                    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    patient.phone.includes(searchQuery)
                  )
                  .map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>
                        <VitalSignsBadge vitalSigns={patient.vitalSigns} />
                      </TableCell>
                      <TableCell>
                        <HealthStatusBadge patient={patient} />
                      </TableCell>
                      <TableCell>{patient.assignedDoctor}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {patient.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedPatient(patient);
                              setFormData({
                                name: patient.name,
                                email: patient.email,
                                phone: patient.phone,
                                age: patient.age.toString(),
                                gender: patient.gender,
                                medicalHistory: patient.medicalHistory,
                                assignedDoctor: patient.assignedDoctor || "",
                                address: patient.address || "",
                                bloodGroup: patient.bloodGroup || "",
                                emergencyContact: patient.emergencyContact || "",
                                insuranceInfo: patient.insuranceInfo || "",
                                status: patient.status,
                                username: patient.loginCredentials?.username || "",
                                password: patient.loginCredentials?.password || ""
                              });
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowCredentials(showCredentials === patient.id ? null : patient.id)}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPatientForHealth(patient)}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedPatientForDetails(patient)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        {showCredentials === patient.id && patient.loginCredentials && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-md">
                            <p className="text-sm"><strong>Username:</strong> {patient.loginCredentials.username}</p>
                            <p className="text-sm"><strong>Password:</strong> {patient.loginCredentials.password}</p>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {selectedPatientForHealth && (
        <HealthDetailsDialog
          patient={selectedPatientForHealth}
          isOpen={!!selectedPatientForHealth}
          onClose={() => setSelectedPatientForHealth(null)}
        />
      )}

      {selectedPatientForDetails && (
        <PatientDetailsDialog
          patient={selectedPatientForDetails}
          isOpen={!!selectedPatientForDetails}
          onClose={() => setSelectedPatientForDetails(null)}
        />
      )}
    </Card>
  );
} 
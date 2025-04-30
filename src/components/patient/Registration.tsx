import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import apiService from "@/services/api";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
    
    // Medical Information
    medicalHistory: "",
    allergies: "",
    chronicConditions: "",
    medications: "",
    
    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    coverageType: "",
    
    // Lifestyle Information
    smokingStatus: "",
    alcoholConsumption: "",
    exerciseFrequency: "",
    dietType: "",
    
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    emergencyContactAddress: "",
    
    // Preferences
    preferredPharmacy: "",
    preferredHospital: "",
    languagePreference: "",
    communicationPreference: "",
    
    // Login Credentials
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Passwords do not match"
        });
        return;
      }

      // Prepare patient data
      const patientData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: parseInt(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        status: 'active',
        loginCredentials: {
          username: formData.username,
          password: formData.password
        },
        allergies: formData.allergies.split(',').map(allergy => ({
          allergen: allergy.trim(),
          reaction: 'Unknown',
          severity: 'mild'
        })),
        chronicConditions: formData.chronicConditions.split(',').map(condition => ({
          condition: condition.trim(),
          diagnosisDate: new Date().toISOString(),
          severity: 'mild',
          status: 'active'
        })),
        medications: formData.medications.split(',').map(medication => ({
          name: medication.trim(),
          dosage: 'As prescribed',
          frequency: 'Daily',
          startDate: new Date().toISOString(),
          prescribedBy: 'Primary Care Physician'
        })),
        insuranceDetails: {
          provider: formData.insuranceProvider,
          policyNumber: formData.policyNumber,
          groupNumber: formData.groupNumber,
          coverageType: formData.coverageType,
          effectiveDate: new Date().toISOString(),
          expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        },
        lifestyleFactors: {
          smoking: {
            status: formData.smokingStatus
          },
          alcohol: {
            status: formData.alcoholConsumption
          },
          exercise: {
            frequency: formData.exerciseFrequency,
            type: ['General']
          },
          diet: {
            type: formData.dietType
          }
        },
        emergencyContacts: [
          {
            name: formData.emergencyContactName,
            relationship: formData.emergencyContactRelationship,
            phone: formData.emergencyContactPhone,
            address: formData.emergencyContactAddress
          }
        ],
        preferredPharmacy: {
          name: formData.preferredPharmacy
        },
        preferredHospital: {
          name: formData.preferredHospital
        },
        languagePreference: formData.languagePreference,
        communicationPreference: formData.communicationPreference,
        privacySettings: {
          shareWithFamily: true,
          shareWithDoctors: true,
          shareWithInsurance: true
        }
      };

      // Create patient
      await apiService.createPatient(patientData);

      toast({
        title: "Success",
        description: "Registration successful! You can now log in."
      });

      // Redirect to login
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Registration failed. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select
                  value={formData.bloodGroup}
                  onValueChange={(value) => handleSelectChange('bloodGroup', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  placeholder="Enter your medical history"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  placeholder="e.g., Penicillin, Pollen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Chronic Conditions (comma-separated)</Label>
                <Input
                  id="chronicConditions"
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleInputChange}
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                <Input
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  placeholder="e.g., Lisinopril, Metformin"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Insurance Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  name="policyNumber"
                  value={formData.policyNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  name="groupNumber"
                  value={formData.groupNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverageType">Coverage Type</Label>
                <Select
                  value={formData.coverageType}
                  onValueChange={(value) => handleSelectChange('coverageType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select coverage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PPO">PPO</SelectItem>
                    <SelectItem value="HMO">HMO</SelectItem>
                    <SelectItem value="EPO">EPO</SelectItem>
                    <SelectItem value="POS">POS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lifestyle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Lifestyle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smokingStatus">Smoking Status</Label>
                <Select
                  value={formData.smokingStatus}
                  onValueChange={(value) => handleSelectChange('smokingStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select smoking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never Smoked</SelectItem>
                    <SelectItem value="former">Former Smoker</SelectItem>
                    <SelectItem value="current">Current Smoker</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <Select
                  value={formData.alcoholConsumption}
                  onValueChange={(value) => handleSelectChange('alcoholConsumption', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select alcohol consumption" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                <Select
                  value={formData.exerciseFrequency}
                  onValueChange={(value) => handleSelectChange('exerciseFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exercise frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasional">Occasional</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dietType">Diet Type</Label>
                <Select
                  value={formData.dietType}
                  onValueChange={(value) => handleSelectChange('dietType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select diet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactAddress">Address</Label>
                <Input
                  id="emergencyContactAddress"
                  name="emergencyContactAddress"
                  value={formData.emergencyContactAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredPharmacy">Preferred Pharmacy</Label>
                <Input
                  id="preferredPharmacy"
                  name="preferredPharmacy"
                  value={formData.preferredPharmacy}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredHospital">Preferred Hospital</Label>
                <Input
                  id="preferredHospital"
                  name="preferredHospital"
                  value={formData.preferredHospital}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="languagePreference">Language Preference</Label>
                <Select
                  value={formData.languagePreference}
                  onValueChange={(value) => handleSelectChange('languagePreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="communicationPreference">Communication Preference</Label>
                <Select
                  value={formData.communicationPreference}
                  onValueChange={(value) => handleSelectChange('communicationPreference', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Login Credentials */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Login Credentials</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
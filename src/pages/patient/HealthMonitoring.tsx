import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Heart, Thermometer, Droplet, Scale, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/api";

interface VitalSign {
  date: string;
  systolic?: number;
  diastolic?: number;
  rate?: number;
  temp?: number;
  weight?: number;
}

interface VitalSignsData {
  bloodPressure: VitalSign[];
  heartRate: VitalSign[];
  temperature: VitalSign[];
  weight: VitalSign[];
}

export default function HealthMonitoring() {
  const { toast } = useToast();
  const [vitalSigns, setVitalSigns] = useState<VitalSignsData>({
    bloodPressure: [],
    heartRate: [],
    temperature: [],
    weight: []
  });

  const [newReading, setNewReading] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    weight: ""
  });

  // Fetch initial data
  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        const data = await apiService.getVitalSigns();
        setVitalSigns(data);
      } catch (error) {
        console.error('Error fetching vital signs:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch vital signs data',
          variant: 'destructive',
        });
      }
    };
    fetchVitalSigns();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReading(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newVitalSigns = {
        date: today,
        systolic: newReading.systolic ? parseInt(newReading.systolic) : undefined,
        diastolic: newReading.diastolic ? parseInt(newReading.diastolic) : undefined,
        rate: newReading.heartRate ? parseInt(newReading.heartRate) : undefined,
        temp: newReading.temperature ? parseFloat(newReading.temperature) : undefined,
        weight: newReading.weight ? parseFloat(newReading.weight) : undefined
      };

      // Save to database
      await apiService.addVitalSigns(newVitalSigns);

      // Update local state
      const updatedVitalSigns = { ...vitalSigns };
      
      if (newReading.systolic && newReading.diastolic) {
        updatedVitalSigns.bloodPressure = [
          ...updatedVitalSigns.bloodPressure,
          { date: today, systolic: parseInt(newReading.systolic), diastolic: parseInt(newReading.diastolic) }
        ];
      }

      if (newReading.heartRate) {
        updatedVitalSigns.heartRate = [
          ...updatedVitalSigns.heartRate,
          { date: today, rate: parseInt(newReading.heartRate) }
        ];
      }

      if (newReading.temperature) {
        updatedVitalSigns.temperature = [
          ...updatedVitalSigns.temperature,
          { date: today, temp: parseFloat(newReading.temperature) }
        ];
      }

      if (newReading.weight) {
        updatedVitalSigns.weight = [
          ...updatedVitalSigns.weight,
          { date: today, weight: parseFloat(newReading.weight) }
        ];
      }

      setVitalSigns(updatedVitalSigns);
      setNewReading({ systolic: "", diastolic: "", heartRate: "", temperature: "", weight: "" });

      toast({
        title: 'Success',
        description: 'New readings added successfully',
      });
    } catch (error) {
      console.error('Error adding new readings:', error);
      toast({
        title: 'Error',
        description: 'Failed to add new readings',
        variant: 'destructive',
      });
    }
  };

  // Calculate current metrics from the latest readings
  const currentMetrics = {
    bloodPressure: vitalSigns.bloodPressure.length > 0 
      ? `${vitalSigns.bloodPressure[vitalSigns.bloodPressure.length - 1].systolic}/${vitalSigns.bloodPressure[vitalSigns.bloodPressure.length - 1].diastolic} mmHg`
      : "No data",
    heartRate: vitalSigns.heartRate.length > 0 
      ? `${vitalSigns.heartRate[vitalSigns.heartRate.length - 1].rate} bpm`
      : "No data",
    temperature: vitalSigns.temperature.length > 0 
      ? `${vitalSigns.temperature[vitalSigns.temperature.length - 1].temp}°F`
      : "No data",
    weight: vitalSigns.weight.length > 0 
      ? `${vitalSigns.weight[vitalSigns.weight.length - 1].weight} kg`
      : "No data"
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Monitoring</h1>
      </div>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Blood Pressure
            </CardTitle>
            <CardDescription>Current Reading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMetrics.bloodPressure}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Heart Rate
            </CardTitle>
            <CardDescription>Current Reading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMetrics.heartRate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Temperature
            </CardTitle>
            <CardDescription>Current Reading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMetrics.temperature}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-green-500" />
              Weight
            </CardTitle>
            <CardDescription>Current Reading</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentMetrics.weight}</p>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data */}
      <Tabs defaultValue="bloodPressure" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bloodPressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
        </TabsList>

        <TabsContent value="bloodPressure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure History</CardTitle>
              <CardDescription>Last 5 readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalSigns.bloodPressure}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#ef4444" />
                    <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heartRate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate History</CardTitle>
              <CardDescription>Last 5 readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalSigns.heartRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temperature History</CardTitle>
              <CardDescription>Last 5 readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalSigns.temperature}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temp" stroke="#f97316" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
              <CardDescription>Last 5 readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalSigns.weight}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#22c55e" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button (FAB) */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-8 right-8 rounded-full h-12 w-12 shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reading</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Blood Pressure (Systolic/Diastolic)</Label>
              <div className="flex gap-2">
                <Input name="systolic" placeholder="Systolic" value={newReading.systolic} onChange={handleInputChange} />
                <Input name="diastolic" placeholder="Diastolic" value={newReading.diastolic} onChange={handleInputChange} />
              </div>
            </div>
            <div>
              <Label>Heart Rate (bpm)</Label>
              <Input name="heartRate" placeholder="Heart Rate" value={newReading.heartRate} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Temperature (°F)</Label>
              <Input name="temperature" placeholder="Temperature" value={newReading.temperature} onChange={handleInputChange} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <Input name="weight" placeholder="Weight" value={newReading.weight} onChange={handleInputChange} />
            </div>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

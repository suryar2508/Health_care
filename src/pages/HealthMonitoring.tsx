
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, LineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

// Mock data for health metrics
const bloodPressureData = [
  { date: "Apr 15", systolic: 125, diastolic: 82 },
  { date: "Apr 16", systolic: 128, diastolic: 84 },
  { date: "Apr 17", systolic: 130, diastolic: 86 },
  { date: "Apr 18", systolic: 126, diastolic: 83 },
  { date: "Apr 19", systolic: 124, diastolic: 81 },
  { date: "Apr 20", systolic: 127, diastolic: 83 },
  { date: "Apr 21", systolic: 125, diastolic: 82 },
];

const heartRateData = [
  { date: "Apr 15", value: 72 },
  { date: "Apr 16", value: 74 },
  { date: "Apr 17", value: 76 },
  { date: "Apr 18", value: 73 },
  { date: "Apr 19", value: 71 },
  { date: "Apr 20", value: 75 },
  { date: "Apr 21", value: 72 },
];

const bloodOxygenData = [
  { date: "Apr 15", value: 98 },
  { date: "Apr 16", value: 97 },
  { date: "Apr 17", value: 98 },
  { date: "Apr 18", value: 99 },
  { date: "Apr 19", value: 98 },
  { date: "Apr 20", value: 97 },
  { date: "Apr 21", value: 98 },
];

const temperatureData = [
  { date: "Apr 15", value: 36.8 },
  { date: "Apr 16", value: 36.9 },
  { date: "Apr 17", value: 37.1 },
  { date: "Apr 18", value: 37.0 },
  { date: "Apr 19", value: 36.8 },
  { date: "Apr 20", value: 36.7 },
  { date: "Apr 21", value: 36.8 },
];

const HealthMonitoring = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null
  );
  
  const [newReading, setNewReading] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    bloodOxygen: "",
    temperature: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReading({
      ...newReading,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReading = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reading submitted",
      description: "Your health metrics have been recorded",
    });
    // Clear the form
    setNewReading({
      systolic: "",
      diastolic: "",
      heartRate: "",
      bloodOxygen: "",
      temperature: "",
    });
  };

  return (
    <Layout userName={userData?.name} userRole={userData?.role}>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Health Monitoring</h2>
          <Button>Export Health Data</Button>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
            <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
            <TabsTrigger value="oxygen">Blood Oxygen</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
            <TabsTrigger value="add-reading">Add Reading</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Blood Pressure History</CardTitle>
                  <CardDescription>Your blood pressure readings over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bloodPressureData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4c9aff" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4c9aff" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#50C878" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#50C878" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis domain={[60, 150]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="systolic" stroke="#4c9aff" fillOpacity={1} fill="url(#colorSystolic)" />
                      <Area type="monotone" dataKey="diastolic" stroke="#50C878" fillOpacity={1} fill="url(#colorDiastolic)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate</CardTitle>
                  <CardDescription>Beats per minute (BPM)</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={heartRateData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[50, 100]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#FF9F5A" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blood Oxygen</CardTitle>
                  <CardDescription>Oxygen saturation (%)</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bloodOxygenData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[90, 100]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#4c9aff" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Body Temperature</CardTitle>
                  <CardDescription>Measured in Celsius (°C)</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={temperatureData}>
                      <XAxis dataKey="date" />
                      <YAxis domain={[35, 38]} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#FF9F5A" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="blood-pressure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure History</CardTitle>
                <CardDescription>Detailed view of your blood pressure readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Blood pressure detailed view content will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="heart-rate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate History</CardTitle>
                <CardDescription>Detailed view of your heart rate readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Heart rate detailed view content will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="oxygen" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Blood Oxygen History</CardTitle>
                <CardDescription>Detailed view of your blood oxygen readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Blood oxygen detailed view content will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="temperature" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature History</CardTitle>
                <CardDescription>Detailed view of your body temperature readings</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Temperature detailed view content will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-reading" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Health Reading</CardTitle>
                <CardDescription>Input your latest health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReading} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Systolic Pressure (mmHg)</Label>
                      <Input
                        id="systolic"
                        name="systolic"
                        type="number"
                        placeholder="e.g. 120"
                        value={newReading.systolic}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Diastolic Pressure (mmHg)</Label>
                      <Input
                        id="diastolic"
                        name="diastolic"
                        type="number"
                        placeholder="e.g. 80"
                        value={newReading.diastolic}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                      <Input
                        id="heartRate"
                        name="heartRate"
                        type="number"
                        placeholder="e.g. 72"
                        value={newReading.heartRate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodOxygen">Blood Oxygen (%)</Label>
                      <Input
                        id="bloodOxygen"
                        name="bloodOxygen"
                        type="number"
                        placeholder="e.g. 98"
                        value={newReading.bloodOxygen}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <Input
                        id="temperature"
                        name="temperature"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 36.8"
                        value={newReading.temperature}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <Button type="submit">Submit Reading</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HealthMonitoring;


import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, ResponsiveContainer } from "recharts";
import { mockHealthMetrics } from "@/utils/mockData";

export function HealthMetricsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics History</CardTitle>
        <CardDescription>Your health measurements over time</CardDescription>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockHealthMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateRecorded" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="bloodPressure.systolic" 
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Systolic BP"
            />
            <Area 
              type="monotone" 
              dataKey="bloodPressure.diastolic" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="Diastolic BP"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

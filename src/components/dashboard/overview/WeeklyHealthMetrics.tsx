
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar } from "recharts";
import { mockHealthMetrics } from "@/utils/mockData";

export function WeeklyHealthMetrics() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Weekly Health Metrics</CardTitle>
        <CardDescription>
          Your blood pressure and heart rate over the past week
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockHealthMetrics}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSystolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4c9aff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4c9aff" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorDiastolic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#50C878" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#50C878" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9F5A" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF9F5A" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Bar dataKey="systolic" stroke="#4c9aff" fill="url(#colorSystolic)" name="Systolic" />
            <Bar dataKey="diastolic" stroke="#50C878" fill="url(#colorDiastolic)" name="Diastolic" />
            <Bar dataKey="heart" stroke="#FF9F5A" fill="url(#colorHeart)" name="Heart Rate" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

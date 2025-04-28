import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface HealthMetric {
  date: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number;
  bloodOxygen: number;
  temperature: number;
}

interface WeeklyHealthMetricsProps {
  patientId: string;
}

export const WeeklyHealthMetrics: React.FC<WeeklyHealthMetricsProps> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState('blood-pressure');
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate sample health metrics data
  useEffect(() => {
    const generateMetrics = () => {
      const today = new Date();
      const metricsData: HealthMetric[] = [];
      
      // Generate 7 days of data
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, i);
        
        // Generate random values around normal ranges with some variation
        const systolic = Math.floor(Math.random() * 20) + 110; // 110-130
        const diastolic = Math.floor(Math.random() * 10) + 75; // 75-85
        const heartRate = Math.floor(Math.random() * 20) + 60; // 60-80
        const bloodOxygen = Math.floor(Math.random() * 3) + 97; // 97-99
        const temperature = (Math.random() * 0.4 + 36.5).toFixed(1); // 36.5-36.9
        
        metricsData.push({
          date: date.toISOString(),
          bloodPressure: { systolic, diastolic },
          heartRate,
          bloodOxygen,
          temperature: parseFloat(temperature)
        });
      }
      
      setMetrics(metricsData);
      generateAlerts(metricsData);
      setLoading(false);
    };

    generateMetrics();
  }, [patientId]);

  // Generate alerts based on metrics
  const generateAlerts = (metricsData: HealthMetric[]) => {
    if (!metricsData || metricsData.length === 0) {
      setAlerts(['No health metrics available.']);
      return;
    }

    const newAlerts: string[] = [];
    const latestMetrics = metricsData[0];

    // Check blood pressure
    if (latestMetrics.bloodPressure.systolic > 140 || latestMetrics.bloodPressure.diastolic > 90) {
      newAlerts.push('Blood pressure is elevated. Consider reducing salt intake and stress.');
    } else if (latestMetrics.bloodPressure.systolic < 90 || latestMetrics.bloodPressure.diastolic < 60) {
      newAlerts.push('Blood pressure is low. Ensure adequate hydration and consult a healthcare provider if symptoms persist.');
    }

    // Check heart rate
    if (latestMetrics.heartRate > 100) {
      newAlerts.push('Heart rate is elevated. Consider reducing caffeine intake and stress.');
    } else if (latestMetrics.heartRate < 50) {
      newAlerts.push('Heart rate is low. Consult a healthcare provider if symptoms persist.');
    }

    // Check blood oxygen
    if (latestMetrics.bloodOxygen < 95) {
      newAlerts.push('Blood oxygen level is below normal. Consider consulting a healthcare provider.');
    }

    // Check temperature
    if (latestMetrics.temperature > 37.5) {
      newAlerts.push('Temperature is elevated. Monitor for other symptoms and consider consulting a healthcare provider.');
    }

    setAlerts(newAlerts);
  };

  // Get trend analysis for a metric
  const getTrendAnalysis = (metricName: string) => {
    if (!metrics || metrics.length < 2) return { trend: 'stable', value: 0 };

    const latestValue = getMetricValue(metrics[0], metricName);
    const previousValue = getMetricValue(metrics[1], metricName);
    
    const difference = latestValue - previousValue;
    const percentChange = (difference / previousValue) * 100;
    
    let trend = 'stable';
    if (percentChange > 5) trend = 'increasing';
    else if (percentChange < -5) trend = 'decreasing';
    
    return { trend, value: percentChange.toFixed(1) };
  };

  // Helper function to get metric value
  const getMetricValue = (metric: HealthMetric, metricName: string): number => {
    switch (metricName) {
      case 'blood-pressure':
        return metric.bloodPressure.systolic;
      case 'heart-rate':
        return metric.heartRate;
      case 'blood-oxygen':
        return metric.bloodOxygen;
      case 'temperature':
        return metric.temperature;
      default:
        return 0;
    }
  };

  // Render trend icon
  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Render metric chart
  const renderMetricChart = (metricName: string) => {
    if (loading) return <div className="h-40 flex items-center justify-center">Loading...</div>;
    
    const { trend, value } = getTrendAnalysis(metricName);
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {renderTrendIcon(trend)}
            <span className="font-medium">
              {trend.charAt(0).toUpperCase() + trend.slice(1)} 
              {trend !== 'stable' && ` by ${value}%`}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            Last 7 days
          </span>
        </div>
        
        <div className="h-40 flex items-end gap-1">
          {metrics.map((metric, index) => {
            const value = getMetricValue(metric, metricName);
            const maxValue = metricName === 'blood-pressure' ? 180 : 
                            metricName === 'heart-rate' ? 120 : 
                            metricName === 'blood-oxygen' ? 100 : 40;
            
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm" 
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs mt-1">{format(new Date(metric.date), 'MM/dd')}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {alerts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Health Alerts</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4">
              {alerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
          <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
          <TabsTrigger value="blood-oxygen">Blood Oxygen</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>
        <TabsContent value="blood-pressure" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetricChart('blood-pressure')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heart-rate" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetricChart('heart-rate')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="blood-oxygen" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Oxygen Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetricChart('blood-oxygen')}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="temperature" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Temperature Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetricChart('temperature')}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

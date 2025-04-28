import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appointment } from '@/types/patient';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AppointmentStatsProps {
  appointments: Appointment[];
}

export const AppointmentStats: React.FC<AppointmentStatsProps> = ({ appointments }) => {
  // Calculate monthly statistics
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Prepare data for monthly appointments chart
  const monthlyData = daysInMonth.map(day => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return format(aptDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }).length;
  });

  // Calculate appointment type distribution
  const typeDistribution = appointments.reduce((acc, apt) => {
    acc[apt.type] = (acc[apt.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate status distribution
  const statusDistribution = appointments.reduce((acc, apt) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Chart configurations
  const monthlyChartData = {
    labels: daysInMonth.map(day => format(day, 'd')),
    datasets: [
      {
        label: 'Appointments',
        data: monthlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  const typeChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        label: 'Appointment Types',
        data: Object.values(typeDistribution),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: Object.keys(statusDistribution),
    datasets: [
      {
        label: 'Appointment Status',
        data: Object.values(statusDistribution),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(245, 158, 11, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Appointment Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
            <TabsTrigger value="types">Appointment Types</TabsTrigger>
            <TabsTrigger value="status">Status Distribution</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <div className="h-[300px]">
              <Line
                data={monthlyChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: `Appointments in ${format(currentMonth, 'MMMM yyyy')}`,
                    },
                  },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="types" className="space-y-4">
            <div className="h-[300px]">
              <Bar
                data={typeChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Appointment Types Distribution',
                    },
                  },
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="h-[300px]">
              <Bar
                data={statusChartData}
                options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    title: {
                      display: true,
                      text: 'Appointment Status Distribution',
                    },
                  },
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 
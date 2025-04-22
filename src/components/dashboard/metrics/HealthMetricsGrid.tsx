
import { HealthVitalsCard } from "@/components/health/HealthVitalsCard";
import { mockHealthMetrics } from "@/utils/mockData";

export function HealthMetricsGrid() {
  const latestMetric = mockHealthMetrics[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <HealthVitalsCard
        title="Blood Pressure"
        value={`${latestMetric.bloodPressure.systolic}/${latestMetric.bloodPressure.diastolic}`}
        unit="mmHg"
        status={
          latestMetric.bloodPressure.systolic < 120 && latestMetric.bloodPressure.diastolic < 80 
            ? "normal" 
            : latestMetric.bloodPressure.systolic >= 140 || latestMetric.bloodPressure.diastolic >= 90 
              ? "critical" 
              : "warning"
        }
        icon="heart"
        change="Based on last reading"
      />
      <HealthVitalsCard
        title="Heart Rate"
        value={latestMetric.heartRate.toString()}
        unit="bpm"
        status={
          latestMetric.heartRate >= 60 && latestMetric.heartRate <= 100 
            ? "normal" 
            : "warning"
        }
        icon="heart"
        change="Current reading"
      />
      <HealthVitalsCard
        title="Blood Oxygen"
        value={latestMetric.bloodOxygen.toString()}
        unit="%"
        status={latestMetric.bloodOxygen >= 95 ? "normal" : "critical"}
        icon="heart"
        change="Current reading"
      />
      <HealthVitalsCard
        title="Temperature"
        value={latestMetric.temperature.toString()}
        unit="°C"
        status={
          latestMetric.temperature >= 36.5 && latestMetric.temperature <= 37.5 
            ? "normal" 
            : "warning"
        }
        icon="thermometer"
        change="Current reading"
      />
    </div>
  );
}

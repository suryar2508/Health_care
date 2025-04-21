
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, Thermometer, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type HealthVitalsCardProps = {
  title: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "critical";
  change?: string;
  icon?: "heart" | "thermometer";
};

export function HealthVitalsCard({
  title,
  value,
  unit,
  status,
  change,
  icon = "heart",
}: HealthVitalsCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "warning":
        return "text-healthcare-warning";
      case "critical":
        return "text-healthcare-danger";
      case "normal":
      default:
        return "text-healthcare-success";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-healthcare-warning" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-healthcare-danger" />;
      case "normal":
      default:
        return <Check className="h-4 w-4 text-healthcare-success" />;
    }
  };

  const getIcon = () => {
    switch (icon) {
      case "thermometer":
        return (
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Thermometer className="h-4 w-4" />
          </div>
        );
      case "heart":
      default:
        return (
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Heart className="h-4 w-4" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium leading-none">{title}</p>
          {getIcon()}
        </div>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{value}</p>
            <p className="ml-1 text-sm text-muted-foreground">{unit}</p>
          </div>
          <div className="flex items-center">
            {getStatusIcon()}
          </div>
        </div>
      </CardContent>
      {change && (
        <CardFooter className="p-2 pt-0">
          <p className="text-xs text-muted-foreground">{change}</p>
        </CardFooter>
      )}
    </Card>
  );
}

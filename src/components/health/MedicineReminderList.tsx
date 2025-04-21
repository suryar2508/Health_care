
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Mock data for medicine reminders
const initialReminders = [
  {
    id: 1,
    medicine: "Amoxicillin",
    dosage: "500mg",
    time: "08:00 AM",
    taken: false,
  },
  {
    id: 2,
    medicine: "Lisinopril",
    dosage: "10mg",
    time: "12:00 PM",
    taken: false,
  },
  {
    id: 3,
    medicine: "Metformin",
    dosage: "850mg",
    time: "06:00 PM",
    taken: false,
  },
  {
    id: 4,
    medicine: "Vitamin D",
    dosage: "2000 IU",
    time: "08:00 PM",
    taken: false,
  },
];

export function MedicineReminderList() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState(initialReminders);

  const markAsTaken = (id: number) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, taken: true } : reminder
    );
    setReminders(updatedReminders);
    
    const medicine = reminders.find((r) => r.id === id)?.medicine;
    toast({
      title: "Medicine marked as taken",
      description: `You've taken ${medicine} successfully`,
    });
  };

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          className={cn(
            "flex items-center justify-between p-3 border rounded-md",
            reminder.taken
              ? "bg-muted/50 border-muted"
              : "bg-card border-border"
          )}
        >
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                reminder.taken
                  ? "bg-healthcare-success"
                  : "bg-healthcare-warning"
              )}
            />
            <div>
              <p className="font-medium">{reminder.medicine}</p>
              <div className="text-sm text-muted-foreground">
                {reminder.dosage} at {reminder.time}
              </div>
            </div>
          </div>
          {!reminder.taken && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAsTaken(reminder.id)}
            >
              Mark as Taken
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

// Helper function from utils
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

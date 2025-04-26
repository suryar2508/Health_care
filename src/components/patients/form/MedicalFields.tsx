
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MedicalFieldsProps {
  formData: {
    condition: string;
    lastVisit: string;
    medicalHistory?: string;
    notes?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function MedicalFields({ formData, handleChange }: MedicalFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="condition" className="text-right">Condition</Label>
        <Input
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastVisit" className="text-right">Last Visit</Label>
        <Input
          id="lastVisit"
          name="lastVisit"
          type="date"
          value={formData.lastVisit}
          onChange={handleChange}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="medicalHistory" className="text-right">Medical History</Label>
        <Textarea
          id="medicalHistory"
          name="medicalHistory"
          value={formData.medicalHistory}
          onChange={handleChange}
          className="col-span-3"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="notes" className="text-right">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="col-span-3"
          rows={3}
        />
      </div>
    </>
  );
}

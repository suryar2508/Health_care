
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ContactFieldsProps {
  formData: {
    address: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function ContactFields({ formData, handleChange }: ContactFieldsProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="address" className="text-right">Address</Label>
      <Textarea
        id="address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="col-span-3"
        rows={2}
      />
    </div>
  );
}

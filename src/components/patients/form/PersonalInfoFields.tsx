
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup: string;
    phoneNumber: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function PersonalInfoFields({ formData, handleChange }: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input
          id="name"
          name="name" 
          value={formData.name}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dateOfBirth" className="text-right">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="gender" className="text-right">Gender</Label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="bloodGroup" className="text-right">Blood Group</Label>
        <select
          id="bloodGroup"
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phoneNumber" className="text-right">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="col-span-3"
          required
        />
      </div>
    </>
  );
}

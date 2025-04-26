
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PatientSearchBar({ searchQuery, onSearchChange }: PatientSearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Input 
        type="search" 
        placeholder="Search patients..." 
        className="w-full" 
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

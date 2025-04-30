import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Stethoscope, Pill, UserCog, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/services/api";

interface RegisterFormProps {
  onToggleMode: () => void;
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as "admin" | "doctor" | "patient" | "pharmacist" | "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });

      // Redirect to login
      onToggleMode();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: "admin" | "doctor" | "patient" | "pharmacist") => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up to get started with SmartVital</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Role Selection */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={cn(
              "flex flex-col items-center space-y-2 transition-all duration-200",
              "hover:scale-105 hover:opacity-90",
              formData.role === 'admin' && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div className={cn(
              "p-3 rounded-full transition-colors duration-200",
              formData.role === 'admin' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}>
              <UserCog className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('doctor')}
            className={cn(
              "flex flex-col items-center space-y-2 transition-all duration-200",
              "hover:scale-105 hover:opacity-90",
              formData.role === 'doctor' && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div className={cn(
              "p-3 rounded-full transition-colors duration-200",
              formData.role === 'doctor' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}>
              <Stethoscope className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Doctor</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('patient')}
            className={cn(
              "flex flex-col items-center space-y-2 transition-all duration-200",
              "hover:scale-105 hover:opacity-90",
              formData.role === 'patient' && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div className={cn(
              "p-3 rounded-full transition-colors duration-200",
              formData.role === 'patient' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}>
              <User className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Patient</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('pharmacist')}
            className={cn(
              "flex flex-col items-center space-y-2 transition-all duration-200",
              "hover:scale-105 hover:opacity-90",
              formData.role === 'pharmacist' && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <div className={cn(
              "p-3 rounded-full transition-colors duration-200",
              formData.role === 'pharmacist' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
            )}>
              <Pill className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium">Pharmacist</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.role}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full"
          onClick={onToggleMode}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </CardFooter>
    </Card>
  );
}

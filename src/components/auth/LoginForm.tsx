import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Shield } from "lucide-react";

const defaultCredentials = {
  Patient: { email: "patient@example.com", password: "patient123" },
  Doctor: { email: "doctor@example.com", password: "doctor123" },
  Admin: { email: "admin@example.com", password: "admin123" },
  Pharmacy: { email: "pharmacy@example.com", password: "pharmacy123" },
};

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    const defaultCred = defaultCredentials[role as keyof typeof defaultCredentials];
    setFormData({
      email: defaultCred.email,
      password: defaultCred.password,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Role required",
        description: "Please select a role to continue",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      // Check if the entered credentials match the default credentials for the selected role
      const defaultCred = defaultCredentials[selectedRole as keyof typeof defaultCredentials];
      if (formData.email === defaultCred.email && formData.password === defaultCred.password) {
        localStorage.setItem(
          "user",
          JSON.stringify({ name: `${selectedRole} User`, role: selectedRole })
        );

        toast({
          title: "Login successful!",
          description: `Welcome, ${selectedRole}`,
        });

        // Redirect based on role
        if (selectedRole === "Pharmacy") {
          navigate("/pharmacy");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: "Patient", icon: User, label: "Patient Login" },
    { id: "Doctor", icon: User, label: "Doctor Login" },
    { id: "Admin", icon: Shield, label: "Admin Login" },
    { id: "Pharmacy", icon: User, label: "Pharmacy Login" },
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Choose your role and login to your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {roles.map((role) => (
              <Button
                key={role.id}
                type="button"
                variant={selectedRole === role.id ? "default" : "outline"}
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleRoleSelect(role.id)}
              >
                <role.icon className="h-6 w-6" />
                <span className="text-sm">{role.label}</span>
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="px-0"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;

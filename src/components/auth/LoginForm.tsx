
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

const DEMO_ACCOUNTS = [
  {
    label: "Patient",
    email: "patient@example.com",
    password: "password",
    description: "Standard patient access",
  },
  {
    label: "Doctor",
    email: "doctor@example.com",
    password: "password",
    description: "Doctor/Practitioner access",
  },
  {
    label: "Admin",
    email: "admin@example.com",
    password: "password",
    description: "Administrator access",
  },
];

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Prefill with the patient account by default
  const [formData, setFormData] = useState({
    email: DEMO_ACCOUNTS[0].email,
    password: DEMO_ACCOUNTS[0].password,
  });

  // To allow quick copying/prefilling from a demo account list
  const handleSetDemo = (email: string, password: string) => {
    setFormData({ email, password });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is a mock login - in a real app, you'd connect to an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, we'll use some hardcoded users
      let userRole = "";
      let userName = "";

      if (formData.email === "patient@example.com" && formData.password === "password") {
        userRole = "Patient";
        userName = "John Doe";
      } else if (formData.email === "doctor@example.com" && formData.password === "password") {
        userRole = "Doctor";
        userName = "Dr. Sarah Smith";
      } else if (formData.email === "admin@example.com" && formData.password === "password") {
        userRole = "Admin";
        userName = "Admin User";
      } else {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("user", JSON.stringify({ name: userName, role: userRole }));

      toast({
        title: "Login successful!",
        description: `Welcome back, ${userName}`,
      });

      navigate("/dashboard");
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

  return (
    <div>
      <div className="mb-6">
        <Card className="border-2 border-dashed border-primary bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">Demo Accounts</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Use the credentials below to try different roles. Click to prefill login.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <div
                key={acc.label}
                className="flex flex-row items-center gap-4 px-2 py-2 hover:bg-accent rounded cursor-pointer transition"
                onClick={() => handleSetDemo(acc.email, acc.password)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSetDemo(acc.email, acc.password);
                  }
                }}
              >
                <div className="font-semibold min-w-[70px]">{acc.label}:</div>
                <div className="flex flex-col md:flex-row md:gap-2">
                  <span className="text-xs md:text-sm">{acc.email}</span>
                  <span className="text-xs md:text-sm text-muted-foreground">/ {acc.password}</span>
                </div>
                <span className="text-xs text-muted-foreground hidden md:inline ml-2">{acc.description}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  className="px-0 font-normal h-auto"
                  type="button"
                  onClick={() => {
                    toast({
                      title: "Password reset",
                      description: "This feature is not implemented in the demo",
                    });
                  }}
                >
                  Forgot password?
                </Button>
              </div>
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
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="mt-4 text-center text-sm">
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
    </div>
  );
};

export default LoginForm;

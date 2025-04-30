import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { User, Stethoscope, Pill, UserCog, Heart, Shield, Lock, ArrowRight, Activity, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import apiService from "@/services/api";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'doctor' | 'patient' | 'pharmacist' | null>(null);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.login(email, password);

      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to the appropriate dashboard
      const redirectUrl = localStorage.getItem("redirectUrl") || `/${response.user.userType}/dashboard`;
      localStorage.removeItem("redirectUrl");
      navigate(redirectUrl);

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.user.name}!`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleClick = async (userType: 'admin' | 'doctor' | 'patient' | 'pharmacist') => {
    setSelectedRole(userType);
    setIsAutoFilling(true);
    
    // Default credentials for each role
    const credentials = {
      admin: { email: 'admin@smartvital.com', password: 'admin123' },
      doctor: { email: 'doctor@smartvital.com', password: 'doctor123' },
      patient: { email: 'patient@smartvital.com', password: 'patient123' },
      pharmacist: { email: 'pharmacist@smartvital.com', password: 'pharma123' }
    };
    
    const { email, password } = credentials[userType];
    
    // Simulate typing animation
    setEmail("");
    setPassword("");
    
    // Type email
    for (let i = 0; i < email.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setEmail(prev => prev + email[i]);
    }
    
    // Type password
    for (let i = 0; i < password.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setPassword(prev => prev + password[i]);
    }
    
    setIsAutoFilling(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left side - Branding and Info */}
        <div className="flex-1 flex flex-col justify-center space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Heart className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                SmartVital
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Your comprehensive healthcare management solution
            </p>
          </div>
          
          {/* Healthcare Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">Track vital signs and health metrics 24/7</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">Easy appointment booking and management</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">HIPAA Compliant</h3>
                <p className="text-sm text-muted-foreground">Your data is always secure and private</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-colors">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Round-the-clock medical assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login/Register Form */}
        {isRegistering ? (
          <RegisterForm onToggleMode={() => setIsRegistering(false)} />
        ) : (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Welcome Back</CardTitle>
              <CardDescription>Sign in to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Role Icons */}
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-6">
                <button
                  onClick={() => handleRoleClick('admin')}
                  disabled={isAutoFilling}
                  className={cn(
                    "flex flex-col items-center space-y-2 transition-all duration-200",
                    "hover:scale-105 hover:opacity-90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedRole === 'admin' && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full transition-colors duration-200",
                    selectedRole === 'admin' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <UserCog className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Admin</span>
                </button>
                <button
                  onClick={() => handleRoleClick('doctor')}
                  disabled={isAutoFilling}
                  className={cn(
                    "flex flex-col items-center space-y-2 transition-all duration-200",
                    "hover:scale-105 hover:opacity-90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedRole === 'doctor' && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full transition-colors duration-200",
                    selectedRole === 'doctor' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Doctor</span>
                </button>
                <button
                  onClick={() => handleRoleClick('patient')}
                  disabled={isAutoFilling}
                  className={cn(
                    "flex flex-col items-center space-y-2 transition-all duration-200",
                    "hover:scale-105 hover:opacity-90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedRole === 'patient' && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full transition-colors duration-200",
                    selectedRole === 'patient' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <User className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Patient</span>
                </button>
                <button
                  onClick={() => handleRoleClick('pharmacist')}
                  disabled={isAutoFilling}
                  className={cn(
                    "flex flex-col items-center space-y-2 transition-all duration-200",
                    "hover:scale-105 hover:opacity-90",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    selectedRole === 'pharmacist' && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full transition-colors duration-200",
                    selectedRole === 'pharmacist' ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <Pill className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Pharmacist</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isAutoFilling}
                    className={cn(
                      "transition-all duration-200",
                      isAutoFilling && "bg-muted"
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isAutoFilling}
                    className={cn(
                      "transition-all duration-200",
                      isAutoFilling && "bg-muted"
                    )}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isAutoFilling}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Click on a role icon above to auto-fill credentials</p>
              </div>
              <div className="w-full border-t pt-4">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsRegistering(true)}
                >
                  Don't have an account? Register
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}

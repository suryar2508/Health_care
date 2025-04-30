import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Calendar,
  FileText,
  Pill,
  Home,
  LogOut,
  Menu,
  Users,
  Package,
  Activity,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  email: string;
  userType: 'admin' | 'doctor' | 'patient' | 'pharmacist';
}

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.userType) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin/dashboard", icon: Home },
          { name: "Patients", href: "/admin/patients", icon: Users },
          { name: "Appointments", href: "/admin/appointments", icon: Calendar },
          { name: "Prescriptions", href: "/admin/prescriptions", icon: FileText },
          { name: "Settings", href: "/admin/settings", icon: Settings }
        ];
      case "doctor":
        return [
          { name: "Dashboard", href: "/doctor/dashboard", icon: Home },
          { name: "Patients", href: "/doctor/patients", icon: Users },
          { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
          { name: "Prescriptions", href: "/doctor/prescriptions", icon: FileText }
        ];
      case "patient":
        return [
          { name: "Dashboard", href: "/patient/dashboard", icon: Home },
          { name: "Health Monitoring", href: "/patient/health-monitoring", icon: Activity },
          { name: "Appointments", href: "/patient/appointments", icon: Calendar },
          { name: "Prescriptions", href: "/patient/prescriptions", icon: FileText }
        ];
      case "pharmacist":
        return [
          { name: "Dashboard", href: "/pharmacy/dashboard", icon: Home },
          { name: "Inventory", href: "/pharmacy/inventory", icon: Package },
          { name: "Prescriptions", href: "/pharmacy/prescriptions", icon: FileText }
        ];
      default:
        return [];
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="h-6 w-6 rounded bg-primary"></span>
            <span className="text-lg">SmartVital</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {getNavigationItems().map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.name}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => {
                  navigate(item.href);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
          <Button
            variant="ghost"
            className="justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen p-4">{children}</main>
      </div>

      {/* Mobile menu backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

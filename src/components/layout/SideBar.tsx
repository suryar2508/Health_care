
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  User,
  Users,
  FileText, // Changed from prescription to FileText as a suitable replacement
  Heart,
  Bell,
  Settings,
  Database,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type SideBarProps = {
  userName?: string;
  userRole?: string;
  isOpen: boolean;
  onClose: () => void;
};

type NavItemType = {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
};

const SideBar = ({ 
  userName = "User", 
  userRole = "Patient",
  isOpen,
  onClose
}: SideBarProps) => {
  const { toast } = useToast();
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system",
    });
    // In a real app, this would handle the actual logout logic
  };

  const navItems: NavItemType[] = [
    { icon: Home, label: "Dashboard", href: "/", roles: ["Patient", "Doctor", "Admin"] },
    { icon: Heart, label: "Health Monitoring", href: "/health-monitoring", roles: ["Patient", "Doctor"] },
    { icon: Calendar, label: "Appointments", href: "/appointments", roles: ["Patient", "Doctor", "Admin"] },
    { icon: FileText, label: "Prescriptions", href: "/prescriptions", roles: ["Patient", "Doctor"] }, // Changed from prescription to FileText
    { icon: User, label: "My Profile", href: "/profile", roles: ["Patient", "Doctor", "Admin"] },
    { icon: Bell, label: "Notifications", href: "/notifications", roles: ["Patient", "Doctor", "Admin"] },
    { icon: Users, label: "Patients", href: "/patients", roles: ["Doctor", "Admin"] },
    { icon: Database, label: "Medicine Stock", href: "/medicine-stock", roles: ["Admin"] },
    { icon: Settings, label: "Settings", href: "/settings", roles: ["Patient", "Doctor", "Admin"] },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r bg-card transition-transform duration-300 md:relative md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="h-6 w-6 rounded-md bg-healthcare-primary"></div>
          <span className="font-semibold text-lg">SmartVital</span>
        </div>
        
        <div className="flex flex-col gap-1 p-4">
          <div className="mb-2 flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1 py-2">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="mt-auto pt-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

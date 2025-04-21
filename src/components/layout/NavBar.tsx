
import { useState } from "react";
import { Bell, Settings, LogOut, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type NavBarProps = {
  onMenuToggle: () => void;
  userName?: string;
  userRole?: string;
};

const NavBar = ({ onMenuToggle, userName = "User", userRole = "Patient" }: NavBarProps) => {
  const { toast } = useToast();
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system",
    });
    // In a real app, this would handle the actual logout logic
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    });
  };

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-md bg-healthcare-primary"></span>
          <span className="font-semibold text-lg">SmartVital Guardian</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-healthcare-danger text-[10px] font-medium text-white">
                  {notificationCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <p className="text-sm font-medium">Notifications</p>
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            {notificationCount > 0 ? (
              <>
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="text-sm font-medium">Appointment reminder</p>
                    <p className="text-xs text-muted-foreground">Dr. Smith tomorrow at 10:00 AM</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="text-sm font-medium">Medicine reminder</p>
                    <p className="text-xs text-muted-foreground">Take Amoxicillin in 30 minutes</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <div>
                    <p className="text-sm font-medium">Health alert</p>
                    <p className="text-xs text-muted-foreground">Your blood pressure reading is high</p>
                  </div>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt={userName} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userRole}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex w-full cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex w-full cursor-pointer items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;

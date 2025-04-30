import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPatients from "./pages/admin/Patients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPrescriptions from "./pages/admin/Prescriptions";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorPatients from "./pages/doctor/Patients";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientHealthMonitoring from "./pages/patient/HealthMonitoring";
import PatientAppointments from "./pages/patient/Appointments";
import PatientPrescriptions from "./pages/patient/Prescriptions";

// Pharmacist Pages
import PharmacyDashboard from "./pages/pharmacy/Dashboard";
import PharmacyInventory from "./pages/pharmacy/Inventory";
import PharmacyPrescriptions from "./pages/pharmacy/Prescriptions";

// Components
import Layout from "./components/layout/Layout";

const queryClient = new QueryClient();

interface User {
  email: string;
  userType: 'admin' | 'doctor' | 'patient' | 'pharmacist';
}

// Protected Route component with role-based access
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    localStorage.setItem("redirectUrl", location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to={`/${user.userType}/dashboard`} replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public Route component (redirects to appropriate dashboard if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Always show the login/register page, even if user is logged in
  return children;
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/login" replace />
    },
    {
      path: "/login",
      element: <PublicRoute><Login /></PublicRoute>
    },
    {
      path: "/register",
      element: <PublicRoute><Register /></PublicRoute>
    },
    {
      path: "/admin/dashboard",
      element: <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
    },
    {
      path: "/admin/patients",
      element: <ProtectedRoute allowedRoles={["admin"]}><AdminPatients /></ProtectedRoute>
    },
    {
      path: "/admin/appointments",
      element: <ProtectedRoute allowedRoles={["admin"]}><AdminAppointments /></ProtectedRoute>
    },
    {
      path: "/admin/prescriptions",
      element: <ProtectedRoute allowedRoles={["admin"]}><AdminPrescriptions /></ProtectedRoute>
    },
    {
      path: "/doctor/dashboard",
      element: <ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
    },
    {
      path: "/doctor/patients",
      element: <ProtectedRoute allowedRoles={["doctor"]}><DoctorPatients /></ProtectedRoute>
    },
    {
      path: "/doctor/appointments",
      element: <ProtectedRoute allowedRoles={["doctor"]}><DoctorAppointments /></ProtectedRoute>
    },
    {
      path: "/doctor/prescriptions",
      element: <ProtectedRoute allowedRoles={["doctor"]}><DoctorPrescriptions /></ProtectedRoute>
    },
    {
      path: "/patient/dashboard",
      element: <ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>
    },
    {
      path: "/patient/health-monitoring",
      element: <ProtectedRoute allowedRoles={["patient"]}><PatientHealthMonitoring /></ProtectedRoute>
    },
    {
      path: "/patient/appointments",
      element: <ProtectedRoute allowedRoles={["patient"]}><PatientAppointments /></ProtectedRoute>
    },
    {
      path: "/patient/prescriptions",
      element: <ProtectedRoute allowedRoles={["patient"]}><PatientPrescriptions /></ProtectedRoute>
    },
    {
      path: "/pharmacy/dashboard",
      element: <ProtectedRoute allowedRoles={["pharmacist"]}><PharmacyDashboard /></ProtectedRoute>
    },
    {
      path: "/pharmacy/inventory",
      element: <ProtectedRoute allowedRoles={["pharmacist"]}><PharmacyInventory /></ProtectedRoute>
    },
    {
      path: "/pharmacy/prescriptions",
      element: <ProtectedRoute allowedRoles={["pharmacist"]}><PharmacyPrescriptions /></ProtectedRoute>
    },
    {
      path: "*",
      element: <NotFound />
    }
  ]
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

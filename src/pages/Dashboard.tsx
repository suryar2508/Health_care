
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import PatientDashboard from "@/components/dashboard/PatientDashboard";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ name: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a proper auth check
    const userDataStr = localStorage.getItem("user");
    if (!userDataStr) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the dashboard",
      });
      navigate("/login");
      return;
    }

    try {
      const parsedUserData = JSON.parse(userDataStr);
      setUserData(parsedUserData);
    } catch (error) {
      console.error("Failed to parse user data", error);
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const renderDashboard = () => {
    if (!userData) return null;

    switch (userData.role) {
      case "Patient":
        return <PatientDashboard />;
      case "Doctor":
        return <DoctorDashboard />;
      case "Admin":
        return <AdminDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <Layout userName={userData?.name} userRole={userData?.role}>
      {renderDashboard()}
    </Layout>
  );
};

export default Dashboard;

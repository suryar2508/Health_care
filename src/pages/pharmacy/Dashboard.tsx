import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, FileText, AlertCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function PharmacyDashboard() {
  const stats = [
    {
      title: "Total Inventory",
      value: "2,345",
      description: "Items in stock",
      icon: Package,
      color: "text-blue-500"
    },
    {
      title: "Pending Prescriptions",
      value: "45",
      description: "Awaiting fulfillment",
      icon: FileText,
      color: "text-orange-500"
    },
    {
      title: "Low Stock Items",
      value: "12",
      description: "Need reordering",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "Today's Orders",
      value: "28",
      description: "To be processed",
      icon: Bell,
      color: "text-green-500"
    }
  ];

  const recentOrders = [
    {
      id: "O001",
      patient: "John Doe",
      medication: "Lisinopril 10mg",
      quantity: "30 tablets",
      status: "Pending"
    },
    {
      id: "O002",
      patient: "Jane Smith",
      medication: "Metformin 500mg",
      quantity: "60 tablets",
      status: "Processing"
    },
    {
      id: "O003",
      patient: "Mike Johnson",
      medication: "Amoxicillin 500mg",
      quantity: "20 capsules",
      status: "Ready for Pickup"
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader>
              <CardTitle className="text-lg">{stat.title}</CardTitle>
              <CardDescription>{stat.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stat.value}</div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common pharmacy tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/pharmacy/inventory">
                <Package className="h-6 w-6" />
                <span>Manage Inventory</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/pharmacy/prescriptions">
                <FileText className="h-6 w-6" />
                <span>View Prescriptions</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/pharmacy/inventory">
                <AlertCircle className="h-6 w-6" />
                <span>Low Stock Alert</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
              <Link to="/pharmacy/prescriptions">
                <Bell className="h-6 w-6" />
                <span>New Orders</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest prescription orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{order.patient}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.medication} - {order.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">
                    Order #{order.id}
                  </div>
                  <div className="text-sm font-medium">
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
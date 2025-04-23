
import Layout from "@/components/layout/Layout";
import { AppointmentsList } from "@/components/appointments/AppointmentsList";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";

const Appointments = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground">
              Manage your scheduled appointments with healthcare providers
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Schedule New Appointment
          </Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled appointments that are coming up
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentsList isDoctor={false} filterStatus="scheduled" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
                <CardDescription>
                  Your appointment history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentsList isDoctor={false} filterStatus="completed" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  View your appointments in a calendar format
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">Calendar View Coming Soon</h3>
                  <p className="text-muted-foreground mt-2">
                    This feature is currently in development
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Appointments;

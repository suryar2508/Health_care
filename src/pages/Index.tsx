
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, FileText, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Track vital signs and health metrics in real-time with smart alerts for critical changes.",
    },
    {
      icon: Calendar,
      title: "Appointment Management",
      description: "Schedule, reschedule, or cancel appointments with healthcare professionals seamlessly.",
    },
    {
      icon: FileText,
      title: "Prescription Tracking",
      description: "Keep track of medications, dosages, and reminders to never miss taking your medicine.",
    },
    {
      icon: Database,
      title: "Health Records",
      description: "Securely store and access your medical records, test results, and health history.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-md bg-healthcare-primary"></span>
            <span className="font-semibold text-lg">SmartVital Guardian</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="link" onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-healthcare-primary/10 to-healthcare-accent/20 backdrop-blur-xl">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Empowering Health Management with Smart Technology
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Monitor your vital signs, manage appointments with healthcare professionals, 
                  and keep track of your medications all in one secure platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                alt="Health Monitoring Dashboard"
                className="aspect-video rounded-xl object-cover object-center shadow-lg"
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Health Management Features</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform offers a comprehensive suite of tools for patients, doctors, and healthcare administrators.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-start space-y-4 p-4 border rounded-lg shadow-sm">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-healthcare-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Trusted by Healthcare Professionals
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                See what doctors and patients have to say about our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 lg:grid-cols-2">
            <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  "This platform has revolutionized how I manage my patients' care. The health monitoring features 
                  provide invaluable real-time insights that help me make better clinical decisions."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div>
                  <p className="text-sm font-medium">Dr. Sarah Smith</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cardiologist</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  "As someone with a chronic condition, this app has been a game-changer for me. 
                  The medication reminders and appointment tracking make managing my health so much easier."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-healthcare-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Take Control of Your Health?
              </h2>
              <p className="max-w-[900px] opacity-90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of patients and healthcare professionals already using our platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-healthcare-primary hover:bg-white/90"
                onClick={() => navigate("/register")}
              >
                Get Started for Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/20"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 md:py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-healthcare-primary"></span>
                <span className="font-semibold text-lg">SmartVital Guardian</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[400px]">
                Empowering patients and healthcare professionals with smart monitoring technology.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Platform</h3>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Features</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Security</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Pricing</Button>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Resources</h3>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Blog</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Support</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Documentation</Button>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">Company</h3>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">About Us</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Careers</Button>
                <Button variant="link" className="h-auto p-0 text-muted-foreground justify-start">Contact</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-8 border-t pt-8">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; 2025 SmartVital Guardian. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

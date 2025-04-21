
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded bg-healthcare-primary"></span>
          <span className="text-lg">SmartVital Guardian</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 SmartVital Guardian. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;

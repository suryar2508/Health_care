
import { useState, ReactNode } from 'react';
import NavBar from './NavBar';
import SideBar from './SideBar';

type LayoutProps = {
  children: ReactNode;
  userName?: string;
  userRole?: string;
};

const Layout = ({ children, userName = "User", userRole = "Patient" }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar onMenuToggle={toggleSidebar} userName={userName} userRole={userRole} />
      <div className="flex flex-1 flex-col md:flex-row">
        <SideBar 
          userName={userName} 
          userRole={userRole} 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

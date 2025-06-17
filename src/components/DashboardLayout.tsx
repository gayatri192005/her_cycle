
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  LayoutDashboard, 
  LineChart, 
  Settings, 
  PlusCircle, 
  Menu, 
  X,
  LogOut,
  Crown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { icon: LineChart, label: 'Insights', path: '/dashboard/insights' },
    { icon: Crown, label: 'Premium', path: '/premium' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="bg-white hercycle-shadow rounded-full w-10 h-10"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-background hercycle-border hercycle-shadow">
        <div className="p-6">
          <Link to="/" className="flex items-center">
            <span className="text-hercycle-deepPink font-semibold text-2xl">HerCycle</span>
          </Link>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto py-6">
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-hercycle-deepPink/10 text-hercycle-deepPink'
                    : 'text-foreground/70 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="px-4 mt-6">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start border-dashed border-hercycle-deepPink/30 hover:bg-hercycle-deepPink/5 text-hercycle-deepPink"
            >
              <Link to="/log">
                <PlusCircle size={18} className="mr-2" />
                <span>Log Period</span>
              </Link>
            </Button>
          </div>
          
          <div className="mt-auto px-4 pb-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground/70 hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-0 z-40 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden transition-transform duration-300 ease-in-out`}
      >
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={toggleSidebar}></div>
        <div className="relative w-64 max-w-xs h-full bg-background hercycle-shadow overflow-y-auto">
          <div className="p-6">
            <Link to="/" className="flex items-center">
              <span className="text-hercycle-deepPink font-semibold text-2xl">HerCycle</span>
            </Link>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto py-6">
            <nav className="flex-1 px-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-hercycle-deepPink/10 text-hercycle-deepPink'
                      : 'text-foreground/70 hover:bg-gray-100'
                  }`}
                  onClick={toggleSidebar}
                >
                  <item.icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="px-4 mt-6">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-dashed border-hercycle-deepPink/30 hover:bg-hercycle-deepPink/5 text-hercycle-deepPink"
                onClick={toggleSidebar}
              >
                <Link to="/log">
                  <PlusCircle size={18} className="mr-2" />
                  <span>Log Period</span>
                </Link>
              </Button>
            </div>
            
            <div className="mt-auto px-4 pb-6">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground/70 hover:text-foreground"
                onClick={() => {
                  handleSignOut();
                  toggleSidebar();
                }}
              >
                <LogOut size={18} className="mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

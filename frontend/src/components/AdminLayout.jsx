import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, CalendarCheck, Car, Users, Settings, 
  AlertTriangle, MessageSquare, LogOut, ShieldAlert, ChevronRight, Menu, X, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../api/adminApi';

const AdminLayout = () => {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unresolvedCount, setUnresolvedCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLogStats = async () => {
        try {
          const stats = await adminApi.getLogStats();
          setUnresolvedCount(stats.unresolved_errors || 0);
        } catch (err) {
          console.error('Error fetching log stats:', err);
        }
      };
      fetchLogStats();
      const interval = setInterval(fetchLogStats, 30000); // 30s auto refresh
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Cars & Rates', path: '/admin/cars', icon: Car },
    { name: 'Drivers Fleet', path: '/admin/drivers', icon: Users },
    { name: 'Fare Settings', path: '/admin/fare-settings', icon: Settings },
    { 
      name: 'System Logs', 
      path: '/admin/system-logs', 
      icon: AlertTriangle, 
      badge: unresolvedCount > 0 ? unresolvedCount : null 
    },
    { name: 'Customer Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-bold">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">TaxiGo Admin</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-400/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black text-white">TaxiGo</span>
              <span className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                Admin Control
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-3 py-2 bg-slate-800/60 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-amber-400 font-bold text-xs">
              {admin?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{admin?.full_name || admin?.username}</p>
              <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 min-h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

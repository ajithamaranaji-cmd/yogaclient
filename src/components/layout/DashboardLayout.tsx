import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart2, 
  User, 
  Star, 
  Award, 
  Bell, 
  Plus, 
  Search,
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Leads', icon: <Users className="w-5 h-5" />, path: '/leads' },
    { name: 'Bookings', icon: <Calendar className="w-5 h-5" />, path: '#' },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, path: '#' },
    { name: 'Earnings', icon: <DollarSign className="w-5 h-5" />, path: '#' },
    { name: 'Analytics', icon: <BarChart2 className="w-5 h-5" />, path: '#' },
    { name: 'Divider' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile/edit' },
    { name: 'My Services', icon: <Award className="w-5 h-5" />, path: '#' },
    { name: 'Availability', icon: <Star className="w-5 h-5" />, path: '#' },
    { name: 'Membership', icon: <BarChart2 className="w-5 h-5" />, path: '/pricing' },
    { name: 'Payouts', icon: <DollarSign className="w-5 h-5" />, path: '#' },
    { name: 'Reviews', icon: <Star className="w-5 h-5" />, path: '#' },
    { name: 'Add-ons', icon: <Plus className="w-5 h-5" />, path: '#' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-100 flex flex-col fixed h-screen z-20 transition-all duration-300",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <Link to="/" className={cn("flex items-center space-x-3", !isSidebarOpen && "justify-center w-full")}>
              <div className="w-10 h-10 bg-wellness-sage rounded-xl flex items-center justify-center text-white font-serif text-2xl italic flex-shrink-0 shadow-lg shadow-wellness-sage/20">Y</div>
              {isSidebarOpen && <span className="text-2xl font-serif text-wellness-stone font-bold tracking-tight">Yogaclientflow</span>}
           </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
           <ul className="space-y-1">
              {navItems.map((item, idx) => (
                item.name === 'Divider' ? (
                  <div key={`divider-${idx}`} className="h-[1px] bg-gray-50 my-6 mx-4" />
                ) : (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                        location.pathname === item.path
                          ? "bg-wellness-sage text-white shadow-lg shadow-wellness-sage/20" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-wellness-stone"
                      )}
                    >
                      <span className={cn(
                        "transition-transform group-hover:scale-110",
                        location.pathname === item.path ? "text-white" : "text-gray-400"
                      )}>
                        {item.icon}
                      </span>
                      {isSidebarOpen && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              ))}
           </ul>
        </nav>

        <div className="p-8 border-t border-gray-50">
           {isSidebarOpen && (
             <div className="flex flex-col items-center p-6 bg-wellness-dawm/5 rounded-3xl border border-wellness-dawm/10 mb-6 text-center">
                <div className="w-12 h-12 bg-wellness-dawm/20 rounded-full flex items-center justify-center text-wellness-stone mb-4">
                   <HelpCircle className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-wellness-stone mb-2">Need Help?</p>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-4">We're here to support you on your wellness journey.</p>
                <button className="w-full py-3 bg-wellness-stone text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wellness-sage transition-all">Support</button>
             </div>
           )}
           <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all w-full">
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>Logout</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        isSidebarOpen ? "ml-64" : "ml-20"
      )}>
        {/* Top Header */}
        <header className="flex justify-between items-center px-10 py-8 bg-transparent sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-12">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-wellness-stone transition-all">
                <LayoutDashboard className="w-6 h-6" />
             </button>
          </div>

          <div className="flex items-center space-x-8">
             <div className="hidden md:flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm shadow-gray-50">
                <Search className="w-4 h-4 text-gray-400 mr-3" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none text-xs focus:outline-none w-48 text-wellness-stone font-medium" />
             </div>
             
             <button className="relative p-2.5 text-gray-400 hover:text-wellness-stone transition-all bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-50">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-wellness-sunset rounded-full border-2 border-white" />
             </button>
             
             <button className="p-2.5 text-gray-400 hover:text-wellness-stone transition-all bg-white rounded-xl border border-gray-100 shadow-sm shadow-gray-50">
                <MessageSquare className="w-5 h-5" />
             </button>

             <div className="flex items-center space-x-4 pl-8 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-wellness-stone leading-tight">{user?.displayName || 'Ajith Kumar'}</p>
                   <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                      {profile?.role === 'professional' ? 'Yoga Teacher' : 'Wellness Seeker'}
                   </p>
                </div>
                <div className="relative group/avatar">
                   <img 
                      src={user?.photoURL || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=150'} 
                      className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl shadow-gray-200/50 cursor-pointer object-cover" 
                      alt="Avatar" 
                   />
                   <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
             </div>
          </div>
        </header>

        <main className="flex-1 px-10 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}

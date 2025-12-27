
import React, { useState } from 'react';
import { UserRole, UserProfile, Notification } from '../types';
import { Calendar, Search, User, Map, PlusCircle, LayoutDashboard, LogOut, Users, Bell, AlertCircle, CheckCircle2, Info, Moon, Sun } from 'lucide-react';

interface NavigationProps {
  user: UserProfile;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
  notifications: Notification[];
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, activeView, setActiveView, onLogout, notifications, darkMode, setDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const isStudent = user.role === UserRole.STUDENT;
  const unreadCount = notifications.filter(n => !n.read).length;

  const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
        activeView === id 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      <span className="font-semibold hidden md:inline text-sm">{label}</span>
    </button>
  );

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => setActiveView('explore')}>
            <div className="bg-indigo-600 p-2 rounded-xl transition-transform group-hover:scale-110">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              CampusBuzz
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <NavItem id="explore" label="Explore" icon={Search} />
            <NavItem id="map" label="Map" icon={Map} />
            <NavItem id="clubs" label="Clubs" icon={Users} />
            {isStudent ? (
              <NavItem id="dashboard" label="Impact" icon={LayoutDashboard} />
            ) : (
              <>
                <NavItem id="manage" label="Manage" icon={LayoutDashboard} />
                <NavItem id="create" label="Create" icon={PlusCircle} />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[60] animate-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full uppercase">Real-time</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700 border-b dark:border-slate-700 last:border-0 transition-colors ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`mt-1 ${n.type === 'alert' ? 'text-amber-500' : n.type === 'success' ? 'text-green-500' : 'text-indigo-500'}`}>
                          {n.type === 'alert' ? <AlertCircle size={16} /> : n.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-400 text-sm">No new updates</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden md:block mx-1"></div>

          <div className="flex items-center space-x-3 pl-2">
            <button 
              onClick={() => setActiveView('profile')}
              className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95"
            >
              <User size={20} className="text-indigo-600 dark:text-indigo-400" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

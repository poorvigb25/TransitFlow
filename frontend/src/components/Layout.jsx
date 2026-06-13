import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import {
  LayoutDashboard, Map, Train, Bus, BarChart3, Bell, User, LogOut, ShieldAlert
} from 'lucide-react';

import ErrorBoundary from './ErrorBoundary';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const { connected } = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: ['passenger', 'admin'] },
    { name: 'Live Transit Map', path: '/live-map', icon: Map, role: ['passenger', 'admin'] },
    { name: 'Metro Congestion', path: '/metro-crowd', icon: Train, role: ['passenger', 'admin'] },
    { name: 'Metro Coach View', path: '/metro-coach', icon: Train, role: ['passenger', 'admin'] },
    { name: 'Bus Crowd Monitor', path: '/bus-crowd', icon: Bus, role: ['passenger', 'admin'] },
    { name: 'Crowd Analytics', path: '/analytics', icon: BarChart3, role: ['passenger', 'admin'] },
    { name: 'Alerts Feed', path: '/notifications', icon: Bell, role: ['passenger', 'admin'] },
    { name: 'My Profile', path: '/profile', icon: User, role: ['passenger', 'admin'] },
    { name: 'Admin Console', path: '/admin', icon: ShieldAlert, role: ['admin'] },
  ];

  return (
    <div className="min-h-screen bg-[#060713] flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col justify-between fixed h-screen z-20">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              M
            </div>
            <div>
              <span className="font-bold text-white tracking-wide">MetroConnect</span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Crowd Intelligence</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            {navItems
              .filter(item => item.role.includes(user?.role))
              .map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border-l-2 border-indigo-500 text-indigo-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Footer Profile & Socket Status */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs text-slate-500 font-mono">Sync Connection</span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-red-400'}`} />
              <span className={`text-[10px] font-mono ${connected ? 'text-green-400' : 'text-slate-500'}`}>
                {connected ? 'WS Link' : 'Offline'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white uppercase">
              {user?.name?.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-none mb-0.5">{user?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize leading-none">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen p-8 flex flex-col gap-6 overflow-y-auto">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, User, LogOut, Radio, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSelectAlert, unreadCount = 5 }) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlerts = [
    { id: 1, title: 'Potential Distress & Stalking Vector', time: '11:24:10', camera: 'CAM 01 - Central Bus Stand', risk: 'Critical' },
    { id: 2, title: 'Facial Distress Indicator (Fear Conf: 92%)', time: '11:22:05', camera: 'CAM 05 - College Campus', risk: 'High' },
    { id: 3, title: 'Physical Struggle & Grab Attempt', time: '11:21:47', camera: 'CAM 12 - Temple Road', risk: 'Critical' },
    { id: 4, title: 'Aggressive Following (0.8m Proximity)', time: '11:20:31', camera: 'CAM 04 - Market Area', risk: 'High' },
  ];

  return (
    <header className="bg-[#0b1b30] text-white border-b border-[#152742] sticky top-0 z-50 select-none shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 h-13">
        
        {/* Left: Government Seal & Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-9 h-9 shrink-0 bg-white/10 rounded p-0.5 border border-white/20">
            <img 
              src="/tn-govt-seal.png" 
              alt="Government Seal" 
              className="w-8 h-8 object-contain rounded"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/favicon.svg";
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-sm text-white uppercase font-sans leading-none">
                GUARDIAN ANGEL AI
              </span>
              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase tracking-wide">
                GOVT CONTROL ROOM
              </span>
            </div>
            <span className="text-[10px] text-slate-300 font-normal tracking-wide mt-0.5">
              Women Safety & Intelligent Surveillance Control Room
            </span>
          </div>
        </div>

        {/* Right: Date, Time, Status, Notifications, Operator Profile */}
        <div className="flex items-center space-x-3 text-xs">
          
          {/* Live System Date & Time */}
          <div className="hidden sm:flex items-center space-x-2 text-slate-300 font-mono px-2.5 py-1 bg-[#10223d] rounded border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="tabular-nums">{dateStr}</span>
            <span className="text-slate-600">|</span>
            <span className="font-bold text-white tabular-nums">{timeStr}</span>
          </div>

          {/* System Status Online */}
          <div className="hidden md:flex items-center space-x-1.5 px-2 py-1 bg-[#10223d] rounded border border-slate-700/60 text-[11px] font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GRID ONLINE (22/24)</span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-1.5 text-slate-300 hover:text-white hover:bg-[#152a4a] rounded transition-colors cursor-pointer"
              title="Active Safety Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center ring-1 ring-[#0b1b30] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
                  <span className="font-bold text-[11px] text-slate-900 uppercase tracking-wider">Priority Safety Alerts</span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.2 rounded">{unreadCount} Critical</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {urgentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        if (onSelectAlert) onSelectAlert(alert);
                        setIsNotifOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1 py-0.2 rounded uppercase ${
                          alert.risk === 'Critical' ? 'bg-red-100 text-red-700 font-black' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {alert.risk}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{alert.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{alert.camera}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Operator Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center space-x-2 text-slate-200 hover:text-white px-2 py-1 rounded hover:bg-[#132746] transition-colors cursor-pointer border border-slate-700/50"
            >
              <div className="w-5 h-5 rounded bg-slate-700 flex items-center justify-center text-white text-[10px] font-bold">
                <User className="w-3.5 h-3.5 text-slate-200" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold leading-none text-white">{user?.name || 'Inspector R. Rajesh'}</span>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">POLICE ID: TN-4412</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Inspector R. Rajesh'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{user?.email || 'admin@trichypolice.gov.in'}</p>
                  <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Role: CONTROL ROOM COMMANDER
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Secure Logout</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

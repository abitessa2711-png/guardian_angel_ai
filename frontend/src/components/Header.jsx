import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, User, Shield, CheckCircle2, AlertTriangle, AlertOctagon, LogOut, Radio, Clock } from 'lucide-react';
import { AshokaEmblem } from './Emblem';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSelectAlert, unreadCount = 3 }) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isControlRoomOpen, setIsControlRoomOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedControlRoom, setSelectedControlRoom] = useState('Control Room 01 - Central Command');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Date formatting like "15 May 2025"
      const dateFormatted = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      // Time formatting like "11:24:35 AM"
      const timeFormatted = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      setDateStr(dateFormatted);
      setTimeStr(timeFormatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlerts = [
    { id: 1, title: 'Animal on Road – Accident Risk', time: '11:23:10 AM', camera: 'Camera 04 - Main Road', risk: 'High' },
    { id: 2, title: 'Person in Distress Detected', time: '11:22:05 AM', camera: 'Camera 02 - Market Cross', risk: 'High' },
    { id: 3, title: 'Aggressive Behavior Detected', time: '11:21:47 AM', camera: 'Camera 07 - Bus Stand', risk: 'Critical' },
  ];

  return (
    <header className="bg-[#0b1b30] text-white border-b border-[#1e293b] sticky top-0 z-50 select-none shadow-sm">
      <div className="flex items-center justify-between px-5 py-2.5">
        
        {/* Left: Government Logo & Project Title */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-9 h-11 shrink-0">
            <AshokaEmblem className="w-8 h-10 text-slate-100" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold tracking-wider text-base text-white uppercase leading-tight font-sans">
                GUARDIAN ANGEL AI
              </span>
              <span className="bg-blue-600/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wide">
                GOVT OF INDIA
              </span>
            </div>
            <span className="text-[11px] text-slate-300 font-normal tracking-wide">
              Smart Public Safety Surveillance & Early Risk Detection System
            </span>
          </div>
        </div>

        {/* Right: Date/Time, Alert Notifications, Control Room Selector, Profile */}
        <div className="flex items-center space-x-5 text-xs">
          
          {/* Live System Date & Time */}
          <div className="hidden md:flex items-center space-x-2 text-slate-200 font-medium px-3 py-1 bg-[#12233f] rounded border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="tabular-nums tracking-wide">{dateStr}</span>
            <span className="text-slate-500">|</span>
            <span className="font-semibold text-white tabular-nums tracking-wide">{timeStr}</span>
          </div>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsControlRoomOpen(false);
                setIsProfileOpen(false);
              }}
              className="relative p-1.5 text-slate-300 hover:text-white hover:bg-[#152a4a] rounded transition-colors focus:outline-none"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#0b1b30]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="font-semibold text-xs text-slate-900 uppercase tracking-wider">Active Priority Alerts</span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {urgentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        if (onSelectAlert) onSelectAlert(alert);
                        setIsNotifOpen(false);
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          alert.risk === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {alert.risk}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 mt-1">{alert.title}</p>
                      <p className="text-[11px] text-slate-500">{alert.camera}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-1.5 border-t border-slate-100 bg-slate-50 text-center">
                  <button 
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View All Control Room Alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Control Room Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsControlRoomOpen(!isControlRoomOpen);
                setIsNotifOpen(false);
                setIsProfileOpen(false);
              }}
              className="flex items-center space-x-1.5 text-slate-200 hover:text-white px-2.5 py-1 rounded bg-[#132746] border border-slate-700/60 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-xs">Control Room</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isControlRoomOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select Command Station
                </div>
                {[
                  'Control Room 01 - Central Command',
                  'Control Room 02 - North Sector',
                  'Control Room 03 - Railway & Transit Hub',
                  'Control Room 04 - Highway Patrol HQ'
                ].map((room) => (
                  <button
                    key={room}
                    onClick={() => {
                      setSelectedControlRoom(room);
                      setIsControlRoomOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                      selectedControlRoom === room ? 'font-bold text-blue-700 bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{room}</span>
                    {selectedControlRoom === room && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
                setIsControlRoomOpen(false);
              }}
              className="flex items-center space-x-2 text-slate-200 hover:text-white p-1 rounded hover:bg-[#132746] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-white text-xs font-bold">
                <User className="w-4 h-4 text-slate-200" />
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold leading-tight text-white">{user?.name || 'Officer In-Charge'}</span>
                <span className="text-[10px] text-slate-400 leading-none">POLICE ID: TN-4402</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{user?.name || 'Duty Inspector'}</p>
                  <p className="text-[10px] text-slate-500">{user?.email || 'admin@trichypolice.gov.in'}</p>
                  <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Role: {user?.role || 'COMMANDER'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors font-medium"
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

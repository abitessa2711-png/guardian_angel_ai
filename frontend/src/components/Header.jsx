import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, User, LogOut, Radio, Clock, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onSelectAlert, unreadCount = 12 }) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('03:24:18 PM');
  const [dateStr, setDateStr] = useState('15 May 2026');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
      setTimeStr(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlerts = [
    { id: 'ALT-104', title: 'Market Area — Following + Distress Detected', time: '15:24:18', camera: 'CAM 04', risk: 'HIGH' },
    { id: 'ALT-102', title: 'Main Junction — Aggressive Approach Vector', time: '15:19:47', camera: 'CAM 02', risk: 'MEDIUM' },
    { id: 'ALT-107', title: 'Bus Stop — Stalking Detected (18m)', time: '15:15:32', camera: 'CAM 07', risk: 'HIGH' },
    { id: 'ALT-111', title: 'Railway Entrance — Suspicious Interaction', time: '15:10:05', camera: 'CAM 11', risk: 'MEDIUM' },
  ];

  return (
    <header className="bg-[#0b1424] text-white border-b border-[#1b2e4b] sticky top-0 z-50 select-none shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 h-14">
        
        {/* Left: Emblem + Project Title + Subtitle */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 p-1 border border-white/20 shrink-0">
            <img 
              src="/tn-govt-seal.png" 
              alt="Government Seal" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/favicon.svg";
              }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-wider text-base text-white uppercase font-sans leading-none">
                GUARDIAN ANGEL AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal tracking-wide mt-0.5">
              Women Safety & Surveillance Control Room
            </span>
          </div>
        </div>

        {/* Center: Live Control Room Red Pill Badge */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-[#dc2626] text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span>LIVE CONTROL ROOM</span>
          </div>
        </div>

        {/* Right: Date, Time, Notifications, Operator */}
        <div className="flex items-center space-x-4 text-xs">
          
          {/* Live Date & Time */}
          <div className="hidden sm:flex items-center space-x-3 text-slate-300 font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 text-[11px]">📅</span>
              <span className="text-slate-200">{dateStr}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-white tabular-nums">{timeStr}</span>
            </div>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-1.5 text-slate-300 hover:text-white hover:bg-[#152a4a] rounded transition-colors cursor-pointer"
              title="Active Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-[#0b1424] animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0f1d35] text-white rounded shadow-2xl border border-[#223b61] py-1.5 z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#1b2e4b]">
                  <span className="font-bold text-[11px] text-slate-200 uppercase tracking-wider">Priority Safety Alerts</span>
                  <span className="text-[10px] bg-red-600/30 text-red-400 border border-red-500/50 font-bold px-1.5 py-0.2 rounded">{unreadCount} Critical</span>
                </div>
                <div className="divide-y divide-[#1b2e4b] max-h-64 overflow-y-auto">
                  {urgentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        if (onSelectAlert) onSelectAlert(alert);
                        setIsNotifOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-[#162a4d] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                          alert.risk === 'HIGH' ? 'bg-red-900/80 text-red-200 border border-red-600' : 'bg-orange-900/80 text-orange-200 border border-orange-600'
                        }`}>
                          {alert.risk}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-100 mt-0.5">{alert.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{alert.camera}</p>
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
              className="flex items-center space-x-2 text-slate-200 hover:text-white px-2 py-1 rounded hover:bg-[#152a4a] transition-colors cursor-pointer"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold leading-none text-white">{user?.name || 'Operator'}</span>
                <span className="text-[10px] text-slate-400 leading-none mt-0.5">Control Room 01</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-500 flex items-center justify-center text-white text-xs font-bold">
                <User className="w-4 h-4 text-slate-200" />
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#0f1d35] text-white rounded shadow-2xl border border-[#223b61] py-1.5 z-50">
                <div className="px-3 py-2 border-b border-[#1b2e4b]">
                  <p className="text-xs font-bold text-white">{user?.name || 'Duty Operator'}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{user?.email || 'admin@trichypolice.gov.in'}</p>
                  <span className="inline-block mt-1 bg-blue-900/60 text-blue-300 border border-blue-600 text-[9px] font-bold px-1.5 py-0.2 rounded">
                    Role: CONTROL ROOM 01
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/40 flex items-center space-x-2 font-medium cursor-pointer"
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

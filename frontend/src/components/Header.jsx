import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, User, LogOut, Clock, Shield, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import guardianLogo from '../assets/logo_new.jpg';

export default function Header({ onSelectAlert, unreadCount = 12 }) {
  const { user, logout } = useAuth();
  const [timeStr, setTimeStr] = useState('03:24:18 PM');
  const [dateStr, setDateStr] = useState('22 Sep 2026');
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
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-50 select-none shadow-xs">
      
      {/* 🇮🇳 INDIAN NATIONAL FLAG TRICOLOR TOP STRIPE RIBBON */}
      <div className="w-full flex h-1.5 overflow-hidden">
        <div className="flex-1 bg-[#FF671F]" title="Saffron - Courage & Strength"></div>
        <div className="flex-1 bg-white border-y border-slate-200" title="White - Truth & Peace"></div>
        <div className="flex-1 bg-[#046A38]" title="Green - Prosperity & Growth"></div>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 h-15">
        
        {/* Left: Emblem + Project Title + Subtitle */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-200 shrink-0 shadow-xs overflow-hidden">
            <img 
              src={guardianLogo} 
              alt="Guardian Angel AI" 
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-wider text-base md:text-lg text-[#000080] uppercase font-sans leading-tight">
                GUARDIAN ANGEL AI
              </span>
              <span className="hidden sm:inline-block text-[9px] bg-[#FF671F]/10 text-[#FF671F] border border-[#FF671F]/30 font-bold px-1.5 py-0.2 rounded uppercase">
                National Portal
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-wide">
              Women Safety & Smart CCTV Command Center • Government of India
            </span>
          </div>
        </div>

        {/* Center: Live Control Room Tricolor Badge */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="bg-gradient-to-r from-[#FF671F] via-[#E65100] to-[#DC2626] text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            <span className="font-extrabold tracking-widest text-[11px]">LIVE CONTROL ROOM</span>
          </div>
        </div>

        {/* Right: Date, Time, Notifications, Operator */}
        <div className="flex items-center space-x-4 text-xs">
          
          {/* Live Date & Time */}
          <div className="hidden sm:flex items-center space-x-3 text-slate-700 font-mono bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500 text-[11px]">📅</span>
              <span className="font-semibold text-slate-800">{dateStr}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#000080]" />
              <span className="font-bold text-[#000080] tabular-nums">{timeStr}</span>
            </div>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2 text-slate-600 hover:text-[#000080] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
              title="Active Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden text-slate-800">
                <div className="bg-slate-50 p-2.5 border-b border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-xs uppercase text-[#000080]">Active Critical Alerts</span>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded">
                    {unreadCount} New
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {urgentAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        setIsNotifOpen(false);
                        if (onSelectAlert) onSelectAlert(alert);
                      }}
                      className="p-2.5 hover:bg-slate-50 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-slate-900">{alert.camera}</span>
                        <span className="text-[10px] font-mono text-red-600 font-bold bg-red-50 border border-red-200 px-1 rounded">
                          {alert.risk}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{alert.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono block">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-[#000080] text-white flex items-center justify-center font-bold text-[10px]">
                {user?.name ? user.name[0].toUpperCase() : 'O'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-bold text-[11px] leading-tight text-slate-800">
                  {user?.name || 'Safety Chief Er. M. Sundaram'}
                </span>
                <span className="text-[9px] text-[#046A38] font-bold">
                  ● Verified Duty Officer
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2 text-slate-800 space-y-2">
                <div className="p-2 border-b border-slate-100 text-xs">
                  <p className="font-bold text-slate-900">{user?.name || 'Er. M. Sundaram'}</p>
                  <p className="text-slate-500 text-[10px]">Duty Officer • ID #TN-POL-4412</p>
                </div>
                <button
                  onClick={() => logout && logout()}
                  className="w-full flex items-center space-x-2 p-2 hover:bg-red-50 text-red-700 rounded text-xs cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Control Room</span>
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

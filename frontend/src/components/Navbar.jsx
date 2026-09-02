import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Wifi, WifiOff, Clock, ShieldCheck, Flame, ShieldAlert, User } from 'lucide-react';

export default function Navbar({ overallStatus = 'SAFE' }) {
  const { user, logout } = useAuth();
  const { connected } = useWebSocket();
  const { language, setLanguage, t } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = () => {
    if (overallStatus === 'CRITICAL') {
      return (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-red-500/15 border border-red-500/50 text-red-400 text-2xs font-mono font-bold animate-pulse shadow-glow-red">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>{t('critical')}</span>
        </span>
      );
    }
    if (overallStatus === 'WARNING') {
      return (
        <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/50 text-amber-400 text-2xs font-mono font-bold shadow-glow-amber">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>{t('warning')}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/50 text-emerald-400 text-2xs font-mono font-bold shadow-glow-green">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{t('secure')}</span>
      </span>
    );
  };

  return (
    <header className="h-16 bg-surveillance-header border-b border-surveillance-border flex items-center justify-between px-4 md:px-6 z-30 select-none">
      
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-lg border border-cyan-500/40 bg-gradient-to-br from-slate-900 to-sky-950 flex items-center justify-center shadow-glow-cyan shrink-0">
          <div className="relative flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-sky-400" />
            <Flame className="h-3 w-3 text-amber-400 absolute top-1.5" />
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm md:text-base font-black tracking-wider text-white leading-none">
              {t('title')}
            </h1>
            <span className="hidden sm:inline-block bg-sky-500/15 border border-sky-500/40 text-sky-400 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest font-mono">
              {t('active_tamil_tag')}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5 tracking-tight uppercase truncate max-w-[280px] md:max-w-none">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Control Status Indicators */}
      <div className="flex items-center space-x-3 md:space-x-4">
        
        {/* Factory Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 border-r border-surveillance-border pr-3">
          <span className="text-[10px] text-slate-400 font-mono uppercase">{t('factory_status')}:</span>
          {getStatusBadge()}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center bg-slate-900/90 border border-surveillance-border rounded p-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
              language === 'en' 
                ? 'bg-sky-500 text-slate-950 font-black shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-all ${
              language === 'ta' 
                ? 'bg-sky-500 text-slate-950 font-black shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center space-x-2 text-sky-400 font-mono text-xs bg-slate-900/80 border border-surveillance-border px-2.5 py-1 rounded">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-300">{time.toLocaleDateString()}</span>
          <span className="font-bold border-l border-surveillance-border pl-1.5 ml-1 text-white">{formatClock(time)}</span>
        </div>

        {/* AI & WebSocket Engine Connection */}
        <div className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[10px] font-mono border ${
          connected 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
            : 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse'
        }`}>
          {connected ? (
            <>
              <Wifi className="h-3 w-3" />
              <span className="hidden md:inline">{t('live_core_online')}</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span className="hidden md:inline">{t('core_disconnected')}</span>
            </>
          )}
        </div>

        {/* User / Supervisor Profile */}
        {user && (
          <div className="flex items-center space-x-2.5 border-l border-surveillance-border pl-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
              <p className="text-[9px] text-sky-400 font-mono uppercase tracking-wider">{user.role}</p>
            </div>
            
            <button 
              onClick={logout}
              title="Logout Control System"
              className="bg-slate-900 hover:bg-red-600 hover:text-white text-slate-400 p-1.5 rounded transition-all border border-surveillance-border hover:border-red-500 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Wifi, WifiOff, Clock } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function Navbar() {
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

  return (
    <header className="h-16 bg-surveillance-header border-b border-surveillance-border flex items-center justify-between px-6 z-10 select-none">
      {/* Title */}
      <div className="flex items-center space-x-3.5">
        <div className="w-11 h-11 rounded-full border border-surveillance-accent/50 bg-white overflow-hidden flex items-center justify-center p-0.5 shadow-glow-cyan">
          <img src={logo} className="w-full h-full object-cover rounded-full" alt="Guardian Angel Logo" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm md:text-base font-bold tracking-wider text-white leading-none">
              {t('title')}
            </h1>
            <span className="bg-surveillance-accent/20 border border-surveillance-accent/40 text-surveillance-accent px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest font-sans animate-pulse shrink-0">
              வருமுன் காப்போம்
            </span>
          </div>
          <p className="text-4xs md:text-3xs text-surveillance-textMuted font-mono mt-1 uppercase">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Clock and Live Feeds Status */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Language Toggle segment control */}
        <div className="flex items-center bg-surveillance-panel/60 border border-surveillance-border rounded overflow-hidden p-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer transition-all ${
              language === 'en' 
                ? 'bg-surveillance-accent text-black font-black' 
                : 'text-surveillance-textMuted hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer transition-all ${
              language === 'ta' 
                ? 'bg-surveillance-accent text-black font-black' 
                : 'text-surveillance-textMuted hover:text-white'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Clock */}
        <div className="hidden sm:flex items-center space-x-2 text-surveillance-accent font-mono text-xs bg-surveillance-panel/60 border border-surveillance-border px-2.5 py-1 rounded">
          <Clock className="h-3.5 w-3.5" />
          <span>{time.toLocaleDateString()}</span>
          <span className="font-bold border-l border-surveillance-border pl-1.5 ml-1.5">{formatClock(time)}</span>
        </div>

        {/* WebSocket Status */}
        <div className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[10px] font-mono border ${
          connected 
            ? 'bg-surveillance-success/10 text-surveillance-success border-surveillance-success/30' 
            : 'bg-surveillance-danger/10 text-surveillance-danger border-surveillance-danger/30 animate-pulse'
        }`}>
          {connected ? (
            <>
              <Wifi className="h-3 w-3" />
              <span>{t('live_core_online')}</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span>{t('core_disconnected')}</span>
            </>
          )}
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-3 border-l border-surveillance-border pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <p className="text-[9px] text-surveillance-textMuted font-mono uppercase tracking-widest">{user.role}</p>
            </div>
            
            <button 
              onClick={logout}
              title="Logout System"
              className="bg-surveillance-panel hover:bg-surveillance-danger hover:text-white text-surveillance-textMuted p-1.5 rounded transition-all border border-surveillance-border hover:border-surveillance-danger cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

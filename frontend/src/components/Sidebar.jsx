import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Video, 
  ShieldAlert, 
  Bell, 
  FolderCheck, 
  TrendingUp,
  Database, 
  Cpu, 
  FileText, 
  Settings
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'ops' },
  { id: 'live_monitoring', label: 'Live Monitoring', icon: Video, section: 'ops' },
  { id: 'women_safety', label: 'Women Safety', icon: ShieldAlert, section: 'ops' },
  { id: 'alerts', label: 'Alerts & Incidents', icon: Bell, badge: 12, badgeColor: 'bg-red-600', section: 'ops' },
  { id: 'evidence', label: 'Evidence', icon: FolderCheck, section: 'ops' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'ops' },

  { id: 'dataset', label: 'Dataset Management', icon: Database, section: 'ai' },
  { id: 'ai_training', label: 'AI Training & Evaluation', icon: Cpu, section: 'ai' },

  { id: 'reports', label: 'Reports', icon: FileText, section: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
];

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  const [lastUpdateTime, setLastUpdateTime] = useState('03:24:18 PM');

  useEffect(() => {
    const update = () => {
      setLastUpdateTime(new Date().toLocaleTimeString('en-US', { hour12: true }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-56 bg-[#0b1424] text-slate-300 flex flex-col justify-between select-none border-r border-[#1b2e4b] shrink-0 min-h-[calc(100vh-56px)]">
      
      {/* Navigation List */}
      <div className="py-3 px-2 space-y-1">
        
        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showAIHeader = idx === 6;
          const showSystemDivider = idx === 8;

          return (
            <React.Fragment key={item.id}>
              {showAIHeader && (
                <div className="pt-3 pb-1 px-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    AI & DATA MANAGEMENT
                  </span>
                </div>
              )}

              {showSystemDivider && (
                <div className="my-2 border-t border-[#1b2e4b]" />
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-all duration-100 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#13223d]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="tracking-wide truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-red-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Panel: SYSTEM STATUS */}
      <div className="p-3 border-t border-[#1b2e4b] bg-[#08101e] space-y-2 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          SYSTEM STATUS
        </span>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Active Cameras</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>16 / 16</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">AI Models</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Online</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">System Uptime</span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>99.8%</span>
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
            <span className="text-slate-500">Last Update</span>
            <span className="text-slate-300 font-mono">{lastUpdateTime}</span>
          </div>
        </div>
      </div>

    </aside>
  );
}

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
  { id: 'evidence', label: 'Evidence Vault', icon: FolderCheck, section: 'ops' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'ops' },

  { id: 'dataset', label: 'Dataset Management', icon: Database, section: 'ai' },
  { id: 'ai_training', label: 'AI Training & Evaluation', icon: Cpu, section: 'ai' },

  { id: 'reports', label: 'Official Reports', icon: FileText, section: 'system' },
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
    <aside className="w-60 bg-white text-slate-700 flex flex-col justify-between select-none border-r border-slate-200 shrink-0 min-h-[calc(100vh-62px)] shadow-xs">
      
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
                <div className="pt-3 pb-1 px-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#000080]">
                    AI & BENCHMARK MODELS
                  </span>
                </div>
              )}

              {showSystemDivider && (
                <div className="my-2 border-t border-slate-200" />
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-semibold transition-all duration-100 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF7ED] text-[#E65100] border-l-4 border-[#FF671F] font-bold shadow-xs'
                    : 'text-slate-700 hover:text-[#000080] hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF671F]' : 'text-slate-500'}`} />
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
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#000080] block">
            NATIONAL GRID STATUS
          </span>
          <span className="w-2 h-2 rounded-full bg-[#046A38] animate-pulse" title="System Operational"></span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center text-slate-600">
            <span>Active CCTV Feeds</span>
            <span className="font-mono font-bold text-[#046A38]">16 / 16 Operational</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>AI Inference Engine</span>
            <span className="font-mono font-bold text-[#046A38]">Active (OpenCV Edge)</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Grid Uptime</span>
            <span className="font-mono font-bold text-slate-900">99.8% High Availability</span>
          </div>

          <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-200 text-[10px] font-mono">
            <span>Telemetry Pulse</span>
            <span>{lastUpdateTime}</span>
          </div>
        </div>
      </div>

    </aside>
  );
}

import React from 'react';
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
import { PublicSafetySeal } from './Emblem';

export const NAV_ITEMS = [
  // Section 1: Real-time Operations
  { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'core' },
  { id: 'live_monitoring', label: 'Live Monitoring', icon: Video, badge: 'LIVE', badgeColor: 'bg-emerald-600', section: 'core' },
  { id: 'women_safety', label: 'Women Safety', icon: ShieldAlert, badge: 4, badgeColor: 'bg-red-600', section: 'core' },
  { id: 'alerts', label: 'Alerts & Incidents', icon: Bell, badge: 12, badgeColor: 'bg-blue-600', section: 'core' },
  { id: 'evidence', label: 'Evidence', icon: FolderCheck, section: 'core' },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp, section: 'core' },

  // Section 2: AI & Research
  { id: 'dataset', label: 'Dataset Management', icon: Database, section: 'ai' },
  { id: 'ai_training', label: 'AI Training & Evaluation', icon: Cpu, section: 'ai' },

  // Section 3: System & Administration
  { id: 'reports', label: 'Reports', icon: FileText, section: 'system' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
];

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <aside className="w-56 bg-[#0b1b30] text-slate-300 flex flex-col justify-between select-none border-r border-[#152742] shrink-0 min-h-[calc(100vh-53px)]">
      
      {/* Navigation Menu List */}
      <div className="py-2.5 px-2 space-y-0.5">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
          Surveillance Ops
        </div>

        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showDivider = idx === 6 || idx === 8;

          return (
            <React.Fragment key={item.id}>
              {showDivider && (
                <div className="pt-2 pb-1 px-2 border-t border-slate-800/70 mt-1 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    {idx === 6 ? 'AI Engine' : 'System'}
                  </span>
                </div>
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-all duration-100 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-[#132746]'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="tracking-wide truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
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

      {/* Bottom Public Safety Commitment Badge */}
      <div className="p-2.5 border-t border-[#152742] bg-[#091628]">
        <div className="flex items-center space-x-2 px-2 py-1.5 bg-[#0d1e36] rounded border border-slate-800">
          <PublicSafetySeal className="w-6 h-6 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-200 leading-tight">
              Women Safety Grid
            </span>
            <span className="text-[9px] text-blue-400 font-medium">
              Tamil Nadu Police
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}

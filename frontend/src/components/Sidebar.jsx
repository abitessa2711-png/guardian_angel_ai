import React from 'react';
import { 
  Home, 
  Video, 
  ShieldAlert, 
  Bell, 
  FolderCheck, 
  Database, 
  Cpu, 
  FileText, 
  Settings
} from 'lucide-react';
import { PublicSafetySeal } from './Emblem';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'live_cctv', label: 'Live CCTV', icon: Video, badge: 'LIVE', badgeColor: 'bg-emerald-600' },
  { id: 'women_safety', label: 'Women Safety', icon: ShieldAlert, badge: 4, badgeColor: 'bg-red-600' },
  { id: 'alerts', label: 'Alerts & Incidents', icon: Bell, badge: 12, badgeColor: 'bg-blue-600' },
  { id: 'evidence', label: 'Evidence', icon: FolderCheck },
  { id: 'dataset', label: 'Dataset Management', icon: Database },
  { id: 'ai_training', label: 'AI Training & Evaluation', icon: Cpu },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <aside className="w-60 bg-[#0b1b30] text-slate-300 flex flex-col justify-between select-none border-r border-[#152742] shrink-0 min-h-[calc(100vh-57px)]">
      
      {/* 9 Main Modules Navigation List */}
      <div className="py-3 px-2.5 space-y-1">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1.5">
          Control Room Modules
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                isActive
                  ? 'bg-[#1d4ed8] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-[#132746]'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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
          );
        })}
      </div>

      {/* Bottom Public Safety Commitment Seal */}
      <div className="p-3 border-t border-[#152742] bg-[#091628]">
        <div className="flex items-center space-x-2.5 px-2.5 py-2 bg-[#0d1e36] rounded border border-slate-800">
          <PublicSafetySeal className="w-7 h-7 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200 tracking-wide leading-tight">
              Women Safety
            </span>
            <span className="text-[10px] text-blue-400 font-medium">
              Tamil Nadu Police
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}

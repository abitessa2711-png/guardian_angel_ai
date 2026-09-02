import React from 'react';
import { 
  Home, 
  Video, 
  Bell, 
  BarChart2, 
  UserCheck, 
  Dog, 
  AlertOctagon, 
  FolderCheck, 
  FileText, 
  Settings, 
  Users, 
  Activity,
  Shield
} from 'lucide-react';
import { PublicSafetySeal } from './Emblem';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'live_monitoring', label: 'Live Monitoring', icon: Video },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'people_tracking', label: 'People Tracking', icon: UserCheck },
  { id: 'animal_monitoring', label: 'Animal Monitoring', icon: Dog },
  { id: 'incidents', label: 'Incidents', icon: AlertOctagon },
  { id: 'evidence', label: 'Evidence', icon: FolderCheck },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'system_status', label: 'System Status', icon: Activity },
];

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <aside className="w-64 bg-[#0b1b30] text-slate-300 flex flex-col justify-between select-none border-r border-[#152742] shrink-0 min-h-[calc(100vh-57px)]">
      
      {/* Top Navigation Menu List */}
      <div className="py-3 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-medium transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#1d4ed8] text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#132746]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="tracking-wide">{item.label}</span>
              </div>

              {/* Alert Badge */}
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-red-500 text-white' : 'bg-red-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom: Official Public Safety Commitment Badge */}
      <div className="p-3 border-t border-[#152742] bg-[#091628]">
        <div className="flex items-center space-x-3 px-3 py-2 bg-[#0d1e36] rounded border border-slate-800">
          <PublicSafetySeal className="w-8 h-8 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200 tracking-wide">
              Public Safety
            </span>
            <span className="text-[10px] text-blue-400 font-medium">
              Our Commitment
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}

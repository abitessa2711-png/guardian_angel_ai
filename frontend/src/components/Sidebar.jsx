import React from 'react';
import { 
  Home, 
  ShieldAlert,
  Video, 
  UserX,
  AlertOctagon,
  Scan,
  Eye,
  Bell, 
  FolderCheck,
  Database,
  Cpu,
  BarChart2,
  TrendingUp, 
  Dog, 
  FileText, 
  History,
  Settings,
  Shield
} from 'lucide-react';
import { PublicSafetySeal } from './Emblem';

export const NAV_ITEMS = [
  // Primary Women Safety Section (Dominates the Navigation)
  { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'core' },
  { id: 'women_safety', label: 'Women Safety Monitoring', icon: ShieldAlert, badge: 'Live', badgeColor: 'bg-red-600', section: 'core' },
  { id: 'live_cctv', label: 'Live CCTV Matrix', icon: Video, section: 'surveillance' },
  { id: 'women_at_risk', label: 'Women at Risk', icon: UserX, badge: 3, badgeColor: 'bg-orange-600', section: 'surveillance' },
  { id: 'harassment', label: 'Harassment Detection', icon: AlertOctagon, badge: 5, badgeColor: 'bg-red-600', section: 'ai_analysis' },
  { id: 'facial_distress', label: 'Facial Distress Analysis', icon: Scan, section: 'ai_analysis' },
  { id: 'behavior', label: 'Behavior Analysis', icon: Eye, section: 'ai_analysis' },
  { id: 'alerts', label: 'Alerts & Incidents', icon: Bell, badge: 12, badgeColor: 'bg-blue-600', section: 'operations' },
  { id: 'evidence', label: 'Digital Evidence Vault', icon: FolderCheck, section: 'operations' },

  // AI Research & Dataset Center Section
  { id: 'dataset', label: 'Dataset Management', icon: Database, section: 'research' },
  { id: 'training', label: 'AI Model Training', icon: Cpu, section: 'research' },
  { id: 'evaluation', label: 'Model Evaluation', icon: BarChart2, section: 'research' },
  { id: 'analytics', label: 'Analytics & Heatmaps', icon: TrendingUp, section: 'analytics' },

  // Secondary Modules at Bottom
  { id: 'animal_safety', label: 'Animal & Road Safety', icon: Dog, section: 'secondary' },
  { id: 'reports', label: 'Compliance Reports', icon: FileText, section: 'system' },
  { id: 'audit_logs', label: 'Audit Logs (IT Act)', icon: History, section: 'system' },
  { id: 'settings', label: 'System Settings', icon: Settings, section: 'system' },
];

export default function Sidebar({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <aside className="w-64 bg-[#0b1b30] text-slate-300 flex flex-col justify-between select-none border-r border-[#152742] shrink-0 min-h-[calc(100vh-57px)]">
      
      {/* Top Navigation Menu List */}
      <div className="py-2.5 px-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
        
        {/* Navigation Category Label */}
        <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
          Women Safety Command
        </div>

        {NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          // Optional divider between sections
          const showDivider = idx === 9 || idx === 13;

          return (
            <React.Fragment key={item.id}>
              {showDivider && (
                <div className="px-2 pt-2.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-800/60 mt-1">
                  {idx === 9 ? 'AI Research & Training' : 'Secondary & Compliance'}
                </div>
              )}

              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-[#132746]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="tracking-wide truncate">{item.label}</span>
                </div>

                {/* Badges */}
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                    item.badgeColor || 'bg-red-600 text-white'
                  } ${isActive ? 'ring-1 ring-white/40' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom: Official Public Safety Commitment Badge */}
      <div className="p-3 border-t border-[#152742] bg-[#091628]">
        <div className="flex items-center space-x-3 px-3 py-2 bg-[#0d1e36] rounded border border-slate-800">
          <PublicSafetySeal className="w-8 h-8 shrink-0" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-200 tracking-wide">
              Women Safety Core
            </span>
            <span className="text-[10px] text-red-400 font-semibold">
              Proactive Protection Grid
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}

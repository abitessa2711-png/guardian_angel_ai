import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Video, 
  TrendingUp, 
  Scan, 
  Thermometer, 
  ShieldAlert, 
  FileWarning, 
  Bell, 
  MapPin, 
  FileSpreadsheet, 
  History, 
  Cpu, 
  Sliders, 
  Users, 
  FileText,
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
  const { user } = useAuth();
  const { alerts } = useWebSocket();
  const { t } = useLanguage();

  const newAlertsCount = alerts.filter(a => a.status === 'New').length;
  const criticalCount = alerts.filter(a => a.status === 'New' && a.risk_score >= 75).length;

  const menuItems = [
    { id: 'command_center', name: t('command_center'), icon: LayoutDashboard },
    { id: 'cctv', name: t('live_monitoring'), icon: Video, badge: newAlertsCount },
    { id: 'risk_analysis', name: t('risk_analysis'), icon: TrendingUp },
    { id: 'ai_vision', name: t('ai_vision'), icon: Scan },
    { id: 'sensors', name: t('sensors'), icon: Thermometer },
    { id: 'worker_safety', name: t('worker_safety'), icon: ShieldAlert },
    { id: 'incidents', name: t('incidents'), icon: FileWarning, badge: criticalCount },
    { id: 'alerts', name: t('alerts'), icon: Bell },
    { id: 'factory_map', name: t('factory_map'), icon: MapPin },
    { id: 'reports', name: t('reports'), icon: FileSpreadsheet },
    { id: 'risk_history', name: t('risk_history'), icon: History },
    { id: 'system_health', name: t('system_health'), icon: Cpu },
    { id: 'project_overview', name: t('project_overview'), icon: FileText },
    { id: 'settings', name: t('settings'), icon: Sliders }
  ];

  if (user?.role === 'ADMIN') {
    menuItems.splice(13, 0, { id: 'users', name: t('users'), icon: Users });
  }

  return (
    <aside className="w-64 bg-surveillance-panel border-r border-surveillance-border flex flex-col justify-between h-[calc(100vh-4rem)] select-none shrink-0 overflow-y-auto">
      <div className="py-3">
        
        {/* Active Hazard Warning Badge */}
        {newAlertsCount > 0 && (
          <div className="mx-3 mb-3 p-2.5 bg-red-500/10 border border-red-500/40 rounded flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-4 w-4 animate-bounce shrink-0 text-red-500" />
            <div className="text-2xs leading-tight">
              <span className="font-bold">{newAlertsCount} {t('unresolved_alerts')}</span>
              {criticalCount > 0 && (
                <p className="font-black text-red-400 font-mono animate-pulse mt-0.5">
                  {criticalCount} {t('critical_level_incidents')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400 border-l-4 border-sky-400 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                
                {item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono shrink-0 ml-1 ${
                    item.id === 'incidents' || criticalCount > 0
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Control Room Footer Meta */}
      <div className="p-3 border-t border-surveillance-border text-[10px] font-mono text-slate-400 bg-slate-950/40">
        <div className="flex items-center space-x-1.5 text-emerald-400 font-bold mb-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('system_status')}: {t('secure')}</span>
        </div>
        <p className="text-slate-400 text-[9px] truncate">{t('tagline')}</p>
        <p className="text-slate-400 text-[8px] mt-0.5">{t('build')}: {t('build_version')}</p>
      </div>
    </aside>
  );
}

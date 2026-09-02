import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  LayoutDashboard, 
  Video, 
  MapPin, 
  BrainCircuit, 
  Settings, 
  FileSpreadsheet, 
  Sliders,
  AlertTriangle,
  Users,
  Eye
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

export default function Sidebar({ activeView, setActiveView }) {
  const { user } = useAuth();
  const { alerts } = useWebSocket();
  const { t } = useLanguage();

  // Calculate new/unresolved alerts
  const newAlertsCount = alerts.filter(a => a.status === 'New').length;
  const highRiskCount = alerts.filter(a => a.status === 'New' && a.risk_score >= 75).length;

  const menuItems = [
    { id: 'cctv', name: t('cctv'), icon: Video, badge: newAlertsCount },
    { id: 'area_focus', name: t('area_focus'), icon: BrainCircuit },
    { id: 'dashboard', name: t('dashboard'), icon: LayoutDashboard },
    { id: 'live_surveillance', name: t('live_surveillance'), icon: Eye },
    { id: 'heatmap', name: t('heatmap'), icon: MapPin },
    { id: 'cameras', name: t('cameras'), icon: Settings },
    { id: 'reports', name: t('reports'), icon: FileSpreadsheet },
    { id: 'settings', name: t('settings'), icon: Sliders }
  ];

  // Admin-only menu items
  if (user?.role === 'ADMIN') {
    menuItems.splice(8, 0, { id: 'users', name: t('users'), icon: Users });
  }

  return (
    <aside className="w-64 bg-surveillance-panel border-r border-surveillance-border flex flex-col justify-between h-[calc(100vh-4rem)] select-none">
      <div className="py-4">
        {/* Alerts status summary */}
        {newAlertsCount > 0 && (
          <div className="mx-4 mb-4 p-3 bg-surveillance-danger/10 border border-surveillance-danger/30 rounded flex items-center space-x-2 text-surveillance-danger">
            <AlertTriangle className="h-4 w-4 animate-bounce shrink-0" />
            <div className="text-xs">
              <span className="font-bold">{newAlertsCount} {t('unresolved_alerts')}</span>
              {highRiskCount > 0 && (
                <p className="font-semibold text-red-400 font-mono animate-pulse">
                  {highRiskCount} {t('critical_level_incidents')}
                </p>
              )}
            </div>
          </div>
        )}

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-surveillance-accent/15 text-surveillance-accent border-l-4 border-surveillance-accent'
                    : 'text-surveillance-textMuted hover:bg-surveillance-header hover:text-white border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-surveillance-accent' : 'text-surveillance-textMuted'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-2xs font-bold font-mono ${
                    highRiskCount > 0 
                      ? 'bg-surveillance-danger text-white animate-pulse-red' 
                      : 'bg-surveillance-warning text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Control Room Label */}
      <div className="p-4 border-t border-surveillance-border text-2xs font-mono text-surveillance-textMuted">
        <p>{t('system_status')}: {t('secure')}</p>
        <p>{t('build')}: GA-AI-2026-v1.0</p>
      </div>
    </aside>
  );
}

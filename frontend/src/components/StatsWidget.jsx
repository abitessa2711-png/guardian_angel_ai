import React from 'react';
import { Video, ShieldAlert, CheckCircle2, Radio, AlertOctagon } from 'lucide-react';

export default function StatsWidget({ stats }) {
  const items = [
    {
      label: 'TOTAL CAMERAS',
      value: stats?.total_cameras || 0,
      icon: Video,
      colorClass: 'text-surveillance-accent border-surveillance-accent/30 bg-surveillance-accent/5',
      glowClass: ''
    },
    {
      label: 'ACTIVE SURVEILLANCE',
      value: stats?.active_cameras || 0,
      suffix: ` / ${stats?.total_cameras || 0}`,
      icon: Radio,
      colorClass: 'text-surveillance-success border-surveillance-success/30 bg-surveillance-success/5',
      glowClass: 'animate-pulse-cyan'
    },
    {
      label: "TODAY'S ALERTS",
      value: stats?.today_alerts || 0,
      icon: ShieldAlert,
      colorClass: 'text-surveillance-warning border-surveillance-warning/30 bg-surveillance-warning/5',
      glowClass: stats?.today_alerts > 0 ? 'shadow-glow-amber' : ''
    },
    {
      label: 'HIGH RISK INCIDENTS',
      value: stats?.high_risk_incidents || 0,
      icon: AlertOctagon,
      colorClass: 'text-surveillance-danger border-surveillance-danger/30 bg-surveillance-danger/5',
      glowClass: stats?.high_risk_incidents > 0 ? 'shadow-glow-red border-red-500 animate-pulse' : ''
    },
    {
      label: 'RESOLVED CASES',
      value: stats?.resolved_cases || 0,
      icon: CheckCircle2,
      colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
      glowClass: ''
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div 
            key={index} 
            className={`border rounded p-4 bg-surveillance-panel flex flex-col justify-between transition-all ${item.colorClass} ${item.glowClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono tracking-widest text-surveillance-textMuted">{item.label}</span>
              <Icon className="h-5 w-5 shrink-0" />
            </div>
            
            <div className="mt-4 flex items-baseline">
              <span className="text-3xl font-black font-mono tracking-tight text-white">
                {item.value}
              </span>
              {item.suffix && (
                <span className="text-sm font-mono text-surveillance-textMuted ml-1">
                  {item.suffix}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

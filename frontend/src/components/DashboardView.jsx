import React from 'react';
import { 
  Video, 
  ShieldAlert, 
  Users, 
  Dog, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import LiveCameraFeed from './LiveCameraFeed';

export default function DashboardView({ 
  onSelectAlert, 
  onNavigateToTab,
  onCaptureSnapshot 
}) {
  // Top Stat Cards Data
  const stats = [
    {
      title: 'Total Cameras',
      value: '24',
      subtext: 'Active: 22',
      subtextType: 'success',
      icon: Users,
      bgColor: 'bg-blue-600',
    },
    {
      title: 'Total Alerts',
      value: '12',
      subtext: 'High: 5  Medium: 7',
      subtextType: 'warning',
      icon: ShieldAlert,
      bgColor: 'bg-emerald-600',
    },
    {
      title: 'People Detected',
      value: '156',
      subtext: 'Today',
      subtextType: 'muted',
      icon: Users,
      bgColor: 'bg-purple-600',
    },
    {
      title: 'Animals Detected',
      value: '18',
      subtext: 'Today',
      subtextType: 'muted',
      icon: Dog,
      bgColor: 'bg-orange-500',
    },
    {
      title: 'High Risk Events',
      value: '5',
      subtext: 'Today',
      subtextType: 'danger',
      icon: BarChart3,
      bgColor: 'bg-red-600',
    },
  ];

  // Donut Chart Data
  const riskDonutData = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 5, color: '#f97316' },
    { name: 'Medium', value: 2, color: '#eab308' },
    { name: 'Low', value: 0, color: '#22c55e' },
  ];

  // Bar Chart Data
  const riskBarData = [
    { name: 'Low', count: 0, fill: '#22c55e' },
    { name: 'Medium', count: 2, fill: '#eab308' },
    { name: 'High', count: 5, fill: '#f97316' },
    { name: 'Critical', count: 5, fill: '#ef4444' },
  ];

  // Recent Alerts List
  const recentAlerts = [
    {
      id: 'ALT-1042',
      time: '11:23:10 AM',
      risk: 'High',
      event: 'Animal on Road - Accident Risk',
      camera: 'Camera 04',
      category: 'Animal Safety'
    },
    {
      id: 'ALT-1041',
      time: '11:22:05 AM',
      risk: 'High',
      event: 'Person in Distress Detected',
      camera: 'Camera 02',
      category: 'Human Safety'
    },
    {
      id: 'ALT-1040',
      time: '11:21:47 AM',
      risk: 'Critical',
      event: 'Aggressive Behavior Detected',
      camera: 'Camera 07',
      category: 'Human Safety'
    },
    {
      id: 'ALT-1039',
      time: '11:20:31 AM',
      risk: 'Medium',
      event: 'Suspicious Interaction',
      camera: 'Camera 09',
      category: 'Public Safety'
    },
    {
      id: 'ALT-1038',
      time: '11:19:22 AM',
      risk: 'High',
      event: 'Animal Chasing Person',
      camera: 'Camera 03',
      category: 'Animal Safety'
    },
  ];

  return (
    <div className="space-y-4">
      
      {/* 1. Top 5 Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-4 flex items-center space-x-3.5 shadow-xs"
            >
              <div className={`${stat.bgColor} p-3 rounded-lg text-white shrink-0 flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 truncate tracking-tight">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{stat.value}</h3>
                <div className="text-xs font-medium mt-0.5">
                  {stat.subtextType === 'success' && (
                    <span className="text-emerald-700 font-semibold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'warning' && (
                    <span className="text-orange-700 font-semibold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'danger' && (
                    <span className="text-red-700 font-semibold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'muted' && (
                    <span className="text-slate-400">{stat.subtext}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Middle Row: Live Camera Feed (Left) & Risk / Recent Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Live Camera Feed (7 cols) */}
        <div className="lg:col-span-7">
          <LiveCameraFeed onCaptureSnapshot={onCaptureSnapshot} />
        </div>

        {/* Right Column: Risk Overview & Recent Alerts (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Risk Overview Donut Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Risk Overview
            </h4>
            
            <div className="flex items-center justify-between">
              {/* Donut Chart with Center Total */}
              <div className="relative w-36 h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {riskDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                  <span className="text-base font-extrabold text-slate-900 leading-none">12</span>
                  <span className="text-[10px] text-slate-500 font-medium">Alerts</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 ml-4 space-y-1.5 text-xs">
                {riskDonutData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <span className="text-slate-700 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Alerts Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Recent Alerts
                </h4>
                <button 
                  onClick={() => onNavigateToTab && onNavigateToTab('alerts')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-0.5 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {recentAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    onClick={() => onSelectAlert && onSelectAlert(alert)}
                    className="py-2 flex items-center justify-between hover:bg-slate-50 px-1 rounded transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <span className="text-[11px] text-slate-400 font-mono shrink-0">{alert.time}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        alert.risk === 'Critical' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : alert.risk === 'High'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {alert.risk}
                      </span>
                      <span className="text-xs text-slate-800 font-medium truncate">{alert.event}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">{alert.camera}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Row: Risk Distribution (Left) | Detection Summary (Center) | System Status (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Risk Level Distribution Bar Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
            Risk Level Distribution
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Detection Summary (Today) */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
            Detection Summary (Today)
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Total People Detected</span>
              <span className="font-bold text-slate-900 font-mono">156</span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Total Animals Detected</span>
              <span className="font-bold text-slate-900 font-mono">18</span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Total Vehicles Detected</span>
              <span className="font-bold text-slate-900 font-mono">132</span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Total Incidents</span>
              <span className="font-bold text-slate-900 font-mono">12</span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-600">Evidence Captured</span>
              <span className="font-bold text-slate-900 font-mono">24</span>
            </div>
          </div>
        </div>

        {/* Card 3: System Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
              System Status
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Camera Network</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Online</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">AI Models</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Storage</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Healthy</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">System Uptime</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span className="font-mono">99.8%</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400">
            Control Room Core ID: <span className="font-mono text-slate-600">CR-TRICHY-01</span>
          </div>
        </div>

      </div>

      {/* 4. Footer */}
      <footer className="text-center py-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-200 pt-3">
        <div className="flex-1 text-center">
          © 2025 Guardian Angel AI. All rights reserved.
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Version 1.0.0
        </div>
      </footer>

    </div>
  );
}

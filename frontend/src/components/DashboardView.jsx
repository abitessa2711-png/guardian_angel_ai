import React from 'react';
import { 
  Video, 
  ShieldAlert, 
  Users, 
  UserX,
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  Info,
  Siren,
  Scan,
  Eye,
  Activity
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
  // Top 6 Women Safety Dominant Stat Cards
  const stats = [
    {
      title: 'Active CCTV Cameras',
      value: '24',
      subtext: 'Active: 22',
      subtextType: 'success',
      icon: Video,
      bgColor: 'bg-blue-600',
    },
    {
      title: 'Women Detected',
      value: '156',
      subtext: 'Today Monitored',
      subtextType: 'muted',
      icon: Users,
      bgColor: 'bg-purple-600',
    },
    {
      title: 'Potential Distress',
      value: '8',
      subtext: 'Detected Today',
      subtextType: 'warning',
      icon: Scan,
      bgColor: 'bg-amber-500',
    },
    {
      title: 'Harassment Alerts',
      value: '5',
      subtext: 'Active Cases',
      subtextType: 'danger',
      icon: ShieldAlert,
      bgColor: 'bg-orange-600',
    },
    {
      title: 'High Risk Events',
      value: '3',
      subtext: 'Requires Verification',
      subtextType: 'danger',
      icon: AlertOctagon,
      bgColor: 'bg-red-600',
    },
    {
      title: 'Critical Events',
      value: '1',
      subtext: 'Immediate Dispatch',
      subtextType: 'danger',
      icon: Siren,
      bgColor: 'bg-rose-800',
    },
  ];

  // Donut Chart Data
  const riskDonutData = [
    { name: 'Critical Risk', value: 1, color: '#991b1b' },
    { name: 'High Risk', value: 3, color: '#ef4444' },
    { name: 'Medium Risk', value: 5, color: '#f59e0b' },
    { name: 'Low / Normal', value: 3, color: '#10b981' },
  ];

  // Bar Chart Data
  const riskBarData = [
    { name: 'Normal', count: 3, fill: '#10b981' },
    { name: 'Medium', count: 5, fill: '#f59e0b' },
    { name: 'High', count: 3, fill: '#ef4444' },
    { name: 'Critical', count: 1, fill: '#991b1b' },
  ];

  // Recent Women Safety Alerts List
  const recentAlerts = [
    {
      id: 'ALT-WOMEN-101',
      time: '11:24:10 AM',
      risk: 'Critical',
      event: 'Harassment Alert: Persistent Following & Grab Attempt',
      camera: 'Camera 02 - Transit Terminal Gate',
      category: 'Harassment Detection',
      confidence: 0.96,
      status: 'Dispatched'
    },
    {
      id: 'ALT-WOMEN-102',
      time: '11:22:05 AM',
      risk: 'High',
      event: 'Potential Distress Indicator (Facial Fear Conf: 92%)',
      camera: 'Camera 05 - Subway Walkway',
      category: 'Facial Distress',
      confidence: 0.92,
      status: 'New'
    },
    {
      id: 'ALT-WOMEN-103',
      time: '11:21:47 AM',
      risk: 'High',
      event: 'Aggressive Approach & Path Blocking Vector',
      camera: 'Camera 07 - Srirangam Temple South',
      category: 'Behavior Analysis',
      confidence: 0.94,
      status: 'Dispatched'
    },
    {
      id: 'ALT-WOMEN-104',
      time: '11:20:31 AM',
      risk: 'Medium',
      event: 'Suspicious Interaction & Close Trailing (0.8m gap)',
      camera: 'Camera 09 - Gandhi Market Lane',
      category: 'Behavior Analysis',
      confidence: 0.88,
      status: 'Verified'
    },
    {
      id: 'ALT-WOMEN-105',
      time: '11:15:40 AM',
      risk: 'Medium',
      event: 'Isolated Female Pedestrian Vulnerability Alert',
      camera: 'Camera 03 - Railway Junction East Gate',
      category: 'Women at Risk',
      confidence: 0.89,
      status: 'Resolved'
    },
  ];

  return (
    <div className="space-y-4">
      
      {/* Statutory Regulatory Disclaimer Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded-r-lg shadow-xs flex items-start space-x-3 text-xs">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="text-slate-800 leading-relaxed">
          <span className="font-bold text-blue-900 uppercase tracking-wide">Statutory Standard: </span>
          <span>Facial expression and movement analysis are probabilistic indicators and do <strong>not independently confirm harassment, abuse, or danger</strong>. All critical triggers require immediate operator verification and field officer coordination.</span>
        </div>
      </div>

      {/* 1. Top 6 Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 truncate tracking-tight uppercase">{stat.title}</p>
                <div className={`${stat.bgColor} p-1.5 rounded text-white shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">{stat.value}</h3>
                <div className="text-[11px] font-semibold mt-0.5">
                  {stat.subtextType === 'success' && (
                    <span className="text-emerald-700">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'warning' && (
                    <span className="text-amber-700">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'danger' && (
                    <span className="text-red-700 font-bold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'muted' && (
                    <span className="text-slate-400 font-normal">{stat.subtext}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Middle Row: Live Video Surveillance Feed (Left) & Risk / Recent Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Live Video Feed with Playback & Overlays (7 cols) */}
        <div className="lg:col-span-7">
          <LiveCameraFeed onCaptureSnapshot={onCaptureSnapshot} />
        </div>

        {/* Right Column: Multi-Factor Risk Overview & Recent Safety Alerts (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Risk Overview Donut Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Multi-Factor Risk Assessment
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">12 Cases Today</span>
            </div>
            
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
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Active</span>
                  <span className="text-lg font-black text-slate-900 leading-none">12</span>
                  <span className="text-[9px] text-slate-500 font-semibold">Alerts</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex-1 ml-4 space-y-1.5 text-xs">
                {riskDonutData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-[11px]">
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

          {/* Recent Women Safety Alerts Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Recent Women Safety Alerts</span>
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
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">{alert.time}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${
                        alert.risk === 'Critical' 
                          ? 'bg-red-100 text-red-800 border border-red-300 font-black' 
                          : alert.risk === 'High'
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {alert.risk}
                      </span>
                      <span className="text-xs text-slate-900 font-semibold truncate">{alert.event}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium shrink-0">{alert.camera.split('-')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Row: Risk Distribution | Detection Summary | System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Risk Level Distribution Bar Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Risk Severity Spectrum (Today)
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
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Women Safety Telemetry (24h)
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Women Subjects Monitored</span>
              <span className="font-bold text-slate-900 font-mono">156</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Potential Distress Indicators</span>
              <span className="font-bold text-amber-700 font-mono">8</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Harassment & Following Alerts</span>
              <span className="font-bold text-red-700 font-mono">5</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Active Patrol Dispatches</span>
              <span className="font-bold text-purple-700 font-mono">4</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Cryptographic Evidence Vaulted</span>
              <span className="font-bold text-blue-700 font-mono">12 Frames</span>
            </div>
          </div>
        </div>

        {/* Card 3: System Status */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              Command Core Health
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Camera Surveillance Grid</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>22 / 24 Online</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Edge AI Pose & Emotion Models</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Active (18ms)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Evidence Vault Integrity</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>SHA-256 Locked</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">PCR Dispatch Wireless Gateway</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span className="font-mono">Connected</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Node ID: <span className="font-mono text-slate-600 font-bold">TN-WOMEN-SAFETY-GRID-01</span>
          </div>
        </div>

      </div>

      {/* 4. Footer */}
      <footer className="text-center py-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-200 pt-3">
        <div className="flex-1 text-center">
          © 2025 Guardian Angel AI. Women Safety Command Center.
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Version 2.0.0
        </div>
      </footer>

    </div>
  );
}

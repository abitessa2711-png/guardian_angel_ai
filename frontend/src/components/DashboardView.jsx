import React from 'react';
import { 
  Video, 
  Users, 
  Scan, 
  ShieldAlert, 
  AlertOctagon, 
  ChevronRight,
  Info,
  ExternalLink
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
  // Top 5 Government Summary Statistic Cards (Clean & Serious)
  const stats = [
    {
      title: 'Active Cameras',
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
      subtext: 'Indicators Flagged',
      subtextType: 'warning',
      icon: Scan,
      bgColor: 'bg-amber-500',
    },
    {
      title: 'Active Safety Alerts',
      value: '5',
      subtext: 'Under Triage',
      subtextType: 'danger',
      icon: ShieldAlert,
      bgColor: 'bg-orange-600',
    },
    {
      title: 'High / Critical Risk',
      value: '4',
      subtext: 'Immediate Action',
      subtextType: 'danger',
      icon: AlertOctagon,
      bgColor: 'bg-red-600',
    },
  ];

  // Risk Distribution Data
  const riskDonutData = [
    { name: 'Critical', value: 1, color: '#991b1b' },
    { name: 'High', value: 3, color: '#ef4444' },
    { name: 'Medium', value: 5, color: '#f59e0b' },
    { name: 'Low', value: 3, color: '#10b981' },
  ];

  const riskBarData = [
    { name: 'Low', count: 3, fill: '#10b981' },
    { name: 'Medium', count: 5, fill: '#f59e0b' },
    { name: 'High', count: 3, fill: '#ef4444' },
    { name: 'Critical', count: 1, fill: '#991b1b' },
  ];

  // Recent Alerts List
  const recentAlerts = [
    {
      id: 'ALT-1042',
      time: '11:24:10 AM',
      risk: 'Critical',
      event: 'Harassment: Stalking Vector & Grab Attempt',
      camera: 'Camera 02 - Transit Terminal',
      confidence: 0.96,
      status: 'Dispatched'
    },
    {
      id: 'ALT-1041',
      time: '11:22:05 AM',
      risk: 'High',
      event: 'Potential Distress Indicator (Fear: 92%)',
      camera: 'Camera 05 - Subway Corridor',
      confidence: 0.92,
      status: 'New'
    },
    {
      id: 'ALT-1040',
      time: '11:21:47 AM',
      risk: 'Critical',
      event: 'Aggressive Approach & Physical Struggle',
      camera: 'Camera 07 - Srirangam South Gate',
      confidence: 0.98,
      status: 'Dispatched'
    },
    {
      id: 'ALT-1039',
      time: '11:20:31 AM',
      risk: 'Medium',
      event: 'Suspicious Interaction (Following: 18m)',
      camera: 'Camera 09 - Gandhi Market Alley',
      confidence: 0.88,
      status: 'Verified'
    },
    {
      id: 'ALT-1038',
      time: '11:15:40 AM',
      risk: 'Medium',
      event: 'Solo Female Pedestrian Vulnerability Alert',
      camera: 'Camera 03 - Railway Station North',
      confidence: 0.89,
      status: 'Resolved'
    },
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Statutory Government Notice Banner */}
      <div className="bg-slate-100 border border-slate-300 p-2.5 rounded text-xs text-slate-700 flex items-center space-x-2">
        <Info className="w-4 h-4 text-blue-700 shrink-0" />
        <span>
          <strong>Ethical AI Notice:</strong> Facial emotion & movement detections are probabilistic indicators and do <strong>not independently confirm harassment or danger</strong>. All critical triggers require immediate human operator verification.
        </span>
      </div>

      {/* 1. Top 5 Summary Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded border border-slate-200 p-3.5 flex items-center space-x-3.5 shadow-xs"
            >
              <div className={`${stat.bgColor} p-3 rounded text-white shrink-0 flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-500 truncate tracking-tight uppercase">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight font-mono">{stat.value}</h3>
                <div className="text-xs font-medium mt-0.5">
                  {stat.subtextType === 'success' && (
                    <span className="text-emerald-700 font-semibold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'warning' && (
                    <span className="text-amber-700 font-semibold">{stat.subtext}</span>
                  )}
                  {stat.subtextType === 'danger' && (
                    <span className="text-red-700 font-bold">{stat.subtext}</span>
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

      {/* 2. Middle Row: Live CCTV Player (Left) & Risk Overview / Recent Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Live CCTV Player (7 cols) */}
        <div className="lg:col-span-7">
          <LiveCameraFeed onCaptureSnapshot={onCaptureSnapshot} />
        </div>

        {/* Right Column: Multi-Factor Risk Assessment & Recent Alerts (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Risk Overview Donut Card */}
          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Risk Overview
              </h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">12 Total Alerts</span>
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
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Total</span>
                  <span className="text-base font-black text-slate-900 leading-none">12</span>
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

          {/* Recent Alerts Card */}
          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs flex-1 flex flex-col justify-between">
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

      {/* 3. Bottom Row: Risk Trend Bar Chart | Detection Summary | System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Risk Level Distribution Bar Chart */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Risk Level Distribution
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Detection Summary (Today) */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Detection Summary (Today)
          </h4>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Total Women Detected</span>
              <span className="font-bold text-slate-900 font-mono">156</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Potential Distress Indicators</span>
              <span className="font-bold text-amber-700 font-mono">8</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Harassment & Trailing Alerts</span>
              <span className="font-bold text-red-700 font-mono">5</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Active Patrol Dispatches</span>
              <span className="font-bold text-purple-700 font-mono">4</span>
            </div>
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-600">Evidence Frames Vaulted</span>
              <span className="font-bold text-blue-700 font-mono">12 Frames</span>
            </div>
          </div>
        </div>

        {/* Card 3: System Status */}
        <div className="bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              System Status
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Camera Network</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Online (22 / 24)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">AI Pose & Emotion Models</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Active (18ms)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Evidence Vault Storage</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span>Healthy (2.4 TB)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">System Availability</span>
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                  <span className="font-mono">99.85%</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Tamil Nadu Police Women Safety Grid • Node #01
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

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Filter,
  Users,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('7d');

  // 1. 24h Risk, Distress & Harassment Trend
  const hourlyTrend = [
    { hour: '00:00', distress: 1, harassment: 0, totalRisk: 1 },
    { hour: '04:00', distress: 1, harassment: 1, totalRisk: 2 },
    { hour: '08:00', distress: 3, harassment: 2, totalRisk: 5 },
    { hour: '12:00', distress: 4, harassment: 3, totalRisk: 7 },
    { hour: '16:00', distress: 6, harassment: 4, totalRisk: 10 },
    { hour: '18:00', distress: 8, harassment: 5, totalRisk: 13 },
    { hour: '20:00', distress: 7, harassment: 4, totalRisk: 11 },
    { hour: '22:00', distress: 3, harassment: 2, totalRisk: 5 },
  ];

  // 2. Camera-Wise Incidents
  const cameraIncidents = [
    { cam: 'CAM 01 (Bus Stand)', incidents: 18, critical: 4 },
    { cam: 'CAM 04 (Market)', incidents: 14, critical: 3 },
    { cam: 'CAM 05 (Campus)', incidents: 12, critical: 2 },
    { cam: 'CAM 12 (Temple Rd)', incidents: 9, critical: 2 },
    { cam: 'CAM 03 (Railway)', incidents: 8, critical: 1 },
    { cam: 'CAM 09 (Shopping)', incidents: 7, critical: 1 },
  ];

  // 3. Risk Distribution
  const riskDistribution = [
    { name: 'Critical Risk', value: 8, color: '#991b1b' },
    { name: 'High Risk', value: 18, color: '#ef4444' },
    { name: 'Medium Risk', value: 34, color: '#f59e0b' },
    { name: 'Low / Normal', value: 40, color: '#10b981' },
  ];

  // 4. Verified vs False Alerts (Officer Triage)
  const verificationData = [
    { day: 'Mon', verified: 14, falseAlarm: 2 },
    { day: 'Tue', verified: 18, falseAlarm: 1 },
    { day: 'Wed', verified: 15, falseAlarm: 3 },
    { day: 'Thu', verified: 21, falseAlarm: 2 },
    { day: 'Fri', verified: 24, falseAlarm: 2 },
    { day: 'Sat', verified: 28, falseAlarm: 3 },
    { day: 'Sun', verified: 22, falseAlarm: 1 },
  ];

  return (
    <div className="space-y-3 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-700" />
            <span>Surveillance Intelligence & Pattern Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Statistical risk modeling, distress trends, camera hotspots, and duty officer verification rates.</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs font-semibold">
            {['24h', '7d', '30d'].map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                  timeRange === r ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Interception ETA</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">3m 42s</span>
            <span className="text-[11px] text-emerald-700 font-semibold">↓ 18% faster than baseline</span>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Verification Accuracy</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">94.8%</span>
            <span className="text-[11px] text-emerald-700 font-semibold">Validated by Police Duty Officers</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded border border-slate-200 p-3 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Distress & Stalking Interventions</span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">48 Cases</span>
            <span className="text-[11px] text-purple-700 font-semibold">Proactive patrol responses</span>
          </div>
          <div className="p-2.5 bg-purple-50 text-purple-700 rounded">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Row 2: 24h Multi-Factor Threat Trend (7 cols) & Risk Distribution (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Trend Area Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded border border-slate-200 p-3 shadow-xs">
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              24-Hour Distress & Harassment Anomaly Trend
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Peak: 18:00–21:00</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '4px', fontSize: '10px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                <Area type="monotone" dataKey="distress" stroke="#f59e0b" fill="#fef3c7" name="Facial Distress" />
                <Area type="monotone" dataKey="harassment" stroke="#ef4444" fill="#fee2e2" name="Harassment / Following" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Overall Risk Severity Spectrum
              </h4>
              <span className="text-[10px] font-mono text-slate-500">100 Cases</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1 text-xs pt-1.5 border-t border-slate-100">
            {riskDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Camera Hotspots (6 cols) & Verified vs False Alerts (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Camera Hotspots (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded border border-slate-200 p-3 shadow-xs">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-200">
            Camera-Wise Incident Density
          </h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cameraIncidents} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="cam" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                <Bar dataKey="incidents" fill="#3b82f6" name="Total Incidents" radius={[2, 2, 0, 0]} />
                <Bar dataKey="critical" fill="#ef4444" name="Critical Events" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Verified vs False Alerts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded border border-slate-200 p-3 shadow-xs">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 pb-1.5 border-b border-slate-200">
            Officer Verification & Ground Truth Validation
          </h4>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} />
                <Bar dataKey="verified" fill="#10b981" name="Verified Threats" stackId="a" />
                <Bar dataKey="falseAlarm" fill="#94a3b8" name="False Alarms Dismissed" stackId="a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

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
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Filter 
} from 'lucide-react';

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState('7d'); // '24h', '7d', '30d'

  // Hourly Incident Peak Trend Data (24 hrs)
  const hourlyData = [
    { hour: '00:00', alerts: 1, people: 12, vehicles: 25 },
    { hour: '02:00', alerts: 0, people: 4, vehicles: 10 },
    { hour: '04:00', alerts: 1, people: 8, vehicles: 18 },
    { hour: '06:00', alerts: 2, people: 45, vehicles: 85 },
    { hour: '08:00', alerts: 3, people: 120, vehicles: 210 },
    { hour: '10:00', alerts: 4, people: 180, vehicles: 290 },
    { hour: '12:00', alerts: 3, people: 140, vehicles: 240 },
    { hour: '14:00', alerts: 2, people: 110, vehicles: 190 },
    { hour: '16:00', alerts: 4, people: 175, vehicles: 280 },
    { hour: '18:00', alerts: 5, people: 240, vehicles: 340 },
    { hour: '20:00', alerts: 6, people: 210, vehicles: 260 },
    { hour: '22:00', alerts: 4, people: 85, vehicles: 110 },
  ];

  // 7-Day Detection Comparison (People vs Animals vs Vehicles)
  const dailyDetectionsData = [
    { day: 'Mon', people: 1420, animals: 145, vehicles: 2890 },
    { day: 'Tue', people: 1560, animals: 160, vehicles: 3100 },
    { day: 'Wed', people: 1490, animals: 130, vehicles: 2950 },
    { day: 'Thu', people: 1680, animals: 175, vehicles: 3420 },
    { day: 'Fri', people: 1850, animals: 190, vehicles: 3800 },
    { day: 'Sat', people: 2100, animals: 210, vehicles: 4100 },
    { day: 'Sun', people: 1980, animals: 180, vehicles: 3600 },
  ];

  // Risk Distribution Across City Wards / Zones
  const wardRiskData = [
    { ward: 'Sector 1 (Central)', low: 12, medium: 8, high: 4, critical: 2 },
    { ward: 'Sector 2 (North Gate)', low: 18, medium: 5, high: 2, critical: 1 },
    { ward: 'Sector 3 (Transit/Rail)', low: 9, medium: 14, high: 7, critical: 3 },
    { ward: 'Sector 4 (Highway Loop)', low: 22, medium: 6, high: 3, critical: 0 },
    { ward: 'Sector 5 (Subways)', low: 5, medium: 9, high: 5, critical: 2 },
  ];

  // Category Breakdown
  const categoryPieData = [
    { name: 'Human Safety (Distress/Struggle)', value: 42, color: '#3b82f6' },
    { name: 'Animal & Road Hazards', value: 28, color: '#f97316' },
    { name: 'Public Loitering / Suspicious Trailing', value: 20, color: '#eab308' },
    { name: 'Traffic Obstruction / Accidents', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Surveillance Analytics & Risk Intelligence</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated statistical telemetry and pattern assessment across municipal sectors.</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            {[
              { id: '24h', label: 'Last 24 Hrs' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === range.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button 
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors cursor-pointer"
            onClick={() => window.print()}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Average Dispatch Response</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">3m 42s</span>
            <span className="text-xs text-emerald-700 font-medium">↓ 18% faster than baseline</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">AI Incident Verification Accuracy</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">94.8%</span>
            <span className="text-xs text-emerald-700 font-medium">Validated by Duty Officers</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Risk Events Prevented</span>
            <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">48</span>
            <span className="text-xs text-blue-700 font-medium">Early proactive interventions</span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row 2: Hourly Peak Trend (Left) & Category Breakdown Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Hourly Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Hourly Incident Peak Trend</h4>
              <p className="text-[11px] text-slate-400">Peak safety alerts correlate with 18:00–22:00 evening rush.</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">24-Hour Curve</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="alerts" stroke="#1d4ed8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAlerts)" name="Risk Alerts" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">
              Alert Category Breakdown
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">Distribution of verified safety anomalies.</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
            {categoryPieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 truncate max-w-[200px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Detection Volume (People vs Animals vs Vehicles) & Ward Risk Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Detection Volume Over 7 Days (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Weekly Detection Volume Comparison
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDetectionsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="people" fill="#9333ea" name="People" radius={[3, 3, 0, 0]} />
                <Bar dataKey="vehicles" fill="#3b82f6" name="Vehicles" radius={[3, 3, 0, 0]} />
                <Bar dataKey="animals" fill="#f97316" name="Animals" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Risk Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
            Risk Severity Across City Sectors
          </h4>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardRiskData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="ward" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="medium" fill="#eab308" name="Medium Risk" stackId="a" />
                <Bar dataKey="high" fill="#f97316" name="High Risk" stackId="a" />
                <Bar dataKey="critical" fill="#ef4444" name="Critical Risk" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

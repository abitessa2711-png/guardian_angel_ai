import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { TrendingUp, Activity, PieChart as PieIcon, BarChart3, Clock } from 'lucide-react';

export default function AnalyticsCharts({ data }) {
  const { t, language } = useLanguage();
  const trends = data?.trends || [
    { date: 'Shift 1', avg_risk: 32, alerts: 1, temp: 31.5 },
    { date: 'Shift 2', avg_risk: 38, alerts: 2, temp: 33.0 },
    { date: 'Shift 3', avg_risk: 42, alerts: 1, temp: 34.2 },
    { date: 'Shift 4', avg_risk: 48, alerts: 3, temp: 35.8 },
    { date: 'Shift 5', avg_risk: 65, alerts: 4, temp: 38.5 },
    { date: 'Shift 6', avg_risk: 54, alerts: 2, temp: 36.2 },
    { date: 'Shift 7', avg_risk: 34, alerts: 1, temp: 32.0 }
  ];
  
  const locations = data?.locations || [
    { location: 'Mixing Shed 1', alerts: 4, avg_risk: 62 },
    { location: 'Grinding Shed', alerts: 6, avg_risk: 78 },
    { location: 'Drying Yard', alerts: 1, avg_risk: 28 },
    { location: 'Magazine Vault', alerts: 2, avg_risk: 52 },
    { location: 'Assembly Hall', alerts: 3, avg_risk: 42 }
  ];

  const distribution = data?.risk_distribution || [
    { name: 'Safe Operations (<40%)', value: 65, color: '#10b981' },
    { name: 'Caution / Warning (40-74%)', value: 25, color: '#f59e0b' },
    { name: 'Critical Thermal Alert (>75%)', value: 10, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded shadow-xl font-mono text-2xs text-white">
          <p className="font-bold border-b border-slate-700 pb-1 mb-1 uppercase text-sky-400">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || item.fill }}>
              {item.name}: <span className="font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 select-none font-mono">
      
      {/* Top Section: AI Risk History Multi-Metric Trend Area Chart */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 shadow-cmd">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold tracking-wider text-white uppercase flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-sky-400" />
            <span>AI Predictive Safety Risk & Environmental Anomaly Timeline</span>
          </h4>
          <span className="text-[10px] text-slate-400">Shift History (7 Days)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="alertGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" opacity={0.6} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="avg_risk" 
                name="Average Risk Index (%)" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#riskGlow)" 
              />
              <Area 
                type="monotone" 
                dataKey="alerts" 
                name="Incident Alert Count" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#alertGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: 2 Side-by-Side Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Incident Distribution by Zone (Bar Chart) */}
        <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 shadow-cmd">
          <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-3 flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-sky-400" />
            <span>Hazard Alert Frequency by Factory Zone</span>
          </h4>
          
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" opacity={0.5} />
                <XAxis dataKey="location" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="alerts" name="Safety Alerts" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                  {locations.map((entry, index) => {
                    let barColor = '#10b981';
                    if (entry.avg_risk >= 70) barColor = '#ef4444';
                    else if (entry.avg_risk >= 45) barColor = '#f59e0b';
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Hazard Severity Ratio (Donut / Pie Chart) */}
        <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 shadow-cmd">
          <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-3 flex items-center space-x-2">
            <PieIcon className="h-4 w-4 text-sky-400" />
            <span>Safety Severity Ratio Segmentation</span>
          </h4>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-mono text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

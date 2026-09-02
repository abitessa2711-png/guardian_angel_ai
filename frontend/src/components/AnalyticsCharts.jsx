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

export default function AnalyticsCharts({ data }) {
  const trends = data?.trends || [];
  const locations = data?.locations || [];
  const distribution = data?.risk_distribution || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surveillance-panel border border-surveillance-border p-3 rounded shadow font-mono text-xs text-white">
          <p className="font-bold border-b border-surveillance-border/50 pb-1 mb-1.5 uppercase">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color || item.fill }}>
              {item.name.toUpperCase()}: {item.value}
            </p>
          ))}
        </div>
      );
    };
    return null;
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Grid: Risk trends (Area Chart) */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
        <h4 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase mb-4">
          WEEKLY SAFETY RISK TREND TIMELINE
        </h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff66" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="alertGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" opacity={0.3} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="avg_risk" 
                name="Average Risk %" 
                stroke="#00ff66" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#riskGlow)" 
              />
              <Area 
                type="monotone" 
                dataKey="alerts" 
                name="Alert Volume" 
                stroke="#f59e0b" 
                strokeWidth={1.5}
                fillOpacity={1} 
                fill="url(#alertGlow)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: 2 Charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Alerts by Location (Bar Chart) */}
        <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
          <h4 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase mb-4">
            INCIDENT DISTRIBUTION BY CAMERA ZONE
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locations} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" opacity={0.2} />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={8} tickFormatter={(str) => str.split(' ')[0]} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="alerts" name="Incidents Volume" fill="#00ff66" radius={[4, 4, 0, 0]}>
                  {locations.map((entry, index) => {
                    // Assign colors dynamically based on average risk level
                    let barColor = '#00ff66'; // Neon Green (Safe)
                    if (entry.avg_risk >= 75) barColor = '#ef4444'; // Red (Critical)
                    else if (entry.avg_risk >= 45) barColor = '#f59e0b'; // Yellow (Warning)
                    
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Risk Level share (Pie Chart) */}
        <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
          <h4 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase mb-4">
            THREAT SEVERITY RATIO SEGMENTATION
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
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
                  formatter={(value) => <span className="text-xs font-mono text-surveillance-textMuted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}

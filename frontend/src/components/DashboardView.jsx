import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Scan, 
  ShieldAlert, 
  AlertOctagon, 
  Camera, 
  Maximize2, 
  ChevronRight,
  Info,
  Send,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const ALL_16_CAMERAS = [
  { id: 'CAM 01', name: 'CAM 01 — Central Bus Stand', location: 'Central Bus Stand', video: '/videos/crowd.mp4', status: 'LIVE', risk: 'HIGH', face: 'DISTRESS (88%)', behavior: 'FOLLOWING (0.8m)', threat: true, person: 'Woman #4412' },
  { id: 'CAM 02', name: 'CAM 02 — Main Junction', location: 'Main Junction', video: '/videos/traffic.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL ACTIVITY', threat: false, person: 'Woman #4421' },
  { id: 'CAM 03', name: 'CAM 03 — Railway Station', location: 'Railway Station', video: '/videos/threat.mp4', status: 'LIVE', risk: 'HIGH', face: 'FEAR (92%)', behavior: 'CHASING VECTOR', threat: true, person: 'Woman #4435' },
  { id: 'CAM 04', name: 'CAM 04 — Market Area', location: 'Market Area', video: '/videos/crowd.mp4', status: 'LIVE', risk: 'CRITICAL', face: 'FEAR (95%)', behavior: 'STALKING (18m)', threat: true, person: 'Woman #4440' },
  { id: 'CAM 05', name: 'CAM 05 — College Campus', location: 'College Campus', video: '/videos/isolated.mp4', status: 'LIVE', risk: 'HIGH', face: 'DISTRESS (86%)', behavior: 'ISOLATED WALKWAY', threat: true, person: 'Woman #4419' },
  { id: 'CAM 06', name: 'CAM 06 — Public Street', location: 'Public Street', video: '/videos/isolated.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL COMMUTE', threat: false, person: 'Woman #4451' },
  { id: 'CAM 07', name: 'CAM 07 — Bus Stop', location: 'Bus Stop', video: '/videos/crowd.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'WAITING TRANSIT', threat: false, person: 'Woman #4458' },
  { id: 'CAM 08', name: 'CAM 08 — Parking Area', location: 'Parking Area', video: '/videos/isolated.mp4', status: 'LIVE', risk: 'MEDIUM', face: 'SADNESS (74%)', behavior: 'LOITERING NEAR CARS', threat: false, person: 'Woman #4462' },
  { id: 'CAM 09', name: 'CAM 09 — Shopping Area', location: 'Shopping Area', video: '/videos/crowd.mp4', status: 'LIVE', risk: 'HIGH', face: 'ANGER / FEAR', behavior: 'AGGRESSIVE APPROACH', threat: true, person: 'Woman #4470' },
  { id: 'CAM 10', name: 'CAM 10 — Traffic Junction', location: 'Traffic Junction', video: '/videos/traffic.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL TRANSIT', threat: false, person: 'Woman #4475' },
  { id: 'CAM 11', name: 'CAM 11 — Railway Entrance', location: 'Railway Entrance', video: '/videos/threat.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL COMMUTE', threat: false, person: 'Woman #4480' },
  { id: 'CAM 12', name: 'CAM 12 — Temple Road', location: 'Temple Road', video: '/videos/traffic.mp4', status: 'LIVE', risk: 'CRITICAL', face: 'FEAR (98%)', behavior: 'PHYSICAL STRUGGLE', threat: true, person: 'Woman #4418' },
  { id: 'CAM 13', name: 'CAM 13 — Bus Terminal', location: 'Bus Terminal', video: '/videos/crowd.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL TRANSIT', threat: false, person: 'Woman #4491' },
  { id: 'CAM 14', name: 'CAM 14 — Campus Gate', location: 'Campus Gate', video: '/videos/isolated.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL COMMUTE', threat: false, person: 'Woman #4495' },
  { id: 'CAM 15', name: 'CAM 15 — Main Road', location: 'Main Road', video: '/videos/traffic.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL ACTIVITY', threat: false, person: 'Woman #4501' },
  { id: 'CAM 16', name: 'CAM 16 — Public Parking', location: 'Public Parking', video: '/videos/isolated.mp4', status: 'LIVE', risk: 'LOW', face: 'NORMAL', behavior: 'NORMAL COMMUTE', threat: false, person: 'Woman #4509' },
];

export default function DashboardView({ 
  onSelectAlert, 
  onNavigateToTab,
  onCaptureSnapshot 
}) {
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Top 5 Statistics
  const topStats = [
    { title: 'Active Cameras', value: '24', subtext: '22 Feeds Online', color: 'border-l-blue-600', icon: Video, iconBg: 'bg-blue-600' },
    { title: 'Women Detected', value: '156', subtext: 'Monitored Today', color: 'border-l-purple-600', icon: Users, iconBg: 'bg-purple-600' },
    { title: 'Potential Distress', value: '8', subtext: 'Indicators Flagged', color: 'border-l-amber-500', icon: Scan, iconBg: 'bg-amber-500' },
    { title: 'Active Alerts', value: '5', subtext: 'Under Response', color: 'border-l-orange-600', icon: ShieldAlert, iconBg: 'bg-orange-600' },
    { title: 'High / Critical Risk', value: '4', subtext: 'Action Required', color: 'border-l-red-600', icon: AlertOctagon, iconBg: 'bg-red-600' },
  ];

  // Recent Alerts
  const recentAlerts = [
    { id: 'ALT-1042', time: '11:24:10', camera: 'CAM 01', location: 'Central Bus Stand', event: 'Following & Close Trailing (0.8m)', risk: 'Critical', status: 'Dispatched' },
    { id: 'ALT-1041', time: '11:22:05', camera: 'CAM 05', location: 'College Campus', event: 'Potential Distress Indicator (Fear: 92%)', risk: 'High', status: 'Verified' },
    { id: 'ALT-1040', time: '11:21:47', camera: 'CAM 12', location: 'Temple Road', event: 'Physical Struggle & Grab Attempt', risk: 'Critical', status: 'Dispatched' },
    { id: 'ALT-1039', time: '11:20:31', camera: 'CAM 04', location: 'Market Area', event: 'Stalking Vector (18m Duration)', risk: 'High', status: 'Verified' },
    { id: 'ALT-1038', time: '11:18:20', camera: 'CAM 09', location: 'Shopping Area', event: 'Aggressive Approach & Path Block', risk: 'High', status: 'Pending' },
  ];

  const riskTrendData = [
    { hour: '06:00', Low: 4, Med: 1, High: 0, Crit: 0 },
    { hour: '08:00', Low: 12, Med: 3, High: 1, Crit: 0 },
    { hour: '10:00', Low: 18, Med: 4, High: 2, Crit: 1 },
    { hour: '12:00', Low: 14, Med: 5, High: 3, Crit: 1 },
    { hour: '14:00', Low: 9, Med: 2, High: 1, Crit: 0 },
  ];

  return (
    <div className="space-y-3 select-none">
      
      {/* 1. TOP 5 COMPACT STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {topStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className={`bg-white rounded border border-slate-200 p-2.5 flex items-center space-x-3 shadow-xs border-l-4 ${stat.color}`}
            >
              <div className={`${stat.iconBg} p-2 rounded text-white shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block truncate">
                  {stat.title}
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xl font-black text-slate-900 font-mono leading-tight">{stat.value}</span>
                  <span className="text-[10px] text-slate-500 font-medium truncate">{stat.subtext}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. MAIN FEATURE — 16 CCTV FEEDS MONITOR WALL (4x4 DENSE GRID) */}
      <div className="bg-white rounded border border-slate-200 shadow-xs p-3">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-blue-700" />
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
              CCTV Surveillance Monitor Wall (16 Live Matrix Feeds)
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-mono">
            <span className="flex items-center space-x-1 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>16 / 16 STREAMING</span>
            </span>
            <span>•</span>
            <span>H.265 / 1080p</span>
          </div>
        </div>

        {/* 4x4 Grid of CCTV Video Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ALL_16_CAMERAS.map((cam) => {
            const isCritical = cam.risk === 'CRITICAL';
            const isHigh = cam.risk === 'HIGH';

            return (
              <div
                key={cam.id}
                onClick={() => onNavigateToTab && onNavigateToTab('live_monitoring')}
                className={`bg-black rounded border overflow-hidden transition-all relative flex flex-col cursor-pointer group ${
                  isCritical 
                    ? 'border-red-600 ring-2 ring-red-600' 
                    : isHigh 
                    ? 'border-orange-500 ring-1 ring-orange-500' 
                    : 'border-slate-800 hover:border-blue-500'
                }`}
              >
                {/* Tile Header Bar */}
                <div className={`px-2 py-1 flex items-center justify-between text-[10px] font-mono border-b ${
                  isCritical ? 'bg-red-950 text-red-200 border-red-800' : isHigh ? 'bg-orange-950 text-orange-200 border-orange-800' : 'bg-[#0b1b30] text-slate-300 border-slate-800'
                }`}>
                  <span className="font-bold truncate">{cam.id} — {cam.location}</span>
                  <span className={`px-1 py-0.2 rounded text-[8px] font-black uppercase ${
                    isCritical ? 'bg-red-600 text-white animate-pulse' : isHigh ? 'bg-orange-600 text-white' : 'bg-emerald-700 text-white'
                  }`}>
                    {cam.risk}
                  </span>
                </div>

                {/* CCTV Video Stream Frame */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                  <video
                    src={cam.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover brightness-95 contrast-105"
                  />

                  {/* Overlaid Thin Computer Vision Bounding Boxes (SVG) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Person / Woman Detection Box */}
                    <rect x="25" y="32" width="14" height="38" fill="none" stroke="#10b981" strokeWidth="0.8" rx="0.5" />
                    <rect x="25" y="27.5" width="18" height="4" fill="#10b981" rx="0.3" />
                    <text x="34" y="30.5" fill="#ffffff" fontSize="2.4" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {cam.person}
                    </text>

                    {/* Facial Expression Box & Indicator */}
                    <rect x="29" y="34" width="6" height="7" fill="none" stroke="#ef4444" strokeWidth="0.6" rx="0.3" />
                    <rect x="20" y="22.5" width="28" height="4" fill={cam.threat ? '#ef4444' : '#10b981'} rx="0.3" />
                    <text x="34" y="25.5" fill="#ffffff" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      FACE: {cam.face}
                    </text>

                    {/* Threat Behavior Vector if threat active */}
                    {cam.threat && (
                      <>
                        <rect x="8" y="34" width="13" height="40" fill="none" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5, 0.5" rx="0.5" />
                        <line x1="21" y1="52" x2="25" y2="52" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="1, 0.5" />
                        <rect x="6" y="75" width="34" height="4.5" fill="#991b1b" rx="0.3" />
                        <text x="23" y="78.2" fill="#ffffff" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                          {cam.behavior}
                        </text>
                      </>
                    )}
                  </svg>

                  {/* Top-Left: LIVE Badge & Time */}
                  <div className="absolute top-1.5 left-1.5 flex items-center space-x-1 z-20">
                    <span className="bg-emerald-600/90 text-white text-[8px] font-bold px-1 py-0.2 rounded">
                      ● LIVE
                    </span>
                    <span className="bg-slate-900/80 text-white font-mono text-[8px] px-1 py-0.2 rounded">
                      {liveTime}
                    </span>
                  </div>

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-30 pointer-events-none">
                    <span className="bg-slate-900/90 text-white px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>Inspect Feed</span>
                    </span>
                  </div>
                </div>

                {/* Tile Footer Meta */}
                <div className="bg-[#0b1b30] px-2 py-1 text-[9px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-800">
                  <span className="truncate">{cam.behavior}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCaptureSnapshot) onCaptureSnapshot(cam);
                    }}
                    className="p-0.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                    title="Capture Evidence Frame"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. DASHBOARD BOTTOM: RECENT ALERTS (LEFT 8 COLS) + RISK TREND (RIGHT 4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Recent Alerts Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded border border-slate-200 shadow-xs p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Recent Incident Alerts Log</span>
            </h4>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('alerts')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-0.5 cursor-pointer"
            >
              <span>View All Alerts</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <th className="py-1.5 px-2.5">Time</th>
                  <th className="py-1.5 px-2">Camera</th>
                  <th className="py-1.5 px-2.5">Location</th>
                  <th className="py-1.5 px-2.5">Detected Event</th>
                  <th className="py-1.5 px-2">Risk</th>
                  <th className="py-1.5 px-2">Status</th>
                  <th className="py-1.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {recentAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-slate-50">
                    <td className="py-2 px-2.5 font-mono text-[11px] font-bold text-slate-700">{alert.time}</td>
                    <td className="py-2 px-2 font-mono font-bold text-blue-800">{alert.camera}</td>
                    <td className="py-2 px-2.5 text-slate-700 font-medium">{alert.location}</td>
                    <td className="py-2 px-2.5 text-slate-900 font-semibold">{alert.event}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                        alert.risk === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {alert.risk}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="text-[10px] font-bold text-slate-600">{alert.status}</span>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => onSelectAlert && onSelectAlert(alert)}
                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Trend Compact Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded border border-slate-200 shadow-xs p-3 flex flex-col justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 mb-2 border-b border-slate-200">
              Risk Level Trend (24h)
            </h4>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskTrendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: '10px', padding: '4px 8px' }} />
                  <Bar dataKey="Low" fill="#10b981" stackId="a" />
                  <Bar dataKey="Med" fill="#f59e0b" stackId="a" />
                  <Bar dataKey="High" fill="#f97316" stackId="a" />
                  <Bar dataKey="Crit" fill="#ef4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Total Events: <strong className="text-slate-900 font-mono">68 Tracked</strong></span>
            <span className="text-red-700 font-bold">4 High/Critical Active</span>
          </div>
        </div>

      </div>

    </div>
  );
}

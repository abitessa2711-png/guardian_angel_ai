import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Users, 
  Frown, 
  Bell, 
  ShieldAlert, 
  Camera, 
  Maximize2, 
  Eye, 
  CheckCircle2,
  Clock,
  Shield,
  Radio
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const SIXTEEN_CCTV_FEEDS = [
  { id: '01', camId: 'CAM 01', name: '01 Central Bus Stand', location: 'Central Bus Stand', video: '/videos/bus_stand.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Activity', womenDetected: 'Yes' },
  { id: '02', camId: 'CAM 02', name: '02 Main Junction', location: 'Main Junction', video: '/videos/main_junction.mp4', risk: 'MEDIUM', threat: false, face: 'Neutral', behavior: 'Aggressive Approach', womenDetected: 'Yes' },
  { id: '03', camId: 'CAM 03', name: '03 Railway Station', location: 'Railway Station', video: '/videos/railway_station.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Transit', womenDetected: 'Yes' },
  { id: '04', camId: 'CAM 04', name: '04 Market Area', location: 'Market Area', video: '/videos/market.mp4', risk: 'HIGH', threat: true, face: 'Distress', behavior: 'Following', interaction: 'Suspicious', womenDetected: 'Yes', confidence: 91, duration: '00:01:24' },
  { id: '05', camId: 'CAM 05', name: '05 College Campus', location: 'College Campus', video: '/videos/college_campus.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Commute', womenDetected: 'Yes' },
  { id: '06', camId: 'CAM 06', name: '06 Public Street', location: 'Public Street', video: '/videos/public_street.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Following', womenDetected: 'Yes' },
  { id: '07', camId: 'CAM 07', name: '07 Bus Stop', location: 'Bus Stop', video: '/videos/bus_stop.mp4', risk: 'HIGH', threat: true, face: 'Fear', behavior: 'Stalking Detected', womenDetected: 'Yes' },
  { id: '08', camId: 'CAM 08', name: '08 Parking Area', location: 'Parking Area', video: '/videos/parking_area.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Loitering', womenDetected: 'No' },
  { id: '09', camId: 'CAM 09', name: '09 Shopping Area', location: 'Shopping Area', video: '/videos/crowd.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Commute', womenDetected: 'Yes' },
  { id: '10', camId: 'CAM 10', name: '10 Traffic Junction', location: 'Traffic Junction', video: '/videos/traffic.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Transit', womenDetected: 'No' },
  { id: '11', camId: 'CAM 11', name: '11 Railway Entrance', location: 'Railway Entrance', video: '/videos/threat.mp4', risk: 'MEDIUM', threat: false, face: 'Neutral', behavior: 'Suspicious Interaction', womenDetected: 'Yes' },
  { id: '12', camId: 'CAM 12', name: '12 Temple Road', location: 'Temple Road', video: '/videos/traffic.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Commute', womenDetected: 'Yes' },
  { id: '13', camId: 'CAM 13', name: '13 Bus Terminal', location: 'Bus Terminal', video: '/videos/bus_stand.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Activity', womenDetected: 'Yes' },
  { id: '14', camId: 'CAM 14', name: '14 Campus Gate', location: 'Campus Gate', video: '/videos/isolated.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Commute', womenDetected: 'Yes' },
  { id: '15', camId: 'CAM 15', name: '15 Main Road', location: 'Main Road', video: '/videos/main_junction.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Transit', womenDetected: 'No' },
  { id: '16', camId: 'CAM 16', name: '16 Public Parking', location: 'Public Parking', video: '/videos/parking_area.mp4', risk: 'LOW', threat: false, face: 'Normal', behavior: 'Normal Commute', womenDetected: 'No' },
];

export default function DashboardView({ 
  onSelectAlert, 
  onNavigateToTab, 
  onSelectCamera 
}) {
  const [selectedCam, setSelectedCam] = useState(SIXTEEN_CCTV_FEEDS[3]); // Default: 04 Market Area
  const [liveTimestamp, setLiveTimestamp] = useState('15:24:18');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTileSelect = (cam) => {
    setSelectedCam(cam);
    if (onSelectCamera) onSelectCamera(cam.camId);
  };

  // 24-Hour Risk Trend Data matching mockup
  const riskTrendData = [
    { time: '15:00', High: 15, Medium: 6, Low: 3 },
    { time: '17:00', High: 22, Medium: 12, Low: 6 },
    { time: '19:00', High: 19, Medium: 10, Low: 8 },
    { time: '21:00', High: 25, Medium: 14, Low: 7 },
    { time: '23:00', High: 33, Medium: 18, Low: 5 },
    { time: '01:00', High: 24, Medium: 13, Low: 4 },
    { time: '03:00', High: 26, Medium: 12, Low: 3 },
    { time: '05:00', High: 29, Medium: 16, Low: 6 },
    { time: '07:00', High: 31, Medium: 19, Low: 8 },
    { time: '09:00', High: 27, Medium: 16, Low: 5 },
    { time: '11:00', High: 33, Medium: 20, Low: 7 },
    { time: '13:00', High: 24, Medium: 14, Low: 6 },
    { time: '15:00', High: 30, Medium: 17, Low: 8 },
  ];

  // Recent Alerts matching mockup
  const recentAlerts = [
    { time: '15:24:18', camera: 'CAM 04', location: 'Market Area', event: 'Following + Distress', risk: 'HIGH', status: 'New', dotColor: 'bg-red-500' },
    { time: '15:19:47', camera: 'CAM 02', location: 'Main Junction', event: 'Aggressive Approach', risk: 'MEDIUM', status: 'In Progress', dotColor: 'bg-orange-500' },
    { time: '15:15:32', camera: 'CAM 07', location: 'Bus Stop', event: 'Stalking Detected', risk: 'HIGH', status: 'New', dotColor: 'bg-red-500' },
    { time: '15:10:05', camera: 'CAM 11', location: 'Railway Entrance', event: 'Suspicious Interaction', risk: 'MEDIUM', status: 'Reviewed', dotColor: 'bg-orange-500' },
    { time: '15:05:18', camera: 'CAM 06', location: 'Public Street', event: 'Following', risk: 'LOW', status: 'Closed', dotColor: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-3.5 select-none text-white font-sans">
      
      {/* 1. TOP 5 KPI STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Active Cameras */}
        <div className="bg-[#0f1d35] rounded-lg border border-[#1d355e] p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACTIVE CAMERAS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-white font-mono">16 / 16</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Online</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Women Detected */}
        <div className="bg-[#0f1d35] rounded-lg border border-[#1d355e] p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                WOMEN DETECTED
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-white font-mono">243</span>
              </div>
              <span className="text-[10px] text-purple-400 font-semibold mt-0.5 block">
                Live Count
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Potential Distress */}
        <div className="bg-[#0f1d35] rounded-lg border border-[#1d355e] p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Frown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                POTENTIAL DISTRESS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-amber-400 font-mono">17</span>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold mt-0.5 block">
                Live Count
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Alerts */}
        <div className="bg-[#0f1d35] rounded-lg border border-[#1d355e] p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                ACTIVE ALERTS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-red-400 font-mono">12</span>
              </div>
              <span className="text-[10px] text-red-300 font-semibold mt-0.5 block">
                Require Attention
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: High / Critical Risk */}
        <div className="bg-[#0f1d35] rounded-lg border border-[#1d355e] p-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                HIGH / CRITICAL RISK
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-rose-400 font-mono">04</span>
              </div>
              <span className="text-[10px] text-rose-300 font-semibold mt-0.5 block">
                High Priority
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE AREA: LIVE CCTV MONITOR WALL (LEFT ~68%) + SELECTED CAMERA & AI ANALYSIS (RIGHT ~32%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left: LIVE CCTV MONITOR WALL (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm flex flex-col justify-between">
          <div>
            {/* Monitor Wall Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1b2e4b]">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                  LIVE CCTV MONITOR WALL
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                <span className="bg-[#11223e] px-2 py-0.5 rounded border border-slate-700">
                  Grid: 4x4
                </span>
                <button 
                  onClick={() => onNavigateToTab && onNavigateToTab('live_monitoring')}
                  className="p-1 hover:text-white rounded bg-[#11223e] border border-slate-700 cursor-pointer"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 16 CCTV Video Tiles in 4x4 Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {SIXTEEN_CCTV_FEEDS.map((cam) => {
                const isSelected = selectedCam.id === cam.id;
                const isAlert = cam.threat;

                return (
                  <div
                    key={cam.id}
                    onClick={() => handleTileSelect(cam)}
                    className={`relative aspect-[16/10] bg-black rounded overflow-hidden cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-red-500 ring-2 ring-red-500 shadow-md' 
                        : isAlert 
                        ? 'border-red-600 ring-1 ring-red-600 animate-pulse' 
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {/* Live Playable CCTV Video */}
                    <video
                      src={cam.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover brightness-95 contrast-105"
                    />

                    {/* Overlaid AI Bounding Boxes (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Detected Person Boxes */}
                      <rect x="35" y="32" width="16" height="48" fill="none" stroke="#10b981" strokeWidth="0.8" rx="0.5" />
                      {cam.threat && (
                        <>
                          {/* Highlighted Woman in Red */}
                          <rect x="52" y="30" width="16" height="50" fill="none" stroke="#ef4444" strokeWidth="1.0" rx="0.5" />
                          {/* Trailing Person in Purple */}
                          <rect x="20" y="34" width="15" height="46" fill="none" stroke="#a855f7" strokeWidth="0.8" rx="0.5" />
                        </>
                      )}
                    </svg>

                    {/* Top Overlay: Camera Title + LIVE Badge */}
                    <div className="absolute top-1 left-1 right-1 flex items-center justify-between text-[8px] font-mono z-20 pointer-events-none">
                      <span className="bg-black/80 text-white font-bold px-1 py-0.2 rounded truncate max-w-[70%]">
                        {cam.name}
                      </span>
                      <span className="bg-emerald-600 text-white font-bold px-1 py-0.2 rounded flex items-center space-x-0.5">
                        <span className="w-1 h-1 rounded-full bg-white"></span>
                        <span>LIVE</span>
                      </span>
                    </div>

                    {/* Bottom Overlay: Timestamp + Threat Dots */}
                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[8px] font-mono z-20 pointer-events-none">
                      <span className="bg-black/80 text-slate-300 px-1 py-0.2 rounded">
                        {liveTimestamp}
                      </span>
                      {cam.threat && (
                        <div className="flex space-x-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: SELECTED CAMERA & LIVE AI ANALYSIS (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            {/* Selected Camera Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1b2e4b]">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-400 text-[10px] font-bold uppercase">SELECTED CAMERA</span>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.2 rounded uppercase ${
                selectedCam.threat ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-700 text-white'
              }`}>
                {selectedCam.threat ? 'HIGH RISK' : 'NORMAL'}
              </span>
            </div>

            {/* Sub-header: Camera Name & Time */}
            <div className="flex items-center justify-between py-1 text-xs font-mono">
              <span className="font-bold text-white text-[11px]">{selectedCam.name}</span>
              <span className="text-slate-400 text-[10px]">{liveTimestamp}</span>
            </div>

            {/* Selected Feed Large Video Player */}
            <div className="relative aspect-[16/10] bg-black rounded overflow-hidden border border-slate-700 my-1">
              <video
                key={selectedCam.video}
                src={selectedCam.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover brightness-95 contrast-105"
              />

              {/* Overlaid Large AI Bounding Boxes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="22" y="26" width="18" height="58" fill="none" stroke="#10b981" strokeWidth="0.8" rx="0.5" />
                <rect x="46" y="24" width="20" height="60" fill="none" stroke="#ef4444" strokeWidth="1.2" rx="0.5" />
                <rect x="70" y="28" width="18" height="54" fill="none" stroke="#3b82f6" strokeWidth="0.8" rx="0.5" />
              </svg>
            </div>

            {/* AI ANALYSIS Panel */}
            <div className="bg-[#0f1d35] rounded border border-[#1d355e] p-2.5 my-2 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-700 pb-1">
                AI ANALYSIS
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Women Detected</span>
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{selectedCam.womenDetected}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Face Expression</span>
                    <span className={`font-bold ${selectedCam.threat ? 'text-amber-400' : 'text-slate-200'}`}>
                      {selectedCam.face}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Behavior</span>
                    <span className={`font-bold ${selectedCam.threat ? 'text-orange-400' : 'text-slate-200'}`}>
                      {selectedCam.behavior}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Interaction</span>
                    <span className={`font-bold ${selectedCam.threat ? 'text-amber-400' : 'text-slate-200'}`}>
                      {selectedCam.interaction || 'Normal'}
                    </span>
                  </div>
                </div>

                {/* Risk Level Box on Right */}
                <div className="bg-[#091322] rounded p-2 border border-slate-800 flex flex-col justify-between text-right">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">RISK LEVEL</span>
                    <span className={`text-base font-black font-mono block ${
                      selectedCam.threat ? 'text-red-500 animate-pulse' : 'text-emerald-400'
                    }`}>
                      {selectedCam.threat ? 'HIGH' : 'LOW'}
                    </span>
                  </div>

                  {selectedCam.threat && (
                    <div className="mt-1">
                      <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                        <span>Confidence</span>
                        <span className="text-white font-bold">{selectedCam.confidence || 91}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${selectedCam.confidence || 91}%` }}></div>
                      </div>
                      <div className="text-[9px] text-red-400 font-mono mt-0.5">
                        Duration: {selectedCam.duration || '00:01:24'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CAMERA DETAILS Metadata List */}
            <div className="space-y-1 text-[11px] bg-[#0d182d] p-2 rounded border border-[#1b2e4b]">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                CAMERA DETAILS
              </span>
              <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                <div className="flex justify-between pr-2">
                  <span className="text-slate-400">Camera ID</span>
                  <span className="text-slate-200 font-mono font-bold">{selectedCam.camId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="text-slate-200 font-medium truncate">{selectedCam.location}</span>
                </div>
                <div className="flex justify-between pr-2">
                  <span className="text-slate-400">Time</span>
                  <span className="text-slate-200 font-mono">{liveTimestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="text-slate-200 font-mono">15 May 2026</span>
                </div>
                <div className="flex justify-between pr-2">
                  <span className="text-slate-400">Resolution</span>
                  <span className="text-slate-200 font-mono">1920 x 1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Online</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Drilldown button */}
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('live_monitoring')}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open in Full Live Monitor</span>
          </button>
        </div>

      </div>

      {/* 3. BOTTOM ROW: RECENT ALERTS & INCIDENTS (LEFT ~60%) + RISK TREND (RIGHT ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left: RECENT ALERTS & INCIDENTS (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2e4b]">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                RECENT ALERTS & INCIDENTS
              </h4>
            </div>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('alerts')}
              className="text-[10px] bg-[#11223e] hover:bg-[#1a325b] text-blue-300 font-semibold px-2 py-0.5 rounded border border-slate-700 transition-colors cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#0f1d35] text-slate-400 font-bold border-b border-[#1b2e4b] text-[10px] uppercase">
                  <th className="py-1.5 px-2">Time</th>
                  <th className="py-1.5 px-2">Camera</th>
                  <th className="py-1.5 px-2">Location</th>
                  <th className="py-1.5 px-2">Event</th>
                  <th className="py-1.5 px-2">Risk</th>
                  <th className="py-1.5 px-2">Status</th>
                  <th className="py-1.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#162744] text-slate-300">
                {recentAlerts.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-[#11223e] transition-colors">
                    <td className="py-2 px-2 font-mono text-slate-300 flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${alert.dotColor}`}></span>
                      <span>{alert.time}</span>
                    </td>
                    <td className="py-2 px-2 font-mono font-bold text-blue-300">{alert.camera}</td>
                    <td className="py-2 px-2 text-slate-200">{alert.location}</td>
                    <td className="py-2 px-2 text-white font-semibold">{alert.event}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                        alert.risk === 'HIGH' ? 'bg-red-950 text-red-400 border border-red-800' :
                        alert.risk === 'MEDIUM' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                        'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {alert.risk}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-300 font-medium">{alert.status}</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => onSelectAlert && onSelectAlert(alert)}
                        className="p-1 hover:text-white text-slate-400 rounded hover:bg-[#1a325b] cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: RISK TREND (LAST 24 HOURS) (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b2e4b]">
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                RISK TREND (LAST 24 HOURS)
              </h4>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f1d35', borderColor: '#1d355e', borderRadius: '4px', fontSize: '10px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} iconType="circle" />
                  <Line type="monotone" dataKey="High" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} name="High" />
                  <Line type="monotone" dataKey="Medium" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="Medium" />
                  <Line type="monotone" dataKey="Low" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1b2e4b] text-[10px] text-slate-400 flex justify-between font-mono">
            <span>Peak Incident Window: <strong>23:00 – 01:00</strong></span>
            <span className="text-red-400 font-bold">12 Active Alerts</span>
          </div>
        </div>

      </div>

      {/* 4. FOOTER */}
      <footer className="pt-2 pb-1 border-t border-[#1b2e4b] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <div>
          Guardian Angel AI © 2026 | Intelligent Women Safety Surveillance System
        </div>
        <div className="flex items-center space-x-1.5 mt-1 sm:mt-0">
          <span>Designed for Safer Cities. Powered by AI.</span>
          <Shield className="w-3.5 h-3.5 text-blue-400 inline" />
        </div>
      </footer>

    </div>
  );
}

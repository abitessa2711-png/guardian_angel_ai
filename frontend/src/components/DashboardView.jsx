import React, { useState, useEffect, useRef } from 'react';
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
import { API_BASE_URL } from '../context/AuthContext';

export const SIXTEEN_CCTV_FEEDS = [
  { id: 1, camId: 'CAM 01', name: '01 Central Bus Stand', location: 'Bus Terminal Platform 3', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/bus_stand.mp4', face: 'Normal', behavior: 'Waiting / Commuting', duration: '00:04:12', confidence: 94 },
  { id: 2, camId: 'CAM 02', name: '02 Main Junction', location: 'Signal Crossing East', womenDetected: 'Yes', threat: true, risk: 'MEDIUM', video: '/videos/main_junction.mp4', face: 'Alert', behavior: 'Rapid Approach Vector', interaction: 'Rapid Closing Distance', duration: '00:01:45', confidence: 86 },
  { id: 3, camId: 'CAM 03', name: '03 Railway Station', location: 'Platform 1 Waiting Bay', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/railway_station.mp4', face: 'Neutral', behavior: 'Normal Transit', duration: '00:08:20', confidence: 97 },
  { id: 4, camId: 'CAM 04', name: '04 Market Area', location: 'Commercial Bazaar South', womenDetected: 'Yes', threat: true, risk: 'HIGH', video: '/videos/market.mp4', face: 'Distress / Fear', behavior: 'Persistent Stalking Vector', interaction: 'Trailing Distance < 2m', duration: '00:02:18', confidence: 91 },
  { id: 5, camId: 'CAM 05', name: '05 College Campus', location: 'North Walkway Gate 2', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/college_campus.mp4', face: 'Happy', behavior: 'Student Transit', duration: '00:05:30', confidence: 98 },
  { id: 6, camId: 'CAM 06', name: '06 Public Street', location: 'Sub-Lane 4 Residential', womenDetected: 'No', threat: false, risk: 'LOW', video: '/videos/public_street.mp4', face: 'Neutral', behavior: 'Pedestrian Flow', duration: '00:03:10', confidence: 95 },
  { id: 7, camId: 'CAM 07', name: '07 Bus Stop', location: 'Kamaraj Nagar Shelter', womenDetected: 'Yes', threat: true, risk: 'HIGH', video: '/videos/bus_stop.mp4', face: 'Distress', behavior: 'Loitering & Cornering', interaction: 'Hovering Trajectory', duration: '00:03:02', confidence: 89 },
  { id: 8, camId: 'CAM 08', name: '08 Hospital Zone', location: 'Emergency Bay Entrance', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/traffic.mp4', face: 'Tense', behavior: 'Medical Transit', duration: '00:06:14', confidence: 92 },
  { id: 9, camId: 'CAM 09', name: '09 Shopping Mall', location: 'Main Plaza Promenade', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/crowd.mp4', face: 'Happy', behavior: 'Public Shopping', duration: '00:07:45', confidence: 96 },
  { id: 10, camId: 'CAM 10', name: '10 Metro Station', location: 'Concourse Ticket Gate', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/parking_area.mp4', face: 'Neutral', behavior: 'Passenger Entry', duration: '00:04:40', confidence: 97 },
  { id: 11, camId: 'CAM 11', name: '11 Auto Stand', location: 'Railway Feeder Stand', womenDetected: 'Yes', threat: true, risk: 'MEDIUM', video: '/videos/isolated.mp4', face: 'Alert', behavior: 'Unusual Encircling', interaction: 'Repeated Pass-by', duration: '00:01:50', confidence: 84 },
  { id: 12, camId: 'CAM 12', name: '12 IT Park Road', location: 'Tech Zone Boulevard', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/public_street.mp4', face: 'Neutral', behavior: 'Corporate Transit', duration: '00:09:12', confidence: 98 },
  { id: 13, camId: 'CAM 13', name: '13 Sub-way Tunnel', location: 'Underpass Walkway North', womenDetected: 'Yes', threat: true, risk: 'CRITICAL', video: '/videos/threat.mp4', face: 'Panic / Fear', behavior: 'Aggressive Cornering', interaction: 'Perimeter Intrusion', duration: '00:00:58', confidence: 93 },
  { id: 14, camId: 'CAM 14', name: '14 Park Perimeter', location: 'Gandhi Park Jogging Bay', womenDetected: 'No', threat: false, risk: 'LOW', video: '/videos/parking_area.mp4', face: 'Neutral', behavior: 'Jogger Movement', duration: '00:04:15', confidence: 95 },
  { id: 15, camId: 'CAM 15', name: '15 School Zone', location: 'Main School Crosswalk', womenDetected: 'Yes', threat: false, risk: 'LOW', video: '/videos/college_campus.mp4', face: 'Neutral', behavior: 'Pedestrian Crossing', duration: '00:05:00', confidence: 99 },
  { id: 16, camId: 'CAM 16', name: '16 Bridge Underpass', location: 'Flyover Pillar 12 Dark Zone', womenDetected: 'Yes', threat: true, risk: 'HIGH', video: '/videos/isolated.mp4', face: 'Distress', behavior: 'Following in Isolated Zone', interaction: 'Persistent Shadowing', duration: '00:02:40', confidence: 90 },
];

export default function DashboardView({ 
  onSelectAlert, 
  onNavigateToTab, 
  onSelectCamera,
  onCaptureSnapshot 
}) {
  const [selectedCam, setSelectedCam] = useState(SIXTEEN_CCTV_FEEDS[3]); // Default: 04 Market Area
  const [liveTimestamp, setLiveTimestamp] = useState('15:24:18');
  const [dashInference, setDashInference] = useState(null);

  const dashVideoRef = useRef(null);
  const dashCanvasRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-Time Computer Vision Inference Loop for Selected Camera
  useEffect(() => {
    let isSubscribed = true;
    let isBusy = false;

    const runDashInference = async () => {
      if (isBusy || !dashVideoRef.current || !dashCanvasRef.current) return;
      const video = dashVideoRef.current;
      if (video.readyState < 2 || video.videoWidth === 0) return;

      isBusy = true;
      try {
        const canvas = dashCanvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 480;
        canvas.height = 270;
        ctx.drawImage(video, 0, 0, 480, 270);
        const base64Data = canvas.toDataURL('image/jpeg', 0.65);

        const res = await fetch(`${API_BASE_URL}/ai/infer-cctv`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            camera_id: selectedCam.camId,
            location: selectedCam.location
          })
        });

        if (res.ok && isSubscribed) {
          const data = await res.json();
          setDashInference(data);
        }
      } catch (err) {
        console.error('Dashboard inference error:', err);
      } finally {
        isBusy = false;
      }
    };

    const interval = setInterval(runDashInference, 450);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [selectedCam]);

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
    { time: '03:00', High: 14, Medium: 8, Low: 2 },
    { time: '05:00', High: 8, Medium: 5, Low: 4 },
    { time: '07:00', High: 12, Medium: 9, Low: 7 },
    { time: '09:00', High: 18, Medium: 11, Low: 9 },
    { time: '11:00', High: 16, Medium: 8, Low: 6 },
    { time: '13:00', High: 20, Medium: 10, Low: 5 },
    { time: '15:00', High: 27, Medium: 15, Low: 8 },
  ];

  // Recent Alert Items matching mockup
  const recentAlerts = [
    { time: '15:24:18', camera: 'CAM 04', location: 'Market Area', event: 'Persistent Stalking Vector', risk: 'HIGH', status: 'New', dotColor: 'bg-red-500' },
    { time: '15:19:47', camera: 'CAM 02', location: 'Main Junction', event: 'Aggressive Approach Vector', risk: 'MEDIUM', status: 'Under Review', dotColor: 'bg-orange-500' },
    { time: '15:15:32', camera: 'CAM 07', location: 'Bus Stop', event: 'Stalking Detected', risk: 'HIGH', status: 'New', dotColor: 'bg-red-500' },
    { time: '15:10:05', camera: 'CAM 11', location: 'Railway Entrance', event: 'Suspicious Interaction', risk: 'MEDIUM', status: 'Reviewed', dotColor: 'bg-orange-500' },
    { time: '15:05:18', camera: 'CAM 06', location: 'Public Street', event: 'Following', risk: 'LOW', status: 'Closed', dotColor: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-4 select-none text-slate-800 font-sans">
      <canvas ref={dashCanvasRef} className="hidden" />
      
      {/* 1. TOP 5 KPI STATS CARDS (Indian National Flag Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        {/* Card 1: Active Cameras (India Green) */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#046A38]/10 border border-[#046A38]/20 flex items-center justify-center text-[#046A38]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                ACTIVE CAMERAS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-slate-900 font-mono">16 / 16</span>
              </div>
              <span className="text-[10px] text-[#046A38] font-bold flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#046A38] animate-pulse"></span>
                <span>Operational Grid</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Women Tracked (Ashoka Navy) */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#000080]/10 border border-[#000080]/20 flex items-center justify-center text-[#000080]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                WOMEN MONITORED
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-[#000080] font-mono">243</span>
              </div>
              <span className="text-[10px] text-slate-600 font-medium mt-0.5 block">
                Live Sensor Count
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Potential Distress (National Saffron) */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#FF671F]/10 border border-[#FF671F]/20 flex items-center justify-center text-[#FF671F]">
              <Frown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                POTENTIAL DISTRESS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-[#E65100] font-mono">17</span>
              </div>
              <span className="text-[10px] text-[#E65100] font-bold mt-0.5 block">
                Affect Markers
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Alerts (Emergency Red) */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                ACTIVE ALERTS
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-red-600 font-mono">12</span>
              </div>
              <span className="text-[10px] text-red-700 font-bold mt-0.5 block">
                Immediate Action
              </span>
            </div>
          </div>
        </div>

        {/* Card 5: Critical Incidents */}
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                HIGH / CRITICAL
              </span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-xl font-black text-rose-600 font-mono">04</span>
              </div>
              <span className="text-[10px] text-rose-700 font-bold mt-0.5 block">
                Priority Dispatch
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE AREA: LIVE CCTV MONITOR WALL (8 cols) + SELECTED CAMERA & AI ANALYSIS (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: LIVE CCTV MONITOR WALL (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Monitor Wall Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-[#000080]" />
                <h3 className="font-bold text-[#000080] text-xs uppercase tracking-wider">
                  LIVE CCTV MONITOR WALL (16 NODES)
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                <button 
                  onClick={() => {
                    if (onSelectCamera) onSelectCamera('CAM-LIVE');
                    if (onNavigateToTab) onNavigateToTab('live_monitoring');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-[#FF671F] to-[#E65100] text-white rounded text-[10px] font-bold shadow-xs cursor-pointer hover:opacity-95"
                  title="Switch to Operator Live Webcam"
                >
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Connect Live Webcam</span>
                </button>
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                  Grid: 4x4
                </span>
                <button 
                  onClick={() => onNavigateToTab && onNavigateToTab('live_monitoring')}
                  className="p-1 hover:text-[#000080] rounded bg-slate-100 border border-slate-200 cursor-pointer"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 16 CCTV Video Tiles in 4x4 Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SIXTEEN_CCTV_FEEDS.map((cam) => {
                const isSelected = selectedCam.id === cam.id;
                const isAlert = cam.threat;

                return (
                  <div
                    key={cam.id}
                    onClick={() => handleTileSelect(cam)}
                    className={`relative aspect-[16/10] bg-black rounded overflow-hidden cursor-pointer transition-all border ${
                      isSelected 
                        ? 'border-[#000080] ring-2 ring-[#000080] shadow-md' 
                        : isAlert 
                        ? 'border-red-600 ring-1 ring-red-600' 
                        : 'border-slate-300 hover:border-slate-500'
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

                    {/* Real-time Threat Overlay if active */}
                    {cam.threat && (
                      <div className="absolute inset-0 pointer-events-none z-10 border border-red-500/80 rounded animate-pulse bg-red-950/20 flex items-start justify-end p-1">
                        <span className="text-[7px] bg-red-600 text-white font-mono px-1 rounded font-bold uppercase">
                          SUSPICIOUS ACTIVITY
                        </span>
                      </div>
                    )}

                    {/* Top Overlay: Camera Title + LIVE Badge */}
                    <div className="absolute top-1 left-1 right-1 flex items-center justify-between text-[8px] font-mono z-20 pointer-events-none">
                      <span className="bg-black/80 text-white font-bold px-1 py-0.2 rounded truncate max-w-[70%]">
                        {cam.name}
                      </span>
                      <span className="bg-[#046A38] text-white font-bold px-1 py-0.2 rounded flex items-center space-x-0.5">
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
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF671F]"></span>
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
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            {/* Selected Camera Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 text-[10px] font-bold uppercase">SELECTED CAMERA NODE</span>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                dashInference 
                  ? (dashInference.risk_level === 'CRITICAL' || dashInference.risk_level === 'HIGH' ? 'bg-red-600 text-white animate-pulse' : dashInference.risk_level === 'MEDIUM' ? 'bg-[#FF671F] text-white' : 'bg-[#046A38] text-white')
                  : (selectedCam.threat ? 'bg-red-600 text-white animate-pulse' : 'bg-[#046A38] text-white')
              }`}>
                {dashInference ? `${dashInference.risk_level} RISK` : (selectedCam.threat ? 'HIGH RISK' : 'NORMAL')}
              </span>
            </div>

            {/* Sub-header: Camera Name & Time */}
            <div className="flex items-center justify-between py-1 text-xs font-mono">
              <span className="font-bold text-slate-900 text-[11px]">{selectedCam.name}</span>
              <span className="text-slate-500 text-[10px]">{liveTimestamp}</span>
            </div>

            {/* Selected Feed Large Video Player */}
            <div className="relative aspect-[16/10] bg-black rounded overflow-hidden border border-slate-300 my-1">
              <video
                ref={dashVideoRef}
                key={selectedCam.video}
                src={selectedCam.video}
                autoPlay
                loop
                muted
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-cover brightness-95 contrast-105"
              />

              {/* Overlaid Real AI Bounding Boxes (OpenCV Inference) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {dashInference && dashInference.boxes && dashInference.boxes.length > 0 ? (
                  dashInference.boxes.map((item, idx) => {
                    const isThreat = item.is_threat;
                    const isTarget = item.is_target;
                    const boxColor = isThreat ? '#ef4444' : isTarget ? '#10b981' : '#38bdf8';
                    const b = item.box;

                    return (
                      <g key={item.track_id || idx}>
                        <rect
                          x={b.x}
                          y={b.y}
                          width={b.width}
                          height={b.height}
                          fill="none"
                          stroke={boxColor}
                          strokeWidth="1.0"
                          rx="0.5"
                          className={isThreat ? 'animate-pulse' : ''}
                        />
                        <rect
                          x={Math.max(1, b.x - 1)}
                          y={Math.max(1, b.y - 5.5)}
                          width={Math.max(b.width + 3, 34)}
                          height="5.2"
                          fill={boxColor}
                          rx="0.4"
                        />
                        <text
                          x={b.x + (b.width / 2)}
                          y={Math.max(4.6, b.y - 1.8)}
                          fill="#ffffff"
                          fontSize="2.4"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })
                ) : (
                  <g>
                    <rect x="25" y="40" width="50" height="20" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 2" rx="1" />
                    <text x="50" y="52" fill="#38bdf8" fontSize="2.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      [ SENSOR ACTIVE: PERIMETER SCAN ]
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* AI ANALYSIS Panel */}
            <div className="bg-slate-50 rounded border border-slate-200 p-2.5 my-2 space-y-1.5 text-xs text-slate-800">
              <span className="text-[10px] font-bold text-[#000080] uppercase tracking-wider block border-b border-slate-200 pb-1">
                AI SENSOR ANALYSIS
              </span>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject Count</span>
                    <span className="text-[#046A38] font-bold flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#046A38]"></span>
                      <span>{dashInference ? (dashInference.detected_persons_count > 0 ? `${dashInference.detected_persons_count} Tracked` : 'No Pedestrians') : selectedCam.womenDetected}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Face Expression</span>
                    <span className={`font-bold ${(dashInference ? dashInference.facial_distress_detected : selectedCam.threat) ? 'text-[#E65100]' : 'text-slate-800'}`}>
                      {dashInference ? (dashInference.facial_distress_detected ? 'Distress Signal' : 'Normal / Calm') : selectedCam.face}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Behavior</span>
                    <span className={`font-bold ${(dashInference ? dashInference.risk_level === 'CRITICAL' || dashInference.risk_level === 'HIGH' : selectedCam.threat) ? 'text-red-600' : 'text-slate-800'}`}>
                      {dashInference ? dashInference.primary_behavior : selectedCam.behavior}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Distress Role</span>
                    <span className="text-slate-700 font-bold">
                      {dashInference ? dashInference.facial_distress_role : 'Supporting Signal'}
                    </span>
                  </div>
                </div>

                {/* Risk Level Box on Right */}
                <div className="bg-white rounded p-2 border border-slate-200 flex flex-col justify-between text-right">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold block">RISK LEVEL</span>
                    <span className={`text-base font-black font-mono block ${
                      (dashInference ? dashInference.risk_level === 'CRITICAL' || dashInference.risk_level === 'HIGH' : selectedCam.threat) ? 'text-red-600 animate-pulse' : 'text-[#046A38]'
                    }`}>
                      {dashInference ? dashInference.risk_level : (selectedCam.threat ? 'HIGH' : 'LOW')}
                    </span>
                  </div>

                  {selectedCam.threat && (
                    <div className="mt-1">
                      <div className="flex justify-between text-[9px] text-slate-500 mb-0.5">
                        <span>Confidence</span>
                        <span className="text-slate-900 font-bold">{selectedCam.confidence || 91}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: `${selectedCam.confidence || 91}%` }}></div>
                      </div>
                      <div className="text-[9px] text-red-600 font-mono mt-0.5">
                        Duration: {selectedCam.duration || '00:01:24'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CAMERA DETAILS Metadata List */}
            <div className="space-y-1 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                CAMERA DETAILS
              </span>
              <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                <div className="flex justify-between pr-2">
                  <span className="text-slate-500">Camera ID</span>
                  <span className="text-slate-800 font-mono font-bold">{selectedCam.camId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-800 font-medium truncate">{selectedCam.location}</span>
                </div>
                <div className="flex justify-between pr-2">
                  <span className="text-slate-500">Time</span>
                  <span className="text-slate-800 font-mono">{liveTimestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="text-slate-800 font-mono">22 Sep 2026</span>
                </div>
                <div className="flex justify-between pr-2">
                  <span className="text-slate-500">Resolution</span>
                  <span className="text-slate-800 font-mono">1920 x 1080</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="text-[#046A38] font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#046A38]"></span>
                    <span>Online</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Drilldown button */}
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('live_monitoring')}
            className="w-full py-2 bg-[#000080] hover:bg-[#000066] text-white font-bold rounded text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open in Full Live Monitor View</span>
          </button>
        </div>

      </div>

      {/* 3. BOTTOM ROW: RECENT ALERTS & INCIDENTS (7 cols) + RISK TREND (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: RECENT ALERTS & INCIDENTS (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-[#000080] text-xs uppercase tracking-wider">
                RECENT ALERTS & INCIDENTS
              </h4>
            </div>
            <button 
              onClick={() => onNavigateToTab && onNavigateToTab('alerts')}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-[#000080] font-bold px-2.5 py-1 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              View All Alerts
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Camera</th>
                  <th className="py-2 px-2">Location</th>
                  <th className="py-2 px-2">Event</th>
                  <th className="py-2 px-2">Risk</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentAlerts.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-2 font-mono text-slate-600 flex items-center space-x-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${alert.dotColor}`}></span>
                      <span>{alert.time}</span>
                    </td>
                    <td className="py-2 px-2 font-mono font-bold text-[#000080]">{alert.camera}</td>
                    <td className="py-2 px-2 text-slate-600">{alert.location}</td>
                    <td className="py-2 px-2 text-slate-900 font-semibold">{alert.event}</td>
                    <td className="py-2 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                        alert.risk === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-200' :
                        alert.risk === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-emerald-100 text-[#046A38] border border-emerald-200'
                      }`}>
                        {alert.risk}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-600 font-medium">{alert.status}</td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => onSelectAlert && onSelectAlert(alert)}
                        className="p-1 hover:text-[#000080] text-slate-500 rounded hover:bg-slate-100 cursor-pointer"
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
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <h4 className="font-bold text-[#000080] text-xs uppercase tracking-wider">
                RISK TREND (LAST 24 HOURS)
              </h4>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '6px', fontSize: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '4px' }} iconType="circle" />
                  <Line type="monotone" dataKey="High" stroke="#dc2626" strokeWidth={2} dot={{ r: 2 }} name="High (Alert)" />
                  <Line type="monotone" dataKey="Medium" stroke="#ff671f" strokeWidth={2} dot={{ r: 2 }} name="Medium (Caution)" />
                  <Line type="monotone" dataKey="Low" stroke="#046a38" strokeWidth={2} dot={{ r: 2 }} name="Low (Safe)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between font-mono">
            <span>Peak Incident Window: <strong className="text-slate-800">23:00 – 01:00</strong></span>
            <span className="text-red-600 font-bold">12 Active Alerts</span>
          </div>
        </div>

      </div>

      {/* 4. FOOTER */}
      <footer className="pt-2 pb-1 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <div>
          Guardian Angel AI © 2026 • Government of India & Tamil Nadu Police Command Center
        </div>
        <div className="flex items-center space-x-1.5 mt-1 sm:mt-0">
          <span>Official Women Safety Grid Portal</span>
          <Shield className="w-3.5 h-3.5 text-[#000080] inline" />
        </div>
      </footer>

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Camera, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  ChevronDown,
  Clock,
  Activity,
  AlertTriangle,
  UserCheck,
  Eye,
  Info
} from 'lucide-react';
import { ALL_16_CAMERAS } from './DashboardView';

export default function LiveMonitoringView({ onCaptureSnapshot, onDispatchAlert }) {
  const [selectedCamId, setSelectedCamId] = useState('CAM 01');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [liveClock, setLiveClock] = useState('');
  const [snapshotToast, setSnapshotToast] = useState(null);

  const currentCam = ALL_16_CAMERAS.find(c => c.id === selectedCamId) || ALL_16_CAMERAS[0];

  useEffect(() => {
    const update = () => {
      setLiveClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSnapshot = () => {
    setSnapshotToast(`Snapshot captured from ${currentCam.name} (SHA-256 sealed)`);
    setTimeout(() => setSnapshotToast(null), 3000);
    if (onCaptureSnapshot) onCaptureSnapshot(currentCam);
  };

  // Detailed telemetry for selected camera
  const cameraTimeline = [
    { time: '11:24:10', event: 'Following & Trailing Vector locked on Woman #4412 (0.8m proximity)', risk: 'Critical' },
    { time: '11:22:05', event: 'Facial Distress Indicator flagged (Fear confidence: 92%)', risk: 'High' },
    { time: '11:20:31', event: 'Suspect #8821 matched walking speed across 3 checkpoints', risk: 'Medium' },
    { time: '11:15:00', event: 'Camera auto-calibrated for night illumination mode', risk: 'Normal' },
  ];

  return (
    <div className="space-y-3 select-none">
      
      {/* Top Header Selector */}
      <div className="bg-white rounded border border-slate-200 p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Live Single-Camera Focused Inspection & Forensic Analysis
          </h3>
        </div>

        {/* Camera Selector Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-500">Select Feed:</span>
          <select
            value={selectedCamId}
            onChange={(e) => setSelectedCamId(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
          >
            {ALL_16_CAMERAS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.threat ? `[${c.risk}]` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Snapshot Toast Feedback */}
      {snapshotToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Main Split Layout: Left Large Video (8 cols) & Right AI Telemetry Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left: Large Live CCTV Video Player (8 cols) */}
        <div className="lg:col-span-8 bg-black rounded border border-slate-300 overflow-hidden flex flex-col">
          
          {/* Video Header */}
          <div className="bg-[#0b1b30] text-white px-3 py-1.5 flex items-center justify-between text-xs border-b border-slate-800 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">{currentCam.name}</span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
              currentCam.risk === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
              currentCam.risk === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-emerald-700 text-white'
            }`}>
              RISK: {currentCam.risk}
            </span>
          </div>

          {/* High-Definition Live Video Frame */}
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            <video
              key={currentCam.video}
              src={currentCam.video}
              autoPlay
              loop
              muted={isAudioMuted}
              playsInline
              className="w-full h-full object-cover brightness-95 contrast-105"
            />

            {/* Overlaid Computer Vision Bounding Boxes (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Woman Bounding Box */}
              <rect x="25" y="30" width="14" height="40" fill="none" stroke="#10b981" strokeWidth="0.6" rx="0.5" />
              <rect x="25" y="25.5" width="20" height="4" fill="#10b981" rx="0.3" />
              <text x="35" y="28.5" fill="#ffffff" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                {currentCam.person}
              </text>

              {/* Face Emotion Bounding Box */}
              <rect x="29" y="32" width="6" height="7" fill="none" stroke="#ef4444" strokeWidth="0.5" rx="0.3" />
              <rect x="18" y="20.5" width="34" height="4" fill={currentCam.threat ? '#ef4444' : '#10b981'} rx="0.3" />
              <text x="35" y="23.5" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                FACE: {currentCam.face}
              </text>

              {/* Suspect Box & Proximity Line if Threat */}
              {currentCam.threat && (
                <>
                  <rect x="8" y="32" width="14" height="42" fill="none" stroke="#f97316" strokeWidth="0.6" strokeDasharray="1.5, 0.5" rx="0.5" />
                  <line x1="22" y1="52" x2="25" y2="52" stroke="#ef4444" strokeWidth="0.7" strokeDasharray="1, 0.5" />
                  <rect x="6" y="74" width="38" height="4.5" fill="#991b1b" rx="0.3" />
                  <text x="25" y="77.2" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    {currentCam.behavior}
                  </text>
                </>
              )}
            </svg>

            {/* Top-Left: LIVE Badge & Time */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                ● LIVE
              </span>
              <span className="bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                {liveClock}
              </span>
            </div>

            {/* Top-Right: Stream Telemetry */}
            <div className="absolute top-2 right-2 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-1 rounded z-20 text-right space-y-0.5">
              <div>30 FPS | H.265 HIGH</div>
              <div className="text-emerald-400 font-bold">LATENCY: 18ms</div>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="bg-[#0b1b30] px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSnapshot}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold cursor-pointer flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Evidence Frame</span>
              </button>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title={isAudioMuted ? 'Unmute Acoustic Sensor' : 'Mute Sensor'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Sensor Node: <strong className="text-slate-200">{currentCam.id}</strong>
            </div>
          </div>

        </div>

        {/* Right: AI Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Real-Time AI Telemetry
              </h4>
              <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                Edge v3.2
              </span>
            </div>

            {/* Diagnostic Fields */}
            <div className="space-y-2 mt-2.5 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex justify-between items-center">
                <span className="text-slate-600 font-medium">People / Women Detected:</span>
                <span className="font-bold font-mono text-slate-900">8 People / 3 Women</span>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Facial Expression Affect</span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="font-bold text-slate-900">{currentCam.face}</span>
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded">
                    Potential Distress Indicator
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Behavioral Movement</span>
                <span className="font-bold text-red-700 block mt-0.5">{currentCam.behavior}</span>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Interaction Vector</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {currentCam.threat ? 'CLOSE FOLLOWING / SUSPICIOUS TRAILING' : 'NORMAL COMMUTE'}
                </span>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Multi-Factor Risk Score</span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className={`font-bold uppercase ${currentCam.threat ? 'text-red-700' : 'text-emerald-700'}`}>
                    {currentCam.risk} RISK
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentCam.threat ? '94 / 100' : '18 / 100'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onDispatchAlert && onDispatchAlert({ id: currentCam.id, title: currentCam.behavior, location: currentCam.location, risk: currentCam.risk })}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Incident Response Patrol</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom: Event Timeline for Selected Camera */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 mb-2 border-b border-slate-200">
          Sensor Event Audit Timeline ({currentCam.id})
        </h4>

        <div className="divide-y divide-slate-100 text-xs">
          {cameraTimeline.map((item, idx) => (
            <div key={idx} className="py-1.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] font-bold text-slate-500">{item.time}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                  item.risk === 'Critical' ? 'bg-red-100 text-red-800' :
                  item.risk === 'High' ? 'bg-orange-100 text-orange-800' :
                  item.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.risk}
                </span>
                <span className="text-slate-800 font-medium">{item.event}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Logged to Audit Trail</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

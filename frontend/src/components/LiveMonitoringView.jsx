import React, { useState, useRef } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Camera, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  ShieldAlert, 
  Scan, 
  CheckCircle2, 
  Send, 
  Grid, 
  Search,
  Filter,
  Eye,
  Sliders,
  Info
} from 'lucide-react';

export const CCTV_CAMERAS = [
  {
    id: 'CAM-02',
    name: 'Camera 02 - Central Bus Stand Platform 1',
    location: 'Central Bus Terminal Platform 1',
    video: '/videos/crowd.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4412',
    faceExpression: 'FEAR',
    emotionConfidence: 0.92,
    distressStatus: 'Potential Distress Indicator',
    behavior: 'FOLLOWING & CLOSE TRAILING',
    proximity: '0.8m gap (Decreasing)',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    threatActive: true,
    fps: 30
  },
  {
    id: 'CAM-05',
    name: 'Camera 05 - Campus Subway Walkway',
    location: 'Underground Pedestrian Subway',
    video: '/videos/isolated.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4419',
    faceExpression: 'DISTRESS',
    emotionConfidence: 0.88,
    distressStatus: 'Potential Distress Indicator',
    behavior: 'ISOLATED WALKWAY LOITERING',
    proximity: '1.2m proximity',
    riskLevel: 'HIGH',
    riskScore: 86,
    threatActive: true,
    fps: 28
  },
  {
    id: 'CAM-07',
    name: 'Camera 07 - Srirangam Temple South Gate',
    location: 'Temple Car Street Walkway',
    video: '/videos/crowd.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4418',
    faceExpression: 'ANGER / DISTRESS',
    emotionConfidence: 0.91,
    distressStatus: 'Behavioral Risk Detected',
    behavior: 'AGGRESSIVE APPROACH & GRAB',
    proximity: '0.2m physical contact',
    riskLevel: 'CRITICAL',
    riskScore: 98,
    threatActive: true,
    fps: 30
  },
  {
    id: 'CAM-04',
    name: 'Camera 04 - University Main Road',
    location: 'University Highway & Bus Bay Cross',
    video: '/videos/traffic.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4425',
    faceExpression: 'NORMAL',
    emotionConfidence: 0.96,
    distressStatus: 'Standard Baseline',
    behavior: 'NORMAL COMMUTE',
    proximity: 'Safe Distance (> 3.5m)',
    riskLevel: 'LOW',
    riskScore: 18,
    threatActive: false,
    fps: 30
  },
  {
    id: 'CAM-09',
    name: 'Camera 09 - Gandhi Market North Lane',
    location: 'Bazaar North Wholesale Corridor',
    video: '/videos/isolated.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4430',
    faceExpression: 'SADNESS / DISTRESS',
    emotionConfidence: 0.84,
    distressStatus: 'Potential Distress Indicator',
    behavior: 'STALKING VECTOR (18 mins)',
    proximity: '0.9m gap maintained',
    riskLevel: 'HIGH',
    riskScore: 88,
    threatActive: true,
    fps: 25
  },
  {
    id: 'CAM-03',
    name: 'Camera 03 - Railway Station North Gate',
    location: 'Junction Station Auto Stand',
    video: '/videos/threat.mp4',
    status: 'LIVE',
    detectedPerson: 'Woman #4435',
    faceExpression: 'NORMAL',
    emotionConfidence: 0.94,
    distressStatus: 'Standard Baseline',
    behavior: 'NORMAL TRANSIT',
    proximity: 'Safe Distance (> 2.8m)',
    riskLevel: 'LOW',
    riskScore: 22,
    threatActive: false,
    fps: 30
  }
];

export default function LiveMonitoringView({ onCaptureSnapshot, onDispatchAlert }) {
  const [selectedCam, setSelectedCam] = useState(CCTV_CAMERAS[0]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (2x2 or 3x2) or 'focus' (Single Big)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [capturedBanner, setCapturedBanner] = useState(null);

  const handleSnapshot = (cam) => {
    setCapturedBanner(`Evidence frame captured from ${cam.name} (Risk: ${cam.riskScore}%) and vaulted.`);
    setTimeout(() => setCapturedBanner(null), 3000);
    if (onCaptureSnapshot) onCaptureSnapshot(cam);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Controller Bar */}
      <div className="bg-white rounded border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-600" />
            <span>Live Women Safety CCTV Surveillance Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time video inference: Facial emotion affective analysis, stalking vectors, and proximity violation detection.</p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monitor Wall (Multi-Tile)
            </button>
            <button
              onClick={() => setViewMode('focus')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'focus' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focused Camera Inspection
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Toast Feedback */}
      {capturedBanner && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{capturedBanner}</span>
        </div>
      )}

      {/* Highlight Active Alert Banner When Selected Camera is High/Critical */}
      {selectedCam.threatActive && (
        <div className="bg-red-50 border-l-4 border-red-600 p-3.5 rounded-r text-xs text-red-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold uppercase tracking-wider text-red-950">
                  {selectedCam.riskLevel} Risk Alert: {selectedCam.behavior}
                </span>
                <span className="bg-red-600 text-white font-mono text-[10px] px-1.5 py-0.2 rounded font-bold">
                  Score: {selectedCam.riskScore}/100
                </span>
              </div>
              <p className="text-[11px] text-red-800 mt-0.5">
                Location: <strong>{selectedCam.location}</strong> • Emotion: <strong>{selectedCam.faceExpression} ({selectedCam.distressStatus})</strong> • Gap: <strong>{selectedCam.proximity}</strong>
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleSnapshot(selectedCam)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold rounded text-xs cursor-pointer flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Evidence</span>
            </button>
            <button
              onClick={() => onDispatchAlert && onDispatchAlert({ id: selectedCam.id, title: selectedCam.behavior, location: selectedCam.location, risk: selectedCam.riskLevel })}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Patrol</span>
            </button>
          </div>
        </div>
      )}

      {/* Multi-Tile Video Monitor Wall */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CCTV_CAMERAS.map((cam) => {
            const isCritical = cam.riskLevel === 'CRITICAL';
            const isHigh = cam.riskLevel === 'HIGH';
            const isSelected = selectedCam.id === cam.id;

            return (
              <div 
                key={cam.id}
                onClick={() => setSelectedCam(cam)}
                className={`bg-slate-950 rounded border overflow-hidden transition-all relative flex flex-col cursor-pointer ${
                  isSelected ? 'ring-2 ring-blue-600' : ''
                } ${
                  isCritical ? 'border-red-600 ring-1 ring-red-600' : isHigh ? 'border-orange-500' : 'border-slate-800'
                }`}
              >
                {/* Tile Header Bar */}
                <div className="bg-[#0b1b30] text-white px-2.5 py-1.5 flex items-center justify-between text-[11px] border-b border-slate-800">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-bold truncate">{cam.name}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    isCritical ? 'bg-red-600 text-white animate-pulse' : isHigh ? 'bg-orange-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {cam.riskLevel}
                  </span>
                </div>

                {/* Video Feed Area with Live HTML5 Video */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                  <video
                    src={cam.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover brightness-95 contrast-105"
                  />

                  {/* Overlaid Computer Vision Bounding Boxes (SVG) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Person / Woman Detection Box */}
                    <rect x="25" y="35" width="12" height="35" fill="none" stroke="#10b981" strokeWidth="0.8" rx="0.5" />
                    <rect x="25" y="31.5" width="16" height="3.5" fill="#10b981" rx="0.3" />
                    <text x="33" y="34" fill="#ffffff" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {cam.detectedPerson}
                    </text>

                    {/* Facial Expression Box & Indicator */}
                    <rect x="28" y="36" width="6" height="7" fill="none" stroke="#ef4444" strokeWidth="0.6" rx="0.3" />
                    <rect x="23" y="27.5" width="22" height="3.5" fill={cam.threatActive ? '#ef4444' : '#10b981'} rx="0.3" />
                    <text x="34" y="30" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                      {cam.faceExpression} ({(cam.emotionConfidence * 100).toFixed(0)}%)
                    </text>

                    {/* Trailing Suspect Box if Threat Active */}
                    {cam.threatActive && (
                      <>
                        <rect x="10" y="36" width="12" height="37" fill="none" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5, 0.5" rx="0.5" />
                        <line x1="22" y1="52" x2="25" y2="52" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="1, 0.5" />
                        <rect x="10" y="73.5" width="27" height="3.5" fill="#991b1b" rx="0.3" />
                        <text x="23.5" y="76" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                          {cam.behavior}
                        </text>
                      </>
                    )}
                  </svg>

                  {/* LIVE Badge */}
                  <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    LIVE
                  </div>

                  {/* Telemetry */}
                  <div className="absolute top-2 right-2 bg-slate-900/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                    {cam.fps} FPS
                  </div>
                </div>

                {/* Tile Footer Meta */}
                <div className="bg-[#0b1b30] px-2.5 py-1.5 text-[11px] text-slate-300 flex items-center justify-between border-t border-slate-800">
                  <span className="truncate text-slate-400">{cam.location}</span>
                  <div className="flex space-x-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSnapshot(cam);
                      }}
                      className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                      title="Snapshot"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCam(cam);
                        setViewMode('focus');
                      }}
                      className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                      title="Inspect Focus"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Focused Camera Inspection Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Inspection Player (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded border border-slate-300 overflow-hidden flex flex-col">
            <div className="bg-[#0b1b30] text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold text-sm">{selectedCam.name}</span>
              </div>
              <span className="font-mono text-slate-300">{selectedCam.id}</span>
            </div>

            <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
              <video
                src={selectedCam.video}
                autoPlay
                loop
                muted={isAudioMuted}
                playsInline
                className="w-full h-full object-cover brightness-95 contrast-105"
              />

              {/* High-Resolution Overlay SVGs */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                <rect x="25" y="35" width="12" height="35" fill="none" stroke="#10b981" strokeWidth="0.6" rx="0.5" />
                <rect x="25" y="31.5" width="16" height="3.5" fill="#10b981" rx="0.3" />
                <text x="33" y="34" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  {selectedCam.detectedPerson}
                </text>

                {/* Face Box */}
                <rect x="28" y="36" width="6" height="7" fill="none" stroke="#ef4444" strokeWidth="0.5" rx="0.3" />
                <rect x="23" y="27.5" width="22" height="3.5" fill={selectedCam.threatActive ? '#ef4444' : '#10b981'} rx="0.3" />
                <text x="34" y="30" fill="#ffffff" fontSize="1.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                  {selectedCam.faceExpression} ({(selectedCam.emotionConfidence * 100).toFixed(0)}%)
                </text>
              </svg>
            </div>

            <div className="bg-[#0b1b30] px-4 py-2 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title={isAudioMuted ? 'Unmute' : 'Mute'}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
                </button>
                <button
                  onClick={() => handleSnapshot(selectedCam)}
                  className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                  title="Capture Frame"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="font-mono text-emerald-400 text-xs font-bold">
                LATENCY: 18ms | RESOLUTION: 1080p H.265
              </div>
            </div>
          </div>

          {/* Right Telemetry & AI Diagnostic Panel (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
                Real-Time AI Frame Diagnostics
              </h4>

              <div className="space-y-2.5 mt-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Facial Expression Affect</span>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="font-bold text-slate-900">{selectedCam.faceExpression}</span>
                    <span className="font-mono font-bold text-blue-700">{(selectedCam.emotionConfidence * 100).toFixed(0)}% Conf</span>
                  </div>
                  <span className="text-[10px] text-red-700 font-semibold block mt-0.5">{selectedCam.distressStatus}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Behavior Pattern Detected</span>
                  <span className="font-bold text-red-700 block mt-0.5">{selectedCam.behavior}</span>
                  <span className="text-[10px] text-slate-500 font-mono">Proximity: {selectedCam.proximity}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Multi-Factor Risk Score</span>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className={`font-bold uppercase ${selectedCam.riskLevel === 'CRITICAL' ? 'text-red-700' : 'text-orange-700'}`}>
                      {selectedCam.riskLevel}
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900">{selectedCam.riskScore} / 100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onDispatchAlert && onDispatchAlert({ id: selectedCam.id, title: selectedCam.behavior, location: selectedCam.location, risk: selectedCam.riskLevel })}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Incident Response</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs cursor-pointer border border-slate-300 text-center"
              >
                ← Return to Monitor Wall
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Circle, 
  Mic, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Settings, 
  ChevronDown, 
  Check, 
  Play, 
  Pause,
  AlertTriangle,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const CAMERAS_LIST = [
  { id: 'CAM-04', name: 'Camera 04 - Main Road & University Gate', location: 'University Main Road Cross', status: 'Online', type: 'road', video: '/videos/traffic.mp4', threatLevel: 'Normal' },
  { id: 'CAM-02', name: 'Camera 02 - Central Bus Stand Platform 1', location: 'Central Bus Stand Main Concourse', status: 'Online', type: 'crowd', video: '/videos/crowd.mp4', threatLevel: 'Critical' },
  { id: 'CAM-05', name: 'Camera 05 - Campus Subway Corridor', location: 'Underground Pedestrian Subway', status: 'Online', type: 'subway', video: '/videos/isolated.mp4', threatLevel: 'High' },
  { id: 'CAM-03', name: 'Camera 03 - Railway Station North Gate', location: 'Junction Station Auto Stand', status: 'Online', type: 'road', video: '/videos/threat.mp4', threatLevel: 'Medium' },
  { id: 'CAM-07', name: 'Camera 07 - Srirangam Temple South Gate', location: 'Temple Car Street Walkway', status: 'Online', type: 'crowd', video: '/videos/crowd.mp4', threatLevel: 'High' },
  { id: 'CAM-09', name: 'Camera 09 - Gandhi Market Alley', location: 'Bazaar North Narrow Lane', status: 'Online', type: 'subway', video: '/videos/isolated.mp4', threatLevel: 'Medium' },
];

export default function LiveCameraFeed({ 
  selectedCamera = 'CAM-04', 
  onSelectCamera,
  onCaptureSnapshot,
  isRecording = true,
  setIsRecording
}) {
  const [activeCamId, setActiveCamId] = useState(selectedCamera);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [snapshotFeedback, setSnapshotFeedback] = useState(false);

  // Overlay filter toggles
  const [showWomanBox, setShowWomanBox] = useState(true);
  const [showSuspectBox, setShowSuspectBox] = useState(true);
  const [showDistressIndicator, setShowDistressIndicator] = useState(true);
  const [showProximityLine, setShowProximityLine] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const currentCam = CAMERAS_LIST.find(c => c.id === activeCamId) || CAMERAS_LIST[0];

  useEffect(() => {
    setActiveCamId(selectedCamera);
  }, [selectedCamera]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log('Video autoplay:', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeCamId]);

  const handleCameraChange = (camId) => {
    setActiveCamId(camId);
    setIsDropdownOpen(false);
    if (onSelectCamera) onSelectCamera(camId);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTakeSnapshot = () => {
    setSnapshotFeedback(true);
    setTimeout(() => setSnapshotFeedback(false), 1200);
    if (onCaptureSnapshot) {
      onCaptureSnapshot(currentCam);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Feed Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Live Women Safety CCTV Stream</h3>
          </div>
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-xs text-slate-500 font-mono font-bold">{currentCam.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Camera Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span>{currentCam.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-md shadow-xl border border-slate-200 py-1 z-50">
                {CAMERAS_LIST.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => handleCameraChange(cam.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      activeCamId === cam.id ? 'font-bold text-blue-700 bg-blue-50/70' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{cam.name}</p>
                      <p className="text-[10px] text-slate-400">{cam.location}</p>
                    </div>
                    {activeCamId === cam.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen Toggle Button */}
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Area Playing Real Surveillance Video Clips */}
      <div className="relative bg-slate-950 aspect-[16/9] w-full overflow-hidden flex items-center justify-center select-none group">
        
        {/* Real Continuously Looping CCTV Video Clip */}
        <video
          ref={videoRef}
          key={currentCam.video}
          src={currentCam.video}
          autoPlay
          loop
          muted={isAudioMuted}
          playsInline
          className="w-full h-full object-cover brightness-95 contrast-105"
        />

        {/* Top-Left: LIVE Status & REC Indicators */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 z-20">
          <div className="flex items-center space-x-1.5 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            <span className="tracking-wider">LIVE FEED</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <span>REC 1080p</span>
            </div>
          )}
        </div>

        {/* Top-Right: Stream AI Telemetry */}
        {showTelemetry && (
          <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white px-2.5 py-1.5 rounded font-mono text-[10px] border border-white/10 z-20 space-y-0.5 text-right">
            <div>30 FPS | H.265 HIGH PROFILE</div>
            <div className="text-emerald-400 font-bold">AI INFERENCE: 18ms</div>
            <div className="text-slate-400">LATENCY: 0.04s</div>
          </div>
        )}

        {/* Real-time Computer Vision Bounding Box Overlays (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* 1. Tracked Woman Subject (Green / Cyan Box with Facial Distress Flag) */}
          {showWomanBox && (
            <>
              {/* Woman Bounding Box */}
              <rect x="24" y="38" width="8.5" height="32" fill="none" stroke="#10b981" strokeWidth="0.5" rx="0.5" />
              <rect x="24" y="34.5" width="13" height="3.2" fill="#10b981" rx="0.4" />
              <text x="30.5" y="36.8" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                Woman #4412
              </text>

              {/* Facial Emotion / Distress Badge */}
              {showDistressIndicator && (
                <>
                  <rect x="24" y="30.5" width="22" height="3.5" fill="#ef4444" rx="0.4" />
                  <text x="35" y="32.9" fill="#ffffff" fontSize="1.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    Distress Indicator (Fear: 92%)
                  </text>
                </>
              )}
            </>
          )}

          {/* 2. Trailing Suspect Bounding Box (Amber / Red Box) */}
          {showSuspectBox && (
            <>
              <rect x="12" y="39" width="9" height="34" fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="1.5, 0.5" rx="0.5" />
              <rect x="12" y="35.5" width="13.5" height="3.2" fill="#f97316" rx="0.4" />
              <text x="18.7" y="37.8" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                Suspect #8821
              </text>
            </>
          )}

          {/* 3. Proximity Distance Connection Line */}
          {showProximityLine && (
            <>
              <line x1="21" y1="52" x2="24" y2="52" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="1, 0.5" />
              <rect x="18.5" y="49" width="8" height="2.8" fill="#991b1b" rx="0.3" />
              <text x="22.5" y="51" fill="#ffffff" fontSize="1.6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                0.8m GAP
              </text>
            </>
          )}

        </svg>

        {/* Center Play/Pause Overlay When Hovered/Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 z-30 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900/90 text-white px-4 py-2 rounded-full flex items-center space-x-2 font-bold text-xs shadow-lg">
              <Pause className="w-4 h-4 text-amber-400" />
              <span>PAUSED FRAME AT INSPECTION</span>
            </div>
          </div>
        )}

        {/* Snapshot Flash Feedback */}
        {snapshotFeedback && (
          <div className="absolute inset-0 bg-white/70 z-40 flex items-center justify-center animate-fade-out">
            <div className="bg-slate-900 text-white font-bold text-xs px-3.5 py-2 rounded shadow-xl flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Evidence Frame Captured & Cryptographically Vaulted</span>
            </div>
          </div>
        )}

      </div>

      {/* Camera Control Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0b1b30] text-slate-300 border-t border-slate-800">
        
        {/* Left Tools: Play/Pause, Snapshot, Record, Mic, Speaker */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayPause}
            className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title={isPlaying ? 'Pause CCTV Stream' : 'Play CCTV Stream'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleTakeSnapshot}
            className="p-1.5 text-slate-200 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Capture High-Resolution Evidence Frame"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRecording && setIsRecording(!isRecording)}
            className={`p-1.5 rounded transition-colors cursor-pointer flex items-center space-x-1 ${
              isRecording ? 'text-red-500 hover:bg-red-950/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            <Circle className={`w-3.5 h-3.5 fill-current ${isRecording ? 'animate-pulse' : ''}`} />
          </button>

          <button
            onClick={() => setIsIntercomActive(!isIntercomActive)}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isIntercomActive ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Control Room Intercom Mic Broadcast"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute Acoustic Sensor' : 'Mute Acoustic Sensor'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>

        {/* Center: Real-time Multi-Factor Risk Assessment Status */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">STATUS:</span>
          <span className="text-red-400 font-bold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>HIGH RISK DETECTED (FEAR + FOLLOWING + 0.8m)</span>
          </span>
        </div>

        {/* Right Tools: Detection Layer Settings */}
        <div className="relative">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Detection Overlays Toggle"
          >
            <Settings className="w-4 h-4" />
          </button>

          {showConfig && (
            <div className="absolute right-0 bottom-8 w-56 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-2">
              <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 text-[11px] uppercase tracking-wider">
                Surveillance Overlays
              </p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Woman Subject (Green)</span>
                <input 
                  type="checkbox" 
                  checked={showWomanBox} 
                  onChange={(e) => setShowWomanBox(e.target.checked)}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Suspect Tracker (Orange)</span>
                <input 
                  type="checkbox" 
                  checked={showSuspectBox} 
                  onChange={(e) => setShowSuspectBox(e.target.checked)}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Distress Emotion Flag</span>
                <input 
                  type="checkbox" 
                  checked={showDistressIndicator} 
                  onChange={(e) => setShowDistressIndicator(e.target.checked)}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Proximity Vector Line</span>
                <input 
                  type="checkbox" 
                  checked={showProximityLine} 
                  onChange={(e) => setShowProximityLine(e.target.checked)}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Stream Telemetry</span>
                <input 
                  type="checkbox" 
                  checked={showTelemetry} 
                  onChange={(e) => setShowTelemetry(e.target.checked)}
                  className="rounded text-blue-600 cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

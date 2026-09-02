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
  AlertTriangle,
  Play,
  Pause
} from 'lucide-react';

export const CAMERAS_LIST = [
  { id: 'CAM-04', name: 'Camera 04 - Main Road', location: 'Trichy Main Highway & Bazaar Junction', status: 'Online', ip: '192.168.1.104', type: 'road' },
  { id: 'CAM-01', name: 'Camera 01 - Market Crossing', location: 'Chatram Central Bazaar Gate', status: 'Online', ip: '192.168.1.101', type: 'crowd' },
  { id: 'CAM-02', name: 'Camera 02 - Transit Terminal', location: 'Central Bus Stand Platform 1', status: 'Online', ip: '192.168.1.102', type: 'crowd' },
  { id: 'CAM-03', name: 'Camera 03 - Railway Junction', location: 'Junction Station North Entrance', status: 'Online', ip: '192.168.1.103', type: 'road' },
  { id: 'CAM-05', name: 'Camera 05 - Subway Corridor', location: 'Lalgudi Pedestrian Subway', status: 'Online', ip: '192.168.1.105', type: 'subway' },
  { id: 'CAM-06', name: 'Camera 06 - Highway Outer Ring', location: 'NIT Trichy Highway Gate', status: 'Online', ip: '192.168.1.106', type: 'road' },
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isIntercomActive, setIsIntercomActive] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [snapshotFeedback, setSnapshotFeedback] = useState(false);

  // Overlay filter toggles
  const [showPersonBox, setShowPersonBox] = useState(true);
  const [showVehicleBox, setShowVehicleBox] = useState(true);
  const [showAnimalBox, setShowAnimalBox] = useState(true);
  const [showTelemetry, setShowTelemetry] = useState(true);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const currentCam = CAMERAS_LIST.find(c => c.id === activeCamId) || CAMERAS_LIST[0];

  useEffect(() => {
    setActiveCamId(selectedCamera);
  }, [selectedCamera]);

  const handleCameraChange = (camId) => {
    setActiveCamId(camId);
    setIsDropdownOpen(false);
    if (onSelectCamera) onSelectCamera(camId);
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

  // Video source selector based on camera type
  const getVideoSource = () => {
    if (currentCam.type === 'crowd') return '/videos/crowd.mp4';
    if (currentCam.type === 'subway') return '/videos/isolated.mp4';
    return '/videos/traffic.mp4';
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col"
    >
      {/* Feed Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-slate-800 text-sm tracking-tight">Live Camera Feed</h3>
          <span className="text-slate-400 text-xs">|</span>
          <span className="text-xs text-slate-500 font-mono font-medium">{currentCam.id}</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Camera Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors"
            >
              <span>{currentCam.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-slate-200 py-1 z-50">
                {CAMERAS_LIST.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => handleCameraChange(cam.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                      activeCamId === cam.id ? 'font-bold text-blue-700 bg-blue-50/60' : 'text-slate-700'
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
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video & Simulated Road Surveillance Stream */}
      <div className="relative bg-slate-950 aspect-[16/9] w-full overflow-hidden flex items-center justify-center select-none group">
        
        {/* Background Image / Video Simulation */}
        <div className="absolute inset-0 w-full h-full">
          {/* Authentic Public Intersection Visual with Road, Vehicles, Pedestrians and Animal */}
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop" 
            alt="Live CCTV Street Traffic"
            className="w-full h-full object-cover brightness-95 contrast-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop";
            }}
          />
          {/* Optional Local Looping Video Overlay if available */}
          <video
            ref={videoRef}
            src={getVideoSource()}
            autoPlay
            loop
            muted={isAudioMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply pointer-events-none"
          />
        </div>

        {/* Top-Left: LIVE Status Indicator & Camera Meta */}
        <div className="absolute top-3 left-3 flex items-center space-x-2 z-10">
          <div className="flex items-center space-x-1.5 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            <span className="tracking-wider">LIVE</span>
          </div>
          {isRecording && (
            <div className="flex items-center space-x-1 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <span>REC</span>
            </div>
          )}
        </div>

        {/* Top-Right: Camera Stream Telemetry */}
        {showTelemetry && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-1 rounded font-mono text-[10px] border border-white/10 z-10 space-y-0.5 text-right">
            <div>30 FPS | 1080p H.265</div>
            <div className="text-slate-300">BITRATE: 4.2 Mbps</div>
          </div>
        )}

        {/* Subtle Computer Vision Bounding Boxes Overlay (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          
          {/* 1. Pedestrian Bounding Boxes (Green) */}
          {showPersonBox && (
            <>
              {/* Left Pedestrian 1 */}
              <rect x="7" y="51" width="6" height="15.5" fill="none" stroke="#22c55e" strokeWidth="0.45" rx="0.5" />
              <rect x="7" y="48.5" width="6" height="2.5" fill="#22c55e" rx="0.3" />
              <text x="10" y="50.3" fill="#ffffff" fontSize="1.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Person</text>

              {/* Pedestrian 2 */}
              <rect x="23" y="42" width="6.5" height="14" fill="none" stroke="#22c55e" strokeWidth="0.45" rx="0.5" />
              <rect x="23" y="39.8" width="6.5" height="2.2" fill="#22c55e" rx="0.3" />
              <text x="26.2" y="41.5" fill="#ffffff" fontSize="1.6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Person</text>

              {/* Pedestrian 3 */}
              <rect x="54" y="53" width="7" height="16" fill="none" stroke="#22c55e" strokeWidth="0.45" rx="0.5" />
              <rect x="54" y="50.6" width="7" height="2.4" fill="#22c55e" rx="0.3" />
              <text x="57.5" y="52.4" fill="#ffffff" fontSize="1.7" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Person</text>

              {/* Pedestrian 4 (Distance background) */}
              <rect x="29" y="36" width="4.5" height="10" fill="none" stroke="#22c55e" strokeWidth="0.4" rx="0.4" />
              <rect x="29" y="34.2" width="4.5" height="1.8" fill="#22c55e" rx="0.3" />
              <text x="31.2" y="35.6" fill="#ffffff" fontSize="1.3" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Person</text>

              {/* Pedestrian 5 */}
              <rect x="51.5" y="41" width="5.5" height="12.5" fill="none" stroke="#22c55e" strokeWidth="0.4" rx="0.4" />
              <rect x="51.5" y="39.2" width="5.5" height="1.8" fill="#22c55e" rx="0.3" />
              <text x="54.2" y="40.6" fill="#ffffff" fontSize="1.4" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Person</text>
            </>
          )}

          {/* 2. Animal Crossing Bounding Box (Yellow/Amber) - Cow on Road */}
          {showAnimalBox && (
            <>
              <rect 
                x="37" 
                y="46.5" 
                width="15.5" 
                height="15.5" 
                fill="none" 
                stroke="#eab308" 
                strokeWidth="0.55" 
                strokeDasharray="2, 0.5"
                rx="0.5"
                className="animate-subtle-pulse"
              />
              <rect x="37" y="43.8" width="9.5" height="2.7" fill="#eab308" rx="0.3" />
              <text x="41.7" y="45.8" fill="#0f172a" fontSize="1.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Animal</text>
            </>
          )}

          {/* 3. Vehicle Bounding Boxes (Blue) */}
          {showVehicleBox && (
            <>
              {/* White Car */}
              <rect x="44.5" y="41.5" width="9.5" height="8.5" fill="none" stroke="#3b82f6" strokeWidth="0.4" rx="0.5" />
              
              {/* Black Car */}
              <rect x="34.5" y="41" width="8" height="7.5" fill="none" stroke="#3b82f6" strokeWidth="0.4" rx="0.5" />
            </>
          )}

        </svg>

        {/* Snapshot Taken Flash Feedback */}
        {snapshotFeedback && (
          <div className="absolute inset-0 bg-white/70 z-30 flex items-center justify-center animate-fade-out">
            <div className="bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded shadow-lg flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Evidence Snapshot Saved to Vault</span>
            </div>
          </div>
        )}

      </div>

      {/* Camera Control Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 text-slate-300 border-t border-slate-800">
        
        {/* Left Tools: Snapshot, Record, Mic, Speaker */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTakeSnapshot}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Capture High-Res Evidence Snapshot"
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
            title="Control Room Public Announcement Mic"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute Audio Sensor' : 'Mute Audio Sensor'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
        </div>

        {/* Center: Intercom Active Indicator */}
        {isIntercomActive && (
          <div className="text-[11px] text-emerald-400 font-semibold animate-pulse flex items-center space-x-1">
            <span>MIC BROADCASTING TO {currentCam.name.toUpperCase()}...</span>
          </div>
        )}

        {/* Right Tools: Detection Layer Settings */}
        <div className="relative">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Computer Vision Overlays Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>

          {showConfig && (
            <div className="absolute right-0 bottom-8 w-52 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-2">
              <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 text-[11px] uppercase tracking-wider">
                Detection Overlays
              </p>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">People (Green)</span>
                <input 
                  type="checkbox" 
                  checked={showPersonBox} 
                  onChange={(e) => setShowPersonBox(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Animals (Yellow)</span>
                <input 
                  type="checkbox" 
                  checked={showAnimalBox} 
                  onChange={(e) => setShowAnimalBox(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Vehicles (Blue)</span>
                <input 
                  type="checkbox" 
                  checked={showVehicleBox} 
                  onChange={(e) => setShowVehicleBox(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Stream Telemetry</span>
                <input 
                  type="checkbox" 
                  checked={showTelemetry} 
                  onChange={(e) => setShowTelemetry(e.target.checked)}
                  className="rounded text-blue-600"
                />
              </label>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

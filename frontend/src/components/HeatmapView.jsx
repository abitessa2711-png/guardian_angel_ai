import React, { useState } from 'react';
import { 
  Map, 
  Compass, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ShieldAlert, 
  Truck, 
  Info,
  MapPin,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function HeatmapView({ alerts, cameras, isDemoActive = false, demoStep = 0, inline = false }) {
  const [selectedCam, setSelectedCam] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [ptzState, setPtzState] = useState({ pan: 0, tilt: -10, zoom: 1 });
  const [showRoutes, setShowRoutes] = useState(true);

  // Map coordinates in SVG viewBox units (0 to 100)
  const trichyNodes = [
    { id: 1, name: 'CCTV-01 CHATRAM_BUS_STAND', short: 'Chatram Stand', x: 50, y: 28, desc: 'Chatram Bus Stand Outer Gates' },
    { id: 2, name: 'CCTV-02 CENTRAL_BUS_STAND', short: 'Central Stand', x: 44, y: 58, desc: 'Central Bus Terminal Platform 1 Gate' },
    { id: 3, name: 'CCTV-03 RAILWAY_JUNCTION', short: 'Railway Jn', x: 42, y: 72, desc: 'Trichy Railway Junction Entrance' },
    { id: 4, name: 'CCTV-04 ROCKFORT_TEMPLE_ROAD', short: 'Rockfort Rd', x: 56, y: 36, desc: 'Rockfort Temple Bazaar Street' },
    { id: 5, name: 'CCTV-05 SRIRANGAM_TEMPLE', short: 'Srirangam Gate', x: 48, y: 12, desc: 'Srirangam Temple Entrance' },
    { id: 6, name: 'CCTV-06 NIT_TRICHY', short: 'NIT Gate', x: 82, y: 78, desc: 'NIT Trichy Highway Gate' }
  ];

  // Helper to match database camera names
  const getCameraStatus = (camId, camStatus, camName = '') => {
    if (isDemoActive && camName.includes('ROCKFORT')) {
      if (demoStep >= 10) return 'threat';
      return 'online';
    }
    if (camStatus === 'Offline') return 'offline';
    // Check if there are active high-risk alerts (risk >= 75)
    const activeThreat = alerts.some(a => a.camera_id === camId && a.status === 'New' && a.risk_score >= 75);
    if (activeThreat) return 'threat';
    return 'online';
  };

  const getStatusColor = (status) => {
    if (status === 'threat') return 'text-surveillance-danger border-surveillance-danger bg-surveillance-danger/10';
    if (status === 'offline') return 'text-surveillance-warning border-surveillance-warning bg-surveillance-warning/10';
    return 'text-surveillance-success border-surveillance-success bg-surveillance-success/10';
  };

  const getMarkerFill = (status) => {
    if (status === 'threat') return '#ef4444'; // Red
    if (status === 'offline') return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const handleMarkerClick = (node) => {
    setSelectedCam(node);
    setIsZoomed(true);
  };

  const resetMapZoom = () => {
    setIsZoomed(false);
    setSelectedCam(null);
    setPtzState({ pan: 0, tilt: -10, zoom: 1 });
  };

  // PTZ Control Simulation
  const adjustPTZ = (type, amount) => {
    setPtzState(prev => {
      if (type === 'pan') return { ...prev, pan: prev.pan + amount };
      if (type === 'tilt') return { ...prev, tilt: Math.max(-45, Math.min(20, prev.tilt + amount)) };
      if (type === 'zoom') return { ...prev, zoom: Math.max(1, Math.min(6, prev.zoom + amount)) };
      return prev;
    });
  };

  // Dynamic ViewBox for SVG Zoom
  const getViewBox = () => {
    if (isZoomed && selectedCam) {
      // Crop coordinate viewport around selected camera
      const width = 30;
      const height = 30;
      const x = Math.max(0, Math.min(100 - width, selectedCam.x - width / 2));
      const y = Math.max(0, Math.min(100 - height, selectedCam.y - height / 2));
      return `${x} ${y} ${width} ${height}`;
    }
    return '0 0 100 100';
  };

  // Active threat flag
  const hasActiveThreat = alerts.some(a => a.status === 'New' && a.risk_score >= 75) || (isDemoActive && demoStep >= 10);

  const mapPanelContent = (
    <div className={`bg-surveillance-panel border border-surveillance-border rounded-lg p-5 flex flex-col justify-between relative ${inline ? 'h-[520px]' : 'h-[calc(100vh-14rem)] min-h-[500px]'}`}>
      
      {/* Map Header Overlay */}
      <div className="flex justify-between items-center mb-4 border-b border-surveillance-border pb-3 z-20">
        <div className="flex items-center space-x-2">
          <Compass className="h-5 w-5 text-surveillance-accent animate-spin-slow" />
          <div>
            <h3 className="text-sm font-bold tracking-widest text-white uppercase">
              TIRUCHIRAPPALLI City GIS RADAR PLOT
            </h3>
            <p className="text-4xs text-surveillance-textMuted mt-0.5">TRICHY DISTRICT POLICE SURVEILLANCE MATRIX</p>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex space-x-2.5 text-3xs">
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2 py-1 rounded border transition-all cursor-pointer ${
              showRoutes 
                ? 'bg-surveillance-accent/15 border-surveillance-accent text-surveillance-accent' 
                : 'bg-surveillance-header border-surveillance-border text-surveillance-textMuted'
            }`}
          >
            {showRoutes ? 'HIDE RESPONSE ROUTES' : 'SHOW RESPONSE ROUTES'}
          </button>
          {isZoomed && (
            <button
              onClick={resetMapZoom}
              className="px-2 py-1 rounded bg-surveillance-danger/10 hover:bg-surveillance-danger hover:text-white border border-surveillance-danger/30 text-surveillance-danger transition-all cursor-pointer flex items-center space-x-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>RESET MAP VIEW</span>
            </button>
          )}
        </div>
      </div>

      {/* SVG Viewport */}
      <div className="flex-1 w-full bg-[#03060c] border border-surveillance-border/40 rounded relative overflow-hidden flex items-center justify-center">
        
        {/* CRT scan lines overlay */}
        <div className="absolute inset-0 surveillance-monitor pointer-events-none z-30"></div>
        
        {/* Grid Background */}
        <div className="absolute inset-0 surveillance-grid opacity-20 pointer-events-none"></div>

        {/* Compass overlay in corner */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-20 opacity-30 text-surveillance-accent">
          <div className="w-12 h-12 rounded-full border border-dashed border-surveillance-accent flex items-center justify-center">
            <span className="text-4xs font-bold font-mono">N</span>
          </div>
        </div>

        <svg 
          className="w-full h-full max-h-[440px] z-10 transition-all duration-700 ease-in-out" 
          viewBox={getViewBox()}
        >
          {/* Concentric Radar Sweeps */}
          <circle cx="50" cy="50" r="15" fill="none" stroke="#0ea5e9" strokeWidth="0.08" strokeDasharray="1,2" opacity="0.3" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="#0ea5e9" strokeWidth="0.08" strokeDasharray="1,2" opacity="0.3" />
          <circle cx="50" cy="50" r="45" fill="none" stroke="#0ea5e9" strokeWidth="0.08" strokeDasharray="1,2" opacity="0.2" />

          {/* Sweep Ray */}
          {!isZoomed && (
            <line x1="50" y1="50" x2="100" y2="20" stroke="#0ea5e9" strokeWidth="0.1" opacity="0.35" className="origin-center animate-[spin_10s_linear_infinite]" />
          )}

          {/* Simulated Road Networks (Trichy Arterial Roads) */}
          {/* Srirangam to Chatram */}
          <line x1="48" y1="12" x2="50" y2="28" stroke="#1f293d" strokeWidth="0.4" />
          {/* Chatram to Rockfort */}
          <line x1="50" y1="28" x2="56" y2="36" stroke="#1f293d" strokeWidth="0.4" />
          {/* Rockfort to Central */}
          <line x1="56" y1="36" x2="44" y2="58" stroke="#1f293d" strokeWidth="0.4" />
          {/* Central to Junction */}
          <line x1="44" y1="58" x2="42" y2="72" stroke="#1f293d" strokeWidth="0.4" />
          {/* Junction to NIT Trichy */}
          <line x1="42" y1="72" x2="82" y2="78" stroke="#1f293d" strokeWidth="0.4" />

          {/* Animated Emergency Patrol Routes Overlay */}
          {showRoutes && (hasActiveThreat || (isDemoActive && demoStep >= 12)) && (
            <>
              {/* Glowing alert response route line from Junction Station to Rockfort Temple Rd */}
              <path
                d="M 42 72 L 44 58 L 56 36"
                fill="none"
                stroke="#ef4444"
                strokeWidth="0.8"
                strokeDasharray="2, 2"
                className="animate-[dash_2s_linear_infinite]"
                style={{ strokeDashoffset: 100 }}
              />
              {/* Moving dot representing patrol car */}
              <circle r="1" fill="#ef4444" opacity="0.9" className="animate-[pulse_1s_infinite]">
                <animateMotion
                  path="M 42 72 L 44 58 L 56 36"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}

          {/* Render Node Markers */}
          {trichyNodes.map((node) => {
            const liveCam = cameras.find(c => c.name.replace(/\s+/g, '_') === node.name) || { status: 'Active', name: node.name };
            const status = getCameraStatus(liveCam.id, liveCam.status, liveCam.name);
            const color = getMarkerFill(status);
            const isSelected = selectedCam?.id === node.id;

            return (
              <g 
                key={node.id} 
                className="cursor-pointer"
                onClick={() => handleMarkerClick(node)}
              >
                {/* Glowing Radar Pulse under threat nodes */}
                {status === 'threat' && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 6 : 4}
                    fill="none"
                    stroke={color}
                    strokeWidth="0.3"
                    className="animate-ping"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}

                {/* Marker Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isSelected ? 2.5 : 1.5}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 0.4 : 0}
                  className="transition-all duration-300 hover:scale-125"
                />

                {/* Label Text */}
                <text 
                  x={node.x} 
                  y={node.y - 3} 
                  fill={status === 'threat' ? '#ef4444' : '#94a3b8'} 
                  fontSize={isZoomed ? "1.5" : "2"} 
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none font-sans tracking-wide"
                >
                  {node.short}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map HUD Data panel in corner */}
        <div className="absolute top-4 left-4 z-20 bg-surveillance-panel/90 border border-surveillance-border p-3 rounded font-mono text-3xs text-white space-y-1">
          <p className="text-2xs font-bold text-surveillance-accent border-b border-surveillance-border pb-1 uppercase">DISTRICT DATA HUD</p>
          <p>SECTOR: TIRUCHIRAPPALLI CITY</p>
          <p>ACTIVE FEED NODES: {cameras.filter(c => c.status === 'Active').length}</p>
          <p className="flex justify-between">
            <span>ALARM LEVEL:</span>
            <span className={hasActiveThreat ? 'text-surveillance-danger font-bold animate-pulse' : 'text-surveillance-success'}>
              {hasActiveThreat ? 'CRITICAL THREAT' : 'SECURE'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return mapPanelContent;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none font-mono">
      <div className="lg:col-span-8">
        {mapPanelContent}
      </div>

      {/* Right: Street View Surveillance / CCTV Panel (4 cols) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        
        {/* Street View Surveillance Panel */}
        <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5 flex flex-col h-[calc(100vh-14rem)] min-h-[500px]">
          <h4 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase border-b border-surveillance-border pb-3 mb-4 flex items-center space-x-1.5">
            <MapPin className="h-4 w-4 text-surveillance-accent" />
            <span>STREET VIEW SURVEILLANCE</span>
          </h4>

          {selectedCam ? (
            <div className="flex-1 flex flex-col space-y-4">
              
              {/* Telemetry metadata */}
              <div className="bg-surveillance-header border border-surveillance-border p-3 rounded text-3xs space-y-1">
                <p className="text-white font-bold uppercase">{selectedCam.name}</p>
                <p className="text-surveillance-textMuted">{selectedCam.desc}</p>
                <p className="text-surveillance-accent uppercase pt-1 border-t border-surveillance-border/50">
                  COORDINATES: {selectedCam.x.toFixed(4)}N, {selectedCam.y.toFixed(4)}E
                </p>
              </div>

              {/* Viewport Simulation */}
              <div className="relative flex-1 bg-black border border-surveillance-border rounded overflow-hidden flex items-center justify-center">
                
                {/* CRT overlay */}
                <div className="absolute inset-0 surveillance-monitor pointer-events-none z-10"></div>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 surveillance-grid opacity-10"></div>

                {/* Animated Camera Sweep Canvas */}
                <div 
                  className="w-full h-full p-4 flex flex-col justify-between items-center text-center font-mono transition-transform duration-500 ease-out relative"
                  style={{
                    transform: `rotate(${ptzState.pan * 0.05}deg) translateY(${ptzState.tilt * 0.5}px) scale(${ptzState.zoom * 0.2 + 0.8})`
                  }}
                >
                  {/* Grid Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                    <div className="w-8 h-8 border border-white/20 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                    </div>
                  </div>

                  {/* Telemetry logs on stream */}
                  <div className="w-full flex justify-between text-4xs text-slate-400">
                    <span>PAN: {ptzState.pan.toFixed(1)}°</span>
                    <span>TILT: {ptzState.tilt.toFixed(1)}°</span>
                    <span>ZOOM: {ptzState.zoom.toFixed(1)}x</span>
                  </div>

                  <div className="my-auto space-y-2">
                    <Truck className={`h-10 w-10 mx-auto text-surveillance-accent ${ptzState.zoom > 3 ? 'scale-125' : ''} transition-all duration-300`} />
                    <p className="text-2xs font-bold text-white uppercase tracking-wider">STREET LEVEL FEED ACTIVE</p>
                    <p className="text-4xs text-surveillance-textMuted uppercase">PANNING SENSOR TELEMETRY LOCKED</p>
                  </div>

                  <div className="w-full text-4xs text-surveillance-success font-bold flex justify-between">
                    <span>FPS: 30.0</span>
                    <span>SECURE NODE 1080P</span>
                  </div>
                </div>
              </div>

              {/* PTZ Slider Buttons */}
              <div className="space-y-2.5 bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                <p className="text-3xs text-surveillance-textMuted uppercase font-bold tracking-widest flex items-center space-x-1">
                  <Sliders className="h-3 w-3" />
                  <span>PTZ MOTOR TELEMETRY CONTROLS</span>
                </p>
                <div className="grid grid-cols-2 gap-2 text-3xs font-bold">
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('pan', -10)} 
                    className="py-1 bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white rounded cursor-pointer transition-colors"
                  >
                    PAN LEFT (&larr;)
                  </button>
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('pan', 10)} 
                    className="py-1 bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white rounded cursor-pointer transition-colors"
                  >
                    PAN RIGHT (&rarr;)
                  </button>
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('tilt', -5)} 
                    className="py-1 bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white rounded cursor-pointer transition-colors"
                  >
                    TILT DOWN (&darr;)
                  </button>
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('tilt', 5)} 
                    className="py-1 bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white rounded cursor-pointer transition-colors"
                  >
                    TILT UP (&uarr;)
                  </button>
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('zoom', 0.5)} 
                    className="py-1 bg-surveillance-accent text-white font-bold hover:bg-sky-600 rounded cursor-pointer transition-colors"
                  >
                    ZOOM IN (+)
                  </button>
                  <button 
                    type="button"
                    onClick={() => adjustPTZ('zoom', -0.5)} 
                    className="py-1 bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white rounded cursor-pointer transition-colors"
                  >
                    ZOOM OUT (-)
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-surveillance-textMuted py-16">
              <Compass className="h-10 w-10 text-surveillance-textMuted/30 mb-2.5 animate-pulse" />
              <p className="text-xs font-bold uppercase">NO ACTIVE STREET CAMERA LOCKED</p>
              <p className="text-4xs mt-1 leading-normal uppercase">
                Click any camera marker on the city GIS radar map to lock telemetry and stream live street views.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

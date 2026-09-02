import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, VideoOff, ShieldAlert, Activity, Truck, AlertOctagon, Flame, ShieldCheck, Thermometer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const getPoseTranslation = (pose, lang) => {
  if (lang === 'ta') {
    if (pose === 'SAFE_WORKING') return 'பாதுகாப்பான பணி';
    if (pose === 'WALKING') return 'நகர்வு';
    if (pose === 'THERMAL_SURGE') return 'வெப்ப உயர்வு';
    if (pose === 'DENSITY_ALERT') return 'நெரிசல்';
    if (pose === 'VEHICLE_TRANSIT') return 'வாகனம்';
  }
  return pose;
};

const getPPETranslation = (ppe, lang) => {
  if (lang === 'ta') {
    if (ppe === 'COMPLIANT') return '100% கவச உடை';
    if (ppe === 'WARNING') return '85% குறைபாடு';
    if (ppe === 'NON_COMPLIANT') return 'கவச உடை இல்லை';
    if (ppe === 'SECURE') return 'பாதுகாப்பானது';
  }
  return ppe;
};

// Custom component to simulate active AI CCTV video tracking with custom industrial animatics
export const SimulatedCCTVStream = ({ camera, isCriticalMock = false, isDemoActive = false, demoStep = 0 }) => {
  const { language, t } = useLanguage();
  const [seconds, setSeconds] = useState(0);
  const [localTemp, setLocalTemp] = useState(31.5);
  const [localGas, setLocalGas] = useState(120);
  const [localWorkers, setLocalWorkers] = useState(3);
  const [localPPE, setLocalPPE] = useState('COMPLIANT');
  const [videoError, setVideoError] = useState(false);

  // Reference for requestAnimationFrame to animate tracking boxes smoothly
  const animRef = useRef(0);
  const [animVal, setAnimVal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
      
      if (!isDemoActive || !isCriticalMock) {
        setLocalTemp(+(31.0 + (Math.random() * 2.8)).toFixed(1));
        setLocalGas(Math.floor(95 + Math.random() * 45));
        setLocalWorkers(camera.name.includes('DRYING') ? 2 : camera.name.includes('MAGAZINE') ? 1 : 4);
        setLocalPPE(camera.name.includes('MIXING') ? 'COMPLIANT' : 'COMPLIANT');
      }
    }, 1000);

    const tick = () => {
      setAnimVal(Date.now() * 0.001);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animRef.current);
    };
  }, [camera, isCriticalMock, isDemoActive]);

  // Classify camera type for realistic fireworks industrial simulations
  let streamType = 'processing'; // Default processing/assembly shed
  if (isCriticalMock || camera.id === 4 || camera.name.includes('CHEMICAL_GRINDING') || camera.name.includes('ROCKFORT')) {
    streamType = 'hazard_zone';
  } else if (camera.name.includes('TRANSIT') || camera.name.includes('PUMP') || camera.name.includes('VEHICLE') || camera.name.includes('NIT')) {
    streamType = 'transit';
  } else if (camera.name.includes('MIXING') || camera.name.includes('RAW')) {
    streamType = 'chemical_mix';
  } else if (camera.name.includes('MAGAZINE') || camera.name.includes('BUFFER') || camera.name.includes('SUBWAY')) {
    streamType = 'restricted_bunker';
  }

  // Motion paths based on streamType
  const v1X = (animVal * 18) % 130 - 20;
  const v2X = 120 - (animVal * 22) % 140;
  const isoX = 25 + (animVal * 2.5) % 50;
  const isoY = 50 + Math.sin(animVal * 0.4) * 2;
  const c1X = 15 + (animVal * 6.5) % 70;
  const c1Y = 42 + Math.sin(animVal * 1.5) * 2;
  const c2X = 85 - (animVal * 5.5) % 70;
  const c2Y = 54 + Math.cos(animVal * 1.2) * 2;

  // Telemetry HUD derived values
  let ambientTemp, gasPPM, workerCount, ppeStatus, poseStatus, riskScore, isHighThreat;
  const isDemoOverride = isDemoActive && isCriticalMock;

  if (streamType === 'hazard_zone') {
    ambientTemp = isDemoOverride 
      ? (demoStep < 2 ? 32.5 : demoStep < 5 ? 38.2 : demoStep < 9 ? 44.8 : demoStep < 13 ? 46.5 : 31.0)
      : (isCriticalMock ? 44.2 : localTemp);
      
    gasPPM = isDemoOverride
      ? (demoStep < 2 ? 110 : demoStep < 5 ? 280 : demoStep < 9 ? 640 : demoStep < 13 ? 720 : 105)
      : (isCriticalMock ? 580 : localGas);
      
    workerCount = isDemoOverride
      ? (demoStep < 3 ? 2 : demoStep < 7 ? 5 : 0)
      : (isCriticalMock ? 4 : localWorkers);

    ppeStatus = isDemoOverride
      ? (demoStep < 4 ? 'COMPLIANT' : demoStep < 8 ? 'WARNING' : 'NON_COMPLIANT')
      : (isCriticalMock ? 'WARNING' : localPPE);

    poseStatus = isDemoOverride
      ? (demoStep < 5 ? 'SAFE_WORKING' : demoStep < 9 ? 'THERMAL_SURGE' : 'DENSITY_ALERT')
      : (isCriticalMock ? 'THERMAL_SURGE' : 'SAFE_WORKING');

    riskScore = isDemoOverride
      ? (demoStep === 0 ? 18 : demoStep === 1 ? 22 : demoStep === 2 ? 35 : demoStep === 3 ? 48 : demoStep === 4 ? 62 : demoStep === 5 ? 76 : demoStep === 6 ? 85 : demoStep >= 7 ? 95 : 20)
      : (isCriticalMock ? 94 : Math.min(88, Math.floor(20 + (ambientTemp > 35 ? (ambientTemp - 35) * 8 : 0))));

    isHighThreat = isDemoOverride ? (demoStep >= 5) : (isCriticalMock || ambientTemp >= 40);
  } else if (streamType === 'transit') {
    ambientTemp = 32.0;
    gasPPM = 85;
    workerCount = 2;
    ppeStatus = 'COMPLIANT';
    poseStatus = 'VEHICLE_TRANSIT';
    riskScore = 8;
    isHighThreat = false;
  } else if (streamType === 'chemical_mix') {
    ambientTemp = 33.5;
    gasPPM = 160;
    workerCount = 2;
    ppeStatus = 'COMPLIANT';
    poseStatus = 'SAFE_WORKING';
    riskScore = 18;
    isHighThreat = false;
  } else if (streamType === 'restricted_bunker') {
    ambientTemp = 28.5;
    gasPPM = 45;
    workerCount = 1;
    ppeStatus = 'COMPLIANT';
    poseStatus = 'SAFE_WORKING';
    riskScore = 12;
    isHighThreat = false;
  } else {
    ambientTemp = 31.8;
    gasPPM = 120;
    workerCount = 4;
    ppeStatus = 'COMPLIANT';
    poseStatus = 'SAFE_WORKING';
    riskScore = 15;
    isHighThreat = false;
  }

  // Helper joint definition for mock pose skeleton rendering
  const getPoseJoints = (x, y, scale = 1) => {
    const head = { cx: x, cy: y - 5 * scale };
    const neck = { cx: x, cy: y - 3 * scale };
    const lShoulder = { cx: x - 2 * scale, cy: y - 2 * scale };
    const rShoulder = { cx: x + 2 * scale, cy: y - 2 * scale };
    const spine = { cx: x, cy: y };
    const lHip = { cx: x - 1.5 * scale, cy: y + 3 * scale };
    const rHip = { cx: x + 1.5 * scale, cy: y + 3 * scale };
    const lKnee = { cx: x - 2 * scale, cy: y + 7 * scale };
    const rKnee = { cx: x + 2 * scale, cy: y + 7 * scale };
    const lAnkle = { cx: x - 2.5 * scale, cy: y + 11 * scale };
    const rAnkle = { cx: x + 2.5 * scale, cy: y + 11 * scale };

    return {
      points: [head, neck, lShoulder, rShoulder, spine, lHip, rHip, lKnee, rKnee, lAnkle, rAnkle],
      limbs: [
        [head, neck], [neck, lShoulder], [neck, rShoulder],
        [neck, spine], [spine, lHip], [spine, rHip],
        [lHip, lKnee], [rHip, rKnee], [lKnee, lAnkle], [rKnee, rAnkle]
      ]
    };
  };

  const renderSkeleton = (x, y, scale = 1, color = "#0ea5e9") => {
    const joints = getPoseJoints(x, y, scale);
    return (
      <g key={`${x}-${y}`}>
        {joints.limbs.map((limb, idx) => (
          <line key={`li-${idx}`} x1={limb[0].cx} y1={limb[0].cy} x2={limb[1].cx} y2={limb[1].cy} stroke={color} strokeWidth="0.22" opacity="0.75" />
        ))}
        {joints.points.map((pt, idx) => (
          <circle key={`po-${idx}`} cx={pt.cx} cy={pt.cy} r="0.45" fill="#ffffff" opacity="0.9" />
        ))}
      </g>
    );
  };

  // Video Mapping with local MP4 loops
  let videoUrl = '/videos/crowd.mp4';
  let bgUrl = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop';
  
  if (streamType === 'hazard_zone') {
    videoUrl = '/videos/threat.mp4';
    bgUrl = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=400&auto=format&fit=crop';
  } else if (streamType === 'transit') {
    videoUrl = '/videos/traffic.mp4';
    bgUrl = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400&auto=format&fit=crop';
  } else if (streamType === 'restricted_bunker') {
    videoUrl = '/videos/isolated.mp4';
    bgUrl = 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop';
  }

  // Threat tracking calculations
  const tX = 40 + Math.sin(animVal) * 10;
  const tY = 48 + Math.cos(animVal * 0.6) * 6;

  return (
    <div className="relative w-full h-full bg-[#060b13] flex items-center justify-center overflow-hidden border border-surveillance-border group select-none">
      
      {/* CCTV Background Looping Video */}
      {!videoError ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(92%) contrast(108%)',
            opacity: 0.95
          }}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${bgUrl})`,
            filter: 'brightness(92%) contrast(108%)',
            opacity: 0.95
          }}
        />
      )}

      {/* Camera Meta Header: Location & Zone */}
      <div className="absolute top-2 left-2 z-10 font-mono text-[7px] text-white bg-slate-950/85 px-1.5 py-0.5 rounded border border-white/10 uppercase tracking-wider font-bold">
        {camera.name}
      </div>

      {/* Safe External Observation Badge */}
      <div className="absolute top-2 right-2 z-10 font-mono text-[7px] text-sky-400 bg-slate-950/85 px-1.5 py-0.5 rounded border border-sky-500/30 flex items-center space-x-1">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
        <span className="font-bold uppercase tracking-tighter">SAFE EXT OBS</span>
      </div>

      {/* Bottom Coordinates & Zone Name */}
      <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] text-slate-400 bg-slate-950/85 px-1.5 py-0.5 rounded border border-white/10">
        LAT: {camera.latitude.toFixed(4)} | LNG: {camera.longitude.toFixed(4)}
      </div>

      <div className="absolute bottom-2 right-2 z-10 font-mono text-[7px] text-sky-400 bg-slate-950/85 px-1.5 py-0.5 rounded border border-sky-500/20 uppercase max-w-[130px] truncate font-semibold">
        {camera.location}
      </div>

      {/* Subtle Scanlines overlay */}
      <div className="absolute inset-0 surveillance-monitor pointer-events-none z-20"></div>

      {/* SVG Canvas for AI Object Bounding Overlays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        
        {/* Scenario 1: Hazard Zone / Thermal Anomaly (Camera 4) */}
        {streamType === 'hazard_zone' && (
          <>
            <rect 
              x={tX - 5} 
              y={tY - 8} 
              width="10" 
              height="16" 
              fill={isHighThreat ? "rgba(239, 68, 68, 0.12)" : "rgba(14, 165, 233, 0.08)"} 
              stroke={isHighThreat ? '#ef4444' : '#0ea5e9'} 
              strokeWidth="0.35" 
              className={isHighThreat ? 'ai-bounding-box' : ''} 
            />
            <text x={tX - 5} y={tY - 9} fill={isHighThreat ? '#ef4444' : '#0ea5e9'} fontSize="2.0" fontFamily="monospace" fontWeight="bold">
              {isHighThreat ? '[THERMAL SPIKE] >44°C' : '[WORKER_ID_01] PPE: OK'}
            </text>
            {renderSkeleton(tX, tY, 0.65, isHighThreat ? '#ef4444' : '#0ea5e9')}

            {isHighThreat && (
              <g>
                <circle cx={tX} cy={tY} r="14" fill="none" stroke="#ef4444" strokeWidth="0.25" strokeDasharray="1, 1" className="animate-ping" />
                <text x={tX} y={tY + 12} fill="#ef4444" fontSize="1.8" textAnchor="middle" fontFamily="monospace" fontWeight="black">
                  CRITICAL HAZARD RADIUS
                </text>
              </g>
            )}
          </>
        )}

        {/* Scenario 2: Chemical Handling / Processing Shed */}
        {streamType === 'processing' && (
          <>
            <rect x={c1X - 3.5} y={c1Y - 6} width="7" height="13" fill="none" stroke="#10b981" strokeWidth="0.25" />
            <text x={c1X - 3.5} y={c1Y - 6.5} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">WORKER [ID_04] PPE: OK</text>
            {renderSkeleton(c1X, c1Y, 0.55, "#10b981")}

            <rect x={c2X - 4} y={c2Y - 6} width="8" height="14" fill="none" stroke="#10b981" strokeWidth="0.25" />
            <text x={c2X - 4} y={c2Y - 6.5} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">WORKER [ID_05] PPE: OK</text>
            {renderSkeleton(c2X, c2Y, 0.6, "#10b981")}
          </>
        )}

        {/* Scenario 3: Material Transit */}
        {streamType === 'transit' && (
          <>
            <rect x={v1X} y={46} width="18" height="11" fill="none" stroke="#0ea5e9" strokeWidth="0.3" />
            <text x={v1X} y={44.5} fill="#0ea5e9" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              TRANSIT CART [ID_{12 + Math.floor(v1X / 10) % 20}] CONF: 98%
            </text>
          </>
        )}

        {/* Scenario 4: Restricted Magazine Bunker */}
        {streamType === 'restricted_bunker' && (
          <>
            <rect x={isoX - 4.5} y={isoY - 6} width="9" height="15" fill="none" stroke="#f59e0b" strokeWidth="0.25" className="ai-bounding-box" />
            <text x={isoX - 4.5} y={isoY - 6.8} fill="#f59e0b" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              PERIMETER GUARD [ID_02]
            </text>
            {renderSkeleton(isoX, isoY, 0.65, "#f59e0b")}
          </>
        )}

      </svg>

      {/* Floating HUD Panel of Live Industrial Safety Telemetry */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col space-y-1 bg-slate-950/90 p-2 rounded border border-slate-700/60 font-mono text-[7px] z-10 w-[124px] shadow-cmd leading-tight">
        <p className="text-sky-400 font-bold border-b border-white/10 pb-0.5 mb-1 uppercase tracking-wider flex items-center justify-between">
          <span>{t('realtime_telemetry')}</span>
          <Activity className="h-2.5 w-2.5 text-sky-400 animate-pulse" />
        </p>
        
        {/* Ambient Temperature */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">TEMP:</span>
          <span className={ambientTemp >= 40 ? 'text-red-400 font-black animate-pulse' : ambientTemp >= 35 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
            {ambientTemp}°C {ambientTemp >= 40 ? '(CRITICAL)' : ambientTemp >= 35 ? '(WARM)' : '(SAFE)'}
          </span>
        </div>

        {/* Volatile Gas PPM */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">GAS PPM:</span>
          <span className={gasPPM >= 500 ? 'text-red-400 font-black animate-pulse' : gasPPM >= 300 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
            {gasPPM} PPM
          </span>
        </div>

        {/* Workers Detected */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">WORKERS:</span>
          <span className="text-slate-200 font-semibold">{workerCount} PERSONS</span>
        </div>

        {/* PPE Status */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">PPE STATUS:</span>
          <span className={ppeStatus === 'NON_COMPLIANT' ? 'text-red-400 font-bold animate-pulse' : ppeStatus === 'WARNING' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-bold'}>
            {getPPETranslation(ppeStatus, language)}
          </span>
        </div>

        {/* Overall Safety Risk Score */}
        <div className="flex justify-between items-center border-t border-white/10 pt-1 mt-1 font-bold">
          <span className="text-white">RISK SCORE:</span>
          <span className={isHighThreat ? 'text-red-400 font-black text-[8px]' : 'text-sky-400'}>
            {riskScore}%
          </span>
        </div>
      </div>

      {/* Critical Alarm Banner */}
      {isHighThreat && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-red-600 text-white border border-red-400 px-2.5 py-0.5 rounded text-[8px] font-black tracking-wider flex items-center space-x-1 animate-pulse shadow-glow-red uppercase text-center max-w-[90%] whitespace-nowrap">
          <AlertOctagon className="h-2.5 w-2.5 shrink-0" />
          <span>{t('proactive_critical_alert')}</span>
        </div>
      )}

    </div>
  );
};


export default function CCTVGrid({ cameras, isDemoActive = false, demoStep = 0, demoCameraId = null }) {
  const [fullscreenCamId, setFullscreenCamId] = useState(null);
  const { t } = useLanguage();

  // Ensure 16 industrial fireworks factory camera nodes
  const displayCameras = [...cameras];
  const mockNames = [
    "CAM-01 RAW_MATERIAL_STORE",
    "CAM-02 MIXING_SHED_01_OUTER",
    "CAM-03 MIXING_SHED_02_OUTER",
    "CAM-04 CHEMICAL_GRINDING_GATE",
    "CAM-05 DRYING_GROUNDS_NORTH",
    "CAM-06 DRYING_GROUNDS_SOUTH",
    "CAM-07 FUSE_INSERTION_PORCH",
    "CAM-08 PAPER_CASING_UNIT",
    "CAM-09 SPARKLER_SLURRY_SHED",
    "CAM-10 FILLING_ASSEMBLY_LINE",
    "CAM-11 PACKAGING_BOXING_HALL",
    "CAM-12 FINISHED_MAGAZINE_BUNKER",
    "CAM-13 WASTE_NEUTRALIZATION_PIT",
    "CAM-14 FIRE_HYDRANT_PUMP_HOUSE",
    "CAM-15 CONTROL_ROOM_PERIMETER",
    "CAM-16 EMERGENCY_BUFFER_GATE"
  ];
  const mockLocations = [
    "Raw Chemical & Nitrate Store Outer Gate",
    "Chemical Mixing Room 1 (External Observation)",
    "Chemical Mixing Room 2 (External Observation)",
    "Pulverizer & Grinding Shed Outer Perch",
    "Open Drying Yard North (Solar Radiation)",
    "Open Drying Yard South (Perimeter Watch)",
    "Fuse Insertion & Capping Porch",
    "Paper Tube Winding & Casing Section",
    "Sparkler Dipping & Slurry Bath Outer",
    "Final Firework Assembly & Filling Line",
    "Secondary Packaging & Box Storage",
    "Explosive Magazine Storage Vault Entry",
    "Chemical Residue Neutralization Pit",
    "Industrial Fire Water Reserve & Pump House",
    "External Safety Supervisor Control Post",
    "Factory Boundary & Evacuation Path"
  ];

  while (displayCameras.length < 16) {
    const idx = displayCameras.length;
    displayCameras.push({
      id: 1000 + idx,
      name: mockNames[idx] || `CAM-${idx + 1} SAFE_NODE`,
      location: mockLocations[idx] || `Observation Zone ${idx + 1}`,
      rtsp_url: `rtsp://192.168.1.${101 + idx}/stream1`,
      status: idx === 15 ? 'Offline' : 'Active',
      latitude: 9.4532 + (idx * 0.0006),
      longitude: 77.8021 + (idx * 0.0007)
    });
  }

  const activeCameras = displayCameras.filter(c => c.status === 'Active');
  const offlineCameras = displayCameras.filter(c => c.status === 'Offline');

  const toggleFullscreen = (camId) => {
    setFullscreenCamId(prev => (prev === camId ? null : camId));
  };

  return (
    <div className="space-y-3 font-mono select-none">
      
      {/* Wall Header Meta */}
      <div className="flex items-center justify-between border-b border-surveillance-border/60 pb-2">
        <h3 className="text-2xs font-black tracking-widest text-sky-400 uppercase flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <span>{t('live_cctv_feed_matrix')}</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400">
          ONLINE CHANNELS: <span className="text-emerald-400">{activeCameras.length}</span> | OFFLINE: <span className="text-red-400">{offlineCameras.length}</span>
        </span>
      </div>

      {/* 4x4 Grid Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {activeCameras.map((camera) => {
          const isDemoTarget = isDemoActive && (camera.id === demoCameraId || camera.id === 9999 || (camera.id === 4 && demoCameraId === 4) || camera.name.includes('GRINDING'));
          return (
            <div 
              key={camera.id} 
              className={`bg-surveillance-panel border-2 rounded-lg p-2 flex flex-col h-64 transition-all relative group shadow-cmd ${
                isDemoTarget 
                  ? 'border-red-500 shadow-glow-red animate-pulse-red' 
                  : 'border-slate-800 hover:border-sky-500/80 hover:shadow-glow-cyan'
              }`}
            >
              <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-1">
                <span className="text-[8px] font-black text-white truncate w-3/4 tracking-wider uppercase">
                  {camera.name}
                </span>
                
                <button 
                  onClick={() => toggleFullscreen(camera.id)}
                  title="Expand Camera Focus"
                  className="opacity-40 group-hover:opacity-100 hover:text-sky-400 text-slate-400 transition-opacity cursor-pointer p-0.5 rounded hover:bg-slate-900"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex-1 w-full rounded overflow-hidden relative border border-slate-800">
                <SimulatedCCTVStream camera={camera} isCriticalMock={isDemoTarget} isDemoActive={isDemoActive} demoStep={demoStep} />
              </div>
            </div>
          );
        })}

        {/* Offline Nodes */}
        {offlineCameras.map((camera) => (
          <div 
            key={camera.id} 
            className="bg-slate-950/40 border border-red-500/30 border-dashed rounded-lg p-2.5 flex flex-col h-64 opacity-60 justify-center items-center text-center relative"
          >
            <div className="absolute top-2 left-2.5 text-[8px] text-red-400 font-bold uppercase tracking-widest">
              {camera.name}
            </div>
            <VideoOff className="h-7 w-7 text-red-500/40 mb-2" />
            <p className="text-[8px] font-black text-red-500 uppercase tracking-wider">{t('node_status_offline')}</p>
            <p className="text-[7px] text-slate-500 mt-0.5 uppercase truncate w-full px-1">{camera.location}</p>
          </div>
        ))}
      </div>

      {/* Expand Fullscreen Modal */}
      {fullscreenCamId !== null && createPortal(
        (() => {
          const selectedCam = displayCameras.find(c => c.id === fullscreenCamId);
          if (!selectedCam) return null;
          const isDemoTarget = isDemoActive && (selectedCam.id === demoCameraId || selectedCam.id === 9999 || (selectedCam.id === 4 && demoCameraId === 4));
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 animate-fade-in font-mono">
              <div className="bg-[#060b13] border-2 border-sky-500 rounded-xl p-5 w-full max-w-5xl h-[640px] flex flex-col shadow-glow-cyan relative z-50">
                
                <div className="flex justify-between items-center mb-3 border-b border-surveillance-border pb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="font-bold text-white uppercase text-sm">{selectedCam.name}</span>
                    <span className="text-xs text-sky-400">({selectedCam.location})</span>
                  </div>
                  <button 
                    onClick={() => setFullscreenCamId(null)}
                    className="flex items-center space-x-1.5 bg-slate-900 border border-surveillance-border hover:border-white text-white px-3 py-1.5 rounded cursor-pointer transition-all text-xs font-bold"
                  >
                    <Minimize2 className="h-4 w-4" />
                    <span>{t('close_stream_focus')}</span>
                  </button>
                </div>

                <div className="flex-1 w-full relative rounded overflow-hidden border border-slate-800">
                  <SimulatedCCTVStream camera={selectedCam} isCriticalMock={isDemoTarget} isDemoActive={isDemoActive} demoStep={demoStep} />
                </div>
                
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}

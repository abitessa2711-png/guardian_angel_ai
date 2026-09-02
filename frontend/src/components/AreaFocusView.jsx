import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SimulatedCCTVStream } from './CCTVGrid';
import { 
  Camera, 
  ShieldAlert, 
  Award, 
  FileText, 
  AlertOctagon, 
  Volume2, 
  Shield, 
  Play, 
  Square, 
  Circle, 
  VideoOff, 
  Eye, 
  Truck, 
  CheckSquare, 
  ShieldCheck,
  HardHat,
  Thermometer,
  Wind,
  Users,
  Flame,
  Activity
} from 'lucide-react';

export default function AreaFocusView({ 
  cameras = [], 
  isDemoActive = false, 
  demoStep = 0, 
  demoCameraId = null,
  displayAlerts = [],
  displayIncidents = [],
  getAuthHeaders,
  apiBase,
  loadDashboardData
}) {
  const { language, t } = useLanguage();

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

  const [selectedCamId, setSelectedCamId] = useState(4);
  const activeCam = displayCameras.find(c => c.id === selectedCamId) || displayCameras[0];
  const isDemoTarget = isDemoActive && (activeCam.id === demoCameraId || activeCam.id === 9999 || (activeCam.id === 4 && demoCameraId === 4));

  const [fps, setFps] = useState(24.5);
  const [latency, setLatency] = useState(38);
  const [logs, setLogs] = useState([
    '[11:46:12] Initialized AI Safety Vision Engine - Safe External Camera Feed',
    '[11:46:15] Optical keypoint pose detector model locked (YOLOv8-Pose)',
    '[11:46:18] Telemetry sync established: Ambient Temp 33.2°C, Gas 120 PPM'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(+(23.5 + Math.random() * 1.5).toFixed(1));
      setLatency(Math.floor(32 + Math.random() * 12));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = async (alertId) => {
    try {
      if (!apiBase) return;
      await fetch(`${apiBase}/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders ? getAuthHeaders() : {}
      });
      if (loadDashboardData) loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEscalateAlert = async (alertId) => {
    try {
      if (!apiBase) return;
      await fetch(`${apiBase}/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: getAuthHeaders ? getAuthHeaders() : {}
      });
      if (loadDashboardData) loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const activeAlert = displayAlerts.find(a => a.camera_id === activeCam.id && a.status !== 'Resolved');

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Selector Header */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-3 shadow-cmd">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase flex items-center space-x-2">
            <Eye className="h-5 w-5 text-sky-400" />
            <span>{t('ai_vision')} & Zone Focus Analyzer</span>
          </h3>
          <p className="text-2xs text-slate-400 mt-0.5">
            Granular Worker Pose Estimation, Antistatic PPE Verification & Thermal Hotspot Scanner
          </p>
        </div>
        
        {/* Dropdown Selector */}
        <div className="flex items-center space-x-2 text-2xs">
          <span className="text-slate-400 uppercase">{t('selected_feed')}:</span>
          <select 
            value={selectedCamId} 
            onChange={(e) => setSelectedCamId(parseInt(e.target.value))}
            className="bg-slate-900 border border-slate-700 text-white px-3 py-1.5 rounded focus:outline-none focus:border-sky-400 text-2xs cursor-pointer font-bold"
          >
            {displayCameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.status === 'Offline' ? `(${t('offline')})` : `(${t('active_caps')})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Camera Node Selector (3 cols) */}
        <div className="lg:col-span-3 bg-surveillance-panel border border-surveillance-border rounded-lg p-3.5 flex flex-col h-[560px] overflow-hidden shadow-cmd">
          <p className="text-2xs text-slate-400 uppercase font-bold border-b border-surveillance-border pb-2 mb-2">
            {t('select_camera')}
          </p>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {displayCameras.map((c) => {
              const isActive = c.id === selectedCamId;
              const isAlerting = isDemoActive && c.id === 4 && demoStep >= 5;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCamId(c.id)}
                  className={`w-full text-left px-2.5 py-2 rounded border transition-all cursor-pointer flex flex-col ${
                    isActive 
                      ? 'bg-sky-500/15 border-sky-400 text-sky-400 font-bold shadow-sm' 
                      : isAlerting
                      ? 'border-red-500 bg-red-500/10 animate-pulse text-red-400'
                      : 'border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-bold block truncate uppercase">{c.name}</span>
                  <span className="text-[7px] text-slate-400 mt-0.5 truncate uppercase">{c.location}</span>
                  <span className="flex items-center space-x-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Offline' ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`}></span>
                    <span className="text-[7px] text-slate-400 uppercase font-mono">
                      {c.status === 'Offline' ? t('offline') : t('active_caps')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Large CCTV Stream (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          
          <div className={`relative aspect-video bg-black rounded-lg overflow-hidden border-2 flex items-center justify-center transition-all ${
            activeCam.status === 'Offline'
              ? 'border-red-500/30'
              : isDemoTarget
              ? 'border-red-500 shadow-glow-red animate-pulse-red'
              : 'border-sky-500/80 shadow-glow-cyan'
          }`}>
            {activeCam.status === 'Offline' ? (
              <div className="text-center font-mono text-xs text-red-500/60 p-6">
                <VideoOff className="h-12 w-12 mx-auto mb-3 text-red-500/40" />
                <p className="font-bold uppercase">{t('node_status_offline')}</p>
                <p className="text-2xs uppercase text-slate-500 mt-1">{activeCam.location}</p>
              </div>
            ) : (
              <div className="w-full h-full p-0.5 relative">
                <SimulatedCCTVStream camera={activeCam} isCriticalMock={isDemoTarget} isDemoActive={isDemoActive} demoStep={demoStep} />
              </div>
            )}
          </div>

          {/* Quick Telemetry Bar */}
          <div className="bg-surveillance-panel border border-surveillance-border p-3 rounded-lg flex justify-between items-center text-2xs shadow-cmd">
            <div>
              <p className="font-bold text-white uppercase">{activeCam.name}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{activeCam.location}</p>
            </div>
            
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-slate-400">FPS: <strong className="text-emerald-400">{fps}</strong></span>
              <span className="text-slate-400 border-l border-slate-700 pl-2">Latency: <strong className="text-sky-400">{latency}ms</strong></span>
            </div>
          </div>

          {/* Live Incident & Threat Console Logs */}
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-3 flex-1 h-[140px] flex flex-col overflow-hidden shadow-cmd">
            <p className="text-[10px] text-slate-400 uppercase font-bold border-b border-surveillance-border pb-1 mb-1.5 shrink-0 flex items-center justify-between">
              <span>{t('threat_console')}</span>
              <span className="text-emerald-400">SYNC ACTIVE</span>
            </p>
            <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-mono pr-1 text-slate-300">
              {logs.map((log, idx) => (
                <p key={idx} className="text-slate-300">{log}</p>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Cognitive Detection Status (3 cols) */}
        <div className="lg:col-span-3 bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex flex-col justify-between shadow-cmd space-y-3">
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase border-b border-surveillance-border pb-2 mb-3">
              {t('ai_object_detection_status')}
            </h4>

            <div className="space-y-2.5 text-2xs">
              
              {/* 1. Worker Detection */}
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300">{t('person_detection')}</span>
                </div>
                <span className="font-bold text-emerald-400">{t('detected')}</span>
              </div>

              {/* 2. Antistatic PPE Verification */}
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HardHat className="h-4 w-4 text-sky-400" />
                  <span className="text-slate-300">ANTISTATIC PPE</span>
                </div>
                <span className="font-bold text-emerald-400">{t('locked')}</span>
              </div>

              {/* 3. Static Spark / Metallic Tool */}
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">{t('weapon_detection')}</span>
                </div>
                <span className="font-bold text-emerald-400">{t('safe_clear')}</span>
              </div>

              {/* 4. Optical Smoke / Thermal Anomaly */}
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-red-400" />
                  <span className="text-slate-300">{t('smoke_fire_engine')}</span>
                </div>
                <span className={`font-bold ${isDemoTarget && demoStep >= 5 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                  {isDemoTarget && demoStep >= 5 ? t('fire_alert') : t('clear')}
                </span>
              </div>

              {/* 5. Restricted Barrier Breach */}
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">RESTRICTED BARRIER</span>
                </div>
                <span className="font-bold text-emerald-400">{t('safe_clear')}</span>
              </div>

            </div>
          </div>

          {/* AI Target Lock Confidence Rating */}
          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-2xs">
            <div className="flex justify-between items-center mb-1 font-bold">
              <span className="text-white">{t('ai_target_lock')}</span>
              <span className="text-sky-400">98.4%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: '98.4%' }}></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

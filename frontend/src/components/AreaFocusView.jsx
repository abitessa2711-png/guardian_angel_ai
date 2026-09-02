import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SimulatedCCTVStream } from './CCTVGrid';
import { Camera, ShieldAlert, Award, FileText, AlertOctagon, Volume2, Shield, Play, Square, Circle, VideoOff, Eye, Truck, CheckSquare, ShieldCheck } from 'lucide-react';

export default function AreaFocusView({ 
  cameras, 
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

  // Load the list of 16 cameras (including dynamic mocks)
  const displayCameras = [...cameras];
  const mockNames = [
    "CCTV-01 CHATRAM_BUS_STAND",
    "CCTV-02 CENTRAL_BUS_STAND",
    "CCTV-03 RAILWAY_JUNCTION",
    "CCTV-04 ROCKFORT_TEMPLE_ROAD",
    "CCTV-05 SRIRANGAM_TEMPLE",
    "CCTV-06 NIT_TRICHY",
    "CCTV-07 LALGUDI_SUBWAY",
    "CCTV-08 THILLAI_NAGAR",
    "CCTV-09 WORAIYUR_BAZAAR",
    "CCTV-10 KK_NAGAR_JNC",
    "CCTV-11 THENNUR_CROSS",
    "CCTV-12 MAIN_GUARD_GATE",
    "CCTV-13 ROCKFORT_BAZAAR",
    "CCTV-14 GANDHI_MARKET",
    "CCTV-15 CHINTAMANI_JNC",
    "CCTV-16 PALAKKARAI_CROSS"
  ];
  const mockLocations = [
    "Chatram Bus Stand Outer Gates",
    "Central Bus Terminal Platform 1 Gate",
    "Trichy Railway Junction Entrance",
    "Rockfort Temple Bazaar Street",
    "Srirangam Temple Entrance",
    "NIT Trichy Highway Gate",
    "Lalgudi Junction Subway",
    "Thillai Nagar Main Cross",
    "Woraiyur Bazaar Road",
    "KK Nagar Circle Road",
    "Thennur High Road Crossing",
    "Main Guard Gate Entrance",
    "Rockfort Shopping Arch",
    "Gandhi Market Wholesale Gate",
    "Chintamani Junction",
    "Palakkarai Cross Road"
  ];

  while (displayCameras.length < 16) {
    const idx = displayCameras.length;
    displayCameras.push({
      id: 1000 + idx,
      name: mockNames[idx] || `CCTV-${idx + 1} MOCK_NODE`,
      location: mockLocations[idx] || `Location ${idx + 1}`,
      rtsp_url: `rtsp://192.168.1.${101 + idx}/stream1`,
      status: idx === 5 || idx === 15 ? 'Offline' : 'Active', // Mock two offline nodes
      latitude: 10.79 + (Math.random() - 0.5) * 0.1,
      longitude: 78.69 + (Math.random() - 0.5) * 0.1
    });
  }

  const [selectedCamId, setSelectedCamId] = useState(displayCameras[0]?.id || 1);
  const activeCam = displayCameras.find(c => c.id === selectedCamId) || displayCameras[0];

  // Derived state to check if the current selected camera is the alert/demo target
  const isDemoTarget = isDemoActive && (activeCam.id === demoCameraId || activeCam.id === 9999 || (activeCam.id === 4 && demoCameraId === 4));

  // Simulating live object detections
  const [detections, setDetections] = useState({
    person: true,
    vehicle: true,
    face: true,
    weapon: false,
    fight: false,
    smoke: false,
    fire: false,
    abandoned: false,
    confidence: 94
  });

  // Logs state specific to the active camera
  const [logs, setLogs] = useState([]);

  // Adjust detections and logs based on selected camera and demo steps
  useEffect(() => {
    if (activeCam.status === 'Offline') {
      setDetections({
        person: false,
        vehicle: false,
        face: false,
        weapon: false,
        fight: false,
        smoke: false,
        fire: false,
        abandoned: false,
        confidence: 0
      });
      setLogs([
        `[${new Date().toLocaleTimeString()}] [WARN] NODE CONNECTION LOST. RETRYING IN 5S...`,
        `[${new Date().toLocaleTimeString()}] [ERROR] RTSP STREAM SOURCE REFUSED ACCESS.`
      ]);
      return;
    }

    if (isDemoTarget) {
      // Demo step transitions
      const isFight = demoStep >= 9;
      const isScream = demoStep >= 7;
      const isFollow = demoStep >= 3;
      const confidence = demoStep === 0 ? 94 : 85 + Math.floor(Math.random() * 11);

      setDetections({
        person: true,
        vehicle: demoStep < 3,
        face: true,
        weapon: false,
        fight: isFight,
        smoke: false,
        fire: false,
        abandoned: false,
        confidence
      });

      // Populate console logs based on demo step
      const demoLogs = [
        `[${new Date().toLocaleTimeString()}] [INFO] AI COGNITIVE CORE INITIALIZED FOR AREA FOCUS.`,
        `[${new Date().toLocaleTimeString()}] [ANALYSIS] YOLO KEYPOINT KEY-PATH EXTENDED.`
      ];

      if (isFollow) {
        demoLogs.unshift(`[${new Date().toLocaleTimeString()}] [WARN] SPATIO-TEMPORAL PROXIMITY ALERT: Suspect ID_02 within 1.0m of Target ID_01.`);
      }
      if (isScream) {
        demoLogs.unshift(`[${new Date().toLocaleTimeString()}] [CRITICAL] ACOUSTIC LOG: Scream amplitude spike recorded (89 dB).`);
      }
      if (isFight) {
        demoLogs.unshift(`[${new Date().toLocaleTimeString()}] [EMERGENCY] POSE ANALYSIS: Physical fight/struggle interaction vector locked.`);
      }
      if (demoStep >= 10) {
        demoLogs.unshift(`[${new Date().toLocaleTimeString()}] [DISPATCH] ALARM BROADCASTED: Nearest Patrol Unit dispatched.`);
      }

      setLogs(demoLogs);
    } else {
      // Standard active camera simulation
      setDetections({
        person: true,
        vehicle: !activeCam.name.includes('TEMPLE'),
        face: true,
        weapon: false,
        fight: false,
        smoke: false,
        fire: false,
        abandoned: false,
        confidence: 90 + Math.floor(Math.random() * 7)
      });
      setLogs([
        `[${new Date().toLocaleTimeString()}] [INFO] Stream synchronized at 30 FPS.`,
        `[${new Date().toLocaleTimeString()}] [INFO] Bounding box locks: PERSON (1), FACE (1).`,
        `[${new Date().toLocaleTimeString()}] [INFO] Environmental sensor index clear.`
      ]);
    }
  }, [selectedCamId, demoStep, isDemoActive, isDemoTarget]);

  // Command handlers
  const handleResolveAlert = async (alertId) => {
    try {
      const response = await fetch(`${apiBase}/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        loadDashboardData();
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] [INFO] ALERT RESOLVED BY OPERATOR`, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEscalateAlert = async (alertId) => {
    try {
      const response = await fetch(`${apiBase}/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (response.ok) {
        loadDashboardData();
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] [WARN] ALERT ESCALATED TO INCIDENT STATUS`, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Find alerts relating to the active camera
  const activeAlert = displayAlerts.find(a => a.camera_id === activeCam.id && a.status !== 'Resolved');

  return (
    <div className="space-y-6 font-mono text-white select-none">
      
      {/* Selector Header */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xs font-bold tracking-widest text-surveillance-accent uppercase">
            {t('area_focus')}
          </h3>
          <p className="text-3xs text-surveillance-textMuted mt-0.5">
            {t('focus_analyzer')}
          </p>
        </div>
        
        {/* Dropdown Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-surveillance-textMuted uppercase">{t('selected_feed')}:</span>
          <select 
            value={selectedCamId} 
            onChange={(e) => setSelectedCamId(parseInt(e.target.value))}
            className="bg-surveillance-header border border-surveillance-border text-white px-3 py-2 rounded focus:outline-none focus:border-surveillance-accent text-xs"
          >
            {displayCameras.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.status === 'Offline' ? `(${t('offline')})` : `(${t('active_caps')})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left selector menu (3 cols) */}
        <div className="lg:col-span-3 bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex flex-col h-[520px] overflow-hidden">
          <p className="text-4xs text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-2 mb-3">
            {t('select_camera')}
          </p>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {displayCameras.map((c) => {
              const isActive = c.id === selectedCamId;
              const isAlerting = isDemoActive && c.id === 4 && demoStep >= 10;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCamId(c.id)}
                  className={`w-full text-left px-3 py-2 rounded border transition-all cursor-pointer flex flex-col ${
                    isActive 
                      ? 'bg-surveillance-accent/15 border-surveillance-accent shadow-[0_0_8px_rgba(0,255,102,0.15)]' 
                      : isAlerting
                      ? 'border-surveillance-danger bg-surveillance-danger/10 animate-pulse text-red-400'
                      : 'border-surveillance-border/50 hover:border-white text-slate-300'
                  }`}
                >
                  <span className="text-[9px] font-bold block truncate uppercase">{c.name.replace('CCTV-', 'CAM ')}</span>
                  <span className="text-[7px] text-surveillance-textMuted mt-0.5 truncate uppercase">{c.location}</span>
                  <span className="flex items-center space-x-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Offline' ? 'bg-red-500' : 'bg-surveillance-accent animate-pulse'}`}></span>
                    <span className="text-[6px] text-surveillance-textMuted uppercase">
                      {c.status === 'Offline' ? t('offline') : t('active_caps')}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Large Live View (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          
          <div className={`relative aspect-video bg-black rounded-lg overflow-hidden border-2 flex items-center justify-center transition-all ${
            activeCam.status === 'Offline'
              ? 'border-red-500/30'
              : isDemoTarget
              ? 'border-surveillance-danger shadow-glow-red animate-pulse-red'
              : 'border-surveillance-accent shadow-glow-cyan'
          }`}>
            {activeCam.status === 'Offline' ? (
              <div className="text-center font-mono text-xs text-red-500/60 p-6">
                <VideoOff className="h-12 w-12 mx-auto mb-3 text-red-500/40" />
                <p className="font-bold uppercase">{t('node_status_offline')}</p>
                <p className="text-3xs uppercase text-slate-500 mt-1">{activeCam.location}</p>
              </div>
            ) : (
              <div className="w-full h-full p-0.5 relative">
                <SimulatedCCTVStream camera={activeCam} isCriticalMock={isDemoTarget} isDemoActive={isDemoActive} demoStep={demoStep} />
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          {activeCam.status === 'Active' && (
            <div className="bg-surveillance-panel border border-surveillance-border p-3.5 rounded-lg flex justify-between items-center font-sans">
              <div>
                <p className="text-2xs font-bold text-white uppercase">{t('focused_feed')}</p>
                <p className="text-3xs text-surveillance-textMuted uppercase mt-0.5 font-mono">{activeCam.location}</p>
              </div>
              
              <div className="flex space-x-2 font-mono">
                {activeAlert && activeAlert.status === 'New' && (
                  <>
                    <button 
                      onClick={() => handleResolveAlert(activeAlert.id)}
                      className="px-3 py-1.5 bg-emerald-500 text-black font-bold hover:bg-emerald-600 rounded cursor-pointer transition-all text-3xs"
                    >
                      {t('resolve').toUpperCase()}
                    </button>
                    <button 
                      onClick={() => handleEscalateAlert(activeAlert.id)}
                      className="px-3 py-1.5 bg-surveillance-danger text-white font-bold hover:bg-red-600 rounded cursor-pointer transition-all text-3xs shadow-glow-red"
                    >
                      {t('escalate').toUpperCase()}
                    </button>
                  </>
                )}
                {activeAlert && activeAlert.status === 'Escalated' && (
                  <span className="text-surveillance-danger font-black text-3xs border border-surveillance-danger/30 bg-surveillance-danger/10 px-3 py-1.5 rounded animate-pulse uppercase">
                    {t('escalated')}
                  </span>
                )}
                {!activeAlert && (
                  <span className="text-surveillance-accent font-black text-3xs border border-surveillance-accent/30 bg-surveillance-accent/10 px-3 py-1.5 rounded uppercase">
                    {t('secure')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Live Console Logs */}
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex-1 h-[140px] flex flex-col overflow-hidden">
            <p className="text-4xs text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-1.5 mb-2 shrink-0">
              {t('threat_console')}
            </p>
            <div className="flex-1 overflow-y-auto space-y-1 text-3xs leading-relaxed font-mono pr-1 text-slate-300">
              {logs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.includes('[ERROR]') || log.includes('[CRITICAL]') || log.includes('[EMERGENCY]')) {
                  colorClass = 'text-red-400 font-bold';
                } else if (log.includes('[WARN]')) {
                  colorClass = 'text-amber-400';
                } else if (log.includes('[DISPATCH]')) {
                  colorClass = 'text-sky-400 font-black animate-pulse';
                } else if (log.includes('[INFO]')) {
                  colorClass = 'text-surveillance-accent';
                }
                return (
                  <div key={idx} className={colorClass}>
                    {log}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Panel: AI Detections Status (3 cols) */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 space-y-3.5 h-[520px] flex flex-col justify-between">
            <div className="space-y-3.5">
              <p className="text-4xs text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-2">
                {t('ai_object_detection_status')}
              </p>
              
              <div className="space-y-2 text-3xs">
                
                {/* Person */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('person_detection')}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    detections.person 
                      ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.person ? t('detected') : t('off')}
                  </span>
                </div>

                {/* Vehicle */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('vehicle_detection')}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    detections.vehicle 
                      ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.vehicle ? t('detected') : t('off')}
                  </span>
                </div>

                {/* Face ID */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('face_id_lock')}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                    detections.face 
                      ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.face ? t('locked') : t('off')}
                  </span>
                </div>

                {/* Weapon */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('weapon_detection')}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    detections.weapon 
                      ? 'bg-surveillance-danger/10 border-surveillance-danger text-surveillance-danger animate-pulse-red font-black' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.weapon ? t('weapon_alert') : t('safe_clear')}
                  </span>
                </div>

                {/* Violence */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('fight_recognition')}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    detections.fight 
                      ? 'bg-surveillance-danger/10 border-surveillance-danger text-surveillance-danger animate-pulse-red font-black shadow-glow-red' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.fight ? t('violence_alert') : t('safe_clear')}
                  </span>
                </div>

                {/* Fire */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('smoke_fire_engine')}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    detections.fire 
                      ? 'bg-surveillance-danger/15 border-surveillance-danger text-surveillance-danger' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.fire ? t('fire_alert') : t('safe_clear')}
                  </span>
                </div>

                {/* Abandoned */}
                <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2 rounded">
                  <span className="font-bold text-[8px] uppercase">{t('abandoned_object_finder')}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${
                    detections.abandoned 
                      ? 'bg-surveillance-warning/10 border-surveillance-warning text-surveillance-warning' 
                      : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                  }`}>
                    {detections.abandoned ? t('abandoned_alert') : t('clear')}
                  </span>
                </div>

              </div>
            </div>

            {/* Combined Confidence Gauge */}
            <div className="bg-surveillance-header border border-surveillance-border p-3.5 rounded flex items-center justify-between mt-2">
              <div>
                <p className="text-[7px] text-surveillance-textMuted uppercase font-bold">{t('decision_engine')}</p>
                <p className="text-3xs font-bold text-white uppercase">{t('ai_target_lock')}</p>
              </div>
              <div className="w-11 h-11 rounded-full flex flex-col items-center justify-center border border-surveillance-accent/40 bg-surveillance-panel text-white font-bold shrink-0">
                <span className="text-2xs font-black font-mono leading-none">{detections.confidence}%</span>
                <span className="text-[5px] uppercase tracking-tighter leading-none mt-0.5">{t('confidence')}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

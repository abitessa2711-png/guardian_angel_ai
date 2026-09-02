import React, { useState, useEffect } from 'react';
import { Camera, Video, ShieldAlert, Award, FileText, AlertOctagon, Volume2, Shield, Play, Square, Circle } from 'lucide-react';
import SimulatedCCTVStream from './CCTVGrid'; // We will import from CCTVGrid's simulated stream block

export default function LiveSurveillanceView({ cameras }) {
  const [selectedCamId, setSelectedCamId] = useState(cameras[0]?.id || 1);
  const [isRecording, setIsRecording] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const activeCam = cameras.find(c => c.id === selectedCamId) || cameras[0] || {
    id: 1, name: 'CCTV-01 CHATRAM_BUS_STAND', location: 'Chatram Bus Stand Outer Gates', status: 'Active', latitude: 10.8291, longitude: 78.6974
  };

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

  // Event timeline logs
  const [logs, setLogs] = useState([
    { time: '19:42:01', event: 'Spatio-Temporal Tracking Lock: Target ID_01 (Female) spotted.' },
    { time: '19:43:40', event: 'Spatio-Temporal Tracking Lock: Suspect ID_02 (Male) spotted.' },
    { time: '19:44:15', event: 'Proactive proximity delta warnings locked (<1.2 meters).' },
    { time: '19:46:32', event: 'Low crowd index spatial warning: Less than 3 bystanders nearby.' },
  ]);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Adjust detections based on selected camera for realism
  useEffect(() => {
    if (activeCam.name.includes('ROCKFORT')) {
      setDetections({
        person: true,
        vehicle: false,
        face: true,
        weapon: false,
        fight: true, // Rockfort is our demo timeline
        smoke: false,
        fire: false,
        abandoned: false,
        confidence: 95
      });
      // Add log
      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), event: 'Threat Engine: Combined Multi-Sensor score escalated to CRITICAL.' },
        ...prev
      ]);
    } else {
      setDetections({
        person: true,
        vehicle: true,
        face: true,
        weapon: false,
        fight: false,
        smoke: false,
        fire: false,
        abandoned: false,
        confidence: 42 + Math.floor(Math.random() * 20)
      });
    }
  }, [selectedCamId]);

  const triggerSnapshot = () => {
    setSnapshotSuccess(true);
    setTimeout(() => setSnapshotSuccess(false), 3000);
  };

  const triggerEmergency = () => {
    alert(`🚨 CRITICAL EMERGENCY ALERT SENT to nearest Patrol unit from ${activeCam.location}!`);
    setLogs(prev => [
      { time: new Date().toLocaleTimeString(), event: `🚨 EMERGENCY POLICE PATROL DISpatched to ${activeCam.location}` },
      ...prev
    ]);
  };

  return (
    <div className="space-y-6 font-mono select-none text-white">
      
      {/* Top Selector header */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-sm font-bold tracking-widest text-surveillance-accent uppercase">
            SCREEN 3: LIVE SURVEILLANCE & TARGET ANALYSIS
          </h3>
          <p className="text-3xs text-surveillance-textMuted mt-0.5">FOCUS ANALYZER / live object bounding locks</p>
        </div>
        
        {/* Selector Dropdown */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-surveillance-textMuted uppercase">SELECTED FEED:</span>
          <select 
            value={selectedCamId} 
            onChange={(e) => setSelectedCamId(parseInt(e.target.value))}
            className="bg-surveillance-header border border-surveillance-border text-white px-3 py-2 rounded focus:outline-none focus:border-surveillance-accent"
          >
            {cameras.filter(c => c.status === 'Active').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Large live video grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="relative aspect-video bg-black border border-surveillance-border rounded-lg overflow-hidden flex items-center justify-center">
            {/* Live indicator overlay */}
            <div className="absolute top-3 left-3 z-20 bg-black/60 border border-white/10 px-2 py-1 rounded text-4xs font-bold uppercase tracking-widest flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-red-500">STREAMING ACTIVE</span>
            </div>

            <div className="absolute top-3 right-3 z-20 bg-black/60 border border-white/10 px-2 py-1 rounded text-4xs font-bold font-mono">
              FPS: 30.0 | LATENCY: 12ms
            </div>

            {/* Simulated target overlay stream */}
            <div className="w-full h-full p-2 relative">
              {/* Scanline CRT simulation */}
              <div className="absolute inset-0 surveillance-monitor pointer-events-none z-10"></div>
              <div className="absolute inset-0 surveillance-grid opacity-10 pointer-events-none"></div>
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Target boxes */}
                {detections.person && (
                  <>
                    <rect x="35" y="38" width="8" height="15" fill="none" stroke="#529e31" strokeWidth="0.3" />
                    <text x="35" y="37" fill="#8cc63f" fontSize="2" fontWeight="bold">TARGET_F (ID_01)</text>
                  </>
                )}
                {detections.fight && (
                  <>
                    <rect x="46" y="39" width="10" height="16" fill="none" stroke="#ef4444" strokeWidth="0.4" className="ai-bounding-box" />
                    <text x="46" y="38" fill="#ef4444" fontSize="2.2" fontWeight="bold">ALERT: FIGHT (ID_02)</text>
                    <line x1="43" y1="45" x2="46" y2="47" stroke="#ef4444" strokeWidth="0.3" strokeDasharray="1,1" />
                  </>
                )}
                {detections.vehicle && !detections.fight && (
                  <>
                    <rect x="68" y="48" width="18" height="12" fill="none" stroke="#8cc63f" strokeWidth="0.3" />
                    <text x="68" y="47" fill="#8cc63f" fontSize="2">VEHICLE_DISP (ID_56)</text>
                  </>
                )}
              </svg>
              
              <div className="absolute bottom-4 left-4 z-10 text-[9px] bg-black/60 p-2 rounded border border-white/5 space-y-0.5">
                <p className="text-white font-bold">{activeCam.name}</p>
                <p className="text-surveillance-textMuted uppercase">{activeCam.location}</p>
              </div>

              {isRecording && (
                <div className="absolute top-12 left-3 z-20 bg-red-500/20 border border-red-500 text-red-400 px-2 py-0.5 rounded text-[8px] font-bold animate-pulse uppercase">
                  ● REC 00:{recordingSeconds.toString().padStart(2, '0')}
                </div>
              )}

              {snapshotSuccess && (
                <div className="absolute top-12 right-3 z-20 bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-2.5 py-0.5 rounded text-[8px] font-bold animate-bounce uppercase">
                  ✓ SNAPSHOT ARCHIVED
                </div>
              )}
            </div>

          </div>

          {/* Action buttons (Bottom) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={triggerSnapshot}
              className="bg-surveillance-panel hover:bg-surveillance-header border border-surveillance-border text-white py-2.5 rounded text-3xs font-bold cursor-pointer transition-colors shadow-sm flex items-center justify-center space-x-1.5"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>TAKE SNAPSHOT</span>
            </button>

            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`border py-2.5 rounded text-3xs font-bold cursor-pointer transition-colors flex items-center justify-center space-x-1.5 ${
                isRecording 
                  ? 'bg-red-500/10 border-red-500 text-red-400 animate-pulse' 
                  : 'bg-surveillance-panel border-surveillance-border text-white hover:bg-surveillance-header'
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>{isRecording ? 'STOP RECORDING' : 'START RECORDING'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="bg-surveillance-panel hover:bg-surveillance-header border border-surveillance-border text-white py-2.5 rounded text-3xs font-bold cursor-pointer transition-colors shadow-sm flex items-center justify-center space-x-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>GENERATE REPORT</span>
            </button>

            <button
              onClick={triggerEmergency}
              className="bg-surveillance-danger text-white py-2.5 rounded text-3xs font-black cursor-pointer shadow-glow-red hover:bg-red-600 transition-colors flex items-center justify-center space-x-1.5"
            >
              <AlertOctagon className="h-3.5 w-3.5" />
              <span>EMERGENCY ALERT</span>
            </button>
          </div>

          {/* Bottom Event logs timeline */}
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 space-y-2 flex-1">
            <p className="text-4xs text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-1.5">LIVE EVENT TELEMETRY LOGS</p>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex justify-between items-start text-4xs leading-normal">
                  <span className="text-surveillance-accent font-bold min-w-16">{log.time}</span>
                  <span className="text-slate-300 flex-1">{log.event}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: AI Detections list (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5 space-y-4">
            <p className="text-4xs text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-2">AI OBJECT COGNITIVE DETECTION STATUS</p>
            
            <div className="space-y-2.5 text-3xs">
              
              {/* Detector 1 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">PERSON DETECTION</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.person 
                    ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.person ? '🟢 DETECTED' : 'OFF'}
                </span>
              </div>

              {/* Detector 2 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">VEHICLE DETECTION</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.vehicle 
                    ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.vehicle ? '🟢 DETECTED' : 'OFF'}
                </span>
              </div>

              {/* Detector 3 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">FACE ID LOCK</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.face 
                    ? 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.face ? '🟢 LOCKED' : 'OFF'}
                </span>
              </div>

              {/* Detector 4 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">WEAPON DETECTION</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.weapon 
                    ? 'bg-surveillance-danger/10 border-surveillance-danger text-surveillance-danger animate-pulse-red font-black' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.weapon ? '🔴 WEAPON DETECTED' : '🟢 SAFE - CLEAR'}
                </span>
              </div>

              {/* Detector 5 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">FIGHT / STRUGGLE RECOGNITION</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.fight 
                    ? 'bg-surveillance-danger/10 border-surveillance-danger text-surveillance-danger animate-pulse-red font-black shadow-glow-red' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.fight ? '🔴 VIOLENCE DETECTED' : '🟢 SAFE - CLEAR'}
                </span>
              </div>

              {/* Detector 6 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">SMOKE &amp; FIRE ENGINE</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.fire 
                    ? 'bg-surveillance-danger/15 border-surveillance-danger text-surveillance-danger' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.fire ? '🔴 FIRE ALARM' : '🟢 SAFE - CLEAR'}
                </span>
              </div>

              {/* Detector 7 */}
              <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-2.5 rounded">
                <span className="font-bold">ABANDONED OBJECT FINDER</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold border ${
                  detections.abandoned 
                    ? 'bg-surveillance-warning/10 border-surveillance-warning text-surveillance-warning' 
                    : 'bg-surveillance-panel/60 border-surveillance-border text-surveillance-textMuted'
                }`}>
                  {detections.abandoned ? '🟡 DETECTED' : '🟢 CLEAR'}
                </span>
              </div>

            </div>

            {/* Combined Confidence Gauge */}
            <div className="bg-surveillance-header border border-surveillance-border p-4 rounded flex items-center justify-between mt-2">
              <div>
                <p className="text-4xs text-surveillance-textMuted uppercase font-bold">DECISION ENGINE</p>
                <p className="text-2xs font-bold text-white uppercase">AI TARGET LOCK CONFIDENCE</p>
              </div>
              <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center border border-surveillance-accent/40 bg-surveillance-panel text-white font-bold">
                <span className="text-sm font-black font-mono leading-none">{detections.confidence}%</span>
                <span className="text-[6px] uppercase tracking-tighter leading-none mt-0.5">CONF</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

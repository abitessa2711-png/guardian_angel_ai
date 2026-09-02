import React, { useState, useEffect } from 'react';
import { X, Play, ShieldAlert, ArrowRight, BrainCircuit, Activity } from 'lucide-react';

export default function ExplainableAIModal({ alert, isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSecs, setPlaybackSecs] = useState(0);
  const [activeLang, setActiveLang] = useState('en');

  // Reset play state when alert changes or modal closes
  useEffect(() => {
    setIsPlaying(false);
    setPlaybackSecs(0);
    setActiveLang('en');
  }, [alert, isOpen]);

  // Simulate video playback timers
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSecs(prev => (prev >= 12 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen || !alert) return null;

  const getScoreColor = (score) => {
    if (score >= 75) return 'bg-surveillance-danger';
    if (score >= 45) return 'bg-surveillance-warning text-black';
    return 'bg-surveillance-success';
  };

  const getScoreText = (score) => {
    if (score >= 75) return 'CRITICAL (HIGH RISK)';
    if (score >= 45) return 'ELEVATED (CAUTION)';
    return 'SAFE (MONITORING)';
  };

  // Coordinates mapping to simulate bounding box drawing on the playback viewport
  const getBBoxPos = (sec) => {
    const startX = 35;
    const endX = 48;
    const diff = endX - startX;
    const x1 = startX + (diff / 12) * sec;
    const x2 = x1 + 10 + Math.sin(sec * 1.5) * 2;
    return { x1, x2 };
  };

  const bbox = getBBoxPos(playbackSecs);

  // Joint definitions for mock pose estimation rendering
  const getPoseJoints = (x, y, scale = 1, sec = 0) => {
    const animVal = sec * 0.5;
    const head = { cx: x, cy: y - 5 * scale };
    const neck = { cx: x, cy: y - 3 * scale };
    const lShoulder = { cx: x - 2 * scale, cy: y - 2 * scale };
    const rShoulder = { cx: x + 2 * scale, cy: y - 2 * scale };
    const spine = { cx: x, cy: y };
    const lElbow = { cx: x - 3.5 * scale, cy: y + (Math.sin(animVal * 2) * 0.5) * scale };
    const rElbow = { cx: x + 3.5 * scale, cy: y + (Math.cos(animVal * 2) * 0.5) * scale };
    const lHip = { cx: x - 1.5 * scale, cy: y + 3 * scale };
    const rHip = { cx: x + 1.5 * scale, cy: y + 3 * scale };
    const lKnee = { cx: x - 2 * scale, cy: y + 7 * scale };
    const rKnee = { cx: x + 2 * scale, cy: y + 7 * scale };
    const lAnkle = { cx: x - 2.5 * scale, cy: y + 11 * scale };
    const rAnkle = { cx: x + 2.5 * scale, cy: y + 11 * scale };

    return {
      points: [head, neck, lShoulder, rShoulder, spine, lElbow, rElbow, lHip, rHip, lKnee, rKnee, lAnkle, rAnkle],
      limbs: [
        [head, neck],
        [neck, lShoulder], [neck, rShoulder],
        [lShoulder, lElbow], [rShoulder, rElbow],
        [neck, spine],
        [spine, lHip], [spine, rHip],
        [lHip, lKnee], [rHip, rKnee],
        [lKnee, lAnkle], [rKnee, rAnkle]
      ]
    };
  };

  const targetPose = getPoseJoints(bbox.x1, 48, 0.6, playbackSecs);
  const suspectPose = getPoseJoints(bbox.x2, 50, 0.7, playbackSecs);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg max-w-4xl w-full flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="bg-surveillance-header border-b border-surveillance-border px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <BrainCircuit className="h-5 w-5 text-surveillance-accent" />
            <div>
              <h2 className="text-sm font-bold tracking-wider text-white uppercase">
                EXPLAINABLE AI SURVEILLANCE REPORT (ALERT #{alert.id})
              </h2>
              <p className="text-3xs font-mono text-surveillance-textMuted uppercase">
                CAMERA: {alert.camera_name} | LOCATION: {alert.camera_location}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-surveillance-textMuted hover:text-white p-1 rounded hover:bg-surveillance-header cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Side: Video Evidence Player (5 cols) */}
          <div className="md:col-span-5 flex flex-col space-y-3">
            <h3 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase flex items-center space-x-1.5">
              <span>CCTV EVIDENCE VIDEO CLIP</span>
            </h3>
            
            <div className="relative aspect-video bg-slate-950 rounded border border-surveillance-border flex items-center justify-center overflow-hidden">
              {isPlaying ? (
                <div className="w-full h-full relative font-mono text-3xs text-white">
                  {/* Surveillance Graphics */}
                  <div className="absolute inset-0 surveillance-grid opacity-10"></div>
                  <div className="absolute top-2 left-2 bg-black/60 px-1.5 rounded">CAM_FEED_PLAYBACK</div>
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 px-1.5 rounded text-surveillance-accent">
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>00:00:{playbackSecs.toString().padStart(2, '0')}</span>
                  </div>

                  {/* Bounding Box Drawing overlays */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1={bbox.x1} y1="48" x2={bbox.x2} y2="50" stroke="#ef4444" strokeWidth="0.3" strokeDasharray="1,1" />
                    {/* Target */}
                    <rect x={bbox.x1 - 3.5} y="43" width="7" height="13" fill="none" stroke="#10b981" strokeWidth="0.25" />
                    <text x={bbox.x1 - 3.5} y="42.5" fill="#10b981" fontSize="1.8">DET_01 (F)</text>
                    {targetPose.limbs.map((limb, idx) => (
                      <line key={`tl-${idx}`} x1={limb[0].cx} y1={limb[0].cy} x2={limb[1].cx} y2={limb[1].cy} stroke="#10b981" strokeWidth="0.15" opacity="0.6" />
                    ))}
                    {targetPose.points.map((pt, idx) => (
                      <circle key={`tp-${idx}`} cx={pt.cx} cy={pt.cy} r="0.4" fill="#ffffff" opacity="0.8" />
                    ))}

                    {/* Suspect */}
                    <rect x={bbox.x2 - 4.5} y="44.5" width="9" height="14.5" fill="none" stroke="#ef4444" strokeWidth="0.3" className="ai-bounding-box" />
                    <text x={bbox.x2 - 4.5} y="44" fill="#ef4444" fontSize="1.8">SUSPECT</text>
                    {suspectPose.limbs.map((limb, idx) => (
                      <line key={`sl-${idx}`} x1={limb[0].cx} y1={limb[0].cy} x2={limb[1].cx} y2={limb[1].cy} stroke="#ef4444" strokeWidth="0.15" opacity="0.6" />
                    ))}
                    {suspectPose.points.map((pt, idx) => (
                      <circle key={`sp-${idx}`} cx={pt.cx} cy={pt.cy} r="0.4" fill="#ffffff" opacity="0.8" />
                    ))}
                  </svg>
                  
                  {/* CRT static scan lines */}
                  <div className="absolute inset-0 surveillance-monitor pointer-events-none"></div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <button 
                    onClick={() => setIsPlaying(true)}
                    className="bg-surveillance-danger text-white rounded-full p-4 hover:scale-105 transition-all cursor-pointer shadow-glow-red hover:bg-red-600 inline-block mb-3"
                  >
                    <Play className="h-6 w-6 fill-current" />
                  </button>
                  <p className="text-xs font-bold text-white uppercase font-mono">REPLAY SURVEILLANCE TIMELINE</p>
                  <p className="text-3xs text-surveillance-textMuted font-mono mt-1">INCIDENT CLIP RECORDING</p>
                </div>
              )}
            </div>

            <div className="bg-surveillance-header border border-surveillance-border p-3 rounded text-3xs font-mono text-surveillance-textMuted space-y-1.5">
              <p>FILE_NAME: {alert.evidence_clip_url || 'evidence_unresolved_clip.mp4'}</p>
              <p>ENCRYPTION: AES-256 GOVERNMENT SECURE</p>
              <p>METADATA: TARGET_GENDER_FEMALE | LOW_LIGHT_BOOST</p>
            </div>
          </div>

          {/* Right Side: AI Analytics Explainability (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* Risk Scores */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surveillance-border pb-2">
                <span className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted">BEHAVIORAL RISK ANALYSIS</span>
                <span className={`text-2xs font-mono px-2 py-0.5 rounded font-bold ${getScoreColor(alert.risk_score)} ${alert.risk_score >= 45 && alert.risk_score < 75 ? 'text-black' : 'text-white'}`}>
                  {getScoreText(alert.risk_score)}
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-3 font-mono">
                {/* Metric 1 */}
                <div>
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="text-white font-semibold">1. FOLLOWING BEHAVIOR SCORE</span>
                    <span className={alert.following_score >= 75 ? 'text-surveillance-danger' : alert.following_score >= 45 ? 'text-surveillance-warning' : 'text-surveillance-success'}>
                      {alert.following_score}%
                    </span>
                  </div>
                  <div className="h-2 bg-surveillance-header rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${getScoreColor(alert.following_score)}`} 
                      style={{ width: `${alert.following_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div>
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="text-white font-semibold">2. PROXIMITY RISK SCORE</span>
                    <span className={alert.proximity_score >= 75 ? 'text-surveillance-danger' : alert.proximity_score >= 45 ? 'text-surveillance-warning' : 'text-surveillance-success'}>
                      {alert.proximity_score}%
                    </span>
                  </div>
                  <div className="h-2 bg-surveillance-header rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${getScoreColor(alert.proximity_score)}`} 
                      style={{ width: `${alert.proximity_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div>
                  <div className="flex justify-between text-2xs mb-1">
                    <span className="text-white font-semibold">3. AGGRESSIVE MOVEMENT SCORE</span>
                    <span className={alert.aggression_score >= 75 ? 'text-surveillance-danger' : alert.aggression_score >= 45 ? 'text-surveillance-warning' : 'text-surveillance-success'}>
                      {alert.aggression_score}%
                    </span>
                  </div>
                  <div className="h-2 bg-surveillance-header rounded overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${getScoreColor(alert.aggression_score)}`} 
                      style={{ width: `${alert.aggression_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Combined Final Score */}
              <div className="p-4 bg-surveillance-header border border-surveillance-border rounded flex items-center justify-between">
                <div>
                  <p className="text-3xs font-mono text-surveillance-textMuted uppercase">WEIGHTED RISK COMBINATION</p>
                  <p className="text-sm font-bold text-white">FINAL SAFETY RISKS SCORE</p>
                </div>
                <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center border-2 border-white/10 ${getScoreColor(alert.risk_score)} ${alert.risk_score >= 45 && alert.risk_score < 75 ? 'text-black font-black' : 'text-white font-bold'}`}>
                  <span className="text-lg font-black font-mono leading-none">{alert.risk_score}</span>
                  <span className="text-5xs uppercase tracking-tighter leading-none mt-0.5">SCORE</span>
                </div>
              </div>
            </div>

            {/* AI Text explanation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-surveillance-border pb-1 mb-1">
                <h4 className="text-xs font-bold font-mono tracking-widest text-surveillance-textMuted uppercase">EXPLAINABLE AI COGNITIVE LOG</h4>
                <div className="flex space-x-1 border border-surveillance-border/50 rounded p-0.5 bg-surveillance-header">
                  <button 
                    onClick={() => setActiveLang('en')}
                    className={`px-2 py-0.5 rounded text-3xs font-mono transition-all cursor-pointer ${
                      activeLang === 'en' 
                        ? 'bg-surveillance-accent text-white font-bold' 
                        : 'text-surveillance-textMuted hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setActiveLang('ta')}
                    className={`px-2 py-0.5 rounded text-3xs font-mono transition-all cursor-pointer ${
                      activeLang === 'ta' 
                        ? 'bg-surveillance-accent text-white font-bold' 
                        : 'text-surveillance-textMuted hover:text-white'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>
              <div className="p-3 bg-surveillance-danger/5 border border-surveillance-danger/20 rounded font-mono text-2xs text-red-200 leading-relaxed min-h-[50px]">
                {activeLang === 'en' ? alert.explanation : (alert.explanation_ta || alert.explanation) || 'No safety explanation provided for this event.'}
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-surveillance-header border-t border-surveillance-border px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white px-5 py-2 rounded text-xs font-mono cursor-pointer transition-all"
          >
            DISMISS REPORT
          </button>
        </div>

      </div>
    </div>
  );
}

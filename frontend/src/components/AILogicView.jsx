import React, { useState } from 'react';
import { Brain, Volume2, ShieldAlert, Users, Compass, Eye, Zap, Shield, Play } from 'lucide-react';

export default function AILogicView() {
  const [activeModule, setActiveModule] = useState('following');

  const modules = [
    {
      id: 'following',
      name: 'Person Following Detection',
      icon: Eye,
      tech: ['YOLOv11', 'DeepSORT / ByteTrack', 'Kalman Filter', 'Tracking ID Association'],
      explanation: 'Continuously tracks targets and suspects in the camera viewport. Calculates path overlapping, walk speed matching, and distance convergence over space and time. If a suspect maintains a close proximity vector following the same target for longer than 30 minutes, it flags a proactive alert.',
      input: 'RGB Surveillance Stream, Bounding Box Coordinates, Pedestrian Paths',
      processing: 'Spatio-temporal intersection analysis, velocity correlation vectors, path coincidence scoring, Kalman trajectory predictions.',
      output: 'Suspect-Victim Association Vector, Proximity Delta, Following Timer (Mins)',
      criteria: 'Same suspect ID, same victim ID, distance < 1.5m maintained, walk path correlation > 85%, duration > 30 minutes.',
      alertType: 'FOLLOWING ALERT (HIGH RISK)'
    },
    {
      id: 'acoustic',
      name: 'Acoustic Threat Detection',
      icon: Volume2,
      tech: ['Whisper AI', 'YAMNet Classifier', 'MFCC Feature Extraction', 'Decibel thresholding'],
      explanation: 'Evaluates real-time audio streams integrated with CCTV microphones. Extracts Mel-Frequency Cepstral Coefficients (MFCCs) to classify ambient acoustics. Whisper processes voice recordings to flag distress keywords (screaming, shouting, crying, and verbal abuse).',
      input: 'Live Mic Audio Stream (PCM / Waveform)',
      processing: 'Spectrogram analysis, acoustic classification (screams, glass breaks, shouting), Whisper NLP transcription of high-decibel segments.',
      output: 'Decibel Level (dB), Audio Classification Label, Transcribed Distress Keywords',
      criteria: 'Amplitude > 85 dB, female distress voice spectrum profile, repeated high-pitch scream waveforms, aggressive male shouting patterns, abusive Tamil/English keywords.',
      alertType: 'VOICE THREAT ALERT (CRITICAL)'
    },
    {
      id: 'isolation',
      name: 'Isolation & Low-Light Detection',
      icon: Users,
      tech: ['Crowd Density Estimation', 'Light Intensity Histogram', 'Spatio-Temporal Density Analytics'],
      explanation: 'Scans the geographic camera environment to assess vulnerabilities. Analyzes ambient light levels and computes a real-time crowd index to identify isolated zones. A high-risk alert triggers when a target is detected in low-light environments with no bystanders.',
      input: 'H.264 Video Stream, Timestamp telemetry, Historical location incident logs',
      processing: 'Luminance histogram calculation, pedestrian indexing, crowd density ratio (people per 100m²), spatial risk weight mapping.',
      output: 'Light Intensity Percentage (%), Pedestrian Count, Location Risk Factor',
      criteria: 'Time of day: Night, light level < 25%, bystander index < 3 people within 100m² radius.',
      alertType: 'ISOLATION ALERT (CAUTION)'
    },
    {
      id: 'pose',
      name: 'Pose Estimation & Violence Classifier',
      icon: Brain,
      tech: ['YOLO Pose (Keypoints)', 'OpenPose Joint Tracking', 'LSTM Sequential Gesture Classifier'],
      explanation: 'Tracks 17 human skeletal keypoints in real time. Analyzes joint coordinate sequences over consecutive frames to classify aggressive physical movements such as grabbing, dragging, pushing, falling, and physical struggles.',
      input: 'Skeletal Keypoint coordinate arrays (x, y, confidence scores)',
      processing: 'Spatial joint relationship vectors, acceleration profile of limb nodes, temporal gesture sequence classification.',
      output: 'Aggressive Motion classification label, Action confidence rating (%)',
      criteria: 'Keypoint distance convergence indicating grabbing/pulling, rapid vertical deceleration (falling), erratic limb velocity (struggle).',
      alertType: 'VIOLENCE ALERT (CRITICAL)'
    }
  ];

  const selectedModule = modules.find(m => m.id === activeModule);

  return (
    <div className="space-y-6 font-mono select-none text-white">
      
      {/* Page Header */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
        <h3 className="text-sm font-bold tracking-widest text-surveillance-accent uppercase flex items-center space-x-2">
          <Brain className="h-5 w-5 text-surveillance-accent animate-pulse-cyan" />
          <span>AI INSPECTOR LOGIC & METHODOLOGY ENGINE</span>
        </h3>
        <p className="text-3xs text-surveillance-textMuted mt-1">
          UNDERLYING TECHNOLOGY, DETECTOR THRESHOLDS & DISPATCH STRATEGIES
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Module Selector & Tech Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4 space-y-2">
            <p className="text-2xs font-bold text-surveillance-textMuted uppercase border-b border-surveillance-border pb-2 mb-2">DETECTION MODULES</p>
            {modules.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded text-2xs font-bold transition-all text-left cursor-pointer border ${
                    isActive 
                      ? 'bg-surveillance-accent/15 border-surveillance-accent text-surveillance-accent' 
                      : 'bg-surveillance-header border-surveillance-border text-surveillance-textMuted hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* Technology Details Card */}
          <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5 space-y-4">
            <p className="text-2xs font-bold text-surveillance-textMuted uppercase border-b border-surveillance-border pb-2">ALGORITHM CORE TECH</p>
            <div className="flex flex-wrap gap-2">
              {selectedModule.tech.map((t, idx) => (
                <span key={idx} className="bg-surveillance-header border border-surveillance-border text-surveillance-accent px-2 py-1 rounded text-3xs font-bold">
                  {t}
                </span>
              ))}
            </div>
            <div className="p-3 bg-surveillance-danger/10 border border-surveillance-danger/25 rounded text-3xs text-red-300">
              <span className="font-bold block uppercase mb-1">⚠️ ESCALATION TRIGGER:</span>
              Produces an automatic <span className="font-black underline">{selectedModule.alertType}</span> if threshold criteria are reached.
            </div>
          </div>
        </div>

        {/* Right: Technical Explanation Sheet (8 cols) */}
        <div className="lg:col-span-8 bg-surveillance-panel border border-surveillance-border rounded-lg p-6 space-y-5">
          <div className="border-b border-surveillance-border pb-3 flex justify-between items-center">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Zap className="h-4 w-4 text-surveillance-accent animate-pulse" />
              <span>{selectedModule.name} Specification Sheet</span>
            </h4>
            <span className="bg-surveillance-accent/10 border border-surveillance-accent/30 text-surveillance-accent text-4xs font-bold px-2 py-0.5 rounded">
              MODULE ACTIVE
            </span>
          </div>

          <div className="space-y-4 text-2xs leading-relaxed">
            
            <div className="space-y-1">
              <span className="text-surveillance-textMuted font-bold uppercase tracking-wider block">1. Operational Explanation</span>
              <p className="text-white italic bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                "{selectedModule.explanation}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-surveillance-header/50 border border-surveillance-border p-3.5 rounded space-y-1.5">
                <span className="text-surveillance-accent font-bold uppercase tracking-wider block">▲ INPUT TELEMETRY</span>
                <p className="text-slate-300 text-3xs">{selectedModule.input}</p>
              </div>

              <div className="bg-surveillance-header/50 border border-surveillance-border p-3.5 rounded space-y-1.5">
                <span className="text-surveillance-accent font-bold uppercase tracking-wider block">⚙️ PROCESSING STAGE</span>
                <p className="text-slate-300 text-3xs">{selectedModule.processing}</p>
              </div>

              <div className="bg-surveillance-header/50 border border-surveillance-border p-3.5 rounded space-y-1.5">
                <span className="text-surveillance-accent font-bold uppercase tracking-wider block">▼ OUTPUT CHANNELS</span>
                <p className="text-slate-300 text-3xs">{selectedModule.output}</p>
              </div>

              <div className="bg-surveillance-danger/5 border border-surveillance-danger/25 p-3.5 rounded space-y-1.5">
                <span className="text-surveillance-danger font-bold uppercase tracking-wider block">🎯 THRESHOLD CRITERIA</span>
                <p className="text-red-200 text-3xs">{selectedModule.criteria}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Decision Engine Workflow Section */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-6 space-y-6">
        <div className="border-b border-surveillance-border pb-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center space-x-2">
            <Shield className="h-4 w-4 text-surveillance-accent animate-pulse" />
            <span>FINAL COGNITIVE DECISION ENGINE WORKFLOW</span>
          </h4>
          <p className="text-3xs text-surveillance-textMuted mt-0.5">COGNITIVE FUSION: COMBINING BEHAVIOR, ACOUSTICS, ISOLATION & ACTION ALGORITHMS</p>
        </div>

        {/* Animated Workflow Map */}
        <div className="bg-[#030712] border border-surveillance-border rounded p-6 flex flex-col justify-center items-center relative overflow-hidden">
          
          {/* Scanlines overlay */}
          <div className="absolute inset-0 surveillance-monitor pointer-events-none opacity-40"></div>
          
          <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            {/* Column 1: Input Detectors */}
            <div className="space-y-2 flex flex-col justify-center">
              <div className="p-2.5 bg-surveillance-header border border-surveillance-border text-center rounded text-3xs text-surveillance-accent font-bold shadow-sm">
                PERSON FOLLOWING
              </div>
              <div className="p-2.5 bg-surveillance-header border border-surveillance-border text-center rounded text-3xs text-surveillance-accent font-bold shadow-sm">
                ACOUSTIC SCREAM
              </div>
              <div className="p-2.5 bg-surveillance-header border border-surveillance-border text-center rounded text-3xs text-surveillance-accent font-bold shadow-sm">
                ISOLATION DENSITY
              </div>
              <div className="p-2.5 bg-surveillance-header border border-surveillance-border text-center rounded text-3xs text-surveillance-accent font-bold shadow-sm">
                POSE VIOLENCE
              </div>
            </div>

            {/* Arrow Column 1 */}
            <div className="hidden md:flex flex-col items-center text-surveillance-accent font-bold">
              <span className="text-xs animate-pulse">&rarr;</span>
              <span className="text-5xs text-surveillance-textMuted uppercase pt-1">COGNITIVE FLOW</span>
            </div>

            {/* Column 2: Fusion Threat Engine */}
            <div className="bg-surveillance-header border border-surveillance-accent/40 rounded p-4 text-center space-y-2 relative shadow-glow-cyan">
              <div className="w-1.5 h-1.5 bg-surveillance-accent rounded-full absolute top-2 right-2 animate-ping"></div>
              <p className="text-2xs font-bold text-white uppercase">THREAT SCORE ENGINE</p>
              <p className="text-4xs text-surveillance-textMuted uppercase">WEIGHTED PROBABILISTIC LOGISTIC REGRESSION FUSION</p>
              <div className="h-1 bg-surveillance-accent rounded w-3/4 mx-auto animate-pulse"></div>
            </div>

            {/* Arrow Column 2 */}
            <div className="hidden md:flex flex-col items-center text-surveillance-danger font-bold">
              <span className="text-xs animate-pulse">&rarr;</span>
              <span className="text-5xs text-surveillance-textMuted uppercase pt-1">SCORE &gt; 75%</span>
            </div>

            {/* Column 3: Response Dispatch */}
            <div className="bg-surveillance-danger/10 border border-surveillance-danger/40 rounded p-4 text-center space-y-2 relative shadow-glow-red">
              <div className="w-1.5 h-1.5 bg-surveillance-danger rounded-full absolute top-2 right-2 animate-pulse"></div>
              <p className="text-2xs font-bold text-red-400 uppercase">POLICE DISPATCH UNIT</p>
              <p className="text-4xs text-slate-300 uppercase">AUTOMATED ROUTING &amp; EMERGENCY NOTIFICATION TRIGGER</p>
              <div className="h-1 bg-surveillance-danger rounded w-3/4 mx-auto animate-pulse"></div>
            </div>

          </div>

          <div className="w-full max-w-4xl border-t border-surveillance-border/50 mt-6 pt-4 text-center text-3xs text-surveillance-textMuted uppercase">
            POLICE DESK ESCALATION PRIORITY ROUTE LOCKED. MINIMUM OVERALL DELAY INTERVAL: &lt;1.8s
          </div>
        </div>

      </div>

    </div>
  );
}

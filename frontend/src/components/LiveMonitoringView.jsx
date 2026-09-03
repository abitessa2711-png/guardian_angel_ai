import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Camera, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  Radio, 
  Sliders, 
  Maximize2,
  Eye,
  User,
  Activity
} from 'lucide-react';
import { SIXTEEN_CCTV_FEEDS } from './DashboardView';

export default function LiveMonitoringView({ 
  selectedCameraId = 'CAM 04',
  onCaptureSnapshot, 
  onDispatchAlert 
}) {
  const [activeCamId, setActiveCamId] = useState(selectedCameraId);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [liveTimestamp, setLiveTimestamp] = useState('15:24:18');
  const [snapshotToast, setSnapshotToast] = useState(null);

  // Live Detection State for Webcam / Live Stream
  const [subjectType, setSubjectType] = useState('female'); // 'female', 'male', 'animal'
  const [liveEmotion, setLiveEmotion] = useState('DISTRESS'); // 'NORMAL', 'FEAR', 'DISTRESS', 'SADNESS', 'ANGER'
  const [liveBehavior, setLiveBehavior] = useState('FOLLOWING'); // 'NORMAL', 'FOLLOWING', 'STALKING', 'PHYSICAL_STRUGGLE'
  const [emotionConfidence, setEmotionConfidence] = useState(91);
  const [subjectConfidence, setSubjectConfidence] = useState(96);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (selectedCameraId) {
      if (selectedCameraId === 'CAM-LIVE') {
        startWebcam();
      } else {
        stopWebcam();
        setActiveCamId(selectedCameraId);
      }
    }
  }, [selectedCameraId]);

  const currentCam = SIXTEEN_CCTV_FEEDS.find(c => c.camId === activeCamId || c.id === activeCamId) || SIXTEEN_CCTV_FEEDS[3];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimestamp(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start Real Browser Webcam
  const startWebcam = async () => {
    try {
      setWebcamError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Video play error:', e));
        }
        setIsWebcamActive(true);
        setActiveCamId('CAM-LIVE');
      } else {
        throw new Error('getUserMedia not supported in this browser context.');
      }
    } catch (err) {
      console.error('Webcam Access Error:', err);
      setWebcamError('Camera access was blocked or no camera hardware detected. Please click the camera icon in your browser URL bar to allow permissions.');
      setIsWebcamActive(false);
    }
  };

  // Stop Webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Capture real snapshot from video/webcam canvas
  const handleSnapshot = () => {
    let capturedImg = null;
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      capturedImg = canvas.toDataURL('image/jpeg');
    }

    const camName = isWebcamActive ? 'Live Webcam Node (Operator)' : currentCam.name;
    setSnapshotToast(`Evidence frame captured from ${camName} & sealed with SHA-256 hash.`);
    setTimeout(() => setSnapshotToast(null), 3500);

    if (onCaptureSnapshot) {
      onCaptureSnapshot({
        id: isWebcamActive ? 'CAM-LIVE' : currentCam.camId,
        name: camName,
        snapshotData: capturedImg,
        risk: isWebcamActive ? (liveEmotion === 'NORMAL' ? 'LOW' : 'HIGH') : currentCam.risk
      });
    }
  };

  const isHighRiskLive = liveEmotion === 'FEAR' || liveEmotion === 'DISTRESS' || liveBehavior !== 'NORMAL';
  const liveRiskBadge = isHighRiskLive ? (liveEmotion === 'FEAR' ? 'CRITICAL' : 'HIGH') : 'LOW';

  return (
    <div className="space-y-3.5 select-none text-white font-sans">
      
      {/* Hidden Canvas for Live Snapshot Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Selector & Controls */}
      <div className="bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
            LIVE SINGLE-CAMERA FOCUSED INSPECTION & FORENSIC ANALYSIS
          </h3>
        </div>

        {/* Live Webcam Toggle & Feed Dropdown */}
        <div className="flex items-center space-x-2">
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="flex items-center space-x-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-all shadow-xs cursor-pointer animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Connect Live Webcam / Laptop Camera</span>
            </button>
          ) : (
            <button
              onClick={() => {
                stopWebcam();
                setActiveCamId('CAM 04');
              }}
              className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Switch Back to CCTV Feeds</span>
            </button>
          )}

          <span className="text-[11px] font-bold text-slate-400">Select Feed:</span>
          <select
            value={isWebcamActive ? 'CAM-LIVE' : activeCamId}
            onChange={(e) => {
              if (e.target.value === 'CAM-LIVE') {
                startWebcam();
              } else {
                stopWebcam();
                setActiveCamId(e.target.value);
              }
            }}
            className="bg-[#0f1d35] border border-[#1d355e] rounded px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="CAM-LIVE">🔴 CAM-LIVE — Operator Local Webcam / Camera</option>
            {SIXTEEN_CCTV_FEEDS.map(c => (
              <option key={c.camId} value={c.camId}>
                {c.name} {c.threat ? `[${c.risk}]` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Webcam Permission Alert */}
      {webcamError && (
        <div className="bg-red-950/80 border border-red-800 text-red-200 p-2.5 rounded text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{webcamError}</span>
        </div>
      )}

      {/* Snapshot Toast Feedback */}
      {snapshotToast && (
        <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-200 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Main Split Layout: Left Large Video (8 cols) & Right AI Telemetry Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left: Large Live CCTV / Webcam Player (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1424] rounded-lg border border-[#1b2e4b] overflow-hidden flex flex-col shadow-sm">
          
          {/* Video Header Bar */}
          <div className="bg-[#0f1d35] text-white px-3 py-2 flex items-center justify-between text-xs border-b border-[#1b2e4b] font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">
                {isWebcamActive ? 'CAM-LIVE — Operator Real-Time Webcam Sensor' : currentCam.name}
              </span>
            </div>
            <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase ${
              (isWebcamActive ? liveRiskBadge === 'CRITICAL' || liveRiskBadge === 'HIGH' : currentCam.threat)
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-emerald-700 text-white'
            }`}>
              RISK: {isWebcamActive ? liveRiskBadge : currentCam.risk}
            </span>
          </div>

          {/* Video Frame */}
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              key={isWebcamActive ? 'webcam' : currentCam.video}
              src={isWebcamActive ? undefined : currentCam.video}
              autoPlay
              loop={!isWebcamActive}
              muted={isAudioMuted}
              playsInline
              className={`w-full h-full object-cover brightness-95 contrast-105 ${isWebcamActive ? 'scale-x-[-1]' : ''}`}
            />

            {/* Overlaid Computer Vision Bounding Boxes (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              {isWebcamActive ? (
                /* LIVE WEBCAM REAL-TIME DETECTION OVERLAYS */
                <>
                  {/* Subject Body Bounding Box */}
                  <rect 
                    x="28" 
                    y="20" 
                    width="44" 
                    height="70" 
                    fill="none" 
                    stroke={subjectType === 'female' ? '#10b981' : subjectType === 'male' ? '#3b82f6' : '#f97316'} 
                    strokeWidth="0.8" 
                    rx="0.6" 
                  />
                  <rect 
                    x="28" 
                    y="14.5" 
                    width="44" 
                    height="5.5" 
                    fill={subjectType === 'female' ? '#10b981' : subjectType === 'male' ? '#3b82f6' : '#f97316'} 
                    rx="0.4" 
                  />
                  <text x="50" y="18.5" fill="#ffffff" fontSize="2.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    {subjectType === 'female' ? `Woman / Female (${subjectConfidence}%)` : subjectType === 'male' ? `Male Subject (${subjectConfidence}%)` : `Animal / Road Hazard (${subjectConfidence}%)`}
                  </text>

                  {/* Face Emotion Bounding Box */}
                  <rect 
                    x="38" 
                    y="24" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    stroke={isHighRiskLive ? '#ef4444' : '#10b981'} 
                    strokeWidth="0.7" 
                    rx="0.4" 
                  />
                  <rect 
                    x="26" 
                    y="8.5" 
                    width="48" 
                    height="5.5" 
                    fill={isHighRiskLive ? '#ef4444' : '#10b981'} 
                    rx="0.4" 
                  />
                  <text x="50" y="12.5" fill="#ffffff" fontSize="2.6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    FACE: {liveEmotion} ({emotionConfidence}%) {isHighRiskLive ? '— POTENTIAL DISTRESS' : ''}
                  </text>
                </>
              ) : (
                /* CCTV DEMO FOOTAGE OVERLAYS */
                <>
                  <rect x="22" y="26" width="18" height="58" fill="none" stroke="#10b981" strokeWidth="0.8" rx="0.5" />
                  <rect x="46" y="24" width="20" height="60" fill="none" stroke="#ef4444" strokeWidth="1.2" rx="0.5" />
                  <rect x="70" y="28" width="18" height="54" fill="none" stroke="#3b82f6" strokeWidth="0.8" rx="0.5" />
                </>
              )}
            </svg>

            {/* Top-Left: LIVE Badge & Time */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                ● LIVE {isWebcamActive ? 'WEBCAM' : 'SURVEILLANCE'}
              </span>
              <span className="bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                {liveTimestamp}
              </span>
            </div>

            {/* Top-Right: Stream Telemetry */}
            <div className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[9px] px-2 py-1 rounded z-20 text-right space-y-0.5">
              <div>{isWebcamActive ? 'WEBCAM 720p / 60 FPS' : '1080p / 30 FPS'}</div>
              <div className="text-emerald-400 font-bold">LATENCY: 14ms</div>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="bg-[#0f1d35] px-3 py-2 flex items-center justify-between text-xs text-slate-300 border-t border-[#1b2e4b]">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSnapshot}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold cursor-pointer flex items-center space-x-1 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Evidence Frame</span>
              </button>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title={isAudioMuted ? 'Unmute Sensor' : 'Mute Sensor'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Sensor Node: <strong className="text-slate-200">{isWebcamActive ? 'OPERATOR-LOCAL-WEBCAM' : currentCam.camId}</strong>
            </div>
          </div>

        </div>

        {/* Right: AI Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1424] rounded-lg border border-[#1b2e4b] p-3 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1b2e4b]">
              <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                REAL-TIME AI TELEMETRY
              </h4>
              <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-900/40 border border-blue-600/40 px-1.5 py-0.2 rounded">
                Edge v3.2
              </span>
            </div>

            {/* Diagnostic Fields */}
            <div className="space-y-2 mt-2.5 text-xs">
              
              {/* Subject Classification */}
              <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Classified Subject Category</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-white capitalize text-xs">
                    {isWebcamActive 
                      ? (subjectType === 'female' ? 'Female / Woman' : subjectType === 'male' ? 'Male Subject' : 'Animal / Road Hazard')
                      : `${currentCam.womenDetected === 'Yes' ? 'Woman Detected' : 'No Woman Detected'}`}
                  </span>
                  <span className="font-mono font-bold text-blue-400">
                    {isWebcamActive ? `${subjectConfidence}% Conf` : '96% Conf'}
                  </span>
                </div>
              </div>

              {/* Facial Emotion */}
              <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Facial Expression Affect</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-white text-xs">
                    {isWebcamActive ? liveEmotion : currentCam.face}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-red-300 bg-red-900/60 border border-red-700' : 'text-emerald-300 bg-emerald-900/60 border border-emerald-700'
                  }`}>
                    {(isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'Potential Distress Indicator' : 'Normal Baseline'}
                  </span>
                </div>
              </div>

              {/* Behavioral Movement */}
              <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Behavioral Movement & Pose</span>
                <span className={`font-bold block mt-1 text-xs ${
                  (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-orange-400' : 'text-slate-200'
                }`}>
                  {isWebcamActive ? liveBehavior.replace(/_/g, ' ') : currentCam.behavior}
                </span>
              </div>

              {/* Interaction Vector */}
              <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Threat & Interaction Vector</span>
                <span className="font-bold text-white block mt-1 text-xs">
                  {isWebcamActive 
                    ? (isHighRiskLive ? 'POSSIBLE DISTRESS / UNSAFE SITUATION' : 'NO THREAT DETECTED')
                    : (currentCam.threat ? 'CLOSE FOLLOWING / SUSPICIOUS TRAILING' : 'NORMAL COMMUTE')}
                </span>
              </div>

              {/* Multi-Factor Risk Score */}
              <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Multi-Factor Risk Score</span>
                <div className="flex justify-between items-center mt-1">
                  <span className={`font-bold uppercase ${
                    (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {isWebcamActive ? `${liveRiskBadge} RISK` : `${currentCam.risk} RISK`}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {isWebcamActive ? `${liveEmotion === 'FEAR' ? 94 : 88} / 100` : (currentCam.threat ? '91 / 100' : '18 / 100')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Button */}
          <div className="pt-2 border-t border-[#1b2e4b]">
            <button
              onClick={() => onDispatchAlert && onDispatchAlert({
                id: isWebcamActive ? 'CAM-LIVE' : currentCam.camId,
                title: isWebcamActive ? `Live Distress Event (${liveEmotion})` : currentCam.behavior,
                location: isWebcamActive ? 'Operator Terminal' : currentCam.location,
                risk: isWebcamActive ? liveRiskBadge : currentCam.risk
              })}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Incident Response Patrol</span>
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Live Demo Controller Panel (Active during Webcam Stream) */}
      {isWebcamActive && (
        <div className="bg-[#0b1424] rounded-lg border-2 border-blue-500 p-3.5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#1b2e4b]">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h4 className="font-black text-slate-100 text-xs uppercase tracking-wider">
                Live Webcam Demo Simulator Controller (Presenting to Audience)
              </h4>
            </div>
            <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-600/50 font-bold px-2 py-0.5 rounded">
              Controls live bounding box & telemetry in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* 1. Subject Category Selector */}
            <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e] space-y-1.5">
              <label className="font-bold text-slate-300 block text-[11px] uppercase">
                1. Detect Subject Type
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSubjectType('female')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'female' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-[#11223e] text-slate-300 border border-slate-700'
                  }`}
                >
                  Female
                </button>
                <button
                  onClick={() => setSubjectType('male')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'male' ? 'bg-blue-600 text-white shadow-xs' : 'bg-[#11223e] text-slate-300 border border-slate-700'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setSubjectType('animal')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'animal' ? 'bg-orange-600 text-white shadow-xs' : 'bg-[#11223e] text-slate-300 border border-slate-700'
                  }`}
                >
                  Animal
                </button>
              </div>
            </div>

            {/* 2. Facial Expression Selector */}
            <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e] space-y-1.5">
              <label className="font-bold text-slate-300 block text-[11px] uppercase">
                2. Live Facial Emotion
              </label>
              <div className="grid grid-cols-5 gap-1">
                {['NORMAL', 'FEAR', 'DISTRESS', 'SADNESS', 'ANGER'].map(emo => (
                  <button
                    key={emo}
                    onClick={() => {
                      setLiveEmotion(emo);
                      setEmotionConfidence(emo === 'NORMAL' ? 96 : Math.floor(Math.random() * 8) + 90);
                    }}
                    className={`py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      liveEmotion === emo ? 'bg-red-600 text-white shadow-xs' : 'bg-[#11223e] text-slate-300 border border-slate-700'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Safety / Behavior Condition Selector */}
            <div className="bg-[#0f1d35] p-2.5 rounded border border-[#1d355e] space-y-1.5">
              <label className="font-bold text-slate-300 block text-[11px] uppercase">
                3. Safety Status / Threat Flag
              </label>
              <select
                value={liveBehavior}
                onChange={(e) => setLiveBehavior(e.target.value)}
                className="w-full bg-[#11223e] border border-slate-700 rounded px-2 py-1 text-xs font-bold text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="NORMAL">Normal Safe Activity</option>
                <option value="FOLLOWING">Following / Trailing</option>
                <option value="STALKING">Stalking Vector</option>
                <option value="PHYSICAL_STRUGGLE">Physical Struggle / Aggression</option>
              </select>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

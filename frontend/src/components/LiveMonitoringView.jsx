import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Play, 
  Pause, 
  Camera, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  ChevronDown,
  Clock,
  Activity,
  AlertTriangle,
  UserCheck,
  Eye,
  Info,
  Radio,
  Sliders,
  User,
  Dog
} from 'lucide-react';
import { EIGHT_CCTV_FEEDS } from './DashboardView';

export default function LiveMonitoringView({ 
  selectedCameraId = 'CAM 01',
  onCaptureSnapshot, 
  onDispatchAlert 
}) {
  const [activeCamId, setActiveCamId] = useState(selectedCameraId);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [liveClock, setLiveClock] = useState('');
  const [snapshotToast, setSnapshotToast] = useState(null);

  // Real-time Demo Controls for Live Webcam
  const [subjectType, setSubjectType] = useState('female'); // 'female', 'male', 'animal'
  const [liveEmotion, setLiveEmotion] = useState('FEAR'); // 'NORMAL', 'FEAR', 'DISTRESS', 'SADNESS', 'ANGER'
  const [liveBehavior, setLiveBehavior] = useState('DISTRESS_INDICATOR'); // 'NORMAL', 'DISTRESS_INDICATOR', 'STALKING', 'PHYSICAL_STRUGGLE'
  const [emotionConfidence, setEmotionConfidence] = useState(94);
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

  const currentCam = EIGHT_CCTV_FEEDS.find(c => c.id === activeCamId) || EIGHT_CCTV_FEEDS[0];

  useEffect(() => {
    const update = () => {
      setLiveClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Start Real Browser Webcam
  const startWebcam = async () => {
    try {
      setWebcamError(null);
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
    } catch (err) {
      console.error('Webcam Access Error:', err);
      setWebcamError('Webcam access was denied or no camera device found. Please allow camera permissions in your browser.');
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
        id: isWebcamActive ? 'CAM-LIVE' : currentCam.id,
        name: camName,
        snapshotData: capturedImg,
        risk: isWebcamActive ? (liveEmotion === 'NORMAL' ? 'LOW' : 'HIGH') : currentCam.risk
      });
    }
  };

  // Dynamic Risk calculation for Live Webcam
  const isHighRiskLive = liveEmotion === 'FEAR' || liveEmotion === 'DISTRESS' || liveBehavior !== 'NORMAL';
  const liveRiskScore = isHighRiskLive ? (liveEmotion === 'FEAR' ? 94 : 88) : 14;
  const liveRiskBadge = isHighRiskLive ? (liveEmotion === 'FEAR' ? 'CRITICAL' : 'HIGH') : 'LOW';

  const cameraTimeline = [
    { time: '11:24:10', event: isWebcamActive ? `Live Detection: ${subjectType.toUpperCase()} (${subjectConfidence}%) with ${liveEmotion} emotion` : `Following & Trailing Vector locked on ${currentCam.person} (0.8m proximity)`, risk: isWebcamActive ? liveRiskBadge : 'Critical' },
    { time: '11:22:05', event: isWebcamActive ? `Facial Distress Indicator flagged (Emotion Conf: ${emotionConfidence}%)` : `Facial Distress Indicator flagged (${currentCam.face})`, risk: 'High' },
    { time: '11:20:31', event: isWebcamActive ? 'Real-time Facial Mesh calibration locked (468 landmarks)' : 'Suspect matched walking speed across 3 checkpoints', risk: 'Medium' },
    { time: '11:15:00', event: 'Sensor stream auto-calibrated for optical lighting', risk: 'Normal' },
  ];

  return (
    <div className="space-y-3 select-none">
      
      {/* Hidden Canvas for Live Snapshot Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Header Bar with Live Webcam Button */}
      <div className="bg-white rounded border border-slate-200 p-2.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Video className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Live Single-Camera Focused Inspection & Real-Time AI Detection
          </h3>
        </div>

        {/* Live Webcam Toggle & Feed Selector */}
        <div className="flex items-center space-x-2">
          {/* Direct Connect Webcam Button */}
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-all shadow-xs cursor-pointer animate-pulse"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Connect Live Webcam / Laptop Camera</span>
            </button>
          ) : (
            <button
              onClick={() => {
                stopWebcam();
                setActiveCamId('CAM 01');
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Switch Back to CCTV Feeds</span>
            </button>
          )}

          <span className="text-[11px] font-bold text-slate-500">Camera:</span>
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
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="CAM-LIVE">🔴 CAM-LIVE — Operator Local Webcam / Camera</option>
            {EIGHT_CCTV_FEEDS.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.threat ? `[${c.risk}]` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Webcam Error Notification */}
      {webcamError && (
        <div className="bg-red-50 border border-red-300 text-red-900 p-2.5 rounded text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{webcamError}</span>
        </div>
      )}

      {/* Snapshot Toast Feedback */}
      {snapshotToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{snapshotToast}</span>
        </div>
      )}

      {/* Main Split Layout: Left Large Video (8 cols) & Right AI Telemetry Panel (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* Left: Large Live CCTV / Webcam Player (8 cols) */}
        <div className="lg:col-span-8 bg-black rounded border border-slate-300 overflow-hidden flex flex-col shadow-xs">
          
          {/* Video Header */}
          <div className="bg-[#0b1b30] text-white px-3 py-1.5 flex items-center justify-between text-xs border-b border-slate-800 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">
                {isWebcamActive ? 'CAM-LIVE — Operator Real-Time Webcam Sensor' : currentCam.name}
              </span>
            </div>
            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
              (isWebcamActive ? liveRiskBadge === 'CRITICAL' : currentCam.risk === 'CRITICAL')
                ? 'bg-red-600 text-white animate-pulse'
                : (isWebcamActive ? liveRiskBadge === 'HIGH' : currentCam.risk === 'HIGH')
                ? 'bg-orange-600 text-white'
                : 'bg-emerald-700 text-white'
            }`}>
              RISK: {isWebcamActive ? liveRiskBadge : currentCam.risk}
            </span>
          </div>

          {/* Video Stream Frame */}
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            
            {/* Real HTML5 Video Element (Handles both Webcam stream & local MP4 files) */}
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
                  {/* Subject Body Bounding Box (Female / Male / Animal) */}
                  <rect 
                    x="28" 
                    y="22" 
                    width="44" 
                    height="68" 
                    fill="none" 
                    stroke={subjectType === 'female' ? '#10b981' : subjectType === 'male' ? '#3b82f6' : '#f97316'} 
                    strokeWidth="0.8" 
                    rx="0.6" 
                  />
                  <rect 
                    x="28" 
                    y="16.5" 
                    width="44" 
                    height="5.2" 
                    fill={subjectType === 'female' ? '#10b981' : subjectType === 'male' ? '#3b82f6' : '#f97316'} 
                    rx="0.4" 
                  />
                  <text x="50" y="20.2" fill="#ffffff" fontSize="2.8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    {subjectType === 'female' ? `Woman / Female (${subjectConfidence}%)` : subjectType === 'male' ? `Male Subject (${subjectConfidence}%)` : `Animal / Road Hazard (${subjectConfidence}%)`}
                  </text>

                  {/* Face Mesh Emotion Detection Box */}
                  <rect 
                    x="38" 
                    y="26" 
                    width="24" 
                    height="24" 
                    fill="none" 
                    stroke={isHighRiskLive ? '#ef4444' : '#10b981'} 
                    strokeWidth="0.7" 
                    rx="0.4" 
                  />
                  <rect 
                    x="26" 
                    y="10.5" 
                    width="48" 
                    height="5.2" 
                    fill={isHighRiskLive ? '#ef4444' : '#10b981'} 
                    rx="0.4" 
                  />
                  <text x="50" y="14.2" fill="#ffffff" fontSize="2.6" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    FACE: {liveEmotion} ({emotionConfidence}%) {isHighRiskLive ? '— POTENTIAL DISTRESS' : ''}
                  </text>

                  {/* Live Status Tag at Bottom of Subject */}
                  {isHighRiskLive && (
                    <>
                      <rect x="22" y="91" width="56" height="5.2" fill="#991b1b" rx="0.4" />
                      <text x="50" y="94.7" fill="#ffffff" fontSize="2.5" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                        BEHAVIOR: {liveBehavior.replace(/_/g, ' ')}
                      </text>
                    </>
                  )}
                </>
              ) : (
                /* CCTV DEMO FOOTAGE OVERLAYS */
                <>
                  <rect x="25" y="30" width="14" height="40" fill="none" stroke="#10b981" strokeWidth="0.6" rx="0.5" />
                  <rect x="25" y="25.5" width="20" height="4" fill="#10b981" rx="0.3" />
                  <text x="35" y="28.5" fill="#ffffff" fontSize="2.2" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    {currentCam.person}
                  </text>

                  <rect x="29" y="32" width="6" height="7" fill="none" stroke="#ef4444" strokeWidth="0.5" rx="0.3" />
                  <rect x="18" y="20.5" width="34" height="4" fill={currentCam.threat ? '#ef4444' : '#10b981'} rx="0.3" />
                  <text x="35" y="23.5" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                    FACE: {currentCam.face}
                  </text>

                  {currentCam.threat && (
                    <>
                      <rect x="8" y="32" width="14" height="42" fill="none" stroke="#f97316" strokeWidth="0.6" strokeDasharray="1.5, 0.5" rx="0.5" />
                      <line x1="22" y1="52" x2="25" y2="52" stroke="#ef4444" strokeWidth="0.7" strokeDasharray="1, 0.5" />
                      <rect x="6" y="74" width="38" height="4.5" fill="#991b1b" rx="0.3" />
                      <text x="25" y="77.2" fill="#ffffff" fontSize="2.0" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                        {currentCam.behavior}
                      </text>
                    </>
                  )}
                </>
              )}
            </svg>

            {/* Top-Left: LIVE Badge & Time */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                ● LIVE {isWebcamActive ? 'WEBCAM' : 'SURVEILLANCE'}
              </span>
              <span className="bg-slate-900/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                {liveClock}
              </span>
            </div>

            {/* Top-Right: Stream Telemetry */}
            <div className="absolute top-2 right-2 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-1 rounded z-20 text-right space-y-0.5">
              <div>{isWebcamActive ? 'WEBCAM 720p / 60 FPS' : '30 FPS | H.265 HIGH'}</div>
              <div className="text-emerald-400 font-bold">LATENCY: 12ms</div>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="bg-[#0b1b30] px-3 py-1.5 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
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
              Sensor Node: <strong className="text-slate-200">{isWebcamActive ? 'OPERATOR-LOCAL-WEBCAM' : currentCam.id}</strong>
            </div>
          </div>

        </div>

        {/* Right: AI Analysis Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded border border-slate-200 p-3 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Real-Time AI Telemetry
              </h4>
              <span className="text-[10px] font-mono text-blue-700 font-bold bg-blue-50 px-1.5 py-0.2 rounded">
                Edge v3.2
              </span>
            </div>

            {/* Diagnostic Fields */}
            <div className="space-y-2 mt-2.5 text-xs">
              
              {/* Subject Classification */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Classified Subject Category</span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="font-bold text-slate-900 capitalize">
                    {isWebcamActive 
                      ? (subjectType === 'female' ? 'Female / Woman' : subjectType === 'male' ? 'Male Subject' : 'Animal / Road Hazard')
                      : 'Woman Detected (8 People / 3 Women)'}
                  </span>
                  <span className="font-mono font-bold text-blue-700">
                    {isWebcamActive ? `${subjectConfidence}% Conf` : '96% Conf'}
                  </span>
                </div>
              </div>

              {/* Facial Emotion */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Facial Expression Affect</span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="font-bold text-slate-900">
                    {isWebcamActive ? liveEmotion : currentCam.face}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-red-700 bg-red-50' : 'text-emerald-700 bg-emerald-50'
                  }`}>
                    {(isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'Potential Distress Indicator' : 'Normal Baseline'}
                  </span>
                </div>
              </div>

              {/* Behavioral Movement */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Behavioral Movement & Pose</span>
                <span className={`font-bold block mt-0.5 ${
                  (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-red-700' : 'text-slate-800'
                }`}>
                  {isWebcamActive ? liveBehavior.replace(/_/g, ' ') : currentCam.behavior}
                </span>
              </div>

              {/* Interaction Vector */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Threat & Interaction Vector</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {isWebcamActive 
                    ? (isHighRiskLive ? 'POSSIBLE DISTRESS / UNSAFE SITUATION' : 'NO THREAT DETECTED')
                    : (currentCam.threat ? 'CLOSE FOLLOWING / SUSPICIOUS TRAILING' : 'NORMAL COMMUTE')}
                </span>
              </div>

              {/* Multi-Factor Risk Score */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Multi-Factor Risk Score</span>
                <div className="flex justify-between items-center mt-0.5">
                  <span className={`font-bold uppercase ${
                    (isWebcamActive ? isHighRiskLive : currentCam.threat) ? 'text-red-700' : 'text-emerald-700'
                  }`}>
                    {isWebcamActive ? `${liveRiskBadge} RISK` : `${currentCam.risk} RISK`}
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {isWebcamActive ? `${liveRiskScore} / 100` : (currentCam.threat ? '94 / 100' : '18 / 100')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Button */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onDispatchAlert && onDispatchAlert({
                id: isWebcamActive ? 'CAM-LIVE' : currentCam.id,
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
        <div className="bg-white rounded border-2 border-blue-600 p-3.5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-700" />
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                Live Webcam Demo Simulator Controller (Presenting to Audience)
              </h4>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
              Controls live bounding box & telemetry in real-time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* 1. Subject Category Selector */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-700 block text-[11px] uppercase">
                1. Detect Subject Type
              </label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSubjectType('female')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'female' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Female
                </button>
                <button
                  onClick={() => setSubjectType('male')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'male' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setSubjectType('animal')}
                  className={`py-1 rounded text-xs font-bold cursor-pointer transition-all ${
                    subjectType === 'animal' ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  Animal
                </button>
              </div>
            </div>

            {/* 2. Facial Expression Selector */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-700 block text-[11px] uppercase">
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
                      liveEmotion === emo ? 'bg-red-600 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-300'
                    }`}
                  >
                    {emo}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Safety / Behavior Condition Selector */}
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1.5">
              <label className="font-bold text-slate-700 block text-[11px] uppercase">
                3. Safety Status / Threat Flag
              </label>
              <select
                value={liveBehavior}
                onChange={(e) => setLiveBehavior(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                <option value="NORMAL">Normal Safe Activity</option>
                <option value="DISTRESS_INDICATOR">Potential Distress Indicator (Alert)</option>
                <option value="STALKING">Stalking / Following Trajectory</option>
                <option value="PHYSICAL_STRUGGLE">Physical Struggle / Aggression</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Bottom: Sensor Event Timeline */}
      <div className="bg-white rounded border border-slate-200 p-3 shadow-xs">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider pb-2 mb-2 border-b border-slate-200">
          Sensor Event Audit Timeline ({isWebcamActive ? 'OPERATOR-LOCAL-WEBCAM' : currentCam.id})
        </h4>

        <div className="divide-y divide-slate-100 text-xs">
          {cameraTimeline.map((item, idx) => (
            <div key={idx} className="py-1.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] font-bold text-slate-500">{item.time}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                  item.risk === 'Critical' || item.risk === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  item.risk === 'High' || item.risk === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  item.risk === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.risk}
                </span>
                <span className="text-slate-800 font-medium">{item.event}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Logged to Audit Trail</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

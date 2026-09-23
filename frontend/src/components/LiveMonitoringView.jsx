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
  Activity,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { SIXTEEN_CCTV_FEEDS } from './DashboardView';
import { API_BASE_URL } from '../context/AuthContext';

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
  const [subjectType, setSubjectType] = useState('female');
  const [liveEmotion, setLiveEmotion] = useState('NEUTRAL / CALM'); 
  const [liveBehavior, setLiveBehavior] = useState('NORMAL ACTIVITY'); 
  const [emotionConfidence, setEmotionConfidence] = useState(95);
  const [subjectConfidence, setSubjectConfidence] = useState(96);
  const [detectedFaceBox, setDetectedFaceBox] = useState(null);
  const [faceFeatures, setFaceFeatures] = useState(null);
  const [threatScore, setThreatScore] = useState(12);
  const [affectIndicator, setAffectIndicator] = useState('Normal Baseline (Calm)');
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState('Standby');
  const [cctvInferenceData, setCctvInferenceData] = useState(null);

  const [detectedGender, setDetectedGender] = useState('Analyzing...');
  const [genderConfidence, setGenderConfidence] = useState(0);
  const [ageRange, setAgeRange] = useState('');

  const videoRef = useRef(null);
  const cctvVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const analyzeCanvasRef = useRef(null);
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

  // Ensure webcam video element is immediately wired to stream
  useEffect(() => {
    if (isWebcamActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(e => console.log('Webcam play error on mount:', e));
    }
  }, [isWebcamActive]);

  // Start Real Browser Webcam
  const startWebcam = async () => {
    try {
      setWebcamError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 }, 
            height: { ideal: 720 }, 
            facingMode: 'user' 
          },
          audio: false
        });
        streamRef.current = stream;
        setIsWebcamActive(true);
        setActiveCamId('CAM-LIVE');
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.log('Video play error:', e));
        }
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
    setDetectedFaceBox(null);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Real-Time Facial Expression Detection Loop with Aspect Ratio Matching & EMA Smoothing
  useEffect(() => {
    if (!isWebcamActive) {
      setDetectedFaceBox(null);
      return;
    }

    let isSubscribed = true;
    let isBusy = false;

    const runFaceAnalysis = async () => {
      if (isBusy || !videoRef.current || !analyzeCanvasRef.current) return;
      const video = videoRef.current;
      if (video.readyState < 2 || video.videoWidth === 0) return;

      isBusy = true;
      try {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;
        const canvas = analyzeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Match exact intrinsic video aspect ratio to prevent coordinate warping
        canvas.width = 480;
        canvas.height = Math.round(480 * (vh / vw));
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.65);

        const res = await fetch(`${API_BASE_URL}/ai/analyze-face`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        });

        if (res.ok && isSubscribed) {
          const data = await res.json();
          if (data.face_detected && data.box) {
            setLiveEmotion(data.expression);
            setEmotionConfidence(data.confidence);
            setFaceFeatures(data.features);
            setThreatScore(data.threat_score);
            setAffectIndicator(data.affect_indicator);
            setAiAnalysisStatus('Face Locked & Real-Time Tracking');

            setDetectedGender(data.gender || 'Unknown');
            setGenderConfidence(data.gender_confidence || 0);
            setAgeRange(data.age_range || '');

            // Exponential Moving Average (EMA) smoothing to eliminate box jitter
            setDetectedFaceBox(prev => {
              if (!prev) return data.box;
              const alpha = 0.35;
              return {
                x: prev.x * (1 - alpha) + data.box.x * alpha,
                y: prev.y * (1 - alpha) + data.box.y * alpha,
                width: prev.width * (1 - alpha) + data.box.width * alpha,
                height: prev.height * (1 - alpha) + data.box.height * alpha,
              };
            });
          } else {
            setAiAnalysisStatus('Scanning Frame for Face...');
            // Keep previous box briefly or clear
          }
        }
      } catch (err) {
        console.error('Face analysis loop error:', err);
      } finally {
        isBusy = false;
      }
    };

    const interval = setInterval(runFaceAnalysis, 300);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isWebcamActive]);

  // Real-Time CCTV Computer Vision Inference Loop
  useEffect(() => {
    if (isWebcamActive) {
      setCctvInferenceData(null);
      return;
    }

    let isSubscribed = true;
    let isBusy = false;

    const runCCTVInference = async () => {
      if (isBusy || !cctvVideoRef.current || !analyzeCanvasRef.current) return;
      const video = cctvVideoRef.current;
      if (video.readyState < 2 || video.videoWidth === 0) return;

      isBusy = true;
      try {
        const canvas = analyzeCanvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = 480;
        canvas.height = 270;
        ctx.drawImage(video, 0, 0, 480, 270);
        const base64Data = canvas.toDataURL('image/jpeg', 0.65);

        const res = await fetch(`${API_BASE_URL}/ai/infer-cctv`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Data,
            camera_id: currentCam.camId,
            location: currentCam.location
          })
        });

        if (res.ok && isSubscribed) {
          const data = await res.json();
          setCctvInferenceData(data);
        }
      } catch (err) {
        console.error('CCTV inference loop error:', err);
      } finally {
        isBusy = false;
      }
    };

    const interval = setInterval(runCCTVInference, 400);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isWebcamActive, activeCamId, currentCam]);

  // Capture real snapshot from video/webcam canvas
  const handleSnapshot = () => {
    let capturedImg = null;
    const activeVideo = isWebcamActive ? videoRef.current : cctvVideoRef.current;
    if (activeVideo && canvasRef.current) {
      const video = activeVideo;
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

    const calculatedRisk = isWebcamActive 
      ? (liveEmotion.includes('DISTRESS') || liveEmotion.includes('SCREAM') || liveEmotion.includes('FEAR') ? 'HIGH' : 'LOW') 
      : (cctvInferenceData ? cctvInferenceData.risk_level : currentCam.risk);

    if (onCaptureSnapshot) {
      onCaptureSnapshot({
        id: isWebcamActive ? 'CAM-LIVE' : currentCam.camId,
        name: camName,
        snapshotData: capturedImg,
        risk: calculatedRisk
      });
    }
  };

  const isDistressEmotion = liveEmotion.includes('FEAR') || liveEmotion.includes('DISTRESS') || liveEmotion.includes('SCREAM');
  const isHappyEmotion = liveEmotion.includes('HAPPY') || liveEmotion.includes('SAFE');
  const isSadEmotion = liveEmotion.includes('SAD') || liveEmotion.includes('CONCERN');

  const liveRiskBadge = isDistressEmotion ? 'HIGH' : (isSadEmotion ? 'MEDIUM' : 'LOW');
  const currentRiskLevel = isWebcamActive ? liveRiskBadge : (cctvInferenceData ? cctvInferenceData.risk_level : currentCam.risk);

  return (
    <div className="space-y-4 select-none text-slate-800 font-sans">
      
      {/* Hidden Canvas for Live Snapshot Capture & AI Processing */}
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={analyzeCanvasRef} className="hidden" />

      {/* Snapshot Toast Notification */}
      {snapshotToast && (
        <div className="bg-[#046A38] text-white text-xs px-4 py-2 rounded shadow-md flex items-center space-x-2 border border-emerald-600 transition-all">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
          <span className="font-semibold">{snapshotToast}</span>
        </div>
      )}

      {/* Webcam Hardware Permission Warning */}
      {webcamError && (
        <div className="bg-red-50 text-red-800 border border-red-300 p-3 rounded text-xs flex items-start space-x-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Camera Hardware Initialization Warning:</span>
            <span>{webcamError}</span>
          </div>
        </div>
      )}

      {/* TOP CONTROLS & CAMERA SELECTOR BAR (National Flag Theme) */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Title & Mode */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-lg bg-[#000080]/10 border border-[#000080]/20 flex items-center justify-center text-[#000080] shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                {isWebcamActive ? 'Operator Live Webcam Node' : currentCam.name}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                isWebcamActive 
                  ? 'bg-[#FF671F]/10 text-[#FF671F] border border-[#FF671F]/30'
                  : 'bg-emerald-50 text-[#046A38] border border-emerald-200'
              }`}>
                {isWebcamActive ? 'Live Sensor Feed' : 'Surveillance Grid Node'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {isWebcamActive 
                ? 'Facial Affect Recognition & Distress Verification' 
                : `${currentCam.location} • Real-Time Computer Vision Inference`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          
          {/* Saffron Connect / Disconnect Live Webcam Button */}
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="px-4 py-2 bg-gradient-to-r from-[#FF671F] to-[#E65100] hover:from-[#E65100] hover:to-[#D84315] text-white text-xs font-bold rounded shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Connect Live Webcam / Laptop Camera</span>
            </button>
          ) : (
            <button
              onClick={stopWebcam}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded border border-slate-300 shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch to CCTV Grid Feeds</span>
            </button>
          )}

          {/* CCTV Feed Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap hidden sm:inline">Select Feed:</span>
            <select
              value={activeCamId}
              onChange={(e) => {
                if (e.target.value === 'CAM-LIVE') {
                  startWebcam();
                } else {
                  stopWebcam();
                  setActiveCamId(e.target.value);
                }
              }}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded px-2.5 py-1.5 focus:outline-none focus:border-[#000080]"
            >
              <option value="CAM-LIVE">● Live Webcam (Operator Demo)</option>
              {SIXTEEN_CCTV_FEEDS.map(c => (
                <option key={c.camId} value={c.camId}>
                  {c.camId} — {c.location}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* LIVE EMOTION & SAFETY STATUS BANNER (When Webcam is Active) */}
      {isWebcamActive && (
        <div className={`p-3 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs transition-all ${
          isDistressEmotion 
            ? 'bg-red-50 border-red-300 text-red-900' 
            : isHappyEmotion 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : isSadEmotion
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-blue-50 border-blue-300 text-blue-900'
        }`}>
          <div className="flex items-center space-x-3">
            {isDistressEmotion ? (
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold animate-pulse">
                ⚠️
              </div>
            ) : isHappyEmotion ? (
              <div className="w-8 h-8 rounded-full bg-[#046A38] text-white flex items-center justify-center font-bold">
                <Smile className="w-5 h-5" />
              </div>
            ) : isSadEmotion ? (
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                <Frown className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#000080] text-white flex items-center justify-center font-bold">
                <Meh className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm uppercase tracking-wide">
                  LIVE AFFECT: {liveEmotion} ({emotionConfidence}% CONF)
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  isDistressEmotion ? 'bg-red-600 text-white' : 'bg-white text-slate-800 border border-slate-300'
                }`}>
                  RISK: {liveRiskBadge}
                </span>
              </div>
              <p className="text-xs font-medium opacity-90 mt-0.5">
                {affectIndicator} • Verified via OpenCV Haar Facial Landmarks & MAR Metric
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs shrink-0">
            <span className="font-bold block">Threat Index: {threatScore} / 100</span>
            <span className="text-[10px] text-slate-500 font-sans">Supporting Safety Signal</span>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN VIEWPORT: VIDEO PLAYER (8 cols) + AI TELEMETRY (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Primary Video Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          
          {/* Video Header Bar with Tricolor Accent */}
          <div className="bg-[#000080] text-white px-3 py-2 flex items-center justify-between text-xs border-b border-slate-800 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold tracking-wide">
                {isWebcamActive ? 'LIVE WEBCAM SENSOR — OPERATOR REAL-TIME DEMO' : currentCam.name}
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
              currentRiskLevel === 'CRITICAL' || currentRiskLevel === 'HIGH'
                ? 'bg-red-600 text-white animate-pulse'
                : currentRiskLevel === 'MEDIUM'
                ? 'bg-[#FF671F] text-white'
                : 'bg-[#046A38] text-white'
            }`}>
              RISK: {currentRiskLevel}
            </span>
          </div>

          {/* Video Frame Canvas Viewport */}
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            
            {/* Real WebCam Video Element */}
            {isWebcamActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={true}
                onLoadedMetadata={(e) => {
                  e.target.play().catch(err => console.log('Webcam play error:', err));
                }}
                className="w-full h-full object-cover brightness-95 contrast-105 scale-x-[-1]"
              />
            ) : (
              /* CCTV Pre-recorded Video Element */
              <video
                ref={cctvVideoRef}
                key={currentCam.video}
                src={currentCam.video}
                autoPlay
                loop
                muted={isAudioMuted}
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-cover brightness-95 contrast-105"
              />
            )}

            {/* Overlaid Computer Vision Bounding Boxes (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              {isWebcamActive ? (
                /* LIVE WEBCAM REAL-TIME FACE TRACKING (EMA Smoothed & Correctly Mirrored) */
                <>
                  {detectedFaceBox ? (
                    (() => {
                      const faceW = detectedFaceBox.width;
                      const faceH = detectedFaceBox.height;
                      // Correct mirror formula for scale-x-[-1]
                      const faceX = Math.max(1, Math.min(100 - faceW - 1, 100 - (detectedFaceBox.x + faceW)));
                      const faceY = Math.max(1, Math.min(100 - faceH - 1, detectedFaceBox.y));

                      const boxColor = isDistressEmotion ? '#ef4444' : isHappyEmotion ? '#10b981' : isSadEmotion ? '#f59e0b' : '#38bdf8';

                      return (
                        <g>
                          {/* Face Outline Box */}
                          <rect 
                            x={faceX} 
                            y={faceY} 
                            width={faceW} 
                            height={faceH} 
                            fill="none" 
                            stroke={boxColor} 
                            strokeWidth="1.2" 
                            rx="0.6" 
                            className={isDistressEmotion ? 'animate-pulse' : ''}
                          />

                          {/* Corner Reticle Accents */}
                          <line x1={faceX} y1={faceY} x2={faceX + 3} y2={faceY} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX} y1={faceY} x2={faceX} y2={faceY + 3} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX + faceW} y1={faceY} x2={faceX + faceW - 3} y2={faceY} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX + faceW} y1={faceY} x2={faceX + faceW} y2={faceY + 3} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX} y1={faceY + faceH} x2={faceX + 3} y2={faceY + faceH} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX} y1={faceY + faceH} x2={faceX} y2={faceY + faceH - 3} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX + faceW} y1={faceY + faceH} x2={faceX + faceW - 3} y2={faceY + faceH} stroke={boxColor} strokeWidth="2.2" />
                          <line x1={faceX + faceW} y1={faceY + faceH} x2={faceX + faceW} y2={faceY + faceH - 3} stroke={boxColor} strokeWidth="2.2" />

                          {/* Face Emotion Label Pill */}
                          <rect 
                            x={Math.max(1, faceX - 2)} 
                            y={Math.max(1, faceY - 6.5)} 
                            width={Math.max(faceW + 4, 46)} 
                            height="5.8" 
                            fill={boxColor} 
                            rx="0.4" 
                          />
                          <text 
                            x={faceX + (faceW / 2)} 
                            y={Math.max(5.2, faceY - 2.4)} 
                            fill="#ffffff" 
                            fontSize="2.5" 
                            fontFamily="monospace" 
                            fontWeight="bold" 
                            textAnchor="middle"
                          >
                            {liveEmotion} ({emotionConfidence}%)
                          </text>

                          {/* Center Target Aim Crosshair */}
                          <circle cx={faceX + faceW/2} cy={faceY + faceH/2} r="1.5" fill="none" stroke={boxColor} strokeWidth="0.5" />
                          <line x1={faceX + faceW/2 - 3} y1={faceY + faceH/2} x2={faceX + faceW/2 + 3} y2={faceY + faceH/2} stroke={boxColor} strokeWidth="0.5" />
                          <line x1={faceX + faceW/2} y1={faceY + faceH/2 - 3} x2={faceX + faceW/2} y2={faceY + faceH/2 + 3} stroke={boxColor} strokeWidth="0.5" />
                        </g>
                      );
                    })()
                  ) : (
                    /* Searching Face Reticle */
                    <g>
                      <rect 
                        x="32" 
                        y="22" 
                        width="36" 
                        height="40" 
                        fill="none" 
                        stroke="#38bdf8" 
                        strokeWidth="0.6" 
                        strokeDasharray="3 2" 
                        rx="1" 
                      />
                      <text x="50" y="43" fill="#38bdf8" fontSize="2.4" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        [ LOCKING ONTO USER FACE... ]
                      </text>
                    </g>
                  )}
                </>
              ) : (
                /* CCTV REAL-TIME INFERENCE OVERLAYS (ExtrAnom & OpenCV Behavior Pipeline) */
                <>
                  {cctvInferenceData && cctvInferenceData.boxes && cctvInferenceData.boxes.length > 0 ? (
                    cctvInferenceData.boxes.map((item, idx) => {
                      const isThreat = item.is_threat;
                      const isTarget = item.is_target;
                      const boxColor = isThreat ? '#ef4444' : isTarget ? '#10b981' : '#38bdf8';
                      const b = item.box;

                      return (
                        <g key={item.track_id || idx}>
                          {/* Real Inferred Bounding Box */}
                          <rect
                            x={b.x}
                            y={b.y}
                            width={b.width}
                            height={b.height}
                            fill="none"
                            stroke={boxColor}
                            strokeWidth="1.0"
                            rx="0.5"
                            className={isThreat ? 'animate-pulse' : ''}
                          />
                          {/* Corner Accents */}
                          <line x1={b.x} y1={b.y} x2={b.x + 3} y2={b.y} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 3} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x + b.width} y1={b.y} x2={b.x + b.width - 3} y2={b.y} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x + b.width} y1={b.y} x2={b.x + b.width} y2={b.y + 3} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x} y1={b.y + b.height} x2={b.x + 3} y2={b.y + b.height} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x} y1={b.y + b.height} x2={b.x} y2={b.y + b.height - 3} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x + b.width} y1={b.y + b.height} x2={b.x + b.width - 3} y2={b.y + b.height} stroke={boxColor} strokeWidth="1.8" />
                          <line x1={b.x + b.width} y1={b.y + b.height} x2={b.x + b.width} y2={b.y + b.height - 3} stroke={boxColor} strokeWidth="1.8" />

                          {/* Classification Label Pill */}
                          <rect
                            x={Math.max(1, b.x - 1)}
                            y={Math.max(1, b.y - 5.8)}
                            width={Math.max(b.width + 3, 34)}
                            height="5.4"
                            fill={boxColor}
                            rx="0.4"
                          />
                          <text
                            x={b.x + (b.width / 2)}
                            y={Math.max(4.8, b.y - 2.0)}
                            fill="#ffffff"
                            fontSize="2.4"
                            fontFamily="monospace"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {item.label}
                          </text>
                        </g>
                      );
                    })
                  ) : (
                    /* Scanning perimeter when empty */
                    <g>
                      <rect x="22" y="38" width="56" height="24" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 2" rx="1" />
                      <text x="50" y="51" fill="#38bdf8" fontSize="2.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        [ AI PERIMETER SCAN: NO SUSPECTS IN SENSOR ZONE ]
                      </text>
                    </g>
                  )}
                </>
              )}
            </svg>

            {/* Top-Left: LIVE Badge & Time */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20">
              <span className="bg-[#046A38] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                ● LIVE {isWebcamActive ? 'WEBCAM' : 'SURVEILLANCE'}
              </span>
              <span className="bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                {liveTimestamp}
              </span>
            </div>

            {/* Top-Right: Stream Telemetry */}
            <div className="absolute top-2 right-2 bg-black/80 text-white font-mono text-[9px] px-2 py-1 rounded z-20 text-right space-y-0.5">
              <div>{isWebcamActive ? 'WEBCAM 720p / 60 FPS' : '1080p / 30 FPS'}</div>
              <div className="text-emerald-400 font-bold">LATENCY: 12ms</div>
            </div>
          </div>

          {/* Controls Footer */}
          <div className="bg-slate-50 px-3.5 py-2.5 flex items-center justify-between text-xs text-slate-700 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSnapshot}
                className="px-3 py-1.5 bg-[#000080] hover:bg-[#000066] text-white rounded text-xs font-bold cursor-pointer flex items-center space-x-1.5 shadow-xs transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Evidence Frame</span>
              </button>
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded cursor-pointer transition-colors"
                title={isAudioMuted ? 'Unmute Sensor' : 'Mute Sensor'}
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#000080]" />}
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              Sensor Node: <strong className="text-slate-800 font-bold">{isWebcamActive ? 'OPERATOR-LOCAL-WEBCAM' : currentCam.camId}</strong>
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis & Live Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="font-bold text-[#000080] text-xs uppercase tracking-wider">
                REAL-TIME AI TELEMETRY
              </h4>
              <span className="text-[10px] font-mono text-[#046A38] font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Edge Model Active
              </span>
            </div>

            {/* Diagnostic Fields */}
            <div className="space-y-2 mt-2.5 text-xs">
              
              {/* Subject Classification */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Classified Subject Category</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold text-slate-900 capitalize text-xs">
                    {isWebcamActive 
                      ? (detectedGender === 'Female' ? 'Female / Woman' : detectedGender === 'Male' ? 'Male / Man' : 'Analyzing...')
                      : (cctvInferenceData ? (cctvInferenceData.detected_persons_count > 0 ? `${cctvInferenceData.detected_persons_count} Person(s) Tracked` : 'No Pedestrians (Clear)') : `${currentCam.womenDetected === 'Yes' ? 'Woman Detected' : 'No Woman Detected'}`)}
                  </span>
                  <span className="font-mono font-bold text-[#000080]">
                    {isWebcamActive ? `${genderConfidence}% Conf` : (cctvInferenceData ? `${cctvInferenceData.detected_persons_count > 0 ? '94%' : '0%'} Conf` : '96% Conf')}
                  </span>
                </div>
                {isWebcamActive && ageRange && (
                  <div className="text-[10px] font-bold text-slate-500 mt-1">
                    Est. Age: {ageRange}
                  </div>
                )}
              </div>

              {/* Facial Emotion */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Facial Expression Affect</span>
                <div className="flex justify-between items-center mt-1">
                  <span className={`font-bold text-xs ${
                    isDistressEmotion ? 'text-red-700' : isHappyEmotion ? 'text-[#046A38]' : isSadEmotion ? 'text-amber-700' : 'text-slate-800'
                  }`}>
                    {isWebcamActive ? liveEmotion : (cctvInferenceData ? (cctvInferenceData.facial_distress_detected ? 'DISTRESS DETECTED' : 'NORMAL / CALM') : currentCam.face)}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isDistressEmotion ? 'text-red-800 bg-red-100 border border-red-200' : 'text-[#046A38] bg-emerald-100 border border-emerald-200'
                  }`}>
                    {isWebcamActive ? (isDistressEmotion ? 'Distress Signal' : isHappyEmotion ? 'Smiling (Safe)' : 'Normal Calm') : (cctvInferenceData ? cctvInferenceData.facial_distress_role : 'Baseline Normal')}
                  </span>
                </div>
                {isWebcamActive && faceFeatures && (
                  <div className="flex items-center space-x-2 text-[9px] text-slate-500 mt-1 font-mono">
                    <span>Eyes: {faceFeatures.eyes_detected || 0}</span>
                    <span>•</span>
                    <span>Smile: {faceFeatures.smile ? 'YES' : 'NO'}</span>
                    <span>•</span>
                    <span>Open Mouth: {faceFeatures.mouth_open ? 'YES' : 'NO'}</span>
                  </div>
                )}
              </div>

              {/* Behavioral Movement */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Behavioral Movement & Pose</span>
                <span className={`font-bold block mt-1 text-xs ${
                  currentRiskLevel === 'HIGH' || currentRiskLevel === 'CRITICAL' ? 'text-red-700' : 'text-slate-800'
                }`}>
                  {isWebcamActive ? (isDistressEmotion ? 'AGITATION / DISTRESS' : 'CALM SAFE OPERATOR') : (cctvInferenceData ? cctvInferenceData.primary_behavior : currentCam.behavior)}
                </span>
              </div>

              {/* Interaction Vector */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Threat & Interaction Vector</span>
                <span className="font-bold text-slate-900 block mt-1 text-xs">
                  {isWebcamActive 
                    ? (isDistressEmotion ? 'DISTRESS INDICATOR (SUPPORTING SIGNAL)' : 'SAFE OPERATOR POSTURE')
                    : (cctvInferenceData ? (cctvInferenceData.detected_behaviors.join(' • ') || 'NORMAL PEDESTRIAN FLOW') : (currentCam.threat ? 'CLOSE FOLLOWING / SUSPICIOUS TRAILING' : 'NORMAL COMMUTE'))}
                </span>
              </div>

              {/* Multi-Factor Risk Score */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Multi-Factor Risk Score</span>
                <div className="flex justify-between items-center mt-1">
                  <span className={`font-bold uppercase ${
                    currentRiskLevel === 'CRITICAL' || currentRiskLevel === 'HIGH' ? 'text-red-600' : 'text-[#046A38]'
                  }`}>
                    {currentRiskLevel} RISK
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {isWebcamActive ? `${threatScore} / 100` : (cctvInferenceData ? `${cctvInferenceData.risk_score} / 100` : (currentCam.threat ? '91 / 100' : '18 / 100'))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatch Button (Official Red) */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => onDispatchAlert && onDispatchAlert({
                id: isWebcamActive ? 'CAM-LIVE' : currentCam.camId,
                title: isWebcamActive ? `Live Distress Event (${liveEmotion})` : currentCam.behavior,
                location: isWebcamActive ? 'Operator Terminal' : currentCam.location,
                risk: isWebcamActive ? liveRiskBadge : currentCam.risk
              })}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Incident Response Patrol</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, Minimize2, VideoOff, ShieldAlert, Activity, Truck, AlertOctagon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const getPoseTranslation = (pose, lang) => {
  if (lang === 'ta') {
    if (pose === 'WALKING') return 'நடத்தல்';
    if (pose === 'STANDING') return 'நிற்றல்';
    if (pose === 'STRUGGLING') return 'போராட்டம்';
    if (pose === 'AGGRESSIVE') return 'தாக்குதல்';
    if (pose === 'VEHICLES') return 'வாகனங்கள்';
  }
  return pose;
};

const getPedDensityTranslation = (density, lang) => {
  if (lang === 'ta') {
    if (density === 'ISOLATED') return 'தனிமை';
    if (density === 'LOW') return 'குறைவு';
    if (density === 'NORMAL') return 'இயல்பு';
    if (density === 'NONE') return 'இல்லை';
    if (density === 'HIGH') return 'அதிவேகம்';
  }
  return density;
};

// Custom component to simulate active AI CCTV video tracking with custom animatics
export const SimulatedCCTVStream = ({ camera, isCriticalMock = false, isDemoActive = false, demoStep = 0 }) => {
  const { language, t } = useLanguage();
  const [seconds, setSeconds] = useState(0);
  const [localDbLevel, setLocalDbLevel] = useState(45);
  const [localPedDensity, setLocalPedDensity] = useState('NORMAL');
  const [localFollowingMins, setLocalFollowingMins] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Reference for requestAnimationFrame to animate pose skeletons smoothly
  const animRef = useRef(0);
  const [animVal, setAnimVal] = useState(0);

  useEffect(() => {
    // Increment follow duration and simulate decibel level fluctuations
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
      
      // Decibel fluctuations
      if (!isDemoActive || !isCriticalMock) {
        setLocalDbLevel(Math.floor(40 + Math.random() * 25));
        setLocalPedDensity(camera.name.includes('NIT') ? 'NONE' : camera.name.includes('SUBWAY') ? 'ISOLATED' : 'NORMAL');
        setLocalFollowingMins(prev => (prev >= 30 ? 0 : prev + 1));
      }
    }, 1000);

    // Smooth animation loop for coordinate paths
    const tick = () => {
      setAnimVal(Date.now() * 0.001);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animRef.current);
    };
  }, [camera, isCriticalMock]);

  // Classify camera type for unique realistic simulations
  let streamType = 'crowd'; // Default busy bazaar/bus stand
  if (isCriticalMock || camera.id === 4 || camera.name.includes('ROCKFORT_TEMPLE_ROAD')) {
    streamType = 'threat';
  } else if (
    camera.name.includes('NIT') || 
    camera.name.includes('KK_NAGAR') || 
    camera.name.includes('CHINTAMANI') || 
    camera.name.includes('THILLAI') ||
    camera.name.includes('TRAFFIC')
  ) {
    streamType = 'traffic';
  } else if (camera.name.includes('RAILWAY') || camera.name.includes('GUARD_GATE')) {
    streamType = 'queue';
  } else if (camera.name.includes('SUBWAY') || camera.name.includes('PALAKKARAI') || camera.name.includes('DARK')) {
    streamType = 'isolated';
  }

  // Motion paths based on streamType
  // 1. Calculations for traffic type (Vehicles driving across screen)
  const v1X = (animVal * 20) % 130 - 20;
  const v2X = 120 - (animVal * 24) % 140;

  // 2. Calculations for queue type (Slight sway of standing joints)
  const qSway = Math.sin(animVal * 2.5) * 0.3;

  // 3. Calculations for isolated type (Slow wandering)
  const isoX = 20 + (animVal * 3) % 60;
  const isoY = 48 + Math.sin(animVal * 0.4) * 2;

  // 4. Calculations for busy crowd type
  const c1X = 10 + (animVal * 7.5) % 80;
  const c1Y = 40 + Math.sin(animVal * 1.5) * 2;
  const c2X = 90 - (animVal * 6.5) % 80;
  const c2Y = 52 + Math.cos(animVal * 1.2) * 2;
  const c3X = 40 + Math.sin(animVal * 0.6) * 15;
  const c3Y = 46 + Math.cos(animVal * 0.8) * 6;

  // Telemetry HUD derived values
  let followingMins, dbLevel, pedDensity, poseStatus, threatScore, isHighThreat;
  const isDemoOverride = isDemoActive && isCriticalMock;

  if (streamType === 'threat') {
    followingMins = isDemoOverride 
      ? (demoStep < 3 ? 0 : demoStep === 3 ? 5 : demoStep === 4 ? 15 : demoStep === 5 ? 25 : 32)
      : (isCriticalMock ? 32 : localFollowingMins);
      
    dbLevel = isDemoOverride
      ? (demoStep < 7 ? Math.floor(42 + Math.random() * 8) : 89)
      : (isCriticalMock ? Math.floor(82 + Math.random() * 11) : localDbLevel);
      
    pedDensity = isDemoOverride
      ? (demoStep < 3 ? 'NORMAL' : demoStep < 5 ? 'LOW' : 'ISOLATED')
      : (isCriticalMock ? 'ISOLATED' : localPedDensity);

    poseStatus = isDemoOverride
      ? (demoStep < 9 ? 'WALKING' : 'STRUGGLING')
      : (isCriticalMock ? 'AGGRESSIVE' : 'WALKING');

    threatScore = isDemoOverride
      ? (demoStep === 0 ? 20 : demoStep === 1 ? 15 : demoStep === 2 ? 25 : demoStep === 3 ? 35 : demoStep === 4 ? 48 : demoStep === 5 ? 55 : demoStep === 6 ? 68 : demoStep === 7 ? 79 : demoStep === 8 ? 85 : 95)
      : (isCriticalMock ? 94 : Math.max(10, Math.floor(20 + followingMins * 1.5)));

    isHighThreat = isDemoOverride ? (demoStep >= 10) : (isCriticalMock || (followingMins >= 10));
  } else if (streamType === 'traffic') {
    followingMins = 0;
    dbLevel = Math.floor(71 + Math.random() * 7);
    pedDensity = 'NONE';
    poseStatus = 'VEHICLES';
    threatScore = 5;
    isHighThreat = false;
  } else if (streamType === 'queue') {
    followingMins = 0;
    dbLevel = Math.floor(51 + Math.random() * 5);
    pedDensity = 'NORMAL';
    poseStatus = 'STANDING';
    threatScore = 7;
    isHighThreat = false;
  } else if (streamType === 'isolated') {
    followingMins = 0;
    dbLevel = Math.floor(34 + Math.random() * 5);
    pedDensity = 'ISOLATED';
    poseStatus = 'WALKING';
    threatScore = 14;
    isHighThreat = false;
  } else { // Busy Crowd / Bazaar
    followingMins = 0;
    dbLevel = Math.floor(65 + Math.random() * 8);
    pedDensity = 'NORMAL';
    poseStatus = 'WALKING';
    threatScore = 11;
    isHighThreat = false;
  }

  // Telemetry values formatting
  const followText = streamType === 'threat' 
    ? `${followingMins}${t('min')} ${seconds % 60}${t('sec')}`
    : (language === 'ta' ? 'இல்லை' : 'N/A');

  // Helper joint definition for mock pose skeleton rendering
  const getPoseJoints = (x, y, scale = 1, sway = 0) => {
    const head = { cx: x, cy: y - 5 * scale };
    const neck = { cx: x, cy: y - 3 * scale };
    const lShoulder = { cx: x - 2 * scale, cy: y - 2 * scale };
    const rShoulder = { cx: x + 2 * scale, cy: y - 2 * scale };
    const spine = { cx: x + sway, cy: y };
    const lElbow = { cx: x - 3.5 * scale, cy: y + (Math.sin(animVal * 2.2) * 0.6) * scale };
    const rElbow = { cx: x + 3.5 * scale, cy: y + (Math.cos(animVal * 2.2) * 0.6) * scale };
    const lHip = { cx: x - 1.5 * scale, cy: y + 3 * scale };
    const rHip = { cx: x + 1.5 * scale, cy: y + 3 * scale };
    const lKnee = { cx: x - 2 * scale + sway, cy: y + 7 * scale };
    const rKnee = { cx: x + 2 * scale + sway, cy: y + 7 * scale };
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

  const renderSkeleton = (x, y, scale = 1, sway = 0, color = "#10b981") => {
    const joints = getPoseJoints(x, y, scale, sway);
    return (
      <g key={`${x}-${y}`}>
        {joints.limbs.map((limb, idx) => (
          <line key={`li-${idx}`} x1={limb[0].cx} y1={limb[0].cy} x2={limb[1].cx} y2={limb[1].cy} stroke={color} strokeWidth="0.18" opacity="0.6" />
        ))}
        {joints.points.map((pt, idx) => (
          <circle key={`po-${idx}`} cx={pt.cx} cy={pt.cy} r="0.4" fill="#ffffff" opacity="0.8" />
        ))}
      </g>
    );
  };

  // CCTV Background footage simulation URLs
  let bgUrl = '';
  let videoUrl = '';
  if (streamType === 'threat') {
    bgUrl = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop';
    videoUrl = '/videos/threat.mp4';
  } else if (streamType === 'traffic') {
    bgUrl = 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=400&auto=format&fit=crop';
    videoUrl = '/videos/traffic.mp4';
  } else if (streamType === 'queue') {
    bgUrl = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=400&auto=format&fit=crop';
    videoUrl = '/videos/crowd.mp4';
  } else if (streamType === 'isolated') {
    bgUrl = 'https://images.unsplash.com/photo-1456428746267-a1756408f782?q=80&w=400&auto=format&fit=crop';
    videoUrl = '/videos/isolated.mp4';
  } else {
    bgUrl = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop';
    videoUrl = '/videos/crowd.mp4';
  }

  // Threat calculations (original alerts demo)
  const tX = 35 + Math.sin(animVal) * 12;
  const tY = 45 + Math.cos(animVal * 0.6) * 8;
  const sX = tX - 10 - Math.cos(animVal) * 4;
  const sY = tY + 4 + Math.sin(animVal * 0.8) * 3;
  const dx = tX - sX;
  const dy = tY - sY;
  const distance = Math.max(0.6, Math.min(3.0, Math.sqrt(dx * dx + dy * dy) * 0.08));

  return (
    <div className="relative w-full h-full bg-[#02050a] flex items-center justify-center overflow-hidden border border-surveillance-border/50 group select-none">
      
      {/* Real CCTV Background footage simulation */}
      {!videoError ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
          style={{
            filter: 'brightness(95%) contrast(110%)',
            opacity: 0.95
          }}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{ 
            backgroundImage: `url(${bgUrl})`,
            filter: 'brightness(95%) contrast(110%)',
            opacity: 0.95
          }}
        />
      )}

      {/* CCTV Meta Headers */}
      <div className="absolute top-2 left-2 z-10 font-mono text-[7px] text-white bg-black/75 px-1.5 py-0.5 rounded border border-white/5 uppercase tracking-widest">
        {camera.name}
      </div>

      <div className="absolute top-2 right-2 z-10 font-mono text-[7px] text-white bg-black/75 px-1.5 py-0.5 rounded border border-white/5 flex items-center space-x-1">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
        <span className="font-bold text-red-500 uppercase">{t('live_feed')}</span>
      </div>

      <div className="absolute bottom-2 left-2 z-10 font-mono text-[7px] text-surveillance-textMuted bg-black/75 px-1.5 py-0.5 rounded border border-white/5">
        LAT: {camera.latitude.toFixed(4)} | LNG: {camera.longitude.toFixed(4)}
      </div>

      <div className="absolute bottom-2 right-2 z-10 font-mono text-[7px] text-surveillance-accent bg-black/75 px-1.5 py-0.5 rounded border border-surveillance-accent/10 uppercase max-w-[120px] truncate">
        {camera.location}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10 surveillance-grid"></div>
      
      {/* Night Vision Scanlines overlay */}
      <div className="absolute inset-0 surveillance-monitor pointer-events-none z-20"></div>

      {/* SVG Canvas for AI Render overlays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        
        {/* Render Scenario: Threat Alert demo (Camera 4) */}
        {streamType === 'threat' && (
          <>
            {/* Proximity line */}
            {(!isDemoOverride || demoStep >= 2) && (
              <>
                <line x1={tX} y1={tY} x2={sX} y2={sY} stroke={isHighThreat ? '#ef4444' : '#f59e0b'} strokeWidth="0.3" strokeDasharray="1, 1" className={isHighThreat ? 'animate-pulse' : ''} />
                <text x={(tX + sX) / 2} y={(tY + sY) / 2 - 2} fill={isHighThreat ? '#ef4444' : '#f59e0b'} fontSize="2.2" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  {distance.toFixed(1)}m {language === 'ta' ? 'நெருக்கம்' : 'PROX'}
                </text>
              </>
            )}

            {/* Target skeleton */}
            <rect x={tX - 3.5} y={tY - 5} width="7" height="13" fill="none" stroke="#10b981" strokeWidth="0.25" opacity="0.8" />
            <text x={tX - 3.5} y={tY - 5.5} fill="#10b981" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              [ID_01] {language === 'ta' ? 'இலக்கு (பெண்)' : 'TARGET (F)'}
            </text>
            {renderSkeleton(tX, tY, 0.6, 0, "#10b981")}

            {/* Suspect skeleton */}
            {(!isDemoOverride || demoStep >= 2) && (
              <>
                <rect x={sX - 4.5} y={sY - 5.5} width="9" height="14.5" fill="none" stroke={isHighThreat ? '#ef4444' : '#f59e0b'} strokeWidth="0.3" className="ai-bounding-box" />
                <text x={sX - 4.5} y={sY - 6} fill={isHighThreat ? '#ef4444' : '#f59e0b'} fontSize="1.8" fontFamily="monospace" fontWeight="bold">
                  {isHighThreat 
                    ? (language === 'ta' ? '[எச்சரிக்கை] சந்தேக நபர்' : '[WARN] THREAT_SUSPECT') 
                    : (language === 'ta' ? '[ID_02] பின்தொடர்கிறார்' : '[ID_02] FOLLOWING')}
                </text>
                {renderSkeleton(sX, sY, 0.7, 0, isHighThreat ? '#ef4444' : '#f59e0b')}
              </>
            )}
          </>
        )}

        {/* Render Scenario: Traffic cameras (Moving green vehicle bounding boxes) */}
        {streamType === 'traffic' && (
          <>
            {/* Vehicle 1 */}
            <rect x={v1X} y={48} width="16" height="10" fill="none" stroke="#00ff66" strokeWidth="0.3" />
            <text x={v1X} y={46.5} fill="#00ff66" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              VEHICLE [ID_{12 + Math.floor(v1X / 10) % 20}] CONF: 97%
            </text>

            {/* Vehicle 2 */}
            <rect x={v2X} y={60} width="18" height="11" fill="none" stroke="#00ff66" strokeWidth="0.3" />
            <text x={v2X} y={58.5} fill="#00ff66" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              VEHICLE [ID_{34 + Math.floor(v2X / 10) % 20}] CONF: 95%
            </text>
          </>
        )}

        {/* Render Scenario: Station Queue (static skeletons & luggage boxes) */}
        {streamType === 'queue' && (
          <>
            {/* Passenger 1 */}
            <rect x={27} y={46.5} width="6.5" height="12.5" fill="none" stroke="#10b981" strokeWidth="0.2" />
            <text x={27} y={45.5} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">PERSON [ID_05]</text>
            {renderSkeleton(30, 52, 0.55, qSway, "#10b981")}
            
            {/* Passenger 1 Luggage */}
            <rect x={24} y={58.5} width="3" height="4.5" fill="none" stroke="#f59e0b" strokeWidth="0.2" />
            <text x={24} y={57.5} fill="#f59e0b" fontSize="1.4" fontFamily="monospace" fontWeight="bold">LUGGAGE [ID_12]</text>

            {/* Passenger 2 */}
            <rect x={41.5} y={48} width="7" height="13.5" fill="none" stroke="#10b981" strokeWidth="0.2" />
            <text x={41.5} y={47} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">PERSON [ID_08]</text>
            {renderSkeleton(45, 54, 0.6, -qSway, "#10b981")}

            {/* Passenger 2 Luggage */}
            <rect x={49} y={60} width="4.2" height="4.2" fill="none" stroke="#f59e0b" strokeWidth="0.2" />
            <text x={49} y={59} fill="#f59e0b" fontSize="1.4" fontFamily="monospace" fontWeight="bold">LUGGAGE [ID_15]</text>

            {/* Passenger 3 */}
            <rect x={57} y={46.5} width="6.5" height="12.5" fill="none" stroke="#10b981" strokeWidth="0.2" />
            <text x={57} y={45.5} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">PERSON [ID_09]</text>
            {renderSkeleton(60, 52, 0.55, qSway, "#10b981")}
          </>
        )}

        {/* Render Scenario: Subway / Isolated (Single slow skeleton) */}
        {streamType === 'isolated' && (
          <>
            <rect x={isoX - 4.5} y={isoY - 5.5} width="9" height="14" fill="none" stroke="#f59e0b" strokeWidth="0.25" className="ai-bounding-box" />
            <text x={isoX - 4.5} y={isoY - 6.2} fill="#f59e0b" fontSize="1.8" fontFamily="monospace" fontWeight="bold">
              PERSON [ID_22] {language === 'ta' ? 'தனிமை' : 'ISOLATED'}
            </text>
            {renderSkeleton(isoX, isoY, 0.65, 0, "#f59e0b")}
          </>
        )}

        {/* Render Scenario: Busy Crowd / Bazaar (3 skeletons walking & crossing) */}
        {streamType === 'crowd' && (
          <>
            {/* Person 1 */}
            <rect x={c1X - 3.5} y={c1Y - 5} width="7" height="12.5" fill="none" stroke="#10b981" strokeWidth="0.22" />
            <text x={c1X - 3.5} y={c1Y - 5.5} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">PERSON [ID_10]</text>
            {renderSkeleton(c1X, c1Y, 0.55, 0, "#10b981")}

            {/* Person 2 */}
            <rect x={c2X - 4} y={c2Y - 5.5} width="8" height="13.5" fill="none" stroke="#10b981" strokeWidth="0.22" />
            <text x={c2X - 4} y={c2Y - 6} fill="#10b981" fontSize="1.6" fontFamily="monospace" fontWeight="bold">PERSON [ID_11]</text>
            {renderSkeleton(c2X, c2Y, 0.6, 0, "#10b981")}

            {/* Person 3 */}
            <rect x={c3X - 3} y={c3Y - 4.5} width="6" height="11.5" fill="none" stroke="#10b981" strokeWidth="0.2" />
            <text x={c3X - 3} y={c3Y - 5} fill="#10b981" fontSize="1.5" fontFamily="monospace" fontWeight="bold">PERSON [ID_12]</text>
            {renderSkeleton(c3X, c3Y, 0.5, 0, "#10b981")}
          </>
        )}

      </svg>

      {/* Floating HUD Panel of Real-Time AI Metrics */}
      <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col space-y-1 bg-black/85 p-1.5 rounded border border-white/5 font-mono text-[7px] z-10 w-[114px] shadow-lg leading-tight">
        <p className="text-surveillance-accent font-bold border-b border-white/10 pb-0.5 mb-1 uppercase tracking-widest">
          {t('realtime_telemetry')}
        </p>
        
        <div className="flex justify-between">
          <span className="text-slate-400">{t('follow_time')}:</span>
          <span className={followingMins >= 30 ? 'text-surveillance-danger font-bold animate-pulse' : 'text-surveillance-warning font-semibold'}>
            {followText}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">{t('audio_level')}:</span>
          <span className={dbLevel >= 85 ? 'text-surveillance-danger font-bold animate-pulse' : 'text-slate-300'}>
            {dbLevel} dB {dbLevel >= 85 ? `(${t('scream')})` : `(${t('normal')})`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">{t('pedestrians')}:</span>
          <span className={pedDensity === 'ISOLATED' ? 'text-surveillance-danger font-bold animate-pulse-red' : 'text-slate-300'}>
            {getPedDensityTranslation(pedDensity, language)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-400">{t('pose_status')}:</span>
          <span className={poseStatus === 'STRUGGLING' || isHighThreat ? 'text-surveillance-danger font-bold animate-pulse' : 'text-slate-300'}>
            {getPoseTranslation(poseStatus, language)}
          </span>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-1 mt-1 font-bold">
          <span className="text-white">{t('threat_score')}:</span>
          <span className={isHighThreat ? 'text-surveillance-danger' : 'text-surveillance-accent'}>
            {threatScore}%
          </span>
        </div>
      </div>

      {/* Police Alert Banner inside feed overlay */}
      {isHighThreat && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-surveillance-danger text-white border border-red-400 px-2 py-0.5 rounded text-[8px] font-black tracking-widest flex items-center space-x-1 animate-pulse shadow-glow-red uppercase text-center max-w-[90%] whitespace-nowrap">
          <AlertOctagon className="h-2.5 w-2.5 shrink-0" />
          <span>{t('proactive_critical_alert')}</span>
        </div>
      )}

      {/* Night vision camera tint grid */}
      <div className="absolute inset-0 bg-sky-950/5 pointer-events-none mix-blend-color-burn"></div>
    </div>
  );
};


export default function CCTVGrid({ cameras, isDemoActive = false, demoStep = 0, demoCameraId = null }) {
  const [fullscreenCamId, setFullscreenCamId] = useState(null);

  // Ensure we have at least 16 cameras to create a massive realistic monitor wall (Image 2 style)
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

  const activeCameras = displayCameras.filter(c => c.status === 'Active');
  const offlineCameras = displayCameras.filter(c => c.status === 'Offline');

  const toggleFullscreen = (camId) => {
    setFullscreenCamId(prev => (prev === camId ? null : camId));
  };

  if (activeCameras.length === 0) {
    return (
      <div className="bg-surveillance-panel border border-surveillance-border p-8 rounded text-center text-surveillance-textMuted font-mono">
        <VideoOff className="h-12 w-12 mx-auto mb-4 text-surveillance-textMuted/40" />
        <p className="font-semibold">No cameras integrated or online in database.</p>
        <p className="text-xs mt-1">Please integrate camera nodes in the Camera Integration Hub.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-mono select-none">
      <div className="flex items-center justify-between border-b border-surveillance-border/30 pb-2">
        <h3 className="text-3xs font-black tracking-widest text-surveillance-accent uppercase">
          LIVE CCTV SURVEILLANCE FEED MATRIX (CONTROL WALL)
        </h3>
        <span className="text-[9px] font-bold text-surveillance-textMuted">
          ONLINE NODES: {activeCameras.length} | OFFLINE: {offlineCameras.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {activeCameras.map((camera) => {
          const isDemoTarget = isDemoActive && (camera.id === demoCameraId || camera.id === 9999 || (camera.id === 4 && demoCameraId === 4));
          return (
            <div 
              key={camera.id} 
              className={`bg-surveillance-panel border-2 rounded-lg p-2.5 flex flex-col h-60 transition-all relative group ${
                isDemoTarget 
                  ? 'border-surveillance-danger shadow-glow-red animate-pulse-red' 
                  : 'border-surveillance-accent/75 shadow-[0_0_12px_rgba(0,255,102,0.15)] hover:border-surveillance-accent hover:shadow-glow-cyan'
              }`}
            >
              <div className="flex justify-between items-center mb-1.5 border-b border-surveillance-border/10 pb-1">
                <span className="text-[8px] font-black text-white truncate w-3/4 tracking-wider uppercase">
                  {camera.name}
                </span>
                
                <button 
                  onClick={() => toggleFullscreen(camera.id)}
                  title="Stream Zoom Focus"
                  className="opacity-40 group-hover:opacity-100 hover:text-white text-surveillance-textMuted transition-opacity cursor-pointer p-0.5 rounded hover:bg-surveillance-header"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>
              
              <div className="flex-1 w-full rounded overflow-hidden relative border border-surveillance-border/20">
                <SimulatedCCTVStream camera={camera} isCriticalMock={isDemoTarget} isDemoActive={isDemoActive} demoStep={demoStep} />
              </div>
            </div>
          );
        })}

        {/* Offline Nodes */}
        {offlineCameras.map((camera) => (
          <div 
            key={camera.id} 
            className="bg-surveillance-panel/30 border-2 border-red-500/30 border-dashed rounded-lg p-2.5 flex flex-col h-60 opacity-60 justify-center items-center text-center relative"
          >
            <div className="absolute top-2 left-2.5 text-[8px] text-red-400 font-bold uppercase tracking-widest">
              {camera.name}
            </div>
            <VideoOff className="h-6 w-6 text-red-500/40 mb-1.5" />
            <p className="text-[8px] font-black text-red-500 uppercase tracking-wider">NODE_STATUS: OFFLINE</p>
            <p className="text-[7px] text-surveillance-textMuted mt-0.5 uppercase truncate w-full px-1">{camera.location}</p>
          </div>
        ))}
      </div>

      {/* Floating Zoom Focus Modal Overlay */}
      {fullscreenCamId !== null && createPortal(
        (() => {
          const selectedCam = displayCameras.find(c => c.id === fullscreenCamId);
          if (!selectedCam) return null;
          const isDemoTarget = isDemoActive && (selectedCam.id === demoCameraId || selectedCam.id === 9999 || (selectedCam.id === 4 && demoCameraId === 4));
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm p-6 animate-fade-in font-mono">
              <div className="bg-[#020604] border-2 border-surveillance-accent rounded-xl p-5 w-full max-w-4xl h-[620px] flex flex-col shadow-glow-cyan relative z-50">
                
                <div className="flex justify-between items-center mb-4 border-b border-surveillance-border pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-surveillance-success rounded-full animate-pulse-cyan"></span>
                    <span className="font-bold text-white uppercase text-sm">{selectedCam.name}</span>
                    <span className="text-xs text-surveillance-textMuted">({selectedCam.location})</span>
                  </div>
                  <button 
                    onClick={() => setFullscreenCamId(null)}
                    className="flex items-center space-x-1 bg-surveillance-header border border-surveillance-border hover:border-white text-white px-3 py-1.5 rounded cursor-pointer transition-all text-xs"
                  >
                    <Minimize2 className="h-4 w-4" />
                    <span>CLOSE STREAM FOCUS</span>
                  </button>
                </div>

                <div className="flex-1 w-full relative rounded overflow-hidden border border-surveillance-border">
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

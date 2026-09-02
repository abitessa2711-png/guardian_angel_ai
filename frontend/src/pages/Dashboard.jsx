import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsWidget from '../components/StatsWidget';
import CCTVGrid from '../components/CCTVGrid';
import HeatmapView from '../components/HeatmapView';
import AnalyticsCharts from '../components/AnalyticsCharts';
import CameraCRUD from '../components/CameraCRUD';
import UserCRUD from '../components/UserCRUD';
import ReportsView from '../components/ReportsView';
import ExplainableAIModal from '../components/ExplainableAIModal';
import AILogicView from '../components/AILogicView';
import LiveSurveillanceView from '../components/LiveSurveillanceView';
import AreaFocusView from '../components/AreaFocusView';
import { ShieldAlert, AlertTriangle, CheckCircle, FileWarning, Eye, AlertOctagon, Truck, CheckSquare, ShieldCheck, Play, Square, SkipForward, SkipBack } from 'lucide-react';

export default function Dashboard() {
  const { user, getAuthHeaders, apiBase, logout } = useAuth();
  const { language, t } = useLanguage();
  const { 
    alerts, 
    newAlertNotification, 
    setNewAlertNotification, 
    loadInitialAlerts,
    updateAlertStatusInState 
  } = useWebSocket();

  const [activeView, setActiveView] = useState('cctv');
  const [cctvLayoutMode, setCctvLayoutMode] = useState('wall');
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [activeFeedTab, setActiveFeedTab] = useState('alerts');

  // Demo simulation state machine
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoIntervalId, setDemoIntervalId] = useState(null);

  const demoSteps = [
    { 
      title: 'System Standard Monitoring', 
      desc: 'Secure status near Rockfort Bazaar. Normal pedestrian flows, low noise level, low threat scores.',
      phase: 'Monitoring',
      sensors: { following: 'NORMAL', acoustic: 'NORMAL', isolation: 'NORMAL', pose: 'NORMAL' },
      threatScore: 20
    },
    { 
      title: 'Step 1: Target Spotted', 
      desc: 'Subject (ID_01, Female) identified near Rockfort Temple Arch Road. Safe status locked.',
      phase: 'Monitoring',
      sensors: { following: 'NORMAL', acoustic: 'NORMAL', isolation: 'NORMAL', pose: 'NORMAL' },
      threatScore: 15
    },
    { 
      title: 'Step 2: Suspect Enters Viewport', 
      desc: 'Suspect (ID_02, Male) detected. Spatial proximity tracking vector lock established.',
      phase: 'Monitoring',
      sensors: { following: 'TRACKING', acoustic: 'NORMAL', isolation: 'NORMAL', pose: 'NORMAL' },
      threatScore: 25
    },
    { 
      title: 'Step 3: Proactive Trajectory Warning', 
      desc: 'Suspect following target continuously. Spatio-temporal coincidence triggers follow timer.',
      phase: 'Tracking',
      sensors: { following: 'WARNING', acoustic: 'NORMAL', isolation: 'NORMAL', pose: 'NORMAL' },
      threatScore: 35
    },
    { 
      title: 'Step 4: Duration Counter Increment', 
      desc: 'Time elapsed. Suspect maintains close range. Following duration ticks past 15 minutes.',
      phase: 'Tracking',
      sensors: { following: 'WARNING', acoustic: 'NORMAL', isolation: 'LOW_LIGHT', pose: 'NORMAL' },
      threatScore: 48
    },
    { 
      title: 'Step 5: Environmental Isolation Analysis', 
      desc: 'Pedestrian density indexes drop. Low-light histogram records high isolation vulnerability.',
      phase: 'Tracking',
      sensors: { following: 'WARNING', acoustic: 'NORMAL', isolation: 'ISOLATED', pose: 'NORMAL' },
      threatScore: 55
    },
    { 
      title: 'Step 6: Target Follow Duration > 30 Mins', 
      desc: 'Following duration reaches 32 minutes. Proactive tracker escalates to ALERT condition.',
      phase: 'Tracking',
      sensors: { following: 'CRITICAL', acoustic: 'NORMAL', isolation: 'ISOLATED', pose: 'NORMAL' },
      threatScore: 68
    },
    { 
      title: 'Step 7: Acoustic Sensor Spike', 
      desc: 'Audio sensor registers 89dB amplitude spike. Screaming waveform detected.',
      phase: 'Distress',
      sensors: { following: 'CRITICAL', acoustic: 'SCREAM_DETECTED', isolation: 'ISOLATED', pose: 'NORMAL' },
      threatScore: 79
    },
    { 
      title: 'Step 8: Voice Threat Classification', 
      desc: 'Whisper transcription processes distress audio. repeated screaming & abusive Tamil language detected.',
      phase: 'Distress',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'NORMAL' },
      threatScore: 85
    },
    { 
      title: 'Step 9: Pose Estimator Struggle Lock', 
      desc: 'YOLO Pose keypoint tracking classifies body interactions as aggressive grabbing/struggling.',
      phase: 'Distress',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'STRUGGLE' },
      threatScore: 95
    },
    { 
      title: 'Step 10: Decision Fusion: Critical Alarm', 
      desc: 'Cognitive engine combines all sensors. Risk rises to 95%. Flashing HIGH RISK ALERT triggered.',
      phase: 'Dispatch',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'CRITICAL' },
      threatScore: 95
    },
    { 
      title: 'Step 11: Patrol Unit Identification', 
      desc: 'Surveillance center locates nearest patrol vehicle #04 at Trichy Railway Junction Station.',
      phase: 'Dispatch',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'CRITICAL' },
      threatScore: 95
    },
    { 
      title: 'Step 12: Route GIS Routing Active', 
      desc: 'Automated patrol car dispatch triggered. Pulse routing path highlighted on Trichy GIS map.',
      phase: 'Dispatch',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'CRITICAL' },
      threatScore: 95
    },
    { 
      title: 'Step 13: Tactical Dispatch Secured', 
      desc: 'Patrol dispatched. Emergency alert broadcasted. Live feed overlays monitor until unit arrival.',
      phase: 'Dispatch',
      sensors: { following: 'CRITICAL', acoustic: 'CRITICAL', isolation: 'ISOLATED', pose: 'CRITICAL' },
      threatScore: 95
    }
  ];

  const getSensorBadge = (status) => {
    switch (status) {
      case 'NORMAL':
        return { text: '🟢 NORMAL', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'TRACKING':
        return { text: '🟡 TRACKED', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30 animate-pulse' };
      case 'WARNING':
        return { text: '🟡 WARNING', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse' };
      case 'LOW_LIGHT':
        return { text: '🟡 LOW LIGHT', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse' };
      case 'ISOLATED':
        return { text: '🔴 ISOLATED', bg: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse-red' };
      case 'SCREAM_DETECTED':
        return { text: '🔴 SCREAM', bg: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse-red' };
      case 'STRUGGLE':
        return { text: '🔴 STRUGGLING', bg: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse-red' };
      case 'CRITICAL':
        return { text: '🔴 CRITICAL', bg: 'bg-red-500/15 text-red-400 border-red-500/40 animate-pulse-red font-black' };
      default:
        return { text: '🟢 ACTIVE', bg: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' };
    }
  };

  const startDemo = () => {
    if (isDemoActive) {
      stopAutoPlay();
      setIsDemoActive(false);
      setDemoStep(0);
    } else {
      setIsDemoActive(true);
      setDemoStep(1);
    }
  };

  const stopAutoPlay = () => {
    if (demoIntervalId) {
      clearInterval(demoIntervalId);
      setDemoIntervalId(null);
    }
  };

  const toggleAutoPlay = () => {
    if (demoIntervalId) {
      stopAutoPlay();
    } else {
      const id = setInterval(() => {
        setDemoStep(prev => {
          if (prev >= demoSteps.length - 1) {
            clearInterval(id);
            setDemoIntervalId(null);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
      setDemoIntervalId(id);
    }
  };

  const nextStep = () => {
    stopAutoPlay();
    if (demoStep < demoSteps.length - 1) {
      setDemoStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    stopAutoPlay();
    if (demoStep > 0) {
      setDemoStep(prev => prev - 1);
    }
  };

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (demoIntervalId) clearInterval(demoIntervalId);
    };
  }, [demoIntervalId]);

  // Derived state to inject simulated alert / incident when demo is running
  const rockfortCam = cameras.find(c => c.name.includes('ROCKFORT')) || { id: 4 };
  const demoCameraId = rockfortCam.id;

  const demoAlert = (isDemoActive && demoStep >= 10) ? {
    id: 9999,
    camera_id: demoCameraId,
    camera_name: 'CCTV-04 ROCKFORT_TEMPLE_ROAD',
    camera_location: 'Rockfort Temple Bazaar Street',
    risk_score: 95,
    timestamp: new Date().toISOString(),
    status: 'New',
    following_score: 92,
    proximity_score: 96,
    aggression_score: 95,
    explanation: 'PROACTIVE CRITICAL THREAT: Subject followed target for 32 mins | Proximity under 0.8 meters | Isolated dark zone | Acoustic abuse scream detected.',
    explanation_ta: 'தீவிர அபாய எச்சரிக்கை: நபர் 32 நிமிடங்களாக இலக்கை பின்தொடர்கிறார் | நெருக்கம் 0.8 மீட்டருக்கும் குறைவு | ஆட்கள் நடமாட்டம் அற்ற பகுதி | அலறல் சத்தம் கண்டறியப்பட்டது.',
    evidence_clip_url: '/evidence/mock_clip_1.mp4'
  } : null;

  const displayAlerts = demoAlert ? [demoAlert, ...alerts] : alerts;

  const demoIncident = (isDemoActive && demoStep >= 12) ? {
    id: 9999,
    alert_id: 9999,
    camera_name: 'CCTV-04 ROCKFORT_TEMPLE_ROAD',
    camera_location: 'Rockfort Temple Bazaar Street',
    escalation_timestamp: new Date().toISOString(),
    status: demoStep === 13 ? 'Dispatched' : 'Escalated'
  } : null;

  const displayIncidents = demoIncident ? [demoIncident, ...incidents] : incidents;

  const displayStats = stats ? {
    ...stats,
    today_alerts: (isDemoActive && demoStep >= 10) ? stats.today_alerts + 1 : stats.today_alerts,
    high_risk_incidents: (isDemoActive && demoStep >= 10) ? stats.high_risk_incidents + 1 : stats.high_risk_incidents
  } : stats;

  // Load dashboard data on mount and active view change
  const loadDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      
      // Fetch cameras
      const camRes = await fetch(`${apiBase}/cameras`, { headers });
      if (camRes.status === 401) {
        logout();
        return;
      }
      if (camRes.ok) {
        const camData = await camRes.json();
        setCameras(camData);
      }

      // Fetch stats
      const statsRes = await fetch(`${apiBase}/dashboard/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch analytics
      const analyticsRes = await fetch(`${apiBase}/analytics/summary`, { headers });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      // Fetch incidents
      const incRes = await fetch(`${apiBase}/incidents`, { headers });
      if (incRes.ok) {
        const incData = await incRes.json();
        setIncidents(incData);
      }

      // Fetch users if admin
      if (user?.role === 'ADMIN') {
        const usersRes = await fetch(`${apiBase}/users`, { headers });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      }

    } catch (err) {
      console.error('Error loading surveillance metrics:', err);
    }
  };

  useEffect(() => {
    const headers = getAuthHeaders();
    loadInitialAlerts(headers);
    loadDashboardData();

    // Listen to real-time updates from WebSocketContext
    const handleUpdateEvent = () => {
      loadDashboardData();
    };
    window.addEventListener('surveillance-update', handleUpdateEvent);

    // Auto-refresh stats and metrics every 10 seconds to keep charts and stats synced
    const pollInterval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('surveillance-update', handleUpdateEvent);
    };
  }, [activeView]);

  // Resolve alert action
  const handleResolveAlert = async (alertId) => {
    setActionError(null);
    try {
      const response = await fetch(`${apiBase}/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to resolve safety alert.');
      }

      updateAlertStatusInState(alertId, 'Resolved');
      loadDashboardData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Escalate alert to incident action
  const handleEscalateAlert = async (alertId) => {
    setActionError(null);
    try {
      const response = await fetch(`${apiBase}/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to escalate safety alert.');
      }

      updateAlertStatusInState(alertId, 'Escalated');
      loadDashboardData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDispatchPatrol = async (incidentId) => {
    setActionError(null);
    try {
      const response = await fetch(`${apiBase}/incidents/${incidentId}/dispatch`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to dispatch patrol car.');
      }

      loadDashboardData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleResolveIncident = async (incidentId) => {
    const notes = prompt("Enter resolution notes for police archives:");
    if (notes === null) return;
    
    setActionError(null);
    try {
      const response = await fetch(`${apiBase}/incidents/${incidentId}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ resolution_notes: notes || "Resolved by control room operator." })
      });

      if (!response.ok) {
        throw new Error('Failed to resolve police incident.');
      }

      loadDashboardData();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const openExplainableAI = (alert) => {
    setSelectedAlert(alert);
    setIsXAIModalOpen(true);
  };

  const getRiskBorder = (score) => {
    if (score >= 75) return 'border-surveillance-danger/40 bg-surveillance-danger/5 shadow-glow-red';
    if (score >= 45) return 'border-surveillance-warning/40 bg-surveillance-warning/5';
    return 'border-surveillance-border bg-surveillance-panel/60';
  };

  const getRiskScoreBadge = (score) => {
    if (score >= 75) return 'bg-surveillance-danger text-white';
    if (score >= 45) return 'bg-surveillance-warning text-black font-semibold';
    return 'bg-surveillance-success text-white';
  };

  return (
    <div className="min-h-screen bg-surveillance-bg flex flex-col overflow-hidden select-none font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Primary View Area */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          
          {/* Background grid overlay */}
          <div className="absolute inset-0 surveillance-grid opacity-10 pointer-events-none"></div>

          {/* Toast Notification Banner for incoming Live WebSocket alerts */}
          {newAlertNotification && (
            <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-surveillance-panel border-2 border-surveillance-danger p-4 rounded-lg shadow-glow-red flex items-start space-x-3.5 animate-bounce font-mono">
              <div className="bg-surveillance-danger/10 text-surveillance-danger p-2 rounded animate-pulse">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div className="flex-1 text-2xs text-white">
                <p className="font-black text-xs text-red-500 uppercase tracking-wider animate-pulse">CRITICAL THREAT ALERT</p>
                <p className="mt-1 font-semibold">{newAlertNotification.camera_location}</p>
                <p className="text-3xs text-surveillance-textMuted mt-0.5">CAMERA: {newAlertNotification.camera_name}</p>
                <div className="flex justify-between items-center mt-3 border-t border-surveillance-border/50 pt-2">
                  <span className="bg-surveillance-danger px-1.5 py-0.5 rounded text-white text-3xs font-bold font-mono">
                    RISK: {newAlertNotification.risk_score}%
                  </span>
                  <button 
                    onClick={() => {
                      openExplainableAI(newAlertNotification);
                      setNewAlertNotification(null);
                    }}
                    className="text-surveillance-accent hover:underline text-3xs font-bold flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>VIEW LIVE EVIDENCE</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW SWITCHER */}
          <div className="relative z-10 space-y-6">
            
            {/* SCREEN 1: CAMERA MONITORING CENTER (Default Home) */}
            {activeView === 'cctv' && (
              <div className="space-y-6">
                
                {/* Mode Selector Panel */}
                <div className="flex justify-between items-center bg-surveillance-panel border border-surveillance-border px-4 py-2 rounded-lg">
                  <div className="font-mono text-3xs text-surveillance-textMuted uppercase flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-surveillance-success rounded-full animate-pulse-cyan shrink-0"></span>
                    <span>{t('system_status')}: {t('secure')}</span>
                  </div>
                  
                  {/* Toggle buttons */}
                  <div className="flex bg-surveillance-header border border-surveillance-border rounded p-0.5 font-mono text-[9px]">
                    <button
                      onClick={() => setCctvLayoutMode('wall')}
                      className={`px-2.5 py-0.5 rounded cursor-pointer transition-all uppercase font-bold ${
                        cctvLayoutMode === 'wall'
                          ? 'bg-surveillance-accent text-black font-black'
                          : 'text-surveillance-textMuted hover:text-white'
                      }`}
                    >
                      {language === 'ta' ? 'கண்காணிப்புச் சுவர்' : 'Wall Monitor Mode'}
                    </button>
                    <button
                      onClick={() => setCctvLayoutMode('console')}
                      className={`px-2.5 py-0.5 rounded cursor-pointer transition-all uppercase font-bold ${
                        cctvLayoutMode === 'console'
                          ? 'bg-surveillance-accent text-black font-black'
                          : 'text-surveillance-textMuted hover:text-white'
                      }`}
                    >
                      {language === 'ta' ? 'ஆபரேட்டர் கன்சோல்' : 'Operator Console Mode'}
                    </button>
                  </div>
                </div>

                {cctvLayoutMode === 'wall' ? (
                  /* Wall Monitor Mode: Pure 16 camera cctv grid */
                  <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
                    <CCTVGrid cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} demoCameraId={demoCameraId} />
                  </div>
                ) : (
                  /* Operator Console Mode: Stats, Grid, Simulator, Map, Alerts Feed */
                  <>
                    <StatsWidget stats={displayStats} />

                    <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
                      <CCTVGrid cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} demoCameraId={demoCameraId} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Compact Integrated Trichy GIS Map (4 cols) */}
                  <div className="lg:col-span-4">
                    <HeatmapView 
                      alerts={displayAlerts} 
                      cameras={cameras} 
                      isDemoActive={isDemoActive} 
                      demoStep={demoStep} 
                      inline={true} 
                    />
                  </div>

                  {/* Center: Telemetry Simulation Controller (4 cols) */}
                  <div className="lg:col-span-4">
                    
                    {/* Demo Control Deck (Stacked and compact format) */}
                    <div className="bg-surveillance-panel border border-surveillance-accent/30 rounded-lg p-4.5 shadow-glow-cyan text-white font-mono h-[520px] flex flex-col justify-between">
                      
                      {/* Top Header */}
                      <div className="flex justify-between items-center border-b border-surveillance-border pb-2.5 mb-3.5">
                        <div className="flex items-center space-x-2">
                          <ShieldAlert className="h-4 w-4 text-surveillance-accent animate-pulse" />
                          <div>
                            <h4 className="text-3xs font-bold text-white uppercase tracking-widest leading-none">COMMAND SIMULATOR</h4>
                            <p className="text-[8px] text-surveillance-textMuted uppercase tracking-wider mt-1">PROACTIVE MULTI-SENSOR HUD</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={startDemo}
                            className={`px-2.5 py-1 rounded text-[9px] font-black transition-all cursor-pointer ${
                              isDemoActive ? 'bg-surveillance-danger text-white hover:bg-red-600' : 'bg-surveillance-accent text-white hover:bg-sky-600'
                            }`}
                          >
                            {isDemoActive ? 'STOP' : 'START'}
                          </button>
                          {isDemoActive && (
                            <button
                              onClick={toggleAutoPlay}
                              className="bg-surveillance-header border border-surveillance-border text-white px-2 py-1 rounded text-[8px] font-bold hover:bg-surveillance-border cursor-pointer transition-colors"
                            >
                              {demoIntervalId ? '⏸' : '▶'}
                            </button>
                          )}
                        </div>
                      </div>

                      {isDemoActive ? (
                        <div className="space-y-4 flex-1 flex flex-col justify-between">
                          
                          {/* Stepper HUD Content (Stacked) */}
                          <div className="flex flex-col space-y-3">
                            
                            {/* Part A: Step Progression */}
                            <div className="bg-surveillance-header border border-surveillance-border p-3 rounded-lg flex flex-col justify-between space-y-2">
                              <div>
                                <div className="flex justify-between items-center border-b border-surveillance-border/50 pb-1.5 mb-1.5">
                                  <span className="text-[8px] text-surveillance-textMuted uppercase font-bold">PROGRESS</span>
                                  <span className="bg-surveillance-accent/10 border border-surveillance-accent/30 text-surveillance-accent px-1.5 py-0.5 rounded text-[7px] font-bold uppercase">
                                    {demoSteps[demoStep].phase}
                                  </span>
                                </div>
                                
                                <h5 className="text-[10px] font-black text-surveillance-accent uppercase tracking-wider">{demoSteps[demoStep].title}</h5>
                                <p className="text-3xs text-slate-300 italic leading-relaxed mt-1">
                                  "{demoSteps[demoStep].desc}"
                                </p>
                              </div>

                              <div className="flex justify-between items-center pt-1.5 border-t border-surveillance-border/50">
                                <span className="text-[8px] text-surveillance-textMuted">STEP {demoStep} / 13</span>
                                <div className="flex space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={demoStep === 0}
                                    className="bg-surveillance-panel border border-surveillance-border hover:bg-surveillance-border text-white p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                  >
                                    <SkipBack className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={demoStep === demoSteps.length - 1}
                                    className="bg-surveillance-panel border border-surveillance-border hover:bg-surveillance-border text-white p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                  >
                                    <SkipForward className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Part B: Pipeline Status Board */}
                            <div className="bg-surveillance-header border border-surveillance-border p-3 rounded-lg space-y-2">
                              <p className="text-[8px] text-surveillance-textMuted uppercase font-bold border-b border-surveillance-border/50 pb-1">AI DETECTIONS</p>
                              
                              <div className="flex flex-col space-y-2">
                                {/* Sensor 1 */}
                                <div className="bg-surveillance-panel border border-surveillance-border p-2 rounded text-3xs flex justify-between items-center">
                                  <span className="font-bold text-white uppercase text-[8px]">1. FOLLOW TIMER</span>
                                  <span className={`px-1 rounded text-[7px] font-bold border ${getSensorBadge(demoSteps[demoStep].sensors.following).bg}`}>
                                    {getSensorBadge(demoSteps[demoStep].sensors.following).text}
                                  </span>
                                </div>

                                {/* Sensor 2 */}
                                <div className="bg-surveillance-panel border border-surveillance-border p-2 rounded text-3xs flex justify-between items-center">
                                  <span className="font-bold text-white uppercase text-[8px]">2. ACOUSTIC SCREAM</span>
                                  <span className={`px-1 rounded text-[7px] font-bold border ${getSensorBadge(demoSteps[demoStep].sensors.acoustic).bg}`}>
                                    {getSensorBadge(demoSteps[demoStep].sensors.acoustic).text}
                                  </span>
                                </div>

                                {/* Sensor 3 */}
                                <div className="bg-surveillance-panel border border-surveillance-border p-2 rounded text-3xs flex justify-between items-center">
                                  <span className="font-bold text-white uppercase text-[8px]">3. ISOLATION INDEX</span>
                                  <span className={`px-1 rounded text-[7px] font-bold border ${getSensorBadge(demoSteps[demoStep].sensors.isolation).bg}`}>
                                    {getSensorBadge(demoSteps[demoStep].sensors.isolation).text}
                                  </span>
                                </div>

                                {/* Sensor 4 */}
                                <div className="bg-surveillance-panel border border-surveillance-border p-2 rounded text-3xs flex justify-between items-center">
                                  <span className="font-bold text-white uppercase text-[8px]">4. GESTURE POSE</span>
                                  <span className={`px-1 rounded text-[7px] font-bold border ${getSensorBadge(demoSteps[demoStep].sensors.pose).bg}`}>
                                    {getSensorBadge(demoSteps[demoStep].sensors.pose).text}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Part C: Decision Output */}
                            <div className="bg-surveillance-header border border-surveillance-border p-3 rounded-lg flex flex-col justify-between text-center space-y-2">
                              <div>
                                <div className="flex justify-between text-[8px] text-slate-300 mb-1">
                                  <span>THREAT SCORE</span>
                                  <span className="font-bold">{demoSteps[demoStep].threatScore}%</span>
                                </div>
                                <div className="h-1.5 bg-surveillance-panel rounded overflow-hidden border border-surveillance-border">
                                  <div 
                                    className={`h-full transition-all duration-300 ${
                                      demoSteps[demoStep].threatScore >= 75 
                                        ? 'bg-surveillance-danger shadow-glow-red' 
                                        : demoSteps[demoStep].threatScore >= 45 
                                        ? 'bg-surveillance-warning' 
                                        : 'bg-surveillance-success'
                                    }`} 
                                    style={{ width: `${demoSteps[demoStep].threatScore}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className={`p-1.5 rounded border text-[8px] font-black uppercase tracking-wider ${
                                demoSteps[demoStep].threatScore >= 75
                                  ? 'bg-surveillance-danger/10 border-surveillance-danger text-surveillance-danger animate-pulse'
                                  : demoSteps[demoStep].threatScore >= 45
                                  ? 'bg-surveillance-warning/10 border-surveillance-warning text-surveillance-warning'
                                  : 'bg-surveillance-success/15 border-surveillance-success text-surveillance-success'
                              }`}>
                                {demoSteps[demoStep].threatScore >= 75 ? '🔴 PATROL DISPATCHED' : demoSteps[demoStep].threatScore >= 45 ? '🟡 ELEVATED ALERT' : '🟢 SECURE LEVEL'}
                              </div>
                            </div>

                          </div>

                          {/* Steps Indicator dot path */}
                          <div className="flex space-x-1 pt-1.5 overflow-x-auto justify-between border-t border-surveillance-border/30 mt-1 pb-1">
                            {demoSteps.map((step, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  stopAutoPlay();
                                  setDemoStep(idx);
                                }}
                                title={step.title}
                                className={`w-5.5 h-5.5 rounded-full flex flex-col items-center justify-center font-bold border transition-all cursor-pointer shrink-0 text-[8px] ${
                                  idx === demoStep
                                    ? 'bg-surveillance-accent text-white border-surveillance-accent shadow-glow-cyan font-black scale-105'
                                    : idx < demoStep
                                    ? 'bg-surveillance-success/20 text-surveillance-success border-surveillance-success/50'
                                    : 'bg-surveillance-header text-surveillance-textMuted border-surveillance-border hover:border-white'
                                }`}
                              >
                                <span>{idx}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[9px] text-surveillance-textMuted uppercase py-6 text-center leading-relaxed">SIMULATOR IDLE.<br/>CLICK "START" TO COMMENCE THE 14-STEP TACTICAL SAFETY SEQUENCE.</p>
                      )}
                    </div>

                  </div>

                  {/* Right Column: Real-Time Alerts Feed & Dispatches (4 cols) */}
                  <div className="lg:col-span-4">
                    <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5 flex flex-col h-[520px]">
                      
                      <div className="flex items-center justify-between border-b border-surveillance-border pb-3 mb-4">
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setActiveFeedTab('alerts')}
                            className={`text-2xs font-bold font-mono tracking-wider uppercase pb-1 transition-all cursor-pointer border-b-2 ${
                              activeFeedTab === 'alerts' 
                                ? 'text-surveillance-accent border-surveillance-accent font-semibold' 
                                : 'text-surveillance-textMuted border-transparent hover:text-white'
                            }`}
                          >
                            ALERTS FEED ({displayAlerts.filter(a => a.status === 'New').length})
                          </button>
                          <button
                            onClick={() => setActiveFeedTab('dispatches')}
                            className={`text-2xs font-bold font-mono tracking-wider uppercase pb-1 transition-all cursor-pointer border-b-2 ${
                              activeFeedTab === 'dispatches' 
                                ? 'text-surveillance-accent border-surveillance-accent font-semibold' 
                                : 'text-surveillance-textMuted border-transparent hover:text-white'
                            }`}
                          >
                            PATROL DISPATCHES ({displayIncidents.filter(i => i.status !== 'Resolved').length})
                          </button>
                        </div>
                        {activeFeedTab === 'alerts' ? (
                          <span className="w-2 h-2 bg-surveillance-danger rounded-full animate-ping"></span>
                        ) : (
                          <span className="w-2 h-2 bg-surveillance-accent rounded-full animate-pulse-cyan"></span>
                        )}
                      </div>

                      {actionError && (
                        <div className="p-2.5 mb-3 bg-surveillance-danger/10 border border-surveillance-danger/30 rounded text-3xs text-surveillance-danger">
                          ERROR: {actionError}
                        </div>
                      )}

                      {/* View Tab Switcher logic */}
                      {activeFeedTab === 'alerts' ? (
                        /* Alerts List */
                        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 font-sans">
                          {displayAlerts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-surveillance-textMuted py-16">
                              <ShieldAlert className="h-10 w-10 text-surveillance-textMuted/30 mb-2" />
                              <p className="text-xs font-bold">No active safety alerts triggered yet.</p>
                              <p className="text-4xs mt-1 leading-normal uppercase">
                                CCTV streams are currently evaluated. AI engine loop active.
                              </p>
                            </div>
                          ) : (
                            displayAlerts.map((alert) => (
                              <div 
                                key={alert.id} 
                                className={`border rounded-lg p-3.5 transition-all text-2xs ${getRiskBorder(alert.risk_score)}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-white text-xs">{alert.camera_location}</span>
                                    <p className="text-3xs text-surveillance-textMuted mt-0.5 uppercase font-mono">
                                      CAM: {alert.camera_name}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-3xs font-bold font-mono ${getRiskScoreBadge(alert.risk_score)}`}>
                                    RISK {alert.risk_score}%
                                  </span>
                                </div>

                                <p className="mt-2 text-slate-300 italic text-3xs border-l border-surveillance-border pl-2.5 py-0.5">
                                  {alert.explanation || 'Pedestrian anomaly alert.'}
                                </p>

                                <div className="mt-3 flex justify-between items-center text-3xs pt-2 border-t border-surveillance-border/40">
                                  <span className="text-slate-400 font-mono">
                                    {new Date(alert.timestamp).toLocaleTimeString()}
                                  </span>
                                  
                                  <div className="space-y-1.5 flex flex-col items-end">
                                    <button 
                                      onClick={() => openExplainableAI(alert)}
                                      className="px-2 py-1 bg-surveillance-header border border-surveillance-border hover:bg-surveillance-border rounded text-white flex items-center space-x-1 cursor-pointer transition-all inline-block text-3xs font-mono"
                                      title="View Evidence & AI Explainability"
                                    >
                                      <Eye className="h-3 w-3 inline-block" />
                                      <span>EVIDENCE</span>
                                    </button>

                                    {alert.status === 'New' && (
                                      <div className="space-x-1 flex">
                                        <button 
                                          onClick={() => handleResolveAlert(alert.id)}
                                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 text-emerald-400 rounded cursor-pointer transition-all inline-block text-3xs"
                                        >
                                          RESOLVE
                                        </button>
                                        <button 
                                          onClick={() => handleEscalateAlert(alert.id)}
                                          className="px-2 py-1 bg-surveillance-danger/10 hover:bg-surveillance-danger hover:text-white border border-surveillance-danger/30 text-surveillance-danger rounded cursor-pointer transition-all inline-block text-3xs"
                                        >
                                          ESCALATE
                                        </button>
                                      </div>
                                    )}

                                    {alert.status === 'Escalated' && (
                                      <span className="text-surveillance-danger font-bold uppercase tracking-wide">
                                        ESCALATED
                                      </span>
                                    )}

                                    {alert.status === 'Resolved' && (
                                      <span className="text-surveillance-success font-bold uppercase tracking-wide">
                                        RESOLVED
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        /* Patrol Dispatches List */
                        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 font-sans">
                          {displayIncidents.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-surveillance-textMuted py-16">
                              <Truck className="h-10 w-10 text-surveillance-textMuted/30 mb-2" />
                              <p className="text-xs font-bold">No patrol dispatches generated.</p>
                              <p className="text-4xs mt-1 leading-normal uppercase">
                                Escalated alarms will appear here for unit routing.
                              </p>
                            </div>
                          ) : (
                            displayIncidents.map((incident) => (
                              <div 
                                key={incident.id} 
                                className={`border rounded-lg p-3.5 transition-all text-2xs ${
                                  incident.status === 'Resolved' 
                                    ? 'border-surveillance-border bg-surveillance-panel/40 opacity-70' 
                                    : incident.status === 'Dispatched' 
                                    ? 'border-surveillance-warning/30 bg-surveillance-warning/5 shadow-glow-amber' 
                                    : 'border-surveillance-danger/30 bg-surveillance-danger/5'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-bold text-white text-xs">{incident.camera_location}</span>
                                    <p className="text-3xs text-surveillance-textMuted mt-0.5 uppercase font-mono">
                                      INCIDENT #{incident.id} | CAM: {incident.camera_name}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-3xs font-bold font-mono ${
                                    incident.status === 'Resolved' 
                                      ? 'bg-surveillance-success text-white' 
                                      : incident.status === 'Dispatched' 
                                      ? 'bg-surveillance-warning text-black font-semibold animate-pulse' 
                                      : 'bg-surveillance-danger text-white'
                                  }`}>
                                    {incident.status.toUpperCase()}
                                  </span>
                                </div>

                                {/* Progress Timeline */}
                                <div className="mt-2.5 flex items-center space-x-1.5 font-mono text-4xs border-b border-surveillance-border/40 pb-2">
                                  <span className={`px-1 rounded ${incident.status === 'Escalated' ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30' : 'text-slate-500'}`}>ESCALATED</span>
                                  <span>&rarr;</span>
                                  <span className={`px-1 rounded ${incident.status === 'Dispatched' ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 animate-pulse' : 'text-slate-500'}`}>DISPATCHED</span>
                                  <span>&rarr;</span>
                                  <span className={`px-1 rounded ${incident.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' : 'text-slate-500'}`}>RESOLVED</span>
                                </div>

                                {incident.resolution_notes && (
                                  <p className="mt-2 text-slate-300 italic text-3xs border-l border-surveillance-border pl-2.5 py-0.5">
                                    RESOLUTION LOG: {incident.resolution_notes}
                                  </p>
                                )}

                                <div className="mt-3 flex justify-between items-center text-3xs pt-1">
                                  <span className="text-slate-400 font-mono">
                                    {new Date(incident.escalation_timestamp).toLocaleTimeString()}
                                  </span>
                                  
                                  <div className="space-y-1 flex flex-col items-end">
                                    {incident.status === 'Escalated' && (
                                      <button 
                                        onClick={() => handleDispatchPatrol(incident.id)}
                                        className="px-2.5 py-1 bg-surveillance-warning text-black font-semibold hover:bg-yellow-600 rounded cursor-pointer transition-all flex items-center space-x-1 inline-block text-3xs"
                                      >
                                        <Truck className="h-3 w-3 inline-block" />
                                        <span>DISPATCH PATROL</span>
                                      </button>
                                    )}

                                    {incident.status === 'Dispatched' && (
                                      <button 
                                        onClick={() => handleResolveIncident(incident.id)}
                                        className="px-2.5 py-1 bg-surveillance-success hover:bg-emerald-600 text-white rounded cursor-pointer transition-all flex items-center space-x-1 inline-block shadow-glow-cyan text-3xs"
                                      >
                                        <CheckSquare className="h-3 w-3 inline-block" />
                                        <span>RESOLVE CASE</span>
                                      </button>
                                    )}

                                    {incident.status === 'Resolved' && (
                                      <span className="text-surveillance-success font-bold uppercase tracking-wider flex items-center space-x-0.5">
                                        <ShieldCheck className="h-3.5 w-3.5 inline-block text-surveillance-success" />
                                        <span>CASE ARCHIVED</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                    </div>
                  </div>

                </div>
                </>
                )}

              </div>
            )}

            {/* SCREEN 2: EXECUTIVE MONITORING DASHBOARD */}
            {activeView === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">EXECUTIVE MONITORING DASHBOARD</h2>
                  <p className="text-3xs text-surveillance-textMuted mt-0.5">GOVERNMENT ANALYTICS & THREAT REPORT SEGMENTS</p>
                </div>
                <StatsWidget stats={displayStats} />
                <AnalyticsCharts data={analytics} />
                
                {/* Recent Alerts & Incident Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Recent Alerts Table (8 cols) */}
                  <div className="lg:col-span-8 bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
                    <p className="text-xs font-bold text-white uppercase tracking-wider border-b border-surveillance-border pb-3 mb-4">RECENT ALERTS LOG</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-3xs font-mono">
                        <thead>
                          <tr className="border-b border-surveillance-border text-surveillance-textMuted">
                            <th className="py-2 px-3">CAM</th>
                            <th className="py-2 px-3">LOCATION</th>
                            <th className="py-2 px-3">RISK</th>
                            <th className="py-2 px-3">TIMESTAMP</th>
                            <th className="py-2 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surveillance-border/50 text-white">
                          {displayAlerts.slice(0, 5).map((alert) => (
                            <tr key={alert.id} className="hover:bg-surveillance-header/40 transition-colors">
                              <td className="py-2.5 px-3 font-bold">{alert.camera_name}</td>
                              <td className="py-2.5 px-3 text-slate-300">{alert.camera_location}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${
                                  alert.risk_score >= 75 ? 'bg-surveillance-danger text-white' : 'bg-surveillance-success text-white'
                                }`}>
                                  {alert.risk_score}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-surveillance-textMuted">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                              <td className="py-2.5 px-3 uppercase text-surveillance-accent font-bold">{alert.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Incident Timeline (4 cols) */}
                  <div className="lg:col-span-4 bg-surveillance-panel border border-surveillance-border rounded-lg p-5 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider border-b border-surveillance-border pb-3 mb-4">LIVE INCIDENT TIMELINE</p>
                      <div className="space-y-3.5">
                        {displayIncidents.slice(0, 3).map((incident) => (
                          <div key={incident.id} className="border-l-2 border-surveillance-accent pl-3 text-3xs space-y-1">
                            <p className="font-bold text-white uppercase">INCIDENT #{incident.id} - {incident.status}</p>
                            <p className="text-slate-400 italic">"Patrol dispatch initiated near {incident.camera_location}."</p>
                            <p className="text-[9px] text-surveillance-textMuted">{new Date(incident.escalation_timestamp).toLocaleTimeString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 3: LIVE SURVEILLANCE TARGET ANALYZER */}
            {activeView === 'live_surveillance' && (
              <LiveSurveillanceView cameras={cameras} />
            )}

            {/* NEW VIEW: AREA FOCUS MONITOR */}
            {activeView === 'area_focus' && (
              <AreaFocusView 
                cameras={cameras} 
                isDemoActive={isDemoActive} 
                demoStep={demoStep} 
                demoCameraId={demoCameraId} 
                displayAlerts={displayAlerts}
                displayIncidents={displayIncidents}
                getAuthHeaders={getAuthHeaders}
                apiBase={apiBase}
                loadDashboardData={loadDashboardData}
              />
            )}

            {/* 3. Heatmap page */}
            {activeView === 'heatmap' && (
              <div className="space-y-4">
                <HeatmapView alerts={displayAlerts} cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} />
              </div>
            )}

            {/* 4. System Analytics */}
            {activeView === 'analytics' && (
              <div className="space-y-4">
                <AnalyticsCharts data={analytics} />
              </div>
            )}

            {/* 5. Cameras management CRUD */}
            {activeView === 'cameras' && (
              <CameraCRUD cameras={cameras} onRefresh={loadDashboardData} />
            )}

            {/* 6. User Operators CRUD */}
            {activeView === 'users' && user?.role === 'ADMIN' && (
              <UserCRUD users={users} onRefresh={loadDashboardData} />
            )}

            {/* 7. Incident Reports Log */}
            {activeView === 'reports' && (
              <ReportsView alerts={displayAlerts} incidents={displayIncidents} />
            )}

            {/* 9. Control Room Settings */}
            {activeView === 'settings' && (
              <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-6 space-y-6 max-w-2xl text-white font-mono">
                <div className="border-b border-surveillance-border pb-3">
                  <h3 className="text-sm font-bold tracking-wider uppercase">SURVEILLANCE CONTROL ROOM CONFIGURATION</h3>
                  <p className="text-3xs text-surveillance-textMuted mt-0.5">MANAGE GLOBAL THRESHOLDS & ALARM INTEGRATIONS</p>
                </div>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                    <div>
                      <p className="font-bold">Acoustic Scream Threshold</p>
                      <p className="text-3xs text-surveillance-textMuted uppercase mt-0.5">Trigger alarms above set decibels</p>
                    </div>
                    <span className="text-surveillance-accent font-bold text-sm">85 dB</span>
                  </div>

                  <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                    <div>
                      <p className="font-bold">Proactive Follow Time Threshold</p>
                      <p className="text-3xs text-surveillance-textMuted uppercase mt-0.5">Trigger warning when duration is exceeded</p>
                    </div>
                    <span className="text-surveillance-accent font-bold text-sm">30 Mins</span>
                  </div>

                  <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                    <div>
                      <p className="font-bold">Patrol Dispatch Protocols</p>
                      <p className="text-3xs text-surveillance-textMuted uppercase mt-0.5">Automate or review dispatch requests</p>
                    </div>
                    <span className="bg-surveillance-accent/15 border border-surveillance-accent/30 text-surveillance-accent px-2 py-0.5 rounded text-2xs font-bold uppercase">
                      AUTOMATED DISPATCH
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-surveillance-header border border-surveillance-border p-3.5 rounded">
                    <div>
                      <p className="font-bold">Language Analytics Mode</p>
                      <p className="text-3xs text-surveillance-textMuted uppercase mt-0.5">Primary translation index settings</p>
                    </div>
                    <span className="text-surveillance-success font-bold text-sm">TAMIL + ENGLISH</span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </main>
      </div>

      {/* Explainable AI Evidence Modal */}
      <ExplainableAIModal 
        alert={selectedAlert}
        isOpen={isXAIModalOpen}
        onClose={() => {
          setIsXAIModalOpen(false);
          setSelectedAlert(null);
        }}
      />
    </div>
  );
}

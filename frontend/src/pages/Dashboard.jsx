import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CCTVGrid from '../components/CCTVGrid';
import HeatmapView from '../components/HeatmapView';
import AnalyticsCharts from '../components/AnalyticsCharts';
import CameraCRUD from '../components/CameraCRUD';
import UserCRUD from '../components/UserCRUD';
import ReportsView from '../components/ReportsView';
import ExplainableAIModal from '../components/ExplainableAIModal';
import AreaFocusView from '../components/AreaFocusView';
import SensorMonitoringView from '../components/SensorMonitoringView';
import WorkerSafetyView from '../components/WorkerSafetyView';
import IncidentManagementView from '../components/IncidentManagementView';
import SystemHealthView from '../components/SystemHealthView';
import ProjectOverviewPosterView from '../components/ProjectOverviewPosterView';

import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  FileWarning, 
  Eye, 
  AlertOctagon, 
  Truck, 
  CheckSquare, 
  Play, 
  Square, 
  SkipForward, 
  SkipBack,
  Thermometer,
  Wind,
  Droplets,
  Users,
  Flame,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Radio,
  Bell,
  Settings as SettingsIcon
} from 'lucide-react';

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

  const [activeView, setActiveView] = useState('command_center');
  const [cctvLayoutMode, setCctvLayoutMode] = useState('wall'); // 'wall' or 'console'
  const [cameras, setCameras] = useState([]);
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [activeFeedTab, setActiveFeedTab] = useState('alerts');

  // 14-Step Fireworks MSME Safety Response Simulation State
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoIntervalId, setDemoIntervalId] = useState(null);

  const demoSteps = [
    { 
      title: 'Standard Environmental & Worker Monitoring', 
      desc: 'Secure baseline: Temp 31.2°C, Gas 110 PPM, all workers wearing antistatic PPE.',
      phase: 'Monitoring',
      sensors: { temp: 'NORMAL (31.2°C)', gas: 'NORMAL (110 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 18
    },
    { 
      title: 'Step 1: Shift Commences - Raw Store Verification', 
      desc: 'Workers check into Chemical Mixing Shed 1 and Drying Yard. Safe baseline locked.',
      phase: 'Monitoring',
      sensors: { temp: 'NORMAL (31.8°C)', gas: 'NORMAL (115 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 20
    },
    { 
      title: 'Step 2: Material Transit to Grinding Shed', 
      desc: 'Raw nitrate transport cart arrives at Grinding Shed Outer Perch.',
      phase: 'Monitoring',
      sensors: { temp: 'NORMAL (32.5°C)', gas: 'NORMAL (120 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 25
    },
    { 
      title: 'Step 3: Ambient Temperature Rise in Pulverizing Section', 
      desc: 'Thermal sensor records gradual temp rise to 36.5°C in Pulverizing area (>35°C Caution).',
      phase: 'Warning',
      sensors: { temp: 'WARNING (36.5°C)', gas: 'NORMAL (140 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 35
    },
    { 
      title: 'Step 4: Volatile Gas Anomaly Detected', 
      desc: 'MQ-135 sensor detects 280 PPM volatile gas accumulation (>250 PPM Threshold).',
      phase: 'Warning',
      sensors: { temp: 'WARNING (38.0°C)', gas: 'WARNING (280 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 48
    },
    { 
      title: 'Step 5: Worker Density Alert', 
      desc: 'AI Vision detects 4 workers inside Grinding Shed (Max allowable regulatory capacity 2).',
      phase: 'Warning',
      sensors: { temp: 'WARNING (39.5°C)', gas: 'WARNING (340 PPM)', ppe: 'DENSITY_ALERT', exhaust: 'STANDBY' },
      threatScore: 62
    },
    { 
      title: 'Step 6: Critical Thermal Threshold Exceeded (>42°C)', 
      desc: 'Ambient temperature reaches 44.5°C. Critical hazard warning broadcasted to control console.',
      phase: 'Distress',
      sensors: { temp: 'CRITICAL (44.5°C)', gas: 'CRITICAL (520 PPM)', ppe: 'DENSITY_ALERT', exhaust: 'STANDBY' },
      threatScore: 76
    },
    { 
      title: 'Step 7: Acoustic Sensor Spike Registered', 
      desc: 'Audio sensor registers 88dB acoustic amplitude spike. Worker panic movement detected.',
      phase: 'Distress',
      sensors: { temp: 'CRITICAL (45.8°C)', gas: 'CRITICAL (640 PPM)', ppe: 'PANIC_MOTION', exhaust: 'STANDBY' },
      threatScore: 85
    },
    { 
      title: 'Step 8: AI Decision Fusion - Critical Red Alarm (94%)', 
      desc: 'Cognitive decision engine combines all sensor vectors. Flashing CRITICAL HAZARD ALARM triggered.',
      phase: 'Distress',
      sensors: { temp: 'CRITICAL (46.2°C)', gas: 'CRITICAL (680 PPM)', ppe: 'CRITICAL', exhaust: 'ENGAGING' },
      threatScore: 94
    },
    { 
      title: 'Step 9: Automated Ventilation Triggered in Prototype', 
      desc: 'Emergency response protocol automatically engages high-speed exhaust fans (Bank #2).',
      phase: 'Dispatch',
      sensors: { temp: 'CRITICAL (44.0°C)', gas: 'VENTING (420 PPM)', ppe: 'CRITICAL', exhaust: 'ACTIVE_HIGH' },
      threatScore: 94
    },
    { 
      title: 'Step 10: Supervisor Mobile Push & SMS Dispatched', 
      desc: 'Instant emergency SMS & mobile notification sent to Plant Safety Incharge and Floor Lead.',
      phase: 'Dispatch',
      sensors: { temp: 'COOLING (40.2°C)', gas: 'VENTING (310 PPM)', ppe: 'EVACUATING', exhaust: 'ACTIVE_HIGH' },
      threatScore: 94
    },
    { 
      title: 'Step 11: Emergency Floor Response Team Responds', 
      desc: 'On-site emergency crew deploys water misting cooling protocol and isolates chemical feeds.',
      phase: 'Dispatch',
      sensors: { temp: 'COOLING (36.0°C)', gas: 'CLEARING (180 PPM)', ppe: 'EVACUATED', exhaust: 'ACTIVE_HIGH' },
      threatScore: 94
    },
    { 
      title: 'Step 12: Temperature Drops to Safe Baseline (31.0°C)', 
      desc: 'Continuous exhaust ventilation restores environmental parameters. Volatile gas cleared.',
      phase: 'Recovery',
      sensors: { temp: 'SAFE (31.0°C)', gas: 'SAFE (105 PPM)', ppe: 'VERIFIED', exhaust: 'STANDBY' },
      threatScore: 22
    },
    { 
      title: 'Step 13: Incident Formally Logged & Cleared', 
      desc: 'Shift supervisor logs inspection notes. Safety parameters confirmed green. Shift monitoring resumed.',
      phase: 'Monitoring',
      sensors: { temp: 'NORMAL (31.2°C)', gas: 'NORMAL (110 PPM)', ppe: 'COMPLIANT', exhaust: 'STANDBY' },
      threatScore: 18
    }
  ];

  const getSensorBadge = (status) => {
    if (status.includes('CRITICAL')) {
      return <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-black animate-pulse">{status}</span>;
    }
    if (status.includes('WARNING') || status.includes('COOLING') || status.includes('VENTING')) {
      return <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[8px] font-bold">{status}</span>;
    }
    if (status.includes('ACTIVE')) {
      return <span className="bg-sky-500 text-white px-2 py-0.5 rounded text-[8px] font-bold animate-pulse">{status}</span>;
    }
    return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded text-[8px] font-bold">{status}</span>;
  };

  const loadDashboardData = async () => {
    if (!apiBase) return;
    const headers = getAuthHeaders ? getAuthHeaders() : {};
    try {
      const [camsRes, statsRes, analyticsRes, incsRes] = await Promise.all([
        fetch(`${apiBase}/cameras`, { headers }),
        fetch(`${apiBase}/dashboard/stats`, { headers }),
        fetch(`${apiBase}/analytics/summary`, { headers }),
        fetch(`${apiBase}/incidents`, { headers })
      ]);

      if (camsRes.ok) setCameras(await camsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      if (incsRes.ok) setIncidents(await incsRes.json());
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Simulator controls
  const startDemo = () => {
    setIsDemoActive(true);
    setDemoStep(0);
    if (demoIntervalId) clearInterval(demoIntervalId);
    const interval = setInterval(() => {
      setDemoStep(prev => {
        if (prev >= demoSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 4500);
    setDemoIntervalId(interval);
  };

  const stopDemo = () => {
    setIsDemoActive(false);
    setDemoStep(0);
    if (demoIntervalId) clearInterval(demoIntervalId);
  };

  const stepDemo = (direction) => {
    if (demoIntervalId) clearInterval(demoIntervalId);
    setIsDemoActive(true);
    setDemoStep(prev => {
      const nextStep = prev + direction;
      if (nextStep < 0) return 0;
      if (nextStep >= demoSteps.length) return demoSteps.length - 1;
      return nextStep;
    });
  };

  const currentSimulation = demoSteps[demoStep];
  const overallFacilityStatus = isDemoActive && demoStep >= 6 ? 'CRITICAL' : isDemoActive && demoStep >= 3 ? 'WARNING' : 'SAFE';

  // Open Explainable AI Modal
  const openExplainableModal = (alert) => {
    setSelectedAlert(alert);
    setIsXAIModalOpen(true);
  };

  // Resolve Alert action
  const handleResolveAlert = async (alertId) => {
    try {
      if (!apiBase) return;
      const res = await fetch(`${apiBase}/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: getAuthHeaders ? getAuthHeaders() : {}
      });
      if (res.ok) {
        updateAlertStatusInState(alertId, 'Resolved');
        loadDashboardData();
      }
    } catch (err) {
      setActionError('Failed to resolve alert.');
    }
  };

  // Escalate Alert action
  const handleEscalateAlert = async (alertId) => {
    try {
      if (!apiBase) return;
      const res = await fetch(`${apiBase}/alerts/${alertId}/escalate`, {
        method: 'POST',
        headers: getAuthHeaders ? getAuthHeaders() : {}
      });
      if (res.ok) {
        updateAlertStatusInState(alertId, 'Escalated');
        loadDashboardData();
      }
    } catch (err) {
      setActionError('Failed to escalate alert.');
    }
  };

  return (
    <div className="min-h-screen bg-surveillance-bg text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. Universal Command Header */}
      <Navbar overallStatus={overallFacilityStatus} />

      {/* 2. Main Layout Body: Sidebar + Dynamic Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar activeView={activeView} setActiveView={setActiveView} />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-b from-surveillance-bg to-[#080e1a]">
          
          {/* VIEW 1: COMMAND CENTER (Executive Overview) */}
          {activeView === 'command_center' && (
            <div className="space-y-5 font-mono">
              
              {/* Top Banner: Overall Safety Status & Key Metrics Bar */}
              <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h2 className="text-base md:text-lg font-black tracking-wider text-white uppercase">
                      {t('command_center')}
                    </h2>
                    <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
                      {t('active_tamil_tag')}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Continuous multi-zone environmental telemetry, external CCTV vision & predictive hazard analysis
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-2xs">
                  <div className="text-right">
                    <span className="text-slate-500 block text-[9px] uppercase">{t('overall_risk_score')}</span>
                    <span className={`text-xl font-black ${
                      isDemoActive && demoStep >= 6 ? 'text-red-400 animate-pulse' :
                      isDemoActive && demoStep >= 3 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {isDemoActive ? currentSimulation.threatScore : 22}%
                    </span>
                  </div>

                  <div className="border-l border-slate-700 pl-3">
                    <span className="text-slate-500 block text-[9px] uppercase">{t('factory_status')}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded border ${
                      overallFacilityStatus === 'CRITICAL' ? 'bg-red-500/15 text-red-400 border-red-500/40 animate-pulse' :
                      overallFacilityStatus === 'WARNING' ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' :
                      'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                    }`}>
                      {overallFacilityStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* 6 Key Operational Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                
                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('temperature')}</span>
                    <Thermometer className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <p className="text-base font-black text-white mt-1">{isDemoActive && demoStep >= 6 ? '44.5°C' : '33.2°C'}</p>
                  <span className="text-[8px] text-emerald-400">Limit: &lt;38°C</span>
                </div>

                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('humidity')}</span>
                    <Droplets className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <p className="text-base font-black text-white mt-1">52% RH</p>
                  <span className="text-[8px] text-slate-400">Safe: 45–65%</span>
                </div>

                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('gas_level')}</span>
                    <Wind className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <p className="text-base font-black text-white mt-1">{isDemoActive && demoStep >= 6 ? '620 PPM' : '135 PPM'}</p>
                  <span className="text-[8px] text-emerald-400">MQ-135 Array</span>
                </div>

                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('worker_count')}</span>
                    <Users className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <p className="text-base font-black text-white mt-1">31 Active</p>
                  <span className="text-[8px] text-emerald-400">7 Zones Tracked</span>
                </div>

                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('ppe_compliance')}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-base font-black text-emerald-400 mt-1">96.4%</p>
                  <span className="text-[8px] text-emerald-400">Antistatic Compliant</span>
                </div>

                <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd">
                  <div className="flex justify-between items-center text-slate-400 text-[10px]">
                    <span>{t('active_alerts')}</span>
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <p className="text-base font-black text-amber-400 mt-1">{alerts.filter(a => a.status === 'New').length || 2}</p>
                  <span className="text-[8px] text-slate-400">Control Queue</span>
                </div>

              </div>

              {/* 14-Step Fireworks MSME Safety Response Simulation Interactive Bar */}
              <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-3">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-surveillance-border pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 text-sky-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {t('command_simulator')} (14-Step Incident Lifecycle)
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-amber-400 font-bold">
                      {t('step')}: {demoStep + 1} / 14
                    </span>
                    {!isDemoActive ? (
                      <button
                        onClick={startDemo}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded text-2xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
                      >
                        <Play className="h-3 w-3" />
                        <span>{t('start_simulation')}</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopDemo}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-2xs font-bold flex items-center space-x-1 cursor-pointer transition-all shadow-sm"
                      >
                        <Square className="h-3 w-3" />
                        <span>{t('stop_simulation')}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Simulation Step Description and Telemetry Badges */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-sky-400 uppercase">
                        Step {demoStep + 1}: {currentSimulation.title}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Phase: {currentSimulation.phase}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{currentSimulation.desc}</p>
                  </div>

                  {/* Telemetry Sensor Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    <div className="flex items-center space-x-1 text-[9px] bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                      <span className="text-slate-400">Temp:</span>
                      {getSensorBadge(currentSimulation.sensors.temp)}
                    </div>
                    <div className="flex items-center space-x-1 text-[9px] bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                      <span className="text-slate-400">Gas:</span>
                      {getSensorBadge(currentSimulation.sensors.gas)}
                    </div>
                    <div className="flex items-center space-x-1 text-[9px] bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                      <span className="text-slate-400">Exhaust:</span>
                      {getSensorBadge(currentSimulation.sensors.exhaust)}
                    </div>
                  </div>
                </div>

                {/* Simulator Previous / Next Stepper */}
                <div className="flex justify-between items-center text-2xs pt-1">
                  <button
                    onClick={() => stepDemo(-1)}
                    disabled={demoStep === 0}
                    className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 px-2.5 py-1 rounded cursor-pointer transition-all border border-slate-700"
                  >
                    <SkipBack className="h-3 w-3" />
                    <span>Previous Step</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {demoSteps.map((_, i) => (
                      <span
                        key={i}
                        onClick={() => { if (demoIntervalId) clearInterval(demoIntervalId); setIsDemoActive(true); setDemoStep(i); }}
                        className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                          i === demoStep ? 'bg-sky-400 scale-125 shadow-glow-cyan' : i < demoStep ? 'bg-emerald-500' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => stepDemo(1)}
                    disabled={demoStep >= demoSteps.length - 1}
                    className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 px-2.5 py-1 rounded cursor-pointer transition-all border border-slate-700"
                  >
                    <span>Next Step</span>
                    <SkipForward className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* 16 Live CCTV Grid Wall in Command Center */}
              <CCTVGrid cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} demoCameraId={4} />

            </div>
          )}

          {/* VIEW 2: 16 LIVE CCTV MONITOR WALL */}
          {activeView === 'cctv' && (
            <div className="space-y-4">
              <CCTVGrid cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} demoCameraId={4} />
            </div>
          )}

          {/* VIEW 3: AI RISK ANALYSIS */}
          {activeView === 'risk_analysis' && (
            <div className="space-y-4">
              <AnalyticsCharts data={analytics} />
            </div>
          )}

          {/* VIEW 4: CCTV / AI VISION & PPE */}
          {activeView === 'ai_vision' && (
            <div className="space-y-4">
              <AreaFocusView 
                cameras={cameras} 
                isDemoActive={isDemoActive} 
                demoStep={demoStep} 
                demoCameraId={4}
                displayAlerts={alerts}
                displayIncidents={incidents}
                getAuthHeaders={getAuthHeaders}
                apiBase={apiBase}
                loadDashboardData={loadDashboardData}
              />
            </div>
          )}

          {/* VIEW 5: SENSOR MONITORING (IoT Telemetry) */}
          {activeView === 'sensors' && (
            <div className="space-y-4">
              <SensorMonitoringView isDemoActive={isDemoActive} demoStep={demoStep} />
            </div>
          )}

          {/* VIEW 6: WORKER SAFETY & DENSITY */}
          {activeView === 'worker_safety' && (
            <div className="space-y-4">
              <WorkerSafetyView />
            </div>
          )}

          {/* VIEW 7: INCIDENT MANAGEMENT (5-Stage Workflow) */}
          {activeView === 'incidents' && (
            <div className="space-y-4">
              <IncidentManagementView />
            </div>
          )}

          {/* VIEW 8: ALERTS & NOTIFICATIONS */}
          {activeView === 'alerts' && (
            <div className="space-y-4 font-mono select-none">
              <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd flex justify-between items-center">
                <div>
                  <h2 className="text-sm md:text-base font-black text-white uppercase flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-sky-400" />
                    <span>{t('alerts')}</span>
                  </h2>
                  <p className="text-2xs text-slate-400 mt-0.5">Real-Time Hazard Alert Stream & Multi-Channel Dispatch</p>
                </div>
              </div>

              <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-2xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sky-400">#ALT-{alert.id}</span>
                        <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                          alert.risk_score >= 75 ? 'bg-red-500/15 text-red-400 border border-red-500/40' : 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                        }`}>
                          RISK {alert.risk_score}%
                        </span>
                        <span className="text-slate-400 text-[10px]">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-300 mt-1 font-semibold">{alert.explanation}</p>
                    </div>

                    <div className="flex space-x-2 shrink-0">
                      {alert.status === 'New' && (
                        <>
                          <button
                            onClick={() => handleResolveAlert(alert.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded cursor-pointer transition-all font-bold"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleEscalateAlert(alert.id)}
                            className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded cursor-pointer transition-all font-bold"
                          >
                            Escalate
                          </button>
                        </>
                      )}
                      {alert.status !== 'New' && (
                        <span className="text-slate-400 font-bold px-2 py-1 bg-slate-950 rounded">
                          {alert.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 9: FACTORY / ZONE MAP */}
          {activeView === 'factory_map' && (
            <div className="space-y-4">
              <HeatmapView alerts={alerts} cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} />
            </div>
          )}

          {/* VIEW 10: REPORTS & ANALYTICS */}
          {activeView === 'reports' && (
            <div className="space-y-4">
              <ReportsView alerts={alerts} incidents={incidents} />
            </div>
          )}

          {/* VIEW 11: AI RISK HISTORY */}
          {activeView === 'risk_history' && (
            <div className="space-y-4">
              <AnalyticsCharts data={analytics} />
            </div>
          )}

          {/* VIEW 12: SYSTEM HEALTH */}
          {activeView === 'system_health' && (
            <div className="space-y-4">
              <SystemHealthView />
            </div>
          )}

          {/* VIEW 13: PROJECT ARCHITECTURE POSTER (Matching Attached Image) */}
          {activeView === 'project_overview' && (
            <div className="space-y-4">
              <ProjectOverviewPosterView 
                cameras={cameras} 
                isDemoActive={isDemoActive} 
                demoStep={demoStep} 
                startDemo={startDemo} 
                stopDemo={stopDemo} 
                stepDemo={stepDemo} 
              />
            </div>
          )}

          {/* VIEW 14: SETTINGS & THRESHOLDS */}
          {activeView === 'settings' && (
            <div className="space-y-4 font-mono select-none">
              <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
                <h2 className="text-sm md:text-base font-black text-white uppercase flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5 text-sky-400" />
                  <span>{t('settings')} & Regulatory Safety Thresholds</span>
                </h2>
                <p className="text-2xs text-slate-400 mt-0.5">Configurable IoT triggers, acoustic sensitivity and emergency dispatch relays.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-3 text-2xs">
                  <h3 className="text-xs font-bold text-sky-400 uppercase border-b border-surveillance-border pb-2">Environmental Triggers</h3>
                  <div>
                    <label className="text-slate-400 block mb-1">Max Ambient Temperature Threshold (°C):</label>
                    <input type="number" defaultValue={38.0} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Volatile Gas Alarm Level (PPM):</label>
                    <input type="number" defaultValue={250} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Acoustic Spike Decibel Threshold (dB):</label>
                    <input type="number" defaultValue={85} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                  </div>
                </div>

                <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-3 text-2xs">
                  <h3 className="text-xs font-bold text-sky-400 uppercase border-b border-surveillance-border pb-2">Automated Response Relays</h3>
                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                    <span>Auto-Trigger Exhaust Ventilation Fans:</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                    <span>Acoustic Siren Voice Broadcast:</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800">
                    <span>SMS / Push Relay to Plant Supervisor:</span>
                    <span className="text-emerald-400 font-bold">ENABLED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADMIN ONLY: USERS & CAMERAS */}
          {activeView === 'users' && user?.role === 'ADMIN' && (
            <div className="space-y-4">
              <UserCRUD />
            </div>
          )}

          {activeView === 'cameras' && (
            <div className="space-y-4">
              <CameraCRUD />
            </div>
          )}

        </main>
      </div>

      {/* Explainable AI Modal */}
      {isXAIModalOpen && (
        <ExplainableAIModal
          isOpen={isXAIModalOpen}
          onClose={() => setIsXAIModalOpen(false)}
          alert={selectedAlert}
          onResolve={handleResolveAlert}
          onEscalate={handleEscalateAlert}
        />
      )}

    </div>
  );
}

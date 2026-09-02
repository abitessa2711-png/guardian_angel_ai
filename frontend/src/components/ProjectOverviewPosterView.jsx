import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  Flame, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Server, 
  Database, 
  Wifi, 
  Users, 
  Maximize2, 
  FileText, 
  Layers, 
  ChevronRight, 
  ChevronLeft,
  Video,
  Eye,
  Sliders,
  Play,
  Square,
  Building2,
  HardHat
} from 'lucide-react';
import CCTVGrid, { SimulatedCCTVStream } from './CCTVGrid';

export default function ProjectOverviewPosterView({ 
  cameras = [], 
  isDemoActive = false, 
  demoStep = 0, 
  startDemo, 
  stopDemo, 
  stepDemo 
}) {
  const { t, language } = useLanguage();
  const [layoutMode, setLayoutMode] = useState('wall'); // 'wall' or 'console'

  const demoStepsList = [
    { title: 'Standard Environmental & Worker Monitoring', desc: 'Secure baseline: Temp 31°C, Gas 110 PPM, all workers wearing antistatic PPE.' },
    { title: 'Step 1: Shift Commences', desc: 'Workers check into Chemical Mixing Shed 1 and Drying Yard. Safe baseline locked.' },
    { title: 'Step 2: Material Cart Transit', desc: 'Raw nitrate transport cart arrives at Grinding Shed Outer Perch.' },
    { title: 'Step 3: Ambient Temperature Rise', desc: 'Thermal sensor records gradual temp rise to 36.5°C in Pulverizing area.' },
    { title: 'Step 4: Volatile Gas Anomaly Detected', desc: 'MQ-135 sensor detects 280 PPM volatile gas accumulation.' },
    { title: 'Step 5: Worker Density Alert', desc: 'AI Vision detects 4 workers inside Grinding Shed (Max capacity 2).' },
    { title: 'Step 6: Critical Thermal Threshold Exceeded', desc: 'Ambient temperature crosses 42°C. Elevated hazard warning issued.' },
    { title: 'Step 7: Acoustic Spike Registered', desc: 'Audio sensor detects 88dB acoustic spike (panic motion observed).' },
    { title: 'Step 8: AI Risk Score Escalates to 94%', desc: 'Decision engine triggers flashing CRITICAL HAZARD RED ALARM.' },
    { title: 'Step 9: Automated Ventilation Triggered', desc: 'Prototype simulation engages high-speed exhaust fans automatically.' },
    { title: 'Step 10: Supervisor SMS & Push Dispatched', desc: 'Safety Officer and Floor Incharge receive instant mobile alerts.' },
    { title: 'Step 11: Emergency Floor Team Responds', desc: 'On-site safety team deploys water misting cooling protocol.' },
    { title: 'Step 12: Temperature Drops to 31.0°C', desc: 'Exhaust fans clear volatile gas. Temperature stabilizes.' },
    { title: 'Step 13: Incident Formally Logged & Cleared', desc: 'Shift supervisor verifies safe condition and resumes normal monitoring.' }
  ];

  return (
    <div className="bg-[#050911] text-slate-100 p-4 md:p-6 rounded-xl border border-slate-800 shadow-2xl font-mono select-none space-y-6">
      
      {/* 1. Grand Poster Header matching Reference Image */}
      <div className="flex flex-col lg:flex-row items-center justify-between border-b-2 border-sky-500/40 pb-5 pt-2 gap-4">
        
        {/* Left Emblem / Authority Badge */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-sky-950 border border-sky-400/50 flex items-center justify-center shadow-glow-cyan">
            <Building2 className="h-7 w-7 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Government & MSME Safety Initiative</p>
            <p className="text-2xs text-sky-400 font-semibold tracking-tight">Directorate of Industrial Safety & Health (DISH)</p>
          </div>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h1 className="text-lg md:text-2xl font-black tracking-wider text-white uppercase leading-tight">
            Intelligent Industrial Safety & MSME Risk Platform
          </h1>
          <p className="text-2xs md:text-xs text-sky-400 font-bold uppercase tracking-widest mt-1">
            AI-Powered Multi-Camera Monitoring & Predictive Incident Response System (PyroGuardian AI)
          </p>
        </div>

        {/* Right Mission Badge */}
        <div className="flex items-center space-x-3 bg-slate-900/80 border border-slate-700 px-3.5 py-2 rounded-lg">
          <HardHat className="h-6 w-6 text-amber-400 shrink-0" />
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase">MISSION 2026</p>
            <p className="text-xs font-black text-white">ZERO HAZARD MSME</p>
          </div>
        </div>

      </div>

      {/* 2. Main Three-Column Poster Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Project Overview, Objectives, Features, Stack, Beneficiaries (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* A. Project Overview Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <Building2 className="h-4 w-4" />
              <span>PROJECT OVERVIEW</span>
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              An AI-Enabled Multi-Sensor Safety System for Real-Time Thermal Hazard Detection, Worker Safety & Environmental Monitoring across Fireworks MSMEs.
            </p>
          </div>

          {/* B. Objectives Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span>OBJECTIVES</span>
            </h3>
            <ul className="text-[10px] text-slate-300 space-y-1.5 list-disc pl-3.5">
              <li>Real-time monitoring of 16 critical zones from safe external observation perches.</li>
              <li>AI-based predictive threat & thermal anomaly detection.</li>
              <li>Multi-sensor IoT data fusion (Temp, Humidity, Gas, Worker Density).</li>
              <li>Live automated prototype ventilation & dispatcher response.</li>
              <li>Faster response & zero-fatality fireworks manufacturing.</li>
            </ul>
          </div>

          {/* C. Key Features Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>KEY FEATURES</span>
            </h3>
            <ul className="text-[10px] text-slate-300 space-y-1.5">
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>16 Live External CCTV Feeds with AI Analytics</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Worker Pose & Antistatic PPE Detection</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Environmental Acoustic & Thermal Sensors</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Automated Prototype Ventilation (14-Step Workflow)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Integrated Factory Zone Map & Hotspots</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Real-time Alerts & Supervisor Control Console</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Secure, Scalable & Government Ready</span>
              </li>
            </ul>
          </div>

          {/* D. Technology Stack Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <Cpu className="h-4 w-4" />
              <span>TECHNOLOGY STACK</span>
            </h3>
            <div className="text-[10px] space-y-1 text-slate-300">
              <p><span className="font-bold text-white">Frontend:</span> React.js, Tailwind CSS, Recharts</p>
              <p><span className="font-bold text-white">Maps:</span> Interactive Factory Zone Canvas</p>
              <p><span className="font-bold text-white">Backend:</span> FastAPI, Python, SQLite (SQLAlchemy)</p>
              <p><span className="font-bold text-white">IoT Hardware:</span> ESP32-S3, DHT22, MQ-135</p>
              <p><span className="font-bold text-white">AI Modules:</span> YOLOv8 Pose, Optical Flow, Audio Classifier</p>
              <p><span className="font-bold text-white">Real-time:</span> WebSockets</p>
            </div>
          </div>

          {/* E. Beneficiaries Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <Users className="h-4 w-4" />
              <span>BENEFICIARIES</span>
            </h3>
            <ul className="text-[10px] text-slate-300 space-y-1 list-disc pl-3.5">
              <li>Fireworks MSME Owners & Factory Supervisors</li>
              <li>Industrial Safety & Health Authorities (DISH)</li>
              <li>District Disaster Management & Fire Rescue</li>
              <li>Factory Workers & Local Community</li>
            </ul>
          </div>

        </div>

        {/* CENTER COLUMN: 16 Live CCTV Wall & Operator Console (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* CCTV Wall Box Header */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3 shadow-cmd">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-sky-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  16 LIVE CCTV MONITOR WALL (EXTERNAL SAFE OBSERVATION)
                </h3>
              </div>

              {/* Mode Toggle */}
              <button
                onClick={() => setLayoutMode(prev => prev === 'wall' ? 'console' : 'wall')}
                className="bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition-all"
              >
                {layoutMode === 'wall' ? 'Console Mode' : 'Wall Mode'}
              </button>
            </div>
          </div>

          {/* Render 16 CCTV Grid inside Poster Center */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <CCTVGrid cameras={cameras} isDemoActive={isDemoActive} demoStep={demoStep} demoCameraId={4} />
          </div>

          {/* Operator Console Mode - Dashboard Components Box */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd space-y-3">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Sliders className="h-4 w-4" />
              <span>OPERATOR CONSOLE MODE – DASHBOARD COMPONENTS</span>
            </h3>

            {/* Sub-grid: Stats, Map, Simulator, Alerts, System Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">Total Cameras</p>
                <p className="text-base font-black text-sky-400">16</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">Active Alerts</p>
                <p className="text-base font-black text-red-400">02</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">Workers Active</p>
                <p className="text-base font-black text-emerald-400">31</p>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <p className="text-[9px] text-slate-400 uppercase">Avg Temperature</p>
                <p className="text-base font-black text-white">33.2°C</p>
              </div>
            </div>

            {/* 14-Step Incident Simulator Mini-Bar */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-2xs">
                <span className="font-bold text-sky-400 uppercase">Live Incident Simulator (14-Step Workflow)</span>
                <span className="text-amber-400 font-bold">Current Step: {demoStep + 1} / 14</span>
              </div>
              
              <div className="p-2 bg-slate-900/90 rounded border border-slate-700/60 text-2xs">
                <span className="font-black text-white">Step {demoStep + 1}: {demoStepsList[demoStep]?.title}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{demoStepsList[demoStep]?.desc}</p>
              </div>

              <div className="flex justify-between items-center pt-1">
                <button
                  onClick={() => stepDemo(-1)}
                  disabled={demoStep === 0}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition-all"
                >
                  &lt; Previous
                </button>
                <div className="flex space-x-2">
                  {!isDemoActive ? (
                    <button
                      onClick={startDemo}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <Play className="h-3 w-3" />
                      <span>Start Simulation</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopDemo}
                      className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer transition-all flex items-center space-x-1"
                    >
                      <Square className="h-3 w-3" />
                      <span>Stop Simulation</span>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => stepDemo(1)}
                  disabled={demoStep >= demoStepsList.length - 1}
                  className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition-all"
                >
                  Next &gt;
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Implementation Plan, Layout Modes, About Project (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* A. Implementation Plan (7 Phases) */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5 mb-2">
              <Layers className="h-4 w-4" />
              <span>IMPLEMENTATION PLAN</span>
            </h3>

            <div className="space-y-2 text-[10px]">
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">1</span>
                <div>
                  <p className="font-bold text-white">Requirement Analysis</p>
                  <p className="text-slate-400 text-[9px]">Study MSME layouts, hazardous mixing zones & sensors</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">2</span>
                <div>
                  <p className="font-bold text-white">System Design</p>
                  <p className="text-slate-400 text-[9px]">Architecture, database & safe camera positions</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">3</span>
                <div>
                  <p className="font-bold text-white">Development</p>
                  <p className="text-slate-400 text-[9px]">Frontend Command Hub, FastAPI, AI Logic</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">4</span>
                <div>
                  <p className="font-bold text-white">Integration</p>
                  <p className="text-slate-400 text-[9px]">Multi-sensor IoT + Zone Map + Alerts</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">5</span>
                <div>
                  <p className="font-bold text-white">Testing & Deployment</p>
                  <p className="text-slate-400 text-[9px]">Thermal field test & hardware verification</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">6</span>
                <div>
                  <p className="font-bold text-white">Training & Handover</p>
                  <p className="text-slate-400 text-[9px]">Operator training & safety documentation</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 text-sky-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[9px]">7</span>
                <div>
                  <p className="font-bold text-white">Maintenance & Support</p>
                  <p className="text-slate-400 text-[9px]">24/7 monitoring, updates & automated audits</p>
                </div>
              </div>
            </div>
          </div>

          {/* B. Dashboard Layout Modes Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd space-y-2">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5">
              <Eye className="h-4 w-4" />
              <span>DASHBOARD LAYOUT MODES</span>
            </h3>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">1. Wall Monitor Mode (Default)</p>
                <p className="text-slate-400 text-[9px]">Full-screen 16-Camera Matrix View</p>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">2. Operator Console Mode</p>
                <p className="text-slate-400 text-[9px]">Detailed Telemetry, GIS Map & Control</p>
              </div>
            </div>
          </div>

          {/* C. About the Project Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-3.5 shadow-cmd space-y-2">
            <h3 className="text-xs font-black text-sky-400 uppercase flex items-center space-x-2 border-b border-slate-800 pb-1.5">
              <FileText className="h-4 w-4" />
              <span>ABOUT THE PROJECT</span>
            </h3>

            <p className="text-[10px] text-slate-300 leading-relaxed">
              This platform is designed for Fireworks MSMEs and Industrial Safety Authorities to enhance worker safety through AI-driven external surveillance, real-time telemetry analytics, and automated incident prevention.
            </p>

            <div className="pt-2 border-t border-slate-800 text-center">
              <p className="text-xs font-black text-sky-400">Safer Industry. Smarter Monitoring. Stronger Protection.</p>
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Poster Footer Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-4 text-2xs text-slate-400 gap-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-400 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure | Scalable | Reliable</span>
          </span>
        </div>
        <p>© 2026 PyroGuardian AI – Industrial Safety Command System</p>
        <p className="text-sky-400 font-bold">Designed & Developed for Government & MSME Use</p>
      </div>

    </div>
  );
}

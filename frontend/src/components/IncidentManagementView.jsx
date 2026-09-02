import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileWarning, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  UserCheck, 
  Send, 
  FileText, 
  ChevronRight,
  Flame,
  Activity,
  Wind
} from 'lucide-react';

export default function IncidentManagementView() {
  const { t, language } = useLanguage();
  const { alerts, updateAlertStatusInState } = useWebSocket();
  const { user, apiBase, getAuthHeaders } = useAuth();

  const [incidents, setIncidents] = useState([
    {
      id: 'INC-2026-089',
      title: 'Critical Thermal Spike & Gas Anomaly in Chemical Grinding Shed',
      zone: 'Pulverizer & Grinding Shed Outer Perch',
      severity: 'CRITICAL',
      status: 'ACTION_TAKEN',
      detectedAt: '11:15 AM',
      assignedSupervisor: 'Plant Supervisor K. Rajesh',
      notes: 'Automated exhaust fans triggered at 44.5°C. Floor team dispatched with misting units.',
      timeline: [
        { time: '11:15:02 AM', event: 'MQ-135 sensor detected 620 PPM volatile gas anomaly', stage: 'DETECTED' },
        { time: '11:15:04 AM', event: 'AI Engine calculated 94% Risk Index. Red Alert generated', stage: 'ALERT_GENERATED' },
        { time: '11:15:20 AM', event: 'Control Room Supervisor acknowledged alert', stage: 'ACKNOWLEDGED' },
        { time: '11:15:45 AM', event: 'Exhaust fan bank 2 automatically engaged. Emergency team dispatched', stage: 'ACTION_TAKEN' }
      ]
    },
    {
      id: 'INC-2026-088',
      title: 'Restricted Vault Approach Detected during Slurry Dipping',
      zone: 'Explosive Magazine Storage Vault Entry',
      severity: 'WARNING',
      status: 'RESOLVED',
      detectedAt: '09:40 AM',
      resolvedAt: '10:05 AM',
      assignedSupervisor: 'Safety Chief Er. M. Sundaram',
      notes: 'Perimeter check cleared. Unauthorized worker guided back to assembly hall. Vault seals intact.',
      timeline: [
        { time: '09:40:12 AM', event: 'AI Vision camera CAM-12 detected boundary line approach', stage: 'DETECTED' },
        { time: '09:40:15 AM', event: 'Yellow warning issued to control room console', stage: 'ALERT_GENERATED' },
        { time: '09:42:00 AM', event: 'Supervisor acknowledged and phoned gate security', stage: 'ACKNOWLEDGED' },
        { time: '09:45:00 AM', event: 'Security unit cleared the approach buffer area', stage: 'ACTION_TAKEN' },
        { time: '10:05:00 AM', event: 'Incident closed and logged in safety register', stage: 'RESOLVED' }
      ]
    }
  ]);

  const [selectedIncident, setSelectedIncident] = useState(incidents[0]);
  const [resolutionInput, setResolutionInput] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleResolve = (incidentId) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'RESOLVED',
          resolvedAt: new Date().toLocaleTimeString(),
          notes: resolutionInput || inc.notes,
          timeline: [
            ...inc.timeline,
            { time: new Date().toLocaleTimeString(), event: `Resolved by ${user?.name || 'Supervisor'}: ${resolutionInput || 'Environmental parameters stabilized.'}`, stage: 'RESOLVED' }
          ]
        };
      }
      return inc;
    }));
    
    if (selectedIncident?.id === incidentId) {
      setSelectedIncident(prev => ({
        ...prev,
        status: 'RESOLVED',
        resolvedAt: new Date().toLocaleTimeString(),
        notes: resolutionInput || prev.notes,
        timeline: [
          ...prev.timeline,
          { time: new Date().toLocaleTimeString(), event: `Resolved by ${user?.name || 'Supervisor'}: ${resolutionInput || 'Environmental parameters stabilized.'}`, stage: 'RESOLVED' }
        ]
      }));
    }

    setResolutionInput('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const stages = [
    { key: 'DETECTED', label: '1. Detected', color: 'text-amber-400' },
    { key: 'ALERT_GENERATED', label: '2. Alert Generated', color: 'text-red-400' },
    { key: 'ACKNOWLEDGED', label: '3. Acknowledged', color: 'text-sky-400' },
    { key: 'ACTION_TAKEN', label: '4. Action / Exhaust Active', color: 'text-purple-400' },
    { key: 'RESOLVED', label: '5. Resolved', color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <FileWarning className="h-5 w-5 text-sky-400" />
            <span>{t('incidents')} & 5-Stage Response Workflow</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            DETECTED → ALERT GENERATED → SUPERVISOR ACKNOWLEDGED → ACTION TAKEN → RESOLVED
          </p>
        </div>

        {showSuccessToast && (
          <span className="flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded text-2xs font-bold animate-fade-in">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Incident Status Successfully Updated!</span>
          </span>
        )}
      </div>

      {/* 5-Stage Visual Workflow Header */}
      <div className="bg-surveillance-panel p-3 rounded-lg border border-surveillance-border shadow-cmd overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] text-2xs">
          {stages.map((st, idx) => (
            <React.Fragment key={st.key}>
              <div className="flex items-center space-x-2 p-2 rounded bg-slate-900/80 border border-slate-700/60">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span className={`font-bold ${st.color}`}>{st.label}</span>
              </div>
              {idx < stages.length - 1 && (
                <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Two-Column Incident Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Incidents List */}
        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-3">
          <h3 className="text-xs font-bold text-white uppercase flex items-center justify-between">
            <span>Active & Logged Incidents</span>
            <span className="text-[10px] text-sky-400 font-bold">{incidents.length} Records</span>
          </h3>

          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-900 border-sky-500 shadow-glow-cyan' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-2xs font-bold text-sky-400">{inc.id}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                      inc.status === 'RESOLVED' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                    }`}>
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white line-clamp-1">{inc.title}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">{inc.zone}</p>
                  
                  <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[9px] text-slate-500">
                    <span>Detected: {inc.detectedAt}</span>
                    <span>{inc.assignedSupervisor}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Incident Deep Dive & Timeline */}
        {selectedIncident && (
          <div className="lg:col-span-2 bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surveillance-border pb-3">
              <div>
                <span className="text-2xs font-bold text-sky-400">{selectedIncident.id}</span>
                <h3 className="text-sm md:text-base font-black text-white mt-0.5">{selectedIncident.title}</h3>
                <p className="text-2xs text-slate-400 mt-0.5">{selectedIncident.zone}</p>
              </div>

              <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded border ${
                  selectedIncident.severity === 'CRITICAL' 
                    ? 'bg-red-500/15 text-red-400 border-red-500/40 animate-pulse shadow-glow-red' 
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                }`}>
                  {selectedIncident.severity}
                </span>
                
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white">
                  STATUS: {selectedIncident.status}
                </span>
              </div>
            </div>

            {/* Incident Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-2xs">
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block">Assigned Lead:</span>
                <span className="font-bold text-white">{selectedIncident.assignedSupervisor}</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block">Detected Time:</span>
                <span className="font-bold text-slate-300">{selectedIncident.detectedAt}</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block">Automated Action:</span>
                <span className="font-bold text-sky-400">Exhaust Fan Bank #2</span>
              </div>
              <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                <span className="text-slate-500 block">Resolution State:</span>
                <span className={`font-bold ${selectedIncident.status === 'RESOLVED' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedIncident.status === 'RESOLVED' ? 'VERIFIED SAFE' : 'IN PROGRESS'}
                </span>
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
              <h4 className="text-2xs font-bold text-white uppercase flex items-center space-x-1.5">
                <Clock className="h-3.5 w-3.5 text-sky-400" />
                <span>Incident Response Audit Timeline</span>
              </h4>

              <div className="space-y-2 pl-2 border-l-2 border-slate-700">
                {selectedIncident.timeline.map((entry, idx) => (
                  <div key={idx} className="relative pl-3 text-2xs">
                    <span className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-slate-900"></span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sky-400 font-bold">{entry.time}</span>
                      <span className="text-2xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">[{entry.stage}]</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{entry.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Resolution Form */}
            {selectedIncident.status !== 'RESOLVED' ? (
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-2xs font-bold text-white uppercase flex items-center space-x-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Supervisor Resolution Log</span>
                </h4>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter on-site inspection findings / cooling verification..."
                    value={resolutionInput}
                    onChange={(e) => setResolutionInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-2xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                  <button
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded text-2xs flex items-center justify-center space-x-1.5 cursor-pointer transition-all shrink-0"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{t('mark_resolved')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-2xs text-emerald-400 flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Incident is formally logged and closed. Shift safety parameters verified compliant.</span>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

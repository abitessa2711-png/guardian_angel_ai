import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Send, 
  Radio, 
  CheckCircle2, 
  Activity,
  Filter,
  Search,
  ShieldCheck
} from 'lucide-react';

export const TRACKED_WOMEN_SUBJECTS = [
  {
    id: 'SUBJ-4412',
    name: 'Female Commuter #4412',
    location: 'Central Bus Stand Platform 1 (Camera 02)',
    cameraId: 'CAM-02',
    riskLevel: 'Critical',
    riskScore: 94,
    riskFactors: 'Fear Emotion (92%) + Persistent Following (18m) + 0.8m Gap',
    duration: '18 mins tracked',
    status: 'In Danger Vector',
    dispatchAssigned: 'Patrol Car #12 (SI M. Vijay)',
    snapshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'SUBJ-4419',
    name: 'College Student #4419',
    location: 'Campus Subway Corridor (Camera 05)',
    cameraId: 'CAM-05',
    riskLevel: 'High',
    riskScore: 86,
    riskFactors: 'Isolated Solo Transit + Sudden Agitation Movement',
    duration: '6 mins tracked',
    status: 'High Alert',
    dispatchAssigned: 'Campus Security Unit #02',
    snapshot: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'SUBJ-4425',
    name: 'Pedestrian #4425',
    location: 'Gandhi Market North Alley (Camera 09)',
    cameraId: 'CAM-09',
    riskLevel: 'Medium',
    riskScore: 68,
    riskFactors: 'Repeated Path Intersect + Trailing Suspect',
    duration: '12 mins tracked',
    status: 'Under Active Watch',
    dispatchAssigned: 'Beat Constable S. Selvam',
    snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 'SUBJ-4431',
    name: 'Office Commuter #4431',
    location: 'Railway Junction East Gate (Camera 03)',
    cameraId: 'CAM-03',
    riskLevel: 'Low',
    riskScore: 24,
    riskFactors: 'Normal Movement Pattern in Well-Lit Zone',
    duration: '4 mins tracked',
    status: 'Safe Transit',
    dispatchAssigned: 'None Required',
    snapshot: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop'
  }
];

export default function WomenSafetyMonitoringView({ onSelectAlert, onDispatchAlert }) {
  const [subjects, setSubjects] = useState(TRACKED_WOMEN_SUBJECTS);
  const [selectedSubject, setSelectedSubject] = useState(TRACKED_WOMEN_SUBJECTS[0]);
  const [filterRisk, setFilterRisk] = useState('All');

  const filtered = subjects.filter(s => {
    if (filterRisk !== 'All' && s.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <span>Women Safety Real-Time Surveillance & Protection Grid</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Continuous trajectory tracking, vulnerability detection, and emergency patrol interception.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Filter Risk:</span>
          <select 
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Tracked Subjects</option>
            <option value="Critical">Critical Risk Only</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Safe / Low Risk</option>
          </select>
        </div>
      </div>

      {/* 4 Key Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Women Tracked</span>
            <span className="text-xl font-bold text-slate-900 font-mono">42 Active</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-red-100 text-red-700 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active High/Critical Risks</span>
            <span className="text-xl font-bold text-red-700 font-mono">4 Subjects</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-blue-100 text-blue-700 rounded-lg">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Patrol Units Dispatched</span>
            <span className="text-xl font-bold text-blue-700 font-mono">3 Patrol Cars</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Safe Zone Coverage</span>
            <span className="text-xl font-bold text-emerald-700 font-mono">92.4%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Tracked Subjects List (7 cols) & Right Subject Case Spotlight (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Active Subject List (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Surveillance Subject Roster
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">{filtered.length} Subjects Displayed</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map(subj => {
              const isSelected = selectedSubject.id === subj.id;

              return (
                <div
                  key={subj.id}
                  onClick={() => setSelectedSubject(subj)}
                  className={`p-3.5 flex items-start justify-between cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img 
                      src={subj.snapshot} 
                      alt="Subject face" 
                      className="w-12 h-12 rounded-md object-cover border border-slate-300 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{subj.name}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          subj.riskLevel === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' :
                          subj.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                          subj.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {subj.riskLevel} ({subj.riskScore}%)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{subj.location}</span>
                      </p>
                      <p className="text-[11px] text-red-700 font-semibold">{subj.riskFactors}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono block">{subj.duration}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDispatchAlert) onDispatchAlert(subj);
                      }}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Subject Deep-Dive Spotlight (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Real-time Subject Dossier</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedSubject.name}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                selectedSubject.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
              }`}>
                Risk: {selectedSubject.riskScore}/100
              </span>
            </div>

            {/* Subject Snapshot & Threat Radar */}
            <div className="mt-3 relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-300">
              <img 
                src={selectedSubject.snapshot} 
                alt="Subject Preview" 
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute top-2 left-2 bg-slate-900/80 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                LOC: {selectedSubject.cameraId}
              </div>
              <div className="absolute bottom-2 left-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded animate-pulse">
                {selectedSubject.status}
              </div>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Combined Risk Vector</span>
                <p className="font-bold text-red-700 mt-0.5">{selectedSubject.riskFactors}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Responding Patrol Unit</span>
                <p className="font-semibold text-blue-800 mt-0.5">{selectedSubject.dispatchAssigned}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex space-x-2">
            <button
              onClick={() => onDispatchAlert && onDispatchAlert(selectedSubject)}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Escalate Urgent Patrol Interception</span>
            </button>
          </div>
        </div>

      </div>

      {/* Statutory Privacy Box */}
      <div className="bg-slate-50 border border-slate-200 text-slate-600 p-3 rounded-lg text-xs flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>All facial landmark and trajectory data is processed locally at edge nodes and anonymized under Digital Personal Data Protection (DPDP) Act, 2023.</span>
      </div>

    </div>
  );
}

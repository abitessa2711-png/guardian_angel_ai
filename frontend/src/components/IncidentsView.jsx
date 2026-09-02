import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Radio, 
  CheckCircle2, 
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';

export const INITIAL_INCIDENTS = [
  {
    id: 'INC-2025-089',
    title: 'Physical Altercation & Stalking Escalation',
    category: 'Human Safety',
    severity: 'Critical',
    location: 'Srirangam Temple South Gate (Camera 07)',
    assignedOfficer: 'SI M. Vijay (Patrol Car #12)',
    status: 'Dispatched',
    reportedTime: '11:21:47 AM',
    eta: '2 mins (400m away)',
    summary: 'Subject initiated physical confrontation after continuous trailing. GPS beacon broadcasted to nearest patrol unit.',
    timeline: [
      { time: '11:21:47 AM', event: 'AI Core triggered Critical Proximity Alert (< 0.5m grab interaction).' },
      { time: '11:22:10 AM', event: 'Duty Officer verified video stream evidence.' },
      { time: '11:22:45 AM', event: 'Patrol Car #12 dispatched with live route telemetry.' }
    ]
  },
  {
    id: 'INC-2025-088',
    title: 'Stray Cattle Crossing Fast Lane Highway',
    category: 'Animal Safety',
    severity: 'High',
    location: 'Trichy Highway Junction (Camera 04)',
    assignedOfficer: 'Traffic Warden K. Arul',
    status: 'In Progress',
    reportedTime: '11:23:10 AM',
    eta: 'On Scene',
    summary: 'Multiple bovine stray animals obstructed highway lane 1. VMS speed boards reduced speed limit to 40 km/h.',
    timeline: [
      { time: '11:23:10 AM', event: 'Computer Vision detected 2.4m vehicle-to-animal collision hazard.' },
      { time: '11:23:30 AM', event: 'Automated digital signboard warning engaged.' },
      { time: '11:24:15 AM', event: 'Traffic Warden on site guiding cattle to service lane.' }
    ]
  },
  {
    id: 'INC-2025-087',
    title: 'Suspect Trailing Commuter in Market Corridor',
    category: 'Public Safety',
    severity: 'Medium',
    location: 'Gandhi Market Wholesale North (Camera 09)',
    assignedOfficer: 'Officer S. Selvam (Beat 4)',
    status: 'Under Investigation',
    reportedTime: '11:20:31 AM',
    eta: 'Investigating',
    summary: 'Suspect followed individual through 3 consecutive alleys. Beat constable redirected to intersection.',
    timeline: [
      { time: '11:20:31 AM', event: 'AI multi-camera handover tracking linked trajectory across 3 cameras.' },
      { time: '11:21:05 AM', event: 'Beat Officer alerted via handheld terminal.' }
    ]
  },
  {
    id: 'INC-2025-086',
    title: 'Stray Canine Pack Chasing Pedestrian',
    category: 'Animal Safety',
    severity: 'High',
    location: 'Railway Junction North Gate (Camera 03)',
    assignedOfficer: 'RPF Officer J. Paul',
    status: 'Resolved',
    reportedTime: '11:19:22 AM',
    eta: 'Completed',
    summary: 'Pack of 2 stray dogs aggressively chased passenger. Railway Protection Force intercepted and secured area.',
    timeline: [
      { time: '11:19:22 AM', event: 'Acoustic scream spike (84 dB) + rapid chase vector identified.' },
      { time: '11:20:10 AM', event: 'RPF station team responded and secured commuter.' },
      { time: '11:24:00 AM', event: 'Incident closed. Commuter safely boarded train.' }
    ]
  }
];

export default function IncidentsView({ onOpenDispatchModal }) {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState(INITIAL_INCIDENTS[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = incidents.filter(inc => {
    if (statusFilter !== 'All' && inc.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return inc.title.toLowerCase().includes(q) ||
             inc.id.toLowerCase().includes(q) ||
             inc.location.toLowerCase().includes(q) ||
             inc.assignedOfficer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <span>Incident Command & Patrol Dispatch Management</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time incident triage, patrol routing, and operational status workflows.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenDispatchModal && onOpenDispatchModal(selectedIncident)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Dispatch Patrol Unit</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Incidents List (7 cols) & Right Incident Case Dossier (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Incident Filter & Table (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search incident ID, officer, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filtered.map(inc => {
              const isSelected = selectedIncident.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`bg-white rounded-lg border p-3.5 transition-all cursor-pointer shadow-xs ${
                    isSelected 
                      ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50/40' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{inc.id}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          inc.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}>
                          {inc.severity}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                          {inc.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 mt-1">{inc.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{inc.location}</p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        inc.status === 'Dispatched' ? 'bg-purple-100 text-purple-700 font-black animate-pulse' :
                        inc.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        inc.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inc.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1">{inc.reportedTime}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{inc.assignedOfficer}</span>
                    </span>
                    <span className="font-semibold text-blue-700">ETA: {inc.eta}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Selected Incident Case File (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Incident Dossier</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedIncident.id}</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                selectedIncident.status === 'Dispatched' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedIncident.status}
              </span>
            </div>

            <div className="space-y-3 mt-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Incident Title</span>
                <p className="font-bold text-slate-900 text-xs">{selectedIncident.title}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Location Coordinates</span>
                <p className="font-semibold text-slate-700">{selectedIncident.location}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">AI Threat & Context Assessment</span>
                <p className="text-slate-800 mt-1 leading-relaxed">{selectedIncident.summary}</p>
              </div>

              {/* Timeline */}
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-2">Audit & Dispatch Timeline</span>
                <div className="space-y-2 border-l-2 border-blue-600 pl-3 ml-1">
                  {selectedIncident.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className="font-mono text-[10px] font-bold text-blue-700 block">{step.time}</span>
                      <p className="text-[11px] text-slate-700">{step.event}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex space-x-2">
            <button 
              onClick={() => onOpenDispatchModal && onOpenDispatchModal(selectedIncident)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs flex items-center justify-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Update Patrol Command</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

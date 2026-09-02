import React, { useState } from 'react';
import { 
  UserX, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Send, 
  Search, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  Moon,
  Footprints
} from 'lucide-react';

export const AT_RISK_WOMEN = [
  {
    id: 'RISK-701',
    subject: 'Solo Commuter (Night Transit)',
    location: 'Lalgudi Underground Subway (Camera 05)',
    camera: 'CAM-05',
    vulnerabilityType: 'Isolated Low-Light Corridor + Loitering Suspect',
    riskLevel: 'Critical',
    riskScore: 92,
    timeFlagged: '11:22:05 AM',
    distanceToHelp: 'Subway Exit B (40m)',
    status: 'Patrol Dispatched',
    recommendation: 'Engage subway floodlights & dispatch station guard',
    snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'RISK-702',
    subject: 'Student (Hesitant Movement)',
    location: 'Central Bus Stand Platform 1 (Camera 02)',
    camera: 'CAM-02',
    vulnerabilityType: 'Repeated Glance Back + Rapid Following Suspect',
    riskLevel: 'High',
    riskScore: 88,
    timeFlagged: '11:24:10 AM',
    distanceToHelp: 'Police Help Desk (15m)',
    status: 'Under Operator Watch',
    recommendation: 'Alert platform constable on handheld radio',
    snapshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'RISK-703',
    subject: 'Evening Walker',
    location: 'Palakkarai Rail Subway (Camera 11)',
    camera: 'CAM-11',
    vulnerabilityType: 'Crowd Density Drop (< 2 persons/100m²)',
    riskLevel: 'Medium',
    riskScore: 65,
    timeFlagged: '11:15:30 AM',
    distanceToHelp: 'Main Road Junction (80m)',
    status: 'Automated Light Boost Engaged',
    recommendation: 'Keep camera zoomed on path until clear',
    snapshot: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop'
  }
];

export default function WomenAtRiskView({ onDispatchAlert }) {
  const [atRiskList, setAtRiskList] = useState(AT_RISK_WOMEN);
  const [search, setSearch] = useState('');

  const filtered = atRiskList.filter(item => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.subject.toLowerCase().includes(q) ||
             item.location.toLowerCase().includes(q) ||
             item.vulnerabilityType.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <UserX className="w-5 h-5 text-red-600" />
            <span>Women at Risk — Vulnerability & Isolated Corridor Triage</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated detection of isolated pedestrians in dark subways, bus stops, and low-density transit corridors.</p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search risk cases..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              {/* Header */}
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-900">{item.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.riskLevel === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-orange-100 text-orange-800'
                }`}>
                  {item.riskLevel} ({item.riskScore}%)
                </span>
              </div>

              {/* Visual Snapshot */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img 
                  src={item.snapshot} 
                  alt="Risk subject preview"
                  className="w-full h-full object-cover brightness-95"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {item.camera}
                </div>
                <div className="absolute bottom-2 left-2 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  {item.status}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">{item.subject}</h4>
                <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.location}</span>
                </p>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Vulnerability Pattern</span>
                  <p className="text-red-700 font-bold">{item.vulnerabilityType}</p>
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">Recommended Action: </span>
                  <span>{item.recommendation}</span>
                </div>
              </div>
            </div>

            {/* Footer Dispatch */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => onDispatchAlert && onDispatchAlert(item)}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Nearest Officer</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

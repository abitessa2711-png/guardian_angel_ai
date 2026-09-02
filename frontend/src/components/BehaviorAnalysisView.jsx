import React, { useState } from 'react';
import { 
  Eye, 
  Footprints, 
  Users, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Send, 
  Search, 
  ShieldAlert,
  Activity,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const BEHAVIOR_EVENTS = [
  {
    id: 'BHV-101',
    type: 'Persistent Following & Stalking Path',
    riskLevel: 'Critical',
    riskScore: 94,
    camera: 'Camera 09 - Gandhi Market Lane',
    timestamp: '11:20:31 AM',
    confidence: 0.96,
    proximity: '0.8m gap maintained',
    duration: '18 mins continuous tracking',
    subjects: 'Woman #4412 (Target) & Suspect #8821',
    vectorSpeed: '1.2 m/s (Matched velocity)',
    status: 'Patrol Dispatched'
  },
  {
    id: 'BHV-102',
    type: 'Physical Grab & Struggle Vector',
    riskLevel: 'Critical',
    riskScore: 98,
    camera: 'Camera 07 - Srirangam Temple South',
    timestamp: '11:21:47 AM',
    confidence: 0.98,
    proximity: '0.2m physical contact',
    duration: 'Rapid struggle anomaly',
    subjects: 'Woman #4418 & Suspect #3312',
    vectorSpeed: '2.8 m/s sudden acceleration',
    status: 'PCR Car #12 Responding'
  },
  {
    id: 'BHV-103',
    type: 'Rapid Chasing Acceleration',
    riskLevel: 'High',
    riskScore: 89,
    camera: 'Camera 03 - Railway Station North',
    timestamp: '11:19:22 AM',
    confidence: 0.93,
    proximity: 'Distance closing (2.5m -> 0.7m)',
    duration: '40 seconds sprint',
    subjects: 'Woman #4435 & Suspect #1109',
    vectorSpeed: '4.5 m/s sprint vector',
    status: 'Resolved by Station Guard'
  },
  {
    id: 'BHV-104',
    type: 'Stairway Path Blocking Movement',
    riskLevel: 'High',
    riskScore: 86,
    camera: 'Camera 02 - Transit Terminal Platform 1',
    timestamp: '11:24:10 AM',
    confidence: 0.94,
    proximity: '0.5m path obstruction',
    duration: '2 mins stationary block',
    subjects: 'Woman #4422 & Suspect #7714',
    vectorSpeed: '0.1 m/s (Blocking stance)',
    status: 'Verified'
  },
  {
    id: 'BHV-105',
    type: 'Repeated Close Circular Interaction',
    riskLevel: 'Medium',
    riskScore: 68,
    camera: 'Camera 05 - Campus Subway Walkway',
    timestamp: '11:18:20 AM',
    confidence: 0.88,
    proximity: '1.2m proximity circling',
    duration: '5 mins',
    subjects: 'Woman #4429 & Suspect #9910',
    vectorSpeed: '0.8 m/s circling loop',
    status: 'Under Watch'
  },
  {
    id: 'BHV-106',
    type: 'Suspicious Corner Loitering Intersection',
    riskLevel: 'Medium',
    riskScore: 62,
    camera: 'Camera 04 - University Main Gate',
    timestamp: '11:12:05 AM',
    confidence: 0.85,
    proximity: '2.1m waiting proximity',
    duration: '14 mins',
    subjects: 'Woman #4440 & Suspect #6620',
    vectorSpeed: 'Stationary wait',
    status: 'Normal Warning'
  }
];

export default function BehaviorAnalysisView({ onDispatchAlert }) {
  const [events, setEvents] = useState(BEHAVIOR_EVENTS);
  const [selectedRisk, setSelectedRisk] = useState('All');

  const filtered = events.filter(e => {
    if (selectedRisk !== 'All' && e.riskLevel !== selectedRisk) return false;
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <span>Spatial-Temporal Behavior & Trajectory Risk Analysis</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated velocity matching, proximity violation tracking, path obstruction, and physical altercation recognition.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Filter Severity:</span>
          <select 
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Behavioral Vectors</option>
            <option value="Critical">Critical Altercations</option>
            <option value="High">High Risk Trailing</option>
            <option value="Medium">Medium Risk Loitering</option>
          </select>
        </div>
      </div>

      {/* Multi-Factor Risk Calculation Explanatory Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Integrated Multi-Factor Risk Engine Formula</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Edge Compute v3.2</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-1">
          <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">1. Facial Emotion</span>
            <span className="font-bold text-slate-200">Weight: 30%</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">2. Behavior Pattern</span>
            <span className="font-bold text-slate-200">Weight: 30%</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">3. Proximity Gap</span>
            <span className="font-bold text-slate-200">Weight: 20%</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">4. Movement Vector</span>
            <span className="font-bold text-slate-200">Weight: 10%</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">5. Time Duration</span>
            <span className="font-bold text-slate-200">Weight: 10%</span>
          </div>
        </div>
      </div>

      {/* Behavioral Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono font-bold text-xs text-slate-500">{item.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.riskLevel === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300' :
                  item.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.riskLevel} ({item.riskScore}%)
                </span>
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">{item.type}</h4>
                <p className="text-[11px] text-slate-600 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.camera}</span>
                </p>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subjects:</span>
                    <span className="font-bold text-slate-900">{item.subjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Proximity:</span>
                    <span className="font-bold text-red-700">{item.proximity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Speed Vector:</span>
                    <span className="font-mono text-slate-700">{item.vectorSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="text-slate-700">{item.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-mono">{item.timestamp}</span>
                  <span className="font-bold text-blue-700">{item.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex space-x-2">
              <button
                onClick={() => onDispatchAlert && onDispatchAlert({ ...item, title: item.type, location: item.camera })}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Incident Response</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

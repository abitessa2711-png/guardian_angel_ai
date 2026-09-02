import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  Eye, 
  Send, 
  Clock, 
  MapPin, 
  CheckCircle2,
  Volume2,
  Footprints,
  Users
} from 'lucide-react';

export const HARASSMENT_EVENTS = [
  {
    id: 'HAR-901',
    eventTitle: 'Following & Trailing Vector (18 mins)',
    category: 'Stalking / Following',
    camera: 'Camera 09 - Gandhi Market Lane',
    cameraId: 'CAM-09',
    timestamp: '11:20:31 AM',
    proximity: '0.8m gap maintained',
    duration: '18 minutes',
    riskLevel: 'Critical',
    confidence: 0.96,
    subjects: 'Woman #4412 & Suspect #8821',
    status: 'Dispatched',
    description: 'Suspect matched walking velocity across 4 intersections. Distance decreased from 3.2m to 0.8m.'
  },
  {
    id: 'HAR-902',
    eventTitle: 'Physical Grab & Struggle Attempt',
    category: 'Physical Struggle',
    camera: 'Camera 07 - Srirangam South Gate',
    cameraId: 'CAM-07',
    timestamp: '11:21:47 AM',
    proximity: '0.2m physical contact',
    duration: '45 seconds',
    riskLevel: 'Critical',
    confidence: 0.98,
    subjects: 'Woman #4418 & Suspect #3312',
    status: 'Dispatched',
    description: 'Sudden trajectory grab vector locked between two individuals. PCR Car #12 responding with sirens.'
  },
  {
    id: 'HAR-903',
    eventTitle: 'Aggressive Path Blocking Approach',
    category: 'Blocking Movement',
    camera: 'Camera 02 - Bus Stand Platform 1',
    cameraId: 'CAM-02',
    timestamp: '11:24:10 AM',
    proximity: '0.5m path obstruction',
    duration: '2 minutes',
    riskLevel: 'High',
    confidence: 0.94,
    subjects: 'Woman #4422 & Suspect #7714',
    status: 'Verified',
    description: 'Suspect actively blocked commuter stairway egress. Handheld radio call dispatched to platform guard.'
  },
  {
    id: 'HAR-904',
    eventTitle: 'Repeated Close Interaction & Circling',
    category: 'Suspicious Interaction',
    camera: 'Camera 05 - Subway Walkway',
    cameraId: 'CAM-05',
    timestamp: '11:18:20 AM',
    proximity: '1.1m proximity',
    duration: '5 minutes',
    riskLevel: 'High',
    confidence: 0.91,
    subjects: 'Woman #4429 & Suspect #9910',
    status: 'New',
    description: 'Suspect made 3 consecutive circular passes around solo female pedestrian waiting at corridor.'
  },
  {
    id: 'HAR-905',
    eventTitle: 'Acoustic Distress Scream Spike (88 dB)',
    category: 'Verbal / Acoustic Scream',
    camera: 'Camera 03 - Railway Station North',
    cameraId: 'CAM-03',
    timestamp: '11:19:22 AM',
    proximity: '1.4m proximity',
    duration: 'Instantaneous Spike',
    riskLevel: 'High',
    confidence: 0.93,
    subjects: 'Woman #4435',
    status: 'Resolved',
    description: 'High-frequency acoustic audio surge detected by microphone sensor array. RPF squad intervened.'
  }
];

export default function HarassmentDetectionView({ onSelectAlert, onDispatchAlert }) {
  const [events, setEvents] = useState(HARASSMENT_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Stalking / Following', 'Physical Struggle', 'Blocking Movement', 'Suspicious Interaction', 'Verbal / Acoustic Scream'];

  const filtered = events.filter(e => {
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.eventTitle.toLowerCase().includes(q) ||
             e.camera.toLowerCase().includes(q) ||
             e.subjects.toLowerCase().includes(q);
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
            <span>AI-Powered Harassment & Threat Pattern Detection</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated identification of stalking vectors, path blocking, acoustic distress shrieks, and aggressive approaches.</p>
        </div>

        <button
          onClick={() => alert('Exporting harassment incident records CSV')}
          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dossier</span>
        </button>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Threat Vector:</span>
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search harassment incident, subjects, camera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 font-medium"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Threat Classification</th>
                <th className="py-2.5 px-4">Location Node</th>
                <th className="py-2.5 px-3">Proximity & Duration</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(event => (
                <tr key={event.id} className="hover:bg-red-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <span className="font-bold text-slate-900">{event.timestamp}</span>
                    <span className="block text-[10px] text-slate-400">{event.id}</span>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 leading-snug">{event.eventTitle}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{event.subjects}</p>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                    {event.camera}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-bold text-red-700 block">{event.proximity}</span>
                    <span className="text-[10px] text-slate-500">{event.duration}</span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                      event.riskLevel === 'Critical' ? 'bg-red-100 text-red-800 border border-red-300 font-black' : 'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {event.riskLevel}
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {(event.confidence * 100).toFixed(0)}%
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.status === 'Dispatched' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                      event.status === 'New' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {event.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => onSelectAlert && onSelectAlert({ ...event, event: event.eventTitle, time: event.timestamp, risk: event.riskLevel })}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded font-semibold text-xs cursor-pointer"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => onDispatchAlert && onDispatchAlert({ ...event, title: event.eventTitle, location: event.camera })}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs cursor-pointer shadow-xs"
                    >
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

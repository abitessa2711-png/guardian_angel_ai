import React, { useState } from 'react';
import { 
  Dog, 
  AlertTriangle, 
  Car, 
  User, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Radio, 
  CheckCircle2, 
  PhoneCall,
  Activity,
  Compass
} from 'lucide-react';

export const ANIMAL_SAFETY_EVENTS = [
  {
    id: 'ANM-301',
    eventTitle: 'Animal on Road – Potential Accident Risk',
    animalType: 'Bovine (Stray Cattle)',
    location: 'Camera 04 - Trichy Main Highway',
    camera: 'CAM-04',
    distance: '2.4m from oncoming bus',
    riskLevel: 'High',
    riskScore: 88,
    timestamp: '11:23:10 AM',
    speedEstimate: '0.4 m/s (Crossing median)',
    snapshot: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',
    actionTaken: 'Automated VMS highway billboard speed warning triggered',
    status: 'Active Alert'
  },
  {
    id: 'ANM-302',
    eventTitle: 'Animal Chasing Person',
    animalType: 'Canine Pack (2 Stray Dogs)',
    location: 'Camera 03 - Railway Junction North',
    camera: 'CAM-03',
    distance: '1.5m from running commuter',
    riskLevel: 'High',
    riskScore: 84,
    timestamp: '11:19:22 AM',
    speedEstimate: '4.2 m/s (Rapid charge vector)',
    snapshot: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=600&auto=format&fit=crop',
    actionTaken: 'Station security unit alert broadcasted',
    status: 'Resolved'
  },
  {
    id: 'ANM-303',
    eventTitle: 'Animal Near Moving Vehicle',
    animalType: 'Bovine (Cow on Highway Shoulder)',
    location: 'Camera 06 - NIT Outer Ring Road',
    camera: 'CAM-06',
    distance: '1.8m from fast lane traffic',
    riskLevel: 'Medium',
    riskScore: 68,
    timestamp: '11:08:55 AM',
    speedEstimate: '0.1 m/s (Stationary grazing)',
    snapshot: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=600&auto=format&fit=crop',
    actionTaken: 'Municipal cattle patrol warden dispatched',
    status: 'Resolved'
  },
  {
    id: 'ANM-304',
    eventTitle: 'Unusual Animal Pack Congestion',
    animalType: 'Canine (4 Stray Dogs)',
    location: 'Camera 01 - Chatram Bus Stand Backlane',
    camera: 'CAM-01',
    distance: '3.0m from passenger queue',
    riskLevel: 'Medium',
    riskScore: 62,
    timestamp: '10:54:12 AM',
    speedEstimate: '1.1 m/s (Circling)',
    snapshot: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop',
    actionTaken: 'Sanitation & animal control unit logged',
    status: 'Verified Clear'
  }
];

export default function AnimalMonitoringView({ onDispatchAlert }) {
  const [selectedEvent, setSelectedEvent] = useState(ANIMAL_SAFETY_EVENTS[0]);
  const [filterRisk, setFilterRisk] = useState('All');

  const filteredEvents = ANIMAL_SAFETY_EVENTS.filter(e => {
    if (filterRisk !== 'All' && e.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Dog className="w-5 h-5 text-orange-600" />
            <span>Animal & Road Safety Surveillance Module</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated detection of stray animals, collision hazards, and public pedestrian safety risks.</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Filter Risk:</span>
          <select 
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Animal Hazards</option>
            <option value="High">High Risk Hazards</option>
            <option value="Medium">Medium Risk Hazards</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Left Event Showcase & Right Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Active Live Hazard Spotlight (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Live Animal Detection Spotlight: {selectedEvent.id}
              </h4>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              selectedEvent.riskLevel === 'High' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {selectedEvent.riskLevel} Risk ({selectedEvent.riskScore}%)
            </span>
          </div>

          <div className="p-4 space-y-3">
            {/* Visual Feed Snapshot with Bounding Box Overlay */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-200">
              <img 
                src={selectedEvent.snapshot} 
                alt="Animal Detection Footage" 
                className="w-full h-full object-cover brightness-95"
              />
              
              {/* Computer Vision Yellow Bounding Box Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-36 h-36 border-2 border-yellow-400 bg-yellow-400/10 rounded flex flex-col justify-between p-1.5 shadow-lg">
                  <span className="bg-yellow-400 text-slate-950 font-bold text-[10px] px-1 py-0.5 rounded w-max">
                    {selectedEvent.animalType}
                  </span>
                  <span className="bg-slate-900/80 text-yellow-300 font-mono text-[9px] px-1 py-0.5 rounded w-max">
                    GAP: {selectedEvent.distance}
                  </span>
                </div>
              </div>

              {/* Timestamp & Location Badges */}
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 rounded">
                {selectedEvent.location}
              </div>
              <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 rounded">
                {selectedEvent.timestamp}
              </div>
            </div>

            {/* Event Key Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Animal Class</span>
                <span className="font-bold text-slate-900">{selectedEvent.animalType}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Traffic Proximity</span>
                <span className="font-bold text-orange-700">{selectedEvent.distance}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Speed / Vector</span>
                <span className="font-mono text-slate-700">{selectedEvent.speedEstimate}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status</span>
                <span className="font-bold text-slate-800">{selectedEvent.status}</span>
              </div>
            </div>

            {/* Automated Mitigation Action Banner */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Safety Protocol Executed:</span>
                <span>{selectedEvent.actionTaken}</span>
              </div>
              <button 
                onClick={() => onDispatchAlert && onDispatchAlert(selectedEvent)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs shrink-0 cursor-pointer shadow-xs"
              >
                Dispatch Patrol
              </button>
            </div>
          </div>
        </div>

        {/* Right: Recent Animal Hazards Feed (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Animal Safety Detection Log
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">{filteredEvents.length} Active Records</span>
            </div>

            <div className="divide-y divide-slate-100 p-2 max-h-[480px] overflow-y-auto">
              {filteredEvents.map(event => {
                const isSelected = selectedEvent.id === event.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`p-3 rounded-md transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50/80 border border-blue-300 ring-1 ring-blue-300' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{event.eventTitle}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        event.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.riskLevel}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{event.location}</span>
                      <span className="font-mono text-slate-400">{event.timestamp}</span>
                    </div>

                    <div className="mt-1.5 text-xs text-slate-700 flex items-center space-x-1 font-medium">
                      <span className="text-slate-400 font-normal">Distance:</span>
                      <span className="text-orange-700 font-bold">{event.distance}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center font-medium">
            Animal Detection AI Models: Bovine, Canine & Equine Collision Predictor v2.4
          </div>
        </div>

      </div>

    </div>
  );
}

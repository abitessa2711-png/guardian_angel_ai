import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Radio, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2,
  Car,
  User,
  Navigation
} from 'lucide-react';

export const PATROL_UNITS = [
  { id: 'PCR-12', name: 'Patrol Car #12 (SI M. Vijay)', location: 'Srirangam South Road', distance: '400m away', eta: '2 mins', status: 'Available' },
  { id: 'PCR-04', name: 'Highway Interceptor #04 (SI K. Arul)', location: 'Trichy Highway NH-45', distance: '1.2 km away', eta: '4 mins', status: 'Available' },
  { id: 'BEAT-09', name: 'Market Beat Constable (S. Selvam)', location: 'Gandhi Market Post', distance: '250m away', eta: '1 min', status: 'Available' },
  { id: 'RPF-01', name: 'Railway Police Squad (J. Paul)', location: 'Junction Gate 2', distance: '150m away', eta: '1 min', status: 'On Duty' },
];

export default function DispatchModal({ 
  incident, 
  onClose, 
  onConfirmDispatch 
}) {
  const [selectedUnit, setSelectedUnit] = useState(PATROL_UNITS[0].id);
  const [dispatchPriority, setDispatchPriority] = useState('Immediate Emergency');
  const [dispatchDispatched, setDispatchDispatched] = useState(false);

  if (!incident) return null;

  const handleSendDispatch = (e) => {
    e.preventDefault();
    setDispatchDispatched(true);
    setTimeout(() => {
      if (onConfirmDispatch) onConfirmDispatch(incident, selectedUnit);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0b1b30] text-white px-5 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm tracking-tight text-white">Emergency Patrol Unit Dispatch</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendDispatch} className="p-5 space-y-4 text-xs">
          
          {/* Target Location Summary */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Target Incident</span>
              <span className="font-mono text-slate-500 font-bold">{incident.id || 'INC-2025-089'}</span>
            </div>
            <p className="font-bold text-slate-900 text-xs">{incident.title || incident.event}</p>
            <p className="text-[11px] text-slate-600 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>{incident.location || incident.camera || 'Main Intersection'}</span>
            </p>
          </div>

          {/* Unit Selection */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block">Select Nearest Responding Unit</label>
            <div className="space-y-1.5">
              {PATROL_UNITS.map(unit => {
                const isSelected = selectedUnit === unit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setSelectedUnit(unit.id)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-1.5 rounded ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{unit.name}</p>
                        <p className="text-[10px] text-slate-500">{unit.location} • {unit.distance}</p>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-blue-700 text-xs">
                      <span>ETA: {unit.eta}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Level */}
          <div>
            <label className="font-bold text-slate-800 block mb-1">Dispatch Priority Level</label>
            <select
              value={dispatchPriority}
              onChange={(e) => setDispatchPriority(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="Immediate Emergency">Immediate Emergency (Sirens & Lights)</option>
              <option value="Urgent Response">Urgent Response (Standard Dispatch)</option>
              <option value="Routine Check">Routine Verification Check</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={dispatchDispatched}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs cursor-pointer shadow-sm flex items-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{dispatchDispatched ? 'Transmitting Dispatch Order...' : 'Confirm & Transmit Dispatch'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

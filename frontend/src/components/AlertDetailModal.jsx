import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Camera, 
  CheckCircle2, 
  Send, 
  Eye, 
  FileText,
  Volume2
} from 'lucide-react';

export const getRealisticCCTVSnapshot = (alert) => {
  if (alert?.snapshot && !alert.snapshot.includes('1544620347-c4fd4a3d5957')) {
    return alert.snapshot;
  }
  const text = `${alert?.event || ''} ${alert?.title || ''} ${alert?.category || ''}`.toLowerCase();
  if (text.includes('animal') || text.includes('cattle') || text.includes('cow') || text.includes('bovine')) {
    return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('stalk') || text.includes('trail') || text.includes('follow')) {
    return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop';
  }
  if (text.includes('distress') || text.includes('struggle') || text.includes('confront') || text.includes('harass')) {
    return 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop';
};

export default function AlertDetailModal({ 
  alert, 
  onClose, 
  onDispatch,
  onResolve 
}) {
  const [officerNotes, setOfficerNotes] = useState('');
  const [isResolved, setIsResolved] = useState(alert?.status === 'Resolved');

  if (!alert) return null;

  const eventText = `${alert.event || alert.title || ''} ${alert.category || ''}`.toLowerCase();
  const isAnimal = eventText.includes('animal') || eventText.includes('cattle');
  const isStalking = eventText.includes('stalk') || eventText.includes('trail') || eventText.includes('follow');
  const isConfrontation = eventText.includes('struggle') || eventText.includes('confront') || eventText.includes('harass') || eventText.includes('distress');

  const snapshotSrc = getRealisticCCTVSnapshot(alert);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Modal Header */}
        <div className="bg-[#000080] text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
              alert.risk === 'Critical' ? 'bg-red-600 text-white' : alert.risk === 'High' || alert.risk === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-yellow-500 text-slate-950 font-bold'
            }`}>
              {alert.risk} Priority
            </span>
            <h3 className="font-bold text-xs sm:text-sm tracking-tight text-white truncate max-w-[280px] sm:max-w-md">
              {alert.event || alert.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Sized to fit cleanly without excess scroll */}
        <div className="p-3.5 space-y-2.5 overflow-y-auto text-xs text-slate-800">
          
          {/* Top Video Snapshot / Imagery with Realistic Reticles */}
          <div className="relative h-44 sm:h-48 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-300">
            <img 
              src={snapshotSrc} 
              alt="Incident Snapshot"
              className="w-full h-full object-cover brightness-90 contrast-105"
            />

            {/* Overlaid Realistic Computer Vision Bounding Boxes */}
            <div className="absolute inset-0 pointer-events-none">
              {isAnimal ? (
                /* Animal Hazard Box */
                <div className="absolute top-[28%] left-[32%] w-[36%] h-[48%] border-2 border-amber-400 bg-amber-400/10 rounded-xs">
                  <div className="absolute -top-5 left-0 bg-amber-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow">
                    BOVINE CATTLE HAZARD (94%)
                  </div>
                  <div className="absolute inset-0 border border-dashed border-amber-300/60"></div>
                </div>
              ) : isStalking ? (
                /* Persistent Stalking & Trailing Boxes */
                <>
                  {/* Woman Subject Box */}
                  <div className="absolute top-[22%] left-[48%] w-[20%] h-[58%] border-2 border-emerald-400 bg-emerald-400/10 rounded-xs">
                    <div className="absolute -top-5 left-0 bg-emerald-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow">
                      WOMAN COMMUTER (96%)
                    </div>
                  </div>
                  {/* Trailing Suspect Box */}
                  <div className="absolute top-[20%] left-[24%] w-[20%] h-[60%] border-2 border-red-500 bg-red-500/10 rounded-xs animate-pulse">
                    <div className="absolute -top-5 left-0 bg-red-600 text-white text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow">
                      TRAILING SUSPECT (92%)
                    </div>
                  </div>
                  {/* Proximity Distance Vector */}
                  <div className="absolute top-[52%] left-[38%] bg-black/80 text-yellow-300 border border-yellow-400/60 text-[8px] font-mono px-1 py-0.5 rounded">
                    GAP: 1.2m [CRITICAL]
                  </div>
                </>
              ) : isConfrontation ? (
                /* Struggle / Emergency Confrontation Box */
                <div className="absolute top-[20%] left-[28%] w-[44%] h-[62%] border-2 border-red-600 bg-red-600/15 rounded-xs animate-pulse">
                  <div className="absolute -top-5 left-0 bg-red-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs shadow flex items-center space-x-1">
                    <span>⚠️ PHYSICAL CONFRONTATION / DISTRESS (96%)</span>
                  </div>
                </div>
              ) : (
                /* General Surveillance Target Box */
                <div className="absolute top-[24%] left-[34%] w-[32%] h-[54%] border-2 border-yellow-400 bg-yellow-400/15 rounded-xs">
                  <div className="absolute -top-5 left-0 bg-yellow-400 text-slate-950 font-bold text-[9px] font-mono px-1.5 py-0.5 rounded-xs shadow">
                    {alert.category || 'Surveillance Target'} ({((alert.confidence || 0.94) * 100).toFixed(0)}%)
                  </div>
                </div>
              )}
            </div>

            {/* Camera Tag & Timestamp */}
            <div className="absolute top-2 left-2 bg-slate-900/85 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-white/10">
              NODE: {alert.camera || 'CAM 04 - Commercial Bazaar'}
            </div>
            <div className="absolute top-2 right-2 bg-slate-900/85 text-emerald-400 text-[9px] font-mono px-2 py-0.5 rounded border border-white/10">
              TIME: {alert.time || '15:24:18'}
            </div>
            <div className="absolute bottom-1.5 left-2 bg-black/70 text-slate-300 text-[8px] font-mono px-1.5 py-0.2 rounded">
              SEC 65B INDIAN EVIDENCE ACT SEALED
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Classification</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block truncate">{alert.category || 'Human Safety'}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">AI Confidence</span>
              <span className="font-bold text-blue-700 font-mono text-xs mt-0.5 block">
                {((alert.confidence || 0.94) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <span className="text-[9px] text-slate-400 font-bold uppercase block">Current Status</span>
              <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{isResolved ? 'Resolved' : (alert.status || 'Active')}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Context Details</span>
            <p className="text-slate-700 text-[11px] leading-snug">
              {alert.description || 'Automated spatial-temporal trajectory tracking locked potential hazard. Proximity threshold breached.'}
            </p>
          </div>

          {/* Duty Officer Notes Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block text-[11px]">Duty Officer Verification Log</label>
            <input
              type="text"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Enter duty notes, verification findings, or patrol feedback..."
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer transition-colors"
          >
            Close
          </button>

          <div className="flex space-x-2">
            {!isResolved && (
              <button
                onClick={() => {
                  setIsResolved(true);
                  if (onResolve) onResolve(alert.id);
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer transition-colors flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onDispatch) onDispatch(alert);
                onClose();
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Patrol</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

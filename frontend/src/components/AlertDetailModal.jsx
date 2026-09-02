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

export default function AlertDetailModal({ 
  alert, 
  onClose, 
  onDispatch,
  onResolve 
}) {
  const [officerNotes, setOfficerNotes] = useState('');
  const [isResolved, setIsResolved] = useState(alert?.status === 'Resolved');

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#0b1b30] text-white px-5 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
              alert.risk === 'Critical' ? 'bg-red-600 text-white' : alert.risk === 'High' ? 'bg-orange-600 text-white' : 'bg-yellow-500 text-slate-950 font-bold'
            }`}>
              {alert.risk} Priority
            </span>
            <h3 className="font-bold text-sm tracking-tight text-white">{alert.event || alert.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-800">
          
          {/* Top Video Snapshot / Imagery */}
          <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-200">
            <img 
              src={alert.snapshot || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop"} 
              alt="Incident Snapshot"
              className="w-full h-full object-cover brightness-95"
            />
            {/* Subtle Overlay bounding box */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-2 border-yellow-400 bg-yellow-400/15 w-40 h-40 rounded flex items-end p-1.5 shadow-lg">
                <span className="bg-yellow-400 text-slate-950 font-bold text-[10px] px-1 py-0.5 rounded">
                  {alert.category || 'Surveillance Target'} ({( (alert.confidence || 0.94) * 100 ).toFixed(0)}%)
                </span>
              </div>
            </div>

            <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
              NODE: {alert.camera || 'Camera 04 - Main Road'}
            </div>
            <div className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
              TIME: {alert.time || '11:23:10 AM'}
            </div>
          </div>

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Classification</span>
              <span className="font-bold text-slate-900 text-xs mt-0.5 block">{alert.category || 'Human Safety'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Confidence</span>
              <span className="font-bold text-blue-700 font-mono text-xs mt-0.5 block">
                {((alert.confidence || 0.94) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Status</span>
              <span className="font-bold text-emerald-700 text-xs mt-0.5 block">{isResolved ? 'Resolved' : (alert.status || 'Active')}</span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Context Details</span>
            <p className="text-slate-700 leading-relaxed text-xs">
              {alert.description || 'Automated spatial-temporal trajectory tracking locked potential hazard. Proximity threshold breached.'}
            </p>
          </div>

          {/* Duty Officer Notes Field */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Duty Officer Verification Log</label>
            <textarea
              rows="2"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Enter duty notes, verification findings, or patrol feedback..."
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer transition-colors"
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
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer transition-colors flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Verified & Resolved</span>
              </button>
            )}

            <button
              onClick={() => {
                if (onDispatch) onDispatch(alert);
                onClose();
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer transition-colors shadow-xs flex items-center space-x-1"
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

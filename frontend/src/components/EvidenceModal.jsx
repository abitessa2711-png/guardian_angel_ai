import React from 'react';
import { 
  X, 
  Download, 
  FileLock2, 
  ShieldCheck, 
  Hash, 
  Calendar, 
  Camera, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

export default function EvidenceModal({ 
  evidence, 
  onClose, 
  onMarkVerified 
}) {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#0b1b30] text-white px-5 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <FileLock2 className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xs font-bold text-slate-300">{evidence.id}</span>
            <span className="text-slate-500">|</span>
            <h3 className="font-bold text-sm tracking-tight text-white">{evidence.eventTitle}</h3>
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
          
          {/* Main Evidence Visual Preview */}
          <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-300 shadow-inner">
            <img 
              src={evidence.thumbnail} 
              alt="Evidence high-resolution capture"
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white font-mono text-[10px] px-2.5 py-1 rounded border border-white/10">
              TAMPER-PROOF RECORDING: {evidence.id}
            </div>
            <div className="absolute bottom-3 right-3 bg-emerald-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow">
              CRYPTOGRAPHICALLY LOCKED
            </div>
          </div>

          {/* Cryptographic Manifest & Chain of Custody */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 text-slate-900 font-bold border-b border-slate-200 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="uppercase text-[11px] tracking-wider">Statutory Forensic Chain of Custody (Sec 65B Indian Evidence Act)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Camera Node</span>
                <span className="font-bold text-slate-900">{evidence.camera}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Capture Timestamp</span>
                <span className="font-mono text-slate-700">{evidence.timestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Container Format</span>
                <span className="font-semibold text-slate-700">{evidence.fileType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Verification State</span>
                <span className="font-bold text-emerald-700">{evidence.verificationStatus}</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] font-mono bg-white p-2 rounded border border-slate-200 flex items-center space-x-1.5 text-slate-700">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-bold shrink-0">SHA-256 HASH:</span>
              <span className="select-all break-all">{evidence.sha256}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer"
          >
            Dismiss
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded cursor-pointer flex items-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>

            <button
              onClick={() => alert(`Downloading evidence export ZIP for ${evidence.id}`)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded cursor-pointer shadow-xs flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Evidence Package</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

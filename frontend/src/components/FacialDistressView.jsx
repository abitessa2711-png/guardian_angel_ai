import React, { useState } from 'react';
import { 
  Scan, 
  Smile, 
  Frown, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Camera 
} from 'lucide-react';

export const FACIAL_EXPRESSION_RECORDS = [
  {
    id: 'EXP-WOMEN-801',
    personId: 'Woman #4412 (Central Bus Stand)',
    expression: 'Fear',
    confidence: 0.92,
    distressStatus: 'Potential Distress Indicator',
    timestamp: '11:24:10 AM',
    camera: 'Camera 02 - Transit Terminal Platform 1',
    snapshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '88%', jawTension: '91%', eyebrowFurrow: '84%', lipCompression: '76%' },
    verification: 'Dispatched to Platform Constable'
  },
  {
    id: 'EXP-WOMEN-802',
    personId: 'Woman #4419 (Subway Pedestrian)',
    expression: 'Distress / High Agitation',
    confidence: 0.88,
    distressStatus: 'Potential Unsafe Situation',
    timestamp: '11:22:05 AM',
    camera: 'Camera 05 - Campus Subway Walkway',
    snapshot: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '78%', jawTension: '65%', eyebrowFurrow: '72%', lipCompression: '81%' },
    verification: 'Pending Officer Review'
  },
  {
    id: 'EXP-WOMEN-803',
    personId: 'Woman #4425 (Market Lane)',
    expression: 'Sadness / Withdrawal',
    confidence: 0.85,
    distressStatus: 'Behavioral Risk Detected',
    timestamp: '11:20:31 AM',
    camera: 'Camera 09 - Gandhi Market Alley',
    snapshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '42%', jawTension: '55%', eyebrowFurrow: '80%', lipCompression: '70%' },
    verification: 'Requires Verification'
  },
  {
    id: 'EXP-WOMEN-804',
    personId: 'Woman #4431 (Railway Gate)',
    expression: 'Neutral / Calm',
    confidence: 0.96,
    distressStatus: 'Standard Baseline',
    timestamp: '11:15:10 AM',
    camera: 'Camera 03 - Railway Station North Gate',
    snapshot: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '12%', jawTension: '10%', eyebrowFurrow: '15%', lipCompression: '10%' },
    verification: 'Normal Activity'
  }
];

export default function FacialDistressView({ onSelectAlert }) {
  const [selectedRecord, setSelectedRecord] = useState(FACIAL_EXPRESSION_RECORDS[0]);

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Scan className="w-5 h-5 text-blue-600" />
            <span>Facial Distress & Micro-Expression Analysis Engine</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time facial landmark mesh and affective distress classification (Fear, Distress, Sadness, Anger, Neutral).</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-bold">
          <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Facial Landmark Mesh: 468 Points Active</span>
        </div>
      </div>

      {/* Mandatory Statutory Regulatory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 rounded-lg shadow-xs flex items-start space-x-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold uppercase tracking-wider text-amber-950 mb-0.5">
            Statutory AI Standard & Ethical Compliance Notice
          </h4>
          <p>
            <strong>Facial expression analysis is a probabilistic indicator and does NOT independently confirm harassment, abuse, or danger.</strong> Distress indicators represent emotional arousal anomalies designed to guide human operators. All automatic triggers must be verified by certified law enforcement duty officers prior to operational action.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Roster (6 cols) & Right Deep-Dive Case (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Facial Record Cards (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Detected Subject Faces & Affective States
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Confidence Cutoff: &gt; 80%</span>
          </div>

          <div className="divide-y divide-slate-100 p-2 space-y-1">
            {FACIAL_EXPRESSION_RECORDS.map(item => {
              const isSelected = selectedRecord.id === item.id;
              const isFear = item.expression.includes('Fear') || item.expression.includes('Distress');

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecord(item)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600' : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.snapshot} 
                      alt="Face thumbnail" 
                      className="w-12 h-12 rounded-md object-cover border border-slate-300 shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{item.personId}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        Classified Emotion: <span className="font-bold text-slate-900">{item.expression}</span>
                      </p>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                        isFear ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.distressStatus}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-slate-900 block">{(item.confidence * 100).toFixed(0)}%</span>
                    <span className="text-[10px] text-slate-400">Confidence</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Focused Facial Telemetry & Micro-Expression Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Affective Dossier</span>
                <h4 className="text-sm font-bold text-slate-900">{selectedRecord.personId}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                AI Confidence: {(selectedRecord.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* Micro-Expressions Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Eye Widening</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedRecord.microExpressions.eyeWidening}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Jaw Tension</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedRecord.microExpressions.jawTension}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Eyebrow Furrow</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedRecord.microExpressions.eyebrowFurrow}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Lip Tension</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">{selectedRecord.microExpressions.lipCompression}</span>
              </div>
            </div>

            {/* Multi-Factor Risk Calculation Formula Breakdown */}
            <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Multi-Factor Risk Assessment Matrix
              </span>
              <div className="flex justify-between text-slate-700">
                <span>Facial Distress Indicator (Weight: 30%):</span>
                <span className="font-bold text-slate-900">Fear (Score: 28/30)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Proximity Vector Violation (Weight: 30%):</span>
                <span className="font-bold text-red-700">0.8m Gap (Score: 28/30)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Trajectory Persistence (Weight: 20%):</span>
                <span className="font-bold text-slate-900">18 mins (Score: 18/20)</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Corridor Lighting / Density (Weight: 20%):</span>
                <span className="font-bold text-slate-900">Isolated (Score: 18/20)</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-xs">
                <span className="text-slate-900">Combined Risk Classification:</span>
                <span className="text-red-700 font-mono font-black">92 / 100 — CRITICAL</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex space-x-2">
            <button
              onClick={() => alert(`Confirmed verification for ${selectedRecord.id}`)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
            >
              Verify & Log Case
            </button>
            <button
              onClick={() => alert(`Dismissed indicator for ${selectedRecord.id}`)}
              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs cursor-pointer border border-slate-300"
            >
              Dismiss Flag
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

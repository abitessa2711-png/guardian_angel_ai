import React, { useState } from 'react';
import { 
  UserCheck, 
  Smile, 
  Frown, 
  AlertCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Radio, 
  ArrowRight,
  Activity
} from 'lucide-react';

export const FACIAL_EXPRESSION_RECORDS = [
  {
    id: 'EXP-801',
    personId: 'SUBJ-4412 (Female Commuter)',
    expression: 'Fear / High Agitation',
    confidence: 0.92,
    distressStatus: 'Potential Distress Indicator',
    timestamp: '11:22:05 AM',
    camera: 'Camera 02 - Transit Terminal',
    snapshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '88%', jawTension: '91%', eyebrowFurrow: '84%' },
    verification: 'Pending Officer Review'
  },
  {
    id: 'EXP-802',
    personId: 'SUBJ-4419 (Pedestrian Student)',
    expression: 'Startled / Sudden Alarm',
    confidence: 0.89,
    distressStatus: 'Potential Unsafe Situation',
    timestamp: '11:18:42 AM',
    camera: 'Camera 05 - Subway Corridor',
    snapshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '78%', jawTension: '65%', eyebrowFurrow: '72%' },
    verification: 'Verified as Stray Animal Scare'
  },
  {
    id: 'EXP-803',
    personId: 'SUBJ-4425 (Market Commuter)',
    expression: 'Neutral / Calm',
    confidence: 0.96,
    distressStatus: 'Standard Baseline',
    timestamp: '11:15:10 AM',
    camera: 'Camera 01 - Chatram Bus Stand',
    snapshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    microExpressions: { eyeWidening: '12%', jawTension: '10%', eyebrowFurrow: '15%' },
    verification: 'Normal Activity'
  }
];

export const BEHAVIOR_EVENTS = [
  {
    id: 'BHV-501',
    type: 'Suspicious Interaction & Following',
    riskLevel: 'High',
    timestamp: '11:23:45 AM',
    camera: 'Camera 09 - Gandhi Market',
    confidence: 0.94,
    proximity: '0.8m distance maintained',
    duration: '18 mins continuous trailing',
    status: 'Requires Verification',
    subjects: 'Person ID_01 (Target) & Person ID_02 (Suspect)'
  },
  {
    id: 'BHV-502',
    type: 'Aggressive Movement & Physical Struggle',
    riskLevel: 'Critical',
    timestamp: '11:21:47 AM',
    camera: 'Camera 07 - Srirangam Temple Road',
    confidence: 0.96,
    proximity: '0.3m physical contact',
    duration: 'Rapid struggle vectors detected',
    status: 'Dispatched',
    subjects: 'Person ID_08 & Person ID_09'
  },
  {
    id: 'BHV-503',
    type: 'Chasing Behavior',
    riskLevel: 'High',
    timestamp: '11:19:12 AM',
    camera: 'Camera 03 - Railway Junction',
    confidence: 0.91,
    proximity: 'Accelerating closing vector (2.1m -> 0.6m)',
    duration: '35 seconds sprint',
    status: 'Resolved by Station Security',
    subjects: 'Person ID_14'
  },
  {
    id: 'BHV-504',
    type: 'Repeated Close Interaction & Blocking',
    riskLevel: 'Medium',
    timestamp: '11:12:08 AM',
    camera: 'Camera 05 - Subway Walkway',
    confidence: 0.86,
    proximity: '1.1m path obstruction',
    duration: '4 minutes',
    status: 'Verified Clear',
    subjects: 'Person ID_21 & Person ID_22'
  }
];

export default function PeopleTrackingView({ onSelectAlert }) {
  const [selectedExpression, setSelectedExpression] = useState(FACIAL_EXPRESSION_RECORDS[0]);
  const [selectedBehavior, setSelectedBehavior] = useState(BEHAVIOR_EVENTS[0]);

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">People Tracking & Behavioral Risk Analysis</h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated spatial-temporal trajectory tracking and potential distress detection.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-md flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">AI Pose & Expression Engine: Active (156 Tracked Today)</span>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer Box */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-lg flex items-start space-x-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold uppercase tracking-wider text-amber-950">Ethical AI & Compliance Standard Disclaimer</p>
          <p className="mt-0.5 leading-relaxed text-amber-900">
            <strong>Emotion detection is an indicator and does not independently confirm abuse or threat.</strong> All computer vision indicators represent behavioral anomalies that require manual validation by authorized duty officers before operational dispatch.
          </p>
        </div>
      </div>

      {/* Section 1: Facial Expression Analysis Panel */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
            <Smile className="w-4 h-4 text-blue-600" />
            <span>Facial Expression & Potential Distress Indicator Module</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Confidence Threshold: &gt; 0.85</span>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Expression Records List (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Detected Person Records</p>
            <div className="space-y-2">
              {FACIAL_EXPRESSION_RECORDS.map(item => {
                const isSelected = selectedExpression.id === item.id;
                const isFear = item.expression.includes('Fear') || item.distressStatus.includes('Distress');

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedExpression(item)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600' 
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={item.snapshot} 
                        alt="Face Snapshot" 
                        className="w-11 h-11 rounded-md object-cover border border-slate-300"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900">{item.personId}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-0.5">{item.expression}</p>
                        <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                          isFear ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.distressStatus}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-800 block">{(item.confidence * 100).toFixed(0)}%</span>
                      <span className="text-[10px] text-slate-400">Confidence</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Focused Facial Telemetry Deep-Dive (6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h5 className="font-bold text-xs text-slate-900 uppercase">Analysis Case File: {selectedExpression.id}</h5>
                  <p className="text-[11px] text-slate-500">{selectedExpression.camera}</p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Score: {selectedExpression.confidence}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white p-2.5 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Eye Widening</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">{selectedExpression.microExpressions.eyeWidening}</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Jaw Tension</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">{selectedExpression.microExpressions.jawTension}</span>
                </div>
                <div className="bg-white p-2.5 rounded border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Eyebrow Furrow</span>
                  <span className="text-sm font-bold text-slate-800 font-mono mt-0.5 block">{selectedExpression.microExpressions.eyebrowFurrow}</span>
                </div>
              </div>

              <div className="mt-3 p-3 bg-white rounded border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Classified Emotion:</span>
                  <span className="font-bold text-slate-900">{selectedExpression.expression}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status Flag:</span>
                  <span className="font-bold text-orange-700">{selectedExpression.distressStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Duty Verification:</span>
                  <span className="font-bold text-slate-700">{selectedExpression.verification}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer">
                Confirm Verification
              </button>
              <button className="py-1.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer">
                Dismiss Flag
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Behavior Analysis Table & Spatial-Temporal Tracking */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-purple-600" />
            <span>Behavior Analysis & Interaction Tracking</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Tracking Proximity & Velocity Vectors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Behavioral Event</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Camera Node</th>
                <th className="py-2.5 px-4">Proximity & Duration</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {BEHAVIOR_EVENTS.map(event => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{event.type}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{event.subjects}</p>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase inline-block ${
                      event.riskLevel === 'Critical' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : event.riskLevel === 'High'
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {event.riskLevel}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{event.camera}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{event.proximity}</span>
                    <span className="text-[11px] text-slate-500">{event.duration}</span>
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {(event.confidence * 100).toFixed(0)}%
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {event.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => onSelectAlert && onSelectAlert({ id: event.id, event: event.type, camera: event.camera, risk: event.riskLevel, time: event.timestamp, description: event.proximity })}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-semibold cursor-pointer"
                    >
                      Inspect
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

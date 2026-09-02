import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Video, 
  Volume2, 
  Bell, 
  Database, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

export default function SettingsView() {
  const [proximityThreshold, setProximityThreshold] = useState(1.5); // meters
  const [screamDbThreshold, setScreamDbThreshold] = useState(78); // dB
  const [facialDistressConfidence, setFacialDistressConfidence] = useState(85); // %
  const [animalCollisionDistance, setAnimalCollisionDistance] = useState(3.0); // meters
  const [dataRetentionDays, setDataRetentionDays] = useState('90');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [audioSirenEnabled, setAudioSirenEnabled] = useState(true);
  const [radioGatewayEnabled, setRadioGatewayEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 select-none max-w-5xl mx-auto">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Control Room System & AI Threshold Settings</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Configure computer vision sensitivity, acoustic sensors, and emergency broadcast gateways.</p>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-3 py-1.5 rounded-md flex items-center space-x-1.5 font-bold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Applied to Edge Nodes</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Section 1: AI Model Detection Sensitivity Thresholds */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>AI Detection Sensitivity Parameters</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">Real-Time Inference Engine v3.2</span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            
            {/* Proximity Distance Threshold */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Suspicious Proximity Distance Threshold</label>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{proximityThreshold} meters</span>
              </div>
              <p className="text-[11px] text-slate-500">Triggers an alert when a trailing subject maintains closer than this distance.</p>
              <input 
                type="range" 
                min="0.5" 
                max="4.0" 
                step="0.1"
                value={proximityThreshold}
                onChange={(e) => setProximityThreshold(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.5m (Strict)</span>
                <span>4.0m (Broad)</span>
              </div>
            </div>

            {/* Acoustic Scream Sensor dB Threshold */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Acoustic Distress Scream Level</label>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{screamDbThreshold} dB</span>
              </div>
              <p className="text-[11px] text-slate-500">Microphone dB spike cut-off to flag distress screams vs ambient traffic noise.</p>
              <input 
                type="range" 
                min="60" 
                max="100" 
                step="1"
                value={screamDbThreshold}
                onChange={(e) => setScreamDbThreshold(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>60 dB (High Sensitivity)</span>
                <span>100 dB (Severe Shriek)</span>
              </div>
            </div>

            {/* Facial Emotion Distress Confidence Cutoff */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Emotion Distress Confidence Cutoff</label>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{facialDistressConfidence}%</span>
              </div>
              <p className="text-[11px] text-slate-500">Minimum AI confidence score required before flagging 'Potential Distress Indicator'.</p>
              <input 
                type="range" 
                min="70" 
                max="98" 
                step="1"
                value={facialDistressConfidence}
                onChange={(e) => setFacialDistressConfidence(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>70% (More Flags)</span>
                <span>98% (High Precision)</span>
              </div>
            </div>

            {/* Animal Road Collision Warning Distance */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-800">Animal Highway Collision Warning Gap</label>
                <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{animalCollisionDistance} meters</span>
              </div>
              <p className="text-[11px] text-slate-500">Distance from oncoming vehicle to trigger automated VMS highway warning.</p>
              <input 
                type="range" 
                min="1.0" 
                max="6.0" 
                step="0.2"
                value={animalCollisionDistance}
                onChange={(e) => setAnimalCollisionDistance(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1.0m (Immediate Hazard)</span>
                <span>6.0m (Early Warning)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Alert Notification Channels & Gateways */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Emergency Dispatch & Notification Gateways</span>
            </h4>
          </div>

          <div className="p-4 space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Automated SMS to Nearest PCR Patrol Van</span>
                <span className="text-[11px] text-slate-500">Transmits GPS coordinates and short incident summary to field officers via Police SMS Gateway.</span>
              </div>
              <input 
                type="checkbox" 
                checked={smsAlertsEnabled}
                onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">Control Room Audio Siren & Visual Chime</span>
                <span className="text-[11px] text-slate-500">Plays an audible alert chime inside the central monitoring room upon Critical threat detection.</span>
              </div>
              <input 
                type="checkbox" 
                checked={audioSirenEnabled}
                onChange={(e) => setAudioSirenEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 block">VHF Police Wireless Radio Network Gateway</span>
                <span className="text-[11px] text-slate-500">Automatically broadcasts high-priority alerts over the encrypted digital radio frequency.</span>
              </div>
              <input 
                type="checkbox" 
                checked={radioGatewayEnabled}
                onChange={(e) => setRadioGatewayEnabled(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Statutory Data Retention Policy */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Data Retention & DPDP Act Compliance</span>
            </h4>
          </div>

          <div className="p-4 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 block">Surveillance Footage Retention Period</span>
                <span className="text-[11px] text-slate-500">Video footage is automatically purged unless tagged as verified judicial evidence.</span>
              </div>
              <select
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none"
              >
                <option value="30">30 Days (Standard Municipal)</option>
                <option value="60">60 Days (Extended)</option>
                <option value="90">90 Days (Statutory Police Record)</option>
                <option value="180">180 Days (High Security Zone)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end space-x-3 pt-2">
          <button 
            type="button" 
            onClick={() => {
              setProximityThreshold(1.5);
              setScreamDbThreshold(78);
              setFacialDistressConfidence(85);
              setAnimalCollisionDistance(3.0);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button 
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-xs transition-colors cursor-pointer flex items-center space-x-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
}

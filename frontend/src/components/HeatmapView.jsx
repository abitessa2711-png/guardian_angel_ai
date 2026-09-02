import React, { useState } from 'react';
import { 
  Map, 
  Compass, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ShieldAlert, 
  Truck, 
  Info,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Flame,
  Thermometer,
  Wind,
  Users,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function HeatmapView({ alerts = [], cameras = [], isDemoActive = false, demoStep = 0, inline = false }) {
  const { t, language } = useLanguage();
  const [selectedZone, setSelectedZone] = useState(null);
  const [mapMode, setMapMode] = useState('blueprint'); // 'blueprint' or 'gis'
  const [showSensors, setShowSensors] = useState(true);
  const [showWorkers, setShowWorkers] = useState(true);

  // Fireworks MSME Factory Zones
  const factoryZones = [
    { id: 1, name: 'Raw Material Store', short: 'RAW CHEMICALS', cam: 'CAM-01', x: 18, y: 22, width: 22, height: 16, risk: 'Normal', temp: 30.5, gas: 95, workers: 2, desc: 'Potassium Chlorate & Nitrate Storage Vault' },
    { id: 2, name: 'Chemical Mixing Shed 1', short: 'MIXING SHED 1', cam: 'CAM-02', x: 44, y: 18, width: 20, height: 16, risk: 'Normal', temp: 32.0, gas: 140, workers: 2, desc: 'High Hazard Chemical Compounding (External Camera Obs)' },
    { id: 3, name: 'Chemical Mixing Shed 2', short: 'MIXING SHED 2', cam: 'CAM-03', x: 68, y: 18, width: 20, height: 16, risk: 'Normal', temp: 31.8, gas: 130, workers: 1, desc: 'Secondary Powder Formulation Room' },
    { id: 4, name: 'Pulverizer & Grinding Shed', short: 'GRINDING SHED', cam: 'CAM-04', x: 18, y: 44, width: 22, height: 18, risk: isDemoActive && demoStep >= 5 ? 'Critical' : isDemoActive && demoStep >= 2 ? 'Warning' : 'Normal', temp: isDemoActive && demoStep >= 5 ? 44.5 : isDemoActive && demoStep >= 2 ? 38.0 : 33.2, gas: isDemoActive && demoStep >= 5 ? 620 : 180, workers: isDemoActive && demoStep >= 5 ? 0 : 4, desc: 'Aluminium Powder & Charcoal Grinding (Thermal Monitored)' },
    { id: 5, name: 'Open Sun Drying Yard North', short: 'DRYING YARD (N)', cam: 'CAM-05', x: 44, y: 40, width: 44, height: 22, risk: 'Normal', temp: 34.0, gas: 45, workers: 5, desc: 'Open Ground Solar Radiation & Thermal Dissipation' },
    { id: 6, name: 'Filling & Assembly Hall', short: 'ASSEMBLY LINE', cam: 'CAM-10', x: 18, y: 68, width: 34, height: 18, risk: 'Normal', temp: 31.0, gas: 110, workers: 8, desc: 'Fuse Insertion, Pellet Filling & Packaging' },
    { id: 7, name: 'Secondary Boxing & Packaging', short: 'PACKAGING', cam: 'CAM-11', x: 56, y: 68, width: 32, height: 18, risk: 'Normal', temp: 30.2, gas: 80, workers: 11, desc: 'Cardboard Box Packaging & Labeling' },
    { id: 8, name: 'Explosive Magazine Vault', short: 'MAGAZINE BUNKER', cam: 'CAM-12', x: 74, y: 44, width: 18, height: 18, risk: 'Normal', temp: 28.5, gas: 35, workers: 0, desc: 'Final Finished Explosive Vault (Reinforced Mound Structure)' }
  ];

  const getZoneFill = (risk) => {
    if (risk === 'Critical') return 'rgba(239, 68, 68, 0.35)';
    if (risk === 'Warning') return 'rgba(245, 158, 11, 0.25)';
    return 'rgba(14, 165, 233, 0.12)';
  };

  const getZoneStroke = (risk) => {
    if (risk === 'Critical') return '#ef4444';
    if (risk === 'Warning') return '#f59e0b';
    return '#0ea5e9';
  };

  return (
    <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd font-mono select-none space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-surveillance-border/60 pb-3 gap-2">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <Map className="h-5 w-5 text-sky-400" />
            <span>{t('factory_map')} & Hazard Heatmap Blueprint</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            Fireworks MSME Safe Observation Camera Locations & Real-Time Thermal Gradient Overlay
          </p>
        </div>

        <div className="flex items-center space-x-2 text-2xs">
          <button
            onClick={() => setShowSensors(prev => !prev)}
            className={`px-2.5 py-1 rounded border cursor-pointer transition-all ${
              showSensors ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {showSensors ? '✓ IoT Sensors Visible' : 'IoT Sensors Hidden'}
          </button>
          <button
            onClick={() => setShowWorkers(prev => !prev)}
            className={`px-2.5 py-1 rounded border cursor-pointer transition-all ${
              showWorkers ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-slate-900 border-slate-700 text-slate-500'
            }`}
          >
            {showWorkers ? '✓ Worker Density Visible' : 'Workers Hidden'}
          </button>
        </div>
      </div>

      {/* Main Map Canvas and Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* SVG Blueprint Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-[#04070e] rounded-xl border border-slate-800 p-3 relative overflow-hidden flex flex-col justify-between shadow-inner min-h-[420px]">
          
          {/* Blueprint Compass & Scale Meta */}
          <div className="flex justify-between items-center text-[9px] text-slate-500 z-10">
            <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
              <Compass className="h-3.5 w-3.5" />
              <span>FACILITY LAYOUT (EXPLOSIVES REGULATORY GRID)</span>
            </div>
            <span>SCALE: 1:500 MESH</span>
          </div>

          {/* SVG Map Layout */}
          <svg className="w-full h-80 my-2" viewBox="0 0 100 95" preserveAspectRatio="none">
            <defs>
              <pattern id="gridPattern" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#1e2d4a" strokeWidth="0.2" opacity="0.6"/>
              </pattern>
            </defs>

            {/* Background Grid */}
            <rect width="100" height="95" fill="url(#gridPattern)" />

            {/* Perimeter Boundary & Safe Buffer Line */}
            <rect x="5" y="5" width="90" height="85" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2, 2" />
            <text x="7" y="9" fill="#64748b" fontSize="2.0" fontFamily="monospace">SAFE EVACUATION BUFFER BOUNDARY</text>

            {/* Evacuation Route Path */}
            <path d="M 10 90 L 10 10 L 90 10" fill="none" stroke="#10b981" strokeWidth="0.4" strokeDasharray="1, 1" opacity="0.7" />

            {/* Render Factory Processing Zones */}
            {factoryZones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              return (
                <g 
                  key={zone.id} 
                  onClick={() => setSelectedZone(zone)}
                  className="cursor-pointer group"
                >
                  {/* Zone Block */}
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    rx="1.5"
                    fill={getZoneFill(zone.risk)}
                    stroke={isSelected ? '#ffffff' : getZoneStroke(zone.risk)}
                    strokeWidth={isSelected ? '0.8' : '0.4'}
                    className="transition-all hover:opacity-80"
                  />

                  {/* Zone Label */}
                  <text
                    x={zone.x + 1.5}
                    y={zone.y + 4.5}
                    fill="#ffffff"
                    fontSize="2.2"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {zone.short}
                  </text>

                  {/* Camera Marker (External Safe Post) */}
                  <circle
                    cx={zone.x + zone.width - 2.5}
                    cy={zone.y + 2.5}
                    r="1.4"
                    fill="#0ea5e9"
                    stroke="#ffffff"
                    strokeWidth="0.3"
                  />
                  <text
                    x={zone.x + zone.width - 2.5}
                    y={zone.y + 3.0}
                    fill="#000000"
                    fontSize="1.2"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    C
                  </text>

                  {/* Telemetry Overlays inside block */}
                  {showSensors && (
                    <text
                      x={zone.x + 1.5}
                      y={zone.y + 9}
                      fill={zone.temp >= 40 ? '#ef4444' : zone.temp >= 35 ? '#f59e0b' : '#38bdf8'}
                      fontSize="1.9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {zone.temp}°C | {zone.gas}PPM
                    </text>
                  )}

                  {showWorkers && (
                    <text
                      x={zone.x + 1.5}
                      y={zone.y + 13}
                      fill="#10b981"
                      fontSize="1.8"
                      fontFamily="monospace"
                    >
                      👥 {zone.workers} WORKERS
                    </text>
                  )}
                </g>
              );
            })}

            {/* External Supervisor Control Room Marker */}
            <rect x="70" y="80" width="22" height="10" rx="1" fill="#0f172a" stroke="#10b981" strokeWidth="0.6" />
            <text x="72" y="86" fill="#10b981" fontSize="2.2" fontWeight="bold" fontFamily="monospace">
              EXTERNAL CONTROL POST
            </text>
          </svg>

          {/* Blueprint Legend */}
          <div className="flex flex-wrap items-center justify-between text-[8px] text-slate-400 border-t border-slate-800 pt-2 gap-2">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-sky-500/30 border border-sky-500"></span>
                <span>Normal Range</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500"></span>
                <span>Thermal Warning</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500/50 border border-red-500 animate-pulse"></span>
                <span>Critical Hazard Area</span>
              </span>
            </div>
            <span className="text-slate-500">Click any zone to inspect camera telemetry</span>
          </div>

        </div>

        {/* Selected Zone Deep Dive Drawer (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-2xs font-bold text-sky-400">ZONE INSPECTOR</span>
              {selectedZone && (
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                  selectedZone.risk === 'Critical' ? 'bg-red-500/15 text-red-400 border-red-500/40' :
                  selectedZone.risk === 'Warning' ? 'bg-amber-500/15 text-amber-400 border-amber-500/40' :
                  'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                }`}>
                  {selectedZone.risk.toUpperCase()}
                </span>
              )}
            </div>

            {selectedZone ? (
              <div className="space-y-3 mt-3">
                <div>
                  <h3 className="text-sm font-black text-white">{selectedZone.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedZone.desc}</p>
                </div>

                {/* Camera Link */}
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-2xs">
                  <span className="text-slate-400">Assigned Camera:</span>
                  <span className="font-bold text-sky-400">{selectedZone.cam} (External Obs)</span>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Ambient Temp:</span>
                    <span className={`font-black text-sm ${selectedZone.temp >= 40 ? 'text-red-400' : 'text-slate-200'}`}>
                      {selectedZone.temp}°C
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Volatile Gas:</span>
                    <span className={`font-black text-sm ${selectedZone.gas >= 500 ? 'text-red-400' : 'text-slate-200'}`}>
                      {selectedZone.gas} PPM
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Workers Active:</span>
                    <span className="font-black text-sm text-white">
                      {selectedZone.workers} Persons
                    </span>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-500 block">Exhaust Relay:</span>
                    <span className="font-black text-sm text-emerald-400">
                      ARMED
                    </span>
                  </div>
                </div>

                {/* Recommended Guidance */}
                <div className="p-2.5 bg-sky-950/40 border border-sky-500/20 rounded text-[10px] text-slate-300">
                  <span className="font-bold text-sky-400 block mb-0.5">Observation Protocol:</span>
                  Maintain safe separation from compounding areas. Continuous thermal scan active.
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-2xs">
                <MapPin className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                <p>Click any processing zone on the blueprint to view real-time telemetry and camera feeds.</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-2 text-[9px] text-slate-500">
            Node Sync: Synchronized with 16 external telemetry channels.
          </div>
        </div>

      </div>

    </div>
  );
}

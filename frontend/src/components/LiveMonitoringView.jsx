import React, { useState } from 'react';
import { 
  Grid, 
  LayoutGrid, 
  Maximize2, 
  Minimize2, 
  Camera, 
  Volume2, 
  VolumeX, 
  Circle, 
  Sliders, 
  Filter, 
  Search,
  Radio,
  ChevronRight,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const ALL_CAMERAS = [
  { id: 'CAM-01', name: 'Chatram Bus Stand Gate', location: 'Chatram Central Bazaar', status: 'Online', ip: '192.168.1.101', type: 'crowd', ptz: true, alerts: 2, fps: 30 },
  { id: 'CAM-02', name: 'Central Bus Terminal', location: 'Platform 1 Main Arch', status: 'Online', ip: '192.168.1.102', type: 'crowd', ptz: true, alerts: 1, fps: 30 },
  { id: 'CAM-03', name: 'Railway Junction Gate', location: 'Junction Station Entrance', status: 'Online', ip: '192.168.1.103', type: 'road', ptz: true, alerts: 3, fps: 28 },
  { id: 'CAM-04', name: 'Main Road Intersection', location: 'Trichy Highway & Bazaar Cross', status: 'Online', ip: '192.168.1.104', type: 'road', ptz: false, alerts: 4, fps: 30 },
  { id: 'CAM-05', name: 'Lalgudi Subway Walkway', location: 'Underground Pedestrian Subway', status: 'Online', ip: '192.168.1.105', type: 'subway', ptz: false, alerts: 0, fps: 25 },
  { id: 'CAM-06', name: 'NIT Highway Outer Ring', location: 'NIT Trichy Highway Gate', status: 'Online', ip: '192.168.1.106', type: 'road', ptz: true, alerts: 0, fps: 30 },
  { id: 'CAM-07', name: 'Srirangam Temple Road', location: 'Rajagopuram South Gate', status: 'Online', ip: '192.168.1.107', type: 'crowd', ptz: true, alerts: 1, fps: 30 },
  { id: 'CAM-08', name: 'Thillai Nagar High Cross', location: 'Commercial Main Road', status: 'Online', ip: '192.168.1.108', type: 'road', ptz: false, alerts: 0, fps: 30 },
  { id: 'CAM-09', name: 'Gandhi Market Wholesale', location: 'Vegetable Market North Lane', status: 'Online', ip: '192.168.1.109', type: 'crowd', ptz: true, alerts: 1, fps: 28 },
  { id: 'CAM-10', name: 'KK Nagar Circle Road', location: 'Traffic Roundabout', status: 'Online', ip: '192.168.1.110', type: 'road', ptz: true, alerts: 0, fps: 30 },
  { id: 'CAM-11', name: 'Palakkarai Rail Subway', location: 'Palakkarai Cross Road', status: 'Online', ip: '192.168.1.111', type: 'subway', ptz: false, alerts: 0, fps: 25 },
  { id: 'CAM-12', name: 'Main Guard Gate Arch', location: 'Heritage Shopping Corridor', status: 'Offline', ip: '192.168.1.112', type: 'crowd', ptz: false, alerts: 0, fps: 0 },
];

export default function LiveMonitoringView({ onCaptureSnapshot }) {
  const [gridLayout, setGridLayout] = useState('2x2'); // '1x1', '2x2', '3x3', '4x4'
  const [selectedCam, setSelectedCam] = useState(ALL_CAMERAS[3]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ptzSpeed, setPtzSpeed] = useState('Normal');

  const filteredCameras = ALL_CAMERAS.filter(cam => {
    const matchesSearch = cam.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cam.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cam.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || cam.type === filterType;
    return matchesSearch && matchesType;
  });

  const getGridColsClass = () => {
    if (gridLayout === '1x1') return 'grid-cols-1';
    if (gridLayout === '2x2') return 'grid-cols-1 md:grid-cols-2';
    if (gridLayout === '3x3') return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const getCameraVideo = (type) => {
    if (type === 'crowd') return '/videos/crowd.mp4';
    if (type === 'subway') return '/videos/isolated.mp4';
    return '/videos/traffic.mp4';
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Filter & Grid Controller Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Search & Filter Chips */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search camera name, location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            {['all', 'road', 'crowd', 'subway'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  filterType === t ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'all' ? 'All Feeds' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Grid Layout Matrix Selector */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <span className="text-xs text-slate-500 font-medium">Layout:</span>
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
            {[
              { id: '1x1', label: 'Single' },
              { id: '2x2', label: '2 × 2' },
              { id: '3x3', label: '3 × 3' },
              { id: '4x4', label: '4 × 4 Wall' },
            ].map(layout => (
              <button
                key={layout.id}
                onClick={() => setGridLayout(layout.id)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                  gridLayout === layout.id ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {layout.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Multi-Camera Video Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Matrix Video Feeds (8 or 9 cols) */}
        <div className="lg:col-span-9">
          <div className={`grid ${getGridColsClass()} gap-3`}>
            {filteredCameras.map((camera) => {
              const isSelected = selectedCam.id === camera.id;
              const isOffline = camera.status === 'Offline';

              return (
                <div 
                  key={camera.id}
                  onClick={() => setSelectedCam(camera)}
                  className={`bg-slate-950 rounded-lg border overflow-hidden transition-all relative flex flex-col cursor-pointer ${
                    isSelected ? 'ring-2 ring-blue-600 border-blue-600' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {/* Camera Header Overlay */}
                  <div className="bg-slate-900/90 text-white px-2.5 py-1.5 flex items-center justify-between border-b border-slate-800 text-[11px]">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-400 animate-pulse'}`}></span>
                      <span className="font-bold truncate">{camera.name}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0 font-mono text-[10px] text-slate-300">
                      <span>{camera.id}</span>
                      {camera.alerts > 0 && (
                        <span className="bg-red-600 text-white font-bold px-1.5 rounded-full text-[9px]">
                          {camera.alerts}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Video Area */}
                  <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
                    {!isOffline ? (
                      <>
                        <img 
                          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop" 
                          alt="Street feed"
                          className="w-full h-full object-cover brightness-90 contrast-105"
                        />
                        <video 
                          src={getCameraVideo(camera.type)}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
                        />
                        
                        {/* Live Badge */}
                        <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          LIVE
                        </div>

                        {/* Minimal bounding boxes */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <rect x="25" y="45" width="7" height="15" fill="none" stroke="#22c55e" strokeWidth="0.6" rx="0.5" />
                          <rect x="52" y="48" width="14" height="14" fill="none" stroke="#eab308" strokeWidth="0.6" strokeDasharray="2, 1" rx="0.5" />
                          <rect x="42" y="42" width="10" height="9" fill="none" stroke="#3b82f6" strokeWidth="0.6" rx="0.5" />
                        </svg>
                      </>
                    ) : (
                      <div className="text-center p-4 text-slate-500">
                        <Radio className="w-8 h-8 mx-auto mb-1 text-red-500/60" />
                        <p className="font-bold text-xs text-red-400">SIGNAL LOST</p>
                        <p className="text-[10px]">Camera node offline</p>
                      </div>
                    )}
                  </div>

                  {/* Camera Footer Meta */}
                  <div className="bg-slate-900 px-2.5 py-1 text-[10px] text-slate-400 flex items-center justify-between font-mono">
                    <span className="truncate">{camera.location}</span>
                    <span>{camera.fps} FPS</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Focused Camera PTZ Controller & Telemetry (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          
          {/* Focused Camera Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">
              Selected Camera Details
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Camera Identifier</span>
                <span className="font-bold text-slate-900">{selectedCam.name} ({selectedCam.id})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Physical Location</span>
                <span className="text-slate-700">{selectedCam.location}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">IP Address</span>
                  <span className="font-mono text-slate-700">{selectedCam.ip}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Network Status</span>
                  <span className={`font-bold ${selectedCam.status === 'Online' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {selectedCam.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex space-x-2">
              <button 
                onClick={() => onCaptureSnapshot && onCaptureSnapshot(selectedCam)}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold py-1.5 rounded flex items-center justify-center space-x-1 transition-colors cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Snapshot</span>
              </button>
            </div>
          </div>

          {/* PTZ Hardware Controller */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                PTZ Pan-Tilt Controls
              </h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                selectedCam.ptz ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {selectedCam.ptz ? 'PTZ Enabled' : 'Fixed Lens'}
              </span>
            </div>

            {selectedCam.ptz ? (
              <div className="flex flex-col items-center space-y-3">
                {/* 4-Way Directional Pad */}
                <div className="grid grid-cols-3 gap-1 w-32 h-32 p-1 bg-slate-100 rounded-full border border-slate-300">
                  <div></div>
                  <button className="flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 rounded-t-full shadow-xs active:bg-blue-600 active:text-white transition-colors cursor-pointer" title="Tilt Up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div></div>
                  
                  <button className="flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 rounded-l-full shadow-xs active:bg-blue-600 active:text-white transition-colors cursor-pointer" title="Pan Left">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-200 rounded-full">
                    PTZ
                  </div>
                  <button className="flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 rounded-r-full shadow-xs active:bg-blue-600 active:text-white transition-colors cursor-pointer" title="Pan Right">
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div></div>
                  <button className="flex items-center justify-center bg-white hover:bg-slate-200 text-slate-700 rounded-b-full shadow-xs active:bg-blue-600 active:text-white transition-colors cursor-pointer" title="Tilt Down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div></div>
                </div>

                {/* Zoom Controls */}
                <div className="flex space-x-2 w-full">
                  <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom In</span>
                  </button>
                  <button className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer">
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>Zoom Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                <p>This camera unit is configured with fixed focal optics.</p>
                <p className="text-[11px] mt-1">Digital zoom available in stream view.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

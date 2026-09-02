import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Video, X, Check, AlertCircle, RefreshCw, Radio, Settings, ShieldAlert, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CameraCRUD({ cameras, onRefresh }) {
  const { getAuthHeaders, apiBase } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  
  // Local state to simulate AI enabled cameras and connection tests
  const [aiEnabledCamIds, setAiEnabledCamIds] = useState(new Set([1, 2, 3, 4, 5]));
  const [testingCamId, setTestingCamId] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [onvifScanning, setOnvifScanning] = useState(false);
  const [discoveredCams, setDiscoveredCams] = useState([]);

  const [form, setForm] = useState({
    name: '',
    location: '',
    rtsp_url: '',
    status: 'Active',
    latitude: 10.7905,
    longitude: 78.6821
  });
  const [error, setError] = useState(null);

  const openAddModal = () => {
    setEditingCamera(null);
    setForm({
      name: '',
      location: '',
      rtsp_url: 'rtsp://192.168.1.',
      status: 'Active',
      latitude: 10.7905,
      longitude: 78.6821
    });
    setError(null);
    setIsOpen(true);
  };

  const openEditModal = (camera) => {
    setEditingCamera(camera);
    setForm({
      name: camera.name,
      location: camera.location,
      rtsp_url: camera.rtsp_url,
      status: camera.status,
      latitude: camera.latitude,
      longitude: camera.longitude
    });
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validations
    if (!form.name || !form.location || !form.rtsp_url) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const url = editingCamera 
        ? `${apiBase}/cameras/${editingCamera.id}` 
        : `${apiBase}/cameras/`;
      
      const method = editingCamera ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude)
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to save camera feed config.');
      }

      setIsOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (cameraId) => {
    if (!window.confirm("Are you sure you want to decommission and delete this camera feed?")) return;
    setError(null);

    try {
      const response = await fetch(`${apiBase}/cameras/${cameraId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to delete camera.');
      }

      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  // Simulate Connection Test
  const handleTestConnection = (camId) => {
    setTestingCamId(camId);
    setTestResult(null);
    setTimeout(() => {
      setTestingCamId(null);
      setTestResult({
        cameraId: camId,
        success: true,
        message: 'RTSP Handshake Successful - 1080p stream locked (H.264, 30fps, 12ms latency)'
      });
      // Clear message after 4s
      setTimeout(() => {
        setTestResult(null);
      }, 4000);
    }, 1500);
  };

  // Toggle AI Analysis locally
  const toggleAiEnabled = (camId) => {
    setAiEnabledCamIds(prev => {
      const next = new Set(prev);
      if (next.has(camId)) {
        next.delete(camId);
      } else {
        next.add(camId);
      }
      return next;
    });
  };

  // Simulate ONVIF Camera Discovery scan
  const startOnvifScan = () => {
    setOnvifScanning(true);
    setDiscoveredCams([]);
    setTimeout(() => {
      setOnvifScanning(false);
      setDiscoveredCams([
        {
          name: 'ONVIF-DISCOVERED-07 TVS_TOLGATE',
          location: 'TVS Tolgate Main Crossing',
          rtsp_url: 'rtsp://192.168.1.107/onvif',
          latitude: 10.7812,
          longitude: 78.6943,
          device: 'Dahua IPC-HFW2431S-S-S2'
        },
        {
          name: 'ONVIF-DISCOVERED-08 MANNARPURAM_JUNCTION',
          location: 'Mannarpuram Junction Flyover Entrance',
          rtsp_url: 'rtsp://192.168.1.108/onvif',
          latitude: 10.7785,
          longitude: 78.6898,
          device: 'Hikvision DS-2CD2043G2-I'
        }
      ]);
    }, 2000);
  };

  // Add Discovered ONVIF Camera into DB
  const handleIntegrateDiscovered = async (discovered) => {
    setError(null);
    try {
      const response = await fetch(`${apiBase}/cameras/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: discovered.name.replace('ONVIF-DISCOVERED-', 'CCTV-'),
          location: discovered.location,
          rtsp_url: discovered.rtsp_url,
          status: 'Active',
          latitude: discovered.latitude,
          longitude: discovered.longitude
        })
      });

      if (!response.ok) {
        throw new Error('Failed to integrate discovered camera.');
      }

      // Remove from discovered list
      setDiscoveredCams(prev => prev.filter(c => c.name !== discovered.name));
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 font-mono select-none">
      
      {/* ONVIF Discovery Panel */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
        <div className="flex justify-between items-center border-b border-surveillance-border pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center space-x-1.5">
              <Cpu className="h-4 w-4 text-surveillance-accent" />
              <span>ONVIF CAMERA DISCOVERY PROTOCOL</span>
            </h4>
            <p className="text-4xs text-surveillance-textMuted mt-0.5">SCAN THE LOCAL TRICHY METROPOLITAN SEGMENT FOR ONVIF DEVICES</p>
          </div>
          
          <button
            onClick={startOnvifScan}
            disabled={onvifScanning}
            className={`px-3 py-1.5 rounded text-3xs font-bold flex items-center space-x-1 border cursor-pointer transition-all ${
              onvifScanning 
                ? 'bg-surveillance-accent/10 border-surveillance-accent/40 text-surveillance-accent cursor-not-allowed animate-pulse' 
                : 'bg-surveillance-panel hover:bg-surveillance-header border-surveillance-border text-white shadow-glow-cyan'
            }`}
          >
            {onvifScanning ? (
              <>
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>SCANNING PROTOCOLS ACTIVE...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3" />
                <span>RUN ONVIF DISCOVERY SCAN</span>
              </>
            )}
          </button>
        </div>

        {discoveredCams.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-[10px] text-surveillance-success font-bold uppercase tracking-wider">▲ DISCOVERED {discoveredCams.length} NEW ONLINE CAMERAS READY FOR GATEWAY INTEGRATION:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveredCams.map((cam, idx) => (
                <div key={idx} className="bg-surveillance-header border border-surveillance-success/30 rounded p-3.5 flex justify-between items-center text-3xs">
                  <div className="space-y-1">
                    <p className="text-white font-bold">{cam.name}</p>
                    <p className="text-surveillance-textMuted">{cam.location}</p>
                    <p className="text-slate-400 font-sans">{cam.rtsp_url} ({cam.device})</p>
                  </div>
                  <button
                    onClick={() => handleIntegrateDiscovered(cam)}
                    className="bg-surveillance-success text-white px-3 py-1.5 rounded font-bold hover:bg-emerald-600 cursor-pointer shadow-glow-cyan transition-colors"
                  >
                    INTEGRATE
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!onvifScanning && discoveredCams.length === 0 && (
          <p className="text-4xs text-surveillance-textMuted uppercase text-center py-2">NO NEW DISCOVERED DEVICES SCANNED ON LOCAL HOST SEGMENT. INITIATE SCAN TO DISCOVER NEW CAMERAS.</p>
        )}
      </div>

      {/* Main Camera Directory Table */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5">
        
        {/* Table Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase flex items-center space-x-2">
              <Video className="h-5 w-5 text-surveillance-accent" />
              <span>CCTV SURVEILLANCE FEED GATEWAY DIRECTORY</span>
            </h3>
            <p className="text-3xs text-surveillance-textMuted mt-1">
              EXISTING CAMERA INTEGRATION PATHS FOR TRICHY SURVEILLANCE CONTROL ROOM
            </p>
          </div>

          <button 
            onClick={openAddModal}
            className="flex items-center space-x-2 bg-surveillance-accent hover:bg-sky-600 text-white px-3 py-2 rounded text-xs cursor-pointer transition-all shadow-glow-cyan"
          >
            <Plus className="h-4 w-4" />
            <span>INTEGRATE EXISTING CAMERA (RTSP)</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-surveillance-danger/10 border border-surveillance-danger/30 rounded flex items-center space-x-2 text-surveillance-danger text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {testResult && (
          <div className="mb-4 p-3 bg-surveillance-success/15 border border-surveillance-success/40 rounded flex items-center space-x-2 text-surveillance-success text-2xs animate-pulse">
            <Check className="h-4 w-4 shrink-0" />
            <span className="font-bold">CONNECTION TEST SUCCESS: {testResult.message}</span>
          </div>
        )}

        {/* Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-2xs">
            <thead>
              <tr className="border-b border-surveillance-border text-surveillance-textMuted">
                <th className="py-3 px-4 font-semibold uppercase">ID</th>
                <th className="py-3 px-4 font-semibold uppercase">CAMERA NAME</th>
                <th className="py-3 px-4 font-semibold uppercase">LOCATION</th>
                <th className="py-3 px-4 font-semibold uppercase">RTSP STREAM PATH</th>
                <th className="py-3 px-4 font-semibold uppercase">STATUS</th>
                <th className="py-3 px-4 font-semibold uppercase">AI INSPECTION</th>
                <th className="py-3 px-4 font-semibold uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surveillance-border/50 text-white">
              {cameras.map((camera) => {
                const isAiEnabled = aiEnabledCamIds.has(camera.id);
                const isTesting = testingCamId === camera.id;
                return (
                  <tr key={camera.id} className="hover:bg-surveillance-header/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-surveillance-textMuted">#{camera.id}</td>
                    <td className="py-3.5 px-4 font-bold">{camera.name}</td>
                    <td className="py-3.5 px-4 text-surveillance-textMuted">{camera.location}</td>
                    <td className="py-3.5 px-4 text-slate-400 select-all font-sans text-3xs">{camera.rtsp_url}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-3xs font-bold font-mono ${
                        camera.status === 'Active' 
                          ? 'bg-surveillance-success/10 text-surveillance-success border border-surveillance-success/30' 
                          : 'bg-surveillance-danger/10 text-surveillance-danger border border-surveillance-danger/30 animate-pulse'
                      }`}>
                        {camera.status === 'Active' ? '🟢 ONLINE' : '🔴 OFFLINE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleAiEnabled(camera.id)}
                        className={`px-2.5 py-1 rounded text-3xs font-bold font-mono transition-all cursor-pointer border flex items-center space-x-1.5 ${
                          isAiEnabled
                            ? 'bg-surveillance-accent/15 border-surveillance-accent text-surveillance-accent shadow-glow-cyan'
                            : 'bg-surveillance-header border-surveillance-border text-surveillance-textMuted hover:text-white'
                        }`}
                      >
                        <Radio className={`h-3 w-3 ${isAiEnabled ? 'animate-pulse' : ''}`} />
                        <span>{isAiEnabled ? 'AI ENGINES ON' : 'AI ENGINES OFF'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2.5">
                      <button
                        onClick={() => handleTestConnection(camera.id)}
                        disabled={isTesting || camera.status === 'Offline'}
                        className={`px-2 py-1 text-3xs rounded cursor-pointer transition-all border inline-block ${
                          camera.status === 'Offline'
                            ? 'bg-gray-800 text-gray-600 border-gray-900 cursor-not-allowed'
                            : isTesting
                            ? 'bg-surveillance-accent/10 border-surveillance-accent/30 text-surveillance-accent animate-pulse cursor-wait'
                            : 'bg-surveillance-header hover:bg-surveillance-border border-surveillance-border text-white'
                        }`}
                      >
                        {isTesting ? 'TESTING...' : 'TEST STREAM'}
                      </button>
                      <button 
                        onClick={() => openEditModal(camera)}
                        className="p-1.5 hover:bg-surveillance-border text-surveillance-accent hover:text-white rounded cursor-pointer transition-all inline-block"
                        title="Edit Camera config"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(camera.id)}
                        className="p-1.5 hover:bg-surveillance-danger/20 text-surveillance-danger hover:text-white rounded cursor-pointer transition-all inline-block"
                        title="Delete camera config"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <form 
            onSubmit={handleSubmit}
            className="bg-surveillance-panel border border-surveillance-border rounded-lg max-w-md w-full flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="bg-surveillance-header border-b border-surveillance-border px-6 py-4 flex justify-between items-center">
              <h4 className="text-sm font-bold text-white uppercase">
                {editingCamera ? 'EDIT CAMERA CONFIG' : 'REGISTER EXISTING SURVEILLANCE CAMERA'}
              </h4>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-surveillance-textMuted hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-surveillance-textMuted">CAMERA NAME *</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  placeholder="e.g. CCTV-06 NIT_TRICHY"
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-surveillance-textMuted">SURVEILLANCE LOCATION *</label>
                <input 
                  type="text" 
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  placeholder="e.g. NIT Trichy Highway Entrance Gate"
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-surveillance-textMuted">RTSP STREAM PATH *</label>
                <input 
                  type="text" 
                  value={form.rtsp_url}
                  onChange={(e) => setForm({...form, rtsp_url: e.target.value})}
                  placeholder="rtsp://192.168.1.xxx/stream1"
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-surveillance-textMuted">LATITUDE</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={form.latitude}
                    onChange={(e) => setForm({...form, latitude: e.target.value})}
                    className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-surveillance-textMuted">LONGITUDE</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={form.longitude}
                    onChange={(e) => setForm({...form, longitude: e.target.value})}
                    className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-surveillance-textMuted">FEED SYSTEM STATUS</label>
                <select 
                  value={form.status}
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white focus:outline-none focus:border-surveillance-accent"
                >
                  <option value="Active">Active</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surveillance-header border-t border-surveillance-border px-6 py-4 flex justify-end space-x-3">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-surveillance-panel hover:bg-surveillance-border border border-surveillance-border text-white px-4 py-2 rounded cursor-pointer"
              >
                CANCEL
              </button>
              <button 
                type="submit"
                className="bg-surveillance-accent hover:bg-sky-600 text-white px-5 py-2 rounded cursor-pointer shadow-glow-cyan"
              >
                SAVE GATEWAY CONFIG
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

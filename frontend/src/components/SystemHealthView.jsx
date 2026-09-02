import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWebSocket } from '../context/WebSocketContext';
import { 
  Cpu, 
  Server, 
  Database, 
  Wifi, 
  CheckCircle, 
  AlertTriangle, 
  Video, 
  Radio, 
  ShieldCheck, 
  RefreshCw, 
  Activity,
  Terminal
} from 'lucide-react';

export default function SystemHealthView() {
  const { t, language } = useLanguage();
  const { connected } = useWebSocket();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [healthNodes, setHealthNodes] = useState([
    { id: 'NODE-ESP32', name: 'ESP32-S3 IoT Gateway Node', category: 'Hardware', status: 'ONLINE', latency: '14 ms', uptime: '99.98%', desc: 'Mesh gateway communicating with DHT22 & MQ-135 nodes' },
    { id: 'NODE-SENSORS', name: 'Environmental Sensor Array', category: 'Sensors', status: 'ONLINE', latency: '22 ms', uptime: '99.95%', desc: '16 thermal & volatile gas monitoring points' },
    { id: 'NODE-CCTV', name: '16 External CCTV Ingestion Pipeline', category: 'Video Stream', status: 'WARNING', latency: '35 ms', uptime: '93.75%', desc: '15 Active Streams / 1 Offline Node (CAM-16)' },
    { id: 'NODE-AI', name: 'AI Cognitive Vision & Risk Engine', category: 'AI Inference', status: 'ONLINE', latency: '42 ms', uptime: '99.99%', desc: 'YOLOv8 Pose Estimation, Worker Counting & Thermal Anomaly Logic' },
    { id: 'NODE-BACKEND', name: 'FastAPI Industrial Control Server', category: 'Backend', status: 'ONLINE', latency: '8 ms', uptime: '100.0%', desc: 'Uvicorn ASGI core running at port 8000' },
    { id: 'NODE-DB', name: 'SQLite Industrial Safety Audit Store', category: 'Database', status: 'ONLINE', latency: '4 ms', uptime: '100.0%', desc: 'SQLAlchemy ORM logging real-time incident registers' },
    { id: 'NODE-WS', name: 'WebSocket Real-Time Broadcast Hub', category: 'Networking', status: connected ? 'ONLINE' : 'OFFLINE', latency: '12 ms', uptime: connected ? '99.90%' : '0%', desc: 'Low-latency telemetry streaming to supervisor dashboards' },
    { id: 'NODE-NOTIFICATION', name: 'Automated Response & Mobile Relay', category: 'Dispatcher', status: 'ONLINE', latency: '85 ms', uptime: '99.80%', desc: 'Exhaust fan relay controller & Supervisor SMS dispatch' }
  ]);

  const runDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-sky-400" />
            <span>{t('system_health')} & Hardware Diagnostic Matrix</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            Real-time latency, uptime, and telemetry integrity monitoring across all edge modules.
          </p>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isRefreshing}
          className="mt-3 md:mt-0 flex items-center space-x-2 bg-slate-900 border border-surveillance-border hover:border-sky-400 text-sky-400 px-3 py-1.5 rounded text-2xs font-bold cursor-pointer transition-all shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'RUNNING PROBE...' : 'PROBE SYSTEM HEALTH'}</span>
        </button>
      </div>

      {/* 4 Health Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <p className="text-2xs text-slate-400 font-bold uppercase">System Operational Integrity</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">98.8% <span className="text-xs text-slate-400 font-normal">Health</span></p>
          <p className="text-[10px] text-slate-500 mt-1">7 / 8 Subsystems Optimal</p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <p className="text-2xs text-slate-400 font-bold uppercase">Average System Latency</p>
          <p className="text-2xl font-black text-sky-400 mt-1">28 <span className="text-xs text-slate-400 font-normal">ms</span></p>
          <p className="text-[10px] text-slate-500 mt-1">Edge Inference + WebSocket Sync</p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <p className="text-2xs text-slate-400 font-bold uppercase">Sensor Packet Loss</p>
          <p className="text-2xl font-black text-white mt-1">0.02%</p>
          <p className="text-[10px] text-emerald-400 mt-1">16 Nodes Reporting Cleanly</p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <p className="text-2xs text-slate-400 font-bold uppercase">Automated Relays Active</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">ARMED</p>
          <p className="text-[10px] text-slate-500 mt-1">Exhaust Fan Bank Ready</p>
        </div>

      </div>

      {/* Detailed Diagnostic Matrix Table */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center space-x-2">
          <Server className="h-4 w-4 text-sky-400" />
          <span>Subsystem Diagnostic Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-2xs border-collapse">
            <thead>
              <tr className="border-b border-surveillance-border bg-slate-900/60 text-slate-400 uppercase">
                <th className="p-2.5">Subsystem</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Function & Description</th>
                <th className="p-2.5">Round-Trip Latency</th>
                <th className="p-2.5">30-Day Uptime</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {healthNodes.map((node) => (
                <tr key={node.id} className="hover:bg-slate-900/40">
                  <td className="p-2.5 font-bold text-white">{node.name}</td>
                  <td className="p-2.5 text-sky-400">{node.category}</td>
                  <td className="p-2.5 text-slate-300 max-w-xs truncate">{node.desc}</td>
                  <td className="p-2.5 font-mono text-slate-300">{node.latency}</td>
                  <td className="p-2.5 font-mono text-slate-300">{node.uptime}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                      node.status === 'ONLINE' 
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                        : node.status === 'WARNING'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Telemetry Heartbeat Console */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 shadow-cmd space-y-2">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-2xs font-bold text-sky-400 flex items-center space-x-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <span>LIVE SYSTEM TELEMETRY HEARTBEAT FEED</span>
          </span>
          <span className="text-[9px] text-emerald-400 font-mono">DAEMON ACTIVE (PID: 27556)</span>
        </div>

        <div className="font-mono text-[10px] text-slate-400 space-y-1 max-h-36 overflow-y-auto pt-1">
          <p className="text-slate-500">[11:45:01.204] [ESP32-MESH] Handshake verified with Node #01 (Mixing 1) - RSSI -52dBm</p>
          <p className="text-slate-500">[11:45:04.112] [AI-ENGINE] Inference cycle complete on 16 streams (Average 24.2 FPS)</p>
          <p className="text-emerald-400">[11:45:07.890] [SAFETY-DAEMON] Thermal boundary normal: Peak reading 34.2°C at Grinding Shed</p>
          <p className="text-slate-500">[11:45:10.015] [WEBSOCKET-HUB] 1 client synchronized, 0 packets dropped</p>
        </div>
      </div>

    </div>
  );
}

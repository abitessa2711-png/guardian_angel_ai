import React from 'react';
import { 
  Activity, 
  Server, 
  HardDrive, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Lock, 
  Database, 
  CheckCircle2, 
  Clock, 
  Radio,
  FileLock2,
  RefreshCw
} from 'lucide-react';

export default function SystemStatusView() {
  const statusCards = [
    {
      title: 'Camera Network',
      status: 'Online',
      metrics: '22 of 24 Nodes Streaming',
      subtext: '2 Cameras in scheduled maintenance',
      icon: Wifi,
      healthy: true
    },
    {
      title: 'AI Computer Vision Models',
      status: 'Active',
      metrics: 'Inference Latency: 18ms',
      subtext: 'YOLOv8 + MediaPipe Pose + Wav2Vec dB',
      icon: Cpu,
      healthy: true
    },
    {
      title: 'Evidence Storage Vault',
      status: 'Healthy',
      metrics: '2.4 TB / 10.0 TB (24% Used)',
      subtext: 'RAID 6 Encrypted NVMe Array',
      icon: HardDrive,
      healthy: true
    },
    {
      title: 'Relational Database',
      status: 'Healthy',
      metrics: 'Query Latency: 4ms',
      subtext: 'SQLite / PostgreSQL Master-Replica',
      icon: Database,
      healthy: true
    },
    {
      title: 'WebSocket Alert Broadcaster',
      status: 'Active',
      metrics: '0.02s Dispatch Latency',
      subtext: 'Connected to PCR terminals',
      icon: Radio,
      healthy: true
    },
    {
      title: 'System Availability & Uptime',
      status: '99.85%',
      metrics: '48 Days 14 Hrs Continuous',
      subtext: 'Zero unplanned downtime',
      icon: Clock,
      healthy: true
    }
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>Infrastructure Health & Telemetry Center</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time edge compute telemetry, sensor streaming pipeline, and statutory compliance status.</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-md font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Core Subsystems Operational</span>
          </span>
        </div>
      </div>

      {/* 6 Subsystem Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{card.title}</h4>
                    <span className="text-[11px] font-mono font-bold text-slate-700 block mt-0.5">{card.metrics}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-emerald-700 font-bold text-xs">
                  <span>{card.status}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                <span>{card.subtext}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Security & Data Privacy Regulatory Compliance Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Security, Data Privacy & Legal Compliance Framework</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-medium">Statutory Compliance Certified</span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Multi-tier law enforcement access restrictions. Video export permissions strictly gated by supervisory authorization.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <FileLock2 className="w-4 h-4 text-blue-600" />
              <span>Cryptographic Chain of Custody</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              All extracted video evidence is tagged with SHA-256 integrity hashes, ensuring legal admissibility in accordance with the Indian Evidence Act.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>DPDP Act 2023 & ISO/IEC 27001</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Automated video purging cycles, anonymization of non-incident telemetry, and encrypted storage at rest (AES-256).
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}

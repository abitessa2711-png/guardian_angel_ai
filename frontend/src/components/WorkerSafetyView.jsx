import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  FileWarning, 
  Activity, 
  HardHat, 
  UserCheck, 
  AlertOctagon,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function WorkerSafetyView() {
  const { t, language } = useLanguage();

  const [zoneDensityData] = useState([
    { zone: 'Mixing 1', maxAllowed: 2, currentWorkers: 2, ppeRate: 100, risk: 'Normal' },
    { zone: 'Mixing 2', maxAllowed: 2, currentWorkers: 1, ppeRate: 100, risk: 'Normal' },
    { zone: 'Grinding', maxAllowed: 3, currentWorkers: 4, ppeRate: 75, risk: 'Warning' },
    { zone: 'Drying Yard', maxAllowed: 6, currentWorkers: 5, ppeRate: 100, risk: 'Normal' },
    { zone: 'Filling Line', maxAllowed: 8, currentWorkers: 8, ppeRate: 95, risk: 'Normal' },
    { zone: 'Packaging', maxAllowed: 12, currentWorkers: 11, ppeRate: 98, risk: 'Normal' },
    { zone: 'Magazine Vault', maxAllowed: 1, currentWorkers: 0, ppeRate: 100, risk: 'Secure' }
  ]);

  const [violations] = useState([
    { id: 'VIO-1082', time: '11:15 AM', workerId: 'W-042', zone: 'Chemical Grinding Gate', type: 'Static Apron Non-Compliance', severity: 'Warning', status: 'Supervisor Notified' },
    { id: 'VIO-1081', time: '10:40 AM', workerId: 'W-019', zone: 'Raw Chemical Store', type: 'Exceeded Max Worker Capacity (4/2)', severity: 'Critical', status: 'Corrected' },
    { id: 'VIO-1080', time: '09:20 AM', workerId: 'W-088', zone: 'Magazine Buffer Perimeter', type: 'Restricted Zone Perimeter Approach', severity: 'Warning', status: 'Cleared by Supervisor' },
    { id: 'VIO-1079', time: '08:45 AM', workerId: 'W-012', zone: 'Fuse Insertion Porch', type: 'Missing Antistatic Footwear', severity: 'Caution', status: 'Resolved' }
  ]);

  const totalWorkersOnShift = 32;
  const activeDetectedWorkers = 31;
  const overallPPECompliance = 96.4;
  const restrictedEntriesToday = 1;

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <Users className="h-5 w-5 text-sky-400" />
            <span>{t('worker_safety')} & PPE Compliance Audit</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            Optical Worker Density Tracking & Real-Time Antistatic Gear Verification
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-3 md:mt-0 text-2xs">
          <span className="bg-sky-500/15 border border-sky-500/40 text-sky-400 px-3 py-1 rounded font-bold">
            SHIFT STATUS: ACTIVE (32 CHECKED-IN)
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">
              <Users className="h-5 w-5 text-sky-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              97% LOCATED
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-2 font-bold uppercase">{t('worker_count')}</p>
          <p className="text-2xl font-black text-white">{activeDetectedWorkers} <span className="text-xs text-slate-400 font-normal">/ {totalWorkersOnShift} Active</span></p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              GOVT TARGET &gt;95%
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-2 font-bold uppercase">{t('ppe_compliance')}</p>
          <p className="text-2xl font-black text-emerald-400">{overallPPECompliance}%</p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">
              <AlertOctagon className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              1 TODAY
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-2 font-bold uppercase">{t('restricted_zone_entries')}</p>
          <p className="text-2xl font-black text-amber-400">{restrictedEntriesToday} <span className="text-xs text-slate-400 font-normal">Vault Perimeter</span></p>
        </div>

        <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded bg-slate-900 border border-slate-700">
              <FileWarning className="h-5 w-5 text-sky-400" />
            </div>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded">
              RESOLVED: 3/4
            </span>
          </div>
          <p className="text-2xs text-slate-400 mt-2 font-bold uppercase">Safety Non-Compliance Logs</p>
          <p className="text-2xl font-black text-white">{violations.length} <span className="text-xs text-slate-400 font-normal">Events</span></p>
        </div>

      </div>

      {/* Zone Worker Capacity Chart */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-white uppercase flex items-center space-x-2">
            <Activity className="h-4 w-4 text-sky-400" />
            <span>Worker Density vs Permissible Regulatory Capacity by Zone</span>
          </h3>
          <span className="text-[10px] text-slate-400">Live AI Object Counting</span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneDensityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
              <XAxis dataKey="zone" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" domain={[0, 15]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#0c1527', borderColor: '#1e2d4a', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="maxAllowed" name="Max Legal Capacity" fill="#334155" radius={[3, 3, 0, 0]} />
              <Bar dataKey="currentWorkers" name="Current Workers Detected" fill="#0ea5e9" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Safety Violations Audit Log */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <h3 className="text-xs font-bold text-white uppercase mb-3 flex items-center space-x-2">
          <FileWarning className="h-4 w-4 text-amber-400" />
          <span>Real-Time Worker Safety Violation & Density Alerts Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-2xs border-collapse">
            <thead>
              <tr className="border-b border-surveillance-border bg-slate-900/60 text-slate-400 uppercase">
                <th className="p-2.5">Alert ID</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Worker ID</th>
                <th className="p-2.5">Factory Zone</th>
                <th className="p-2.5">Violation Observed</th>
                <th className="p-2.5">Severity</th>
                <th className="p-2.5">Supervisor Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {violations.map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/40">
                  <td className="p-2.5 font-bold text-sky-400">{v.id}</td>
                  <td className="p-2.5 text-slate-300">{v.time}</td>
                  <td className="p-2.5 font-bold text-white">{v.workerId}</td>
                  <td className="p-2.5 text-slate-300">{v.zone}</td>
                  <td className="p-2.5 text-slate-200">{v.type}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                      v.severity === 'Critical' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {v.severity}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400">{v.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulatory & Early Warning Disclaimer */}
      <div className="p-3 bg-slate-900/80 border border-surveillance-border rounded text-[10px] text-slate-400 flex items-start space-x-2">
        <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-white uppercase">Industrial Safety Guidance:</span> {t('early_warning_note')}
        </p>
      </div>

    </div>
  );
}

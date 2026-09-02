import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  BarChart2 
} from 'lucide-react';
import { AshokaEmblem } from './Emblem';

export default function ReportsView() {
  const [selectedReportType, setSelectedReportType] = useState('daily_shift');
  const [reportDate, setReportDate] = useState('2025-05-15');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Header & Controls (Hidden in Print) */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Surveillance Compliance & Incident Audit Reports</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Generate and print standardized government police control-room daily dossiers.</p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="daily_shift">Daily Shift Summary (Duty Dossier)</option>
            <option value="weekly_audit">Weekly Safety & Threat Audit</option>
            <option value="animal_hazard">Animal & Road Safety Log</option>
            <option value="forensic_chain">Forensic Evidence Chain of Custody</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Official Government Printable Document Container */}
      <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-8 max-w-4xl mx-auto space-y-6 text-slate-900">
        
        {/* Document Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center space-y-2">
          <div className="flex justify-center">
            <AshokaEmblem className="w-12 h-14 text-slate-900" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900">GOVERNMENT OF TAMIL NADU</h2>
            <h1 className="text-base font-black uppercase tracking-wider text-slate-900">TRICHY DISTRICT POLICE CONTROL ROOM</h1>
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide">GUARDIAN ANGEL AI — SMART PUBLIC SURVEILLANCE DOSSIER</h3>
          </div>
          <div className="flex justify-between items-center text-xs font-mono pt-2 text-slate-600 border-t border-slate-200">
            <span>REF NO: GA-TRICHY-2025/05/15-01</span>
            <span>DATE: 15 MAY 2025 | 11:30:00 HRS</span>
            <span>SECURITY CLASSIFICATION: CONFIDENTIAL</span>
          </div>
        </div>

        {/* Report Overview Section */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-300 pb-1">
            1. Executive Shift Summary (06:00 - 14:00 Shift A)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Cameras Monitored</span>
              <span className="text-sm font-bold text-slate-900 font-mono">24 (22 Online)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Total People Tracked</span>
              <span className="text-sm font-bold text-slate-900 font-mono">156 Subjects</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Animal Road Hazards</span>
              <span className="text-sm font-bold text-slate-900 font-mono">18 Events</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Critical Escalations</span>
              <span className="text-sm font-bold text-red-600 font-mono">5 Dispatches</span>
            </div>
          </div>
        </div>

        {/* Incident Summary Table */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-300 pb-1">
            2. Verified Critical Incident Log
          </h4>
          <table className="w-full text-left border-collapse border border-slate-300 text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[11px]">
                <th className="p-2 border-r border-slate-300">Time</th>
                <th className="p-2 border-r border-slate-300">Location Node</th>
                <th className="p-2 border-r border-slate-300">Classified Event</th>
                <th className="p-2 border-r border-slate-300">Severity</th>
                <th className="p-2">Responding Patrol Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="p-2 font-mono border-r border-slate-300">11:23:10 AM</td>
                <td className="p-2 border-r border-slate-300">CAM-04 (Main Road Highway)</td>
                <td className="p-2 border-r border-slate-300">Animal on Road - Collision Risk</td>
                <td className="p-2 font-bold text-orange-700 border-r border-slate-300">HIGH</td>
                <td className="p-2">Traffic Warden K. Arul (On Scene)</td>
              </tr>
              <tr>
                <td className="p-2 font-mono border-r border-slate-300">11:21:47 AM</td>
                <td className="p-2 border-r border-slate-300">CAM-07 (Srirangam South Gate)</td>
                <td className="p-2 border-r border-slate-300">Aggressive Physical Altercation</td>
                <td className="p-2 font-bold text-red-700 border-r border-slate-300">CRITICAL</td>
                <td className="p-2">Patrol Car #12 (SI M. Vijay Dispatched)</td>
              </tr>
              <tr>
                <td className="p-2 font-mono border-r border-slate-300">11:20:31 AM</td>
                <td className="p-2 border-r border-slate-300">CAM-09 (Gandhi Market)</td>
                <td className="p-2 border-r border-slate-300">Suspicious Trailing Vector</td>
                <td className="p-2 font-bold text-yellow-800 border-r border-slate-300">MEDIUM</td>
                <td className="p-2">Beat Constable S. Selvam</td>
              </tr>
              <tr>
                <td className="p-2 font-mono border-r border-slate-300">11:19:22 AM</td>
                <td className="p-2 border-r border-slate-300">CAM-03 (Railway Junction)</td>
                <td className="p-2 border-r border-slate-300">Stray Canine Chase Incident</td>
                <td className="p-2 font-bold text-orange-700 border-r border-slate-300">HIGH</td>
                <td className="p-2">RPF Security Team (Resolved)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Ethical AI & Legal Attestation */}
        <div className="space-y-2 text-xs bg-slate-50 p-4 rounded border border-slate-200 text-slate-700 leading-relaxed">
          <p className="font-bold text-slate-900 uppercase">3. Statutory Attestation & AI Compliance</p>
          <p>
            All surveillance streams and biometric indicator triggers recorded herein have been processed under the provisions of the <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and verified by certified law enforcement duty operators. Emotion detection indicators are probabilistic and do not independently constitute legal proof.
          </p>
        </div>

        {/* Official Signatures Block */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs">
          <div className="text-center space-y-12">
            <div className="font-mono text-[10px] text-slate-400">DIGITALLY SIGNED & VERIFIED</div>
            <div className="border-t border-slate-800 pt-1">
              <p className="font-bold text-slate-900">INSPECTOR R. RAJESH</p>
              <p className="text-slate-600">Duty Commander, Trichy Police Control Room</p>
              <p className="text-[10px] text-slate-500 font-mono">BADGE NO: TN-POL-4412</p>
            </div>
          </div>

          <div className="text-center space-y-12">
            <div className="font-mono text-[10px] text-slate-400">COUNTER-SIGNED FOR DISPATCH</div>
            <div className="border-t border-slate-800 pt-1">
              <p className="font-bold text-slate-900">DEPUTY SUPERINTENDENT OF POLICE</p>
              <p className="text-slate-600">Headquarters & Cyber Security Cell</p>
              <p className="text-[10px] text-slate-500 font-mono">SEAL & ATTESTATION</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

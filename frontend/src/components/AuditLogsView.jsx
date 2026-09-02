import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Shield, 
  Filter, 
  FileLock2, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';

export const COMPREHENSIVE_AUDIT_LOGS = [
  {
    id: 'LOG-8841',
    timestamp: '15 May 2025 | 11:24:10 AM',
    user: 'Inspector R. Rajesh',
    badgeId: 'TN-POL-4412',
    actionCategory: 'Patrol Dispatch Order',
    description: 'Transmitted GPS emergency dispatch order INC-2025-089 to Patrol Car #12 for Central Bus Stand.',
    ipAddress: '192.168.1.45',
    sessionId: 'SESS-TN-9921'
  },
  {
    id: 'LOG-8840',
    timestamp: '15 May 2025 | 11:22:05 AM',
    user: 'Sub-Inspector M. Vijay',
    badgeId: 'TN-POL-5120',
    actionCategory: 'Evidence Access & Hash Verification',
    description: 'Inspected cryptographic video snippet EVD-9921 (SHA-256 integrity verified).',
    ipAddress: '192.168.1.52',
    sessionId: 'SESS-TN-9918'
  },
  {
    id: 'LOG-8839',
    timestamp: '15 May 2025 | 11:18:30 AM',
    user: 'Forensic Analyst Dr. Priya S.',
    badgeId: 'TN-CYBER-102',
    actionCategory: 'Model Deployment',
    description: 'Deployed updated ONNX weight artifact guardian_angel_v2.4 to edge cluster nodes.',
    ipAddress: '192.168.1.18',
    sessionId: 'SESS-TN-9905'
  },
  {
    id: 'LOG-8838',
    timestamp: '15 May 2025 | 11:15:12 AM',
    user: 'Inspector R. Rajesh',
    badgeId: 'TN-POL-4412',
    actionCategory: 'System Settings Adjustment',
    description: 'Updated AI Facial Distress Confidence cutoff parameter to 85%.',
    ipAddress: '192.168.1.45',
    sessionId: 'SESS-TN-9892'
  },
  {
    id: 'LOG-8837',
    timestamp: '15 May 2025 | 11:05:40 AM',
    user: 'Duty Officer S. Selvam',
    badgeId: 'TN-BEAT-8821',
    actionCategory: 'Alert Verification',
    description: 'Verified false positive indicator ALT-1036 and marked record dismissed.',
    ipAddress: '192.168.1.60',
    sessionId: 'SESS-TN-9880'
  },
  {
    id: 'LOG-8836',
    timestamp: '15 May 2025 | 10:45:00 AM',
    user: 'Inspector R. Rajesh',
    badgeId: 'TN-POL-4412',
    actionCategory: 'Secure Command Login',
    description: 'Successful multi-factor biometric authentication to Control Room terminal.',
    ipAddress: '192.168.1.45',
    sessionId: 'SESS-TN-9875'
  }
];

export default function AuditLogsView() {
  const [logs, setLogs] = useState(COMPREHENSIVE_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = logs.filter(item => {
    if (categoryFilter !== 'All' && item.actionCategory !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.user.toLowerCase().includes(q) ||
             item.badgeId.toLowerCase().includes(q) ||
             item.description.toLowerCase().includes(q) ||
             item.actionCategory.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Immutable Surveillance Audit Trail & Activity Logs</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Statutory audit logging for evidence chain of custody and personnel action accountability under Section 43A of the IT Act.</p>
        </div>

        <button
          onClick={() => alert('Exporting signed audit trail CSV')}
          className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search officer, badge ID, action description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="All">All Action Categories</option>
          <option value="Patrol Dispatch Order">Patrol Dispatch Order</option>
          <option value="Evidence Access & Hash Verification">Evidence Access</option>
          <option value="Model Deployment">Model Deployment</option>
          <option value="System Settings Adjustment">Settings Adjustment</option>
          <option value="Secure Command Login">Secure Login</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Authorized Officer</th>
                <th className="py-2.5 px-3">Badge ID</th>
                <th className="py-2.5 px-3">Action Category</th>
                <th className="py-2.5 px-4">Activity Log Description</th>
                <th className="py-2.5 px-3">IP Address</th>
                <th className="py-2.5 px-3">Session Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap text-slate-600 font-bold">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                    {log.badgeId}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {log.actionCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-snug">
                    {log.description}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                    {log.sessionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-slate-500 text-[11px] flex justify-between">
          <span>Cryptographic Log Hash: SHA-256 Root Verified</span>
          <span>Retention Period: 365 Days (Statutory Law Enforcement)</span>
        </div>
      </div>

    </div>
  );
}

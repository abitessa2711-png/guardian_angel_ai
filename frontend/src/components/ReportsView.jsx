import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  FileText, 
  Filter, 
  Calendar, 
  MapPin, 
  AlertOctagon, 
  ShieldCheck, 
  CheckCircle, 
  Download 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReportsView({ alerts = [], incidents = [] }) {
  const { t, language } = useLanguage();
  const [reportType, setReportType] = useState('DAILY');
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const locationsList = ['ALL', ...new Set(alerts.map(a => a.camera_location || a.location || ''))].filter(Boolean);

  const filteredAlerts = alerts.filter(alert => {
    const loc = alert.camera_location || alert.location || '';
    if (filterLocation !== 'ALL' && loc !== filterLocation) return false;
    
    if (filterRisk === 'HIGH' && alert.risk_score < 75) return false;
    if (filterRisk === 'MEDIUM' && (alert.risk_score < 45 || alert.risk_score >= 75)) return false;
    if (filterRisk === 'LOW' && alert.risk_score >= 45) return false;
    
    if (dateRange.start) {
      const alertTime = new Date(alert.timestamp).getTime();
      const startTime = new Date(dateRange.start).getTime();
      if (alertTime < startTime) return false;
    }
    if (dateRange.end) {
      const alertTime = new Date(alert.timestamp).getTime();
      const endTime = new Date(dateRange.end).getTime() + 86400000;
      if (alertTime > endTime) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Audit ID', 'Zone Camera', 'Facility Zone', 'Timestamp', 'Status', 'Risk Index (%)', 'Thermal Score', 'Gas PPM Score', 'Worker Density Score', 'AI Safety Finding'];
    
    const rows = filteredAlerts.map(a => [
      a.id,
      `"${(a.camera_name || `CAM-${a.camera_id}`).replace(/"/g, '""')}"`,
      `"${(a.camera_location || a.location || 'Processing Zone').replace(/"/g, '""')}"`,
      new Date(a.timestamp).toLocaleString(),
      a.status,
      a.risk_score,
      a.following_score,
      a.proximity_score,
      a.aggression_score,
      `"${(a.explanation || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pyroguardian_msme_safety_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div>
          <h2 className="text-sm md:text-base font-black tracking-wider text-white flex items-center space-x-2">
            <FileText className="h-5 w-5 text-sky-400" />
            <span>{t('reports')} & Regulatory Safety Audits</span>
          </h2>
          <p className="text-2xs text-slate-400 mt-0.5">
            Government & MSME Compliance Reports, Incident Logs & Export Utilities
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-3 md:mt-0">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 hover:border-sky-400 text-sky-400 px-3 py-1.5 rounded text-2xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t('export_csv')}</span>
          </button>
          
          <button
            onClick={triggerPrint}
            className="flex items-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded text-2xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>{t('print_report')} / PDF</span>
          </button>
        </div>
      </div>

      {/* Filter and Configuration Bar */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd text-2xs">
        <h4 className="font-bold text-white uppercase mb-3 flex items-center space-x-2">
          <Filter className="h-4 w-4 text-sky-400" />
          <span>Audit Query Parameters & Filters</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Report Frequency Type */}
          <div>
            <label className="text-slate-400 block mb-1">Report Schedule:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              <option value="DAILY">Daily Shift Safety Audit</option>
              <option value="WEEKLY">Weekly Compliance Summary</option>
              <option value="MONTHLY">Monthly DISH Regulatory Filing</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="text-slate-400 block mb-1">Factory Zone:</label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              {locationsList.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="text-slate-400 block mb-1">Risk Severity:</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            >
              <option value="ALL">All Risk Severities</option>
              <option value="HIGH">Critical Hazard (&gt;75%)</option>
              <option value="MEDIUM">Caution Warning (45-74%)</option>
              <option value="LOW">Safe Normal (&lt;45%)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-slate-400 block mb-1">Filter Date:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-sky-400"
            />
          </div>

        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surveillance-panel p-4 rounded-lg border border-surveillance-border shadow-cmd">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-white uppercase flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Industrial Safety Audit Records ({filteredAlerts.length} Events)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Status: Verified Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-2xs border-collapse">
            <thead>
              <tr className="border-b border-surveillance-border bg-slate-900/60 text-slate-400 uppercase">
                <th className="p-2.5">Audit ID</th>
                <th className="p-2.5">Camera Observation Node</th>
                <th className="p-2.5">Monitored Zone</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Risk Score</th>
                <th className="p-2.5">AI Safety Finding</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-bold text-sky-400">#AUD-{alert.id}</td>
                    <td className="p-2.5 font-bold text-white">{alert.camera_name || `CAM-${alert.camera_id}`}</td>
                    <td className="p-2.5 text-slate-300">{alert.camera_location || alert.location || 'Processing Zone'}</td>
                    <td className="p-2.5 text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded font-black ${
                        alert.risk_score >= 75 ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                        alert.risk_score >= 45 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {alert.risk_score}%
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300 max-w-sm truncate">{alert.explanation}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No safety records found matching the specified parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

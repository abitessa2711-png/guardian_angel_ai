import React, { useState } from 'react';
import { FileDown, Printer, FileText, Filter, Calendar, MapPin, AlertOctagon } from 'lucide-react';

export default function ReportsView({ alerts, incidents }) {
  const [filterLocation, setFilterLocation] = useState('ALL');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Get unique locations
  const locationsList = ['ALL', ...new Set(alerts.map(a => a.camera_location))];

  // Filter alerts based on settings
  const filteredAlerts = alerts.filter(alert => {
    // Location Filter
    if (filterLocation !== 'ALL' && alert.camera_location !== filterLocation) return false;
    
    // Risk Filter
    if (filterRisk === 'HIGH' && alert.risk_score < 75) return false;
    if (filterRisk === 'MEDIUM' && (alert.risk_score < 45 || alert.risk_score >= 75)) return false;
    if (filterRisk === 'LOW' && alert.risk_score >= 45) return false;
    
    // Date Filter
    if (dateRange.start) {
      const alertTime = new Date(alert.timestamp).getTime();
      const startTime = new Date(dateRange.start).getTime();
      if (alertTime < startTime) return false;
    }
    if (dateRange.end) {
      const alertTime = new Date(alert.timestamp).getTime();
      // Add 1 day to end date to make it inclusive of that day
      const endTime = new Date(dateRange.end).getTime() + 86400000;
      if (alertTime > endTime) return false;
    }

    return true;
  });

  // Client-side CSV generation
  const exportToCSV = () => {
    const headers = ['Alert ID', 'Camera ID', 'Camera Name', 'Location', 'Timestamp', 'Status', 'Risk Score', 'Following Score', 'Proximity Score', 'Aggression Score', 'AI Explanation'];
    
    const rows = filteredAlerts.map(a => [
      a.id,
      a.camera_id,
      `"${a.camera_name.replace(/"/g, '""')}"`,
      `"${a.camera_location.replace(/"/g, '""')}"`,
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
    link.setAttribute("download", `tn_police_safety_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Search and Filter Panel */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-5 font-mono text-2xs text-white">
        <h4 className="text-xs font-bold tracking-widest text-surveillance-accent uppercase mb-4 flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>INCIDENT FILTER LOG MATRIX</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Location */}
          <div className="space-y-1">
            <label className="text-surveillance-textMuted flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>CCTV STATION ZONE</span>
            </label>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-2.5 py-1.5 focus:outline-none focus:border-surveillance-accent"
            >
              {locationsList.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div className="space-y-1">
            <label className="text-surveillance-textMuted flex items-center space-x-1">
              <AlertOctagon className="h-3 w-3" />
              <span>THREAT LEVEL</span>
            </label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-2.5 py-1.5 focus:outline-none focus:border-surveillance-accent"
            >
              <option value="ALL">ALL RISK LEVELS</option>
              <option value="HIGH">CRITICAL (75-100)</option>
              <option value="MEDIUM">ELEVATED (45-74)</option>
              <option value="LOW">SAFE (0-44)</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-surveillance-textMuted flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>START DATE</span>
            </label>
            <input 
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-2.5 py-1.5 focus:outline-none focus:border-surveillance-accent"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-surveillance-textMuted flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>END DATE</span>
            </label>
            <input 
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-2.5 py-1.5 focus:outline-none focus:border-surveillance-accent"
            />
          </div>
        </div>
      </div>

      {/* Report Table / Printable Area */}
      <div className="bg-surveillance-panel border border-surveillance-border rounded-lg p-6 font-mono print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Printable Official Police Header (hidden normally, visible on print) */}
        <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-lg font-black tracking-widest text-black">GOVERNMENT OF TAMIL NADU</h1>
          <h2 className="text-sm font-bold text-black uppercase mt-1">TAMIL NADU POLICEsurveillance DEPARTMENT</h2>
          <p className="text-xs text-gray-700 mt-1">GUARDIAN ANGEL AI - CCTV MONITORING INCIDENT LOG</p>
          <p className="text-4xs text-gray-500 mt-0.5">DATE OF GENERATION: {new Date().toLocaleString()}</p>
        </div>

        {/* Action controls */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-white uppercase flex items-center space-x-2">
              <FileText className="h-5 w-5 text-surveillance-accent" />
              <span>COMPILED INCIDENT JOURNAL</span>
            </h3>
            <p className="text-3xs text-surveillance-textMuted mt-1">
              MATCHED SURVEILLANCE RECORDS: {filteredAlerts.length} LOGS
            </p>
          </div>

          <div className="flex space-x-3 text-xs">
            <button 
              onClick={exportToCSV}
              className="flex items-center space-x-2 bg-surveillance-header hover:bg-surveillance-border border border-surveillance-border text-white px-3 py-2 rounded cursor-pointer transition-all"
            >
              <FileDown className="h-4 w-4 text-surveillance-accent" />
              <span>EXPORT SPREADSHEET (CSV)</span>
            </button>
            
            <button 
              onClick={triggerPrint}
              className="flex items-center space-x-2 bg-surveillance-accent hover:bg-sky-600 text-white px-4 py-2 rounded cursor-pointer transition-all shadow-glow-cyan"
            >
              <Printer className="h-4 w-4" />
              <span>PRINT REPORT (PDF)</span>
            </button>
          </div>
        </div>

        {/* Data list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-2xs print:text-black">
            <thead>
              <tr className="border-b border-surveillance-border print:border-black/50 text-surveillance-textMuted print:text-black/80 font-bold">
                <th className="py-2.5 px-3 uppercase">ALERT ID</th>
                <th className="py-2.5 px-3 uppercase">SURVEILLANCE UNIT</th>
                <th className="py-2.5 px-3 uppercase">LOCATION AREA</th>
                <th className="py-2.5 px-3 uppercase">INCIDENT TIMESTAMP</th>
                <th className="py-2.5 px-3 uppercase">THREAT LEVEL</th>
                <th className="py-2.5 px-3 uppercase">STATE</th>
                <th className="py-2.5 px-3 uppercase print:hidden">EXPLAINABLE DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surveillance-border/50 print:divide-black/20 text-white print:text-black">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-surveillance-textMuted font-semibold print:text-gray-500">
                    No safety records found matching current query boundaries.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-surveillance-header/40 print:hover:bg-transparent transition-colors">
                    <td className="py-3 px-3 font-bold text-surveillance-textMuted print:text-black">#{alert.id}</td>
                    <td className="py-3 px-3 font-bold">{alert.camera_name}</td>
                    <td className="py-3 px-3 text-slate-300 print:text-black">{alert.camera_location}</td>
                    <td className="py-3 px-3 text-surveillance-textMuted print:text-black text-3xs">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-3xs font-bold font-mono ${
                        alert.risk_score >= 75 
                          ? 'bg-surveillance-danger/10 text-surveillance-danger border border-surveillance-danger/30 print:bg-transparent print:text-red-700 print:border-red-400' 
                          : alert.risk_score >= 45 
                          ? 'bg-surveillance-warning/10 text-surveillance-warning border border-surveillance-warning/30 print:bg-transparent print:text-amber-700 print:border-amber-400' 
                          : 'bg-surveillance-success/10 text-surveillance-success border border-surveillance-success/30 print:bg-transparent print:text-emerald-700 print:border-emerald-400'
                      }`}>
                        {alert.risk_score}% RISK
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-3xs uppercase font-semibold">{alert.status}</span>
                    </td>
                    <td className="py-3 px-3 text-3xs text-surveillance-textMuted italic truncate max-w-xs print:hidden" title={alert.explanation}>
                      {alert.explanation}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Printable Footer (visible on print) */}
        <div className="hidden print:flex justify-between items-center border-t-2 border-black pt-6 mt-12 text-3xs text-gray-500 font-mono">
          <p>CONFIDENTIAL | OFFICIAL TN POLICE Surveillance USE ONLY</p>
          <p>SIGNATURE: _______________________</p>
        </div>

      </div>

    </div>
  );
}

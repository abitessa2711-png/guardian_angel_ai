import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldAlert, 
  Eye, 
  Radio, 
  ChevronRight,
  Clock,
  Calendar,
  X
} from 'lucide-react';

export const INITIAL_ALERTS_DATA = [
  {
    id: 'ALT-1042',
    time: '11:23:10 AM',
    date: '15 May 2025',
    camera: 'Camera 04 - Main Road',
    cameraId: 'CAM-04',
    event: 'Animal on Road – Potential Accident Risk',
    category: 'Animal Safety',
    risk: 'High',
    confidence: 0.94,
    status: 'New',
    description: 'Bovine animal detected crossing fast-moving traffic lane. Approaching vehicles alerted.',
    distance: '2.4m from oncoming vehicle'
  },
  {
    id: 'ALT-1041',
    time: '11:22:05 AM',
    date: '15 May 2025',
    camera: 'Camera 02 - Transit Terminal',
    cameraId: 'CAM-02',
    event: 'Potential Distress Indicator',
    category: 'Human Safety',
    risk: 'High',
    confidence: 0.92,
    status: 'New',
    description: 'Facial and body tension indicators observed on female commuter. Prolonged hesitation detected.',
    distance: 'Commuter platform 1'
  },
  {
    id: 'ALT-1040',
    time: '11:21:47 AM',
    date: '15 May 2025',
    camera: 'Camera 07 - Srirangam Temple Road',
    cameraId: 'CAM-07',
    event: 'Aggressive Movement & Physical Struggle',
    category: 'Human Safety',
    risk: 'Critical',
    confidence: 0.96,
    status: 'Dispatched',
    description: 'Sudden trajectory grab vector locked between two individuals. Nearest patrol car dispatched.',
    distance: '0.8m proximity'
  },
  {
    id: 'ALT-1039',
    time: '11:20:31 AM',
    date: '15 May 2025',
    camera: 'Camera 09 - Gandhi Market',
    cameraId: 'CAM-09',
    event: 'Suspicious Interaction & Following',
    category: 'Public Safety',
    risk: 'Medium',
    confidence: 0.88,
    status: 'Verified',
    description: 'Subject followed commuter across 3 consecutive retail alleys for over 18 minutes.',
    distance: '1.2m proximity'
  },
  {
    id: 'ALT-1038',
    time: '11:19:22 AM',
    date: '15 May 2025',
    camera: 'Camera 03 - Railway Junction',
    cameraId: 'CAM-03',
    event: 'Animal Chasing Person',
    category: 'Animal Safety',
    risk: 'High',
    confidence: 0.91,
    status: 'Resolved',
    description: 'Stray canine pack aggressive charge towards pedestrian. Resolved by station security wardens.',
    distance: '1.5m gap'
  },
  {
    id: 'ALT-1037',
    time: '11:15:40 AM',
    date: '15 May 2025',
    camera: 'Camera 05 - Subway Walkway',
    cameraId: 'CAM-05',
    event: 'Isolated Pedestrian Vulnerability',
    category: 'Public Safety',
    risk: 'Medium',
    confidence: 0.89,
    status: 'Resolved',
    description: 'Solo female pedestrian in low-light subway corridor after dark. Floodlights automatically engaged.',
    distance: 'Subway gate 2'
  },
  {
    id: 'ALT-1036',
    time: '11:12:18 AM',
    date: '15 May 2025',
    camera: 'Camera 01 - Chatram Bus Stand',
    cameraId: 'CAM-01',
    event: 'Repeated Close Interaction',
    category: 'Human Safety',
    risk: 'Medium',
    confidence: 0.85,
    status: 'Dismissed',
    description: 'False positive flag: Group of students travelling together verified by surveillance operator.',
    distance: '0.5m proximity'
  },
  {
    id: 'ALT-1035',
    time: '11:08:55 AM',
    date: '15 May 2025',
    camera: 'Camera 06 - NIT Highway Gate',
    cameraId: 'CAM-06',
    event: 'Animal Near Moving Vehicle',
    category: 'Animal Safety',
    risk: 'High',
    confidence: 0.93,
    status: 'Resolved',
    description: 'Animal grazing on highway shoulder. Highway patrol dispatched to clear median.',
    distance: '1.8m from fast lane'
  }
];

export default function AlertsView({ onSelectAlert, onDispatchAlert }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = ['All', 'Human Safety', 'Animal Safety', 'Public Safety', 'High Risk', 'Critical'];

  const filteredAlerts = alerts.filter(alert => {
    // Category chip filter
    if (selectedCategory === 'Human Safety' && alert.category !== 'Human Safety') return false;
    if (selectedCategory === 'Animal Safety' && alert.category !== 'Animal Safety') return false;
    if (selectedCategory === 'Public Safety' && alert.category !== 'Public Safety') return false;
    if (selectedCategory === 'High Risk' && alert.risk !== 'High' && alert.risk !== 'Critical') return false;
    if (selectedCategory === 'Critical' && alert.risk !== 'Critical') return false;

    // Risk level filter
    if (selectedRisk !== 'All' && alert.risk !== selectedRisk) return false;

    // Status filter
    if (selectedStatus !== 'All' && alert.status !== selectedStatus) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = alert.event.toLowerCase().includes(q) ||
                    alert.camera.toLowerCase().includes(q) ||
                    alert.id.toLowerCase().includes(q) ||
                    alert.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const handleResolveAlert = (id, e) => {
    e.stopPropagation();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
  };

  const handleExportCSV = () => {
    const headers = ["Alert ID", "Time", "Date", "Camera", "Event", "Category", "Risk Level", "Confidence", "Status", "Description"];
    const rows = filteredAlerts.map(a => [
      a.id, a.time, a.date, `"${a.camera}"`, `"${a.event}"`, a.category, a.risk, a.confidence, a.status, `"${a.description}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Guardian_Angel_Alerts_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Filter & Action Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-3">
        
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search Bar & Dropdown Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search alert ID, event, camera location, details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="New">New (Unresolved)</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Verified">Verified</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Alert Data Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Camera</th>
                <th className="py-2.5 px-4">Event Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr 
                    key={alert.id}
                    onClick={() => onSelectAlert && onSelectAlert(alert)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                  >
                    {/* Time */}
                    <td className="py-3 px-4 font-mono text-[11px] whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{alert.time}</div>
                      <div className="text-[10px] text-slate-400">{alert.date}</div>
                    </td>

                    {/* Camera */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{alert.camera}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{alert.cameraId}</div>
                    </td>

                    {/* Event Title */}
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 leading-snug">{alert.event}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{alert.description}</p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-slate-600 font-medium px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                        {alert.category}
                      </span>
                    </td>

                    {/* Risk Level Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase inline-block ${
                        alert.risk === 'Critical' 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : alert.risk === 'High'
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {alert.risk}
                      </span>
                    </td>

                    {/* Confidence Score */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {(alert.confidence * 100).toFixed(0)}%
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        alert.status === 'New' 
                          ? 'bg-blue-100 text-blue-700 font-bold animate-pulse' 
                          : alert.status === 'Dispatched'
                          ? 'bg-purple-100 text-purple-700 font-bold'
                          : alert.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : alert.status === 'Resolved'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {alert.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectAlert) onSelectAlert(alert);
                        }}
                        className="px-2 py-1 text-slate-700 hover:bg-slate-100 border border-slate-300 rounded text-xs font-semibold cursor-pointer"
                        title="View Detailed Evidence"
                      >
                        View
                      </button>

                      {alert.status === 'New' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDispatchAlert) onDispatchAlert(alert);
                          }}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold cursor-pointer"
                          title="Dispatch Nearest Patrol Car"
                        >
                          Dispatch
                        </button>
                      )}

                      {alert.status !== 'Resolved' && alert.status !== 'Dismissed' && (
                        <button
                          onClick={(e) => handleResolveAlert(alert.id, e)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                          title="Mark Resolved"
                        >
                          Resolve
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 text-xs">
                    No surveillance alerts matched your selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination / Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Showing {filteredAlerts.length} of {alerts.length} total alerts</span>
          <span className="font-medium text-slate-500">Auto-refreshing live alert stream</span>
        </div>

      </div>

    </div>
  );
}

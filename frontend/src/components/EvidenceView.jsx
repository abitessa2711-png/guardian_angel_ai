import React, { useState } from 'react';
import { 
  FolderCheck, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  FileLock2, 
  Calendar, 
  Hash, 
  Filter,
  Trash2,
  ShieldCheck,
  FileText
} from 'lucide-react';

export const INITIAL_EVIDENCE = [
  {
    id: 'EVD-9921',
    incidentId: 'INC-2025-089',
    eventTitle: 'Physical Confrontation Vector Footage',
    category: 'Human Safety',
    camera: 'Camera 07 - Srirangam Temple Road',
    cameraId: 'CAM-07',
    timestamp: '15 May 2025 | 11:21:47 AM',
    riskScore: 96,
    fileType: 'MP4 Video (1080p 30fps)',
    fileSize: '16.8 MB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    verifiedBy: 'Inspector R. Rajesh (ID: TN-4412)',
    verificationStatus: 'Verified Legally Admissible',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'EVD-9920',
    incidentId: 'INC-2025-088',
    eventTitle: 'Highway Cattle Collision Risk Recording',
    category: 'Animal Safety',
    camera: 'Camera 04 - Trichy Main Highway',
    cameraId: 'CAM-04',
    timestamp: '15 May 2025 | 11:23:10 AM',
    riskScore: 88,
    fileType: 'MP4 Video (1080p 30fps)',
    fileSize: '12.4 MB',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verifiedBy: 'Traffic SI K. Arul',
    verificationStatus: 'Verified',
    thumbnail: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'EVD-9919',
    incidentId: 'INC-2025-087',
    eventTitle: 'Alley Trailing & Stalking Path Recording',
    category: 'Public Safety',
    camera: 'Camera 09 - Gandhi Market',
    cameraId: 'CAM-09',
    timestamp: '15 May 2025 | 11:20:31 AM',
    riskScore: 88,
    fileType: 'PNG Hi-Res Snapshot + Log',
    fileSize: '4.2 MB',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    verifiedBy: 'Pending Forensic Review',
    verificationStatus: 'Pending Verification',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'EVD-9918',
    incidentId: 'INC-2025-086',
    eventTitle: 'Stray Dog Attack Interception Audio & Video',
    category: 'Animal Safety',
    camera: 'Camera 03 - Railway Junction',
    cameraId: 'CAM-03',
    timestamp: '15 May 2025 | 11:19:22 AM',
    riskScore: 84,
    fileType: 'MP4 Video + Audio Decibel Index',
    fileSize: '14.1 MB',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    verifiedBy: 'RPF Officer J. Paul',
    verificationStatus: 'Verified',
    thumbnail: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=400&auto=format&fit=crop'
  }
];

export default function EvidenceView({ 
  onOpenEvidenceModal, 
  evidenceList: propEvidenceList, 
  setEvidenceList: propSetEvidenceList 
}) {
  const [localEvidenceList, setLocalEvidenceList] = useState(INITIAL_EVIDENCE);
  const evidenceList = propEvidenceList || localEvidenceList;
  const setEvidenceList = propSetEvidenceList || setLocalEvidenceList;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = evidenceList.filter(item => {
    if (statusFilter !== 'All' && item.verificationStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return item.id.toLowerCase().includes(q) ||
             item.eventTitle.toLowerCase().includes(q) ||
             item.camera.toLowerCase().includes(q) ||
             item.sha256.toLowerCase().includes(q);
    }
    return true;
  });

  const handleVerify = (id) => {
    setEvidenceList(prev => prev.map(e => e.id === id ? { ...e, verificationStatus: 'Verified Legally Admissible', verifiedBy: 'Duty Officer (Confirmed)' } : e));
  };

  const handleDownload = (item) => {
    alert(`Downloading encrypted evidence package for ${item.id} with SHA-256 integrity manifest.`);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <FolderCheck className="w-5 h-5 text-blue-600" />
            <span>Digital Evidence Vault & Chain of Custody Repository</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Secure, cryptographically hashed surveillance recordings and legal evidentiary snapshots.</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1.5 rounded-md flex items-center space-x-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>SHA-256 Tamper-Proof Cryptographic Lock: Active</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search evidence ID, incident, camera, checksum hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none"
        >
          <option value="All">All Verification Statuses</option>
          <option value="Verified Legally Admissible">Verified Admissible</option>
          <option value="Verified">Verified</option>
          <option value="Pending Verification">Pending Verification</option>
        </select>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => (
          <div 
            key={item.id}
            className={`bg-white rounded-lg border shadow-xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all ${
              item.isUploadedEvidence ? 'border-blue-400 ring-2 ring-blue-500/20 bg-blue-50/10' : 'border-slate-200'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileLock2 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs font-mono text-slate-900">{item.id}</span>
                  <span className="text-[10px] text-slate-500">({item.incidentId})</span>
                  {item.isUploadedEvidence && (
                    <span className="bg-[#FF671F] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                      CAPTURED FOOTAGE
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  item.verificationStatus.includes('Admissible') 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : item.verificationStatus === 'Verified'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.verificationStatus}
                </span>
              </div>

              {/* Main Card Content */}
              <div className="p-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3.5">
                {/* Forensic CCTV Proof Frame */}
                <div className="relative w-full sm:w-44 h-32 rounded-md overflow-hidden border border-slate-800 shrink-0 bg-black shadow-xs">
                  <img 
                    src={item.thumbnail} 
                    alt="Evidence preview" 
                    className="w-full h-full object-cover brightness-90 contrast-110"
                  />
                  {/* Live Forensic CCTV Stamp Header */}
                  <div className="absolute top-1 left-1 bg-red-600/90 text-white font-mono text-[8px] font-bold px-1.5 py-0.2 rounded flex items-center space-x-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>{item.cameraId || 'CCTV-PROOF'}</span>
                  </div>
                  <div className="absolute top-1 right-1 bg-black/80 text-emerald-400 font-mono text-[7px] px-1 rounded font-bold">
                    REC • 1080p
                  </div>

                  {/* Real Forensic SVG Bounding Reticles on Proof */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                    {item.category === 'Human Safety' || item.category === 'Women Safety Emergency' || item.isUploadedEvidence ? (
                      <g>
                        {/* Victim / Target Commuter Box */}
                        <rect x="22" y="24" width="24" height="56" fill="none" stroke="#10b981" strokeWidth="1.6" />
                        <rect x="21" y="17" width="26" height="6.5" fill="#10b981" />
                        <text x="34" y="21.5" fill="#ffffff" fontSize="3.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TARGET</text>

                        {/* Suspect Box */}
                        <rect x="54" y="20" width="25" height="60" fill="none" stroke="#ef4444" strokeWidth="1.6" strokeDasharray="2 1" />
                        <rect x="53" y="13" width="27" height="6.5" fill="#ef4444" />
                        <text x="66" y="17.5" fill="#ffffff" fontSize="3.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SUSPECT</text>

                        {/* Proximity line */}
                        <line x1="46" y1="52" x2="54" y2="52" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="1.5 1" />
                      </g>
                    ) : item.category === 'Animal Safety' ? (
                      <g>
                        {/* Animal Hazard Box */}
                        <rect x="24" y="28" width="52" height="50" fill="none" stroke="#f59e0b" strokeWidth="1.8" />
                        <rect x="23" y="20" width="54" height="7.5" fill="#d97706" />
                        <text x="50" y="25.5" fill="#ffffff" fontSize="4.2" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ANIMAL HAZARD</text>
                      </g>
                    ) : (
                      <g>
                        {/* Perimeter Intrusion Reticle */}
                        <rect x="26" y="24" width="48" height="56" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 1.5" />
                        <rect x="25" y="17" width="50" height="6.5" fill="#0284c7" />
                        <text x="50" y="21.5" fill="#ffffff" fontSize="3.8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SURVEILLANCE</text>
                      </g>
                    )}
                  </svg>

                  {/* Legal Custody Hash Watermark */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/85 px-1.5 py-0.5 text-[7px] font-mono text-slate-300 flex items-center justify-between border-t border-slate-700">
                    <span className="truncate">SEC-65B COMPLIANT</span>
                    <span className="text-amber-400 font-bold">POLICE EVIDENCE</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">{item.eventTitle}</h4>
                  <p className="text-[11px] text-slate-600">{item.camera}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{item.timestamp}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Format: {item.fileType} • {item.fileSize}</p>
                </div>
              </div>

              {/* Cryptographic SHA-256 Hash Display */}
              <div className="px-4 pb-2 text-[10px] font-mono text-slate-500 bg-slate-50 py-1.5 border-t border-b border-slate-100 flex items-center space-x-1">
                <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">SHA-256: {item.sha256}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                Auditor: {item.verifiedBy}
              </span>

              <div className="flex space-x-1.5">
                <button
                  onClick={() => onOpenEvidenceModal && onOpenEvidenceModal(item)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded cursor-pointer border border-slate-300 flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => handleDownload(item)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded cursor-pointer flex items-center space-x-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>

                {item.verificationStatus !== 'Verified Legally Admissible' && (
                  <button
                    onClick={() => handleVerify(item.id)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded cursor-pointer"
                  >
                    Mark Verified
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

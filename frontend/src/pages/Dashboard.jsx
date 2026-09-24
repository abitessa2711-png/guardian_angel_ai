import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import LiveMonitoringView from '../components/LiveMonitoringView';
import WomenSafetyMonitoringView from '../components/WomenSafetyMonitoringView';
import AlertsView from '../components/AlertsView';
import EvidenceView from '../components/EvidenceView';
import AnalyticsView from '../components/AnalyticsView';
import DatasetManagementView from '../components/DatasetManagementView';
import AITrainingEvaluationView from '../components/AITrainingEvaluationView';
import ReportsView from '../components/ReportsView';
import SettingsView from '../components/SettingsView';
import AlertDetailModal from '../components/AlertDetailModal';
import DispatchModal from '../components/DispatchModal';
import EvidenceModal from '../components/EvidenceModal';
import { INITIAL_EVIDENCE } from '../components/EvidenceView';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCameraId, setSelectedCameraId] = useState('CAM 04');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [evidenceList, setEvidenceList] = useState(() => {
    try {
      const saved = localStorage.getItem('guardian_angel_evidence');
      return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
    } catch (e) {
      return INITIAL_EVIDENCE;
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddEvidence = (newEvidence) => {
    setEvidenceList(prev => {
      const updated = [newEvidence, ...prev];
      try {
        localStorage.setItem('guardian_angel_evidence', JSON.stringify(updated));
      } catch (e) {
        console.log('Error saving evidence to local storage:', e);
      }
      return updated;
    });
    showToast(`Evidence ${newEvidence.id} securely ingested into Evidence Vault!`);
  };

  const handleCaptureSnapshot = (camera) => {
    if (camera?.snapshotData) {
      const newEvd = {
        id: `EVD-${Math.floor(1000 + Math.random() * 9000)}`,
        incidentId: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
        eventTitle: `${camera.name || camera.id} Surveillance Capture`,
        category: camera.risk === 'HIGH' || camera.risk === 'CRITICAL' ? 'Human Safety Emergency' : 'Surveillance Record',
        camera: camera.name || camera.id,
        cameraId: camera.id || 'CAM-NODE',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + ' | ' + new Date().toLocaleDateString('en-GB'),
        riskScore: camera.risk === 'CRITICAL' ? 96 : camera.risk === 'HIGH' ? 91 : 25,
        fileType: 'Forensic Video Frame (1080p)',
        fileSize: '3.8 MB',
        sha256: Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        verifiedBy: 'Inspector R. Rajesh (Duty Officer)',
        verificationStatus: 'Verified Legally Admissible',
        thumbnail: camera.snapshotData,
        isUploadedEvidence: camera.id === 'CAM-UPLOAD'
      };
      handleAddEvidence(newEvd);
    } else {
      showToast(`Evidence Snapshot captured from ${camera.name || camera.id} and vaulted with SHA-256 hash.`);
    }
  };

  const handleDispatchAlert = (alertOrIncident) => {
    setSelectedIncidentForDispatch(alertOrIncident);
  };

  const handleConfirmDispatch = (incident, unitId) => {
    showToast(`Patrol Unit ${unitId} dispatched to ${incident.location || incident.camera}. Priority order transmitted.`);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800 antialiased select-none overflow-hidden">
      
      {/* 1. Header Matching Reference Mockup */}
      <Header 
        onSelectAlert={(alert) => setSelectedAlert(alert)} 
        unreadCount={12}
      />

      {/* 2. Main Layout: Narrow Left Sidebar + Dynamic Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab)} 
        />

        {/* Right Content Viewport */}
        <main className="flex-1 overflow-y-auto p-3.5 md:p-4 bg-[#F8FAFC]">
          
          {/* Tab Router */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectCamera={(camId) => setSelectedCameraId(camId)}
              onCaptureSnapshot={handleCaptureSnapshot}
            />
          )}

          {activeTab === 'live_monitoring' && (
            <LiveMonitoringView 
              selectedCameraId={selectedCameraId}
              onCaptureSnapshot={handleCaptureSnapshot}
              onDispatchAlert={handleDispatchAlert}
              onAddEvidence={handleAddEvidence}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'women_safety' && (
            <WomenSafetyMonitoringView 
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              onDispatchAlert={handleDispatchAlert}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView 
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              onDispatchAlert={handleDispatchAlert}
            />
          )}

          {activeTab === 'evidence' && (
            <EvidenceView 
              evidenceList={evidenceList}
              setEvidenceList={setEvidenceList}
              onOpenEvidenceModal={(evidence) => setSelectedEvidence(evidence)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'dataset' && (
            <DatasetManagementView />
          )}

          {activeTab === 'ai_training' && (
            <AITrainingEvaluationView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView />
          )}

        </main>

      </div>

      {/* 3. Global Interactive Modals */}
      {selectedAlert && (
        <AlertDetailModal 
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onDispatch={handleDispatchAlert}
          onResolve={(id) => showToast(`Incident ${id} marked verified and resolved.`)}
        />
      )}

      {selectedIncidentForDispatch && (
        <DispatchModal 
          incident={selectedIncidentForDispatch}
          onClose={() => setSelectedIncidentForDispatch(null)}
          onConfirmDispatch={handleConfirmDispatch}
        />
      )}

      {selectedEvidence && (
        <EvidenceModal 
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
          onMarkVerified={(id) => showToast(`Evidence ${id} marked verified.`)}
        />
      )}

      {/* 4. Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#000080] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-[#000080]/50 flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

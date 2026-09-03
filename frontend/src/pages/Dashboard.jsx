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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCameraId, setSelectedCameraId] = useState('CAM 04');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedIncidentForDispatch, setSelectedIncidentForDispatch] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCaptureSnapshot = (camera) => {
    showToast(`Evidence Snapshot captured from ${camera.name || camera.id} and vaulted with SHA-256 hash.`);
  };

  const handleDispatchAlert = (alertOrIncident) => {
    setSelectedIncidentForDispatch(alertOrIncident);
  };

  const handleConfirmDispatch = (incident, unitId) => {
    showToast(`Patrol Unit ${unitId} dispatched to ${incident.location || incident.camera}. Priority order transmitted.`);
  };

  return (
    <div className="min-h-screen bg-[#08101e] flex flex-col font-sans text-slate-100 antialiased select-none">
      
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
        <main className="flex-1 overflow-y-auto p-3.5 md:p-4 bg-[#08101e]">
          
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
        <div className="fixed bottom-4 right-4 z-50 bg-[#0f1d35] text-white text-xs font-semibold px-3.5 py-2 rounded shadow-xl border border-[#223b61] flex items-center space-x-2 animate-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

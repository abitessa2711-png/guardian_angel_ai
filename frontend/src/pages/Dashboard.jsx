import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import LiveMonitoringView from '../components/LiveMonitoringView';
import WomenSafetyMonitoringView from '../components/WomenSafetyMonitoringView';
import AlertsView from '../components/AlertsView';
import EvidenceView from '../components/EvidenceView';
import DatasetManagementView from '../components/DatasetManagementView';
import AITrainingEvaluationView from '../components/AITrainingEvaluationView';
import ReportsView from '../components/ReportsView';
import SettingsView from '../components/SettingsView';
import AlertDetailModal from '../components/AlertDetailModal';
import DispatchModal from '../components/DispatchModal';
import EvidenceModal from '../components/EvidenceModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
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
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans text-slate-800 antialiased select-none">
      
      {/* 1. Government Header with Tamil Nadu State Seal */}
      <Header 
        onSelectAlert={(alert) => setSelectedAlert(alert)} 
        unreadCount={5}
      />

      {/* 2. Main Workspace Layout: 9-Module Left Sidebar + Active Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Navigation Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab)} 
        />

        {/* Right Dynamic Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-5">
          
          {/* Breadcrumb Bar */}
          <div className="mb-3.5 flex items-center justify-between no-print">
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 font-medium">Women Safety Control Room</span>
              <span className="text-slate-300">/</span>
              <span className="font-bold text-slate-900 capitalize tracking-wide">
                {activeTab.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              TAMIL NADU POLICE • TRICHY WOMEN SAFETY SURVEILLANCE GRID
            </div>
          </div>

          {/* Active View Router for the 9 Main Modules */}
          {activeTab === 'dashboard' && (
            <DashboardView 
              onSelectAlert={(alert) => setSelectedAlert(alert)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onCaptureSnapshot={handleCaptureSnapshot}
            />
          )}

          {activeTab === 'live_cctv' && (
            <LiveMonitoringView 
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
          onResolve={(id) => showToast(`Incident ${id} marked legally verified and resolved.`)}
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

      {/* 4. Global Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0b1b30] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

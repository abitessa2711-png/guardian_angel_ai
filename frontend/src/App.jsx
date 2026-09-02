import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function AppContent() {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surveillance-bg flex items-center justify-center font-mono text-xs text-surveillance-accent select-none">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-surveillance-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="uppercase tracking-widest animate-pulse">CONNECTING CONTROL ROOM TERMINAL CORE...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Login />;
  }

  return (
    <WebSocketProvider>
      <Dashboard />
    </WebSocketProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

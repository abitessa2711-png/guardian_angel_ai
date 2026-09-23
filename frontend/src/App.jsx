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
      <div className="min-h-screen bg-white flex items-center justify-center font-sans text-xs text-[#000080] select-none">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#FF671F] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="uppercase tracking-widest animate-pulse font-semibold">Initializing Guardian Angel AI...</p>
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

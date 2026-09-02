import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [newAlertNotification, setNewAlertNotification] = useState(null);
  const wsRef = useRef(null);

  // Synthesize warning sirens using browser Web Audio API
  const playAlertSound = (riskScore) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (riskScore >= 75) {
        // High Risk Siren: High pitch pulsing beep
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        // Medium Risk Beep: Short low pitch alert
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn('Web Audio API not allowed or supported yet:', e);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    console.log('[WebSocket] Connecting to ws://localhost:8000/ws/alerts...');
    const ws = new WebSocket('ws://localhost:8000/ws/alerts');

    ws.onopen = () => {
      console.log('[WebSocket] Connected to Guardian Angel AI alerts socket.');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('[WebSocket] Received alert event:', payload);
        
        if (payload.type === 'NEW_ALERT') {
          const alert = payload.data;
          
          // Play buzzer audio
          playAlertSound(alert.risk_score);
          
          // Prepend new alert to alerts state
          setAlerts(prev => [alert, ...prev]);
          
          // Set active glowing banner notification
          setNewAlertNotification(alert);
          
          // Clear notification banner after 6 seconds
          setTimeout(() => {
            setNewAlertNotification(prev => prev?.id === alert.id ? null : prev);
          }, 6000);
        } else if (payload.type === 'ALERT_UPDATE') {
          const { id, status } = payload.data;
          setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
          window.dispatchEvent(new CustomEvent('surveillance-update', { detail: { type: 'ALERT', id, status } }));
        } else if (payload.type === 'INCIDENT_UPDATE') {
          const incident = payload.data;
          window.dispatchEvent(new CustomEvent('surveillance-update', { detail: { type: 'INCIDENT', incident } }));
        }
      } catch (err) {
        console.error('[WebSocket] Error processing message:', err);
      }
    };

    ws.onclose = () => {
      console.log('[WebSocket] Connection closed. Retrying in 5 seconds...');
      setConnected(false);
      setTimeout(connectWebSocket, 5000); // Auto-reconnect
    };

    ws.onerror = (err) => {
      console.error('[WebSocket] Socket error:', err);
      ws.close();
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Fetch initial alerts list from HTTP API on load
  const loadInitialAlerts = async (authHeaders) => {
    try {
      const res = await fetch('http://localhost:8000/alerts', {
        headers: authHeaders
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setAlerts(data);
      }
    } catch (err) {
      console.error('Failed to load initial alerts:', err);
    }
  };

  const updateAlertStatusInState = (alertId, newStatus) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  return (
    <WebSocketContext.Provider value={{ 
      alerts, 
      setAlerts, 
      connected, 
      newAlertNotification, 
      setNewAlertNotification, 
      loadInitialAlerts,
      updateAlertStatusInState
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

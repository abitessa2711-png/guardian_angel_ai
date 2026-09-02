import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, Info, ShieldCheck, Flame, Building2 } from 'lucide-react';

export default function Login() {
  const { login, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPwd, setShowForgotPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Supervisor credentials cannot be blank.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Authentication rejected.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@trichypolice.gov.in');
      setPassword('Admin@123');
    } else {
      setEmail('officer@trichypolice.gov.in');
      setPassword('Officer@123');
    }
  };

  return (
    <div className="min-h-screen bg-surveillance-bg flex flex-col justify-center items-center px-4 font-mono select-none relative">
      {/* Background grid overlays */}
      <div className="absolute inset-0 surveillance-grid opacity-15 pointer-events-none"></div>
      <div className="absolute inset-0 surveillance-monitor pointer-events-none"></div>

      {/* Login Card Container */}
      <div className="bg-surveillance-panel border border-surveillance-border max-w-md w-full rounded-xl overflow-hidden shadow-2xl z-10">
        
        {/* Banner Logo & Branding */}
        <div className="bg-surveillance-header border-b border-surveillance-border p-6 text-center space-y-2.5">
          <div className="inline-flex w-14 h-14 rounded-xl border border-sky-500/40 bg-gradient-to-br from-slate-900 to-sky-950 items-center justify-center shadow-glow-cyan">
            <div className="relative flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-sky-400" />
              <Flame className="h-4 w-4 text-amber-400 absolute top-2" />
            </div>
          </div>
          <div>
            <h2 className="text-base font-black tracking-widest text-white leading-none">PYROGUARDIAN AI</h2>
            <div className="mt-1.5 inline-block bg-sky-500/20 border border-sky-500/40 text-sky-400 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">
              வருமுன் காப்போம்
            </div>
          </div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            Industrial Safety & Predictive Risk Platform (Fireworks MSME)
          </p>
        </div>

        {/* Input Fields Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {(error || authError) && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded flex items-center space-x-2 text-red-400 text-2xs">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error || authError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center space-x-1 font-bold">
              <Mail className="h-3 w-3 text-sky-400" />
              <span>SUPERVISOR EMAIL (ID)</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@trichypolice.gov.in"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 text-[10px] uppercase tracking-wider flex items-center space-x-1 font-bold">
              <Lock className="h-3 w-3 text-sky-400" />
              <span>SECURITY PASSPHRASE</span>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-sky-400 font-mono"
              required
            />
          </div>

          {/* Preset Quick Fill Controls for Testing */}
          <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-[10px] space-y-1.5">
            <span className="text-slate-500 block font-bold">QUICK LOGIN PRESETS:</span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 py-1 rounded cursor-pointer transition-all font-bold"
              >
                Safety Chief (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('officer')}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 py-1 rounded cursor-pointer transition-all font-bold"
              >
                Plant Supervisor
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2.5 rounded text-xs text-white font-black bg-sky-600 hover:bg-sky-500 transition-all shadow-glow-cyan cursor-pointer uppercase tracking-wider ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'AUTHENTICATING CONTROL CORE...' : 'CONNECT SAFETY COMMAND DESK'}
          </button>
        </form>

        {/* Security Warning Notice */}
        <div className="bg-slate-950/90 border-t border-slate-800 p-4 text-center">
          <p className="text-[9px] text-slate-500 leading-normal uppercase">
            Designed for Government & MSME Safety Operations. All telemetry and sensor triggers recorded for safety auditing.
          </p>
        </div>

      </div>

    </div>
  );
}

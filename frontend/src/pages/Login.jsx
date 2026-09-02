import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertTriangle, Info } from 'lucide-react';
import logo from '../assets/logo.jpg';

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
      setError('Operator credentials cannot be blank.');
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

  return (
    <div className="min-h-screen bg-surveillance-bg flex flex-col justify-center items-center px-4 font-mono select-none relative">
      {/* Background grids */}
      <div className="absolute inset-0 surveillance-grid opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 surveillance-monitor pointer-events-none"></div>

      {/* Login Card Container */}
      <div className="bg-surveillance-panel border border-surveillance-border max-w-md w-full rounded-lg overflow-hidden shadow-2xl z-10">
        
        {/* Banner Logo */}
        <div className="bg-surveillance-header border-b border-surveillance-border p-6 text-center space-y-2.5">
          <div className="inline-block w-16 h-16 rounded-full border border-surveillance-accent bg-white overflow-hidden p-0.5 shadow-glow-cyan">
            <img src={logo} className="w-full h-full object-cover rounded-full" alt="Guardian Angel Logo" />
          </div>
          <div>
            <h2 className="text-md font-bold tracking-widest text-white leading-none">GUARDIAN ANGEL AI</h2>
            <div className="mt-1.5 inline-block bg-surveillance-accent/20 border border-surveillance-accent/40 text-surveillance-accent px-2 py-0.5 rounded text-[10px] font-bold tracking-widest animate-pulse">வருமுன் காப்போம்</div>
          </div>
          <p className="text-3xs text-surveillance-textMuted uppercase tracking-wider">Trichy District Surveillance & Proactive AI Inspector</p>
        </div>

        {/* Input Fields Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {(error || authError) && (
            <div className="p-3 bg-surveillance-danger/10 border border-surveillance-danger/30 rounded flex items-center space-x-2 text-surveillance-danger text-2xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error || authError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-surveillance-textMuted text-3xs uppercase tracking-wider flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>OPERATOR EMAIL</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@tnpolice.gov.in"
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-surveillance-accent"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-surveillance-textMuted text-3xs uppercase tracking-wider flex items-center space-x-1">
              <Lock className="h-3 w-3" />
              <span>SECURITY PASSPHRASE</span>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surveillance-header border border-surveillance-border rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-surveillance-accent"
              required
            />
          </div>

          <div className="flex justify-between items-center text-3xs">
            <span className="text-slate-500">SESSION LENGTH: 8 HRS</span>
            <button 
              type="button" 
              onClick={() => setShowForgotPwd(true)}
              className="text-surveillance-accent hover:underline hover:text-sky-400 cursor-pointer"
            >
              FORGOT PASSWORD?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2.5 rounded text-xs text-white font-bold bg-surveillance-accent hover:bg-sky-600 transition-all shadow-glow-cyan cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'AUTHENTICATING CONTROL CORE...' : 'CONNECT SURVEILLANCE DESK'}
          </button>
        </form>

        {/* Security Warning Notice */}
        <div className="bg-surveillance-header/50 border-t border-surveillance-border/50 p-4 text-center">
          <p className="text-4xs text-slate-500 leading-normal uppercase">
            WARNING: AUTHORIZED GOVT LAW ENFORCEMENT PERSONNEL ONLY. ALL TRANSACTIONS AND SURVEILLANCE VIEWS LOGGED UNDER TRICHY CYBER POLICE IT LAW.
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotPwd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-surveillance-panel border border-surveillance-border max-w-sm w-full rounded p-6 space-y-4">
            <div className="flex items-center space-x-2 text-surveillance-accent border-b border-surveillance-border pb-2">
              <Info className="h-5 w-5" />
              <h3 className="text-xs font-bold uppercase">SECURE PASS RECOVERY</h3>
            </div>
            <p className="text-2xs text-surveillance-textMuted leading-relaxed">
              To request a password reset, please contact the **Trichy District Police IT Administration Desk** in person or submit a signed recovery ticket from your official email domain.
            </p>
            <p className="text-3xs font-mono bg-surveillance-header p-2.5 rounded border border-surveillance-border text-slate-400 select-all">
              IT HELP DESK: support@trichypolice.gov.in
            </p>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowForgotPwd(false)}
                className="bg-surveillance-accent text-white px-4 py-1.5 rounded text-xs cursor-pointer hover:bg-sky-600"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

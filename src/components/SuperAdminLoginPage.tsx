import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert,
  Sliders, 
  Sparkles,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  ArrowLeft
} from 'lucide-react';

interface SuperAdminLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToPublic: () => void;
}

export const SuperAdminLoginPage: React.FC<SuperAdminLoginPageProps> = ({
  onLogin,
  onNavigateToPublic,
}) => {
  const [email, setEmail] = useState('admin@auropro.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Super Admin authentication failed. Invalid master key or credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSuperAdminFill = () => {
    setEmail('admin@auropro.com');
    setPassword('admin');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-amber-500 selection:text-black">
      
      {/* Top Header Navigation & Controls */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30">
        <button
          onClick={onNavigateToPublic}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Public Website ( / )</span>
        </button>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
        <ThemeToggle variant="button" />
      </div>

      {/* Cyber/Executive Decorative Ambient Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-96 rounded-full bg-amber-500/10 blur-[120px]"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block cursor-pointer" onClick={onNavigateToPublic}>
          <BrandLogo size="lg" showTagline={false} lightMode={false} />
        </div>

        {/* Dedicated URL Identifier Badge */}
        <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span>URL: /super-admin</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-[10px] text-amber-300 font-sans uppercase font-extrabold tracking-wider">Restricted Gateway</span>
        </div>

        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Super Admin Directorate
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Isolated access point for central system administration, master rate caps, compliance audits, and agency empanelments.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="bg-slate-900/90 py-7 px-5 sm:px-10 shadow-2xl rounded-2xl sm:rounded-3xl border border-slate-800 backdrop-blur-md">
          
          {/* Security Alert Header */}
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="leading-snug">
              <span className="font-bold">Dedicated Administrative Portal:</span> This console is isolated from the public agency/client website. All access sessions are cryptographically logged.
            </div>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Super Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Super Admin Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@auropro.com"
                  className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Super Admin Master Password
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  E-Verify &amp; SOC2 Protected
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="handy-action-btn w-full mt-2 py-3 px-4 min-h-[46px] rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Authorizing Super Admin...</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4 text-slate-950" />
                  <span>Unlock Super Admin Command Center</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Quick Pre-Set for Convenient Testing */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                1-Click Super Admin Authorization
              </span>
              <span className="text-[10px] text-amber-400 font-bold">Auto-fills credentials</span>
            </div>

            <button
              type="button"
              onClick={handleQuickSuperAdminFill}
              className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800/80 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Super Admin Profile (Julian Sterling)
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    admin@auropro.com &bull; Root Governance
                  </div>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Return to Public Portal */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onNavigateToPublic}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Looking for Agency or Client sign in?</span>
              <span className="text-amber-400 font-bold hover:underline">Go to Public Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer System Disclaimer */}
      <div className="mt-8 text-center text-[11px] text-slate-500 font-mono">
        AuroPro Governance Directorate &bull; Dedicated URL Route: <code className="text-amber-400">/super-admin</code>
      </div>
    </div>
  );
};

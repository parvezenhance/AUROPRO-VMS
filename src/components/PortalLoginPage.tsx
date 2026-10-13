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
  Sliders, 
  Users, 
  Building2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface PortalLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegistration: (tab?: 'agency' | 'client') => void;
}

export const PortalLoginPage: React.FC<PortalLoginPageProps> = ({
  onLogin,
  onNavigateToRegistration,
}) => {
  const [email, setEmail] = useState('agency@apexstaffing.com');
  const [password, setPassword] = useState('agency');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-orange-500 selection:text-white transition-colors">
      
      {/* Top Header Day/Dark Mode Control */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
        <ThemeToggle variant="button" />
      </div>

      {/* Background Decorative Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-400/10 dark:bg-orange-500/5 blur-3xl"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-400/10 dark:bg-emerald-500/5 blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-block cursor-pointer">
          <BrandLogo size="lg" showTagline={true} />
        </div>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Enterprise Portal Sign In
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
          Secure centralized access for Empanelled Vendors and Corporate Clients.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-3 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-6 sm:py-8 px-4 sm:px-10 shadow-xl rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm transition-colors">
          
          {/* Error Notice */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Secure Password
                </label>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  E-Verify Encrypted
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 transition-all min-h-[44px]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 min-h-[46px] rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Persona Pre-Sets (Vendors and Clients Only) */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
              <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                Select Persona (1-Click Test Access)
              </span>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">Auto-fills credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vendor Card */}
              <button
                type="button"
                onClick={() => handleQuickSelect('agency@apexstaffing.com', 'agency')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[52px] ${
                  email === 'agency@apexstaffing.com'
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  {email === 'agency@apexstaffing.com' && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white">Vendor</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Elena Rostova</div>
                <div className="text-[9px] font-mono text-blue-700 dark:text-blue-400 mt-1 font-semibold">Apex Tech Talent</div>
              </button>

              {/* Client Card */}
              <button
                type="button"
                onClick={() => handleQuickSelect('client@nexustech.com', 'client')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer min-h-[52px] ${
                  email === 'client@nexustech.com'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {email === 'client@nexustech.com' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div className="mt-2 font-bold text-xs text-slate-900 dark:text-white">Client</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">David K. Vance</div>
                <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 mt-1 font-semibold">Nexus Cloud Systems</div>
              </button>
            </div>
          </div>

          {/* Registration Gateway Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  New vendor supplier or corporate client?
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Join the AuroPro vetted contingent staffing network
                </div>
              </div>

              {/* Direct links to Register Vendor or Client */}
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  id="login-register-agency-btn"
                  onClick={() => onNavigateToRegistration('agency')}
                  className="flex-1 sm:flex-initial px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Empanel Vendor"
                >
                  <Users className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                  <span>Register Vendor</span>
                </button>

                <button
                  type="button"
                  id="login-register-client-btn"
                  onClick={() => onNavigateToRegistration('client')}
                  className="flex-1 sm:flex-initial px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Enroll Client"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Register Client</span>
                </button>
              </div>
            </div>

            {/* Direct Gateway Link */}
            <div className="mt-4 text-center">
              <button
                type="button"
                id="login-registration-gateway-full-link"
                onClick={() => onNavigateToRegistration()}
                className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Or explore the full Registration Gateway &amp; Requirements</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Statutory Trust Bar & Discreet Super Admin Access */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              SOC 2 Type II
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span>E-Verify Authorized</span>
            <span className="hidden sm:inline">&bull;</span>
            <span>SIA Certified</span>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            <span>Super Admin Portal: </span>
            <a 
              href="/super-admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/super-admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-bold"
            >
              /super-admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

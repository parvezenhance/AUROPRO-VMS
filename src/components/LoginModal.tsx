import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { X, Lock, Mail, AlertCircle, Loader2, ArrowRight, ShieldCheck, Sliders, Users, Building2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onNavigateToRegistration?: (tab?: 'agency' | 'client') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onNavigateToRegistration 
}) => {
  const [email, setEmail] = useState('agency@apexstaffing.com');
  const [password, setPassword] = useState('agency');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onLogin(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto text-slate-800 dark:text-slate-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <BrandLogo size="sm" showTagline={true} />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-4">Platform Authentication</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Sign in as Empanelled Vendor or Corporate Client.
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@auropro.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[10px] text-orange-600 dark:text-orange-400 font-mono font-bold">SHA-256 Auth</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to AuroPro</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Persona Demo Selector */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-2.5">
            Quick Persona Pre-Sets (1-Click Test)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickSelect('agency@apexstaffing.com', 'agency')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                email === 'agency@apexstaffing.com'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-950 dark:text-blue-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Vendor</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Apex Tech Talent</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickSelect('client@nexustech.com', 'client')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                email === 'client@nexustech.com'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Client</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Nexus Cloud</p>
            </button>
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Super Admin Portal URL: <span className="text-amber-600 dark:text-amber-400 font-bold">/super-admin</span>
          </div>

          {/* Registration Gateway Link */}
          {onNavigateToRegistration && (
            <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Need to empanel a supplier or post requisitions?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToRegistration();
                  }}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Register Agency or Client Account</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

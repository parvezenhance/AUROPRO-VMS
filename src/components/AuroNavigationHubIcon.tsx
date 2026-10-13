import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Shield, 
  Users, 
  Building2, 
  Briefcase, 
  Compass, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  Sliders, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { UserSession } from '../types.ts';

interface AuroNavigationHubIconProps {
  activeView: string;
  onNavigate: (viewName: string, param?: string) => void;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickLoginAsAdmin: () => void;
}

export const AuroNavigationHubIcon: React.FC<AuroNavigationHubIconProps> = ({
  activeView,
  onNavigate,
  currentUser,
  onOpenLogin,
  onLogout,
  onQuickLoginAsAdmin,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const allHeaderPages = [
    ...(currentUser?.role === 'ADMIN' ? [{
      id: 'admin_controls',
      name: 'Super Admin Dashboard',
      subtitle: 'Vendor governance, client accounts, requisitions, rate cards & audits',
      icon: Sliders,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Super Admin',
    }] : []),
    ...(currentUser?.role === 'AGENCY' ? [{
      id: 'agency_dashboard',
      name: 'Vendor Dashboard',
      subtitle: 'Matching job requisitions, candidate submittals, and compliance standing',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Vendor Portal',
    }] : []),
    ...(currentUser?.role === 'CLIENT' ? [{
      id: 'client_dashboard',
      name: 'Client Dashboard',
      subtitle: 'Active job orders, dispatch new requisitions, assigned vendors & SLA metrics',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: 'Client Portal',
    }] : []),
    {
      id: 'divisions',
      name: 'Staffing Sector Divisions',
      subtitle: 'IT, Healthcare, Engineering, BFSI, Logistics & Executive specialty pages',
      icon: Layers,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badge: '6 Divisions',
    },
    {
      id: 'agencies',
      name: 'Empanelled Vendors Directory',
      subtitle: 'Searchable roster of vetted staffing vendors with compliance & bench metrics',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Real-time',
    },
    {
      id: 'requisitions',
      name: 'Client Job Orders & Requisitions',
      subtitle: 'Live contingent talent requirements, hourly bill rates & SLA fulfillment',
      icon: Briefcase,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Contingent',
    },
    {
      id: 'workflow',
      name: 'Empanelment Workflow & SLAs',
      subtitle: '4-stage statutory accreditation roadmap, E&O audits & compliance guidelines',
      icon: Compass,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      badge: 'Governance',
    },
    {
      id: 'registration',
      name: 'Vendor & Client Registration',
      subtitle: 'Onboarding gateway for staffing vendors & corporate clients',
      icon: UserCheck,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      badge: 'Onboarding',
    },
  ];

  const headerPages = allHeaderPages;

  const handleSelectPage = (pageId: string) => {
    onNavigate(pageId);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* The Central Navigation Hub Icon Button */}
      <button
        id="auropro-header-pages-icon-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="AuroPro Header Pages Navigation Icon"
        className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 shadow-md border ${
          isOpen
            ? 'bg-slate-900 text-white border-slate-800 shadow-slate-900/20 ring-2 ring-orange-500'
            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-orange-400 hover:shadow-orange-500/10'
        }`}
      >
        {/* Emblem Tri-Color Icon */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 via-blue-600 to-emerald-500 p-0.5 shadow-sm">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[6px] flex items-center justify-center">
            {isOpen ? (
              <X className="w-4 h-4 text-slate-900 dark:text-white" />
            ) : (
              <Menu className="w-4 h-4 text-slate-900 dark:text-white group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>

        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
              Header Pages
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
            Icon Navigation
          </p>
        </div>

        {/* Pulse indicator */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
        </span>
      </button>

      {/* Drawer / Popover Menu containing all Header Pages */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal / Menu Panel */}
          <div 
            id="auropro-header-pages-menu-panel"
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 mt-2 sm:w-[420px] max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
          >
            {/* Header in Menu */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" showTagline={false} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                  Header Directory
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Active User Status */}
            <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {currentUser ? currentUser.name.charAt(0) : 'G'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">
                    {currentUser ? currentUser.name : 'Guest Visitor'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentUser ? currentUser.roleTitle : 'Explore all pages or sign in'}
                  </div>
                </div>
              </div>
              {currentUser ? (
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onOpenLogin();
                    setIsOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Header Pages List */}
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1 mb-2">
              Header Pages
            </div>

            <div className="space-y-1.5">
              {headerPages.map((page) => {
                const Icon = page.icon;
                const isActive = activeView === page.id;

                return (
                  <button
                    key={page.id}
                    id={`nav-header-page-${page.id}`}
                    onClick={() => handleSelectPage(page.id)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-3 group ${
                      isActive
                        ? 'bg-orange-50/70 dark:bg-orange-950/40 border-orange-300 dark:border-orange-700 shadow-xs ring-1 ring-orange-400'
                        : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 border-slate-100 dark:border-slate-700/80 hover:border-slate-200 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border shrink-0 ${page.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-orange-950 dark:text-orange-300' : 'text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400'}`}>
                          {page.name}
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                          {page.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {page.subtitle}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-orange-500 transition-transform group-hover:translate-x-0.5 shrink-0 mt-2 ${isActive ? 'text-orange-500' : ''}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Link to Staffing Divisions */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>AuroPro Staffing Network</span>
              <button
                onClick={() => handleSelectPage('divisions')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View 6 Divisions <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

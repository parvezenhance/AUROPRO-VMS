import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { UserSession, SectorId } from '../types.ts';
import { 
  Shield, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  Layers, 
  FileText, 
  Activity, 
  Menu, 
  X,
  Building2,
  Users,
  Briefcase,
  Sliders,
  Server,
  HeartPulse,
  Cog,
  ShieldCheck,
  Award,
  LayoutDashboard,
  Mail
} from 'lucide-react';

interface NavbarProps {
  user: UserSession | null;
  activeView: string;
  activeSector: SectorId | 'all';
  assignedSectorId?: SectorId;
  onNavigate: (view: string, param?: string) => void;
  onSelectSector: (sectorId: SectorId | 'all') => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onSwitchRole: (email: string) => void;
  isRealtimeActive?: boolean;
  onToggleRealtime?: () => void;
  onQuickLoginAsAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeView,
  activeSector,
  assignedSectorId,
  onNavigate,
  onSelectSector,
  onOpenLogin,
  onLogout,
  onSwitchRole,
  isRealtimeActive,
  onToggleRealtime,
  onQuickLoginAsAdmin,
}) => {
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPartnerOrClient = Boolean(user && (user.role === 'AGENCY' || user.role === 'CLIENT'));
  const effectiveAssignedSector: SectorId = assignedSectorId || user?.assignedSector || 'it_cloud';

  const sectorLabels: Record<SectorId, { label: string; icon: any; color: string }> = {
    it_cloud: { label: 'IT & Cloud Staffing', icon: Server, color: 'text-blue-600' },
    healthcare: { label: 'Healthcare & Nursing', icon: HeartPulse, color: 'text-emerald-600' },
    engineering: { label: 'Engineering & Industrial', icon: Cog, color: 'text-orange-600' },
    bfsi_finance: { label: 'BFSI & Finance Staffing', icon: ShieldCheck, color: 'text-emerald-600' },
    logistics_ops: { label: 'Supply Chain & Logistics', icon: Building2, color: 'text-amber-600' },
    executive_prof: { label: 'Executive & Professional', icon: Award, color: 'text-orange-600' },
  };

  const getRoleBadge = () => {
    if (!user) return null;
    if (user.role === 'ADMIN') {
      return {
        text: 'Super Admin',
        sub: 'Root Governance Directorate',
        cls: 'bg-amber-50 text-amber-900 border-amber-200',
        icon: Sliders,
      };
    }
    if (user.role === 'AGENCY') {
      return {
        text: 'Empanelled Vendor',
        sub: 'Apex Tech Talent',
        cls: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: Users,
      };
    }
    return {
      text: 'Client',
      sub: 'Nexus Cloud Systems',
      cls: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Building2,
    };
  };

  const roleInfo = getRoleBadge();

  // User-based Dashboard Routing
  const getUserDashboardView = () => {
    if (!user) return 'login';
    if (user.role === 'ADMIN') return 'admin_controls';
    if (user.role === 'AGENCY') return 'agency_dashboard';
    if (user.role === 'CLIENT') return 'client_dashboard';
    return 'divisions';
  };

  const userDashboardView = getUserDashboardView();
  const isDashboardActive = activeView === userDashboardView ||
    (activeView === 'admin_controls' && user?.role === 'ADMIN') ||
    (activeView === 'agency_dashboard' && user?.role === 'AGENCY') ||
    (activeView === 'client_dashboard' && user?.role === 'CLIENT') ||
    (activeView === 'login' && !user);

  const getDashboardMeta = () => {
    if (!user) {
      return {
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null,
        activeClass: 'bg-slate-800 text-white shadow-2xs',
      };
    }
    if (user.role === 'ADMIN') {
      return {
        label: 'Super Admin Dashboard',
        icon: Sliders,
        badge: { text: 'Super Admin', cls: 'bg-amber-100 text-amber-900 border-amber-200' },
        activeClass: 'bg-amber-600 text-white shadow-2xs',
      };
    }
    if (user.role === 'AGENCY') {
      return {
        label: 'Vendor Dashboard',
        icon: Users,
        badge: { text: 'Vendor', cls: 'bg-blue-100 text-blue-800 border-blue-200' },
        activeClass: 'bg-blue-600 text-white shadow-2xs',
      };
    }
    return {
      label: 'Client Dashboard',
      icon: Building2,
      badge: { text: 'Client', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      activeClass: 'bg-emerald-600 text-white shadow-2xs',
    };
  };

  const dashboardMeta = getDashboardMeta();
  const DashboardIcon = dashboardMeta.icon;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => onNavigate('divisions', 'all')}
          className="text-left cursor-pointer hover:opacity-95 transition-opacity"
        >
          <BrandLogo size="sm" showTagline={true} />
        </div>

        {/* Center Navigation Links (Header Pages) - Hidden on Registration Page */}
        {activeView !== 'registration' && (
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          
          {/* User-Based Dashboard Nav Button */}
          <button
            onClick={() => onNavigate(userDashboardView)}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              isDashboardActive
                ? dashboardMeta.activeClass
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700/70'
            }`}
          >
            <DashboardIcon className="w-3.5 h-3.5" />
            <span>{dashboardMeta.label}</span>
            {dashboardMeta.badge && (
              <span className={`text-[9px] uppercase px-1 rounded border font-semibold ${dashboardMeta.badge.cls}`}>
                {dashboardMeta.badge.text}
              </span>
            )}
          </button>

          {/* Sectors Dropdown button / Overview: Assigned division only for partner/client */}
          {isPartnerOrClient ? (
            <button
              onClick={() => {
                onSelectSector(effectiveAssignedSector);
                onNavigate('divisions', effectiveAssignedSector);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeView === 'divisions' && (activeSector === effectiveAssignedSector || activeSector === 'all')
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
              title={`Assigned Staffing Division: ${sectorLabels[effectiveAssignedSector]?.label || 'Division'}`}
            >
              {(() => {
                const ItemIcon = sectorLabels[effectiveAssignedSector]?.icon || Layers;
                return <ItemIcon className="w-3.5 h-3.5" />;
              })()}
              <span>{sectorLabels[effectiveAssignedSector]?.label || 'Assigned Division'}</span>
              <span className="text-[9px] uppercase px-1 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                Assigned
              </span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsSectorDropdownOpen(!isSectorDropdownOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeView === 'divisions'
                    ? 'bg-slate-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {activeSector === 'all' ? 'Staffing Divisions' : sectorLabels[activeSector]?.label || 'Divisions'}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {isSectorDropdownOpen && (
                <div 
                  className="absolute top-full mt-2 left-0 w-68 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsSectorDropdownOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Staffing Specialization Divisions
                  </div>
                  <button
                    onClick={() => {
                      onSelectSector('all');
                      onNavigate('divisions', 'all');
                      setIsSectorDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span>All 6 Staffing Divisions</span>
                  </button>
                  {(Object.keys(sectorLabels) as SectorId[]).map(sId => {
                    const item = sectorLabels[sId];
                    const Icon = item.icon;
                    return (
                      <button
                        key={sId}
                        onClick={() => {
                          onSelectSector(sId);
                          onNavigate('divisions', sId);
                          setIsSectorDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg font-medium transition-all text-left ${
                          activeSector === sId && activeView === 'divisions'
                            ? 'bg-orange-50 text-orange-800 font-bold' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Vendor Directory: Hidden for Empanelled Vendor Partner */}
          {user?.role !== 'AGENCY' && (
            <button
              onClick={() => onNavigate('agencies')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeView === 'agencies'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              Vendor Directory
            </button>
          )}

          <button
            onClick={() => onNavigate('requisitions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeView === 'requisitions'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Client Requisitions
          </button>
        </nav>
        )}

        {/* Right actions: Day/Dark Mode & User Profile */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Day / Dark Mode Toggle Button */}
          <ThemeToggle variant="button" />

          {/* Logged user badge and account details */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer ${roleInfo?.cls}`}
                title="View Logged-In User Details"
              >
                <div className="relative flex items-center justify-center">
                  {roleInfo && <roleInfo.icon className="w-4 h-4" />}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div className="text-left hidden md:block">
                  <div className="leading-tight text-slate-900 font-bold">{user.name}</div>
                  <div className="text-[10px] font-medium opacity-85 text-slate-600">{roleInfo?.text}</div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform duration-150 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleDropdownOpen && (
                <div 
                  className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsRoleDropdownOpen(false)}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Active User Profile
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Session
                    </span>
                  </div>

                  {/* Logged user details only */}
                  <div className="pt-3 pb-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-extrabold text-slate-900 truncate">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata & permissions */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Assigned Role:</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${roleInfo?.cls}`}>
                          {roleInfo?.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Organization:</span>
                        <span className="font-bold text-slate-800 text-[11px] text-right truncate max-w-[150px]">
                          {roleInfo?.sub}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">Assigned Division:</span>
                        <span className="font-semibold text-slate-700 text-[11px]">
                          {sectorLabels[effectiveAssignedSector]?.label || 'General Operations'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 text-[10px]">User Account ID:</span>
                        <span className="text-[10px] font-mono text-slate-600 truncate max-w-[150px]">{user.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for current user */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onNavigate(userDashboardView);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                    >
                      <span>Open My Workspace</span>
                      <LayoutDashboard className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-bold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu button & Theme toggle */}
        <div className="flex sm:hidden items-center gap-1.5">
          {/* Mobile Theme Toggle */}
          <ThemeToggle variant="pill" showLabel={false} />

          {activeView !== 'registration' ? (
            <>
              {user && (
                <button
                  onClick={() => onNavigate(userDashboardView)}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 shrink-0 min-h-[38px] flex items-center justify-center cursor-pointer"
                  title="Open Dashboard"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 min-w-[40px] min-h-[40px] rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            !user && (
              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 min-h-[38px] rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center cursor-pointer"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {activeView !== 'registration' && mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 px-1">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Appearance</span>
            <ThemeToggle variant="pill" showLabel={false} />
          </div>
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1 pt-1">
            Navigation Menu
          </div>
          <button
            onClick={() => {
              onNavigate(userDashboardView);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              isDashboardActive ? 'bg-blue-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DashboardIcon className="w-4 h-4 shrink-0" />
              <span>{dashboardMeta.label}</span>
            </div>
            {dashboardMeta.badge && (
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border bg-white/20 font-semibold">
                {dashboardMeta.badge.text}
              </span>
            )}
          </button>
          {isPartnerOrClient ? (
            <button
              onClick={() => {
                onSelectSector(effectiveAssignedSector);
                onNavigate('divisions', effectiveAssignedSector);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                activeView === 'divisions' ? 'bg-slate-800 text-white dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {(() => {
                  const ItemIcon = sectorLabels[effectiveAssignedSector]?.icon || Layers;
                  return <ItemIcon className="w-4 h-4 shrink-0" />;
                })()}
                <span>{sectorLabels[effectiveAssignedSector]?.label || 'Assigned Division'}</span>
              </div>
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700 font-semibold">
                Assigned
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                onSelectSector('all');
                onNavigate('divisions', 'all');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                activeView === 'divisions' ? 'bg-slate-800 text-white dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>Staffing Divisions</span>
            </button>
          )}

          {user?.role !== 'AGENCY' && (
            <button
              onClick={() => {
                onNavigate('agencies');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                activeView === 'agencies' ? 'bg-slate-800 text-white dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Vendor Directory</span>
            </button>
          )}

          <button
            onClick={() => {
              onNavigate('requisitions');
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              activeView === 'requisitions' ? 'bg-slate-800 text-white dark:bg-slate-800' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>Client Requisitions</span>
          </button>

          {user ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs px-2">
              <span className="text-slate-500 dark:text-slate-400">
                Logged in as <strong className="text-slate-800 dark:text-white font-bold">{user.name}</strong>
              </span>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 dark:text-red-400 font-bold hover:underline min-h-[40px] px-2 flex items-center cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 px-1">
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 min-h-[44px] text-center text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                Sign In to Portal
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

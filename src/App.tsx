import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  UserSession, 
  SectorDetail, 
  Agency, 
  ClientProfile,
  StaffingRequisition,
  RealtimeStats, 
  SectorId 
} from './types.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { RegistrationLandingPage } from './components/RegistrationLandingPage.tsx';
import { AdminControlCenter } from './components/AdminControlCenter.tsx';
import { SectorDivisionView } from './components/SectorDivisionView.tsx';
import { AgencyDirectoryView } from './components/AgencyDirectoryView.tsx';
import { ClientRequisitionsView } from './components/ClientRequisitionsView.tsx';
import { EmpanelmentWorkflow } from './components/EmpanelmentWorkflow.tsx';
import { AgencyDetailModal } from './components/AgencyDetailModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { PortalLoginPage } from './components/PortalLoginPage.tsx';
import { AgencyDashboard } from './components/AgencyDashboard.tsx';
import { ClientDashboard } from './components/ClientDashboard.tsx';
import { SuperAdminLoginPage } from './components/SuperAdminLoginPage.tsx';
import { ShieldCheck, Lock, ExternalLink, RefreshCw, Heart, CheckCircle2 } from 'lucide-react';

export default function App() {
  const isSuperAdminPath = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path.startsWith('/super-admin') ||
      path.startsWith('/superadmin') ||
      path === '/admin' ||
      hash.includes('super-admin') ||
      search.includes('super-admin') ||
      search.includes('portal=super-admin')
    );
  }, []);

  // Navigation State: 'login' is default landing page if not authenticated
  const [user, setUser] = useState<UserSession | null>(() => api.getStoredSession());
  const [activeView, setActiveView] = useState<string>(() => {
    const session = api.getStoredSession();
    const isSuper = typeof window !== 'undefined' && (
      window.location.pathname.toLowerCase().startsWith('/super-admin') ||
      window.location.pathname.toLowerCase().startsWith('/superadmin') ||
      window.location.pathname.toLowerCase() === '/admin' ||
      window.location.hash.toLowerCase().includes('super-admin') ||
      window.location.search.toLowerCase().includes('super-admin') ||
      window.location.search.toLowerCase().includes('portal=super-admin')
    );
    if (isSuper) {
      if (session && session.role === 'ADMIN') return 'admin_controls';
      return 'super_admin_login';
    }
    if (!session) return 'login';
    if (session.role === 'ADMIN') return 'admin_controls';
    if (session.role === 'AGENCY') return 'agency_dashboard';
    if (session.role === 'CLIENT') return 'client_dashboard';
    return 'divisions';
  });
  const [activeSector, setActiveSector] = useState<SectorId | 'all'>('all');
  const [registrationInitialTab, setRegistrationInitialTab] = useState<'agency' | 'client'>('agency');

  // Core Data States
  const [sectors, setSectors] = useState<SectorDetail[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [requisitions, setRequisitions] = useState<StaffingRequisition[]>([]);
  const [stats, setStats] = useState<RealtimeStats | null>(null);

  // Selected Agency for Detail / Audit Dossier
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Live polling state
  const [isRealtimeActive, setIsRealtimeActive] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch all initial data from server
  const loadData = useCallback(async () => {
    try {
      const [sectorsData, agenciesData, clientsData, requisitionsData, statsData] = await Promise.all([
        api.getSectors(),
        api.getAgencies(),
        api.getClients(),
        api.getRequisitions(),
        api.getRealtimeStats(),
      ]);
      setSectors(sectorsData);
      setAgencies(agenciesData);
      setClients(clientsData);
      setRequisitions(requisitionsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load initial data from AuroPro API:', err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time polling stream (every 6 seconds when active)
  useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(async () => {
      try {
        const [latestStats, latestAgencies, latestRequisitions] = await Promise.all([
          api.getRealtimeStats(),
          api.getAgencies(),
          api.getRequisitions(),
        ]);
        setStats(latestStats);
        setAgencies(latestAgencies);
        setRequisitions(latestRequisitions);
      } catch (err) {
        console.warn('Real-time sync poll failed:', err);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isRealtimeActive]);

  // Popstate listener to support direct URL changes (e.g. /super-admin vs /)
  useEffect(() => {
    const handlePopState = () => {
      const isSuper = isSuperAdminPath();
      const session = api.getStoredSession();
      if (isSuper) {
        if (session && session.role === 'ADMIN') {
          setActiveView('admin_controls');
        } else {
          setActiveView('super_admin_login');
        }
      } else {
        if (activeView === 'super_admin_login') {
          setActiveView('login');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isSuperAdminPath, activeView]);

  // Navigation handler enforcing role-based views and sector access
  const isRestrictedPartnerOrClient = Boolean(user && (user.role === 'AGENCY' || user.role === 'CLIENT'));
  const assignedSectorId: SectorId = useMemo(() => {
    if (user?.assignedSector) return user.assignedSector;
    if (user?.role === 'AGENCY') {
      const matched = agencies.find(a => a.id === user.agencyId) || agencies.find(a => a.contactPerson.email === user.email);
      return matched?.sectorId || 'it_cloud';
    }
    if (user?.role === 'CLIENT') {
      const matched = clients.find(c => c.id === user.clientId) || clients.find(c => c.contactPerson.email === user.email);
      return matched?.sectorId || 'it_cloud';
    }
    return 'it_cloud';
  }, [user, agencies, clients]);

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'super_admin') {
      if (window.location.pathname !== '/super-admin') {
        window.history.pushState(null, '', '/super-admin');
      }
      if (user?.role === 'ADMIN') {
        setActiveView('admin_controls');
      } else {
        setActiveView('super_admin_login');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Reset URL to / if navigating away from super admin URL
    if (window.location.pathname.startsWith('/super-admin') || window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }

    if (view === 'dashboard') {
      if (!user) setActiveView('login');
      else if (user.role === 'ADMIN') setActiveView('admin_controls');
      else if (user.role === 'AGENCY') setActiveView('agency_dashboard');
      else if (user.role === 'CLIENT') setActiveView('client_dashboard');
      else setActiveView('divisions');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'agencies' && user?.role === 'AGENCY') {
      setActiveView('agency_dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'registration') {
      if (isRestrictedPartnerOrClient) {
        setActiveView(user?.role === 'AGENCY' ? 'agency_dashboard' : 'client_dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (param === 'client' || param === 'agency') {
        setRegistrationInitialTab(param);
      }
    }
    setActiveView(view);
    if (view === 'divisions') {
      if (isRestrictedPartnerOrClient) {
        setActiveSector(assignedSectorId);
      } else if (param) {
        setActiveSector(param as SectorId | 'all');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.session);
    setIsLoginOpen(false);
    if (res.session.role === 'ADMIN') {
      if (window.location.pathname !== '/super-admin') {
        window.history.pushState(null, '', '/super-admin');
      }
      setActiveView('admin_controls');
    } else if (res.session.role === 'AGENCY') {
      if (window.location.pathname.startsWith('/super-admin')) {
        window.history.pushState(null, '', '/');
      }
      setActiveView('agency_dashboard');
    } else if (res.session.role === 'CLIENT') {
      if (window.location.pathname.startsWith('/super-admin')) {
        window.history.pushState(null, '', '/');
      }
      setActiveView('client_dashboard');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    if (window.location.pathname.startsWith('/super-admin') || window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
    setActiveView('login');
  };

  const handleQuickLoginAsAdmin = async () => {
    await handleLogin('admin@auropro.com', 'admin');
  };

  const handleSwitchRole = async (email: string) => {
    const passMap: Record<string, string> = {
      'admin@auropro.com': 'admin',
      'agency@apexstaffing.com': 'agency',
      'client@nexustech.com': 'client',
    };
    const pass = passMap[email] || 'password';
    await handleLogin(email, pass);
  };

  // Create Requisition (Client Dashboard)
  const handleCreateRequisition = async (reqData: Partial<StaffingRequisition>) => {
    await api.createRequisition(reqData);
    const [updatedReqs, updatedStats] = await Promise.all([
      api.getRequisitions(),
      api.getRealtimeStats(),
    ]);
    setRequisitions(updatedReqs);
    setStats(updatedStats);
  };

  // Agency Status Update (Admin Controls)
  const handleAgencyStatusUpdate = async (
    agencyId: string, 
    status: string, 
    remarks: string, 
    tier?: string
  ) => {
    await api.updateAgencyStatus(agencyId, { status, remarks, tier });
    const [updatedAgencies, updatedStats] = await Promise.all([
      api.getAgencies(),
      api.getRealtimeStats(),
    ]);
    setAgencies(updatedAgencies);
    setStats(updatedStats);
    const refreshed = updatedAgencies.find(a => a.id === agencyId);
    if (refreshed) setSelectedAgency(refreshed);
  };

  const currentSectorData = isRestrictedPartnerOrClient
    ? (sectors.find(s => s.id === assignedSectorId) || sectors[0])
    : (activeSector !== 'all' ? (sectors.find(s => s.id === activeSector) || sectors[0]) : sectors[0]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] dark:bg-slate-950 flex flex-col items-center justify-center space-y-4 text-slate-800 dark:text-slate-100 transition-colors">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">AUROPRO</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Designed for Vendors &amp; Clients &bull; Loading Governance Engine...</p>
        </div>
      </div>
    );
  }

  // DEDICATED SUPER ADMIN GATEWAY: Triggered when accessing /super-admin URL
  if (activeView === 'super_admin_login' || (isSuperAdminPath() && (!user || user.role !== 'ADMIN'))) {
    return (
      <SuperAdminLoginPage
        onLogin={async (email, pass) => {
          await handleLogin(email, pass);
          if (window.location.pathname !== '/super-admin') {
            window.history.pushState(null, '', '/super-admin');
          }
          setActiveView('admin_controls');
        }}
        onNavigateToPublic={() => {
          window.history.pushState(null, '', '/');
          setActiveView('login');
        }}
      />
    );
  }

  // FIRST PAGE UPON VISITING: Dedicated Portal Login Page (if not authenticated and not in registration)
  if (!user && activeView !== 'registration') {
    return (
      <div className="min-h-screen bg-[#fafaf8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors">
        <PortalLoginPage
          onLogin={handleLogin}
          onNavigateToRegistration={() => setActiveView('registration')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors">
      
      {/* Top Platform Navigation Bar */}
      <Navbar
        user={user}
        activeView={activeView}
        activeSector={activeSector}
        assignedSectorId={assignedSectorId}
        onNavigate={handleNavigate}
        onSelectSector={setActiveSector}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        isRealtimeActive={isRealtimeActive}
        onToggleRealtime={() => setIsRealtimeActive(!isRealtimeActive)}
        onQuickLoginAsAdmin={handleQuickLoginAsAdmin}
      />

      {/* Main Content Body */}
      <main className="flex-1">

        {/* VIEW 0: PORTAL LOGIN (When switching to login view) */}
        {activeView === 'login' && (
          <PortalLoginPage
            onLogin={handleLogin}
            onNavigateToRegistration={(tab) => {
              if (tab) setRegistrationInitialTab(tab);
              setActiveView('registration');
            }}
          />
        )}

        {/* VIEW 1: REGISTRATION LANDING PAGE (HEADERLESS with Navigation Hub Icon) */}
        {activeView === 'registration' && (
          <RegistrationLandingPage
            sectors={sectors}
            activeView={activeView}
            initialTab={registrationInitialTab}
            currentUser={user}
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
            onLogout={handleLogout}
            onQuickLoginAsAdmin={handleQuickLoginAsAdmin}
            onRegistrationComplete={() => {
              loadData();
              setActiveView('admin_controls');
            }}
          />
        )}

        {/* ROLE VIEW: SUPER ADMIN CONTROL CENTER (Admin role) */}
        {activeView === 'admin_controls' && (
          <div>
            <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-amber-400 font-bold">Dedicated Route: /super-admin</span>
                <span className="text-slate-400 hidden sm:inline">&bull; Super Admin Directorate</span>
              </div>
              <button
                onClick={() => {
                  window.history.pushState(null, '', '/');
                  setActiveView('divisions');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-[11px] transition-colors cursor-pointer"
              >
                Exit to Public Portal ( / )
              </button>
            </div>
            <AdminControlCenter
              agencies={agencies}
              clients={clients}
              requisitions={requisitions}
              sectors={sectors}
              stats={stats}
              currentUser={user}
              onRefreshData={loadData}
              onSelectAgency={setSelectedAgency}
            />
          </div>
        )}

        {/* ROLE VIEW: AGENCY PARTNER DASHBOARD (Agency role) */}
        {activeView === 'agency_dashboard' && user && (
          <AgencyDashboard
            currentUser={user}
            agencies={agencies}
            requisitions={requisitions}
            sectors={sectors}
            onNavigate={handleNavigate}
          />
        )}

        {/* ROLE VIEW: CLIENT DASHBOARD (Client role) */}
        {activeView === 'client_dashboard' && user && (
          <ClientDashboard
            currentUser={user}
            clients={clients}
            requisitions={requisitions}
            agencies={agencies}
            sectors={sectors}
            onNavigate={handleNavigate}
            onCreateRequisition={handleCreateRequisition}
          />
        )}

        {/* VIEW 3: STAFFING SECTOR DIVISIONS */}
        {activeView === 'divisions' && (
          <div>
            {activeSector === 'all' && !isRestrictedPartnerOrClient ? (
              /* All 6 divisions overview (For Admins and Public) */
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                      Staffing Specialization
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
                      Staffing Divisions Across 6 Regulated Sectors
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Explore vetting standards, rate card ceilings, active requisitions, and empanelled agencies.
                    </p>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => setActiveView('admin_controls')}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs self-start sm:self-auto cursor-pointer"
                    >
                      Admin Dashboard
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {sectors.map((sec) => (
                    <div
                      key={sec.id}
                      className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-44">
                        <img
                          src={sec.stockImageUrl}
                          alt={sec.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${sec.colorTheme.badge}`}>
                            {sec.code}
                          </span>
                          <h3 className="font-extrabold text-white text-base mt-1 leading-snug">
                            {sec.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-4">
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {sec.description}
                        </p>

                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-semibold">Empanelled</span>
                            <span className="font-extrabold text-slate-900 dark:text-white">{sec.kpis.empanelledCount}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-semibold">Avg Vetting</span>
                            <span className="font-extrabold text-blue-600 dark:text-blue-400">{sec.kpis.avgVettingDays}d</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-400 block font-semibold">Volume</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{sec.kpis.annualPlacementVolume}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveSector(sec.id);
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors cursor-pointer"
                        >
                          Explore {sec.shortName} Division
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentSectorData ? (
              /* Specific division page (Default & only division accessible for assigned partner/client) */
              <SectorDivisionView
                sector={currentSectorData}
                agencies={agencies}
                requisitions={requisitions}
                user={user}
                onBackToOverview={() => {
                  if (isRestrictedPartnerOrClient) {
                    setActiveView(user?.role === 'AGENCY' ? 'agency_dashboard' : 'client_dashboard');
                  } else {
                    setActiveSector('all');
                  }
                }}
                onViewAgency={setSelectedAgency}
                onRegisterAgency={() => {
                  if (isRestrictedPartnerOrClient) {
                    setActiveView(user?.role === 'AGENCY' ? 'agency_dashboard' : 'client_dashboard');
                  } else {
                    setActiveView('registration');
                  }
                }}
                onNavigateToAdmin={user?.role === 'ADMIN' ? () => setActiveView('admin_controls') : undefined}
              />
            ) : null}
          </div>
        )}

        {/* VIEW 4: AGENCY DIRECTORY (Completely blocked for Empanelled Agency Partners) */}
        {activeView === 'agencies' && user?.role !== 'AGENCY' && (
          <AgencyDirectoryView
            agencies={agencies}
            sectors={sectors}
            currentUser={user}
            onSelectAgency={setSelectedAgency}
            onNavigateToAdmin={() => setActiveView('admin_controls')}
            onNavigateBack={() => setActiveView('registration')}
          />
        )}

        {/* VIEW 5: CLIENT REQUISITIONS */}
        {activeView === 'requisitions' && (
          <ClientRequisitionsView
            requisitions={requisitions}
            clients={clients}
            agencies={agencies}
            sectors={sectors}
            currentUser={user}
            onRefresh={loadData}
            onNavigateToAdmin={() => setActiveView('admin_controls')}
          />
        )}

        {/* VIEW 6: 4-STAGE EMPANELMENT WORKFLOW */}
        {activeView === 'workflow' && (
          <div className="py-8">
            <EmpanelmentWorkflow
              onRegisterAgency={() => setActiveView('registration')}
              onNavigateToAdmin={() => setActiveView('admin_controls')}
            />
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold tracking-tight text-sm">
                <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center font-black text-xs">
                  A
                </div>
                <span>AUROPRO</span>
              </div>
              <p className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">
                Designed for Vendors &amp; Clients
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Centralized statutory empanelment governance, rate card markup compliance, and contingent talent procurement platform.
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2.5">Staffing Divisions</div>
              <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-xs">
                {sectors.map(s => (
                  <li key={s.id}>
                    <button 
                      onClick={() => handleNavigate('divisions', s.id)}
                      className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left cursor-pointer"
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2.5">Governance Controls</div>
              <ul className="space-y-1.5 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <li>• Super Admin Rate Ceilings</li>
                <li>• E&amp;O $5M Policy Validation</li>
                <li>• E-Verify Mandatory Enrollment</li>
                <li>• Co-Employment W2 Indemnity</li>
                <li>• 24-48h SLA Fulfillment Routing</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-2.5">Enterprise Assurance</div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Statutory Vetting Active</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
                  Pre-cleared suppliers, verified certificates of insurance, and automated rate card enforcement.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SOC 2 Type II &amp; E-Verify Ready</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
            <div>
              &copy; 2026 AuroPro Systems. Designed for Vendors &amp; Clients. All statutory rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 sm:gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono">ALL SYSTEMS OPERATIONAL</span>
              </span>
              <span className="hidden sm:inline">&bull;</span>
              {user ? (
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  Logged in as <strong className="text-slate-900 dark:text-white">{user.name}</strong> ({user.roleTitle})
                </span>
              ) : (
                <button onClick={() => setActiveView('login')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer">
                  Portal Sign In
                </button>
              )}
              <span className="hidden sm:inline">&bull;</span>
              <a
                href="/super-admin"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('super_admin');
                }}
                className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-mono"
                title="Super Admin Directorate"
              >
                /super-admin
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onNavigateToRegistration={(tab) => {
          if (tab) setRegistrationInitialTab(tab);
          setActiveView('registration');
        }}
      />

      <AgencyDetailModal
        agency={selectedAgency}
        sectors={sectors}
        user={user}
        onClose={() => setSelectedAgency(null)}
        onStatusUpdate={handleAgencyStatusUpdate}
      />

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Users, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpRight, 
  RefreshCw, 
  Sparkles, 
  Search, 
  Filter, 
  ChevronRight, 
  Award, 
  Percent, 
  Clock, 
  Activity, 
  Check, 
  Lock, 
  Unlock,
  AlertCircle,
  KeyRound,
  UserPlus,
  Layers
} from 'lucide-react';
import { 
  Agency, 
  ClientProfile, 
  StaffingRequisition, 
  SectorDetail, 
  SectorId, 
  RealtimeStats, 
  UserSession 
} from '../types.ts';
import { api } from '../services/api.ts';
import { RequisitionTrendChart } from './RequisitionTrendChart.tsx';
import { UserCredentialsModal } from './UserCredentialsModal.tsx';
import { UserCredentialsTab } from './UserCredentialsTab.tsx';
import { DivisionRequestsReview } from './DivisionRequestsReview.tsx';

interface AdminControlCenterProps {
  agencies: Agency[];
  clients: ClientProfile[];
  requisitions: StaffingRequisition[];
  sectors: SectorDetail[];
  stats: RealtimeStats | null;
  currentUser: UserSession | null;
  onRefreshData: () => void;
  onSelectAgency: (agency: Agency) => void;
}

export const AdminControlCenter: React.FC<AdminControlCenterProps> = ({
  agencies,
  clients,
  requisitions,
  sectors,
  stats,
  currentUser,
  onRefreshData,
  onSelectAgency,
}) => {
  const [activeTab, setActiveTab] = useState<'agencies' | 'clients' | 'requisitions' | 'markups' | 'credentials' | 'division_requests'>('agencies');
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<SectorId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExecutingAction, setIsExecutingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [isCreateCredentialsModalOpen, setIsCreateCredentialsModalOpen] = useState(false);

  // Sector Markup Caps State (Admin Project Controls)
  const [markupCaps, setMarkupCaps] = useState<Record<SectorId, number>>({
    it_cloud: 22,
    healthcare: 26,
    engineering: 23,
    bfsi_finance: 25,
    logistics_ops: 20,
    executive_prof: 28,
  });

  const filteredAgencies = agencies.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subCategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === 'all' || a.sectorId === sectorFilter;
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesSector && matchesStatus;
  });

  // Admin Quick Action: Change Agency Status
  const handleQuickStatusChange = async (
    agencyId: string, 
    newStatus: 'EMPANELLED' | 'UNDER_REVIEW' | 'AUDIT_REQUIRED' | 'REJECTED',
    newTier?: string
  ) => {
    setIsExecutingAction(true);
    try {
      await api.updateAgencyStatus(agencyId, {
        status: newStatus,
        tier: newTier,
        remarks: `Updated by Super Admin Julian Sterling on ${new Date().toLocaleDateString()}`,
      });
      setActionFeedback(`Agency status updated to "${newStatus}" successfully.`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setIsExecutingAction(false);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  // Admin Project Control: Save & Enforce Sector Rate Markups
  const handleEnforceMarkupCaps = async () => {
    setIsExecutingAction(true);
    try {
      await api.triggerAdminAction(
        'Rate Card Markup Policy Enforced',
        `Super Admin calibrated sector markup ceilings across all 6 staffing divisions.`
      );
      setActionFeedback('Markup rate card policy successfully enforced across all 1,340 vendors and client VMS routers.');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed to enforce markup policy');
    } finally {
      setIsExecutingAction(false);
      setTimeout(() => setActionFeedback(null), 4500);
    }
  };

  // Admin Project Control: System Audit Run
  const handleTriggerAuditDrill = async () => {
    setIsExecutingAction(true);
    try {
      await api.triggerAdminAction(
        'Comprehensive W2 Co-Employment & Insurance Audit Run',
        'Initiated automated verification of $5M E&O policies, E-Verify logs, and state licensing.'
      );
      setActionFeedback('Statutory compliance audit completed. Telemetry and agency risk indicators updated.');
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Audit drill failed');
    } finally {
      setIsExecutingAction(false);
      setTimeout(() => setActionFeedback(null), 4500);
    }
  };

  return (
    <div id="auropro-admin-control-center" className="min-h-screen bg-[#fafaf8] pb-24 text-slate-800">
      {/* Top Banner: Super Admin Authority Badge */}
      <div className="bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 mb-2 font-mono">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span>Super Admin Directorate</span>
                <span>•</span>
                <span className="text-amber-800">Route: /super-admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Super Admin Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Full supervisory authority over Vendor empanelments, Client accounts, Contingent requisitions, and Sector rate card markups.
              </p>
            </div>

            {/* Handy Action Buttons Toolbar with Micro-Animations */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-admin-trigger-audit"
                onClick={handleTriggerAuditDrill}
                disabled={isExecutingAction}
                className="handy-action-btn px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 shadow-2xs hover:shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer group"
                title="Trigger automated statutory compliance audit"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:rotate-180 transition-transform duration-500 ${isExecutingAction ? 'animate-spin' : ''}`} />
                <span>Run Audit</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              </button>

              <button
                id="btn-admin-enforce-markups"
                onClick={handleEnforceMarkupCaps}
                disabled={isExecutingAction}
                className="handy-action-btn px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-xs hover:shadow-md flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer group"
                title="Save & enforce sector markup caps"
              >
                <Percent className="w-3.5 h-3.5 group-hover:scale-125 transition-transform duration-200" />
                <span>Enforce Caps</span>
              </button>

              <button
                id="btn-admin-create-credentials"
                onClick={() => setIsCreateCredentialsModalOpen(true)}
                className="handy-action-btn px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 dark:from-slate-800 dark:to-slate-700 hover:from-slate-800 hover:to-blue-900 text-white shadow-xs hover:shadow-md border border-slate-700/50 flex items-center gap-2 transition-all cursor-pointer group"
                title="Create credentials for agency or client accounts"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400 group-hover:-rotate-12 transition-transform duration-200" />
                <span>Create User</span>
              </button>

              <button
                id="btn-admin-quick-review-requests"
                onClick={() => setActiveTab('division_requests')}
                className={`handy-action-btn px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === 'division_requests'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/40'
                }`}
                title="Review division expansion requests"
              >
                <Layers className="w-3.5 h-3.5 animate-bounce" />
                <span>Division Requests</span>
              </button>
            </div>
          </div>

          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionFeedback}</span>
              </div>
              <button onClick={() => setActionFeedback(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">
                Dismiss
              </button>
            </div>
          )}

          {/* 4 Core Metric KPI Blocks (Off-white, Orange, Blue, Green) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Total Empanelled Agencies */}
            <div className="p-4 rounded-2xl bg-[#fafaf7] border border-orange-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
                  Empanelled Vendors
                </span>
                <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {stats ? stats.totalEmpanelledAgencies : agencies.filter(a => a.status === 'EMPANELLED').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-orange-600 font-semibold">{agencies.filter(a => a.status === 'UNDER_REVIEW').length} Pending Admin Review</span>
              </div>
            </div>

            {/* Active Clients */}
            <div className="p-4 rounded-2xl bg-[#fafaf7] border border-blue-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Active Clients
                </span>
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Building2 className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {clients.length} Accounts
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <span className="text-blue-600 font-semibold">100% Admin Authorized</span>
              </div>
            </div>

            {/* Open Contingent Requisitions */}
            <div className="p-4 rounded-2xl bg-[#fafaf7] border border-amber-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Open Job Orders
                </span>
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <Briefcase className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {requisitions.length} Requisitions
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                <span className="text-amber-600 font-semibold">Under 36h SLA fulfillment</span>
              </div>
            </div>

            {/* Average Compliance Health */}
            <div className="p-4 rounded-2xl bg-[#fafaf7] border border-emerald-200/80 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Vetting Compliance
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {stats ? `${stats.avgComplianceScore}%` : '98.4%'}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                <span className="text-emerald-700 font-semibold">E&O + W2 Audit Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Tab Navigation & Controls Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Recharts Monthly Trend Visualizer across Sectors */}
        <RequisitionTrendChart sectors={sectors} />

        {/* Navigation Tabs for Project Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('agencies')}
            className={`px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'agencies'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Vendor Empanelments ({agencies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('markups')}
            className={`px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'markups'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>Sector Rate Card Ceilings</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3.5 sm:px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-slate-800 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Client Accounts ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requisitions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'requisitions'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Live Job Orders & Requisitions ({requisitions.length})</span>
          </button>

          <button
            id="tab-btn-credentials"
            onClick={() => setActiveTab('credentials')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'credentials'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>User Credentials & Logins</span>
          </button>

          <button
            id="tab-btn-division-requests"
            onClick={() => setActiveTab('division_requests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'division_requests'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Division Expansion Requests</span>
          </button>
        </div>

        {/* TAB 1: AGENCY EMPANELMENT GOVERNANCE */}
        {activeTab === 'agencies' && (
          <div className="mt-6 space-y-4">
            {/* Filters Bar */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search agency by name, reg # or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value as SectorId | 'all')}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map(s => (
                    <option key={s.id} value={s.id}>{s.shortName}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">All Empanelment Statuses</option>
                  <option value="EMPANELLED">Empanelled (Approved)</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="AUDIT_REQUIRED">Audit Required</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Agencies Master Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto touch-pan-x">
                <table className="w-full text-left text-xs text-slate-700 min-w-[720px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Vendor (Staffing Supplier)</th>
                      <th className="px-4 py-3.5">Specialization</th>
                      <th className="px-4 py-3.5">Supplier Tier</th>
                      <th className="px-4 py-3.5">Bench &amp; Markup</th>
                      <th className="px-4 py-3.5">Compliance</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Super Admin Project Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAgencies.map((agency) => (
                      <tr key={agency.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Agency Name & Avatar */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={agency.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                              alt={agency.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{agency.name}</span>
                                {agency.status === 'EMPANELLED' && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                {agency.registrationNumber} &bull; {agency.headquarters}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Specialization */}
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800">{agency.subCategory}</span>
                        </td>

                        {/* Supplier Tier */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            agency.tier.includes('Strategic')
                              ? 'bg-orange-50 text-orange-800 border-orange-200'
                              : agency.tier.includes('Preferred')
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            <Award className="w-3 h-3" />
                            <span>{agency.tier}</span>
                          </span>
                        </td>

                        {/* Bench & Markup */}
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-900">{agency.candidatePoolSize}</div>
                          <div className="text-[11px] text-slate-500 font-mono">Markup: {agency.billRateMarkup}</div>
                        </td>

                        {/* Compliance Score */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  agency.complianceScore >= 95 ? 'bg-emerald-500' : agency.complianceScore >= 88 ? 'bg-blue-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${agency.complianceScore}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-800">{agency.complianceScore}%</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            agency.status === 'EMPANELLED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : agency.status === 'UNDER_REVIEW'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : agency.status === 'AUDIT_REQUIRED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-red-50 text-red-800 border-red-200'
                          }`}>
                            {agency.status}
                          </span>
                        </td>

                        {/* Super Admin Controls: Approve, Tier, Audit, Inspect */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {agency.status !== 'EMPANELLED' ? (
                              <button
                                onClick={() => handleQuickStatusChange(agency.id, 'EMPANELLED', 'Tier-1 Strategic Agency')}
                                title="Approve Empanelment & Assign Tier-1"
                                className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickStatusChange(agency.id, 'AUDIT_REQUIRED')}
                                title="Flag for Statutory Recertification Audit"
                                className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                              >
                                Flag Audit
                              </button>
                            )}

                            {/* View Full Dossier */}
                            <button
                              onClick={() => onSelectAgency(agency)}
                              className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
                            >
                              Dossier
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECTOR RATE CARD MARKUP CEILINGS */}
        {activeTab === 'markups' && (
          <div className="mt-6 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="max-w-2xl">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Rate Governance Matrix
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                  Sector-Specific Rate Card Markup Ceilings
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  As the Super Administrator, you set the maximum bill rate markup % that empanelled vendors can submit to clients. Preventing price-gouging while preserving premium recruitment talent quality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {sectors.map((sector) => {
                  const cap = markupCaps[sector.id] || 22;
                  return (
                    <div key={sector.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{sector.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                          {sector.code}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">Max Allowed Markup:</span>
                        <span className="text-2xl font-extrabold text-orange-600">{cap}%</span>
                      </div>

                      {/* Interactive Slider */}
                      <input
                        type="range"
                        min="12"
                        max="35"
                        value={cap}
                        onChange={(e) => setMarkupCaps({ ...markupCaps, [sector.id]: Number(e.target.value) })}
                        className="w-full accent-orange-600 cursor-pointer"
                      />

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Min: 12%</span>
                        <span>Current: {cap}%</span>
                        <span>Max: 35%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Enforcing markups immediately syncs to all client RFP bidding engines</span>
                </div>
                <button
                  onClick={handleEnforceMarkupCaps}
                  disabled={isExecutingAction}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Enforce Calibrated Markups</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CLIENT ACCOUNTS */}
        {activeTab === 'clients' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Enrolled Enterprise Hiring Organizations</h2>
                  <p className="text-xs text-slate-500">Monitored contingent budgets and SLA adherence</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {clients.length} Active Accounts
                </span>
              </div>

              <div className="overflow-x-auto touch-pan-x">
                <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Company Name</th>
                      <th className="px-4 py-3.5">Staffing Division</th>
                      <th className="px-4 py-3.5">Annual Contingent Budget</th>
                      <th className="px-4 py-3.5">VMS / MSP System</th>
                      <th className="px-4 py-3.5">SLA Target</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={client.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80'}
                              alt={client.companyName}
                              className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{client.companyName}</div>
                              <div className="text-[11px] text-slate-500">{client.contactPerson.name} ({client.contactPerson.email})</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800">{client.industry}</td>
                        <td className="px-4 py-3.5 font-extrabold text-slate-900">{client.annualContingentBudget}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[11px]">
                            {client.currentMspVms}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-orange-600">{client.slaTargetHours} Hours</td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {client.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            Active Node
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE REQUISITIONS */}
        {activeTab === 'requisitions' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Active Contingent Staffing Requisitions</h2>
                  <p className="text-xs text-slate-500">Live job orders submitted by clients to empanelled vendor pools</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {requisitions.length} Open Requisitions
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {requisitions.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          req.priority === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {req.priority}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{req.title}</h3>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-700">{req.clientName}</span>
                        <span>&bull;</span>
                        <span>{req.positionsNeeded} Positions</span>
                        <span>&bull;</span>
                        <span className="font-bold text-emerald-700">{req.billRateRange}</span>
                        <span>&bull;</span>
                        <span>{req.location} ({req.remoteType})</span>
                        <span>&bull;</span>
                        <span className="text-orange-600 font-semibold">{req.slaHours}h SLA</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {req.primarySkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900">{req.matchedAgenciesCount} Agencies</div>
                        <div className="text-[11px] text-slate-400">Vetted Match</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        OPEN
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: USER CREDENTIALS PROVISIONING & ACCESS */}
        {activeTab === 'credentials' && (
          <div className="mt-6">
            <UserCredentialsTab onOpenCreateModal={() => setIsCreateCredentialsModalOpen(true)} />
          </div>
        )}

        {/* TAB 6: DIVISION EXPANSION WORK REQUESTS */}
        {activeTab === 'division_requests' && (
          <div className="mt-6">
            <DivisionRequestsReview />
          </div>
        )}
      </div>

      {/* User Credentials Provisioning Modal */}
      <UserCredentialsModal
        isOpen={isCreateCredentialsModalOpen}
        onClose={() => setIsCreateCredentialsModalOpen(false)}
        agencies={agencies}
        clients={clients}
        sectors={sectors}
        onSuccess={(newUser) => {
          onRefreshData();
          setActionFeedback(`Successfully provisioned credentials for ${newUser.name} (${newUser.companyName}).`);
        }}
      />
    </div>
  );
};

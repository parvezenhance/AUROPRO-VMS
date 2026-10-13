import React, { useState } from 'react';
import { 
  SectorDetail, 
  Agency, 
  StaffingRequisition,
  UserSession, 
  SectorId 
} from '../types.ts';
import { 
  Server, 
  HeartPulse, 
  Cog, 
  ShieldCheck, 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ArrowLeft,
  Clock, 
  Shield, 
  TrendingUp, 
  FileCheck2,
  Users,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';

interface SectorDivisionViewProps {
  sector: SectorDetail;
  agencies: Agency[];
  requisitions?: StaffingRequisition[];
  user: UserSession | null;
  onBackToOverview: () => void;
  onViewAgency: (agency: Agency) => void;
  onRegisterAgency: (sectorId: SectorId) => void;
  onNavigateToAdmin?: () => void;
}

export const SectorDivisionView: React.FC<SectorDivisionViewProps> = ({
  sector,
  agencies,
  requisitions = [],
  user,
  onBackToOverview,
  onViewAgency,
  onRegisterAgency,
  onNavigateToAdmin,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const sectorAgencies = agencies.filter(a => a.sectorId === sector.id);
  const sectorRequisitions = requisitions.filter(r => r.sectorId === sector.id);

  const filteredAgencies = sectorAgencies.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.subCategory.toLowerCase().includes(search.toLowerCase()) ||
      a.certifications.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getSectorIcon = (id: SectorId) => {
    switch (id) {
      case 'it_cloud': return <Server className="w-5 h-5 text-blue-600" />;
      case 'healthcare': return <HeartPulse className="w-5 h-5 text-emerald-600" />;
      case 'engineering': return <Cog className="w-5 h-5 text-orange-600" />;
      case 'bfsi_finance': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'logistics_ops': return <Building2 className="w-5 h-5 text-amber-600" />;
      case 'executive_prof': return <Award className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <div id={`sector-division-view-${sector.id}`} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      
      {/* Back Navigation Bar & Admin Quick Access */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-orange-600" />
          <span>
            {user?.role === 'AGENCY' 
              ? 'Back to Agency Dashboard' 
              : user?.role === 'CLIENT' 
              ? 'Back to Client Dashboard' 
              : 'Back to Divisions Overview'}
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">Division: {sector.code}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${sector.colorTheme.badge}`}>
            Staffing Specialization
          </span>
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3 py-1 text-xs font-bold rounded-lg bg-orange-600 hover:bg-orange-700 text-white shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>Admin Controls</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner with Curated Professional Stock Image & Sector KPIs */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Sector Pitch & KPIs */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  {getSectorIcon(sector.id)}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {sector.name}
                  </h1>
                  <p className="text-xs text-orange-600 font-semibold mt-0.5">
                    {sector.tagline}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {sector.description}
              </p>

              {/* Regulatory Bodies & Certifications */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recognized Standards & Accreditations:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sector.regulatoryBodies.concat(sector.mandatoryCertifications).slice(0, 5).map((body, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60">
                      {body}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Division Key Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-semibold">Empanelled</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{sector.kpis.empanelledCount}</div>
                <div className="text-[10px] text-slate-400">Approved Agencies</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-semibold">Under Review</div>
                <div className="text-xl font-extrabold text-orange-600 mt-1">{sector.kpis.underReviewCount}</div>
                <div className="text-[10px] text-slate-400">Dossiers in Queue</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-semibold">Avg Vetting</div>
                <div className="text-xl font-extrabold text-blue-600 mt-1">{sector.kpis.avgVettingDays} Days</div>
                <div className="text-[10px] text-slate-400">Statutory SLA</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs text-slate-500 font-semibold">Volume</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">{sector.kpis.annualPlacementVolume}</div>
                <div className="text-[10px] text-slate-400">Contingent Spend</div>
              </div>
            </div>
          </div>

          {/* Right Stock Photo Showcase */}
          <div className="lg:col-span-5 relative min-h-[220px] sm:min-h-[260px] lg:min-h-full">
            <img
              src={sector.stockImageUrl}
              alt={sector.name}
              className="w-full h-full object-cover min-h-[220px] sm:min-h-[260px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                AuroPro Staffing Division
              </span>
              <p className="text-sm font-bold text-white mt-1">
                Centralized Governance for {sector.shortName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stage Statutory Vetting Roadmap */}
      <div className="p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Statutory Roadmap
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
              4-Stage Agency Empanelment Workflow
            </h2>
          </div>
          <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Admin Audited
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {sector.vettingStages.map((st) => (
            <div key={st.stageNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-extrabold text-xs flex items-center justify-center">
                  {st.stageNumber}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">{st.avgDuration}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 pt-1 leading-snug">{st.title}</h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">{st.description}</p>
              <div className="text-[10px] font-bold text-blue-700 pt-1">
                Lead: {st.leadRole}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empanelled Staffing Agencies in this Division (Hidden for Agency Partners) */}
      {user?.role === 'AGENCY' ? (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Division Client Requisitions Pipeline ({sectorRequisitions.length})
              </h2>
              <p className="text-xs text-slate-500">
                Live corporate job orders in {sector.shortName} dispatched to empanelled partners.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              Assigned Partner Jurisdiction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectorRequisitions.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-400 text-xs">
                No active requisitions currently open in this division.
              </div>
            ) : (
              sectorRequisitions.map(req => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {req.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">{req.billRateRange}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{req.title}</h4>
                  <div className="text-xs text-slate-500">{req.clientName} &bull; {req.location} ({req.remoteType})</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {req.primarySkills.map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Empanelled Staffing Agencies ({filteredAgencies.length})
              </h2>
            <p className="text-xs text-slate-500">
              Verified suppliers eligible for immediate requisition assignment in {sector.shortName}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search agency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="EMPANELLED">Empanelled</option>
              <option value="UNDER_REVIEW">Under Review</option>
            </select>
          </div>
        </div>

        {/* Agencies Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredAgencies.map((agency) => (
            <div
              key={agency.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={agency.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={agency.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                        <span>{agency.name}</span>
                        {agency.status === 'EMPANELLED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500">{agency.headquarters}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    agency.status === 'EMPANELLED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}>
                    {agency.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {agency.subCategory}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Candidate Bench</span>
                    <span className="font-bold text-slate-800">{agency.candidatePoolSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Bill Rate Markup</span>
                    <span className="font-bold text-orange-600">{agency.billRateMarkup}</span>
                  </div>
                </div>

                {/* Certifications Tags */}
                <div className="flex flex-wrap gap-1">
                  {agency.certifications.slice(0, 3).map((cert, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onViewAgency(agency)}
                className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Agency Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

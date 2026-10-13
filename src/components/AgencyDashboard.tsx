import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Award, 
  ArrowUpRight, 
  Filter, 
  Search, 
  FileText, 
  Send, 
  AlertCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  Eye,
  PlusCircle,
  Lock,
  Paperclip
} from 'lucide-react';
import { 
  Agency, 
  StaffingRequisition, 
  SectorDetail, 
  UserSession,
  DivisionWorkRequest
} from '../types.ts';
import { JobDetailsModal } from './JobDetailsModal.tsx';
import { CandidateSubmitModal } from './CandidateSubmitModal.tsx';
import { RequestDivisionWorkModal } from './RequestDivisionWorkModal.tsx';

interface AgencyDashboardProps {
  currentUser: UserSession;
  agencies: Agency[];
  requisitions: StaffingRequisition[];
  sectors: SectorDetail[];
  onNavigate: (view: string, param?: string) => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  currentUser,
  agencies,
  requisitions,
  sectors,
  onNavigate,
}) => {
  // Find current agency profile (strictly isolated to current agency)
  const currentAgency = agencies.find(a => a.id === currentUser.agencyId) || agencies[0];
  const agencySector = sectors.find(s => s.id === currentAgency?.sectorId) || sectors[0];

  const [activeTab, setActiveTab] = useState<'matching_jobs' | 'submissions' | 'compliance' | 'division'>('matching_jobs');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<StaffingRequisition | null>(null);
  const [candidateModalReq, setCandidateModalReq] = useState<StaffingRequisition | null>(null);
  const [isDivisionRequestModalOpen, setIsDivisionRequestModalOpen] = useState(false);
  const [agencyDivisionRequests, setAgencyDivisionRequests] = useState<DivisionWorkRequest[]>([]);

  // Filter requisitions in the agency's sector or matching skills
  const matchingRequisitions = requisitions.filter(r => {
    const matchesSector = r.sectorId === currentAgency?.sectorId;
    const matchesSearch = searchTerm === '' || 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primarySkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                <span>Vendor Supplier Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-300">Empanelled Partner</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/40 border border-white/10 text-slate-300 text-[11px] font-medium">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Peer Vendor Data Segregated</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentAgency?.name || 'Apex Tech Talent Partners'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-200 max-w-xl leading-relaxed">
              Logged in as <span className="font-bold text-white">{currentUser.name}</span> &bull; {currentUser.roleTitle}
            </p>
          </div>

          {/* Handy Agency Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-agency-view-jobs"
              onClick={() => setActiveTab('matching_jobs')}
              className="handy-action-btn px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:shadow-md group"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-300 group-hover:scale-110 transition-transform" />
              <span>Jobs Hub</span>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-500/40 text-[10px] font-bold text-white">
                {matchingRequisitions.length}
              </span>
            </button>
            <button
              id="btn-agency-request-division-work-header"
              onClick={() => setIsDivisionRequestModalOpen(true)}
              className="handy-action-btn px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
            >
              <PlusCircle className="w-4 h-4 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
              <span>Request Division Work</span>
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping"></span>
            </button>
            <button
              onClick={() => onNavigate('workflow')}
              className="handy-action-btn px-3.5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-200 group-hover:scale-125 transition-transform" />
              <span>Audit Standing</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Matching Jobs</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {matchingRequisitions.length}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1 flex items-center gap-1">
            <span>In {agencySector.shortName}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Empanelled Tier</span>
            <Award className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tier-1
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Strategic Supplier</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Candidate Pool</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentAgency?.candidatePoolSize || '14,000+'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {currentAgency?.recruiterCount || 18} dedicated technical recruiters
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Bill Rate Markup</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentAgency?.billRateMarkup || '18% - 22%'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Admin Cap: 22.0%
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-4 sm:px-6 pt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0">
            <button
              onClick={() => setActiveTab('matching_jobs')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'matching_jobs'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>View Jobs ({matchingRequisitions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'compliance'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Compliance Standing
            </button>
            <button
              onClick={() => setActiveTab('division')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap min-h-[40px] ${
                activeTab === 'division'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Assigned Division ({agencySector.shortName})</span>
            </button>
          </div>

          <div className="pb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              id="btn-agency-tab-request-division"
              onClick={() => setIsDivisionRequestModalOpen(true)}
              className="px-3 py-2 min-h-[38px] rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Request Additional Division</span>
            </button>
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search job title or skills..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 min-h-[38px]"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Matching Jobs */}
        {activeTab === 'matching_jobs' && (
          <div className="p-4 sm:p-6 divide-y divide-slate-100">
            {matchingRequisitions.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm">No job orders matching search</p>
                <p className="text-xs text-slate-400 mt-1">Check back as clients dispatch new requisitions.</p>
              </div>
            ) : (
              matchingRequisitions.map(req => (
                <div key={req.id} className="py-5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 p-3 rounded-2xl transition-colors">
                  <div className="space-y-2 cursor-pointer" onClick={() => setSelectedJobForDetails(req)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-extrabold text-slate-900 hover:text-blue-600 transition-colors">{req.title}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {req.clientName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {req.remoteType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        req.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                        req.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {req.priority} PRIORITY
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500 flex-wrap">
                      <span>Rate: <strong className="text-slate-800">{req.billRateRange}</strong></span>
                      <span className="hidden sm:inline">&bull;</span>
                      <span>Positions: <strong className="text-slate-800">{req.positionsNeeded} Open</strong></span>
                      <span className="hidden sm:inline">&bull;</span>
                      <span>Location: <strong className="text-slate-800">{req.location}</strong></span>
                      <span className="hidden sm:inline">&bull;</span>
                      <span>SLA: <strong className="text-slate-800">{req.slaHours}h</strong></span>
                    </div>

                    {req.primarySkills && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {req.primarySkills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                    <button
                      id={`btn-view-job-${req.id}`}
                      onClick={() => setSelectedJobForDetails(req)}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 min-h-[40px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Job</span>
                    </button>
                    <button
                      id={`btn-submit-candidate-${req.id}`}
                      onClick={() => setCandidateModalReq(req)}
                      className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[40px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Candidate</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Compliance Standing */}
        {activeTab === 'compliance' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>E&O Insurance ($5,000,000)</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-normal">
                  Valid until Dec 31, 2026. Certificate on file with central master governance.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>E-Verify Federal Attestation</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-normal">
                  All candidate submissions are pre-cleared for statutory US employment authorization.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>W2 Co-Employment Indemnity</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-normal">
                  Fully indemnified with statutory payroll tax withholding protocols.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3">
                Current Registered Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {(currentAgency?.certifications || ['E-Verify Certified', 'TechServe Alliance', 'ISO 9001:2015', 'SOC 2 Type II Verified']).map(cert => (
                  <span key={cert} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs shadow-2xs">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Assigned Division Specs */}
        {activeTab === 'division' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/40 border border-blue-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                    {agencySector.code}
                  </span>
                  <span className="text-xs font-semibold text-blue-900">Assigned Specialization Division</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{agencySector.name}</h3>
                <p className="text-xs text-slate-600 max-w-2xl">{agencySector.description}</p>
              </div>
              <button
                onClick={() => onNavigate('divisions', agencySector.id)}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Full Division Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Division KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Empanelled</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{agencySector.kpis.empanelledCount} Agencies</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Vetting</div>
                <div className="text-xl font-extrabold text-blue-600 mt-1">{agencySector.kpis.avgVettingDays} Days</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compliance Rate</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">{agencySector.kpis.complianceRate}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Annual Volume</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{agencySector.kpis.annualPlacementVolume}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mandatory Certifications */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mandatory Division Certifications
                  </h4>
                </div>
                <div className="space-y-2">
                  {agencySector.mandatoryCertifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regulatory Bodies */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Governing Regulatory Bodies
                  </h4>
                </div>
                <div className="space-y-2">
                  {agencySector.regulatoryBodies.map((body, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{body}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vetting Stages for this Division */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Division Vetting Protocol Pipeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {agencySector.vettingStages.map(stage => (
                  <div key={stage.stageNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Stage {stage.stageNumber}</span>
                      <span className="text-blue-600">{stage.avgDuration}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">{stage.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug line-clamp-2">{stage.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        requisition={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onSubmitCandidate={(req) => setCandidateModalReq(req)}
      />

      {/* Candidate Dossier Submission Modal with File Uploads */}
      <CandidateSubmitModal
        requisition={candidateModalReq}
        onClose={() => setCandidateModalReq(null)}
        agencyName={currentAgency.name}
      />

      {/* Request for Additional Division Work Modal */}
      <RequestDivisionWorkModal
        isOpen={isDivisionRequestModalOpen}
        onClose={() => setIsDivisionRequestModalOpen(false)}
        currentAgency={currentAgency}
        sectors={sectors}
        onRequestSubmitted={(newReq) => {
          setAgencyDivisionRequests(prev => [newReq, ...prev]);
        }}
      />

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Search, 
  Filter, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  ChevronRight,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ClientProfile, 
  StaffingRequisition, 
  Agency, 
  SectorDetail, 
  UserSession 
} from '../types.ts';

interface ClientDashboardProps {
  currentUser: UserSession;
  clients: ClientProfile[];
  requisitions: StaffingRequisition[];
  agencies: Agency[];
  sectors: SectorDetail[];
  onNavigate: (view: string, param?: string) => void;
  onCreateRequisition: (reqData: any) => Promise<void>;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  clients,
  requisitions,
  agencies,
  sectors,
  onNavigate,
  onCreateRequisition,
}) => {
  const currentClient = clients.find(c => c.id === currentUser.clientId) || clients[0];
  const clientSector = sectors.find(s => s.id === currentClient?.sectorId) || sectors[0];

  const [activeTab, setActiveTab] = useState<'my_requisitions' | 'available_agencies' | 'budget' | 'division'>('my_requisitions');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Requisition Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPositions, setNewPositions] = useState(2);
  const [newBillRate, setNewBillRate] = useState('$85 - $115/hr');
  const [newLocation, setNewLocation] = useState('Austin, TX');
  const [newRemoteType, setNewRemoteType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [newSkills, setNewSkills] = useState('React, TypeScript, AWS, Node.js');
  const [newPriority, setNewPriority] = useState<'STANDARD' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newDescription, setNewDescription] = useState('Senior engineers required for immediate cloud native sprint.');
  const [isSubmittingReq, setIsSubmittingReq] = useState(false);

  // Filter client's own requisitions
  const clientRequisitions = requisitions.filter(r => 
    r.clientName?.toLowerCase().includes('nexus') || 
    r.clientName?.toLowerCase().includes(currentClient?.companyName?.toLowerCase() || '') ||
    r.sectorId === currentClient?.sectorId
  );

  // Filter empanelled agencies matching client sector
  const matchingAgencies = agencies.filter(a => 
    a.status === 'EMPANELLED' && 
    (a.sectorId === currentClient?.sectorId || a.sectorId === 'it_cloud')
  );

  const handlePostRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setIsSubmittingReq(true);
    try {
      await onCreateRequisition({
        title: newTitle,
        sectorId: currentClient?.sectorId || 'it_cloud',
        clientName: currentClient?.companyName || 'Nexus Enterprise Cloud',
        positionsNeeded: newPositions,
        billRateRange: newBillRate,
        location: newLocation,
        remoteType: newRemoteType,
        primarySkills: newSkills.split(',').map(s => s.trim()).filter(Boolean),
        priority: newPriority,
        description: newDescription,
        slaHours: 48,
        status: 'OPEN',
      });
      setIsCreateModalOpen(false);
      setNewTitle('');
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch requisition');
    } finally {
      setIsSubmittingReq(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-150">
      
      {/* Client Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Client Talent Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-300">Active Account</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentClient?.companyName || 'Nexus Enterprise Cloud'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl leading-relaxed">
              Logged in as <span className="font-bold text-white">{currentUser.name}</span> &bull; {currentUser.roleTitle}
            </p>
          </div>

          {/* Handy Client Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="handy-action-btn px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-slate-950 group-hover:rotate-90 transition-transform duration-300" />
              <span>Post New Requisition</span>
              <span className="w-2 h-2 rounded-full bg-slate-900 animate-ping"></span>
            </button>
            <button
              onClick={() => onNavigate('requisitions')}
              className="handy-action-btn px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/25 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center gap-2 group"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300 group-hover:scale-115 transition-transform" />
              <span>Network Orders</span>
            </button>
            <button
              onClick={() => onNavigate('agencies')}
              className="handy-action-btn px-3.5 py-2.5 rounded-xl text-xs font-bold bg-teal-800/60 hover:bg-teal-700/60 text-emerald-100 border border-teal-500/30 transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center gap-2 group"
            >
              <Users className="w-3.5 h-3.5 text-teal-300 group-hover:scale-120 transition-transform" />
              <span>Vetted Suppliers</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Job Orders</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {clientRequisitions.length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Dispatching to {matchingAgencies.length} empanelled suppliers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Annual Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            $35M
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            VMS System: SAP Fieldglass
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Empanelled Agencies</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {matchingAgencies.length}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">
            Tier-1 Pre-vetted in {clientSector.shortName}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Candidate SLA</span>
            <Clock className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {currentClient?.slaTargetHours || 24}h
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>98.6% Compliance Rate</span>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-4 sm:px-6 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap shrink-0">
            <button
              onClick={() => setActiveTab('my_requisitions')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'my_requisitions'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              My Orders ({clientRequisitions.length})
            </button>
            <button
              onClick={() => setActiveTab('available_agencies')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'available_agencies'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Staffing Suppliers ({matchingAgencies.length})
            </button>
            <button
              onClick={() => setActiveTab('division')}
              className={`pb-3 sm:pb-4 px-2.5 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap min-h-[40px] shrink-0 ${
                activeTab === 'division'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span>Assigned Division ({clientSector.shortName})</span>
            </button>
          </div>

          <div className="pb-3 flex items-center justify-end">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2 min-h-[38px] rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>New Job Order</span>
            </button>
          </div>
        </div>

        {/* Tab 1: My Requisitions */}
        {activeTab === 'my_requisitions' && (
          <div className="divide-y divide-slate-100">
            {clientRequisitions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-sm">No active requisitions yet</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Post First Requisition
                </button>
              </div>
            ) : (
              clientRequisitions.map(req => (
                <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-extrabold text-slate-900">{req.title}</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {req.positionsNeeded} Positions Open
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {req.remoteType}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        req.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                        req.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {req.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span>Rate: <strong className="text-slate-800">{req.billRateRange}</strong></span>
                      <span>&bull;</span>
                      <span>Location: <strong className="text-slate-800">{req.location}</strong></span>
                      <span>&bull;</span>
                      <span>Posted: <strong className="text-slate-800">{req.postedDate}</strong></span>
                      <span>&bull;</span>
                      <span>Agencies Notified: <strong className="text-emerald-700 font-bold">{req.matchedAgenciesCount || 8}</strong></span>
                    </div>

                    {req.primarySkills && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {req.primarySkills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Collecting Candidates</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Assigned Agencies */}
        {activeTab === 'available_agencies' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingAgencies.map(agency => (
              <div key={agency.id} className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 hover:border-emerald-300 transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{agency.name}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    {agency.tier}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>Recruiters: <strong className="text-slate-800">{agency.recruiterCount}</strong></div>
                  <div>Pool: <strong className="text-slate-800">{agency.candidatePoolSize}</strong></div>
                  <div>Markup: <strong className="text-slate-800">{agency.billRateMarkup}</strong></div>
                  <div>HQ: <strong className="text-slate-800">{agency.headquarters}</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>E&O: {agency.insuranceCoverage.eAndO}</span>
                  <span className="text-emerald-700 font-bold">E-Verify Certified</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Assigned Division Specs */}
        {activeTab === 'division' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-blue-50/40 border border-emerald-200">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                    {clientSector.code}
                  </span>
                  <span className="text-xs font-semibold text-emerald-900">Enterprise Assigned Division</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">{clientSector.name}</h3>
                <p className="text-xs text-slate-600 max-w-2xl">{clientSector.description}</p>
              </div>
              <button
                onClick={() => onNavigate('divisions', clientSector.id)}
                className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Full Division Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Division Key Performance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Empanelled Suppliers</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{matchingAgencies.length} Approved</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Candidate SLA</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">{clientSector.kpis.avgVettingDays} Days</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Compliance Rate</div>
                <div className="text-xl font-extrabold text-blue-600 mt-1">{clientSector.kpis.complianceRate}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contingent Spend Volume</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">{clientSector.kpis.annualPlacementVolume}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mandatory Supplier Certifications */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Supplier Quality Standards Required
                  </h4>
                </div>
                <div className="space-y-2">
                  {clientSector.mandatoryCertifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governing Regulatory Standards */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Regulatory Mandates & Vetting Compliance
                  </h4>
                </div>
                <div className="space-y-2">
                  {clientSector.regulatoryBodies.map((body, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{body}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Post Requisition Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800">
            <h3 className="text-xl font-extrabold text-slate-900">
              Dispatch New Staffing Requisition
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Instantly broadcast this job order to all Tier-1 empanelled staffing agencies in {clientSector.shortName}.
            </p>

            <form onSubmit={handlePostRequisition} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Job Role Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Lead Kubernetes DevOps & AI Platform Engineer"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Open Positions</label>
                  <input
                    type="number"
                    min="1"
                    value={newPositions}
                    onChange={e => setNewPositions(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bill Rate Range</label>
                  <input
                    type="text"
                    value={newBillRate}
                    onChange={e => setNewBillRate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Model</label>
                  <select
                    value={newRemoteType}
                    onChange={e => setNewRemoteType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required Core Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={e => setNewSkills(e.target.value)}
                  placeholder="AWS, Python, Kubernetes, Terraform"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requisition Brief / Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReq}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {isSubmittingReq ? 'Broadcasting Order...' : 'Dispatch Requisition to Agencies'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

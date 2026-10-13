import React, { useState } from 'react';
import { StaffingRequisition, ClientProfile, Agency, SectorDetail, UserSession } from '../types.ts';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Sliders,
  Sparkles,
  Send
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ClientRequisitionsViewProps {
  requisitions: StaffingRequisition[];
  clients: ClientProfile[];
  agencies: Agency[];
  sectors: SectorDetail[];
  currentUser: UserSession | null;
  onRefresh: () => void;
  onNavigateToAdmin?: () => void;
}

export const ClientRequisitionsView: React.FC<ClientRequisitionsViewProps> = ({
  requisitions,
  clients,
  agencies,
  sectors,
  currentUser,
  onRefresh,
  onNavigateToAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [isCreatingReq, setIsCreatingReq] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPositions, setNewPositions] = useState(2);
  const [newBillRate, setNewBillRate] = useState('$85 - $115/hr');
  const [newLocation, setNewLocation] = useState('Austin, TX');
  const [newRemoteType, setNewRemoteType] = useState<'Remote' | 'Hybrid' | 'On-site'>('Hybrid');
  const [newSkills, setNewSkills] = useState('React, TypeScript, AWS, Node.js');
  const [newSectorId, setNewSectorId] = useState('it_cloud');
  const [newPriority, setNewPriority] = useState<'STANDARD' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredRequisitions = requisitions.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.primarySkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = selectedSector === 'all' || r.sectorId === selectedSector;
    const matchesPriority = selectedPriority === 'all' || r.priority === selectedPriority;
    return matchesSearch && matchesSector && matchesPriority;
  });

  const handleCreateRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createRequisition({
        clientId: clients[0]?.id || 'client-1',
        clientName: clients[0]?.companyName || 'Nexus Cloud Systems',
        title: newTitle,
        sectorId: newSectorId as any,
        positionsNeeded: Number(newPositions),
        billRateRange: newBillRate,
        location: newLocation,
        remoteType: newRemoteType,
        primarySkills: newSkills.split(',').map(s => s.trim()),
        priority: newPriority,
        slaHours: newPriority === 'CRITICAL' ? 12 : newPriority === 'HIGH' ? 24 : 48,
        description: `Contingent requisition dispatched to all empanelled staffing agencies under AuroPro governance.`,
      });
      setSuccessMsg('Job requisition published to empanelled agency roster!');
      setIsCreatingReq(false);
      setNewTitle('');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to submit requisition');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Contingent Staffing Orders
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Client Job Requisitions & SLA Routing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empanelled staffing agencies submit candidate submittals under governed rate markups and SLA targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-orange-600" />
              <span>Admin Center</span>
            </button>
          )}

          <button
            onClick={() => setIsCreatingReq(!isCreatingReq)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Requisition</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Post Requisition Modal / Dropdown Form */}
      {isCreatingReq && (
        <form onSubmit={handleCreateRequisition} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Post Contingent Staffing Order</h3>
            <button
              type="button"
              onClick={() => setIsCreatingReq(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Order Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Senior Cloud Infrastructure Specialist"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Staffing Division</label>
              <select
                value={newSectorId}
                onChange={(e) => setNewSectorId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                {sectors.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headcount Needed</label>
              <input
                type="number"
                min="1"
                value={newPositions}
                onChange={(e) => setNewPositions(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bill Rate Range</label>
              <input
                type="text"
                value={newBillRate}
                onChange={(e) => setNewBillRate(e.target.value)}
                placeholder="e.g. $80 - $110/hr"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location & Remote</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="px-2.5 py-2 text-xs rounded-xl border border-slate-200"
                />
                <select
                  value={newRemoteType}
                  onChange={(e) => setNewRemoteType(e.target.value as any)}
                  className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Mandatory Technical / Skill Requirements</label>
              <input
                type="text"
                value={newSkills}
                onChange={(e) => setNewSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Python, Kubernetes"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fulfillment Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="CRITICAL">CRITICAL (12h SLA)</option>
                <option value="HIGH">HIGH (24h SLA)</option>
                <option value="STANDARD">STANDARD (48h SLA)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[42px] text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast to Empanelled Agencies</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search requisitions or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 min-h-[40px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white min-h-[40px]"
          >
            <option value="all">All Divisions</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.shortName}</option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white"
          >
            <option value="all">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="STANDARD">Standard</option>
          </select>
        </div>
      </div>

      {/* Requisitions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRequisitions.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      req.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-800 border border-orange-200'
                    }`}>
                      {req.priority}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Order #{req.id}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{req.title}</h3>
                  <p className="text-xs text-slate-600 font-semibold">{req.clientName}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-700 block">{req.billRateRange}</span>
                  <span className="text-[11px] text-slate-500">{req.positionsNeeded} Positions</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{req.location} ({req.remoteType})</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-semibold text-orange-700">{req.slaHours}h SLA Deadline</span>
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {req.primarySkills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-900">{req.matchedAgenciesCount} Agencies</span> Empanelled
              </div>
              <button
                onClick={() => alert(`Submitting candidate dossier to requisition #${req.id} under AuroPro Master Service Agreement.`)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1"
              >
                <span>Submit Candidate</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

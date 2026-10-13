import React, { useState } from 'react';
import { Agency, UserSession, SectorDetail } from '../types.ts';
import { 
  X, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Loader2, 
  Printer, 
  Check, 
  Sliders,
  Calendar,
  Users,
  Briefcase,
  Percent
} from 'lucide-react';

interface AgencyDetailModalProps {
  agency: Agency | null;
  sectors: SectorDetail[];
  user: UserSession | null;
  onClose: () => void;
  onStatusUpdate: (agencyId: string, status: string, remarks: string, tier?: string) => Promise<void>;
}

export const AgencyDetailModal: React.FC<AgencyDetailModalProps> = ({
  agency,
  sectors,
  user,
  onClose,
  onStatusUpdate,
}) => {
  if (!agency) return null;

  const [activeTab, setActiveTab] = useState<'dossier' | 'audit' | 'certificate'>('dossier');
  const [selectedStatus, setSelectedStatus] = useState(agency.status);
  const [remarks, setRemarks] = useState(agency.auditRemarks || '');
  const [selectedTier, setSelectedTier] = useState(agency.tier);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const sector = sectors.find(s => s.id === agency.sectorId);

  // Admin has complete control
  const canModifyStatus = user && user.role === 'ADMIN';

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await onStatusUpdate(agency.id, selectedStatus, remarks, selectedTier);
      setMessage('Vendor dossier updated & audit logs recorded successfully.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-8 max-h-[92vh] overflow-y-auto text-slate-800 dark:text-slate-100 transition-colors"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8">
          <div className="flex items-start gap-3">
            <img
              src={agency.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={agency.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 uppercase font-mono">
                  {sector?.shortName || agency.sectorId} Division
                </span>
                <span className="text-xs text-slate-400 font-mono">Ref: {agency.registrationNumber}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{agency.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Headquartered in {agency.headquarters} &bull; Empanelled {agency.appliedDate}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${
              agency.status === 'EMPANELLED' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
              agency.status === 'UNDER_REVIEW' ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
              agency.status === 'AUDIT_REQUIRED' ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' :
              'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
            }`}>
              {agency.status}
            </span>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">{agency.tier}</div>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-6 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'dossier'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Vendor Profile &amp; Capacity
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Super Admin Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('certificate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Empanelment Certificate</span>
          </button>
        </div>

        {/* TAB 1: DOSSIER */}
        {activeTab === 'dossier' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active Talent Pool</span>
                <div className="text-base font-extrabold text-slate-900 mt-1">{agency.candidatePoolSize}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Recruiter Team</span>
                <div className="text-base font-extrabold text-slate-900 mt-1">{agency.recruiterCount} Heads</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Bill Rate Markup</span>
                <div className="text-base font-extrabold text-orange-600 mt-1">{agency.billRateMarkup}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500">Audit Score</span>
                <div className="text-base font-extrabold text-emerald-600 mt-1">{agency.complianceScore}%</div>
              </div>
            </div>

            {/* Insurance & Legal Coverage */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Statutory Insurance & Co-Employment Indemnity</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400">E&O Professional Liability:</span>
                  <p className="font-bold text-slate-800">{agency.insuranceCoverage?.eAndO || '$5,000,000 Agg'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">General Commercial Liability:</span>
                  <p className="font-bold text-slate-800">{agency.insuranceCoverage?.generalLiability || '$2,000,000 Occ'}</p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Workers Compensation:</span>
                  <p className="font-bold text-emerald-700">{agency.insuranceCoverage?.workersComp || 'Statutory Limits Compliant'}</p>
                </div>
              </div>
            </div>

            {/* Accreditations & Certifications */}
            <div>
              <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Staffing Association Memberships & Certifications</h3>
              <div className="flex flex-wrap gap-2">
                {agency.certifications.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary Contact Person */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Vendor Partner Contact</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{agency.contactPerson.name}</p>
                <p className="text-xs text-slate-500">{agency.contactPerson.email} &bull; {agency.contactPerson.phone}</p>
              </div>
              <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
                E-Verify Enrolled: {agency.certifications.some(c => c.toLowerCase().includes('e-verify')) ? 'YES' : 'PENDING'}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: SUPER ADMIN CONTROLS */}
        {activeTab === 'audit' && (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
              <span className="font-bold">Super Administrator Supervisory Action:</span>
              <p className="mt-0.5 text-amber-800">
                You have primary authority to approve empanelment, promote/demote vendor tiers, mandate background audits, or reject non-compliant staffing suppliers.
              </p>
            </div>

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                {message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Empanelment Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="EMPANELLED">EMPANELLED (Approved for All Requisitions)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Statutory Verification Pending)</option>
                  <option value="AUDIT_REQUIRED">AUDIT_REQUIRED (Co-Employment / License Audit)</option>
                  <option value="REJECTED">REJECTED (Non-Compliant)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Supplier Tier Allocation
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option value="Tier-1 Strategic Vendor">Tier-1 Strategic Vendor (Top Priority)</option>
                  <option value="Tier-2 Preferred Vendor">Tier-2 Preferred Vendor (Standard)</option>
                  <option value="Associate Vendor">Associate Vendor (Niche / Ad-hoc)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Administrative Audit Remarks & Vetting Notes
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Specify insurance policy verification, W2 compliance audit notes, or SLA milestones..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Administrative Decision</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl border-2 border-slate-800 bg-[#fefefe] shadow-md text-center space-y-4 relative">
              <div className="flex items-center justify-center gap-2">
                <Award className="w-7 h-7 text-orange-600" />
                <span className="text-sm font-extrabold tracking-widest text-slate-900 uppercase">
                  AuroPro Staffing Governance Authority
                </span>
              </div>

              <div className="text-xs text-slate-500 uppercase tracking-widest">
                Certificate of Statutory Empanelment
              </div>

              <div className="py-2">
                <span className="text-xs text-slate-400">This certifies that</span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{agency.name}</h3>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  Registration Number: {agency.registrationNumber}
                </p>
              </div>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                has met all statutory vetting protocols, W2 indemnification standards, and insurance liability thresholds under the {sector?.name || 'AuroPro'} Division. Designated as a <strong>{agency.tier}</strong>.
              </p>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span>Verified by Super Admin Julian Sterling</span>
                <span>Status: {agency.status}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

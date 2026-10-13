import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  Users, 
  Award,
  Sparkles
} from 'lucide-react';
import { Agency, SectorDetail, SectorId, DivisionWorkRequest } from '../types.ts';
import { api } from '../services/api.ts';

interface RequestDivisionWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAgency: Agency;
  sectors: SectorDetail[];
  onRequestSubmitted: (request: DivisionWorkRequest) => void;
}

export const RequestDivisionWorkModal: React.FC<RequestDivisionWorkModalProps> = ({
  isOpen,
  onClose,
  currentAgency,
  sectors,
  onRequestSubmitted,
}) => {
  // Available sectors excluding the agency's currently assigned sector
  const availableSectors = sectors.filter(s => s.id !== currentAgency.sectorId);

  const [selectedSectorId, setSelectedSectorId] = useState<SectorId>(
    (availableSectors[0]?.id as SectorId) || 'healthcare'
  );
  const [recruiterCount, setRecruiterCount] = useState('6');
  const [candidatePoolSize, setCandidatePoolSize] = useState('4,500+ Verified Specialists');
  const [experienceSummary, setExperienceSummary] = useState(
    `We have an established talent pipeline and dedicated contingent recruitment team specialized in this division with 5+ years of Tier-1 placement experience.`
  );
  const [selectedCerts, setSelectedCerts] = useState<string[]>([
    'E-Verify Certified',
    'Statutory W2 Ready',
    'E&O Insured ($5M)'
  ]);
  const [newCert, setNewCert] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<DivisionWorkRequest | null>(null);

  if (!isOpen) return null;

  const currentSector = sectors.find(s => s.id === currentAgency.sectorId);
  const selectedSector = sectors.find(s => s.id === selectedSectorId);

  const handleAddCert = () => {
    if (newCert.trim() && !selectedCerts.includes(newCert.trim())) {
      setSelectedCerts([...selectedCerts, newCert.trim()]);
      setNewCert('');
    }
  };

  const handleRemoveCert = (certToRemove: string) => {
    setSelectedCerts(selectedCerts.filter(c => c !== certToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSectorId) {
      setErrorMessage('Please select a sector division.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.requestDivisionWork({
        agencyId: currentAgency.id,
        agencyName: currentAgency.name,
        currentSectorId: currentAgency.sectorId,
        requestedSectorId: selectedSectorId,
        requestedSectorName: selectedSector?.name || 'Specialized Staffing Division',
        recruiterCount: Number(recruiterCount) || 5,
        candidatePoolSize: candidatePoolSize.trim() || '3,000+ Candidates',
        certifications: selectedCerts,
        experienceSummary: experienceSummary.trim(),
      });

      setSuccessData(result.request);
      onRequestSubmitted(result.request);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit division work request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Request for Additional Division Work
              </h3>
              <p className="text-xs text-slate-300">
                Submit formal expansion petition for Super Admin empanelment review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[38px] min-h-[38px] rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {successData ? (
            <div className="space-y-5 py-2 animate-in zoom-in-95 text-center">
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Expansion Request Submitted!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                  Your formal request to service the <strong className="text-emerald-900 dark:text-white">{successData.requestedSectorName}</strong> division has been submitted to Super Admin Julian Sterling.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Request Reference</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{successData.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Current Assigned Division</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentSector?.shortName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Requested Division</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">{successData.requestedSectorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                    Under Super Admin Review (24h SLA)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Return to Vendor Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Current Status Info */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold block uppercase">Current Assigned Division</span>
                  <strong className="text-slate-900 dark:text-white text-sm">{currentSector?.name} ({currentSector?.code})</strong>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  Empanelled Supplier
                </span>
              </div>

              {/* Target Division Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Additional Division You Wish to Service *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSectors.map((sector) => {
                    const isSelected = selectedSectorId === sector.id;
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => setSelectedSectorId(sector.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isSelected ? 'bg-blue-600' : 'bg-slate-400'}`} />
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{sector.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sector.code} &bull; {sector.kpis.complianceRate}% Compliance Benchmark</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recruiter Capacity & Candidate Pool */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Dedicated Recruiters for Division
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    value={recruiterCount}
                    onChange={(e) => setRecruiterCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                    placeholder="e.g. 6"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Active Candidate Talent Pool Size
                  </label>
                  <input
                    type="text"
                    required
                    value={candidatePoolSize}
                    onChange={(e) => setCandidatePoolSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                    placeholder="e.g. 5,000+ Verified Specialists"
                  />
                </div>
              </div>

              {/* Experience Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Domain Experience & Business Rationale *
                </label>
                <textarea
                  rows={3}
                  required
                  value={experienceSummary}
                  onChange={(e) => setExperienceSummary(e.target.value)}
                  placeholder="Detail your track record, client placements, and recruitment competency in this target division..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
                />
              </div>

              {/* Certifications & Attestations */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Division Specific Certifications & Compliance Standing
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedCerts.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                    >
                      <span>{cert}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(cert)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    placeholder="e.g. Joint Commission Certified, OSHA-30, ACAMS"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Petition...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Division Work Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

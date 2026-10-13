import React from 'react';
import { 
  X, 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2,
  Calendar,
  FileText
} from 'lucide-react';
import { StaffingRequisition } from '../types.ts';

interface JobDetailsModalProps {
  requisition: StaffingRequisition | null;
  onClose: () => void;
  onSubmitCandidate: (req: StaffingRequisition) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  requisition,
  onClose,
  onSubmitCandidate,
}) => {
  if (!requisition) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold uppercase">
                {requisition.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold">
                {requisition.clientName}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                requisition.priority === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border border-red-400/30' :
                requisition.priority === 'HIGH' ? 'bg-orange-500/30 text-orange-300 border border-orange-400/30' :
                'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30'
              }`}>
                {requisition.priority} PRIORITY
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
              {requisition.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-w-[38px] min-h-[38px] rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5 sm:space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-semibold">Bill Rate Range</span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold">{requisition.billRateRange}</strong>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-semibold">Open Positions</span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold">{requisition.positionsNeeded} Openings</strong>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-semibold">Location / Policy</span>
              <strong className="text-slate-900 dark:text-white text-xs sm:text-sm font-extrabold">{requisition.remoteType}</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{requisition.location}</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] text-slate-400 dark:text-slate-400 block font-semibold">Response SLA</span>
              <strong className="text-orange-600 dark:text-orange-400 text-xs sm:text-sm font-extrabold">{requisition.slaHours}h SLA</strong>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Fast-Track Vetting</span>
            </div>
          </div>

          {/* Role Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Job Requisition Overview & Responsibilities</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              {requisition.description || `Responsible for delivering specialized technical outcomes for ${requisition.clientName}. The selected contingent candidate will integrate into the engineering sprint cadence, adhere to statutory compliance guidelines, and meet client velocity expectations.`}
            </p>
          </div>

          {/* Primary & Secondary Skills */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Mandatory Skill Competencies & Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {requisition.primarySkills.map(skill => (
                <span key={skill} className="px-2.5 sm:px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Compliance & Attestation Standards */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1.5 sm:space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Empanelled Supplier Submission Protocols</span>
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-normal">
              Candidates submitted by empanelled partners must be pre-cleared for E-Verify statutory work authorization. Candidate documents (Resume/CV, Work Authorization, Certifications) must be attached with submittal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Status: <span className="font-bold text-emerald-700 dark:text-emerald-400">Active Order &bull; Ready for Submissions</span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 min-h-[40px] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onSubmitCandidate(requisition);
              }}
              className="px-5 py-2.5 min-h-[40px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Candidate Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

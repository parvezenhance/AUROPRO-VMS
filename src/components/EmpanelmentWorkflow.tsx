import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Users, 
  FileCheck2, 
  Sliders, 
  Building2, 
  Scale, 
  Percent,
  ArrowRight
} from 'lucide-react';

interface EmpanelmentWorkflowProps {
  onRegisterAgency?: () => void;
  onNavigateToAdmin?: () => void;
}

export const EmpanelmentWorkflow: React.FC<EmpanelmentWorkflowProps> = ({
  onRegisterAgency,
  onNavigateToAdmin,
}) => {
  const stages = [
    {
      step: '01',
      title: 'Corporate Legitimacy & W2 Solvency',
      role: 'Compliance & Legal Cell',
      desc: 'Mandatory verification of active state staffing vendor licenses, federal FEIN, E-Verify corporate enrollment, and certificate of good standing.',
      deliverables: ['Active E-Verify MOU', 'W2 Employer of Record Verification', 'Clean Statutory Tax Clearance'],
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      step: '02',
      title: 'Candidate Bench & Recruiter Capacity',
      role: 'Staffing Evaluation Panel',
      desc: 'Rigorous assessment of pre-vetted active talent pools, recruiter headcount, average time-to-submit SLAs, and specialized technical screening tests.',
      deliverables: ['Verified Bench > 500+ Profiles', 'Technical Skill Validation Tools', '48h Submission SLA Commitment'],
      tagColor: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      step: '03',
      title: 'Insurance & Co-Employment Protection',
      role: 'Risk Management Cell',
      desc: 'Validation of $5M Errors & Omissions, $2M Commercial General Liability, and comprehensive Workers Compensation policies shielding clients from co-employment risk.',
      deliverables: ['$5,000,000 E&O Policy ACORD', '$2,000,000 General Liability', 'Client Co-Employment Indemnity'],
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      step: '04',
      title: 'Super Admin Approval & Rate Lock',
      role: 'Super Administrator',
      desc: 'Central administrator reviews the full dossier, sets maximum bill rate markup caps (e.g. 22%), assigns Supplier Tier status, and provisions VMS credentials.',
      deliverables: ['Official Empanelment ID', 'Supplier Tier 1 / 2 Assignment', 'Governed Rate Card Enlistment'],
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#fafaf8] dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-xs font-bold text-orange-900 dark:text-orange-300 mb-3">
            <Sliders className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>AuroPro Governance Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            4-Stage Vendor Empanelment Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
            Ensuring every vendor is comprehensively audited for insurance coverage, legal compliance, and governed rate markups under Super Admin control.
          </p>
        </div>

        {/* 4-Step Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stages.map((stage) => (
            <div
              key={stage.step}
              className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-extrabold font-mono text-slate-300 dark:text-slate-700">
                    {stage.step}
                  </span>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${stage.tagColor}`}>
                    {stage.role}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-2 leading-snug">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {stage.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Required Gates:</div>
                {stage.deliverables.map((del, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">{del}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-8 sm:mt-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Are you a Vendor or Client?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Apply today for statutory empanelment or enroll your client hiring division.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            {onRegisterAgency && (
              <button
                onClick={onRegisterAgency}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors text-center cursor-pointer min-h-[40px] flex items-center justify-center"
              >
                Apply for Vendor Empanelment
              </button>
            )}
            {onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white transition-colors text-center cursor-pointer min-h-[40px] flex items-center justify-center"
              >
                Open Super Admin Controls
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

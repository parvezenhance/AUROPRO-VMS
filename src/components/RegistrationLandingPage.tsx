import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Award, 
  TrendingUp, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Sliders, 
  Check, 
  AlertCircle,
  ExternalLink,
  Layers
} from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { AuroNavigationHubIcon } from './AuroNavigationHubIcon.tsx';
import { SectorDetail, SectorId, AgencyRegistrationPayload, ClientRegistrationPayload, UserSession } from '../types.ts';
import { api } from '../services/api.ts';

interface RegistrationLandingPageProps {
  sectors: SectorDetail[];
  activeView?: string;
  initialTab?: 'agency' | 'client';
  showHeaderBar?: boolean;
  onNavigate: (view: string, param?: string) => void;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onQuickLoginAsAdmin: () => void;
  onRegistrationComplete?: (type: 'agency' | 'client', record: any) => void;
}

export const RegistrationLandingPage: React.FC<RegistrationLandingPageProps> = ({
  sectors,
  initialTab = 'agency',
  showHeaderBar = false,
  onNavigate,
  currentUser,
  onOpenLogin,
  onLogout,
  onQuickLoginAsAdmin,
  onRegistrationComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'agency' | 'client'>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    type: 'agency' | 'client';
    name: string;
    refNumber: string;
  } | null>(null);

  // Vendor Form State
  const [agencyForm, setAgencyForm] = useState<AgencyRegistrationPayload>({
    agencyName: '',
    registrationNumber: '',
    sectorId: 'it_cloud',
    subCategory: '',
    recruiterCount: 15,
    candidatePoolSize: '10,000+ Pre-vetted Candidates',
    billRateMarkup: '18% - 22%',
    eAndOInsurance: '$5,000,000',
    generalLiability: '$3,000,000',
    workersComp: '$1,000,000 (Statutory)',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    headquarters: '',
    certifications: ['E-Verify Certified', 'ASA Member'],
    taxIdOrEin: '',
  });

  // Client Form State
  const [clientForm, setClientForm] = useState<ClientRegistrationPayload>({
    companyName: '',
    sectorId: 'it_cloud',
    industry: 'Enterprise Software & Cloud',
    annualContingentBudget: '$25,000,000 - $50,000,000',
    currentMspVms: 'SAP Fieldglass',
    immediateNeeds: '5x Senior Full-Stack Cloud & DevOps Architects',
    openPositionsCount: 5,
    requiredSla: 24,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    headquarters: '',
  });

  // Autofill Demo Agency
  const handleAutofillAgency = () => {
    setAgencyForm({
      agencyName: 'Horizon Talent Solutions Group',
      registrationNumber: `STAFF-REG-${Math.floor(100000 + Math.random() * 900000)}`,
      sectorId: 'it_cloud',
      subCategory: 'Cloud DevOps, AI Engineering & Cybersecurity Staffing',
      recruiterCount: 38,
      candidatePoolSize: '22,000+ Vetted Tech Contractors',
      billRateMarkup: '19% - 23%',
      eAndOInsurance: '$5,000,000',
      generalLiability: '$4,000,000',
      workersComp: '$2,000,000 (Statutory)',
      contactName: 'Alexandra Reed',
      contactEmail: 'a.reed@horizontsg.com',
      contactPhone: '+1 (415) 628-9901',
      headquarters: 'San Francisco, CA',
      certifications: ['E-Verify Certified', 'TechServe Alliance', 'ISO 9001:2015', 'SOC 2 Type II Verified'],
      taxIdOrEin: 'EIN-82-9014582',
    });
  };

  // Autofill Demo Client
  const handleAutofillClient = () => {
    setClientForm({
      companyName: 'Starlight Bioscience Technologies',
      sectorId: 'healthcare',
      industry: 'Biotech & Clinical Research Systems',
      annualContingentBudget: '$40,000,000',
      currentMspVms: 'Beeline Contingent',
      immediateNeeds: '8x Clinical Data Scientists & Biostatistics Analysts',
      openPositionsCount: 8,
      requiredSla: 24,
      contactName: 'Marcus Holloway, VP Talent',
      contactEmail: 'm.holloway@starlightbio.com',
      contactPhone: '+1 (617) 882-9041',
      headquarters: 'Cambridge, MA',
    });
  };

  const handleAgencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyForm.agencyName || !agencyForm.contactEmail) {
      alert('Please fill in the Agency Name and Contact Email');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerAgency(agencyForm);
      setSubmissionSuccess({
        type: 'agency',
        name: res.agency.name,
        refNumber: res.agency.registrationNumber,
      });
      if (onRegistrationComplete) onRegistrationComplete('agency', res.agency);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.companyName || !clientForm.contactEmail) {
      alert('Please fill in Company Name and Contact Email');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerClient(clientForm);
      setSubmissionSuccess({
        type: 'client',
        name: res.client.companyName,
        refNumber: `CLIENT-${res.client.id.toUpperCase()}`,
      });
      if (onRegistrationComplete) onRegistrationComplete('client', res.client);
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="auropro-landing-registration-page" className="min-h-screen bg-[#fafaf8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 relative selection:bg-orange-500 selection:text-white transition-colors">
      
      {/* Floating Theme Toggle when top bar is not rendered */}
      {!showHeaderBar && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
          <ThemeToggle variant="button" />
        </div>
      )}

      {/* Optional Top Bar if rendered without main Navbar */}
      {showHeaderBar && (
        <div className="w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo with Subtitle */}
            <div className="cursor-pointer" onClick={() => onNavigate('divisions', 'all')}>
              <BrandLogo size="md" showTagline={true} />
            </div>

            {/* Right Action: Theme Toggle + Navigation Hub Icon */}
            <div className="flex items-center gap-2.5">
              <ThemeToggle variant="button" />

              {/* Navigation Hub Icon */}
              <AuroNavigationHubIcon
                activeView="registration"
                onNavigate={onNavigate}
                currentUser={currentUser}
                onOpenLogin={onOpenLogin}
                onLogout={onLogout}
                onQuickLoginAsAdmin={onQuickLoginAsAdmin}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Presentation with Stock Visuals and Value Proposition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 sm:pt-8 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Text & Value Metrics */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>AuroPro Contingent Workforce Empanelment</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-700 font-semibold">Enterprise Governed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Where Top Staffing Vendors Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-blue-600 to-emerald-600">Clients</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
              AuroPro is the unified contingent staffing empanelment ecosystem. Supervised by an automated governance engine overseeing statutory compliance, rate card markups, and client SLA fulfillments across 6 specialized industry divisions.
            </p>

            {/* Visual Highlights Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
              <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-xl sm:text-2xl font-extrabold text-orange-600">1,340+</div>
                <div className="text-xs font-semibold text-slate-700">Empanelled Vendors</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Vetted W2 &amp; E&amp;O standards</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                <div className="text-xl sm:text-2xl font-extrabold text-blue-600">480+</div>
                <div className="text-xs font-semibold text-slate-700">Active Clients</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Fortune 1000 &amp; Health Systems</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs col-span-2 sm:col-span-1">
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-600">&lt; 36 Hours</div>
                <div className="text-xs font-semibold text-slate-700">Avg Time-to-Submit</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Rapid SLA fulfillment</div>
              </div>
            </div>

            {/* Quick Link to Staffing Divisions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-500">6 Specialized Divisions:</span>
              {sectors.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate('divisions', s.id)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                >
                  {s.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Right Visual Stock Photo Showcase with Live Telemetry Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
              {/* Professional Recruitment Stock Image */}
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                alt="AuroPro Staffing Vendors and Clients in Strategy Session"
                className="w-full h-64 sm:h-80 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Inset Badge Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-300">
                    AuroPro Governance Hub
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live SLA Monitoring
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold leading-snug">
                  Audited Staffing Supply Chains with Real-time Rate Transparency
                </h2>
                <div className="mt-2 flex items-center justify-between text-[11px] sm:text-xs text-slate-200 border-t border-white/20 pt-2">
                  <span>98.4% Average Compliance Score</span>
                  <span className="font-semibold text-orange-300">$2.85B Contingent Volume</span>
                </div>
              </div>
            </div>

            {/* Governance Assurance Card */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Automated Statutory Governance</div>
                  <div className="text-[11px] text-slate-400">Pre-cleared E&amp;O $5M, E-Verify, and standardized rate caps</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED REGISTRATION PORTAL: SEPARATE TABS FOR AGENCIES & CLIENTS */}
      <div id="registration-forms-section" className="max-w-5xl mx-auto px-3 sm:px-8 pb-16 sm:pb-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header Switcher: Vendor vs Client */}
          <div className="p-4 sm:p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Official Empanelment Gateway
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                Separate Registration Portal
              </h2>
            </div>

            {/* Dual Tab Buttons */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 border border-slate-300/60 w-full sm:w-auto">
              <button
                id="tab-register-agency"
                type="button"
                onClick={() => {
                  setActiveTab('agency');
                  setSubmissionSuccess(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'agency'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>For Vendors</span>
              </button>

              <button
                id="tab-register-client"
                type="button"
                onClick={() => {
                  setActiveTab('client');
                  setSubmissionSuccess(null);
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'client'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>For Clients</span>
              </button>
            </div>
          </div>

          {/* Submission Success Alert */}
          {submissionSuccess && (
            <div className="m-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 animate-in fade-in duration-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                    <span>Registration Lodged</span>
                    <span>•</span>
                    <span>Ref: {submissionSuccess.refNumber}</span>
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">
                    {submissionSuccess.name} Successfully Registered!
                  </h3>
                  <p className="text-sm text-emerald-800 mt-1">
                    Your {submissionSuccess.type === 'agency' ? 'vendor empanelment dossier' : 'client contingent hiring account'} is submitted directly to the <strong>AuroPro Governance Directorate</strong>. Statutory audit and rate card alignment are initiated under 24-hour turnaround.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => onNavigate('divisions')}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Explore Staffing Divisions</span>
                    </button>
                    <button
                      onClick={() => onNavigate('requisitions')}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>View Active Requisitions</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM 1: VENDOR REGISTRATION */}
          {activeTab === 'agency' && !submissionSuccess && (
            <form onSubmit={handleAgencySubmit} className="p-6 sm:p-8 space-y-6">
              {/* Header inside Vendor Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Vendor Empanelment Application
                  </h3>
                  <p className="text-xs text-slate-500">
                    Join the verified supplier network for Fortune 1000 & Healthcare contingent staffing.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-autofill-demo-agency"
                  onClick={handleAutofillAgency}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Autofill Demo Vendor</span>
                </button>
              </div>

              {/* Vendor Core Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vendor Legal Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyForm.agencyName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                    placeholder="e.g. Apex Tech Talent Partners Inc."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Staffing Specialization *
                  </label>
                  <select
                    value={agencyForm.sectorId}
                    onChange={(e) => setAgencyForm({ ...agencyForm, sectorId: e.target.value as SectorId })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  >
                    {sectors.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sub-Specialty Focus Area
                  </label>
                  <input
                    type="text"
                    value={agencyForm.subCategory}
                    onChange={(e) => setAgencyForm({ ...agencyForm, subCategory: e.target.value })}
                    placeholder="e.g. Cloud Kubernetes SRE, Travel ICU RNs, ITAR Engineers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    EIN / Tax Registration Number
                  </label>
                  <input
                    type="text"
                    value={agencyForm.taxIdOrEin}
                    onChange={(e) => setAgencyForm({ ...agencyForm, taxIdOrEin: e.target.value })}
                    placeholder="e.g. EIN-12-3456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Staffing Capacity & Economics */}
              <div className="p-4 rounded-2xl bg-orange-50/40 border border-orange-100">
                <div className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-3">
                  Agency Capacity & Commercial Terms
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full-Time Recruiter Headcount
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={agencyForm.recruiterCount}
                      onChange={(e) => setAgencyForm({ ...agencyForm, recruiterCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Active Candidate Bench / Pool Size
                    </label>
                    <input
                      type="text"
                      value={agencyForm.candidatePoolSize}
                      onChange={(e) => setAgencyForm({ ...agencyForm, candidatePoolSize: e.target.value })}
                      placeholder="e.g. 15,000+ Vetted Candidates"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Standard Bill Rate Markup %
                    </label>
                    <input
                      type="text"
                      value={agencyForm.billRateMarkup}
                      onChange={(e) => setAgencyForm({ ...agencyForm, billRateMarkup: e.target.value })}
                      placeholder="e.g. 18% - 22%"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Statutory Insurance Limits */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Insurance & Statutory Protection</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Audited by Admin
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Errors & Omissions (E&O)
                    </label>
                    <select
                      value={agencyForm.eAndOInsurance}
                      onChange={(e) => setAgencyForm({ ...agencyForm, eAndOInsurance: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="$3,000,000">$3,000,000</option>
                      <option value="$5,000,000">$5,000,000 (Recommended)</option>
                      <option value="$10,000,000">$10,000,000 (Enterprise Grade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      General Commercial Liability
                    </label>
                    <select
                      value={agencyForm.generalLiability}
                      onChange={(e) => setAgencyForm({ ...agencyForm, generalLiability: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="$2,000,000">$2,000,000</option>
                      <option value="$3,000,000">$3,000,000</option>
                      <option value="$5,000,000">$5,000,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Worker's Comp Coverage
                    </label>
                    <input
                      type="text"
                      value={agencyForm.workersComp}
                      onChange={(e) => setAgencyForm({ ...agencyForm, workersComp: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Agency Executive Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Executive Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={agencyForm.contactName}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contactName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={agencyForm.contactEmail}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contactEmail: e.target.value })}
                    placeholder="contact@agency.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={agencyForm.contactPhone}
                    onChange={(e) => setAgencyForm({ ...agencyForm, contactPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Headquarters City, State
                  </label>
                  <input
                    type="text"
                    value={agencyForm.headquarters}
                    onChange={(e) => setAgencyForm({ ...agencyForm, headquarters: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Subject to Super Admin audit and statutory compliance scrutiny</span>
                </div>

                <button
                  type="submit"
                  id="btn-submit-agency-registration"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Vendor...' : 'Submit Vendor Application'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* FORM 2: CLIENT REGISTRATION */}
          {activeTab === 'client' && !submissionSuccess && (
            <form onSubmit={handleClientSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Header inside Client Tab */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Client Enrollment Portal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gain immediate access to pre-vetted staffing vendor suppliers with guaranteed SLAs.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-autofill-demo-client"
                  onClick={handleAutofillClient}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Autofill Demo Client</span>
                </button>
              </div>

              {/* Client Organization Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Client Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientForm.companyName}
                    onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
                    placeholder="e.g. Nexus Global Technology Corp."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Industry Sector *
                  </label>
                  <select
                    value={clientForm.sectorId}
                    onChange={(e) => setClientForm({ ...clientForm, sectorId: e.target.value as SectorId })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    {sectors.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Annual Contingent Spend Budget
                  </label>
                  <select
                    value={clientForm.annualContingentBudget}
                    onChange={(e) => setClientForm({ ...clientForm, annualContingentBudget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="$5,000,000 - $15,000,000">$5,000,000 - $15,000,000</option>
                    <option value="$15,000,000 - $50,000,000">$15,000,000 - $50,000,000</option>
                    <option value="$50,000,000 - $100,000,000+">$50,000,000 - $100,000,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current MSP / VMS Solution
                  </label>
                  <select
                    value={clientForm.currentMspVms}
                    onChange={(e) => setClientForm({ ...clientForm, currentMspVms: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="SAP Fieldglass">SAP Fieldglass</option>
                    <option value="Beeline VMS">Beeline VMS</option>
                    <option value="Coupa Contingent">Coupa Contingent</option>
                    <option value="Direct Sourcing Platform">Direct Sourcing Platform</option>
                    <option value="No Current VMS (Direct Agency Management)">No Current VMS (Direct Agency Management)</option>
                  </select>
                </div>
              </div>

              {/* Immediate Contingent Demand */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100">
                <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-3">
                  Immediate Staffing Demand & SLA Requirements
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Immediate Requisition Description / Skill Needs
                    </label>
                    <input
                      type="text"
                      value={clientForm.immediateNeeds}
                      onChange={(e) => setClientForm({ ...clientForm, immediateNeeds: e.target.value })}
                      placeholder="e.g. 5x Kubernetes Cloud Architects or 10x ICU Travel Nurses"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Required Agency SLA Turnaround
                    </label>
                    <select
                      value={clientForm.requiredSla}
                      onChange={(e) => setClientForm({ ...clientForm, requiredSla: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value={12}>12 Hours (Urgent Healthcare / Critical Ops)</option>
                      <option value={24}>24 Hours (Standard Tech / Engineering)</option>
                      <option value={48}>48 Hours (Executive / Specialized)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Client Talent Acquisition Lead */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Executive Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientForm.contactName}
                    onChange={(e) => setClientForm({ ...clientForm, contactName: e.target.value })}
                    placeholder="e.g. David K. Vance, VP"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientForm.contactEmail}
                    onChange={(e) => setClientForm({ ...clientForm, contactEmail: e.target.value })}
                    placeholder="talent@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="tel"
                    value={clientForm.contactPhone}
                    onChange={(e) => setClientForm({ ...clientForm, contactPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Corporate Headquarters
                  </label>
                  <input
                    type="text"
                    value={clientForm.headquarters}
                    onChange={(e) => setClientForm({ ...clientForm, headquarters: e.target.value })}
                    placeholder="e.g. San Jose, CA"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Instant access to Tier-1 Strategic staffing suppliers upon approval</span>
                </div>

                <button
                  type="submit"
                  id="btn-submit-client-registration"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Client...' : 'Enroll Client Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER CALLOUT: Admin Controlled Statement & Quick Navigation Footnotes */}
      <footer className="w-full bg-slate-900 text-slate-400 py-8 px-4 sm:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showTagline={false} lightMode={false} />
            <div className="text-xs text-slate-400">
              <span className="font-bold text-white">AuroPro</span> &bull; Designed for Vendors &amp; Clients &bull; Governed by Super Admin Directorate
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button 
              onClick={() => onNavigate('divisions')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Staffing Divisions
            </button>
            <button 
              onClick={() => onNavigate('agencies')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Vendor Directory
            </button>
            <button 
              onClick={() => onNavigate('requisitions')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Client Requisitions
            </button>
            <button 
              onClick={() => onNavigate('workflow')} 
              className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
            >
              Empanelment SLAs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

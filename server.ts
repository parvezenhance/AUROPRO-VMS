import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  SectorDetail, 
  Agency, 
  ClientProfile,
  StaffingRequisition,
  RealtimeStats, 
  UserSession, 
  SectorId,
  AgencyRegistrationPayload,
  ClientRegistrationPayload,
  CreateUserCredentialPayload,
  ProvisionedUser,
  DivisionWorkRequest
} from './src/types.ts';

const appDir = typeof import.meta !== 'undefined' && import.meta.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd();

// In-memory Division Work Requests
const DIVISION_REQUESTS_DATA: DivisionWorkRequest[] = [
  {
    id: 'div_req_01',
    agencyId: 'ag_it_01',
    agencyName: 'Apex Tech Talent Partners',
    currentSectorId: 'it_cloud',
    requestedSectorId: 'bfsi_finance',
    requestedSectorName: 'Banking, Financial Services & Insurance (BFSI)',
    recruiterCount: 8,
    candidatePoolSize: '4,500+ FinTech & Quant Engineers',
    certifications: ['E-Verify Certified', 'FinTech Security Cleared', 'ACAMS Familiar'],
    experienceSummary: 'Supplying algorithmic developers and fraud prevention analysts to Tier-1 financial institutions for 4 years.',
    status: 'PENDING_REVIEW',
    submittedDate: 'Yesterday',
  }
];

// Pre-seeded Users with Admin holding full controls
const DEMO_USERS: Record<string, { password: string; user: Omit<UserSession, 'token'> }> = {
  'admin@auropro.com': {
    password: 'admin',
    user: {
      id: 'usr_admin_master',
      name: 'Julian Sterling',
      email: 'admin@auropro.com',
      role: 'ADMIN',
      roleTitle: 'Master Platform Administrator & Contingent Governance Chief',
    },
  },
  'agency@apexstaffing.com': {
    password: 'agency',
    user: {
      id: 'usr_agency_01',
      name: 'Elena Rostova',
      email: 'agency@apexstaffing.com',
      role: 'AGENCY',
      roleTitle: 'Managing Partner, Apex Tech Talent Partners',
      agencyId: 'ag_it_01',
      assignedSector: 'it_cloud' as SectorId,
    },
  },
  'client@nexustech.com': {
    password: 'client',
    user: {
      id: 'usr_client_01',
      name: 'David K. Vance',
      email: 'client@nexustech.com',
      role: 'CLIENT',
      roleTitle: 'VP Global Talent Acquisition, Nexus Enterprise Cloud',
      clientId: 'cl_01',
      assignedSector: 'it_cloud' as SectorId,
    },
  },
};

// 6 Staffing Industry Specialization Sectors
const SECTORS_DATA: SectorDetail[] = [
  {
    id: 'it_cloud',
    name: 'Information Technology, Cloud & AI Talent',
    shortName: 'IT & Cloud Staffing',
    code: 'STAFF-ITC',
    iconName: 'Server',
    tagline: 'Full-stack engineers, AI/ML researchers, Cloud architects & Cyber-sec squads',
    description: 'Empanelling verified staffing agencies specialized in high-demand software engineering, Kubernetes/DevOps, generative AI architectures, and cyber incident defense with strict IP assignment and background checks.',
    stockImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-blue-500/10 text-blue-700 border-blue-300',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      bg: 'from-blue-50/70 via-white to-orange-50/40',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    regulatoryBodies: ['TechServe Alliance', 'SIA (Staffing Industry Analysts)', 'E-Verify Federal', 'US Dept of Labor'],
    mandatoryCertifications: ['E-Verify Authorized Agency', 'ISO 9001:2015 Quality Recruiter', 'Comprehensive Cyber E&O Insurance ($5M)', 'W2 Statutory Payroll Compliance'],
    kpis: {
      totalAgencies: 340,
      empanelledCount: 228,
      underReviewCount: 64,
      avgVettingDays: 7.5,
      complianceRate: 98.4,
      annualPlacementVolume: '$420 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'Agency License & W2 Compliance', description: 'Review of state employment licenses, tax withholding standing, and federal E-Verify integration.', avgDuration: '2 Days', leadRole: 'Legal Auditor' },
      { stageNumber: 2, title: 'Technical Screening & Code Audit Protocol', description: 'Evaluation of proprietary candidate testing platforms, AI proctoring, and skill validation accuracy.', avgDuration: '3 Days', leadRole: 'Tech Assessment Board' },
      { stageNumber: 3, title: 'Insurance & Cyber Liability Attestation', description: 'Verification of minimum $5,000,000 E&O, general liability, and intellectual property indemnity coverage.', avgDuration: '2 Days', leadRole: 'Risk Officer' },
      { stageNumber: 4, title: 'Master Services Agreement & Tier Assignment', description: 'Approval of maximum bill rate markups, SLA fulfillment guarantee (under 48h), and client portal rollout.', avgDuration: '1.5 Days', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'Misclassification & 1099 vs W2 Co-Employment', weight: 40, riskScore: 12, status: 'nominal' },
      { category: 'Contractor Intellectual Property Assignment', weight: 30, riskScore: 18, status: 'nominal' },
      { category: 'Cybersecurity E&O / Data Breach Coverage', weight: 20, riskScore: 24, status: 'nominal' },
      { category: 'Candidate Submittal-to-Interview Attrition', weight: 10, riskScore: 32, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-01', date: 'Sept 19, 2026', title: 'Q4 Enterprise Cloud Architect contingent demand surge (+38% YoY)', type: 'procurement' },
      { id: 'sb-02', date: 'Sept 10, 2026', title: 'Updated W2 payroll compliance audit requirement for offshore developer benches', type: 'regulatory' },
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare, Clinical & Nursing Staffing',
    shortName: 'Healthcare & Nursing',
    code: 'STAFF-HLT',
    iconName: 'HeartPulse',
    tagline: 'Travel nurses, locum tenens, ICU specialists & clinical laboratory personnel',
    description: 'Accreditation for specialized healthcare staffing agencies providing verified RNs, nurse practitioners, surgical techs, and locum tenens physicians with stringent Joint Commission and state licensing checks.',
    stockImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
      accent: 'text-emerald-700',
      border: 'border-emerald-200',
      bg: 'from-emerald-50/70 via-white to-blue-50/40',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    regulatoryBodies: ['The Joint Commission (TJC)', 'National Association of Travel Healthcare Organizations (NATHO)', 'State Nursing Boards', 'HIPAA'],
    mandatoryCertifications: ['Joint Commission Healthcare Staffing Certification', 'OIG/SAM Exclusion Clearance', 'Malpractice Insurance ($3M/$5M)', 'HIPAA Compliance Badge'],
    kpis: {
      totalAgencies: 290,
      empanelledCount: 195,
      underReviewCount: 58,
      avgVettingDays: 9.0,
      complianceRate: 99.2,
      annualPlacementVolume: '$680 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'Joint Commission & Credentialing Audit', description: 'Review of primary source license verification, immunization records, and drug screening protocols.', avgDuration: '3 Days', leadRole: 'Clinical Auditor' },
      { stageNumber: 2, title: 'Malpractice & Clinical Indemnity Review', description: 'Detailed scrutiny of professional liability insurance, claims history, and shift no-show rate benchmarks.', avgDuration: '3 Days', leadRole: 'Risk Underwriter' },
      { stageNumber: 3, title: 'Clinical Competency & OIG Screening', description: 'Background checks across national practitioner databank, OIG exclusions, and ACLS/BLS certifications.', avgDuration: '2.5 Days', leadRole: 'Credentialing Lead' },
      { stageNumber: 4, title: 'Hospital Network Empanelment & VMS Linkage', description: 'Integration with client hospital VMS portals and rapid 24-hour shift dispatch clearance.', avgDuration: '1.5 Days', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'Clinical Credential Expiration & State Reciprocity', weight: 45, riskScore: 8, status: 'nominal' },
      { category: 'HIPAA Patient Privacy & Chart Access Protocols', weight: 30, riskScore: 14, status: 'nominal' },
      { category: 'Shift Absenteeism & Short-Notice Cancellation', weight: 15, riskScore: 29, status: 'nominal' },
      { category: 'Worker Compensation Exposure in Acute Care', weight: 10, riskScore: 21, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-03', date: 'Sept 18, 2026', title: 'Winter peak ICU travel nurse master agreement opened for 42 regional health systems', type: 'procurement' },
      { id: 'sb-04', date: 'Sept 06, 2026', title: 'Mandatory digital verification of multi-state NLC licenses via Nursys API', type: 'regulatory' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering, Aerospace & Industrial Technical',
    shortName: 'Engineering & Technical',
    code: 'STAFF-ENG',
    iconName: 'Cog',
    tagline: 'CAD/CAM designers, aerospace propulsion specialists, robotics & site engineers',
    description: 'Empanelling agencies that deploy security-cleared defense engineers, hardware validation testers, civil project directors, and automation controls technicians for critical infrastructure.',
    stockImageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-orange-500/10 text-orange-700 border-orange-300',
      accent: 'text-orange-600',
      border: 'border-orange-200',
      bg: 'from-orange-50/70 via-white to-blue-50/40',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    regulatoryBodies: ['National Society of Professional Engineers (NSPE)', 'ITAR Defense Standards', 'OSHA Technical', 'ASME Quality'],
    mandatoryCertifications: ['ITAR Registered Supplier Capability', 'OSHA 30 Safety Supervisor On Staff', 'PE (Professional Engineer) Licensure Tracking', 'ISO 9001:2015 Recruiter'],
    kpis: {
      totalAgencies: 210,
      empanelledCount: 142,
      underReviewCount: 42,
      avgVettingDays: 11.2,
      complianceRate: 95.8,
      annualPlacementVolume: '$310 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'ITAR Clearance & Defense Compliance', description: 'Review of citizenship documentation, export control compliance, and security clearance vetting pipelines.', avgDuration: '4 Days', leadRole: 'Security Officer' },
      { stageNumber: 2, title: 'Technical Tooling & CAD Proficiency Tests', description: 'Validation of agency testing for SolidWorks, CATIA, MATLAB, PLC programming, and finite element modeling.', avgDuration: '4 Days', leadRole: 'Engineering Evaluator' },
      { stageNumber: 3, title: 'HSE Safety Records & Site Insurance', description: 'Validation of OSHA incident rates, high-voltage site endorsements, and field liability coverage.', avgDuration: '2.5 Days', leadRole: 'Safety Auditor' },
      { stageNumber: 4, title: 'Strategic Vendor Agreement Execution', description: 'Approved supplier tier placement, standard rate card adherence, and rapid engineering dispatch.', avgDuration: '1.5 Days', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'ITAR & Export Defense Data Violations', weight: 40, riskScore: 16, status: 'nominal' },
      { category: 'On-Site Industrial HSE Accidents & Liability', weight: 30, riskScore: 22, status: 'nominal' },
      { category: 'Skill Mismatch in High-Tolerance Manufacturing', weight: 20, riskScore: 28, status: 'nominal' },
      { category: 'Overtime & FLSA Exemption Classification', weight: 10, riskScore: 19, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-05', date: 'Sept 15, 2026', title: 'Automotive EV battery plant expansion seeks 150+ automation controls engineers', type: 'procurement' },
      { id: 'sb-06', date: 'Sept 02, 2026', title: 'Updated guidelines for dual-citizen contractor security clearance submittals', type: 'regulatory' },
    ],
  },
  {
    id: 'bfsi_finance',
    name: 'BFSI, Accounting, Risk & FinTech Staffing',
    shortName: 'BFSI & Finance Staffing',
    code: 'STAFF-BFS',
    iconName: 'ShieldCheck',
    tagline: 'Chartered accountants, SOX risk auditors, algorithmic quants & AML analysts',
    description: 'Empanelling agencies providing certified CPA accountants, financial modelers, fraud prevention investigators, and risk compliance officers for top banks and institutional asset managers.',
    stockImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
      accent: 'text-emerald-600',
      border: 'border-emerald-200',
      bg: 'from-emerald-50/60 via-white to-orange-50/40',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    regulatoryBodies: ['FINRA / SEC Guidelines', 'AICPA', 'ACAMS (Anti-Money Laundering)', 'Sarbanes-Oxley (SOX)'],
    mandatoryCertifications: ['Comprehensive 10-Year Criminal & Credit Check', 'FINRA Series Registration Verification', 'Bonding & Dishonesty Coverage ($2M)', 'ASA Professional Member'],
    kpis: {
      totalAgencies: 260,
      empanelledCount: 178,
      underReviewCount: 48,
      avgVettingDays: 8.2,
      complianceRate: 98.9,
      annualPlacementVolume: '$385 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'Financial Background & Credit Screening Check', description: 'Scrutiny of candidate financial background verification protocols and fidelity bonding coverage.', avgDuration: '2.5 Days', leadRole: 'Compliance Auditor' },
      { stageNumber: 2, title: 'SOX, AML & Tax Knowledge Assessment', description: 'Review of pre-hire testing for GAAP, IFRS, Python financial modeling, and anti-money laundering tools.', avgDuration: '3 Days', leadRole: 'Finance Evaluator' },
      { stageNumber: 3, title: 'Data Privacy & Banking Secrecy Attestation', description: 'Strict verification of clean desk compliance, non-disclosure agreements, and confidential handling.', avgDuration: '2 Days', leadRole: 'Legal Officer' },
      { stageNumber: 4, title: 'Tier Allocation & Approved Rate Matrix', description: 'Sign-off on contingent accounting bill rates and client banking framework integration.', avgDuration: '1.2 Days', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'Insider Trading & Data Confidentiality Breach', weight: 45, riskScore: 10, status: 'nominal' },
      { category: 'Audit Quality & SOX Control Deficiencies', weight: 30, riskScore: 15, status: 'nominal' },
      { category: 'High-Demand Quant & Risk Talent Shortage', weight: 15, riskScore: 38, status: 'nominal' },
      { category: 'Candidate Non-Compete & Restrictive Covenants', weight: 10, riskScore: 26, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-07', date: 'Sept 17, 2026', title: 'Annual SEC reporting audit season: 120+ senior SOX auditors requisitioned', type: 'procurement' },
      { id: 'sb-08', date: 'Sept 04, 2026', title: 'AML Transaction Monitoring surge project launched across tier-1 investment banks', type: 'procurement' },
    ],
  },
  {
    id: 'logistics_ops',
    name: 'Supply Chain, Commercial & Logistics Operations',
    shortName: 'Supply Chain & Logistics',
    code: 'STAFF-OPS',
    iconName: 'Building2',
    tagline: 'Warehouse operations, 3PL supervisors, fleet dispatchers & supply planners',
    description: 'Empanelling high-volume staffing agencies capable of rapid ramp-up for e-commerce fulfillment hubs, automated port logistics, international freight forwarders, and cold storage facilities.',
    stockImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-amber-500/10 text-amber-700 border-amber-300',
      accent: 'text-amber-600',
      border: 'border-amber-200',
      bg: 'from-amber-50/70 via-white to-blue-50/40',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    regulatoryBodies: ['OSHA Materials Handling', 'DOT / FMCSA Compliance', 'CSCMP', 'American Staffing Association (ASA)'],
    mandatoryCertifications: ['Worker Compensation Mod Rate < 1.0', 'OSHA Forklift Training Certification System', 'DOT Drug & Alcohol Clearinghouse Compliance', 'I-9 Federal Audit Ready'],
    kpis: {
      totalAgencies: 380,
      empanelledCount: 265,
      underReviewCount: 75,
      avgVettingDays: 6.8,
      complianceRate: 94.2,
      annualPlacementVolume: '$520 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'Worker Comp EMR & OSHA Safety Audit', description: 'Scrutiny of past 3 years Experience Modification Rate (EMR) and workplace injury prevention protocols.', avgDuration: '2 Days', leadRole: 'Safety Auditor' },
      { stageNumber: 2, title: 'High-Volume Onboarding & Biometrics Check', description: 'Evaluation of digital onboarding, fast drug screening turnaround, and badge credentialing.', avgDuration: '2.5 Days', leadRole: 'Ops Lead' },
      { stageNumber: 3, title: 'Fleet & DOT Licensing Verification', description: 'Screening of commercial driver licenses (CDL Class A/B), MVR driving records, and DOT medical cards.', avgDuration: '2 Days', leadRole: 'Compliance Officer' },
      { stageNumber: 4, title: 'Peak Season Surge Agreement & Empanelment', description: 'Commitment to 95%+ fill rates during holiday spikes and integration with client warehouse VMS.', avgDuration: '1 Day', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'Warehouse Floor Injuries & High Worker Comp Claims', weight: 45, riskScore: 28, status: 'nominal' },
      { category: 'Peak Season Ghosting & Submittal Drop-Off', weight: 25, riskScore: 39, status: 'nominal' },
      { category: 'Wage & Hour / Overtime Calculation Disputes', weight: 20, riskScore: 21, status: 'nominal' },
      { category: 'Unverified I-9 & Unauthorized Labor Exposure', weight: 10, riskScore: 12, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-09', date: 'Sept 14, 2026', title: 'Q4 Holiday Fulfillment ramp: 2,500+ material handlers requisitioned across Midwest hubs', type: 'procurement' },
      { id: 'sb-10', date: 'Sept 01, 2026', title: 'Mandatory zero-tolerance forklift certification refresher protocol issued', type: 'regulatory' },
    ],
  },
  {
    id: 'executive_prof',
    name: 'Executive Search & Professional Services Staffing',
    shortName: 'Executive & Professional',
    code: 'STAFF-EXE',
    iconName: 'Award',
    tagline: 'Interim C-suite, program directors, legal counsel & change leaders',
    description: 'Empanelling bespoke executive search and specialized professional services agencies deploying fractional executives, transformation directors, litigation associates, and restructuring advisors.',
    stockImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    colorTheme: {
      badge: 'bg-orange-500/10 text-orange-700 border-orange-300',
      accent: 'text-orange-600',
      border: 'border-orange-200',
      bg: 'from-orange-50/60 via-white to-emerald-50/40',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    regulatoryBodies: ['Association of Executive Search and Leadership Consultants (AESC)', 'American Bar Association (ABA)', 'SHRM', 'SIA'],
    mandatoryCertifications: ['AESC Professional Code of Ethics', 'Comprehensive Executive Background & Degree Verification', 'Errors & Omissions Insurance ($10M)', 'Executive Non-Solicit Protocols'],
    kpis: {
      totalAgencies: 190,
      empanelledCount: 132,
      underReviewCount: 38,
      avgVettingDays: 14.0,
      complianceRate: 99.5,
      annualPlacementVolume: '$290 Million',
    },
    vettingStages: [
      { stageNumber: 1, title: 'Search Methodology & Track Record Scrutiny', description: 'Review of past 5 years C-suite placements, retention rates past 24 months, and executive off-limits lists.', avgDuration: '4 Days', leadRole: 'Executive Panel' },
      { stageNumber: 2, title: 'Discreet Background Investigation Standards', description: 'Scrutiny of executive media scrubbing, civil litigation checks, and verified degree certifications.', avgDuration: '4 Days', leadRole: 'Integrity Auditor' },
      { stageNumber: 3, title: 'Diversity & Inclusive Search Verification', description: 'Proof of diverse slate guarantees, unconscious bias recruiter training, and ESG alignment.', avgDuration: '3 Days', leadRole: 'DEI Officer' },
      { stageNumber: 4, title: 'Retainer & Tier-1 Strategic Empanelment', description: 'Execution of enterprise executive retainer agreements and master governance listing.', avgDuration: '2 Days', leadRole: 'Platform Admin' },
    ],
    riskFactors: [
      { category: 'Executive Placement Early Resignation / Attrition', weight: 40, riskScore: 14, status: 'nominal' },
      { category: 'Client Off-Limits Poaching Conflict of Interest', weight: 30, riskScore: 18, status: 'nominal' },
      { category: 'Reputational Exposure from Executive Misconduct', weight: 20, riskScore: 12, status: 'nominal' },
      { category: 'High Retainer Cost vs Delayed Candidate Slates', weight: 10, riskScore: 25, status: 'nominal' },
    ],
    bulletins: [
      { id: 'sb-11', date: 'Sept 16, 2026', title: 'Global Life Sciences client seeks fractional Chief Technology Officer', type: 'procurement' },
      { id: 'sb-12', date: 'Sept 08, 2026', title: 'AESC ethical guidelines update for AI executive candidate matching', type: 'regulatory' },
    ],
  },
];

// Pre-seeded Empanelled Staffing Agencies
let AGENCIES_DATA: Agency[] = [
  {
    id: 'ag_it_01',
    name: 'Apex Tech Talent Partners',
    registrationNumber: 'STAFF-US-892104',
    sectorId: 'it_cloud',
    subCategory: 'Cloud Architecture, Full Stack & AI/ML Staffing',
    tier: 'Tier-1 Strategic Agency',
    status: 'EMPANELLED',
    complianceScore: 98,
    recruiterCount: 45,
    candidatePoolSize: '24,000+ Vetted Engineers',
    placementCount: 1420,
    billRateMarkup: '18% - 22%',
    insuranceCoverage: {
      eAndO: '$5,000,000',
      generalLiability: '$3,000,000',
      workersComp: '$1,000,000 (Statutory)',
    },
    esgRating: 'A+',
    riskLevel: 'LOW',
    certifications: ['E-Verify Certified', 'TechServe Alliance Member', 'ISO 9001:2015', 'SOC 2 Type II Verified'],
    contactPerson: {
      name: 'Elena Rostova',
      email: 'elena.r@apexstaffing.com',
      phone: '+1 (415) 890-3412',
    },
    headquarters: 'San Francisco, CA',
    appliedDate: 'March 14, 2025',
    lastAuditedDate: 'August 28, 2026',
    stage: 4,
    stageName: 'Active Master Agreement & Tier-1 Vendor',
    auditRemarks: 'Flawless W2 compliance audit. Average submittal-to-hire ratio is 2.8:1 with under 36-hour candidate submittal turnaround.',
    activeContractsCount: 18,
    historicalPerformanceScore: 96.5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_it_02',
    name: 'CyberScale Staffing Solutions',
    registrationNumber: 'STAFF-US-719302',
    sectorId: 'it_cloud',
    subCategory: 'Cyber Defense & Cloud Security Specialists',
    tier: 'Tier-2 Preferred Agency',
    status: 'EMPANELLED',
    complianceScore: 96,
    recruiterCount: 28,
    candidatePoolSize: '12,500+ Cleared Analysts',
    placementCount: 840,
    billRateMarkup: '20% - 25%',
    insuranceCoverage: {
      eAndO: '$10,000,000 (Cyber Endorsed)',
      generalLiability: '$2,000,000',
      workersComp: '$1,000,000',
    },
    esgRating: 'A',
    riskLevel: 'LOW',
    certifications: ['DoD 8570 Compliant Recruiter', 'E-Verify', 'SIA Member', 'WBENC Certified Diversity'],
    contactPerson: {
      name: 'Marcus Vance',
      email: 'm.vance@cyberscale.com',
      phone: '+1 (202) 555-0182',
    },
    headquarters: 'Reston, VA',
    appliedDate: 'June 02, 2025',
    lastAuditedDate: 'July 15, 2026',
    stage: 4,
    stageName: 'Active Master Agreement',
    auditRemarks: 'Specialized in Secret and Top Secret cleared dev teams for Federal and FinTech cloud transformations.',
    activeContractsCount: 12,
    historicalPerformanceScore: 94.0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_hlt_01',
    name: 'CarePulse Clinical Talent Network',
    registrationNumber: 'STAFF-MED-448201',
    sectorId: 'healthcare',
    subCategory: 'Travel ICU Nurses, ER Technicians & Locum Tenens',
    tier: 'Tier-1 Strategic Agency',
    status: 'EMPANELLED',
    complianceScore: 99,
    recruiterCount: 65,
    candidatePoolSize: '35,000+ Licensed Nurses',
    placementCount: 3200,
    billRateMarkup: '22% - 26%',
    insuranceCoverage: {
      eAndO: '$3,000,000',
      generalLiability: '$5,000,000',
      workersComp: '$2,000,000',
    },
    esgRating: 'A+',
    riskLevel: 'LOW',
    certifications: ['The Joint Commission Certified', 'NATHO Member', 'Nursys API Integrated', 'OIG Screened'],
    contactPerson: {
      name: 'Sarah Jenkins, BSN',
      email: 's.jenkins@carepulse.org',
      phone: '+1 (312) 880-9214',
    },
    headquarters: 'Chicago, IL',
    appliedDate: 'Jan 10, 2025',
    lastAuditedDate: 'Sept 02, 2026',
    stage: 4,
    stageName: 'Gold Seal Healthcare Staffing Accredited',
    auditRemarks: '100% pass on Joint Commission random credentialing pull across 80 active hospital placements.',
    activeContractsCount: 24,
    historicalPerformanceScore: 98.2,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_eng_01',
    name: 'Vanguard Engineering Placement Group',
    registrationNumber: 'STAFF-ENG-339210',
    sectorId: 'engineering',
    subCategory: 'Aerospace Propulsion, Robotics & Site Civil Engineers',
    tier: 'Tier-1 Strategic Agency',
    status: 'EMPANELLED',
    complianceScore: 95,
    recruiterCount: 32,
    candidatePoolSize: '16,000+ Technical Engineers',
    placementCount: 910,
    billRateMarkup: '19% - 23%',
    insuranceCoverage: {
      eAndO: '$5,000,000',
      generalLiability: '$4,000,000',
      workersComp: '$2,000,000',
    },
    esgRating: 'A',
    riskLevel: 'LOW',
    certifications: ['ITAR Compliance Registered', 'OSHA Authorized Recruiters', 'SIA Member', 'ASME Quality'],
    contactPerson: {
      name: 'Brian K. Thorne, PE',
      email: 'bthorne@vanguard-eng.com',
      phone: '+1 (206) 774-1290',
    },
    headquarters: 'Seattle, WA',
    appliedDate: 'April 19, 2025',
    lastAuditedDate: 'August 10, 2026',
    stage: 4,
    stageName: 'Active Defense & Commercial Panel',
    auditRemarks: 'Outstanding safety training track record. Zero safety incidents reported over 1.2M billed contractor hours.',
    activeContractsCount: 14,
    historicalPerformanceScore: 95.0,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_bfs_01',
    name: 'Sterling Capital Contingent Search',
    registrationNumber: 'STAFF-FIN-881203',
    sectorId: 'bfsi_finance',
    subCategory: 'CPA Accountants, SOX Auditors & AML Specialists',
    tier: 'Tier-1 Strategic Agency',
    status: 'EMPANELLED',
    complianceScore: 97,
    recruiterCount: 24,
    candidatePoolSize: '11,000+ Finance Professionals',
    placementCount: 780,
    billRateMarkup: '21% - 26%',
    insuranceCoverage: {
      eAndO: '$5,000,000',
      generalLiability: '$2,000,000',
      workersComp: '$1,000,000',
    },
    esgRating: 'A',
    riskLevel: 'LOW',
    certifications: ['ACAMS Partner', 'AICPA Certified Vetting', 'Fidelity Bonded ($5M)', 'ASA Member'],
    contactPerson: {
      name: 'Victoria Sterling',
      email: 'v.sterling@sterlingcapsearch.com',
      phone: '+1 (212) 991-8840',
    },
    headquarters: 'New York, NY',
    appliedDate: 'Feb 15, 2025',
    lastAuditedDate: 'Sept 05, 2026',
    stage: 4,
    stageName: 'Active Financial Services Panel',
    auditRemarks: '100% verification rate on 10-year criminal, credit and CPA license verification for all contingent staff.',
    activeContractsCount: 16,
    historicalPerformanceScore: 97.2,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_ops_01',
    name: 'OmniLogistics Staffing Network',
    registrationNumber: 'STAFF-OPS-662914',
    sectorId: 'logistics_ops',
    subCategory: 'Fulfillment Leads, CDL Drivers & Supply Chain Planners',
    tier: 'Tier-2 Preferred Agency',
    status: 'EMPANELLED',
    complianceScore: 93,
    recruiterCount: 52,
    candidatePoolSize: '40,000+ Operations Talent',
    placementCount: 4500,
    billRateMarkup: '17% - 21%',
    insuranceCoverage: {
      eAndO: '$2,000,000',
      generalLiability: '$3,000,000',
      workersComp: '$5,000,000 (High Mod Protection)',
    },
    esgRating: 'B+',
    riskLevel: 'LOW',
    certifications: ['DOT Drug Clearinghouse Ready', 'OSHA 10 Mandatory Training', 'ASA National Member', 'E-Verify'],
    contactPerson: {
      name: 'Hector Ramirez',
      email: 'h.ramirez@omnilogstaff.com',
      phone: '+1 (972) 441-9923',
    },
    headquarters: 'Dallas, TX',
    appliedDate: 'May 08, 2025',
    lastAuditedDate: 'August 14, 2026',
    stage: 4,
    stageName: 'High-Volume Fulfillment Empanelled',
    auditRemarks: 'Exceptional surge capacity for peak fulfillment seasons. Automated mobile timekeeping integrated with client punch clocks.',
    activeContractsCount: 22,
    historicalPerformanceScore: 93.8,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_exe_01',
    name: 'Prestige Executive Talent Partners',
    registrationNumber: 'STAFF-EXE-119283',
    sectorId: 'executive_prof',
    subCategory: 'Interim C-Suite, Transformation VPs & General Counsel',
    tier: 'Tier-1 Strategic Agency',
    status: 'EMPANELLED',
    complianceScore: 99,
    recruiterCount: 18,
    candidatePoolSize: '4,500+ Fractional Leaders',
    placementCount: 380,
    billRateMarkup: '24% - 28%',
    insuranceCoverage: {
      eAndO: '$10,000,000',
      generalLiability: '$5,000,000',
      workersComp: '$1,000,000',
    },
    esgRating: 'A+',
    riskLevel: 'LOW',
    certifications: ['AESC Certified Member', 'SHRM Executive Partner', 'ABA Accredited Legal Staffing', 'Global Diversity Slate Pass'],
    contactPerson: {
      name: 'Arthur Pendelton',
      email: 'a.pendelton@prestigepartners.com',
      phone: '+1 (617) 482-1920',
    },
    headquarters: 'Boston, MA',
    appliedDate: 'Jan 22, 2025',
    lastAuditedDate: 'August 30, 2026',
    stage: 4,
    stageName: 'Executive Retainer Panel Enlisted',
    auditRemarks: 'Gold standard in executive assessment and non-solicitation firewalls. Average tenure of placed interim officers is 14 months.',
    activeContractsCount: 11,
    historicalPerformanceScore: 98.6,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'ag_it_03',
    name: 'Cognitive Minds AI Staffing',
    registrationNumber: 'STAFF-US-993812',
    sectorId: 'it_cloud',
    subCategory: 'LLM Prompt Engineers, PyTorch Experts & ML Ops',
    tier: 'Associate Agency',
    status: 'UNDER_REVIEW',
    complianceScore: 88,
    recruiterCount: 14,
    candidatePoolSize: '6,000+ AI Specialists',
    placementCount: 190,
    billRateMarkup: '20% - 24%',
    insuranceCoverage: {
      eAndO: '$3,000,000',
      generalLiability: '$2,000,000',
      workersComp: '$1,000,000',
    },
    esgRating: 'B+',
    riskLevel: 'MEDIUM',
    certifications: ['E-Verify Compliant', 'TechServe Member'],
    contactPerson: {
      name: 'Rohan Gupta',
      email: 'rohan@cognitiveminds.ai',
      phone: '+1 (512) 349-8812',
    },
    headquarters: 'Austin, TX',
    appliedDate: 'Sept 01, 2026',
    lastAuditedDate: 'Sept 12, 2026',
    stage: 2,
    stageName: 'Technical & Code Audit Protocol',
    auditRemarks: 'Preliminary application cleared. Undergoing technical screening tool validation by central admin.',
    activeContractsCount: 3,
    historicalPerformanceScore: 89.0,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  }
];

// Pre-seeded Clients
let CLIENTS_DATA: ClientProfile[] = [
  {
    id: 'cl_01',
    companyName: 'Nexus Enterprise Cloud Systems',
    sectorId: 'it_cloud',
    industry: 'Enterprise Software & Cloud Infrastructure',
    annualContingentBudget: '$45,000,000',
    currentMspVms: 'SAP Fieldglass',
    openRequisitionsCount: 28,
    slaTargetHours: 24,
    status: 'ACTIVE',
    contactPerson: {
      name: 'David K. Vance',
      email: 'client@nexustech.com',
      phone: '+1 (408) 555-9012',
    },
    headquarters: 'San Jose, CA',
    joinedDate: 'Jan 15, 2025',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cl_02',
    companyName: 'Providence BioHealth Hospital Alliance',
    sectorId: 'healthcare',
    industry: 'Healthcare & Hospital Networks',
    annualContingentBudget: '$72,000,000',
    currentMspVms: 'Beeline Healthcare',
    openRequisitionsCount: 54,
    slaTargetHours: 12,
    status: 'ACTIVE',
    contactPerson: {
      name: 'Dr. Miranda Bailey',
      email: 'm.bailey@providencehealth.org',
      phone: '+1 (206) 555-8819',
    },
    headquarters: 'Seattle, WA',
    joinedDate: 'Feb 10, 2025',
    logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cl_03',
    companyName: 'AeroDynamics Defense & Space',
    sectorId: 'engineering',
    industry: 'Aerospace & Defense Contractor',
    annualContingentBudget: '$38,000,000',
    currentMspVms: 'Coupa Contingent',
    openRequisitionsCount: 19,
    slaTargetHours: 48,
    status: 'ACTIVE',
    contactPerson: {
      name: 'Col. Richard Sterling (Ret.)',
      email: 'r.sterling@aerodynamics.com',
      phone: '+1 (310) 555-7744',
    },
    headquarters: 'El Segundo, CA',
    joinedDate: 'March 01, 2025',
    logoUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'cl_04',
    companyName: 'Apex Prime Capital Bank',
    sectorId: 'bfsi_finance',
    industry: 'Investment Banking & Wealth Management',
    annualContingentBudget: '$28,000,000',
    currentMspVms: 'Direct Sourcing Platform',
    openRequisitionsCount: 16,
    slaTargetHours: 36,
    status: 'ACTIVE',
    contactPerson: {
      name: 'Catherine Dubois',
      email: 'c.dubois@apexprimebank.com',
      phone: '+1 (212) 555-4491',
    },
    headquarters: 'New York, NY',
    joinedDate: 'April 12, 2025',
    logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=200&q=80',
  }
];

// Pre-seeded Staffing Requisitions
let REQUISITIONS_DATA: StaffingRequisition[] = [
  {
    id: 'req_01',
    clientId: 'cl_01',
    clientName: 'Nexus Enterprise Cloud Systems',
    title: 'Lead Kubernetes & Site Reliability Architect',
    sectorId: 'it_cloud',
    positionsNeeded: 4,
    billRateRange: '$120 - $145 / hr',
    location: 'San Jose, CA',
    remoteType: 'Remote',
    slaHours: 24,
    priority: 'CRITICAL',
    status: 'OPEN',
    postedDate: 'Sept 19, 2026',
    matchedAgenciesCount: 6,
    primarySkills: ['Kubernetes', 'Go', 'AWS Terraform', 'Incident Command', 'SOC2'],
  },
  {
    id: 'req_02',
    clientId: 'cl_01',
    clientName: 'Nexus Enterprise Cloud Systems',
    title: 'Senior PyTorch & Deep Learning Research Engineer',
    sectorId: 'it_cloud',
    positionsNeeded: 3,
    billRateRange: '$140 - $175 / hr',
    location: 'San Francisco, CA',
    remoteType: 'Hybrid',
    slaHours: 48,
    priority: 'HIGH',
    status: 'OPEN',
    postedDate: 'Sept 18, 2026',
    matchedAgenciesCount: 4,
    primarySkills: ['PyTorch', 'CUDA', 'Transformer Architectures', 'Distributed Training'],
  },
  {
    id: 'req_03',
    clientId: 'cl_02',
    clientName: 'Providence BioHealth Hospital Alliance',
    title: 'Traveling Intensive Care Unit (ICU) Registered Nurses',
    sectorId: 'healthcare',
    positionsNeeded: 12,
    billRateRange: '$95 - $115 / hr',
    location: 'Seattle, WA',
    remoteType: 'On-site',
    slaHours: 12,
    priority: 'CRITICAL',
    status: 'OPEN',
    postedDate: 'Sept 19, 2026',
    matchedAgenciesCount: 8,
    primarySkills: ['BSN Registered Nurse', 'ACLS/BLS', 'Ventilator Care', 'Epic EHR'],
  },
  {
    id: 'req_04',
    clientId: 'cl_03',
    clientName: 'AeroDynamics Defense & Space',
    title: 'Propulsion Hardware In-The-Loop Validation Specialist',
    sectorId: 'engineering',
    positionsNeeded: 2,
    billRateRange: '$110 - $135 / hr',
    location: 'El Segundo, CA',
    remoteType: 'On-site',
    slaHours: 48,
    priority: 'HIGH',
    status: 'OPEN',
    postedDate: 'Sept 16, 2026',
    matchedAgenciesCount: 3,
    primarySkills: ['ITAR Security Clearance', 'LabVIEW', 'MATLAB', 'Cryogenic Testing'],
  },
  {
    id: 'req_05',
    clientId: 'cl_04',
    clientName: 'Apex Prime Capital Bank',
    title: 'Senior SOX IT Audit & Compliance Lead',
    sectorId: 'bfsi_finance',
    positionsNeeded: 3,
    billRateRange: '$105 - $130 / hr',
    location: 'New York, NY',
    remoteType: 'Hybrid',
    slaHours: 36,
    priority: 'HIGH',
    status: 'OPEN',
    postedDate: 'Sept 17, 2026',
    matchedAgenciesCount: 5,
    primarySkills: ['CPA / CISA', 'SOX 404 Testing', 'Algorithmic AML', 'Python Reconciliation'],
  }
];

// Activity Log Stream
let RECENT_ACTIVITY = [
  {
    id: 'act_01',
    timestamp: '10 mins ago',
    actor: 'Julian Sterling (Super Admin)',
    action: 'Approved Tier-1 Strategic Empanelment & Rate Card for Apex Tech Talent Partners',
    target: 'Apex Tech Talent Partners',
    sectorId: 'it_cloud' as SectorId,
    severity: 'success' as const,
  },
  {
    id: 'act_02',
    timestamp: '25 mins ago',
    actor: 'David K. Vance (Client)',
    action: 'Posted new contingent requisition: 4x Lead Kubernetes SRE Architect ($120-$145/hr)',
    target: 'Nexus Enterprise Cloud',
    sectorId: 'it_cloud' as SectorId,
    severity: 'info' as const,
  },
  {
    id: 'act_03',
    timestamp: '42 mins ago',
    actor: 'Dr. Miranda Bailey (Client)',
    action: 'Dispatched urgent requisition for 12 Traveling ICU Nurses (12h SLA)',
    target: 'Providence BioHealth',
    sectorId: 'healthcare' as SectorId,
    severity: 'warning' as const,
  },
  {
    id: 'act_04',
    timestamp: '1 hour ago',
    actor: 'Julian Sterling (Super Admin)',
    action: 'Initiated Joint Commission recertification audit on CarePulse Clinical Talent',
    target: 'CarePulse Clinical Talent',
    sectorId: 'healthcare' as SectorId,
    severity: 'info' as const,
  },
  {
    id: 'act_05',
    timestamp: '2 hours ago',
    actor: 'Cognitive Minds AI (Agency)',
    action: 'Submitted agency empanelment registration & uploaded E&O insurance binder',
    target: 'Cognitive Minds AI',
    sectorId: 'it_cloud' as SectorId,
    severity: 'info' as const,
  }
];

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // CORS / headers for development
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'AuroPro Contingent Staffing Engine', time: new Date().toISOString() });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    const record = DEMO_USERS[email?.toLowerCase()];

    if (record && record.password === password) {
      const session: UserSession = {
        ...record.user,
        token: `token_${record.user.id}_${Date.now()}`,
      };
      return res.json({ success: true, session, message: `Authenticated as ${session.name} (${session.role})` });
    }

    // Allow quick demo fallback: If email includes "admin", treat as Admin
    if (email?.toLowerCase().includes('admin')) {
      const adminRec = DEMO_USERS['admin@auropro.com'];
      const session: UserSession = {
        ...adminRec.user,
        token: `token_admin_${Date.now()}`,
      };
      return res.json({ success: true, session, message: 'Authenticated as Super Admin' });
    }

    return res.status(401).json({ success: false, error: 'Invalid email or password. Use pre-seeded demo accounts or check credentials.' });
  });

  // Auth: Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Sectors API
  app.get('/api/sectors', (req: Request, res: Response) => {
    res.json(SECTORS_DATA);
  });

  app.get('/api/sectors/:id', (req: Request, res: Response) => {
    const sector = SECTORS_DATA.find(s => s.id === req.params.id);
    if (!sector) return res.status(404).json({ error: 'Sector not found' });
    res.json(sector);
  });

  // Agencies API
  app.get('/api/agencies', (req: Request, res: Response) => {
    const { sectorId, status, search } = req.query;
    let list = [...AGENCIES_DATA];

    if (sectorId && sectorId !== 'all') {
      list = list.filter(a => a.sectorId === sectorId);
    }
    if (status && status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(a => 
        a.name.toLowerCase().includes(q) || 
        a.subCategory.toLowerCase().includes(q) ||
        a.registrationNumber.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/agencies/:id', (req: Request, res: Response) => {
    const agency = AGENCIES_DATA.find(a => a.id === req.params.id);
    if (!agency) return res.status(404).json({ error: 'Agency not found' });
    res.json(agency);
  });

  // Agency Registration
  app.post('/api/agencies/register', (req: Request, res: Response) => {
    const payload: AgencyRegistrationPayload = req.body;

    if (!payload.agencyName || !payload.sectorId) {
      return res.status(400).json({ error: 'Agency name and sector specialization are required' });
    }

    const newAgency: Agency = {
      id: `ag_${payload.sectorId}_${Date.now().toString().slice(-4)}`,
      name: payload.agencyName,
      registrationNumber: payload.registrationNumber || `STAFF-REG-${Math.floor(100000 + Math.random() * 900000)}`,
      sectorId: payload.sectorId,
      subCategory: payload.subCategory || 'General Contingent Staffing',
      tier: 'Associate Agency',
      status: 'UNDER_REVIEW',
      complianceScore: 89,
      recruiterCount: Number(payload.recruiterCount) || 12,
      candidatePoolSize: payload.candidatePoolSize || '5,000+ Candidates',
      placementCount: 0,
      billRateMarkup: payload.billRateMarkup || '20% - 25%',
      insuranceCoverage: {
        eAndO: payload.eAndOInsurance || '$3,000,000',
        generalLiability: payload.generalLiability || '$2,000,000',
        workersComp: payload.workersComp || '$1,000,000',
      },
      esgRating: 'A',
      riskLevel: 'LOW',
      certifications: payload.certifications?.length ? payload.certifications : ['E-Verify Certified', 'ASA Member'],
      contactPerson: {
        name: payload.contactName || 'Lead Recruiter',
        email: payload.contactEmail || 'contact@agency.com',
        phone: payload.contactPhone || '+1 (555) 019-2831',
      },
      headquarters: payload.headquarters || 'United States',
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastAuditedDate: 'Pending Initial Verification',
      stage: 1,
      stageName: 'Statutory License & W2 Verification',
      auditRemarks: 'New registration submitted via AuroPro Vendor Portal. Awaiting Super Admin review and rate card approval.',
      activeContractsCount: 0,
      historicalPerformanceScore: 90.0,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    };

    AGENCIES_DATA.unshift(newAgency);

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: `${newAgency.name} (Vendor)`,
      action: `Lodged new vendor empanelment registration for ${payload.sectorId.replace('_', ' ')}`,
      target: newAgency.name,
      sectorId: newAgency.sectorId,
      severity: 'info',
    });

    res.status(201).json({ 
      success: true, 
      agency: newAgency, 
      message: 'Vendor registration submitted successfully. Super Admin will conduct statutory review.' 
    });
  });

  // Admin Agency Status & Tier Control
  app.post('/api/agencies/:id/status', (req: Request, res: Response) => {
    const { status, remarks, tier, stage } = req.body;
    const agencyIndex = AGENCIES_DATA.findIndex(a => a.id === req.params.id);

    if (agencyIndex === -1) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    const agency = AGENCIES_DATA[agencyIndex];
    if (status) agency.status = status;
    if (remarks) agency.auditRemarks = remarks;
    if (tier) agency.tier = tier;
    if (stage) agency.stage = stage;

    if (status === 'EMPANELLED') {
      agency.stage = 4;
      agency.stageName = 'Active Master Agreement & Empanelled Roster';
      agency.complianceScore = Math.max(agency.complianceScore, 95);
      agency.lastAuditedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    AGENCIES_DATA[agencyIndex] = agency;

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Julian Sterling (Super Admin)',
      action: `Updated status for ${agency.name} to ${agency.status} (${agency.tier})`,
      target: agency.name,
      sectorId: agency.sectorId,
      severity: agency.status === 'EMPANELLED' ? 'success' : 'warning',
    });

    res.json({ success: true, agency, message: 'Vendor status and governance tier updated by Super Admin' });
  });

  // Clients API
  app.get('/api/clients', (req: Request, res: Response) => {
    res.json(CLIENTS_DATA);
  });

  // Client Registration
  app.post('/api/clients/register', (req: Request, res: Response) => {
    const payload: ClientRegistrationPayload = req.body;

    if (!payload.companyName || !payload.sectorId) {
      return res.status(400).json({ error: 'Company name and primary staffing division are required' });
    }

    const newClient: ClientProfile = {
      id: `cl_${Date.now().toString().slice(-4)}`,
      companyName: payload.companyName,
      sectorId: payload.sectorId,
      industry: payload.industry || 'Enterprise Commercial',
      annualContingentBudget: payload.annualContingentBudget || '$15,000,000',
      currentMspVms: payload.currentMspVms || 'Direct Sourcing',
      openRequisitionsCount: Number(payload.openPositionsCount) || 5,
      slaTargetHours: Number(payload.requiredSla) || 24,
      status: 'ACTIVE',
      contactPerson: {
        name: payload.contactName || 'Contingent Labor Lead',
        email: payload.contactEmail || 'talent@company.com',
        phone: payload.contactPhone || '+1 (555) 021-9876',
      },
      headquarters: payload.headquarters || 'United States',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
    };

    CLIENTS_DATA.unshift(newClient);

    // If client specified immediate needs, create an initial requisition
    if (payload.immediateNeeds) {
      const initialReq: StaffingRequisition = {
        id: `req_${Date.now().toString().slice(-4)}`,
        clientId: newClient.id,
        clientName: newClient.companyName,
        title: payload.immediateNeeds,
        sectorId: newClient.sectorId,
        positionsNeeded: Number(payload.openPositionsCount) || 3,
        billRateRange: '$85 - $125 / hr',
        location: newClient.headquarters,
        remoteType: 'Hybrid',
        slaHours: newClient.slaTargetHours,
        priority: 'HIGH',
        status: 'OPEN',
        postedDate: 'Just now',
        matchedAgenciesCount: AGENCIES_DATA.filter(a => a.sectorId === newClient.sectorId && a.status === 'EMPANELLED').length,
        primarySkills: ['Contingent Talent', 'Specialized Domain', 'Verified Background'],
      };
      REQUISITIONS_DATA.unshift(initialReq);
    }

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: `${newClient.companyName} (Client)`,
      action: `Enrolled enterprise hiring account with budget ${newClient.annualContingentBudget}`,
      target: newClient.companyName,
      sectorId: newClient.sectorId,
      severity: 'info',
    });

    res.status(201).json({
      success: true,
      client: newClient,
      message: 'Client account registered successfully under AuroPro Super Admin Governance.',
    });
  });

  // Requisitions API
  app.get('/api/requisitions', (req: Request, res: Response) => {
    const { sectorId } = req.query;
    if (sectorId && sectorId !== 'all') {
      return res.json(REQUISITIONS_DATA.filter(r => r.sectorId === sectorId));
    }
    res.json(REQUISITIONS_DATA);
  });

  app.post('/api/requisitions', (req: Request, res: Response) => {
    const reqData = req.body;
    const newReq: StaffingRequisition = {
      id: `req_${Date.now().toString().slice(-4)}`,
      clientId: reqData.clientId || 'cl_01',
      clientName: reqData.clientName || 'Client',
      title: reqData.title || 'Contingent Talent Requirement',
      sectorId: reqData.sectorId || 'it_cloud',
      positionsNeeded: Number(reqData.positionsNeeded) || 1,
      billRateRange: reqData.billRateRange || '$90 - $120 / hr',
      location: reqData.location || 'Remote',
      remoteType: reqData.remoteType || 'Remote',
      slaHours: Number(reqData.slaHours) || 24,
      priority: reqData.priority || 'HIGH',
      status: 'OPEN',
      postedDate: 'Just now',
      matchedAgenciesCount: AGENCIES_DATA.filter(a => a.sectorId === reqData.sectorId && a.status === 'EMPANELLED').length,
      primarySkills: reqData.primarySkills || ['Technical Assessment', 'Verified Experience'],
    };

    REQUISITIONS_DATA.unshift(newReq);

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: `${newReq.clientName} (Client)`,
      action: `Released new job order: "${newReq.title}" (${newReq.positionsNeeded} positions, ${newReq.slaHours}h SLA)`,
      target: newReq.title,
      sectorId: newReq.sectorId,
      severity: 'info',
    });

    res.status(201).json({ success: true, requisition: newReq });
  });

  // Real-time Platform Telemetry
  app.get('/api/stats/realtime', (req: Request, res: Response) => {
    const totalEmpanelled = AGENCIES_DATA.filter(a => a.status === 'EMPANELLED').length;
    const pendingReviews = AGENCIES_DATA.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'AUDIT_REQUIRED').length;
    const avgComplianceScore = Math.round(
      AGENCIES_DATA.reduce((acc, a) => acc + a.complianceScore, 0) / AGENCIES_DATA.length
    );

    const sectorBreakdown = SECTORS_DATA.map(sec => {
      const secAgencies = AGENCIES_DATA.filter(a => a.sectorId === sec.id);
      const empanelled = secAgencies.filter(a => a.status === 'EMPANELLED').length;
      const compAvg = secAgencies.length 
        ? Math.round(secAgencies.reduce((acc, a) => acc + a.complianceScore, 0) / secAgencies.length) 
        : 95;
      return {
        sectorId: sec.id,
        name: sec.shortName,
        count: empanelled,
        complianceAvg: compAvg,
      };
    });

    const stats: RealtimeStats = {
      totalEmpanelledAgencies: totalEmpanelled,
      totalActiveClients: CLIENTS_DATA.length,
      pendingReviews: pendingReviews,
      openRequisitions: REQUISITIONS_DATA.filter(r => r.status === 'OPEN').length,
      avgComplianceScore: avgComplianceScore,
      contingentSpendFulfillment: '$2.85 Billion',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sectorBreakdown,
      recentActivity: RECENT_ACTIVITY.slice(0, 10),
    };

    res.json(stats);
  });

  // Admin Command Action Endpoint
  app.post('/api/admin/system-action', (req: Request, res: Response) => {
    const { actionType, details } = req.body;

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Julian Sterling (Super Admin)',
      action: `Executed Admin Control Action: ${actionType} - ${details || 'System policy synchronized'}`,
      target: 'Platform Governance Node',
      sectorId: 'it_cloud',
      severity: 'warning',
    });

    res.json({ success: true, message: `Admin action "${actionType}" executed successfully across all client & agency nodes.` });
  });

  // Admin User Credentials Management
  app.get('/api/admin/users', (req: Request, res: Response) => {
    const usersList: ProvisionedUser[] = Object.entries(DEMO_USERS).map(([email, data]) => {
      let companyName = 'AuroPro Platform Master';
      if (data.user.role === 'AGENCY') {
        const ag = AGENCIES_DATA.find(a => a.id === data.user.agencyId);
        companyName = ag?.name || 'Empanelled Vendor';
      } else if (data.user.role === 'CLIENT') {
        const cl = CLIENTS_DATA.find(c => c.id === data.user.clientId);
        companyName = cl?.companyName || 'Client Account';
      }

      return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        password: data.password,
        role: data.user.role,
        roleTitle: data.user.roleTitle,
        assignedSector: data.user.assignedSector,
        agencyId: data.user.agencyId,
        clientId: data.user.clientId,
        companyName,
        createdAt: 'Active Platform Account',
      };
    });

    res.json(usersList);
  });

  app.post('/api/admin/users/create', (req: Request, res: Response) => {
    const payload: CreateUserCredentialPayload = req.body;

    if (!payload.email || !payload.password || !payload.name || !payload.role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const emailKey = payload.email.toLowerCase().trim();
    if (DEMO_USERS[emailKey]) {
      return res.status(400).json({ error: `An account with email "${payload.email}" already exists.` });
    }

    // Determine associated company name
    let companyName = payload.companyName || '';
    if (payload.role === 'AGENCY') {
      const ag = AGENCIES_DATA.find(a => a.id === payload.agencyId);
      if (ag) companyName = ag.name;
    } else if (payload.role === 'CLIENT') {
      const cl = CLIENTS_DATA.find(c => c.id === payload.clientId);
      if (cl) companyName = cl.companyName;
    }

    const newUserId = `usr_${payload.role.toLowerCase()}_${Date.now().toString().slice(-5)}`;
    
    DEMO_USERS[emailKey] = {
      password: payload.password,
      user: {
        id: newUserId,
        name: payload.name.trim(),
        email: emailKey,
        role: payload.role,
        roleTitle: payload.roleTitle || (payload.role === 'AGENCY' ? 'Authorized Agency Representative' : 'Enterprise Talent Lead'),
        assignedSector: payload.assignedSector || 'it_cloud',
        agencyId: payload.role === 'AGENCY' ? payload.agencyId : undefined,
        clientId: payload.role === 'CLIENT' ? payload.clientId : undefined,
      },
    };

    const provisionedUser: ProvisionedUser = {
      ...DEMO_USERS[emailKey].user,
      password: payload.password,
      companyName,
      createdAt: 'Just now',
    };

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Julian Sterling (Super Admin)',
      action: `Provisioned user access credentials for ${payload.name} (${payload.role === 'AGENCY' ? 'Vendor Partner' : 'Client'})`,
      target: companyName || emailKey,
      sectorId: payload.assignedSector || 'it_cloud',
      severity: 'success',
    });

    res.status(201).json({
      success: true,
      user: provisionedUser,
      message: `User credentials successfully generated for ${payload.name}. User can now sign in at the Portal Login gateway.`,
    });
  });

  // Division Work Requests Endpoints
  app.get('/api/admin/division-requests', (req: Request, res: Response) => {
    res.json(DIVISION_REQUESTS_DATA);
  });

  app.post('/api/agencies/request-division', (req: Request, res: Response) => {
    const payload = req.body;
    if (!payload.agencyId || !payload.requestedSectorId) {
      return res.status(400).json({ error: 'Agency ID and requested division are required.' });
    }

    const agency = AGENCIES_DATA.find(a => a.id === payload.agencyId);
    const sector = SECTORS_DATA.find(s => s.id === payload.requestedSectorId);

    const newRequest: DivisionWorkRequest = {
      id: `div_req_${Date.now().toString().slice(-4)}`,
      agencyId: payload.agencyId,
      agencyName: agency?.name || payload.agencyName || 'Empanelled Vendor Partner',
      currentSectorId: agency?.sectorId || payload.currentSectorId || 'it_cloud',
      requestedSectorId: payload.requestedSectorId,
      requestedSectorName: sector?.name || payload.requestedSectorName || 'Specialized Staffing Division',
      recruiterCount: Number(payload.recruiterCount) || 5,
      candidatePoolSize: payload.candidatePoolSize || '3,000+ Verified Candidates',
      certifications: payload.certifications?.length ? payload.certifications : ['E-Verify Compliant', 'Statutory W2 Ready'],
      experienceSummary: payload.experienceSummary || 'Extensive candidate placement track record across specialized contingent roles.',
      status: 'PENDING_REVIEW',
      submittedDate: 'Just now',
    };

    DIVISION_REQUESTS_DATA.unshift(newRequest);

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: `${newRequest.agencyName} (Vendor)`,
      action: `Submitted formal request for additional division empanelment: ${sector?.shortName || payload.requestedSectorId}`,
      target: newRequest.agencyName,
      sectorId: newRequest.requestedSectorId,
      severity: 'info',
    });

    res.status(201).json({
      success: true,
      request: newRequest,
      message: 'Request for additional division work submitted to Super Admin Julian Sterling for review and statutory assessment.',
    });
  });

  app.post('/api/admin/division-requests/:id/review', (req: Request, res: Response) => {
    const { status, adminNotes } = req.body;
    const reqIndex = DIVISION_REQUESTS_DATA.findIndex(r => r.id === req.params.id);

    if (reqIndex === -1) {
      return res.status(404).json({ error: 'Division request not found.' });
    }

    DIVISION_REQUESTS_DATA[reqIndex].status = status || 'APPROVED';
    if (adminNotes) {
      DIVISION_REQUESTS_DATA[reqIndex].adminNotes = adminNotes;
    }

    const item = DIVISION_REQUESTS_DATA[reqIndex];

    RECENT_ACTIVITY.unshift({
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Julian Sterling (Super Admin)',
      action: `${status === 'APPROVED' ? 'Approved' : 'Rejected'} division expansion request for ${item.agencyName} (${item.requestedSectorName})`,
      target: item.agencyName,
      sectorId: item.requestedSectorId,
      severity: status === 'APPROVED' ? 'success' : 'warning',
    });

    res.json({
      success: true,
      request: item,
      message: `Division expansion request has been ${status === 'APPROVED' ? 'approved' : 'reviewed'}.`,
    });
  });

  // Vite Middleware vs Static Production files Setup
  const isProd = process.env.NODE_ENV === 'production' || !process.env.npm_lifecycle_event?.includes('dev');
  const distPath = path.join(process.cwd(), 'dist');

  if (isProd && fs.existsSync(path.join(distPath, 'index.html'))) {
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuroPro Server running on http://localhost:${PORT}`);
  });
}

startServer();

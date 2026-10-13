export type UserRole = 'ADMIN' | 'AGENCY' | 'CLIENT' | 'AUDITOR';

export type SectorId = 
  | 'it_cloud' 
  | 'healthcare' 
  | 'engineering' 
  | 'bfsi_finance' 
  | 'logistics_ops' 
  | 'executive_prof';

export type EmpanelmentStatus = 
  | 'EMPANELLED' 
  | 'UNDER_REVIEW' 
  | 'AUDIT_REQUIRED' 
  | 'PROVISIONAL' 
  | 'REJECTED';

export type AgencyTier = 'Tier-1 Strategic Agency' | 'Tier-2 Preferred Agency' | 'Associate Agency';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  assignedSector?: SectorId;
  agencyId?: string;
  clientId?: string;
  token: string;
}

export interface Agency {
  id: string;
  name: string;
  registrationNumber: string;
  sectorId: SectorId;
  subCategory: string; // e.g. "Cloud & AI Staffing", "ICU & Travel Nursing"
  tier: AgencyTier;
  status: EmpanelmentStatus;
  complianceScore: number; // 0 - 100
  recruiterCount: number;
  candidatePoolSize: string; // e.g. "15,000+ Vetted Candidates"
  placementCount: number;
  billRateMarkup: string; // e.g. "18% - 22%"
  insuranceCoverage: {
    eAndO: string;
    generalLiability: string;
    workersComp: string;
  };
  esgRating: 'A+' | 'A' | 'B+' | 'B' | 'C';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  certifications: string[]; // e.g. ["ASA Member", "SIA Certified", "E-Verify Compliant", "ISO 9001"]
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  headquarters: string;
  appliedDate: string;
  lastAuditedDate: string;
  stage: 1 | 2 | 3 | 4;
  stageName: string;
  auditRemarks: string;
  activeContractsCount: number;
  historicalPerformanceScore: number;
  avatarUrl?: string;
}

export interface ClientProfile {
  id: string;
  companyName: string;
  sectorId: SectorId;
  industry: string;
  annualContingentBudget: string;
  currentMspVms: string; // e.g. "Fieldglass", "Beeline", "Direct Sourcing"
  openRequisitionsCount: number;
  slaTargetHours: number;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
  headquarters: string;
  joinedDate: string;
  logoUrl?: string;
}

export interface StaffingRequisition {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  sectorId: SectorId;
  positionsNeeded: number;
  billRateRange: string;
  location: string;
  remoteType: 'Remote' | 'Hybrid' | 'On-site';
  slaHours: number;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
  status: 'OPEN' | 'IN_REVIEW' | 'FILLED';
  postedDate: string;
  matchedAgenciesCount: number;
  primarySkills: string[];
  description?: string;
}

export interface VettingStage {
  stageNumber: number;
  title: string;
  description: string;
  avgDuration: string;
  leadRole: string;
}

export interface SectorRiskFactor {
  category: string;
  weight: number;
  riskScore: number; // 0-100
  status: 'nominal' | 'elevated' | 'critical';
}

export interface SectorBulletin {
  id: string;
  date: string;
  title: string;
  type: 'regulatory' | 'procurement' | 'audit';
}

export interface SectorDetail {
  id: SectorId;
  name: string;
  shortName: string;
  code: string;
  iconName: string;
  tagline: string;
  description: string;
  stockImageUrl: string;
  colorTheme: {
    badge: string;
    accent: string;
    border: string;
    bg: string;
    button: string;
  };
  regulatoryBodies: string[];
  mandatoryCertifications: string[];
  kpis: {
    totalAgencies: number;
    empanelledCount: number;
    underReviewCount: number;
    avgVettingDays: number;
    complianceRate: number;
    annualPlacementVolume: string;
  };
  vettingStages: VettingStage[];
  riskFactors: SectorRiskFactor[];
  bulletins: SectorBulletin[];
}

export interface RealtimeStats {
  totalEmpanelledAgencies: number;
  totalActiveClients: number;
  pendingReviews: number;
  openRequisitions: number;
  avgComplianceScore: number;
  contingentSpendFulfillment: string;
  timestamp: string;
  sectorBreakdown: Array<{
    sectorId: SectorId;
    name: string;
    count: number;
    complianceAvg: number;
  }>;
  recentActivity: Array<{
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    target: string;
    sectorId: SectorId;
    severity: 'info' | 'success' | 'warning' | 'alert';
  }>;
}

export interface AgencyRegistrationPayload {
  agencyName: string;
  registrationNumber: string;
  sectorId: SectorId;
  subCategory: string;
  recruiterCount: number;
  candidatePoolSize: string;
  billRateMarkup: string;
  eAndOInsurance: string;
  generalLiability: string;
  workersComp: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
  certifications: string[];
  taxIdOrEin: string;
}

export interface ClientRegistrationPayload {
  companyName: string;
  sectorId: SectorId;
  industry: string;
  annualContingentBudget: string;
  currentMspVms: string;
  immediateNeeds: string;
  openPositionsCount: number;
  requiredSla: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
}

export interface CreateUserCredentialPayload {
  name: string;
  email: string;
  password: string;
  role: 'AGENCY' | 'CLIENT';
  roleTitle: string;
  assignedSector: SectorId;
  agencyId?: string;
  clientId?: string;
  companyName?: string;
}

export interface ProvisionedUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  roleTitle: string;
  assignedSector?: SectorId;
  agencyId?: string;
  clientId?: string;
  companyName?: string;
  createdAt?: string;
}

export interface CandidateDocument {
  id: string;
  name: string;
  size: string;
  type: 'resume' | 'work_auth' | 'certification' | 'background' | 'other';
  uploadedAt: string;
}

export interface DivisionWorkRequest {
  id: string;
  agencyId: string;
  agencyName: string;
  currentSectorId: SectorId;
  requestedSectorId: SectorId;
  requestedSectorName: string;
  recruiterCount: number;
  candidatePoolSize: string;
  certifications: string[];
  experienceSummary: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  adminNotes?: string;
}

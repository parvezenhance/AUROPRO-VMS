import { 
  SectorDetail, 
  Agency, 
  ClientProfile, 
  StaffingRequisition, 
  RealtimeStats, 
  UserSession, 
  AgencyRegistrationPayload, 
  ClientRegistrationPayload,
  CreateUserCredentialPayload,
  ProvisionedUser,
  DivisionWorkRequest
} from '../types.ts';

const TOKEN_KEY = 'auropro_session_token';
const USER_KEY = 'auropro_session_user';

export const api = {
  // Local storage auth helpers
  getStoredSession(): UserSession | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setStoredSession(session: UserSession | null) {
    if (session) {
      localStorage.setItem(USER_KEY, JSON.stringify(session));
      localStorage.setItem(TOKEN_KEY, session.token);
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getAuthHeaders(): HeadersInit {
    const session = this.getStoredSession();
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  },

  // Auth
  async login(email: string, password: string): Promise<{ session: UserSession; message: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }
    this.setStoredSession(data.session);
    return data;
  },

  async logout(): Promise<void> {
    const headers = this.getAuthHeaders();
    try {
      await fetch('/api/auth/logout', { method: 'POST', headers });
    } finally {
      this.setStoredSession(null);
    }
  },

  // Sectors
  async getSectors(): Promise<SectorDetail[]> {
    const res = await fetch('/api/sectors');
    if (!res.ok) throw new Error('Failed to fetch sectors');
    return res.json();
  },

  async getSectorById(id: string): Promise<SectorDetail> {
    const res = await fetch(`/api/sectors/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch sector ${id}`);
    return res.json();
  },

  // Agencies
  async getAgencies(params?: { sectorId?: string; status?: string; search?: string }): Promise<Agency[]> {
    const url = new URL('/api/agencies', window.location.origin);
    if (params?.sectorId) url.searchParams.set('sectorId', params.sectorId);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch staffing agencies');
    return res.json();
  },

  async getAgencyById(id: string): Promise<Agency> {
    const res = await fetch(`/api/agencies/${id}`);
    if (!res.ok) throw new Error('Failed to fetch agency details');
    return res.json();
  },

  async registerAgency(payload: AgencyRegistrationPayload): Promise<{ success: boolean; agency: Agency; message: string }> {
    const res = await fetch('/api/agencies/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit agency registration');
    }
    return data;
  },

  // Admin Agency Status & Governance Action
  async updateAgencyStatus(
    id: string,
    payload: { status?: string; tier?: string; remarks?: string; stage?: number }
  ): Promise<{ success: boolean; agency: Agency; message: string }> {
    const res = await fetch(`/api/agencies/${id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update agency status');
    }
    return data;
  },

  // Clients
  async getClients(): Promise<ClientProfile[]> {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  async registerClient(payload: ClientRegistrationPayload): Promise<{ success: boolean; client: ClientProfile; message: string }> {
    const res = await fetch('/api/clients/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit client registration');
    }
    return data;
  },

  // Requisitions
  async getRequisitions(sectorId?: string): Promise<StaffingRequisition[]> {
    const url = new URL('/api/requisitions', window.location.origin);
    if (sectorId && sectorId !== 'all') url.searchParams.set('sectorId', sectorId);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch staffing requisitions');
    return res.json();
  },

  async postRequisition(req: Partial<StaffingRequisition>): Promise<{ success: boolean; requisition: StaffingRequisition }> {
    const res = await fetch('/api/requisitions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to post requisition');
    }
    return data;
  },

  async createRequisition(req: Partial<StaffingRequisition>): Promise<{ success: boolean; requisition: StaffingRequisition }> {
    return this.postRequisition(req);
  },

  // Real-time stats
  async getRealtimeStats(): Promise<RealtimeStats> {
    const res = await fetch('/api/stats/realtime');
    if (!res.ok) throw new Error('Failed to fetch real-time stats');
    return res.json();
  },

  // Admin System Action
  async triggerAdminAction(actionType: string, details?: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/admin/system-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ actionType, details }),
    });
    return res.json();
  },

  // Admin User Credentials Provisioning
  async getProvisionedUsers(): Promise<ProvisionedUser[]> {
    const res = await fetch('/api/admin/users', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch provisioned users');
    return res.json();
  },

  async createUserCredentials(payload: CreateUserCredentialPayload): Promise<{ success: boolean; user: ProvisionedUser; message: string }> {
    const res = await fetch('/api/admin/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create user credentials');
    }
    return data;
  },

  // Agency Division Expansion Requests
  async getDivisionRequests(): Promise<DivisionWorkRequest[]> {
    const res = await fetch('/api/admin/division-requests', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch division requests');
    return res.json();
  },

  async requestDivisionWork(payload: {
    agencyId: string;
    agencyName?: string;
    currentSectorId?: string;
    requestedSectorId: string;
    requestedSectorName?: string;
    recruiterCount?: number;
    candidatePoolSize?: string;
    certifications?: string[];
    experienceSummary?: string;
  }): Promise<{ success: boolean; request: DivisionWorkRequest; message: string }> {
    const res = await fetch('/api/agencies/request-division', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit division work request');
    }
    return data;
  },

  async reviewDivisionRequest(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    adminNotes?: string
  ): Promise<{ success: boolean; request: DivisionWorkRequest; message: string }> {
    const res = await fetch(`/api/admin/division-requests/${id}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: JSON.stringify({ status, adminNotes }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to review division request');
    }
    return data;
  },
};

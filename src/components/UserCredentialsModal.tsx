import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  UserPlus, 
  Building2, 
  Users, 
  ShieldCheck, 
  Check, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  Agency, 
  ClientProfile, 
  SectorDetail, 
  SectorId, 
  CreateUserCredentialPayload,
  ProvisionedUser
} from '../types.ts';
import { api } from '../services/api.ts';

interface UserCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencies: Agency[];
  clients: ClientProfile[];
  sectors: SectorDetail[];
  onSuccess: (user: ProvisionedUser) => void;
}

export const UserCredentialsModal: React.FC<UserCredentialsModalProps> = ({
  isOpen,
  onClose,
  agencies,
  clients,
  sectors,
  onSuccess,
}) => {
  const [role, setRole] = useState<'AGENCY' | 'CLIENT'>('AGENCY');
  const [selectedEntityId, setSelectedEntityId] = useState<string>(agencies[0]?.id || '');
  const [customCompanyName, setCustomCompanyName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [assignedSector, setAssignedSector] = useState<SectorId>('it_cloud');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<ProvisionedUser | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  const handleRoleChange = (newRole: 'AGENCY' | 'CLIENT') => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === 'AGENCY') {
      setSelectedEntityId(agencies[0]?.id || '');
      setRoleTitle('Authorized Agency Managing Partner');
      if (agencies[0]?.sectorId) setAssignedSector(agencies[0].sectorId);
    } else {
      setSelectedEntityId(clients[0]?.id || '');
      setRoleTitle('Enterprise Contingent Talent Director');
      if (clients[0]?.sectorId) setAssignedSector(clients[0].sectorId);
    }
  };

  const handleEntitySelect = (id: string) => {
    setSelectedEntityId(id);
    if (role === 'AGENCY') {
      const ag = agencies.find(a => a.id === id);
      if (ag) {
        setAssignedSector(ag.sectorId);
        if (ag.contactPerson?.email && !email) setEmail(ag.contactPerson.email);
        if (ag.contactPerson?.name && !name) setName(ag.contactPerson.name);
      }
    } else {
      const cl = clients.find(c => c.id === id);
      if (cl) {
        setAssignedSector(cl.sectorId);
        if (cl.contactPerson?.email && !email) setEmail(cl.contactPerson.email);
        if (cl.contactPerson?.name && !name) setName(cl.contactPerson.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory credential fields.');
      return;
    }

    setIsLoading(true);
    try {
      let companyName = '';
      if (selectedEntityId === 'new') {
        companyName = customCompanyName.trim();
      } else if (role === 'AGENCY') {
        companyName = agencies.find(a => a.id === selectedEntityId)?.name || 'Empanelled Vendor Partner';
      } else {
        companyName = clients.find(c => c.id === selectedEntityId)?.companyName || 'Client';
      }

      const payload: CreateUserCredentialPayload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role,
        roleTitle: roleTitle.trim() || (role === 'AGENCY' ? 'Vendor Account Director' : 'Client Talent Lead'),
        assignedSector,
        agencyId: role === 'AGENCY' && selectedEntityId !== 'new' ? selectedEntityId : undefined,
        clientId: role === 'CLIENT' && selectedEntityId !== 'new' ? selectedEntityId : undefined,
        companyName,
      };

      const result = await api.createUserCredentials(payload);
      setCreatedUser(result.user);
      onSuccess(result.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create user credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!createdUser) return;
    const text = `AuroPro Contingent Portal Credentials\nRole: ${createdUser.role === 'AGENCY' ? 'Empanelled Vendor Partner' : 'Client Account'}\nOrganization: ${createdUser.companyName}\nEmail / Login ID: ${createdUser.email}\nPassword: ${createdUser.password}\nPortal Gateway: http://localhost:3000/`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 3000);
  };

  const resetForm = () => {
    setCreatedUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setCustomCompanyName('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Provision User Credentials
              </h3>
              <p className="text-xs text-slate-300">
                Grant authorized platform access to Vendors or Clients
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {createdUser ? (
            /* Success View */
            <div className="space-y-6 py-2 animate-in zoom-in-95">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">User Credentials Successfully Provisioned!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  Credentials have been committed to the security store and logged in the Super Admin audit trail. The user can immediately authenticate via the Portal Login.
                </p>
              </div>

              {/* Credentials Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account Summary</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    createdUser.role === 'AGENCY' ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300' : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                  }`}>
                    {createdUser.role === 'AGENCY' ? 'Vendor' : 'Client'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Authorized User</span>
                    <strong className="text-slate-900 dark:text-white">{createdUser.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Organization</span>
                    <strong className="text-slate-900 dark:text-white">{createdUser.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email / Login ID</span>
                    <strong className="text-slate-900 dark:text-white font-mono select-all">{createdUser.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Temporary Password</span>
                    <strong className="text-slate-900 dark:text-white font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 inline-block select-all">
                      {createdUser.password}
                    </strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Designated Role Title</span>
                    <span className="text-slate-700 dark:text-slate-300">{createdUser.roleTitle}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
                >
                  Create Another User
                </button>
                <button
                  type="button"
                  onClick={copyCredentials}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-md flex items-center justify-center gap-2"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Credentials</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs text-center"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Select User Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  1. Select Account Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('AGENCY')}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      role === 'AGENCY'
                        ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/30 ring-2 ring-orange-400/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${role === 'AGENCY' ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Vendor Partner</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Empanelled supplier access for candidate submittal & orders
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('CLIENT')}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                      role === 'CLIENT'
                        ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/30 ring-2 ring-blue-400/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/40'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${role === 'CLIENT' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">Client</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        Corporate buyer account to dispatch requisitions & approve hires
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 2: Affiliation Organization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  2. Associated Organization / Company
                </label>
                <select
                  value={selectedEntityId}
                  onChange={(e) => handleEntitySelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 font-medium text-slate-800 dark:text-slate-100"
                >
                  {role === 'AGENCY' ? (
                    <>
                      {agencies.map((ag) => (
                        <option key={ag.id} value={ag.id}>
                          {ag.name} ({ag.tier} - {ag.sectorId})
                        </option>
                      ))}
                      <option value="new">+ Custom / New Vendor Partner</option>
                    </>
                  ) : (
                    <>
                      {clients.map((cl) => (
                        <option key={cl.id} value={cl.id}>
                          {cl.companyName} ({cl.industry})
                        </option>
                      ))}
                      <option value="new">+ Custom / New Client</option>
                    </>
                  )}
                </select>

                {selectedEntityId === 'new' && (
                  <input
                    type="text"
                    required
                    value={customCompanyName}
                    onChange={(e) => setCustomCompanyName(e.target.value)}
                    placeholder={role === 'AGENCY' ? 'e.g. Apex Staffing Global Partners' : 'e.g. Acme FinTech Corp'}
                    className="mt-2 w-full px-3.5 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                )}
              </div>

              {/* Step 3: Contact Person Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Representative Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Work Email (Login ID) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. marcus@apexpartners.com"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder={role === 'AGENCY' ? 'Managing Partner' : 'VP of Talent Acquisition'}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Designated Staffing Division
                  </label>
                  <select
                    value={assignedSector}
                    onChange={(e) => setAssignedSector(e.target.value as SectorId)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 font-medium text-slate-900 dark:text-white"
                  >
                    {sectors.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name} ({sec.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password Setting */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    User Password *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter or generate a password..."
                    className="w-full pl-3.5 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 font-mono text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Credentials can be directly provided to partner/client or sent via internal email invitation.
                </p>
              </div>

              {/* Admin Attestation */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Admin Audit Assurance: By creating these credentials, the Super Admin confirms statutory E&O, W2 co-employment, and E-Verify vetting requirements have been initialized.
                </span>
              </div>

              {/* Modal Buttons */}
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
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Provisioning Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Provision Credentials</span>
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

import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  UserPlus, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Building2, 
  Users, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ProvisionedUser } from '../types.ts';
import { api } from '../services/api.ts';

interface UserCredentialsTabProps {
  onOpenCreateModal: () => void;
}

export const UserCredentialsTab: React.FC<UserCredentialsTabProps> = ({ onOpenCreateModal }) => {
  const [users, setUsers] = useState<ProvisionedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'AGENCY' | 'CLIENT' | 'ADMIN'>('ALL');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProvisionedUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load provisioned users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyUserCredentials = (user: ProvisionedUser) => {
    const text = `AuroPro Access Credentials:\nAccount: ${user.companyName}\nName: ${user.name}\nEmail: ${user.email}\nPassword: ${user.password || '(Managed by User)'}\nRole: ${user.role}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = searchTerm === '' ||
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.companyName && u.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* Top Banner & Action */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            <span>Master Identity & Access Management</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Authorized User Credentials & Logins
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Provision, inspect, and issue authenticated logins for Empanelled Vendor Partners and Clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap sm:flex-nowrap">
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-600' : ''}`} />
          </button>
          <button
            id="btn-tab-create-credentials"
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User Credentials</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name, email, or org..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold shrink-0 whitespace-nowrap">
            {(['ALL', 'AGENCY', 'CLIENT', 'ADMIN'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 min-h-[32px] rounded-lg transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r === 'ALL' ? 'All Accounts' : r === 'AGENCY' ? 'Vendors' : r === 'CLIENT' ? 'Clients' : 'Super Admins'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Credentials Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading provisioned user accounts...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <KeyRound className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-slate-600 dark:text-slate-300">No user accounts found matching query</p>
            <p className="text-xs text-slate-400 mt-1">Click "Create User Credentials" to provision new credentials.</p>
          </div>
        ) : (
          <div className="overflow-x-auto touch-pan-x">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300 min-w-[700px]">
              <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Authorized User</th>
                  <th className="py-3.5 px-4">Account Type</th>
                  <th className="py-3.5 px-4">Organization</th>
                  <th className="py-3.5 px-4">Login Email</th>
                  <th className="py-3.5 px-4">Password</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((user) => {
                  const isVisible = visiblePasswords[user.id] || false;
                  const isCopied = copiedId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Name & Role Title */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400">{user.roleTitle}</div>
                      </td>

                      {/* Account Type Badge */}
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.role === 'AGENCY' 
                            ? 'bg-orange-50 text-orange-800 border border-orange-200' 
                            : user.role === 'CLIENT'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}>
                          {user.role === 'AGENCY' ? <Users className="w-3 h-3" /> : user.role === 'CLIENT' ? <Building2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          <span>{user.role === 'AGENCY' ? 'Vendor' : user.role === 'CLIENT' ? 'Client' : 'Super Admin'}</span>
                        </span>
                      </td>

                      {/* Organization */}
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{user.companyName || '—'}</span>
                        {user.assignedSector && (
                          <div className="text-[10px] text-slate-400 uppercase font-mono">{user.assignedSector}</div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {user.email}
                      </td>

                      {/* Password */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                          <span className="font-mono text-[11px] text-slate-900 dark:text-slate-100 select-all">
                            {isVisible ? user.password || '••••••••' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            title={isVisible ? 'Hide Password' : 'Show Password'}
                          >
                            {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>Active</span>
                        </span>
                      </td>

                      {/* Copy Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleCopyUserCredentials(user)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer border border-slate-200/60 dark:border-slate-700"
                          title="Copy Full Credentials"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

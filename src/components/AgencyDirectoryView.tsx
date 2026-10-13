import React, { useState } from 'react';
import { Agency, SectorDetail, SectorId, UserSession } from '../types.ts';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  Sliders, 
  ArrowLeft,
  Building2,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface AgencyDirectoryViewProps {
  agencies: Agency[];
  sectors: SectorDetail[];
  currentUser: UserSession | null;
  onSelectAgency: (agency: Agency) => void;
  onNavigateToAdmin?: () => void;
  onNavigateBack: () => void;
}

export const AgencyDirectoryView: React.FC<AgencyDirectoryViewProps> = ({
  agencies,
  sectors,
  currentUser,
  onSelectAgency,
  onNavigateToAdmin,
  onNavigateBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<SectorId | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const filteredAgencies = agencies.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.headquarters.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.certifications.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = selectedSector === 'all' || a.sectorId === selectedSector;
    const matchesTier = selectedTier === 'all' || a.tier.includes(selectedTier);
    return matchesSearch && matchesSector && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Registration Gateway</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Empanelled Vendor Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse thoroughly audited and accredited vendor suppliers across IT, Healthcare, Engineering, and Finance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              <span>Super Admin Controls</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendors, locations, certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 min-h-[40px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as any)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white min-h-[40px]"
          >
            <option value="all">All Divisions</option>
            {sectors.map(s => (
              <option key={s.id} value={s.id}>{s.shortName}</option>
            ))}
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="flex-1 sm:flex-initial px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white min-h-[40px]"
          >
            <option value="all">All Supplier Tiers</option>
            <option value="Strategic">Tier-1 Strategic Only</option>
            <option value="Preferred">Tier-2 Preferred Only</option>
            <option value="Associate">Associate Agencies</option>
          </select>
        </div>
      </div>

      {/* Agencies Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredAgencies.map((agency) => (
          <div
            key={agency.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={agency.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={agency.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{agency.name}</span>
                      {agency.status === 'EMPANELLED' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {agency.headquarters} &bull; {agency.registrationNumber}
                    </p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  agency.tier.includes('Strategic')
                    ? 'bg-orange-50 text-orange-800 border-orange-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {agency.tier.split(' ')[0]}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium line-clamp-2">
                {agency.subCategory}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Talent Pool</span>
                  <span className="text-xs font-bold text-slate-800">{agency.candidatePoolSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Markup Cap</span>
                  <span className="text-xs font-bold text-orange-600">{agency.billRateMarkup}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Audit Score</span>
                  <span className="text-xs font-bold text-emerald-600">{agency.complianceScore}%</span>
                </div>
              </div>

              {/* Certifications badges */}
              <div className="flex flex-wrap gap-1">
                {agency.certifications.slice(0, 3).map((cert, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectAgency(agency)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>View Full Dossier & Audit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

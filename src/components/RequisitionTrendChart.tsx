import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  Filter, 
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { SectorDetail, SectorId } from '../types.ts';

export interface SectorMonthlyData {
  requisitions: number;
  placements: number;
}

export interface MonthlyTrendRecord {
  month: string;
  fullMonth: string;
  year: number;
  totalRequisitions: number;
  totalPlacements: number;
  bySector: Record<SectorId, SectorMonthlyData>;
}

// Comprehensive 12-month historical telemetry data across all 6 sectors
const MONTHLY_HISTORICAL_DATA: MonthlyTrendRecord[] = [
  {
    month: 'Oct 25',
    fullMonth: 'October 2025',
    year: 2025,
    totalRequisitions: 182,
    totalPlacements: 154,
    bySector: {
      it_cloud: { requisitions: 74, placements: 63 },
      healthcare: { requisitions: 48, placements: 42 },
      engineering: { requisitions: 26, placements: 21 },
      bfsi_finance: { requisitions: 18, placements: 15 },
      logistics_ops: { requisitions: 10, placements: 8 },
      executive_prof: { requisitions: 6, placements: 5 },
    },
  },
  {
    month: 'Nov 25',
    fullMonth: 'November 2025',
    year: 2025,
    totalRequisitions: 205,
    totalPlacements: 176,
    bySector: {
      it_cloud: { requisitions: 82, placements: 71 },
      healthcare: { requisitions: 54, placements: 48 },
      engineering: { requisitions: 29, placements: 24 },
      bfsi_finance: { requisitions: 21, placements: 17 },
      logistics_ops: { requisitions: 12, placements: 10 },
      executive_prof: { requisitions: 7, placements: 6 },
    },
  },
  {
    month: 'Dec 25',
    fullMonth: 'December 2025',
    year: 2025,
    totalRequisitions: 194,
    totalPlacements: 169,
    bySector: {
      it_cloud: { requisitions: 78, placements: 69 },
      healthcare: { requisitions: 52, placements: 46 },
      engineering: { requisitions: 28, placements: 24 },
      bfsi_finance: { requisitions: 20, placements: 17 },
      logistics_ops: { requisitions: 10, placements: 8 },
      executive_prof: { requisitions: 6, placements: 5 },
    },
  },
  {
    month: 'Jan 26',
    fullMonth: 'January 2026',
    year: 2026,
    totalRequisitions: 238,
    totalPlacements: 204,
    bySector: {
      it_cloud: { requisitions: 96, placements: 83 },
      healthcare: { requisitions: 62, placements: 55 },
      engineering: { requisitions: 34, placements: 29 },
      bfsi_finance: { requisitions: 24, placements: 20 },
      logistics_ops: { requisitions: 14, placements: 11 },
      executive_prof: { requisitions: 8, placements: 6 },
    },
  },
  {
    month: 'Feb 26',
    fullMonth: 'February 2026',
    year: 2026,
    totalRequisitions: 260,
    totalPlacements: 228,
    bySector: {
      it_cloud: { requisitions: 108, placements: 95 },
      healthcare: { requisitions: 68, placements: 61 },
      engineering: { requisitions: 37, placements: 32 },
      bfsi_finance: { requisitions: 26, placements: 22 },
      logistics_ops: { requisitions: 13, placements: 11 },
      executive_prof: { requisitions: 8, placements: 7 },
    },
  },
  {
    month: 'Mar 26',
    fullMonth: 'March 2026',
    year: 2026,
    totalRequisitions: 284,
    totalPlacements: 251,
    bySector: {
      it_cloud: { requisitions: 116, placements: 104 },
      healthcare: { requisitions: 75, placements: 67 },
      engineering: { requisitions: 41, placements: 35 },
      bfsi_finance: { requisitions: 28, placements: 24 },
      logistics_ops: { requisitions: 15, placements: 13 },
      executive_prof: { requisitions: 9, placements: 8 },
    },
  },
  {
    month: 'Apr 26',
    fullMonth: 'April 2026',
    year: 2026,
    totalRequisitions: 310,
    totalPlacements: 275,
    bySector: {
      it_cloud: { requisitions: 128, placements: 115 },
      healthcare: { requisitions: 82, placements: 73 },
      engineering: { requisitions: 44, placements: 39 },
      bfsi_finance: { requisitions: 31, placements: 26 },
      logistics_ops: { requisitions: 16, placements: 14 },
      executive_prof: { requisitions: 9, placements: 8 },
    },
  },
  {
    month: 'May 26',
    fullMonth: 'May 2026',
    year: 2026,
    totalRequisitions: 335,
    totalPlacements: 301,
    bySector: {
      it_cloud: { requisitions: 139, placements: 126 },
      healthcare: { requisitions: 88, placements: 80 },
      engineering: { requisitions: 48, placements: 42 },
      bfsi_finance: { requisitions: 33, placements: 29 },
      logistics_ops: { requisitions: 17, placements: 15 },
      executive_prof: { requisitions: 10, placements: 9 },
    },
  },
  {
    month: 'Jun 26',
    fullMonth: 'June 2026',
    year: 2026,
    totalRequisitions: 360,
    totalPlacements: 324,
    bySector: {
      it_cloud: { requisitions: 150, placements: 136 },
      healthcare: { requisitions: 95, placements: 86 },
      engineering: { requisitions: 51, placements: 46 },
      bfsi_finance: { requisitions: 35, placements: 31 },
      logistics_ops: { requisitions: 18, placements: 15 },
      executive_prof: { requisitions: 11, placements: 10 },
    },
  },
  {
    month: 'Jul 26',
    fullMonth: 'July 2026',
    year: 2026,
    totalRequisitions: 378,
    totalPlacements: 342,
    bySector: {
      it_cloud: { requisitions: 158, placements: 144 },
      healthcare: { requisitions: 100, placements: 91 },
      engineering: { requisitions: 53, placements: 47 },
      bfsi_finance: { requisitions: 37, placements: 32 },
      logistics_ops: { requisitions: 19, placements: 17 },
      executive_prof: { requisitions: 11, placements: 11 },
    },
  },
  {
    month: 'Aug 26',
    fullMonth: 'August 2026',
    year: 2026,
    totalRequisitions: 405,
    totalPlacements: 368,
    bySector: {
      it_cloud: { requisitions: 170, placements: 156 },
      healthcare: { requisitions: 108, placements: 98 },
      engineering: { requisitions: 56, placements: 50 },
      bfsi_finance: { requisitions: 39, placements: 35 },
      logistics_ops: { requisitions: 20, placements: 18 },
      executive_prof: { requisitions: 12, placements: 11 },
    },
  },
  {
    month: 'Sep 26',
    fullMonth: 'September 2026',
    year: 2026,
    totalRequisitions: 432,
    totalPlacements: 395,
    bySector: {
      it_cloud: { requisitions: 182, placements: 168 },
      healthcare: { requisitions: 114, placements: 105 },
      engineering: { requisitions: 60, placements: 54 },
      bfsi_finance: { requisitions: 42, placements: 38 },
      logistics_ops: { requisitions: 21, placements: 18 },
      executive_prof: { requisitions: 13, placements: 12 },
    },
  },
];

const SECTOR_CONFIG: Record<
  SectorId,
  { name: string; shortName: string; color: string; badgeCls: string }
> = {
  it_cloud: {
    name: 'Information Technology, Cloud & AI',
    shortName: 'IT & Cloud',
    color: '#2563eb', // Blue
    badgeCls: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  healthcare: {
    name: 'Healthcare, Clinical & Travel Nursing',
    shortName: 'Healthcare',
    color: '#059669', // Emerald
    badgeCls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  engineering: {
    name: 'Engineering, Aerospace & Hardware Tech',
    shortName: 'Engineering',
    color: '#d97706', // Amber
    badgeCls: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  bfsi_finance: {
    name: 'Banking, Financial Services & Insurance',
    shortName: 'BFSI & Finance',
    color: '#7c3aed', // Purple
    badgeCls: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  logistics_ops: {
    name: 'Logistics, Supply Chain & Operations',
    shortName: 'Logistics & Ops',
    color: '#0891b2', // Cyan
    badgeCls: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  executive_prof: {
    name: 'Executive Search & Strategic Consulting',
    shortName: 'Executive & Prof',
    color: '#dc2626', // Red
    badgeCls: 'bg-red-50 text-red-700 border-red-200',
  },
};

interface RequisitionTrendChartProps {
  sectors: SectorDetail[];
}

export const RequisitionTrendChart: React.FC<RequisitionTrendChartProps> = ({ sectors }) => {
  const [selectedSector, setSelectedSector] = useState<SectorId | 'all'>('all');
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('12m');
  const [viewMode, setViewMode] = useState<'dual' | 'sectors'>('dual');

  // Filter dataset by selected time window
  const activeDataset = useMemo(() => {
    if (timeRange === '6m') {
      return MONTHLY_HISTORICAL_DATA.slice(-6);
    }
    return MONTHLY_HISTORICAL_DATA;
  }, [timeRange]);

  // Transformed data for Recharts based on selected sector and view mode
  const chartData = useMemo(() => {
    return activeDataset.map((item) => {
      if (selectedSector === 'all') {
        return {
          month: item.month,
          fullMonth: item.fullMonth,
          requisitions: item.totalRequisitions,
          placements: item.totalPlacements,
          fulfillmentRate: Math.round((item.totalPlacements / item.totalRequisitions) * 100),
          // Sector breakdown for multi-sector view
          it_cloud_req: item.bySector.it_cloud.requisitions,
          it_cloud_plc: item.bySector.it_cloud.placements,
          healthcare_req: item.bySector.healthcare.requisitions,
          healthcare_plc: item.bySector.healthcare.placements,
          engineering_req: item.bySector.engineering.requisitions,
          engineering_plc: item.bySector.engineering.placements,
          bfsi_finance_req: item.bySector.bfsi_finance.requisitions,
          bfsi_finance_plc: item.bySector.bfsi_finance.placements,
          logistics_ops_req: item.bySector.logistics_ops.requisitions,
          logistics_ops_plc: item.bySector.logistics_ops.placements,
          executive_prof_req: item.bySector.executive_prof.requisitions,
          executive_prof_plc: item.bySector.executive_prof.placements,
        };
      } else {
        const sectorData = item.bySector[selectedSector];
        return {
          month: item.month,
          fullMonth: item.fullMonth,
          requisitions: sectorData.requisitions,
          placements: sectorData.placements,
          fulfillmentRate: Math.round((sectorData.placements / sectorData.requisitions) * 100),
        };
      }
    });
  }, [activeDataset, selectedSector]);

  // Aggregate summary metrics for the active view
  const summaryMetrics = useMemo(() => {
    const totalReq = chartData.reduce((acc, curr) => acc + curr.requisitions, 0);
    const totalPlc = chartData.reduce((acc, curr) => acc + curr.placements, 0);
    const avgFillRate = totalReq > 0 ? ((totalPlc / totalReq) * 100).toFixed(1) : '0';

    // Calculate growth delta between first month in window and latest month
    const firstMonth = chartData[0];
    const latestMonth = chartData[chartData.length - 1];
    const reqGrowth = firstMonth.requisitions > 0
      ? (((latestMonth.requisitions - firstMonth.requisitions) / firstMonth.requisitions) * 100).toFixed(1)
      : '0';

    return {
      totalReq,
      totalPlc,
      avgFillRate,
      reqGrowth: Number(reqGrowth) >= 0 ? `+${reqGrowth}%` : `${reqGrowth}%`,
      latestMonthName: latestMonth.fullMonth,
      latestReq: latestMonth.requisitions,
      latestPlc: latestMonth.placements,
    };
  }, [chartData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
      return (
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs z-50 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="font-extrabold text-slate-900 text-sm">{dataPoint.fullMonth || label}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {dataPoint.fulfillmentRate}% Fill Rate
            </span>
          </div>

          {viewMode === 'dual' || selectedSector !== 'all' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                  <span className="text-slate-600 font-medium">New Requisitions:</span>
                </div>
                <span className="font-bold text-slate-900 text-sm">{dataPoint.requisitions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-slate-600 font-medium">Fulfilled Placements:</span>
                </div>
                <span className="font-bold text-slate-900 text-sm">{dataPoint.placements.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Placement Velocity Gap:</span>
                <span className="font-semibold text-slate-700">
                  {dataPoint.requisitions - dataPoint.placements} pending
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Sector Volume (Req / Placed)
              </div>
              {(Object.keys(SECTOR_CONFIG) as SectorId[]).map((secKey) => {
                const conf = SECTOR_CONFIG[secKey];
                const reqVal = dataPoint[`${secKey}_req`];
                const plcVal = dataPoint[`${secKey}_plc`];
                return (
                  <div key={secKey} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: conf.color }} />
                      <span className="text-slate-700 font-medium truncate">{conf.shortName}</span>
                    </div>
                    <span className="font-mono text-slate-900 font-bold shrink-0">
                      {reqVal} <span className="text-slate-400 font-normal">/</span> {plcVal}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="admin-requisition-trend-chart-panel" className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 mb-8">
      {/* Header section with title and interactive control toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800">
              Central Staffing Telemetry
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">Live Trend Visualizer</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Requisition Inflow &amp; Placement Fulfillment Trend</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Monthly velocity analysis comparing client contingent requisitions opened against verified vendor candidate placements across all specialized sectors.
          </p>
        </div>

        {/* Filter and Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          {/* Sector Selector */}
          <div className="relative w-full sm:w-auto">
            <select
              id="select-trend-sector"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value as SectorId | 'all')}
              className="w-full sm:w-auto text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-2 pr-8 focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-colors cursor-pointer min-h-[38px]"
            >
              <option value="all">All Sectors Aggregated</option>
              {sectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs min-h-[38px]">
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                timeRange === '6m'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeRange('12m')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                timeRange === '12m'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Months
            </button>
          </div>

          {/* View mode toggle (only visible when All Sectors is active) */}
          {selectedSector === 'all' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('dual')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'dual'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="View overall new requisitions vs fulfilled placements"
              >
                <span>Dual Metrics</span>
              </button>
              <button
                onClick={() => setViewMode('sectors')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'sectors'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Compare requisition trends across all 6 sectors"
              >
                <Layers className="w-3 h-3" />
                <span>By Sector</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-5">
        <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-900 uppercase tracking-wider">
              Total Requisitions
            </span>
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {summaryMetrics.totalReq.toLocaleString()}
          </div>
          <div className="text-[11px] text-orange-700 font-semibold mt-0.5 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{summaryMetrics.reqGrowth} overall velocity</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
              Fulfilled Placements
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {summaryMetrics.totalPlc.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            Verified candidate hires
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              Empanelment Fill Rate
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {summaryMetrics.avgFillRate}%
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
            SLA contract compliance
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Active Scope
            </span>
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate">
            {selectedSector === 'all'
              ? 'All 6 Staffing Sectors'
              : SECTOR_CONFIG[selectedSector]?.shortName || 'Selected Sector'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {timeRange === '12m' ? 'Full Year (12 Mo)' : 'Rolling 6 Months'}
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart Container */}
      <div className="h-[270px] sm:h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 16, left: -10, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />

            {/* DUAL METRIC MODE: Requisitions vs Fulfilled Placements */}
            {viewMode === 'dual' || selectedSector !== 'all' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="requisitions"
                  name="New Requisitions Opened"
                  stroke="#ea580c" // AuroPro Orange
                  strokeWidth={2.75}
                  dot={{ r: 4, stroke: '#ea580c', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, stroke: '#c2410c', strokeWidth: 2, fill: '#ea580c' }}
                />
                <Line
                  type="monotone"
                  dataKey="placements"
                  name="Fulfilled Placements"
                  stroke="#059669" // Emerald Green
                  strokeWidth={2.75}
                  dot={{ r: 4, stroke: '#059669', strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, stroke: '#047857', strokeWidth: 2, fill: '#059669' }}
                />
              </>
            ) : (
              /* SECTOR BREAKDOWN COMPARISON MODE: Requisition line per sector */
              <>
                <Line
                  type="monotone"
                  dataKey="it_cloud_req"
                  name="IT & Cloud"
                  stroke={SECTOR_CONFIG.it_cloud.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.it_cloud.color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="healthcare_req"
                  name="Healthcare"
                  stroke={SECTOR_CONFIG.healthcare.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.healthcare.color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="engineering_req"
                  name="Engineering"
                  stroke={SECTOR_CONFIG.engineering.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.engineering.color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="bfsi_finance_req"
                  name="BFSI & Finance"
                  stroke={SECTOR_CONFIG.bfsi_finance.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.bfsi_finance.color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="logistics_ops_req"
                  name="Logistics"
                  stroke={SECTOR_CONFIG.logistics_ops.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.logistics_ops.color }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="executive_prof_req"
                  name="Executive"
                  stroke={SECTOR_CONFIG.executive_prof.color}
                  strokeWidth={2.2}
                  dot={{ r: 3, fill: SECTOR_CONFIG.executive_prof.color }}
                  activeDot={{ r: 5 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sector Performance Footprint strip */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Latest Sector Velocity Snapshot ({summaryMetrics.latestMonthName})</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any sector to filter trend line</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(SECTOR_CONFIG) as SectorId[]).map((secKey) => {
            const conf = SECTOR_CONFIG[secKey];
            const latestData = MONTHLY_HISTORICAL_DATA[MONTHLY_HISTORICAL_DATA.length - 1].bySector[secKey];
            const fillRate = Math.round((latestData.placements / latestData.requisitions) * 100);
            const isSelected = selectedSector === secKey;

            return (
              <button
                key={secKey}
                onClick={() => setSelectedSector(isSelected ? 'all' : secKey)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/60 shadow-xs ring-2 ring-orange-500/20'
                    : 'border-slate-200/90 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold truncate text-slate-700" title={conf.name}>
                    {conf.shortName}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conf.color }} />
                </div>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-sm font-extrabold text-slate-900">{latestData.requisitions}</span>
                  <span className="text-[10px] text-slate-500 font-medium">reqs</span>
                </div>
                <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500">
                  <span>{latestData.placements} placed</span>
                  <span className="font-bold text-emerald-600">{fillRate}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

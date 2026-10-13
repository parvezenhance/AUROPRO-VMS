import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Users, 
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DivisionWorkRequest } from '../types.ts';
import { api } from '../services/api.ts';

export const DivisionRequestsReview: React.FC = () => {
  const [requests, setRequests] = useState<DivisionWorkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDivisionRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load division requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleReview = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setReviewingId(id);
    try {
      const res = await api.reviewDivisionRequest(
        id, 
        status, 
        status === 'APPROVED' ? 'Approved by Super Admin. Division access authorized.' : 'Declined pending statutory capacity review.'
      );
      setFeedback(res.message);
      await fetchRequests();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Action failed');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Division Expansion Governance</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            Agency Additional Division Work Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review formal requests from empanelled agency partners seeking empanelment authorization in additional regulated sectors.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading division expansion requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-bold text-sm text-slate-600 dark:text-slate-300">No division requests pending review</p>
            <p className="text-xs text-slate-400 mt-1">Vendor partners can request expansion to other divisions from their portal.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {requests.map((req) => (
              <div key={req.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">{req.agencyName}</span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Requesting: {req.requestedSectorName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'APPROVED' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : req.status === 'REJECTED'
                        ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {req.status === 'APPROVED' ? 'APPROVED' : req.status === 'REJECTED' ? 'DECLINED' : 'PENDING SUPER ADMIN REVIEW'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                    {req.experienceSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Recruiters: <strong className="text-slate-800 dark:text-slate-200">{req.recruiterCount} Staff</strong></span>
                    <span>&bull;</span>
                    <span>Talent Pool: <strong className="text-slate-800 dark:text-slate-200">{req.candidatePoolSize}</strong></span>
                    <span>&bull;</span>
                    <span>Submitted: <strong className="text-slate-800 dark:text-slate-200">{req.submittedDate}</strong></span>
                  </div>

                  {req.certifications && req.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.certifications.map((c, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium border border-slate-200/50 dark:border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {req.adminNotes && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700 inline-block">
                      Note from Admin: {req.adminNotes}
                    </div>
                  )}
                </div>

                {req.status === 'PENDING_REVIEW' && (
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleReview(req.id, 'REJECTED')}
                      disabled={reviewingId === req.id}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer min-h-[38px] flex items-center justify-center"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleReview(req.id, 'APPROVED')}
                      disabled={reviewingId === req.id}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Empanelment</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Paperclip,
  Sparkles,
  FileCheck,
  Award
} from 'lucide-react';
import { StaffingRequisition, CandidateDocument } from '../types.ts';

interface CandidateSubmitModalProps {
  requisition: StaffingRequisition | null;
  onClose: () => void;
  agencyName: string;
}

export const CandidateSubmitModal: React.FC<CandidateSubmitModalProps> = ({
  requisition,
  onClose,
  agencyName,
}) => {
  if (!requisition) return null;

  const [candidateName, setCandidateName] = useState('');
  const [candidateTitle, setCandidateTitle] = useState('');
  const [candidateRate, setCandidateRate] = useState(requisition.billRateRange?.split('-')[0]?.trim() || '$95/hr');
  const [candidateExperience, setCandidateExperience] = useState('7 Years');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [documents, setDocuments] = useState<CandidateDocument[]>([
    {
      id: 'doc_1',
      name: 'Candidate_Resume_Verified.pdf',
      size: '245 KB',
      type: 'resume',
      uploadedAt: 'Ready for submittal',
    }
  ]);
  const [selectedDocType, setSelectedDocType] = useState<CandidateDocument['type']>('work_auth');
  const [isDragging, setIsDragging] = useState(false);
  const [submittingSuccess, setSubmittingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const addFiles = (fileList: FileList) => {
    const newDocs: CandidateDocument[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      
      newDocs.push({
        id: `doc_${Date.now()}_${i}`,
        name: file.name,
        size: sizeStr,
        type: selectedDocType,
        uploadedAt: 'Just uploaded',
      });
    }
    setDocuments(prev => [...prev, ...newDocs]);
  };

  const handleQuickAddSampleDocs = () => {
    const samples: CandidateDocument[] = [
      {
        id: `doc_${Date.now()}_auth`,
        name: 'E-Verify_Federal_Authorization.pdf',
        size: '180 KB',
        type: 'work_auth',
        uploadedAt: 'Verified by Agency',
      },
      {
        id: `doc_${Date.now()}_cert`,
        name: 'Technical_Skill_Certification.pdf',
        size: '512 KB',
        type: 'certification',
        uploadedAt: 'Verified by Agency',
      }
    ];
    setDocuments(prev => [...prev, ...samples]);
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittingSuccess(true);
      setTimeout(() => {
        setSubmittingSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  const getDocTypeLabel = (type: CandidateDocument['type']) => {
    switch (type) {
      case 'resume': return 'Resume / CV';
      case 'work_auth': return 'Work Authorization';
      case 'certification': return 'Certifications';
      case 'background': return 'Background Check';
      default: return 'Supporting Doc';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-blue-300 uppercase tracking-wider font-bold">
              Submitting Candidate Dossier &bull; {requisition.id}
            </div>
            <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
              {requisition.title}
            </h3>
            <p className="text-xs text-slate-300">
              Target Client: <strong className="text-white">{requisition.clientName}</strong> &bull; {agencyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-w-[38px] min-h-[38px] rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {submittingSuccess ? (
            <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Candidate Dossier Dispatched!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto leading-relaxed">
                Candidate profile and <strong>{documents.length} attached statutory documents</strong> have been securely transferred to the <strong>{requisition.clientName}</strong> hiring manager inbox.
              </p>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 font-mono">
                SLA Clock Initialized: {requisition.slaHours}h response guarantee
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Candidate Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Current Professional Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateTitle}
                    onChange={e => setCandidateTitle(e.target.value)}
                    placeholder="e.g. Senior Distributed Systems Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Proposed Bill Rate
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateRate}
                    onChange={e => setCandidateRate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Relevant Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateExperience}
                    onChange={e => setCandidateExperience(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Candidate Contact Email
                  </label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={e => setCandidateEmail(e.target.value)}
                    placeholder="e.g. elena.r@email.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* DOCUMENT UPLOAD SECTION */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Attach Candidate Dossier ({documents.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickAddSampleDocs}
                    className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Quick Attach Verified Dossier</span>
                  </button>
                </div>

                {/* Upload Control Bar: Select Document Type & File Upload Input */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedDocType}
                    onChange={e => setSelectedDocType(e.target.value as CandidateDocument['type'])}
                    className="px-2.5 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 font-semibold"
                  >
                    <option value="resume">Resume / CV</option>
                    <option value="work_auth">Work Authorization (E-Verify / I-9)</option>
                    <option value="certification">Technical Certifications</option>
                    <option value="background">Background Check Clearance</option>
                    <option value="other">Other Supporting File</option>
                  </select>
                  <span className="text-xs text-slate-400">for next upload</span>
                </div>

                {/* Drag and Drop Zone + Click to Upload */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/30'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop files here, or <span className="text-blue-600 dark:text-blue-400 underline">browse files</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Supports PDF, DOCX, PNG, JPG (Resumes, E-Verify Attestations, Certifications)
                  </p>
                </div>

                {/* Uploaded Documents List */}
                {documents.length > 0 && (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {documents.map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{doc.name}</span>
                            <span className="text-[10px] text-slate-400">{doc.size} &bull; {doc.uploadedAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                            {getDocTypeLabel(doc.type)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Remove document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compliance Attestation */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>
                  By clicking Submit, {agencyName} attests that candidate has undergone statutory E-Verify checks, W2 tax compliance clearance, and agrees to the client rate card ceiling.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || documents.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Dossier...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Candidate Dossier</span>
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

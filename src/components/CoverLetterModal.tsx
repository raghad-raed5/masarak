import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Copy,
  CheckCircle2,
  Download,
  RefreshCw,
  Building,
  Briefcase,
} from 'lucide-react';
import { JobOpportunity, CvAnalysisResult } from '../types';

interface CoverLetterModalProps {
  job: JobOpportunity | null;
  cvAnalysis: CvAnalysisResult;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  job,
  cvAnalysis,
  onClose,
}) => {
  if (!job) return null;

  const [tone, setTone] = useState<'confident' | 'enthusiastic' | 'formal' | 'modern'>('confident');
  const [subjectLine, setSubjectLine] = useState(`Application for ${job.title} — ${cvAnalysis.extractedProfile.candidateName}`);
  const [letterContent, setLetterContent] = useState('');
  const [keyStrengths, setKeyStrengths] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async (selectedTone = tone) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: cvAnalysis.extractedProfile.candidateName,
          studentBio: cvAnalysis.extractedProfile.summary,
          skills: cvAnalysis.extractedProfile.detectedSkills,
          jobTitle: job.title,
          company: job.company,
          jobRequirements: job.requirements,
          tone: selectedTone,
        }),
      });

      if (!res.ok) throw new Error('Letter generation failed');
      const data = await res.json();
      setSubjectLine(data.subjectLine || `Application for ${job.title} — ${cvAnalysis.extractedProfile.candidateName}`);
      setLetterContent(data.coverLetterText || '');
      setKeyStrengths(data.keyStrengthsEmphasized || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateLetter();
  }, [job]);

  const handleCopy = () => {
    const fullText = `Subject: ${subjectLine}\n\n${letterContent}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([`Subject: ${subjectLine}\n\n${letterContent}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${job.company.replace(/\s+/g, '_')}_${cvAnalysis.extractedProfile.candidateName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Feature 9: AI Cover Letter Writer
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Tailored Cover Letter for {job.company}</span>
            </h2>
            <p className="text-xs text-slate-400">{job.title}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tone Selector & Controls */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Tone:</span>
            {(['confident', 'enthusiastic', 'formal', 'modern'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTone(t);
                  generateLetter(t);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                  tone === t
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => generateLetter(tone)}
            disabled={isGenerating}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-xs font-semibold animate-pulse">Drafting tailored cover letter with Gemini AI...</p>
            </div>
          ) : (
            <>
              {/* Subject */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Email Subject Line</label>
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              {/* Letter Text */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">Cover Letter Body (Editable)</label>
                <textarea
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>

              {/* Emphasized Strengths */}
              {keyStrengths.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-bold text-emerald-400">Key Strengths Highlighted for this Role:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {keyStrengths.map((str, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {str}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">Ready to paste or download directly</span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.txt)</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Cover Letter'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

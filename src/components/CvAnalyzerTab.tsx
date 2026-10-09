import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Briefcase,
  Layers,
  RefreshCw,
  Award,
} from 'lucide-react';
import { CvAnalysisResult, SkillGapItem } from '../types';
import { SAMPLE_CVS } from '../data/mockData';

interface CvAnalyzerTabProps {
  analysis: CvAnalysisResult;
  onAnalysisUpdate: (newAnalysis: CvAnalysisResult) => void;
  onNavigateToJobs: () => void;
  onNavigateToCourses: (filterSkill?: string) => void;
  onNavigateToRoadmap: () => void;
}

export const CvAnalyzerTab: React.FC<CvAnalyzerTabProps> = ({
  analysis,
  onAnalysisUpdate,
  onNavigateToJobs,
  onNavigateToCourses,
  onNavigateToRoadmap,
}) => {
  const [selectedSampleId, setSelectedSampleId] = useState('cv-1');
  const [cvText, setCvText] = useState(SAMPLE_CVS[0].text);
  const [targetRole, setTargetRole] = useState('Software Engineer & AI Intern');
  const [major, setMajor] = useState('Computer Science');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectSample = (sampleId: string) => {
    setSelectedSampleId(sampleId);
    const found = SAMPLE_CVS.find((s) => s.id === sampleId);
    if (found) {
      setCvText(found.text);
      setTargetRole(found.targetRole);
      setMajor(found.major);
    }
  };

  const [isReadingFile, setIsReadingFile] = useState(false);
  const [fileSuccessNotice, setFileSuccessNotice] = useState('');

  const readAsBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = (reader.result as string) || '';
        resolve(dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl);
      };
      reader.onerror = () => reject(new Error('تعذر قراءة الملف من جهازك.'));
      reader.readAsDataURL(file);
    });

  const processFile = async (file: File) => {
    setIsReadingFile(true);
    setErrorMessage('');
    setFileSuccessNotice('');

    try {
      if (file.size > 15 * 1024 * 1024) {
        throw new Error('حجم الملف كبير (الحد الأقصى 15MB).');
      }

      // Every file type goes through the server extractor (PDF, DOCX, TXT, ...)
      const base64Data = await readAsBase64(file);
      const response = await fetch('/api/extract-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, fileName: file.name }),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(json.error || 'فشل استخراج النص من الملف.');
      }

      const text: string = json.text || '';
      setCvText(text);
      setSelectedSampleId('custom');
      setFileSuccessNotice(`تم قراءة الملف (${file.name}) بنجاح — جاري تحليل السيرة الذاتية...`);
      setIsReadingFile(false);
      // Auto-run the analysis on the uploaded CV
      await runAnalysis(text);
    } catch (err: any) {
      console.error('CV file error:', err);
      setErrorMessage(err?.message || 'تعذر قراءة الملف. يمكنك لصق النص مباشرة في الصندوق.');
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = ''; // reset so same file can be re-uploaded if needed
  };

  const runAnalysis = async (textToAnalyze: string) => {
    if (!textToAnalyze || textToAnalyze.trim().length < 20) {
      setErrorMessage('Please provide a valid CV or student profile text (at least 20 characters).');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);

    try {
      const res = await fetch('/api/gemini/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: textToAnalyze, targetRole, major }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed on server.');
      }

      onAnalysisUpdate(data as CvAnalysisResult);
      setFileSuccessNotice('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Could not complete the analysis. Please verify your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunAnalysis = () => runAnalysis(cvText);

  const getImportanceBadge = (importance: SkillGapItem['importance']) => {
    switch (importance) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3 h-3" /> Critical Gap
          </span>
        );
      case 'Important':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <TrendingUp className="w-3 h-3" /> High Priority
          </span>
        );
      case 'Bonus':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Award className="w-3 h-3" /> Competitive Advantage
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-emerald-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Feature 1: CV Analyzer & Gap Identification
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI-Powered CV Diagnostics & Skill Gap Identification
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Upload your student CV or paste your coursework profile. Our AI instantly reads your background, isolates
            strengths, and pinpoints exact skill gaps needed to secure local internships and field training.
          </p>
        </div>
      </div>

      {/* Input & Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CV Input & Sample Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-850 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Quick Load Sample Profiles
              </label>
              <span className="text-xs text-slate-400">Try 1-Click</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_CVS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.id)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedSampleId === sample.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold">{sample.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Target: {sample.targetRole}</div>
                </button>
              ))}
            </div>

            {/* Target Role & Major Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Your Academic Major</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Target Internship / Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. AI Junior Intern"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* File Upload or Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="text-xs font-semibold text-slate-300">CV / Profile Text</label>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clip = await navigator.clipboard.readText();
                        if (clip) {
                          setCvText(clip);
                          setSelectedSampleId('custom');
                        }
                      } catch (err) {}
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>📋 Paste Text</span>
                  </button>
                  <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
                    <Upload className="w-3 h-3" />
                    <span>Upload File</span>
                    <input type="file" accept=".pdf,.docx,.txt,.md,.rtf" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {cvText && (
                    <button
                      type="button"
                      onClick={() => {
                        setCvText('');
                        setSelectedSampleId('custom');
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-400 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
                className="relative"
              >
                <textarea
                  value={cvText}
                  onChange={(e) => {
                    setCvText(e.target.value);
                    setSelectedSampleId('custom');
                  }}
                  rows={10}
                  placeholder="Paste your CV text, or drag & drop a .pdf / .docx / .txt file here (انسخ نص السيرة الذاتية والصقه هنا، أو اسحب الملف)..."
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-y"
                />

                {isReadingFile && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 text-indigo-400 text-xs font-semibold">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>جاري قراءة الملف...</span>
                  </div>
                )}
              </div>
            </div>

            {fileSuccessNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fileSuccessNotice}</span>
              </div>
            )}

            {(cvText.startsWith('PK\x03\x04') || cvText.includes('word/document.xml')) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>تنبيه: نص مشفر لملف Word</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  النص الملصق أعلاه هو كود أرشيف Word خام (Zip/Binary). لاستخراج النص الأصلي لسيرتك الذاتية تلقائياً، اضغط على زر <strong>Upload File</strong> بالأعلى واختر الملف، أو افتح ملف الـ Word على جهازك وانسخ النص فقط (Ctrl+A ثم Ctrl+C).
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Profile with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Analyze CV & Detect Skill Gaps</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Analysis Report (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Candidate Profile Overview Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Candidate Profile</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{analysis.extractedProfile.candidateName}</h2>
                <p className="text-xs text-slate-300">{analysis.extractedProfile.detectedDegree}</p>
              </div>

              {/* Overall Readiness Meter */}
              <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-700"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray={`${analysis.overallScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-white">{analysis.overallScore}%</span>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Market Readiness</div>
                  <div className="text-xs font-bold text-emerald-400">
                    {analysis.overallScore >= 80 ? 'High Acceptance Potential' : 'Moderate Match'}
                  </div>
                </div>
              </div>
            </div>

            {analysis.notice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{analysis.notice}</span>
              </div>
            )}

            {/* AI Summary */}
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-slate-200">AI Assessment: </span>
              {analysis.marketReadinessSummary}
            </p>

            {/* Detected Skills */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Extracted Technical & Project Skills ({analysis.extractedProfile.detectedSkills.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.extractedProfile.detectedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700/80 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths List */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Identified Competitive Strengths</span>
              </div>
              <div className="space-y-1.5">
                {analysis.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Identified Skill Gaps Section */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Identified Skill Gaps to Bridge</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Skills local tech employers and internship coordinators seek for "{targetRole}"
                </p>
              </div>
              <button
                onClick={() => onNavigateToCourses()}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View All Courses</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {analysis.skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-850 bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{gap.skill}</span>
                    {getImportanceBadge(gap.importance)}
                  </div>
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Market Need: </span>
                    {gap.reason}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-700/40 text-xs">
                    <div className="text-emerald-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                      <span>{gap.suggestedAction}</span>
                    </div>
                    <button
                      onClick={() => onNavigateToCourses(gap.skill)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-[11px] font-semibold self-start sm:self-auto shrink-0 transition-colors"
                    >
                      Find Training Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Hub */}
          <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 rounded-2xl p-5 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white">Next Step: Match with Local Opportunities</h4>
              <p className="text-xs text-slate-300">
                Use your {analysis.extractedProfile.detectedSkills.length} extracted skills to find local internships & field training.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToRoadmap}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all"
              >
                Year 3 Roadmap
              </button>
              <button
                onClick={onNavigateToJobs}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Explore Matched Jobs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

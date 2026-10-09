import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  MapPin,
  Clock,
  Send,
  Mic,
  DollarSign,
  ChevronDown,
  Building,
  ArrowUpRight,
  RefreshCw,
  Plus,
  X,
} from 'lucide-react';
import { JobOpportunity, CvAnalysisResult } from '../types';

interface JobMatchingTabProps {
  jobs: JobOpportunity[];
  cvAnalysis: CvAnalysisResult;
  onOpenCoverLetter: (job: JobOpportunity) => void;
  onPracticeInterview: (role: string) => void;
  onApplyJob: (job: JobOpportunity) => void;
  onRecalculateMatches: (customSkills: string[]) => Promise<void>;
  isRecalculating: boolean;
}

export const JobMatchingTab: React.FC<JobMatchingTabProps> = ({
  jobs,
  cvAnalysis,
  onOpenCoverLetter,
  onPracticeInterview,
  onApplyJob,
  onRecalculateMatches,
  isRecalculating,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [activeJobDetails, setActiveJobDetails] = useState<JobOpportunity | null>(null);

  // Editable skills bar
  const [userSkills, setUserSkills] = useState<string[]>(cvAnalysis.extractedProfile.detectedSkills);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !userSkills.includes(newSkillInput.trim())) {
      const updated = [...userSkills, newSkillInput.trim()];
      setUserSkills(updated);
      setNewSkillInput('');
      onRecalculateMatches(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = userSkills.filter((s) => s !== skillToRemove);
    setUserSkills(updated);
    onRecalculateMatches(updated);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesWorkplace = selectedWorkplace === 'All' || job.workplace === selectedWorkplace;
    const matchesScore = (job.matchScore ?? 0) >= minMatchScore;

    return matchesSearch && matchesType && matchesWorkplace && matchesScore;
  });

  const getScoreBadgeColor = (score: number = 0) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/60 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Feature 2 & 7: Smart Job Matching Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Opportunity & Local Internship Matching
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Comparing your CV skills against local internships, accredited field trainings, and junior opportunities.
            Each listing includes a compatibility score and an AI fit explanation for why the company suits you.
          </p>
        </div>
      </div>

      {/* Student Active Skills & Recalculate Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span>Matching Against Your Skills ({userSkills.length}):</span>
              {isRecalculating && (
                <span className="text-[11px] text-indigo-400 flex items-center gap-1 font-normal animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Recalculating scores with AI...
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Add or remove skills to see your match score update dynamically in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="Add skill (e.g. Docker)..."
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleAddSkill}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {userSkills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/90 text-slate-200 border border-slate-700 font-medium group hover:border-slate-500 transition-colors"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-400"
                title="Remove skill"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role title, tech stack (e.g. React, Python), or company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Opportunity Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="Internship">Summer Internships</option>
            <option value="Field Training">Field Training (Accredited)</option>
            <option value="Junior Role">Junior Roles & Trainees</option>
            <option value="Mentorship Placement">Mentorship Placements</option>
          </select>

          {/* Workplace Mode */}
          <select
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Modes</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Min Score filter */}
          <select
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(Number(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value={0}>All Match Scores</option>
            <option value={80}>High Match (80%+)</option>
            <option value={90}>Top Match (90%+)</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>Showing {filteredJobs.length} active opportunities</span>
        <span>Sorted by Match Score</span>
      </div>

      {/* Job Opportunity Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const matchScore = job.matchScore ?? 80;
          return (
            <div
              key={job.id}
              className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl space-y-5 relative overflow-hidden group"
            >
              {job.isHot && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl shadow-md uppercase tracking-wider">
                  🔥 High Demand
                </div>
              )}

              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {job.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-300 text-xs">{job.company}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {job.type}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover:text-indigo-300 transition-colors">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl border shrink-0 ${getScoreBadgeColor(
                      matchScore
                    )}`}
                  >
                    <span className="text-xl font-extrabold">{matchScore}%</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider">Match</span>
                  </div>
                </div>

                {/* Badges: Location, Workplace, Compensation, Deadline */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{job.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">{job.stipend}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{job.deadline}</span>
                  </span>
                </div>

                {/* AI Fit Explanation */}
                {job.fitExplanation && (
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 space-y-1.5 text-xs">
                    <div className="text-indigo-400 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why this company fits your background:</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{job.fitExplanation}</p>
                  </div>
                )}

                {/* Matching vs Missing Skills Breakdown */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Skills You Have ({job.matchingSkills?.length || 0})
                    </span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <XCircle className="w-3 h-3" /> Growth Opportunities ({job.missingSkills?.length || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills?.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {job.missingSkills?.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* AI Cover Letter Button */}
                  <button
                    onClick={() => onOpenCoverLetter(job)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3 h-3 text-indigo-400" />
                    <span>AI Cover Letter</span>
                  </button>

                  {/* Practice Interview Button */}
                  <button
                    onClick={() => onPracticeInterview(job.title)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Mic className="w-3 h-3 text-amber-400" />
                    <span>Mock Interview</span>
                  </button>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => onApplyJob(job)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                >
                  <span>Apply Now</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

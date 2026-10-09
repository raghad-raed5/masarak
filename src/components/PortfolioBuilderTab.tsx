import React, { useState } from 'react';
import {
  FolderGit2,
  Sparkles,
  ExternalLink,
  Github,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Copy,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Code,
  Globe,
} from 'lucide-react';
import { PortfolioData, PortfolioProject } from '../types';

interface PortfolioBuilderTabProps {
  portfolio: PortfolioData;
  onUpdatePortfolio: (updated: PortfolioData) => void;
}

export const PortfolioBuilderTab: React.FC<PortfolioBuilderTabProps> = ({
  portfolio,
  onUpdatePortfolio,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New project modal / inputs
  const [showAddProject, setShowAddProject] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newGithub, setNewGithub] = useState('');
  const [newLive, setNewLive] = useState('');

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/gemini/portfolio-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: portfolio.fullName,
          roleFocus: portfolio.title,
          bio: portfolio.bio,
          projects: portfolio.projects,
        }),
      });

      if (!res.ok) throw new Error('Failed to enhance');
      const data = await res.json();

      const updatedProjects = portfolio.projects.map((p, index) => {
        const enhancedMatch = data.enhancedProjects?.[index];
        return {
          ...p,
          description: enhancedMatch?.impactSummary || p.description,
          impactMetrics:
            enhancedMatch?.architectureHighlights?.join(' • ') || p.impactMetrics || 'Engineered with clean architecture.',
        };
      });

      onUpdatePortfolio({
        ...portfolio,
        tagline: data.heroTagline || portfolio.tagline,
        bio: data.bioElevated || portfolio.bio,
        projects: updatedProjects,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const project: PortfolioProject = {
      id: `proj-${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Full-stack application engineered with modern frameworks.',
      technologies: newTech
        ? newTech.split(',').map((t) => t.trim())
        : ['React', 'JavaScript', 'Tailwind CSS'],
      githubUrl: newGithub || 'https://github.com',
      liveUrl: newLive || undefined,
      impactMetrics: 'Successfully implemented end-to-end features and tested locally.',
    };

    onUpdatePortfolio({
      ...portfolio,
      projects: [...portfolio.projects, project],
    });

    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    setNewLive('');
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    onUpdatePortfolio({
      ...portfolio,
      projects: portfolio.projects.filter((p) => p.id !== id),
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ascendyouth.platform/portfolio/${portfolio.fullName.toLowerCase().replace(/\s+/g, '-')}`);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Feature 5: AI-Powered Portfolio Builder
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruiter-Ready Student Portfolio Builder
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Showcase your university coursework, hackathon submissions, and personal projects with metrics recruiters love.
            Use Gemini AI to polish your summaries and export a live showcase card.
          </p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              !isPreviewMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isPreviewMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Recruiter Preview</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEnhanceWithAI}
            disabled={isEnhancing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all"
          >
            {isEnhancing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Polishing with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>AI Elevate Impact & Metrics</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copySuccess ? 'Link Copied!' : 'Share Portfolio'}</span>
          </button>
        </div>
      </div>

      {/* PREVIEW VIEW */}
      {isPreviewMode ? (
        <div className="max-w-4xl mx-auto bg-slate-950 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-10">
          {/* Header */}
          <div className="text-center space-y-3 pb-8 border-b border-slate-800">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400">
              <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-3xl font-extrabold text-white">
                {portfolio.fullName.charAt(0)}
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{portfolio.fullName}</h2>
            <p className="text-sm font-semibold text-indigo-400">{portfolio.title}</p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto italic">
              "{portfolio.tagline}"
            </p>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
              {portfolio.bio}
            </p>

            <div className="flex items-center justify-center gap-3 pt-3">
              <a
                href={portfolio.github}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{portfolio.email}</span>
            </div>
          </div>

          {/* Tech stack */}
          <div className="space-y-3 text-center">
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
              Core Technical Competencies
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {portfolio.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs bg-slate-900 text-slate-200 border border-slate-800 font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects Showcase */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <span>Featured Engineering Projects ({portfolio.projects.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-base text-white">{proj.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    {proj.impactMetrics && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px] leading-relaxed">
                        <span className="font-semibold">Impact: </span>
                        {proj.impactMetrics}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800 text-xs">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold ml-auto"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* EDITOR VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Profile Info (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              <span>Personal & Bio Settings</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={portfolio.fullName}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Professional Title</label>
                <input
                  type="text"
                  value={portfolio.title}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={portfolio.tagline}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Bio</label>
                <textarea
                  value={portfolio.bio}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={portfolio.github}
                  onChange={(e) => onUpdatePortfolio({ ...portfolio, github: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Right: Projects Manager (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  <span>Projects Showcase ({portfolio.projects.length})</span>
                </h3>
                <p className="text-xs text-slate-400">Add university coursework, hackathons, or independent software builds</p>
              </div>

              <button
                onClick={() => setShowAddProject(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {portfolio.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2.5 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                  {proj.impactMetrics && (
                    <div className="text-[11px] text-emerald-400 font-medium">
                      🎯 {proj.impactMetrics}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD PROJECT MODAL */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <span>Add New Project</span>
            </h3>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Smart Queue Manager"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="What problem does it solve and what did you build?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={newGithub}
                    onChange={(e) => setNewGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Live URL (optional)</label>
                  <input
                    type="text"
                    value={newLive}
                    onChange={(e) => setNewLive(e.target.value)}
                    placeholder="https://app.demo"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Users,
  FolderGit2,
  Mic,
  Compass,
  Bell,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { TabType, JobAlert } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  alerts: JobAlert[];
  onOpenAlerts: () => void;
  marketReadinessScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  onOpenAlerts,
  marketReadinessScore,
}) => {
  const unreadCount = alerts.filter((a) => !a.read).length;

  const navItems: Array<{ id: TabType; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'cv-analyzer', label: 'CV Analyzer & Gaps', icon: <FileText className="w-4 h-4" /> },
    { id: 'job-matching', label: 'Smart Job Matching', icon: <Briefcase className="w-4 h-4" />, badge: 'Matches' },
    { id: 'skill-gaps', label: 'Skill Gap Courses', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'networking-forum', label: 'Forum & Mentors', icon: <Users className="w-4 h-4" /> },
    { id: 'portfolio-builder', label: 'Portfolio Builder', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'interview-coach', label: 'Interview Coach', icon: <Mic className="w-4 h-4" /> },
    { id: 'career-roadmap', label: 'Career Roadmap (CS/IT)', icon: <Compass className="w-4 h-4" />, badge: 'Year 3' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Masarak</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Graduate Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Youth Employment & Internship Platform</p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Market Readiness Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <span className="text-slate-400">Readiness Score: </span>
                <span className="font-bold text-emerald-300">{marketReadinessScore}%</span>
              </div>
              <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden ml-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${marketReadinessScore}%` }}
                />
              </div>
            </div>

            {/* Instant Job Alerts Bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-all flex items-center gap-2 text-xs font-medium"
              title="Job & Opportunity Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  BookOpen,
  Clock,
  Star,
  ExternalLink,
  Filter,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { TrainingCourse, SkillGapItem } from '../types';

interface SkillGapCoursesTabProps {
  courses: TrainingCourse[];
  skillGaps: SkillGapItem[];
  onToggleCourseCompleted: (courseId: string) => void;
  selectedSkillFilter?: string;
  onClearSkillFilter: () => void;
}

export const SkillGapCoursesTab: React.FC<SkillGapCoursesTabProps> = ({
  courses,
  skillGaps,
  onToggleCourseCompleted,
  selectedSkillFilter,
  onClearSkillFilter,
}) => {
  const [activeLevel, setActiveLevel] = useState<string>('All');

  const filteredCourses = courses.filter((c) => {
    const matchesSkill = selectedSkillFilter
      ? c.skillsAddressed.some(
          (s) =>
            s.toLowerCase().includes(selectedSkillFilter.toLowerCase()) ||
            selectedSkillFilter.toLowerCase().includes(s.toLowerCase())
        )
      : true;

    const matchesLevel = activeLevel === 'All' || c.level === activeLevel;
    return matchesSkill && matchesLevel;
  });

  const completedCount = courses.filter((c) => c.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-purple-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Feature 3: Skill Gap Analysis & Targeted Training
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Targeted Training Courses & Gap Bridging
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Every course below directly bridges an identified gap from your CV analysis. Completing these courses
            increases your market readiness score and boosts your acceptance rate with local employers.
          </p>
        </div>
      </div>

      {/* Gaps Quick-Bar */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Identified CV Skill Gaps from Diagnostics:</span>
          </div>
          {selectedSkillFilter && (
            <button
              onClick={onClearSkillFilter}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold self-start sm:self-auto"
            >
              Show All Courses (Clear Filter)
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {skillGaps.map((gap, i) => {
            const isSelected = selectedSkillFilter === gap.skill;
            return (
              <button
                key={i}
                onClick={() => (isSelected ? onClearSkillFilter() : null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span>{gap.skill}</span>
                <span className="text-[10px] opacity-75">({gap.importance})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400">
            Completed: <span className="font-bold text-emerald-400">{completedCount}</span> / {courses.length} courses
          </div>
          <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(completedCount / courses.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1.5">
          {['All', 'Beginner', 'Intermediate'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setActiveLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeLevel === lvl
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-xl space-y-4 ${
              course.completed
                ? 'bg-slate-900/60 border-emerald-500/40 opacity-90'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                  {course.provider}
                </span>
                {course.isFree && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Free Tier Available
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{course.title}</h3>

              {/* Course Meta: Hours, Rating, Level */}
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{course.durationHours} hrs</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{course.rating}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300">{course.level}</span>
              </div>

              {/* Skills Addressed */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-semibold text-slate-400">Skills you will gain:</div>
                <div className="flex flex-wrap gap-1">
                  {course.skillsAddressed.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => onToggleCourseCompleted(course.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  course.completed
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${course.completed ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{course.completed ? 'Completed ✓' : 'Mark Done'}</span>
              </button>

              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <span>Start Course</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

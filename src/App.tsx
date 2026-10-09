import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  TabType,
  CvAnalysisResult,
  JobOpportunity,
  TrainingCourse,
  Mentor,
  ForumPost,
  PortfolioData,
  ScheduledInterview,
  JobAlert,
} from './types';
import {
  INITIAL_CV_ANALYSIS,
  INITIAL_JOBS,
  INITIAL_COURSES,
  INITIAL_MENTORS,
  INITIAL_FORUM_POSTS,
  INITIAL_PORTFOLIO,
  INITIAL_SCHEDULED_INTERVIEWS,
  INITIAL_JOB_ALERTS,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { CvAnalyzerTab } from './components/CvAnalyzerTab';
import { JobMatchingTab } from './components/JobMatchingTab';
import { SkillGapCoursesTab } from './components/SkillGapCoursesTab';
import { IndustryForumTab } from './components/IndustryForumTab';
import { PortfolioBuilderTab } from './components/PortfolioBuilderTab';
import { InterviewCoachTab } from './components/InterviewCoachTab';
import { CareerRoadmapTab } from './components/CareerRoadmapTab';
import { CoverLetterModal } from './components/CoverLetterModal';
import { JobAlertsDrawer } from './components/JobAlertsDrawer';
import { CheckCircle2, Sparkles, X, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cv-analyzer');
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysisResult>(INITIAL_CV_ANALYSIS);
  const [jobs, setJobs] = useState<JobOpportunity[]>(INITIAL_JOBS);
  const [courses, setCourses] = useState<TrainingCourse[]>(INITIAL_COURSES);
  const [mentors, setMentors] = useState<Mentor[]>(INITIAL_MENTORS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [portfolio, setPortfolio] = useState<PortfolioData>(INITIAL_PORTFOLIO);
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>(
    INITIAL_SCHEDULED_INTERVIEWS
  );
  const [alerts, setAlerts] = useState<JobAlert[]>(INITIAL_JOB_ALERTS);

  // Modals & Navigation Helpers
  const [selectedCoverLetterJob, setSelectedCoverLetterJob] = useState<JobOpportunity | null>(null);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | undefined>(undefined);
  const [targetInterviewRole, setTargetInterviewRole] = useState<string>('AI & Machine Learning Intern');

  // Application feedback modal
  const [appliedJobSuccess, setAppliedJobSuccess] = useState<JobOpportunity | null>(null);

  // Toast banner for live alerts
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Recalculating state
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Computed Readiness Score: base + bonus for completed courses
  const completedCoursesCount = courses.filter((c) => c.completed).length;
  const marketReadinessScore = Math.min(
    98,
    cvAnalysis.overallScore + completedCoursesCount * 4
  );

  const triggerToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(null), 4500);
  };

  const handleCvAnalysisUpdate = (newAnalysis: CvAnalysisResult) => {
    setCvAnalysis(newAnalysis);
    // Also sync candidate name and skills to portfolio
    setPortfolio((prev) => ({
      ...prev,
      fullName: newAnalysis.extractedProfile.candidateName || prev.fullName,
      skills: Array.from(new Set([...prev.skills, ...newAnalysis.extractedProfile.detectedSkills])),
    }));
    triggerToast('CV analysis updated! Skills and market readiness synced across your platform.');
  };

  const handleToggleCourseCompleted = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const next = !c.completed;
          if (next) {
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
            } catch (e) {}
            triggerToast(`Course milestone achieved! Market readiness increased.`);
          }
          return { ...c, completed: next };
        }
        return c;
      })
    );
  };

  const handleRecalculateMatches = async (customSkills: string[]) => {
    setIsRecalculating(true);
    try {
      // Recalculate match score for top jobs
      const updated = await Promise.all(
        jobs.map(async (job) => {
          try {
            const res = await fetch('/api/gemini/match-job', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                cvSkills: customSkills,
                cvProfileSummary: cvAnalysis.extractedProfile.summary,
                jobTitle: job.title,
                company: job.company,
                requirements: job.requirements,
                description: job.description,
              }),
            });
            if (res.ok) {
              const data = await res.json();
              return {
                ...job,
                matchScore: data.matchScore ?? job.matchScore,
                matchingSkills: data.matchingSkills ?? job.matchingSkills,
                missingSkills: data.missingSkills ?? job.missingSkills,
                fitExplanation: data.fitExplanation ?? job.fitExplanation,
                likelihoodRating: data.likelihoodRating ?? job.likelihoodRating,
              };
            }
          } catch (e) {
            console.error(e);
          }
          return job;
        })
      );
      setJobs(updated);
      triggerToast('Smart job compatibility scores updated with your modified skills!');
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleAddForumPost = (
    newPost: Omit<ForumPost, 'id' | 'timestamp' | 'upvotes' | 'commentsCount' | 'comments'>
  ) => {
    const created: ForumPost = {
      ...newPost,
      id: `post-${Date.now()}`,
      timestamp: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      comments: [],
    };
    setForumPosts([created, ...forumPosts]);
    triggerToast('Your discussion topic was published to the peer forum!');
  };

  const handleUpvotePost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasUp = p.hasUpvoted;
          return {
            ...p,
            upvotes: hasUp ? p.upvotes - 1 : p.upvotes + 1,
            hasUpvoted: !hasUp,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: cvAnalysis.extractedProfile.candidateName || 'Amira Tariq',
            avatar: '👩‍💻',
            text: commentText,
            timestamp: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleBookMentorSession = (mentor: Mentor, date: string, time: string, topic: string) => {
    const scheduled: ScheduledInterview = {
      id: `int-${Date.now()}`,
      role: `${topic} with ${mentor.name}`,
      company: mentor.company,
      date,
      time,
      type: 'Mentor Prep',
      status: 'Upcoming',
    };
    setScheduledInterviews([scheduled, ...scheduledInterviews]);
    triggerToast(`Mentorship session confirmed with ${mentor.name} on ${date}!`);
  };

  const handleSimulateNewAlert = () => {
    const newAlertsData: JobAlert[] = [
      {
        id: `al-${Date.now()}`,
        jobTitle: 'Generative AI & LLM Systems Trainee',
        company: 'LeapTech Regional Innovations',
        location: 'Innovation Tech Hub (Hybrid)',
        matchScore: 94,
        timestamp: 'Just now',
        read: false,
        type: 'Internship',
      },
      {
        id: `al-${Date.now() + 1}`,
        jobTitle: 'Full-Stack React & Node.js Apprentice',
        company: 'FinPulse MENA',
        location: 'Amman & Remote',
        matchScore: 91,
        timestamp: 'Just now',
        read: false,
        type: 'Field Training',
      },
    ];

    const randomPick = newAlertsData[Math.floor(Math.random() * newAlertsData.length)];
    setAlerts([randomPick, ...alerts]);

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.2 } });
    } catch (e) {}

    triggerToast(`⚡ New Instant Job Alert: ${randomPick.jobTitle} at ${randomPick.company} (${randomPick.matchScore}% Match)!`);
  };

  const handleApplyJob = (job: JobOpportunity) => {
    setAppliedJobSuccess(job);
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md bg-indigo-900/95 text-white p-4 rounded-2xl border border-indigo-500 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastNotification}</span>
          </div>
          <button
            onClick={() => setToastNotification(null)}
            className="text-indigo-300 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        marketReadinessScore={marketReadinessScore}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'cv-analyzer' && (
          <CvAnalyzerTab
            analysis={cvAnalysis}
            onAnalysisUpdate={handleCvAnalysisUpdate}
            onNavigateToJobs={() => setActiveTab('job-matching')}
            onNavigateToCourses={(skill) => {
              setSelectedSkillFilter(skill);
              setActiveTab('skill-gaps');
            }}
            onNavigateToRoadmap={() => setActiveTab('career-roadmap')}
          />
        )}

        {activeTab === 'job-matching' && (
          <JobMatchingTab
            jobs={jobs}
            cvAnalysis={cvAnalysis}
            onOpenCoverLetter={(job) => setSelectedCoverLetterJob(job)}
            onPracticeInterview={(role) => {
              setTargetInterviewRole(role);
              setActiveTab('interview-coach');
            }}
            onApplyJob={handleApplyJob}
            onRecalculateMatches={handleRecalculateMatches}
            isRecalculating={isRecalculating}
          />
        )}

        {activeTab === 'skill-gaps' && (
          <SkillGapCoursesTab
            courses={courses}
            skillGaps={cvAnalysis.skillGaps}
            onToggleCourseCompleted={handleToggleCourseCompleted}
            selectedSkillFilter={selectedSkillFilter}
            onClearSkillFilter={() => setSelectedSkillFilter(undefined)}
          />
        )}

        {activeTab === 'networking-forum' && (
          <IndustryForumTab
            posts={forumPosts}
            mentors={mentors}
            onAddPost={handleAddForumPost}
            onUpvotePost={handleUpvotePost}
            onAddComment={handleAddComment}
            onBookMentorSession={handleBookMentorSession}
          />
        )}

        {activeTab === 'portfolio-builder' && (
          <PortfolioBuilderTab
            portfolio={portfolio}
            onUpdatePortfolio={(updated) => setPortfolio(updated)}
          />
        )}

        {activeTab === 'interview-coach' && (
          <InterviewCoachTab
            scheduledInterviews={scheduledInterviews}
            onScheduleInterview={(newInterview) => {
              setScheduledInterviews([newInterview, ...scheduledInterviews]);
              triggerToast(`Interview added to schedule for ${newInterview.role}!`);
            }}
            initialRole={targetInterviewRole}
          />
        )}

        {activeTab === 'career-roadmap' && <CareerRoadmapTab />}
      </main>

      {/* Cover Letter Modal */}
      {selectedCoverLetterJob && (
        <CoverLetterModal
          job={selectedCoverLetterJob}
          cvAnalysis={cvAnalysis}
          onClose={() => setSelectedCoverLetterJob(null)}
        />
      )}

      {/* Instant Job Alerts Drawer */}
      <JobAlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onMarkAllAsRead={() => {
          setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
          triggerToast('All job alerts marked as read.');
        }}
        onSimulateNewAlert={handleSimulateNewAlert}
        onSelectAlert={(alert) => {
          setAlerts((prev) =>
            prev.map((a) => (a.id === alert.id ? { ...a, read: true } : a))
          );
          setIsAlertsOpen(false);
          setActiveTab('job-matching');
        }}
      />

      {/* Applied Job Success Modal */}
      {appliedJobSuccess && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your profile, CV analysis highlights, and verified project portfolio have been dispatched to{' '}
              <span className="font-semibold text-white">{appliedJobSuccess.company}</span> for the{' '}
              <span className="font-semibold text-indigo-300">{appliedJobSuccess.title}</span> role.
            </p>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 text-left">
              <div className="font-semibold text-slate-200">Next Action Checklist:</div>
              <div>• Check "Interview Coach" tab to practice role-specific questions.</div>
              <div>• Connect with mentors on Masarak for an insider referral.</div>
            </div>

            <button
              onClick={() => setAppliedJobSuccess(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
            >
              Done & Return to Opportunities
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Masarak</span>
            <span>—</span>
            <span>Connecting Graduates with Local Internships & Mentorships</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Powered by Google Gemini 3.8 Flash • CV Diagnostics, Smart Matching & Real-time STAR Interview Coaching
          </div>
        </div>
      </footer>
    </div>
  );
}
  

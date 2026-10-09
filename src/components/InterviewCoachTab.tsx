import React, { useState } from 'react';
import {
  Mic,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Plus,
  HelpCircle,
  FileCheck,
  UserCheck,
} from 'lucide-react';
import { MockInterviewResult, ScheduledInterview } from '../types';
import { INTERVIEW_QUESTIONS } from '../data/mockData';

interface InterviewCoachTabProps {
  scheduledInterviews: ScheduledInterview[];
  onScheduleInterview: (newInterview: ScheduledInterview) => void;
  initialRole?: string;
}

export const InterviewCoachTab: React.FC<InterviewCoachTabProps> = ({
  scheduledInterviews,
  onScheduleInterview,
  initialRole,
}) => {
  const [selectedRole, setSelectedRole] = useState(initialRole || 'AI & Machine Learning Intern');
  const [selectedQuestionId, setSelectedQuestionId] = useState(INTERVIEW_QUESTIONS[0].id);
  const [customQuestion, setCustomQuestion] = useState(INTERVIEW_QUESTIONS[0].question);
  const [candidateAnswer, setCandidateAnswer] = useState(
    'In our university semester MediAssist project, we initially experienced low classification precision on patient triage categories because the dataset was heavily imbalanced toward common colds. As the project backend lead, my responsibility was to diagnose the issue and fix the ML model output. I performed stratified resample on the training vectors and adjusted class weighting in Scikit-Learn, and then benchmarked with 5-fold cross validation. Consequently, precision increased from 61% to 88%, and our final demonstration at the university demo day was rated top 3 in our class.'
  );

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState<MockInterviewResult | null>(null);

  // Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newRole, setNewRole] = useState('Junior Software Engineering Trainee');
  const [newCompany, setNewCompany] = useState('NeuralSphere Labs');
  const [newDate, setNewDate] = useState('Oct 21, 2026');
  const [newTime, setNewTime] = useState('11:00 AM');
  const [newType, setNewType] = useState<ScheduledInterview['type']>('AI Mock Session');

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Review company mission & recent product launches', checked: true },
    { id: 'c2', label: 'Prepare 2 STAR stories demonstrating debugging and persistence', checked: true },
    { id: 'c3', label: 'Test camera, microphone, and internet connection 15 mins prior', checked: false },
    { id: 'c4', label: 'Prepare 3 thoughtful reverse-questions for the interviewer', checked: false },
    { id: 'c5', label: 'Have GitHub portfolio and live demo URL open in clean tabs', checked: true },
  ]);

  const handleSelectQuestion = (qId: string) => {
    setSelectedQuestionId(qId);
    const q = INTERVIEW_QUESTIONS.find((item) => item.id === qId);
    if (q) {
      setCustomQuestion(q.question);
      setSelectedRole(q.role);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!candidateAnswer.trim() || candidateAnswer.trim().length < 15) return;

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/gemini/interview-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: selectedRole,
          question: customQuestion,
          answer: candidateAnswer,
          questionType: 'behavioral',
        }),
      });

      if (!res.ok) throw new Error('Evaluation request failed');
      const data: MockInterviewResult = await res.json();
      setFeedbackResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleInterview({
      id: `int-${Date.now()}`,
      role: newRole,
      company: newCompany,
      date: newDate,
      time: newTime,
      type: newType,
      status: 'Upcoming',
    });
    setShowScheduleModal(false);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-indigo-950/60 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Feature 6: Real-time Interview Performance & Scheduling
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Interview Coach & Scheduling Assistant
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Practice realistic behavioral and technical interview questions. Receive instant scoring on the STAR method
            (Situation, Task, Action, Result) with benchmark model answers, and organize your upcoming interviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Practice Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Simulated Mock Interview</span>
              </h2>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                STAR Method Analysis
              </span>
            </div>

            {/* Role & Question Selector */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Target Interview Role</label>
                <input
                  type="text"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  placeholder="e.g. AI & Machine Learning Intern"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Select from Question Bank</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {INTERVIEW_QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleSelectQuestion(q.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                        selectedQuestionId === q.id
                          ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                          : 'bg-slate-850 bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span className="font-semibold block">{q.question}</span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        Type: {q.type} • {q.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Your Spoken / Written Response</label>
                  <button
                    onClick={() => {
                      const q = INTERVIEW_QUESTIONS.find((item) => item.id === selectedQuestionId);
                      if (q) setCandidateAnswer(q.sampleStarter);
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Insert Starter
                  </button>
                </div>
                <textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  rows={6}
                  placeholder="Type or dictate your answer using the STAR format (Situation, Task, Action, Result)..."
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans"
                />
              </div>

              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Performance with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>Evaluate Performance & Get STAR Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-time Feedback Results */}
          {feedbackResult && (
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-6 shadow-xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Live Performance Evaluation
                  </span>
                  <h3 className="text-lg font-bold text-white">Interview Assessment Summary</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Overall Score</div>
                    <div className="text-xl font-extrabold text-emerald-400">{feedbackResult.overallScore}/100</div>
                  </div>
                </div>
              </div>

              {/* Sub-scores: Clarity & Technical */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">Communication Clarity:</span>
                  <div className="text-base font-bold text-indigo-300">{feedbackResult.clarityScore}%</div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">Technical Depth:</span>
                  <div className="text-base font-bold text-emerald-300">{feedbackResult.technicalAccuracyScore}%</div>
                </div>
              </div>

              {/* STAR Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-200">STAR Method Breakdown:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-850 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="font-bold text-indigo-400">S — Situation</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{feedbackResult.starBreakdown.situation}</p>
                  </div>
                  <div className="bg-slate-850 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="font-bold text-purple-400">T — Task</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{feedbackResult.starBreakdown.task}</p>
                  </div>
                  <div className="bg-slate-850 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="font-bold text-emerald-400">A — Action</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{feedbackResult.starBreakdown.action}</p>
                  </div>
                  <div className="bg-slate-850 bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="font-bold text-amber-400">R — Result</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{feedbackResult.starBreakdown.result}</p>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Highlights
                  </span>
                  <div className="space-y-1.5">
                    {feedbackResult.positiveHighlights.map((h, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-slate-300">
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Areas to Refine
                  </span>
                  <div className="space-y-1.5">
                    {feedbackResult.areasToImprove.map((a, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-slate-300">
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Improved Benchmark Model Answer */}
              <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2 text-xs">
                <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>How a Top-10% Candidate Answers This (Benchmark):</span>
                </div>
                <p className="text-slate-200 leading-relaxed italic">{feedbackResult.improvedSampleAnswer}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Scheduling Assistant & Readiness Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Scheduling Assistant */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Interview Schedule ({scheduledInterviews.length})</span>
                </h3>
                <p className="text-xs text-slate-400">Track upcoming mock drills and company calls</p>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>
            </div>

            <div className="space-y-3">
              {scheduledInterviews.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-white">{item.role}</h4>
                      <p className="text-indigo-300 text-[11px] font-semibold">{item.company}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{item.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{item.time}</span>
                    </span>
                    <span className="ml-auto font-semibold text-emerald-400">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pre-Interview Readiness Checklist */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Pre-Interview Readiness Checklist</span>
            </h3>

            <div className="space-y-2 text-xs">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                  />
                  <span className={`${item.checked ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Schedule New Interview or Mock Session</span>
            </h3>

            <form onSubmit={handleAddSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Role Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Oct 24, 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 2:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Session Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="AI Mock Session">AI Mock Session</option>
                  <option value="Official Company Interview">Official Company Interview</option>
                  <option value="Mentor Prep">Mentor Prep Session</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/20"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

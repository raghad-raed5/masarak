import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowRight,
  TrendingUp,
  Cpu,
  Database,
  Globe,
  Shield,
  Cloud,
  RefreshCw,
  Award,
  Target,
} from 'lucide-react';
import { CareerSpecializationRoadmap } from '../types';

export const CareerRoadmapTab: React.FC = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('AI & Machine Learning Engineer');
  const [currentYear, setCurrentYear] = useState('Year 3 (Junior Semester 1)');
  const [isLoading, setIsLoading] = useState(false);

  const specializations = [
    {
      id: 'AI & Machine Learning Engineer',
      label: 'AI & Machine Learning Engineer',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
      desc: 'Neural networks, PyTorch, computer vision, Gemini API & LLM integration',
      tag: 'Highest Regional Demand',
    },
    {
      id: 'Data Analyst & BI Specialist',
      label: 'Data Analyst & BI Specialist',
      icon: <Database className="w-4 h-4 text-indigo-400" />,
      desc: 'SQL mastery, Python analytics, Power BI dashboards & business KPIs',
      tag: 'Fast Placement',
    },
    {
      id: 'Full-Stack Web & Cloud Developer',
      label: 'Full-Stack Web & Cloud Developer',
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      desc: 'React, TypeScript, Node.js, RESTful microservices, and PostgreSQL',
      tag: 'Most Versatile',
    },
    {
      id: 'Cloud & DevOps Engineer',
      label: 'Cloud & DevOps Engineer',
      icon: <Cloud className="w-4 h-4 text-cyan-400" />,
      desc: 'Docker containers, Kubernetes, GitHub Actions CI/CD & cloud architecture',
      tag: 'High Starting Stipend',
    },
    {
      id: 'Cybersecurity Analyst',
      label: 'Cybersecurity Analyst',
      icon: <Shield className="w-4 h-4 text-rose-400" />,
      desc: 'Vulnerability assessment, network defense, Linux security & OWASP audit',
      tag: 'Strategic Sector',
    },
  ];

  const [roadmap, setRoadmap] = useState<CareerSpecializationRoadmap>({
    specialization: 'AI & Machine Learning Engineer',
    industryOutlook:
      'High growth across regional fintech, digital health, and government smart transformation hubs actively recruiting junior AI interns with foundational software hygiene.',
    phases: [
      {
        phaseName: 'Phase 1: Year 3 Fall (Immediate Next 3 Months)',
        goal: 'Solidify advanced algorithms, data wrangling, and clean Python design patterns.',
        milestones: [
          'Master advanced array/graph algorithms and vector operations with NumPy/Pandas',
          'Build and deploy a supervised ML regression/classification prototype with 80%+ accuracy',
          'Learn Git flow, branch protection, and publish clean documentation on GitHub',
        ],
        recommendedCourses: [
          {
            title: 'Machine Learning Specialization by Andrew Ng',
            platform: 'DeepLearning.AI & Stanford Online',
            skillsLearned: 'Supervised Learning, Loss Functions, Gradient Descent',
          },
        ],
        portfolioProject: {
          title: 'Intelligent Health Consultation / Triage API',
          description:
            'A lightweight diagnostic service classifying symptom clusters with benchmark validation and REST endpoints.',
        },
      },
      {
        phaseName: 'Phase 2: Year 3 Spring (Months 4-6) — Local Field Training Prep',
        goal: 'Bridge into generative AI, API integration, and prepare targeted CV for local summer internships.',
        milestones: [
          'Build an AI assistant connecting to Gemini SDK / LangChain for document retrieval (RAG)',
          'Complete Docker containerization sprint to run AI inference in isolated microservices',
          'Attend local tech meetups and connect with 3 mentors on Masarak',
          'Submit 10 targeted local internship applications with tailored cover letters',
        ],
        recommendedCourses: [
          {
            title: 'Building Production GenAI Applications with Gemini API',
            platform: 'Google Cloud Skills Boost / DeepLearning.AI',
            skillsLearned: 'Prompt Engineering, Embeddings, Function Calling, API Security',
          },
        ],
        portfolioProject: {
          title: 'Domain-Specific Arabic/English RAG Document Assistant',
          description:
            'Full-stack knowledge assistant answering student academic queries using vector search and generative LLM.',
        },
      },
      {
        phaseName: 'Phase 3: Senior Year (Final Transition & Graduate Placement)',
        goal: 'Execute university graduation capstone project and secure full-time junior offer.',
        milestones: [
          'Complete 3-month summer field training with positive mentor evaluation',
          'Engineer multi-modal graduation capstone with live cloud deployment and latency monitoring',
          'Conduct 5 behavioral STAR mock interview sessions before final campus job fair',
        ],
        recommendedCourses: [
          {
            title: 'Full Stack Deep Learning & MLOps in Production',
            platform: 'FullStackDeepLearning.com / Coursera',
            skillsLearned: 'Model monitoring, CI/CD pipelines, container orchestration',
          },
        ],
        portfolioProject: {
          title: 'Deployed Multi-tenant SaaS with Real-Time AI Inference',
          description:
            'Production-grade cloud-hosted web app with automated testing, user auth, and real-time inference telemetry.',
        },
      },
    ],
    topRequiredSkills: [
      'Python & Vector Math',
      'Modern LLM Integration (Gemini SDK)',
      'Docker Containerization',
      'REST & FastAPI Architecture',
      'Git Version Control & CI',
    ],
    internshipReadinessChecklist: [
      'Have at least 2 distinct GitHub repositories with detailed READMEs and architecture diagrams',
      'Understand how to write unit tests for your data pipeline using PyTest',
      'Prepare 3 STAR-formatted behavioral stories detailing how you tackled bugs',
      'Review target local companies and network with university alumni currently working there',
    ],
  });

  const handleGenerateRoadmap = async (specName: string) => {
    setSelectedSpecialization(specName);
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialization: specName,
          currentYear,
          currentSkills: ['Python', 'JavaScript', 'React', 'SQL', 'Git'],
        }),
      });

      if (!res.ok) throw new Error('Roadmap generation failed');
      const data: CareerSpecializationRoadmap = await res.json();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-emerald-950/40 p-6 sm:p-8 border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Feature 10: Career Roadmap for Junior Students
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            CS & IT Specialization Navigator for 3rd-Year Students
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Designed specifically for Computer Science and IT students preparing to select their technical path.
            Explore emerging specializations, compare required skill sets, and follow an actionable milestone roadmap
            from junior coursework to local internship placement.
          </p>
        </div>
      </div>

      {/* Specialization Selection Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          <span>Select Your Target Specialization:</span>
          {isLoading && (
            <span className="text-indigo-400 text-[11px] font-normal flex items-center gap-1 animate-pulse ml-2">
              <RefreshCw className="w-3 h-3 animate-spin" /> Customizing plan with Gemini AI...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {specializations.map((spec) => {
            const isSelected = selectedSpecialization === spec.id;
            return (
              <button
                key={spec.id}
                onClick={() => handleGenerateRoadmap(spec.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center">
                      {spec.icon}
                    </div>
                    <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {spec.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white leading-tight">{spec.label}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">{spec.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roadmap Content Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-8">
        {/* Header Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Interactive Career Blueprint
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Path to becoming a {roadmap.specialization}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              {roadmap.industryOutlook}
            </p>
          </div>

          {/* Top Skills Required */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 shrink-0">
            <span className="text-[11px] font-bold text-slate-300 block">Top 5 Core Competencies:</span>
            <div className="flex flex-wrap gap-1.5 max-w-sm">
              {roadmap.topRequiredSkills.map((sk, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Step Timeline */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Structured Semester-by-Semester Milestones</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {roadmap.phases.map((phase, idx) => (
              <div
                key={idx}
                className="bg-slate-850 bg-slate-800/40 rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-white">{phase.phaseName}</h4>
                  </div>

                  <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="font-semibold text-indigo-300">Goal: </span>
                    {phase.goal}
                  </p>

                  {/* Milestones list */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="font-semibold text-slate-400 text-[11px]">Key Deliverables:</div>
                    {phase.milestones.map((m, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px]">{m}</span>
                      </div>
                    ))}
                  </div>

                  {/* Capstone Project */}
                  {phase.portfolioProject && (
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs space-y-1">
                      <div className="font-bold text-purple-300 text-[11px]">Recommended Project:</div>
                      <div className="font-semibold text-white">{phase.portfolioProject.title}</div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {phase.portfolioProject.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Course recommendation */}
                {phase.recommendedCourses?.[0] && (
                  <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-400 space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Suggested Course:</span>
                    <div className="font-medium text-slate-200">{phase.recommendedCourses[0].title}</div>
                    <div className="text-[11px] text-indigo-400">{phase.recommendedCourses[0].platform}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Field Training Readiness Checklist */}
        <div className="bg-slate-950/60 rounded-2xl p-6 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Field Training & Summer Internship Readiness Gate</span>
          </h4>
          <p className="text-xs text-slate-300">
            Before applying to local tech companies, verify you satisfy these core baseline checkpoints:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
            {roadmap.internshipReadinessChecklist.map((check, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

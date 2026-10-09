export type TabType =
  | 'cv-analyzer'
  | 'job-matching'
  | 'skill-gaps'
  | 'networking-forum'
  | 'portfolio-builder'
  | 'interview-coach'
  | 'career-roadmap';

export interface ExtractedProfile {
  candidateName: string;
  detectedDegree: string;
  detectedSkills: string[];
  experienceYears: string;
  summary: string;
}

export interface SkillGapItem {
  skill: string;
  importance: 'Critical' | 'Important' | 'Bonus';
  reason: string;
  suggestedAction: string;
}

export interface CvAnalysisResult {
  extractedProfile: ExtractedProfile;
  strengths: string[];
  skillGaps: SkillGapItem[];
  overallScore: number;
  marketReadinessSummary: string;
  recommendedNextSteps: string[];
  source?: 'gemini' | 'local';
  notice?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Internship' | 'Field Training' | 'Junior Role' | 'Mentorship Placement';
  workplace: 'On-site' | 'Hybrid' | 'Remote';
  stipend: string;
  deadline: string;
  requirements: string[];
  description: string;
  department: string;
  isHot?: boolean;
  matchScore?: number;
  likelihoodRating?: 'High' | 'Medium' | 'Competitive';
  matchingSkills?: string[];
  missingSkills?: string[];
  fitExplanation?: string;
  interviewTips?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  skillsAddressed: string[];
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  isFree: boolean;
  url: string;
  completed?: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  specialties: string[];
  experience: string;
  rating: number;
  sessionsCompleted: number;
  availableDays: string[];
  bio: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  title: string;
  content: string;
  category: 'Internship Tips' | 'AI & Tech' | 'Career Advice' | 'CV Review' | 'Junior Projects';
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  comments: Array<{
    id: string;
    authorName: string;
    avatar?: string;
    authorAvatar?: string;
    text: string;
    timestamp: string;
  }>;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  impactMetrics?: string;
}

export interface PortfolioData {
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  skills: string[];
  projects: PortfolioProject[];
}

export interface MockInterviewResult {
  overallScore: number;
  clarityScore: number;
  technicalAccuracyScore: number;
  starBreakdown: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  positiveHighlights: string[];
  areasToImprove: string[];
  improvedSampleAnswer: string;
}

export interface ScheduledInterview {
  id: string;
  role: string;
  company: string;
  date: string;
  time: string;
  type: 'AI Mock Session' | 'Official Company Interview' | 'Mentor Prep';
  status: 'Upcoming' | 'Completed' | 'In Progress';
}

export interface JobAlert {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  matchScore: number;
  timestamp: string;
  read: boolean;
  type: 'Internship' | 'Field Training' | 'Junior Role';
}

export interface CareerSpecializationRoadmap {
  specialization: string;
  industryOutlook: string;
  phases: Array<{
    phaseName: string;
    goal: string;
    milestones: string[];
    recommendedCourses: Array<{
      title: string;
      platform: string;
      skillsLearned: string;
    }>;
    portfolioProject: {
      title: string;
      description: string;
    };
  }>;
  topRequiredSkills: string[];
  internshipReadinessChecklist: string[];
}

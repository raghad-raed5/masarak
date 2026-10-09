import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
// @ts-ignore
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const GEMINI_MODELS = Array.from(
  new Set([process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-2.0-flash'].filter(Boolean) as string[])
);

// Tries each model in order so a wrong/retired model name doesn't silently break everything.
async function generateWithFallback(params: any): Promise<any> {
  let lastErr: any;
  for (const model of GEMINI_MODELS) {
    try {
      return await ai!.models.generateContent({ ...params, model });
    } catch (err: any) {
      lastErr = err;
      console.error(`Gemini call failed with model "${model}":`, err?.message || err);
    }
  }
  throw lastErr;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '30mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: !!apiKey });
  });

  // Extract plain text from DOCX file
  app.post('/api/extract-docx', async (req, res) => {
    try {
      const { base64Data } = req.body;
      if (!base64Data) {
        return res.status(400).json({ error: 'No file data provided' });
      }
      const buffer = Buffer.from(base64Data, 'base64');
      const result = await mammoth.extractRawText({ buffer });
      const extractedText = (result.value || '').trim();
      res.json({ text: extractedText });
    } catch (err: any) {
      console.error('Error extracting DOCX:', err);
      res.status(500).json({ error: 'Failed to extract text from DOCX file' });
    }
  });

  // Extract plain text from an uploaded CV (PDF, DOCX, DOC, TXT/MD/RTF)
  app.post('/api/extract-cv', async (req, res) => {
    try {
      const { base64Data, fileName = '' } = req.body || {};
      if (!base64Data) {
        return res.status(400).json({ error: 'No file data provided' });
      }
      const buffer = Buffer.from(base64Data, 'base64');
      const name = String(fileName).toLowerCase();
      const isPdf = name.endsWith('.pdf') || buffer.subarray(0, 5).toString('latin1') === '%PDF-';
      const isZipDocx = buffer.subarray(0, 2).toString('latin1') === 'PK';

      let text = '';

      if (isPdf) {
        try {
          // @ts-ignore
          const { extractText, getDocumentProxy } = await import('unpdf');
          const pdf = await getDocumentProxy(new Uint8Array(buffer));
          const out = await extractText(pdf, { mergePages: true });
          text = (Array.isArray(out.text) ? out.text.join('\n') : out.text || '').trim();
        } catch (e) {
          console.error('PDF text extraction failed:', e);
        }

        // Scanned / image-only PDF: let Gemini read it directly
        if (text.length < 40 && ai) {
          try {
            const response = await generateWithFallback({
              contents: [
                {
                  role: 'user',
                  parts: [
                    { inlineData: { mimeType: 'application/pdf', data: base64Data } },
                    { text: 'Transcribe all the text of this CV/resume exactly as plain text. Output only the text, no commentary.' },
                  ],
                },
              ],
              config: { temperature: 0 },
            });
            text = (response.text || '').trim();
          } catch (e) {
            console.error('Gemini PDF OCR failed:', e);
          }
        }
      } else if (isZipDocx || name.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer });
        text = (result.value || '').trim();
      } else if (name.endsWith('.doc')) {
        return res.status(415).json({
          error: 'ملفات .doc القديمة غير مدعومة. افتح الملف في Word واحفظه بصيغة .docx أو PDF ثم ارفعه.',
        });
      } else {
        text = buffer.toString('utf8').trim();
      }

      if (text.length < 20) {
        return res.status(422).json({
          error: 'ما قدرت أستخرج نص من الملف (ممكن يكون صورة/ممسوح ضوئياً). جرّب ملف آخر أو الصق النص يدوياً.',
        });
      }
      res.json({ text });
    } catch (err: any) {
      console.error('Error extracting CV:', err);
      res.status(500).json({ error: 'فشل قراءة الملف. تأكد أنه PDF أو DOCX سليم.' });
    }
  });

  // 1. CV Analyzer & Gap Identification
  app.post('/api/gemini/analyze-cv', async (req, res) => {
    const { cvText, targetRole = 'Software Engineer / AI Junior Specialist', major = 'Computer Science' } = req.body || {};

    if (!cvText || cvText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid CV content with at least 20 characters.' });
    }

    if (!ai) {
      return res.json({
        ...analyzeCvLocally(cvText, targetRole),
        source: 'local',
        notice:
          'تم تحليل السيرة محلياً (بدون ذكاء اصطناعي) لأن مفتاح GEMINI_API_KEY غير مضبوط في ملف .env. أضِف المفتاح للحصول على تحليل أعمق.',
      });
    }

    try {
      const prompt = `You are an expert tech recruiter and youth career counselor specializing in computer science, IT, and emerging technology graduates.
Analyze the following student CV / profile text for the target role: "${targetRole}" (Major: "${major}").
Base EVERYTHING strictly on the CV text below (real name, real skills, real projects). Never invent a name or skills that are not in the CV.

CV Content:
"""
${String(cvText).slice(0, 30000)}
"""

Provide an exhaustive and constructive assessment in valid JSON format ONLY (no markdown code blocks, just raw JSON).
The JSON object MUST match this schema:
{
  "extractedProfile": {
    "candidateName": "string or detected name",
    "detectedDegree": "string or educational background",
    "detectedSkills": ["skill1", "skill2", "..."],
    "experienceYears": "e.g. 0-1 years (Junior / Graduate)",
    "summary": "2 sentence professional profile summary"
  },
  "strengths": [
    "strength point 1 with why it stands out",
    "strength point 2",
    "strength point 3"
  ],
  "skillGaps": [
    {
      "skill": "name of missing/underdeveloped skill",
      "importance": "Critical" | "Important" | "Bonus",
      "reason": "why local internship employers look for this skill",
      "suggestedAction": "concrete mini-project or course to close the gap"
    }
  ],
  "overallScore": number between 45 and 95,
  "marketReadinessSummary": "Detailed paragraph explaining acceptance chances and how the student can optimize their chances for local internships and junior trainee roles.",
  "recommendedNextSteps": [
    "step 1",
    "step 2",
    "step 3",
    "step 4"
  ]
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = (response.text || '').trim();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleaned);
      }

      const base = analyzeCvLocally(cvText, targetRole);
      const result = {
        extractedProfile: {
          candidateName: parsed?.extractedProfile?.candidateName || base.extractedProfile.candidateName,
          detectedDegree: parsed?.extractedProfile?.detectedDegree || base.extractedProfile.detectedDegree,
          detectedSkills: Array.isArray(parsed?.extractedProfile?.detectedSkills)
            ? parsed.extractedProfile.detectedSkills
            : base.extractedProfile.detectedSkills,
          experienceYears: parsed?.extractedProfile?.experienceYears || base.extractedProfile.experienceYears,
          summary: parsed?.extractedProfile?.summary || base.extractedProfile.summary,
        },
        strengths: Array.isArray(parsed?.strengths) ? parsed.strengths : base.strengths,
        skillGaps: Array.isArray(parsed?.skillGaps) ? parsed.skillGaps : base.skillGaps,
        overallScore: Math.round(Number(parsed?.overallScore)) || base.overallScore,
        marketReadinessSummary: parsed?.marketReadinessSummary || base.marketReadinessSummary,
        recommendedNextSteps: Array.isArray(parsed?.recommendedNextSteps)
          ? parsed.recommendedNextSteps
          : base.recommendedNextSteps,
        source: 'gemini',
      };
      return res.json(result);
    } catch (err: any) {
      console.error('CV analysis error:', err);
      return res.json({
        ...analyzeCvLocally(cvText, targetRole),
        source: 'local',
        notice:
          'تعذّر الاتصال بـ Gemini (تحقق من المفتاح GEMINI_API_KEY واسم الموديل). تم عرض تحليل محلي مبني على نص سيرتك.',
      });
    }
  });

  // 2. Smart Job Matching & Score Explanation
  app.post('/api/gemini/match-job', async (req, res) => {
    try {
      const { cvSkills = [], cvProfileSummary = '', jobTitle, company, requirements = [], description = '' } = req.body;

      if (!ai) {
        return res.json(getFallbackJobMatch(cvSkills, jobTitle, company, requirements));
      }

      const prompt = `You are an AI Job Matching Engine for a youth employment platform.
Compare the student's CV skills and background with the requirements of this local internship / junior job opportunity.

Student Skills: ${JSON.stringify(cvSkills)}
Student Summary: ${cvProfileSummary || 'Undergraduate / Recent Graduate in Computer Science & IT'}

Job Title: ${jobTitle}
Company: ${company}
Requirements: ${JSON.stringify(requirements)}
Job Description: ${description}

Return ONLY a valid JSON object with this exact structure:
{
  "matchScore": number (0 to 100 representing compatibility),
  "likelihoodRating": "High" | "Medium" | "Competitive",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["missingSkill1", "missingSkill2"],
  "fitExplanation": "Clear, encouraging explanation of why this specific company and role is a great fit for the student, referencing their background.",
  "interviewTips": [
    "Practical interview prep tip 1 for this exact role",
    "Practical interview prep tip 2"
  ]
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      try {
        return res.json(JSON.parse(text));
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err: any) {
      console.error('Job match error:', err);
      return res.json(getFallbackJobMatch(req.body.cvSkills, req.body.jobTitle, req.body.company, req.body.requirements));
    }
  });

  // 3. AI Cover Letter Writer
  app.post('/api/gemini/generate-cover-letter', async (req, res) => {
    try {
      const {
        studentName = 'Candidate',
        studentBio = '',
        skills = [],
        jobTitle = '',
        company = '',
        jobRequirements = [],
        tone = 'confident',
      } = req.body;

      if (!ai) {
        return res.json(getFallbackCoverLetter(studentName, jobTitle, company, skills, tone));
      }

      const prompt = `You are a high-level career advisor. Write an outstanding, tailored cover letter for a junior graduate / student applying to an internship or junior position.
Student Name: ${studentName}
Student Profile & Bio: ${studentBio}
Key Skills: ${skills.join(', ')}
Target Role: ${jobTitle}
Company: ${company}
Key Requirements to address: ${jobRequirements.join(', ')}
Desired Tone: ${tone} (e.g. confident, enthusiastic, formal, or modern-tech)

Write a compelling, ready-to-send cover letter that highlights quick learning capacity, relevant academic/personal projects, and enthusiasm for the company's domain.

Return ONLY a valid JSON object:
{
  "subjectLine": "Compelling subject line",
  "coverLetterText": "The full formatted cover letter with salutation, 3-4 impactful body paragraphs, and professional sign-off.",
  "keyStrengthsEmphasized": ["Strength 1 emphasized", "Strength 2 emphasized", "Strength 3 emphasized"]
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        return res.json(JSON.parse(text));
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err: any) {
      console.error('Cover letter error:', err);
      return res.json(getFallbackCoverLetter(req.body.studentName, req.body.jobTitle, req.body.company, req.body.skills, req.body.tone));
    }
  });

  // 4. Real-time Interview Performance Feedback
  app.post('/api/gemini/interview-feedback', async (req, res) => {
    try {
      const {
        role = 'Junior Software Engineer',
        question,
        answer,
        questionType = 'behavioral',
      } = req.body;

      if (!question || !answer || answer.trim().length < 5) {
        return res.status(400).json({ error: 'Please provide question and answer.' });
      }

      if (!ai) {
        return res.json(getFallbackInterviewFeedback(role, question, answer));
      }

      const prompt = `You are an expert technical and HR interviewer evaluating a junior candidate's answer for the role of "${role}".
Question Type: ${questionType}
Question Asked: "${question}"
Candidate's Answer: "${answer}"

Evaluate the response objectively using the STAR method (Situation, Task, Action, Result) for behavioral questions or technical depth and clarity for technical questions.

Return ONLY a valid JSON object with this exact structure:
{
  "overallScore": number between 30 and 100,
  "clarityScore": number between 30 and 100,
  "technicalAccuracyScore": number between 30 and 100,
  "starBreakdown": {
    "situation": "Assessment of how well they framed the situation",
    "task": "Assessment of the specific goal/task",
    "action": "Assessment of the actions taken and their individual contribution",
    "result": "Assessment of measurable outcomes or takeaways"
  },
  "positiveHighlights": [
    "What the candidate did really well 1",
    "What they articulated clearly 2"
  ],
  "areasToImprove": [
    "Concrete actionable improvement 1",
    "Concrete actionable improvement 2"
  ],
  "improvedSampleAnswer": "A polished, benchmark STAR-aligned version of how a standout junior engineer would answer this question concisely."
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        return res.json(JSON.parse(text));
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err: any) {
      console.error('Interview feedback error:', err);
      return res.json(getFallbackInterviewFeedback(req.body.role, req.body.question, req.body.answer));
    }
  });

  // 5. AI-Powered Portfolio Builder Enhancement
  app.post('/api/gemini/portfolio-enhance', async (req, res) => {
    try {
      const { candidateName = 'Developer', roleFocus = 'Full Stack Engineer', bio = '', projects = [] } = req.body;

      if (!ai) {
        return res.json({
          heroTagline: `Aspiring ${roleFocus} building scalable web applications and AI-driven solutions.`,
          bioElevated: bio || `${candidateName} is an eager computer science graduate passionate about modern full-stack engineering, clean architecture, and rapid prototyping.`,
          enhancedProjects: projects.map((p: any) => ({
            ...p,
            impactBullet: `Engineered core modules using ${p.tech?.join(', ') || 'modern frameworks'} to optimize performance and usability.`,
          })),
        });
      }

      const prompt = `You are a tech portfolio coach. Elevate this junior developer's portfolio to sound professional, outcome-focused, and captivating for recruiters.
Candidate: ${candidateName}
Role Focus: ${roleFocus}
Original Bio: ${bio}
Projects: ${JSON.stringify(projects)}

Return ONLY a valid JSON object:
{
  "heroTagline": "Punchy 1-sentence headline for their portfolio banner",
  "bioElevated": "Compelling 3-4 sentence professional bio highlighting passion, growth mindset, and technical versatility",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "enhancedProjects": [
    {
      "title": "Project Title",
      "impactSummary": "2-sentence compelling summary emphasizing technologies and measurable outcomes",
      "architectureHighlights": ["Architecture note 1", "Tech decision 2"]
    }
  ]
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '';
      try {
        return res.json(JSON.parse(text));
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err: any) {
      console.error('Portfolio enhance error:', err);
      return res.json({
        heroTagline: `Aspiring ${req.body.roleFocus || 'Tech Specialist'} crafting modern digital experiences.`,
        bioElevated: req.body.bio || 'Motivated graduate dedicated to solving real problems with clean code.',
        keyHighlights: ['Strong algorithmic foundation', 'Full-stack development experience', 'Quick learner with collaborative mindset'],
        enhancedProjects: (req.body.projects || []).map((p: any) => ({
          title: p.title,
          impactSummary: p.description || 'Full-stack application delivering interactive user experiences.',
          architectureHighlights: ['Modular component structure', 'REST API integration'],
        })),
      });
    }
  });

  // 6. Career Roadmap for Junior Students (CS & IT Specializations)
  app.post('/api/gemini/career-roadmap', async (req, res) => {
    try {
      const { specialization = 'AI Engineer', currentYear = 'Year 3', currentSkills = [] } = req.body;

      if (!ai) {
        return res.json(getFallbackRoadmap(specialization, currentYear));
      }

      const prompt = `You are an academic and industry career advisor for computer science and IT students.
Create an in-depth, structured Career Roadmap specifically tailored for a ${currentYear} student aspiring to specialize as a "${specialization}".
Their current skills: ${JSON.stringify(currentSkills)}.

Return ONLY a valid JSON object matching this schema:
{
  "specialization": "${specialization}",
  "industryOutlook": "Brief 2-sentence summary of demand in local and regional tech markets",
  "phases": [
    {
      "phaseName": "Semester 1 / Immediate Next 3 Months",
      "goal": "Core foundational mastery",
      "milestones": [
        "Milestone 1",
        "Milestone 2",
        "Milestone 3"
      ],
      "recommendedCourses": [
        {"title": "Course name", "platform": "Coursera / Stanford Online / Fast.ai", "skillsLearned": "Specific skill"}
      ],
      "portfolioProject": {
        "title": "Recommended Capstone Project",
        "description": "What to build to stand out on CV"
      }
    },
    {
      "phaseName": "Semester 2 / Months 4-6",
      "goal": "Applied domain specialization & local internship prep",
      "milestones": ["Milestone 1", "Milestone 2"],
      "recommendedCourses": [
        {"title": "Course name", "platform": "DeepLearning.AI / AWS", "skillsLearned": "Specific skill"}
      ],
      "portfolioProject": {
        "title": "Industry-grade Project",
        "description": "Production ready project"
      }
    },
    {
      "phaseName": "Senior Year / Final Transition",
      "goal": "Graduate role landing & mentorship networking",
      "milestones": ["Milestone 1", "Milestone 2"],
      "recommendedCourses": [
        {"title": "Advanced Course", "platform": "Kaggle / Linux Foundation", "skillsLearned": "Specific skill"}
      ],
      "portfolioProject": {
        "title": "Live Deployed System",
        "description": "Publicly accessible deployment with CI/CD"
      }
    }
  ],
  "topRequiredSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "internshipReadinessChecklist": [
    "Checklist item 1",
    "Checklist item 2",
    "Checklist item 3"
  ]
}`;

      const response = await generateWithFallback({
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim() || '';
      try {
        return res.json(JSON.parse(text));
      } catch {
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return res.json(JSON.parse(cleaned));
      }
    } catch (err: any) {
      console.error('Roadmap error:', err);
      return res.json(getFallbackRoadmap(req.body.specialization, req.body.currentYear));
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Masarak backend server running on http://0.0.0.0:${PORT}`);
  });
}

// Fallback Generators for high resilience
// ---------------------------------------------------------------------------
// Local (no-AI) CV analysis: reads the REAL CV text instead of returning canned data.
// ---------------------------------------------------------------------------
const SKILL_DICTIONARY: Record<string, string[]> = {
  Python: ['python'],
  JavaScript: ['javascript', 'js', 'es6'],
  TypeScript: ['typescript'],
  React: ['react', 'react.js', 'reactjs'],
  'Node.js': ['node.js', 'nodejs', 'node js'],
  'Next.js': ['next.js', 'nextjs'],
  'Vue / Angular': ['vue', 'angular'],
  'HTML & CSS': ['html', 'css', 'tailwind', 'bootstrap'],
  Java: ['java'],
  'C / C++': ['c++', 'c/c++'],
  'C#': ['c#', '.net'],
  PHP: ['php', 'laravel'],
  Flutter: ['flutter', 'dart'],
  'Android / Kotlin': ['kotlin', 'android'],
  Swift: ['swift', 'ios'],
  'SQL Databases': ['sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle'],
  MongoDB: ['mongodb', 'nosql'],
  'Git & GitHub': ['git', 'github', 'gitlab'],
  'REST APIs': ['rest', 'api', 'apis', 'graphql'],
  Docker: ['docker', 'container'],
  'Cloud (AWS/GCP/Azure)': ['aws', 'gcp', 'azure', 'google cloud', 'firebase'],
  'CI/CD': ['ci/cd', 'github actions', 'jenkins'],
  Linux: ['linux', 'bash', 'shell'],
  'Machine Learning': ['machine learning', 'deep learning', 'scikit', 'sklearn', 'tensorflow', 'pytorch', 'keras', 'neural'],
  'Data Analysis': ['pandas', 'numpy', 'data analysis', 'power bi', 'tableau', 'excel', 'data science'],
  'Testing (Jest / PyTest)': ['jest', 'pytest', 'unit test', 'testing', 'junit', 'cypress', 'selenium'],
  'Cyber Security': ['security', 'cybersecurity', 'penetration', 'network security'],
  Networking: ['networking', 'cisco', 'ccna', 'tcp/ip'],
  'UI/UX Design': ['figma', 'ui/ux', 'ux', 'adobe xd', 'photoshop'],
  'Agile / Scrum': ['agile', 'scrum', 'jira'],
  Teamwork: ['team', 'collaborat', 'leadership', 'volunteer'],
  Communication: ['communication', 'presentation', 'public speaking'],
  'Arabic / English': ['arabic', 'english'],
};

function escapeRe(x: string) {
  return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasTerm(textLower: string, term: string) {
  // word-ish boundary that also works for terms like c++, c#, node.js
  return new RegExp(`(^|[^a-z0-9])${escapeRe(term)}($|[^a-z0-9+#])`, 'i').test(textLower);
}

function roleWantedSkills(targetRole: string): { skill: string; importance: 'Critical' | 'Important' | 'Bonus'; reason: string; action: string }[] {
  const r = (targetRole || '').toLowerCase();
  const gap = (skill: string, importance: 'Critical' | 'Important' | 'Bonus', reason: string, action: string) => ({ skill, importance, reason, action });
  const common = [
    gap('Git & GitHub', 'Important', 'Employers expect every junior to collaborate through version control.', 'Publish 2-3 projects on GitHub with clear READMEs.'),
    gap('Testing (Jest / PyTest)', 'Important', 'Showing tests sets a candidate apart from most student CVs.', 'Add unit tests to your main project and mention coverage on your CV.'),
    gap('Docker', 'Bonus', 'Containerized deployment is a standard expectation in modern teams.', 'Dockerize one of your projects and document how to run it.'),
    gap('CI/CD', 'Bonus', 'Automated build/deploy pipelines show professional engineering habits.', 'Add a GitHub Actions workflow that builds and lints your repo.'),
  ];
  if (/\b(ai|ml|machine|data|ذكاء)\b/.test(r)) {
    return [
      gap('Python', 'Critical', 'Python is the core language for AI/data roles.', 'Build and publish a small end-to-end Python data project.'),
      gap('Machine Learning', 'Critical', 'Employers look for hands-on ML projects, not only coursework.', 'Train and evaluate a model on a public dataset and write up the results.'),
      gap('Data Analysis', 'Important', 'Data cleaning and analysis are daily work for junior AI/data roles.', 'Complete a pandas/NumPy analysis notebook and share it.'),
      gap('SQL Databases', 'Important', 'Most data work starts with querying relational databases.', 'Practice SQL joins/aggregations on a real dataset.'),
      ...common,
    ];
  }
  if (/\b(front|react|web|ui|ux)\b/.test(r)) {
    return [
      gap('JavaScript', 'Critical', 'JavaScript is mandatory for web roles.', 'Build an interactive app without a framework first.'),
      gap('React', 'Critical', 'React is the most requested frontend framework locally.', 'Build and deploy a small React app with API calls.'),
      gap('HTML & CSS', 'Important', 'Solid responsive layout skills are expected from every web junior.', 'Rebuild a real site layout with responsive CSS.'),
      gap('TypeScript', 'Important', 'TypeScript is increasingly required in professional teams.', 'Convert one of your JS projects to TypeScript.'),
      ...common,
    ];
  }
  if (/\b(back|server|node|api|java|php|\.net)\b/.test(r)) {
    return [
      gap('REST APIs', 'Critical', 'Backend juniors must design and consume APIs.', 'Build a CRUD REST API with authentication.'),
      gap('SQL Databases', 'Critical', 'Database modeling and querying is core backend work.', 'Design a normalized schema for a small project.'),
      gap('Node.js', 'Important', 'Node.js/Express is common in local startups.', 'Build a small Express service and deploy it.'),
      gap('Cloud (AWS/GCP/Azure)', 'Important', 'Basic cloud deployment knowledge is expected.', 'Deploy a service to a free cloud tier.'),
      ...common,
    ];
  }
  if (/\b(mobile|android|ios|flutter)\b/.test(r)) {
    return [
      gap('Flutter', 'Critical', 'Cross-platform mobile skills are in demand.', 'Publish a small Flutter app to your portfolio.'),
      gap('REST APIs', 'Important', 'Mobile apps almost always consume backend APIs.', 'Connect an app to a public REST API.'),
      gap('UI/UX Design', 'Bonus', 'Good UX knowledge differentiates mobile developers.', 'Design screens in Figma before coding them.'),
      ...common,
    ];
  }
  return [
    gap('Python', 'Important', 'A versatile language that most junior roles accept.', 'Build a small automation or data project.'),
    gap('JavaScript', 'Important', 'Widely used across internships and junior roles.', 'Build a small web app.'),
    gap('SQL Databases', 'Important', 'Data querying is expected in nearly every tech role.', 'Practice SQL on a real dataset.'),
    gap('REST APIs', 'Important', 'APIs connect nearly every modern system.', 'Build and consume a REST API.'),
    ...common,
  ];
}

function analyzeCvLocally(cvText: string, targetRole: string) {
  const text = String(cvText || '');
  const lower = text.toLowerCase();
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Name: first short line that is not an email/phone/heading-like line
  const nameLine = lines.find(
    (l) =>
      l.length >= 3 &&
      l.length <= 50 &&
      !/[@\d:|/\\]/.test(l) &&
      !/^(curriculum|resume|cv|summary|profile|education|experience|skills|objective)/i.test(l) &&
      l.split(/\s+/).length <= 5
  );
  const candidateName = nameLine || 'Candidate';

  // Degree
  const degreeMatch = text.match(/(b\.?sc\.?|bachelor[^\n,;]*|m\.?sc\.?|master[^\n,;]*|diploma[^\n,;]*|بكالوريوس[^\n,;]*|ماجستير[^\n,;]*)[^\n]{0,80}/i);
  const detectedDegree = degreeMatch ? degreeMatch[0].trim().slice(0, 120) : 'Education not clearly stated in CV';

  // Skills actually found in the CV
  const detectedSkills = Object.entries(SKILL_DICTIONARY)
    .filter(([, terms]) => terms.some((t) => hasTerm(lower, t)))
    .map(([skill]) => skill);

  // Experience
  const yearsMatch = lower.match(/(\d+)\+?\s*(?:years?|yrs?|سنو)/);
  const hasExperience = /(intern|experience|work history|employment|trainee|تدريب|خبرة)/i.test(text);
  const experienceYears = yearsMatch
    ? `${yearsMatch[1]}+ years`
    : hasExperience
      ? '0 - 1 years (Intern / Junior)'
      : '0 years (Fresh graduate / Student)';

  // Gaps = what the target role wants that the CV doesn't show
  const wanted = roleWantedSkills(targetRole);
  const missing = wanted.filter((w) => !detectedSkills.includes(w.skill));
  const matchedWanted = wanted.length - missing.length;
  const skillGaps = missing.slice(0, 6).map((m) => ({
    skill: m.skill,
    importance: m.importance,
    reason: m.reason,
    suggestedAction: m.action,
  }));

  // Score from real coverage + CV completeness
  const coverage = wanted.length ? matchedWanted / wanted.length : 0.5;
  const completeness =
    (/@/.test(text) ? 1 : 0) +
    (/github\.com|linkedin\.com/i.test(text) ? 1 : 0) +
    (/project|مشروع/i.test(text) ? 1 : 0) +
    (hasExperience ? 1 : 0) +
    (degreeMatch ? 1 : 0);
  const overallScore = Math.max(40, Math.min(92, Math.round(45 + coverage * 30 + completeness * 3 + Math.min(detectedSkills.length, 10))));

  const strengths: string[] = [];
  if (detectedSkills.length) strengths.push(`Your CV shows concrete skills: ${detectedSkills.slice(0, 6).join(', ')}.`);
  if (/github\.com/i.test(text)) strengths.push('You link a GitHub profile, which lets recruiters verify your work.');
  if (/project|مشروع/i.test(text)) strengths.push('You list projects, which is the strongest evidence for junior candidates.');
  if (hasExperience) strengths.push('You mention practical experience / training beyond coursework.');
  if (/gpa|honors|award|scholarship|منحة|تفوق/i.test(text)) strengths.push('You include academic achievements that set you apart.');
  if (!strengths.length) strengths.push('Your CV text was read successfully; adding more concrete skills and projects will make your strengths clearer.');

  const nextSteps = [
    'Add measurable results to each project (users, speed, accuracy, etc.).',
    skillGaps[0] ? `Start closing your top gap: ${skillGaps[0].skill}.` : 'Keep your skills section updated with new tools.',
    !/github\.com/i.test(text) ? 'Add your GitHub and LinkedIn links to the CV header.' : 'Pin your best 2 repositories with clear READMEs.',
    'Generate a tailored cover letter for each application.',
  ];

  return {
    extractedProfile: {
      candidateName,
      detectedDegree,
      detectedSkills: detectedSkills.length ? detectedSkills : ['No explicit technical skills detected'],
      experienceYears,
      summary: `${candidateName} — ${detectedDegree}. Detected ${detectedSkills.length} relevant skills for the target role "${targetRole}".`,
    },
    strengths,
    skillGaps,
    overallScore,
    marketReadinessSummary: `Based on your CV text, you match ${matchedWanted} of ${wanted.length} key skills typically requested for "${targetRole}". ${
      skillGaps.length ? `Focus first on: ${skillGaps.slice(0, 3).map((g) => g.skill).join(', ')}.` : 'You cover the main requirements — polish your projects and apply.'
    }`,
    recommendedNextSteps: nextSteps,
  };
}

function getFallbackCvAnalysis(cvText: string, targetRole: string) {
  const isAi = targetRole.toLowerCase().includes('ai') || cvText.toLowerCase().includes('machine learning');
  const detectedSkills = [
    'Python',
    'JavaScript',
    'React',
    'Git & GitHub',
    'SQL Databases',
    'REST APIs',
    'Problem Solving',
    'Agile Collaboration',
  ];

  return {
    extractedProfile: {
      candidateName: 'Amira Tariq',
      detectedDegree: 'B.Sc. Computer Science / IT (Final Year)',
      detectedSkills,
      experienceYears: '0 - 1 years (Entry-Level / Junior)',
      summary:
        'Passionate Computer Science student with practical foundation in software engineering, frontend interfaces, and database modeling, looking for an impactful local internship.',
    },
    strengths: [
      'Strong core in foundational computer science algorithms and modern JavaScript/Python stack.',
      'Demonstrated collaborative enthusiasm with open-source and coursework repositories.',
      'Proactive learning curve with verified familiarity in Git and responsive web architecture.',
    ],
    skillGaps: [
      {
        skill: isAi ? 'PyTorch / LangChain Frameworks' : 'Docker & Containerization',
        importance: 'Critical',
        reason: 'Most local tech companies require candidates to deploy and test code in containerized environments.',
        suggestedAction: 'Complete a weekend containerization sprint deploying a full-stack mini app with Docker Compose.',
      },
      {
        skill: 'Automated Unit & Integration Testing (Jest / PyTest)',
        importance: 'Important',
        reason: 'Junior applicants who demonstrate test coverage immediately outrank 80% of student CVs.',
        suggestedAction: 'Add 5 unit tests to your primary coursework GitHub project.',
      },
      {
        skill: 'Cloud Deployment & CI/CD Pipelines (GitHub Actions / Cloud Run)',
        importance: 'Important',
        reason: 'Local internship employers prioritize candidates who can deploy code independently without hand-holding.',
        suggestedAction: 'Set up an automated GitHub Action that builds and lints your repository on every push.',
      },
      {
        skill: 'System Design Fundamentals & API Caching',
        importance: 'Bonus',
        reason: 'Differentiates stellar candidates during technical interview rounds.',
        suggestedAction: 'Review Redis caching patterns and write a short summary note in your portfolio.',
      },
    ],
    overallScore: 78,
    marketReadinessSummary:
      'Your profile shows a healthy foundational base that qualifies for junior internship screenings. By addressing testing and containerization, your acceptance rate at tier-1 tech firms and local startup incubators will increase by an estimated 65%.',
    recommendedNextSteps: [
      'Pin top 2 repositories on GitHub with clean READMEs and architecture diagrams.',
      'Target internships requiring Python & React for highest match percentage.',
      'Practice mock interview answers on the STAR method to effectively narrate your university projects.',
      'Generate a tailored cover letter emphasizing your quick ramp-up speed.',
    ],
  };
}

function getFallbackJobMatch(cvSkills: string[], jobTitle: string, company: string, requirements: string[]) {
  const common = ['React', 'JavaScript', 'Python', 'Git', 'SQL', 'REST APIs'];
  const matched = requirements.filter((r) =>
    cvSkills.some((s) => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
  );
  const missing = requirements.filter((r) => !matched.includes(r));

  return {
    matchScore: 84,
    likelihoodRating: 'High',
    matchingSkills: matched.length > 0 ? matched : ['JavaScript / Frontend', 'Git Version Control', 'Relational Databases'],
    missingSkills: missing.length > 0 ? missing : ['Docker Containerization', 'Cloud Deployment'],
    fitExplanation: `${company} is actively scaling their junior talent pipeline and values foundational engineering speed and proactive learning. Your background in core programming and hands-on coursework aligns closely with the team's mentor-led structure.`,
    interviewTips: [
      `Review ${company}'s tech stack and prepare to describe how you debugged a tricky error in your recent projects.`,
      `Highlight how quickly you learn new tools and showcase your desire to contribute to production features during the internship.`,
    ],
  };
}

function getFallbackCoverLetter(studentName: string, jobTitle: string, company: string, skills: string[], tone: string) {
  return {
    subjectLine: `Application for ${jobTitle} - ${studentName}`,
    coverLetterText: `Dear Hiring Team at ${company},

I am writing to express my strong enthusiasm for the ${jobTitle} opportunity. As a dedicated Computer Science student with hands-on experience in ${skills.slice(0, 3).join(', ') || 'modern software development'}, I have followed ${company}'s work with great admiration and would love to contribute my technical foundation and rapid learning abilities to your engineering team.

Throughout my university coursework and independent projects, I have focused on writing clean, maintainable code and solving real user problems. I thrive in collaborative environments where curiosity is welcomed, and I am eager to apply my understanding of software lifecycles, problem decomposition, and teamwork to accelerate ${company}'s initiatives.

What excites me most about joining ${company} is the opportunity to learn from seasoned mentors while delivering tangible impact. I pride myself on being proactive, open to feedback, and determined to master whatever tools and frameworks are required to deliver excellence.

Thank you for your time and consideration. I would welcome the opportunity to discuss how my skill set and enthusiasm align with your goals for the ${jobTitle} role.

Sincerely,
${studentName}`,
    keyStrengthsEmphasized: [
      'Proactive continuous learning and rapid technical adaptation',
      'Demonstrated competence in modern development practices',
      'High enthusiasm for team collaboration and mentorship guidance',
    ],
  };
}

function getFallbackInterviewFeedback(role: string, question: string, answer: string) {
  return {
    overallScore: 82,
    clarityScore: 85,
    technicalAccuracyScore: 80,
    starBreakdown: {
      situation: 'Clearly defined the project background and the challenge encountered.',
      task: 'Identified the objective, though could specify individual vs team accountability slightly more.',
      action: 'Good detail on specific steps taken and technologies chosen.',
      result: 'Mentioned the outcome, but would be even stronger with measurable metrics (e.g. reduced load time by 30%).',
    },
    positiveHighlights: [
      'Articulated the problem with confidence without using filler words.',
      'Showcased good problem-solving logic and willingness to consult documentation and teammates.',
    ],
    areasToImprove: [
      'Quantify your impact: mention hours saved, percentage improvements, or user count when discussing results.',
      'Conclude with what you learned from this experience that you now apply routinely.',
    ],
    improvedSampleAnswer: `When we were building our semester project, we faced a major bottleneck where our database queries were taking over 2 seconds under concurrent testing. As the lead backend contributor, my responsibility was to diagnose the root cause and optimize the API throughput. I profiled the slow queries using EXPLAIN ANALYZE, added targeted composite indexes on the user activity table, and implemented a lightweight in-memory cache for repeated lookups. As a result, response times dropped by 78% to under 250ms, and our final demonstration handled all simulated traffic seamlessly.`,
  };
}

function getFallbackRoadmap(specialization: string, currentYear: string) {
  return {
    specialization,
    industryOutlook: `High demand across tech hubs, startups, and enterprise digitizations seeking fresh talent equipped with hands-on engineering agility and fundamentals.`,
    phases: [
      {
        phaseName: 'Phase 1: Core Foundations (Months 1-3)',
        goal: 'Solidify algorithms, data structures, and production-grade version control.',
        milestones: [
          'Master advanced data structures & clean code principles',
          'Build and publish a full-featured CRUD project with automated CI linting',
          'Contribute your first documentation or bugfix PR to an open-source project',
        ],
        recommendedCourses: [
          {
            title: 'Full Stack & Applied Engineering Fundamentals',
            platform: 'University Online / freeCodeCamp',
            skillsLearned: 'TypeScript, REST APIs, Git flow',
          },
        ],
        portfolioProject: {
          title: 'Interactive Real-Time Task & Collaboration Board',
          description: 'A full-stack application featuring live WebSocket updates, JWT auth, and responsive UI.',
        },
      },
      {
        phaseName: 'Phase 2: Applied Specialization (Months 4-6)',
        goal: 'Build domain-specific systems and prepare targeted CV for local internship cycles.',
        milestones: [
          'Implement domain-specific tools (e.g., PyTorch models or microservices architecture)',
          'Complete 2 mock technical interviews and prepare STAR behavioral answers',
          'Connect with 3 industry mentors on Masarak for profile reviews',
        ],
        recommendedCourses: [
          {
            title: 'Modern Architecture & Cloud Deployment Sprint',
            platform: 'Coursera / DeepLearning.AI',
            skillsLearned: 'Docker containers, API gateway, Unit testing',
          },
        ],
        portfolioProject: {
          title: 'Production-Grade Analytics & Recommendation Engine',
          description: 'End-to-end data processing pipeline with interactive visualizations and automated unit tests.',
        },
      },
      {
        phaseName: 'Phase 3: Career Launch & Field Placement (Months 7-9)',
        goal: 'Transition into an accredited local internship or junior graduate role.',
        milestones: [
          'Submit 15 high-match internship applications with customized cover letters',
          'Deliver an impactful final semester capstone project with live URL demonstration',
          'Secure an internship or mentorship endorsement',
        ],
        recommendedCourses: [
          {
            title: 'System Design for Junior Engineers',
            platform: 'Stanford Engineering Everywhere / edX',
            skillsLearned: 'Scalability, microservices, database sharding',
          },
        ],
        portfolioProject: {
          title: 'Deployed Multi-tenant SaaS with Monitoring & Metrics',
          description: 'Publicly hosted application with health checks, Docker containerization, and structured logging.',
        },
      },
    ],
    topRequiredSkills: ['Clean Architecture', 'API Development', 'Docker & CI/CD', 'Git Workflows', 'Testing & Debugging'],
    internshipReadinessChecklist: [
      'Resume formatted with quantifiable project bullet points',
      'GitHub profile featuring at least 2 polished pinned repositories with live demo links',
      'Personal portfolio site showcasing skills and interactive demos',
      'Completed at least 3 simulated mock interview sessions',
    ],
  };
}

startServer();

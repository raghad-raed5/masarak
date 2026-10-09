import {
  CvAnalysisResult,
  JobOpportunity,
  TrainingCourse,
  Mentor,
  ForumPost,
  PortfolioData,
  ScheduledInterview,
  JobAlert,
} from '../types';

export const SAMPLE_CVS = [
  {
    id: 'cv-1',
    label: 'Amira Tariq — 3rd Year CS Student (AI & Web Focus)',
    major: 'Computer Science',
    targetRole: 'AI & Full-Stack Junior Intern',
    text: `Amira Tariq
Amman, Jordan | amira.tariq@student.edu | github.com/amira-tariq | linkedin.com/in/amiratariq

EDUCATION
Princess Sumaya University / Jordan University of Science and Technology
B.Sc. in Computer Science (3rd Year, Current GPA: 3.72/4.0)
Relevant Coursework: Data Structures, Algorithms, Artificial Intelligence, Database Systems, Web Development, Object-Oriented Software Engineering

TECHNICAL SKILLS
- Languages: Python, JavaScript, TypeScript, C++, SQL
- Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Pandas, NumPy, Scikit-learn
- Tools & Platforms: Git, GitHub, VS Code, Postman, Supabase

ACADEMIC & INDEPENDENT PROJECTS
1. MediAssist - Intelligent Health Consultation Prototype
   - Built a full-stack web portal using React, Node.js, and Python backend.
   - Integrated a machine learning triage model (Scikit-Learn Random Forest) achieving 88% cross-validation accuracy on public symptom datasets.
   - Designed responsive UI with Tailwind CSS and connected to RESTful API endpoints.

2. UniExchange - Campus Book & Peer Notes Sharing Portal
   - Developed collaborative marketplace where university students exchange course notes and textbooks.
   - Built with React, Supabase database, and user authentication with email verification.
   - Managed state and implemented full-text search across 500+ mock study resources.

CAMPUS LEADERSHIP & ACTIVITIES
- Member, IEEE Student Branch (AI & Robotics Society) - Organized 2 web development workshops for freshman students.
- Participated in Jordanian Collegiate Programming Contest (JCPC) 2025.`,
  },
  {
    id: 'cv-2',
    label: 'Zaid Al-Husseini — Recent IT Graduate (Software & Cloud)',
    major: 'Information Technology',
    targetRole: 'Junior Software Engineer (Cloud & Backend)',
    text: `Zaid Al-Husseini
Dubai, UAE | zaid.husseini@techgrad.me | github.com/zaid-dev | linkedin.com/in/zaidhdev

EDUCATION
American University / University of Sharjah
B.Sc. in Information Technology, Magna Cum Laude
Graduated: June 2025

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Java, Python, HTML5, CSS3, SQL (PostgreSQL, MySQL)
- Backend & Frameworks: Node.js, Express, Spring Boot basics, Next.js
- Tools: Git, GitHub Actions basics, Linux/Bash, Docker (beginner), Postman, Jest

PROJECTS
1. Smart Logistics Tracker (Final Capstone Project)
   - Created full-stack delivery scheduling dashboard with automated ETA calculation.
   - Engineered REST API endpoints in Node.js/Express with JWT authentication and role-based access.
   - Implemented automated database triggers in PostgreSQL.

2. Cloud Resource Expense Visualizer
   - Built interactive chart dashboard using React, Recharts, and Express.
   - Designed responsive interface for small businesses to track recurring subscription costs.`,
  },
  {
    id: 'cv-3',
    label: 'Noor Mansour — Junior Data Analyst & BI Student',
    major: 'Business Informatics / Computer Science',
    targetRole: 'Data Analyst & BI Intern',
    text: `Noor Mansour
Cairo, Egypt | noor.mansour@uni.edu | github.com/noor-data | linkedin.com/in/noormansour

EDUCATION
Cairo University - Faculty of Computers and Artificial Intelligence
B.Sc. in Information Systems & Data Science (Year 3)

TECHNICAL SKILLS
- Data Analysis: Python (Pandas, NumPy, Matplotlib, Seaborn), SQL (PostgreSQL, MySQL), Power BI, Excel Advanced (VLOOKUP, Pivot Tables)
- Machine Learning basics: Scikit-learn, Exploratory Data Analysis (EDA)
- Web: HTML, CSS, Streamlit for data dashboards

PROJECTS
1. E-Commerce Customer Retention & Churn Analysis
   - Analyzed 50,000+ transaction records using Python and Pandas.
   - Identified top 3 churn drivers and built interactive Power BI executive dashboard.
2. Hospital Patient Wait-Time Simulation Dashboard
   - Built Streamlit web application visualizing patient queue dynamics.`,
  },
];

export const INITIAL_CV_ANALYSIS: CvAnalysisResult = {
  extractedProfile: {
    candidateName: 'Amira Tariq',
    detectedDegree: 'B.Sc. in Computer Science (3rd Year, GPA: 3.72)',
    detectedSkills: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Scikit-Learn', 'Git'],
    experienceYears: '0 - 1 years (Junior / Undergraduate)',
    summary:
      'High-achieving 3rd-year CS student with balanced competency in React frontend development, RESTful APIs, and basic machine learning implementations.',
  },
  strengths: [
    'Solid dual-stack capability: Able to construct clean React user interfaces while scripting backend logic in Python and Node.js.',
    'Verified project delivery: Developed 2 functional full-stack prototypes (MediAssist & UniExchange) demonstrating real-world problem solving.',
    'Active campus engagement: Leadership experience in IEEE and competitive programming background (JCPC).',
  ],
  skillGaps: [
    {
      skill: 'Docker Containerization & Multi-Service Deployment',
      importance: 'Critical',
      reason: 'Local tech startups and software houses require interns to run and package applications inside Docker containers.',
      suggestedAction: 'Dockerize your MediAssist project with Dockerfile and docker-compose.yml, publishing the configuration on GitHub.',
    },
    {
      skill: 'Automated Testing (Unit & Integration with Jest or PyTest)',
      importance: 'Important',
      reason: 'Writing tests sets junior applicants apart from 85% of university student submissions who only test manually.',
      suggestedAction: 'Add 6 test cases for your REST API endpoints verifying authentication and input validation.',
    },
    {
      skill: 'Modern AI LLM Integration (LangChain / Gemini SDK / Vector Search)',
      importance: 'Important',
      reason: 'Companies seeking AI interns now look for practical experience connecting LLMs and retrieval-augmented generation rather than just tabular models.',
      suggestedAction: 'Build a small prototype using Google Gemini API to parse documents or summarize user queries.',
    },
    {
      skill: 'CI/CD Pipelines (GitHub Actions)',
      importance: 'Bonus',
      reason: 'Demonstrating automated linting and build checks shows production mindset from day one.',
      suggestedAction: 'Set up a basic workflow in .github/workflows/main.yml to run tests on git push.',
    },
  ],
  overallScore: 82,
  marketReadinessSummary:
    'Amira is in the top quartile of 3rd-year applicants for summer internships and local field training. Her combination of React, Python, and proactive project building makes her an attractive candidate. By adding containerization and automated testing, she will be fully competitive for funded software engineering and AI internship placements.',
  recommendedNextSteps: [
    'Apply to high-match local internships in Amman and regional remote teams.',
    'Enroll in the "Docker for Developers" and "PyTest Automation" sprint courses.',
    'Generate tailored cover letters highlighting your MediAssist project outcomes.',
    'Book a 1-on-1 mock interview session with an industry mentor to refine your STAR stories.',
  ],
};

export const INITIAL_JOBS: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'AI & Machine Learning Engineering Intern',
    company: 'NeuralSphere Labs',
    logo: '🧠',
    location: 'Amman Tech District (Hybrid)',
    type: 'Internship',
    workplace: 'Hybrid',
    stipend: '$450 / month stipend + Mentorship',
    deadline: 'In 6 days',
    department: 'Artificial Intelligence',
    isHot: true,
    requirements: ['Python', 'Machine Learning', 'REST APIs', 'Git', 'Data Structures', 'Prompt Engineering'],
    description:
      'Join our research and product engineering squad for a 3-month summer internship. You will collaborate directly with senior AI engineers to fine-tune generative models, integrate computer vision APIs, and build intelligent features for healthcare and logistics clients.',
    matchScore: 92,
    likelihoodRating: 'High',
    matchingSkills: ['Python', 'Scikit-Learn', 'Machine Learning', 'REST APIs', 'Git'],
    missingSkills: ['Docker Containerization', 'Prompt Engineering'],
    fitExplanation:
      'NeuralSphere Labs actively recruits 3rd-year university students who demonstrated initiative in full-stack projects. Your MediAssist project directly mirrors their healthcare AI domain, giving you an immediate competitive advantage.',
    interviewTips: [
      'Be prepared to walk through your MediAssist architecture from database to ML inference.',
      'Explain how you would handle imbalanced datasets or inaccurate model predictions.',
    ],
  },
  {
    id: 'job-2',
    title: 'Junior Frontend / React Developer (Field Training)',
    company: 'Amman Digital Ventures',
    logo: '⚡',
    location: 'King Hussein Business Park (On-site)',
    type: 'Field Training',
    workplace: 'On-site',
    stipend: 'Accredited University Hours + Transportation Allowance',
    deadline: 'In 12 days',
    department: 'Web Engineering',
    requirements: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Responsive Design', 'Git'],
    description:
      'Accredited field training opportunity for final and 3rd-year students in Computer Science, Software Engineering, or IT. Work on customer-facing dashboards, learn modern state management, and convert Figma design tokens into clean component libraries.',
    matchScore: 95,
    likelihoodRating: 'High',
    matchingSkills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Git'],
    missingSkills: ['Advanced State Management (Zustand/Redux)'],
    fitExplanation:
      'Your verified experience with React and Tailwind CSS in UniExchange perfectly aligns with their stack. Amman Digital Ventures prides itself on 100% hiring conversion for strong field trainees upon graduation.',
    interviewTips: [
      'Prepare to discuss component lifecycle, custom React hooks, and how you optimize responsive layouts.',
      'Bring a live demo link or GitHub link to your UniExchange project.',
    ],
  },
  {
    id: 'job-3',
    title: 'Full-Stack Software Engineering Trainee',
    company: 'Apex Cloud Solutions',
    logo: '☁️',
    location: 'Remote / Hybrid (Regional)',
    type: 'Junior Role',
    workplace: 'Hybrid',
    stipend: '$600 - $800 / month (Paid Traineeship)',
    deadline: 'In 3 days',
    department: 'Platform Engineering',
    isHot: true,
    requirements: ['Node.js', 'React', 'SQL Databases', 'Docker', 'Testing', 'Git'],
    description:
      'Our Graduate Trainee Program accelerates promising computer science students into full-time junior engineers over 6 months. You will work on microservices, relational databases, and enterprise client integrations.',
    matchScore: 84,
    likelihoodRating: 'High',
    matchingSkills: ['Node.js', 'React', 'SQL Databases', 'Git'],
    missingSkills: ['Docker Containerization', 'Unit Testing'],
    fitExplanation:
      'Apex Cloud provides structured senior mentorship pairs. Your strong foundational fundamentals in both frontend and backend make you an ideal candidate for their 6-month ramp-up program.',
    interviewTips: [
      'Brush up on relational database indexing, SQL joins, and REST API status codes.',
      'Express your eager willingness to learn Docker and automated testing during the onboarding phase.',
    ],
  },
  {
    id: 'job-4',
    title: 'Data & Business Intelligence Intern',
    company: 'Oasis Fintech & Payments',
    logo: '💳',
    location: 'Dubai Internet City & Remote',
    type: 'Internship',
    workplace: 'Remote',
    stipend: '$550 / month stipend',
    deadline: 'In 14 days',
    department: 'Data Analytics',
    requirements: ['SQL', 'Python', 'Data Visualization', 'Pandas', 'Excel / Power BI'],
    description:
      'Assist our data team in analyzing consumer transaction trends, detecting anomalous spending patterns, and compiling automated KPI dashboards for executive stakeholders.',
    matchScore: 76,
    likelihoodRating: 'Medium',
    matchingSkills: ['Python', 'SQL', 'Pandas', 'Data Analysis'],
    missingSkills: ['Power BI', 'Financial Analytics'],
    fitExplanation:
      'Your analytical coursework and Python data manipulation skills qualify you for their initial technical screening. Highlight your ability to interpret data trends clearly.',
    interviewTips: [
      'Practice writing complex SQL queries involving GROUP BY, HAVING, and window functions.',
      'Showcase how you present data insights to non-technical stakeholders.',
    ],
  },
  {
    id: 'job-5',
    title: 'Cybersecurity & Infrastructure Apprentice',
    company: 'ShieldGuard Cyber Defense',
    logo: '🛡️',
    location: 'Technology Incubator Park (On-site)',
    type: 'Mentorship Placement',
    workplace: 'On-site',
    stipend: 'Full Mentorship + Equipment + Certification Sponsorship',
    deadline: 'In 9 days',
    department: 'Security & DevOps',
    requirements: ['Linux / Bash', 'Networking Fundamentals', 'Python scripting', 'Security Basics'],
    description:
      'Exclusive 4-month apprentice placement sponsored by regional cybersecurity leaders. Get hands-on with vulnerability assessments, secure coding audits, and network defense drills.',
    matchScore: 68,
    likelihoodRating: 'Competitive',
    matchingSkills: ['Python scripting', 'Algorithms', 'Git'],
    missingSkills: ['Linux Administration', 'Network Protocols (TCP/IP)', 'OWASP Top 10'],
    fitExplanation:
      'A great opportunity if you wish to pivot into cybersecurity; the program values candidates with solid programming skills who want to specialize in defensive engineering.',
    interviewTips: [
      'Review the OWASP Top 10 web vulnerabilities (SQL injection, XSS, broken auth).',
      'Demonstrate curiosity about defensive architecture and ethical hacking.',
    ],
  },
  {
    id: 'job-6',
    title: 'Mobile App Developer Intern (Flutter / React Native)',
    company: 'Kawn Mobile Labs',
    logo: '📱',
    location: 'Amman - 7th Circle (On-site)',
    type: 'Internship',
    workplace: 'On-site',
    stipend: '$400 / month + Lunch & Transport',
    deadline: 'In 18 days',
    department: 'Mobile Engineering',
    requirements: ['JavaScript/TypeScript', 'React or Flutter', 'REST APIs', 'Mobile UI/UX', 'Git'],
    description:
      'Build consumer mobile apps with hundreds of thousands of active users. Perfect for a junior engineer who loves creating smooth touch animations and responsive mobile layouts.',
    matchScore: 81,
    likelihoodRating: 'High',
    matchingSkills: ['JavaScript/TypeScript', 'React concepts', 'REST APIs', 'Git'],
    missingSkills: ['Native Mobile SDKs', 'State Persistence'],
    fitExplanation:
      'Your React expertise directly transfers to React Native or Flutter component mental models. Kawn provides 1-on-1 pair programming during your first month.',
    interviewTips: [
      'Explain how state flows across hierarchical components.',
      'Discuss how you manage network loading states and error boundaries in frontend applications.',
    ],
  },
];

export const INITIAL_COURSES: TrainingCourse[] = [
  {
    id: 'c-1',
    title: 'Docker & Containerization for Modern Software Developers',
    provider: 'Coursera & Linux Foundation',
    skillsAddressed: ['Docker Containerization', 'Docker Compose', 'Multi-stage Builds'],
    durationHours: 8,
    level: 'Beginner',
    rating: 4.8,
    isFree: true,
    url: 'https://coursera.org',
    completed: false,
  },
  {
    id: 'c-2',
    title: 'Automated Software Testing & CI/CD with Jest & PyTest',
    provider: 'freeCodeCamp & Stanford Online',
    skillsAddressed: ['Automated Testing', 'Jest', 'PyTest', 'GitHub Actions'],
    durationHours: 6,
    level: 'Intermediate',
    rating: 4.9,
    isFree: true,
    url: 'https://freecodecamp.org',
    completed: false,
  },
  {
    id: 'c-3',
    title: 'Building AI Applications with Google Gemini & LangChain',
    provider: 'DeepLearning.AI',
    skillsAddressed: ['Prompt Engineering', 'Gemini SDK', 'LLM Integration', 'RAG'],
    durationHours: 5,
    level: 'Intermediate',
    rating: 4.95,
    isFree: true,
    url: 'https://deeplearning.ai',
    completed: true,
  },
  {
    id: 'c-4',
    title: 'System Design & Scalable REST APIs for Junior Engineers',
    provider: 'edX & Harvard CS50 Web',
    skillsAddressed: ['System Design', 'Caching / Redis', 'Database Indexing'],
    durationHours: 12,
    level: 'Intermediate',
    rating: 4.75,
    isFree: true,
    url: 'https://edx.org',
    completed: false,
  },
  {
    id: 'c-5',
    title: 'Advanced SQL Query Optimization & PostgreSQL Modeling',
    provider: 'DataCamp / University OpenCourseWare',
    skillsAddressed: ['SQL Optimization', 'Relational Schemas', 'Query Profiling'],
    durationHours: 7,
    level: 'Intermediate',
    rating: 4.8,
    isFree: true,
    url: 'https://datacamp.com',
    completed: false,
  },
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm-1',
    name: 'Eng. Rania Al-Khatib',
    role: 'Staff AI Engineer & Tech Lead',
    company: 'NeuralSphere Labs (Ex-Amazon)',
    avatar: '👩‍💻',
    specialties: ['Machine Learning', 'Computer Vision', 'CV & Portfolio Reviews', 'Interview Prep'],
    experience: '9+ years in AI Industry',
    rating: 4.95,
    sessionsCompleted: 142,
    availableDays: ['Tuesdays 5:00 PM', 'Thursdays 6:30 PM', 'Saturdays 11:00 AM'],
    bio: 'Passionate about mentoring female engineers and CS undergraduates. I review CVs, critique GitHub portfolios, and conduct realistic coding and behavioral mock interviews.',
  },
  {
    id: 'm-2',
    name: 'Omar Haddad',
    role: 'Principal Full-Stack Architect',
    company: 'Amman Digital Ventures',
    avatar: '👨‍💼',
    specialties: ['React / Next.js', 'System Architecture', 'Internship Placement Guidance'],
    experience: '12+ years in Software Engineering',
    rating: 4.9,
    sessionsCompleted: 198,
    availableDays: ['Mondays 6:00 PM', 'Wednesdays 7:00 PM'],
    bio: 'Has hired over 40 interns and junior developers over the past 6 years. I will give you candid, actionable advice on what local engineering managers actually care about.',
  },
  {
    id: 'm-3',
    name: 'Dr. Tariq Bseiso',
    role: 'Director of Engineering & Cloud Practice',
    company: 'Apex Cloud Solutions',
    avatar: '👨‍🔬',
    specialties: ['Cloud / DevOps', 'Docker & Kubernetes', 'Career Transition for 3rd/4th Years'],
    experience: '15+ years in Enterprise Cloud',
    rating: 4.88,
    sessionsCompleted: 110,
    availableDays: ['Fridays 4:00 PM', 'Saturdays 2:00 PM'],
    bio: 'Helps students choose between Software Engineering, Cloud DevOps, and Data Science. Provides practical career roadmap road-testing.',
  },
  {
    id: 'm-4',
    name: 'Lina Qasim',
    role: 'Senior People & University Talent Partner',
    company: 'Regional Tech Incubators Network',
    avatar: '✨',
    specialties: ['STAR Method Coaching', 'HR Screenings', 'Negotiating Stipends', 'Cover Letters'],
    experience: '8+ years Tech Recruiting',
    rating: 4.97,
    sessionsCompleted: 230,
    availableDays: ['Sundays 5:00 PM', 'Wednesdays 4:00 PM'],
    bio: 'Former recruiter at top MENA scaleups. I will teach you how to turn your university projects into captivating stories that guarantee interview callbacks.',
  },
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorName: 'Sami Nazzal',
    authorRole: 'Recent CS Graduate @ Just Tech',
    authorAvatar: '👨‍🎓',
    timestamp: '2 hours ago',
    title: 'How I converted my 3rd-year summer internship into a full-time offer before graduation!',
    content:
      'Hey everyone! A lot of juniors ask how to stand out during field training. Here are 3 habits that changed everything for me:\n1. Never say "I don\'t know" without adding "but I\'ll read the docs and test it in 30 minutes".\n2. Document your pull requests with screenshots and bullet points.\n3. Ask your mentor for a 15-minute weekly retro to check what skills you should improve.\nDrop any questions below, happy to help fellow students!',
    category: 'Internship Tips',
    upvotes: 34,
    hasUpvoted: false,
    commentsCount: 5,
    comments: [
      {
        id: 'c-1',
        authorName: 'Amira Tariq',
        authorAvatar: '👩‍💻',
        text: 'This is super motivating Sami! Did you have Docker experience before you started, or did you learn it on the job?',
        timestamp: '1 hour ago',
      },
      {
        id: 'c-2',
        authorName: 'Sami Nazzal',
        authorAvatar: '👨‍🎓',
        text: 'I only knew the basic commands (docker run). The team gave me 3 days to get comfortable with docker-compose, and taking a weekend course beforehand helped a lot!',
        timestamp: '45 mins ago',
      },
    ],
  },
  {
    id: 'post-2',
    authorName: 'Yasmeen Al-Majali',
    authorRole: '3rd Year Computer Engineering Student',
    authorAvatar: '👩‍🔬',
    timestamp: '5 hours ago',
    title: 'Which AI project looks most impressive on a junior CV for local Jordanian & regional startups?',
    content:
      'I am deciding between building a classic Titanic/housing price predictor or a modern RAG assistant connected to Arabic university documents using Gemini API. Which one do recruiters actually click on?',
    category: 'AI & Tech',
    upvotes: 28,
    hasUpvoted: true,
    commentsCount: 4,
    comments: [
      {
        id: 'c-3',
        authorName: 'Omar Haddad (Mentor)',
        authorAvatar: '👨‍💼',
        text: 'Avoid the Titanic dataset! Every recruiter has seen 500 of them. Build the Arabic RAG assistant—practical, solves a localized problem, and shows you know modern APIs.',
        timestamp: '3 hours ago',
      },
    ],
  },
  {
    id: 'post-3',
    authorName: 'Bashar Qawasmeh',
    authorRole: 'Junior DevOps Intern',
    authorAvatar: '🚀',
    timestamp: 'Yesterday',
    title: 'Free local student meetup next Thursday at King Hussein Business Park',
    content:
      'Calling all 3rd and 4th year IT/CS students! We are organizing a peer demo night where 4 students will present their graduation projects and get live feedback from local CTOs. Free coffee and networking.',
    category: 'Junior Projects',
    upvotes: 42,
    hasUpvoted: false,
    commentsCount: 8,
    comments: [],
  },
];

export const INITIAL_PORTFOLIO: PortfolioData = {
  fullName: 'Amira Tariq',
  title: 'Junior Software Engineer & AI Enthusiast',
  tagline: 'Bridging responsive web engineering with intelligent AI capabilities to build impactful human-centered solutions.',
  bio: 'Computer Science undergraduate (Year 3) with a strong foundation in modern JavaScript, React, and Python. Passionate about solving real problems through accessible user experiences, clean architecture, and rapid prototyping.',
  email: 'amira.tariq@student.edu',
  github: 'https://github.com/amira-tariq',
  linkedin: 'https://linkedin.com/in/amiratariq',
  skills: ['React', 'TypeScript', 'Python', 'Node.js', 'SQL', 'Scikit-learn', 'Tailwind CSS', 'Git & GitHub'],
  projects: [
    {
      id: 'proj-1',
      title: 'MediAssist - Intelligent Health Consultation Prototype',
      description:
        'A full-stack diagnostic triage portal utilizing React and Python to assist rural community clinics in preliminary patient screening.',
      technologies: ['React', 'Python', 'Scikit-Learn', 'REST API', 'Tailwind CSS'],
      githubUrl: 'https://github.com/amira-tariq/mediassist',
      liveUrl: 'https://mediassist-preview.app',
      impactMetrics: 'Achieved 88% triage prediction accuracy across 1,200 simulated patient records with sub-200ms latency.',
    },
    {
      id: 'proj-2',
      title: 'UniExchange - Peer Courseware & Textbook Marketplace',
      description:
        'A campus collaborative platform allowing 500+ university peers to list and exchange verified study notes and physical textbooks.',
      technologies: ['React', 'Supabase', 'TypeScript', 'Tailwind CSS'],
      githubUrl: 'https://github.com/amira-tariq/uniexchange',
      liveUrl: 'https://uniexchange-campus.app',
      impactMetrics: 'Facilitated over 350 successful student material exchanges in semester beta testing.',
    },
  ],
};

export const INITIAL_SCHEDULED_INTERVIEWS: ScheduledInterview[] = [
  {
    id: 'int-1',
    role: 'AI & Machine Learning Engineering Intern',
    company: 'NeuralSphere Labs',
    date: 'Oct 14, 2026',
    time: '10:30 AM',
    type: 'Official Company Interview',
    status: 'Upcoming',
  },
  {
    id: 'int-2',
    role: 'Junior Frontend / React Developer',
    company: 'Amman Digital Ventures',
    date: 'Oct 16, 2026',
    time: '2:00 PM',
    type: 'AI Mock Session',
    status: 'Upcoming',
  },
  {
    id: 'int-3',
    role: 'Full-Stack Software Engineering Trainee',
    company: 'Apex Cloud Solutions',
    date: 'Oct 19, 2026',
    time: '11:00 AM',
    type: 'Mentor Prep',
    status: 'Upcoming',
  },
];

export const INITIAL_JOB_ALERTS: JobAlert[] = [
  {
    id: 'al-1',
    jobTitle: 'AI & Machine Learning Engineering Intern',
    company: 'NeuralSphere Labs',
    location: 'Amman Tech District',
    matchScore: 92,
    timestamp: '15 mins ago',
    read: false,
    type: 'Internship',
  },
  {
    id: 'al-2',
    jobTitle: 'Junior Frontend / React Developer (Field Training)',
    company: 'Amman Digital Ventures',
    location: 'King Hussein Business Park',
    matchScore: 95,
    timestamp: '1 hour ago',
    read: false,
    type: 'Field Training',
  },
  {
    id: 'al-3',
    jobTitle: 'Full-Stack Software Engineering Trainee',
    company: 'Apex Cloud Solutions',
    location: 'Remote / Hybrid',
    matchScore: 84,
    timestamp: '3 hours ago',
    read: true,
    type: 'Junior Role',
  },
];

export const INTERVIEW_QUESTIONS = [
  {
    id: 'q-1',
    role: 'AI & Machine Learning Intern',
    type: 'behavioral',
    question: 'Tell me about a technical project where you faced unexpected bugs or model inaccuracy. How did you diagnose and resolve it?',
    sampleStarter: 'In our semester MediAssist project, we initially had low classification precision...',
  },
  {
    id: 'q-2',
    role: 'Junior Frontend / React Developer',
    type: 'technical',
    question: 'How do you structure reusable components in React, and how do you prevent unnecessary re-renders when data updates?',
    sampleStarter: 'I focus on single responsibility and separation between presentational and container components...',
  },
  {
    id: 'q-3',
    role: 'Full-Stack Software Engineering Trainee',
    type: 'behavioral',
    question: 'Describe a situation where you had to work with a team member who disagreed with your architectural design or tech stack choice.',
    sampleStarter: 'During the hackathon, my teammate wanted to use a NoSQL database while I proposed PostgreSQL...',
  },
  {
    id: 'q-4',
    role: 'Data & BI Analyst',
    type: 'situational',
    question: 'If a business manager noticed a sudden 20% drop in user checkout conversion, what 3 exploratory data checks would you run first?',
    sampleStarter: 'First, I would segment by device and browser to rule out client-side errors, then check payment gateway failure logs...',
  },
];

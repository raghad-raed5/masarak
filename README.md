# Masarak

> An AI-powered career companion that helps university students find internships, fix their CV, and choose a career path.

**Theme:** Youth Employment & Skills
**Team:** TEAM_NAME
**Repository:** REPO_URL

---

## The Problem

University students, especially in their third year, struggle with three things:

1. They do not know which internships fit their skills.
2. Their CVs miss important skills and are rarely reviewed by anyone.
3. They are unsure which specialization to pursue (for example, AI Engineer, Data Analyst, or Web Developer).

*(Add one real statistic or source here to strengthen the case.)*

## Our Solution

Masarak turns a student's CV into a personalized plan. The student uploads a CV and the app:

- analyzes it and shows strengths, gaps, and a market-readiness score,
- matches it against internship opportunities, with a match percentage, the reason, and the missing skills,
- writes a tailored cover letter for each opportunity,
- coaches the student through interview questions with feedback,
- improves portfolio project descriptions,
- generates a year-by-year career roadmap for CS/IT students, including specialization suggestions.

## Features

| Feature | What it does | Uses AI |
|---|---|---|
| CV Analyzer & Gaps | Extracts skills from a PDF/Word CV and finds gaps | Yes |
| Smart Job Matching | Scores each opportunity against the CV | Yes |
| Cover Letter | Generates a tailored letter for one opportunity | Yes |
| Interview Coach | Evaluates answers and gives feedback | Yes |
| Portfolio Builder | Rewrites project descriptions professionally | Yes |
| Career Roadmap (CS/IT) | Builds a roadmap by year and specialization | Yes |
| Skill Gap Courses | Course suggestions | Sample data |
| Forum & Mentors | Community and mentor directory | Sample data |
| Job Alerts | Notification drawer | Sample data |

> **Note on data:** The list of opportunities, companies, courses, mentors, and forum posts is **sample data** (`src/data/mockData.ts`). It is for demonstration only. A production version would connect to real employer data.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express (`server.ts`, run with `tsx`) |
| AI | Google Gemini API (`@google/genai`) |
| File parsing | `unpdf` (PDF), `mammoth` (Word) |

The AI is a pre-trained language model accessed through an API. We did not train a model; the value is in the prompts, the workflow, and the product built on top of it.

## Architecture

```
Browser (React UI)
      |
      |  HTTP (JSON)
      v
Express server (server.ts)  -->  Gemini API
      |
      +-- extracts text from PDF / DOCX
      +-- falls back to a local rule-based analysis if the AI call fails
```

## How to Run

### Prerequisites

- **Node.js 18 or later** (download from https://nodejs.org, LTS version)
- A free **Gemini API key** from https://aistudio.google.com/apikey

### 1. Get the code

```bash
git clone REPO_URL
cd REPO_FOLDER
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag avoids a harmless peer-dependency conflict between `esbuild` and `vite`.

### 3. Add your API key

Create a file named `.env` in the project root (next to `package.json`) by copying the example:

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell or Command Prompt)
copy .env.example .env
```

Open `.env` and replace the placeholder with your key:

```
GEMINI_API_KEY="your_key_here"
```

Keep the quotation marks and do not add spaces. **Never commit `.env` to GitHub.**

### 4. Start the app

```bash
npm run dev
```

You should see:

```
AscendYouth backend server running on http://0.0.0.0:3000
```

### 5. Open it

Go to **http://localhost:3000** in your browser.

To confirm the API key was loaded, open **http://localhost:3000/api/health**. It should report that a Gemini key is present.

## Using the App (Demo Flow)

1. Open the **CV Analyzer** tab and upload a CV (PDF or Word) or paste its text.
2. Review the extracted skills, gaps, and readiness score.
3. Open **Smart Job Matching** to see ranked opportunities with match percentages and missing skills.
4. Generate a **cover letter** for the best match.
5. Try the **Interview Coach** and **Career Roadmap** (choose year 3 and a specialization).

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server status and API-key check |
| POST | `/api/extract-docx` | Extract text from a Word file |
| POST | `/api/extract-cv` | Extract text from a PDF or image CV |
| POST | `/api/gemini/analyze-cv` | Analyze a CV |
| POST | `/api/gemini/match-job` | Match a CV to an opportunity |
| POST | `/api/gemini/generate-cover-letter` | Generate a cover letter |
| POST | `/api/gemini/interview-feedback` | Evaluate an interview answer |
| POST | `/api/gemini/portfolio-enhance` | Improve project descriptions |
| POST | `/api/gemini/career-roadmap` | Generate a career roadmap |

## Project Structure

```
server.ts            Express backend and all Gemini calls
index.html           App entry page
src/
  App.tsx            Main layout and state
  components/        One component per tab (CV analyzer, matching, coach, ...)
  data/mockData.ts   Sample opportunities, courses, mentors, forum posts
  types/index.ts     Shared TypeScript types
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm` blocked in PowerShell ("running scripts is disabled") | Run `npm.cmd install --legacy-peer-deps` and `npm.cmd run dev`, or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `ERESOLVE` error during install | Use `npm install --legacy-peer-deps` |
| `package.json not found` | Run the commands from the project root folder |
| Results look basic or generic | The API key is missing or invalid, so the app used its local fallback. Check `/api/health` |
| Port 3000 already in use | Close the other program using it, then run again |

## Limitations & Next Steps

- Opportunity data is sample data; next step is integrating real employer listings.
- Forum and mentor features are static; next step is real accounts and persistence.
- Match scores are AI estimates, not validated measurements.
- The roadmap currently targets CS/IT students; next step is adding other faculties.
- Planned: an employer-side view to publish opportunities and see matched candidates.

## BLTNM

| Name | Role |
|---|---|
| Raghad Raed | Team Leader |
| Sulaf Jaradat | Team Member |
| Hala Khaled | Team Member |
| Batool Alhasani | Team Member |
| Sara Alfroukh | Team Member |

---

*Built during the AI App Hackathon.*
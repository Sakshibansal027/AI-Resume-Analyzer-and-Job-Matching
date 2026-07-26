# AI Resume Analyzer & Job Matching Platform

An AI-powered full-stack platform that analyzes resumes using LLMs, extracts skills, generates an ATS-style score, and matches candidates with relevant job openings — combining live external job listings with jobs posted directly by recruiters. Built with a complete dual-role system (**candidate** / **recruiter**), secure email-verified authentication, and AI-driven job matching.

---

## ✨ Features

### For Candidates
- **Resume Upload & AI Analysis** — Upload a PDF resume; Google Gemini extracts skills, generates an ATS-style score (out of 10), strengths, weaknesses, ATS issues, and improvement suggestions.
- **AI-Powered Job Matching** — Matches your resume against both live external listings (via the Arbeitnow Job Board API) and jobs posted internally by recruiters, using a weighted score: 80% skill-overlap + 20% AI confidence score.
- **AI Match Reasoning** — Groq (Llama) generates a human-readable explanation of *why* a job fits, plus the skills you're missing for it.
- **Save Jobs** — Bookmark listings (external or internal) to revisit later, with independent tracking so two different internally-posted jobs never collide.
- **Match History** — Every match run is persisted to the database, so past recommendations aren't lost.

### For Recruiters
- **Recruiter Dashboard** — A dedicated view listing every job you've posted, separate from the candidate experience.
- **Full Job CRUD** — Post, edit, and delete your own job listings through an in-dashboard modal. Ownership is enforced server-side — no recruiter can edit or delete another recruiter's posting.
- **Automatic Candidate Matching** — Any job you post is immediately included in the AI matching pipeline alongside external listings, with no extra step.

### Authentication & Account Security
- **Email/password auth** with JWT sessions (7-day expiry), including the user's role in the token payload.
- **Verify-before-create architecture** — new signups are held in a temporary `PendingUser` collection (with a MongoDB TTL index that auto-deletes unverified signups after 24 hours) and are only promoted into the real `User` collection once the email link is clicked. This means an abandoned or fake-email signup never permanently blocks that email address.
- **Resend verification email** if the original expires or wasn't received.
- **Forgot / reset password** flow using single-use, time-limited (1 hour) reset tokens. The API never reveals whether a given email is registered, to prevent account enumeration.
- **Role-based routing** — `candidate` vs `recruiter` accounts land on entirely different dashboards and see different navigation.
- **Locked-down CORS** — the API only accepts requests from the configured frontend origin(s), not the open internet.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Axios (with an auth-token interceptor)
- lucide-react (icons)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose (including a TTL index for pending signups)
- JWT for stateless authentication
- bcryptjs for password hashing
- Multer (in-memory storage) for resume uploads — no local disk dependency
- Nodemailer (Gmail SMTP) for verification and password-reset emails

**AI & External Services**
- **Google Gemini** (`gemini-2.5-flash`) — resume parsing, skill extraction, ATS analysis, role detection
- **Groq** (Llama) — job-match reasoning for top candidate matches
- **Cloudinary** — resume PDF storage (uploaded as a base64 buffer, no local filesystem writes)
- **Arbeitnow Job Board API** — live external job listings

---

## 📁 Project Structure

```
AI-Resume-Analyzer-and-Job-Matching/
├── Client/                        # React frontend (Vite)
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx / Register.jsx
│       │   ├── VerifyEmail.jsx / ForgotPassword.jsx / ResetPassword.jsx
│       │   ├── Dashboard.jsx              # Candidate home
│       │   ├── UploadResume.jsx / Analysis.jsx
│       │   ├── Jobs.jsx / SavedJobs.jsx
│       │   ├── RecruiterDashboard.jsx     # Recruiter home (My Jobs + edit/delete)
│       │   └── PostJob.jsx
│       ├── components/
│       │   ├── Navbar.jsx                 # Role-aware navigation
│       │   └── ProtectedRoute.jsx
│       └── services/
│           └── api.js                     # Axios instance with auth interceptor
│
└── Server/                        # Express backend
    ├── controllers/
    │   ├── auth.controller.js             # Register, login, verify, reset
    │   ├── resume.controller.js
    │   ├── job.controller.js              # Post/edit/delete/list jobs
    │   ├── match.controller.js            # AI matching pipeline
    │   └── savedJob.controller.js
    ├── models/
    │   ├── user.model.js
    │   ├── pendingUser.model.js           # TTL-indexed, unverified signups
    │   ├── resume.model.js
    │   ├── job.model.js
    │   ├── match.model.js
    │   └── savedJob.model.js
    ├── routes/
    ├── middlewares/
    │   ├── auth.middleware.js             # JWT verification (protect)
    │   ├── multer.js                      # In-memory file upload
    │   └── error.middleware.js
    └── utils/
        ├── ai.js                          # Gemini + Groq calls
        ├── cloudinary.js
        └── sendEmail.js
```

---

## 🔐 How Authentication Works

Signup does **not** write directly to the main `User` collection. Instead:

1. `POST /api/auth/register` hashes the password and creates a document in **`PendingUser`**, with a random verification token and a 24-hour `expiresAt`. A verification email is sent immediately.
2. If the user clicks the emailed link, `GET /api/auth/verify-email/:token` finds the matching pending record, **creates the real `User`** document from it, and deletes the pending record.
3. If the user never verifies, MongoDB's TTL index automatically deletes the pending record after 24 hours — freeing up that email address for a future signup attempt.
4. `POST /api/auth/login` only checks the `User` collection. If no verified user is found but a pending signup exists, the API responds with a specific `notVerified` flag so the frontend can offer to resend the verification email.

This avoids a common pitfall where unverified/fake signups permanently occupy a unique email slot in the main users table.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- API keys: [Google Gemini](https://ai.google.dev/), [Groq](https://console.groq.com/), [Cloudinary](https://cloudinary.com/)
- A Gmail account with a [16-character App Password](https://myaccount.google.com/apppasswords) generated (2-Step Verification must be enabled first) — used to send verification/reset emails

### 1. Clone the repository
```bash
git clone https://github.com/Sakshibansal027/AI-Resume-Analyzer-and-Job-Matching.git
cd AI-Resume-Analyzer-and-Job-Matching
```

### 2. Backend setup
```bash
cd Server
npm install
```

Create a `.env` file in `Server/` (see `.env.example`):
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

> **Note on `CLOUDINARY_API_KEY`:** the API key used must have an assigned role/permission on your Cloudinary product environment (Settings → API Keys → your key → assign a role), otherwise uploads fail with a 403 "missing permissions" error even with correct credentials.

Run the backend:
```bash
npm run dev
```
Server starts on `http://localhost:3000`.

### 3. Frontend setup
```bash
cd Client
npm install
```

Create a `.env` file in `Client/` (see `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Run the frontend:
```bash
npm run dev
```
App runs on `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | Server | MongoDB connection string |
| `JWT_SECRET` | Server | Secret used to sign auth tokens |
| `GEMINI_API_KEY` | Server | Google Gemini API key — resume analysis, skill extraction, role detection |
| `GROQ_API_KEY` | Server | Groq API key — job match reasoning |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Server | Cloudinary credentials for resume PDF storage |
| `CLIENT_URL` | Server | Frontend origin — used for CORS allow-listing and building email links |
| `EMAIL_USER` / `EMAIL_PASS` | Server | Gmail address + App Password used to send verification/reset emails |
| `VITE_API_BASE_URL` | Client | Backend API base URL |

---

## 📡 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create a pending signup and send a verification email |
| POST | `/login` | — | Log in (fails with `notVerified: true` if email isn't verified yet) |
| GET | `/verify-email/:token` | — | Verify email and promote the pending signup into a real account |
| POST | `/resend-verification` | — | Resend the verification email for a pending signup |
| POST | `/forgot-password` | — | Send a password reset link (generic response either way) |
| POST | `/reset-password/:token` | — | Set a new password using a valid reset token |

### Resumes — `/api/resumes`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload` | ✅ | Upload a resume PDF; runs AI analysis + Cloudinary upload |
| GET | `/me` | ✅ | Get the current user's latest resume analysis |

### Jobs — `/api/jobs`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/match` | ✅ | Get AI-matched jobs (external + internal) for the current resume |
| GET | `/matches/history` | ✅ | View past match results |
| GET | `/my-jobs` | ✅ (recruiter) | List jobs the current recruiter has posted |
| POST | `/` | ✅ (recruiter) | Post a new job |
| PUT | `/update/:jobId` | ✅ (recruiter, owner-only) | Edit a job you posted |
| DELETE | `/delete/:jobId` | ✅ (recruiter, owner-only) | Delete a job you posted |
| POST | `/save` | ✅ | Save/bookmark a job |
| GET | `/saved` | ✅ | List saved jobs |
| DELETE | `/unsave/:jobId` | ✅ | Remove a saved job |

All ✅ routes require a `Authorization: Bearer <token>` header.

---

## 🧠 AI Matching Pipeline (how it works)

1. The candidate's most recent resume (skills + AI summary) is loaded.
2. Jobs are pulled from two sources and merged: the live Arbeitnow API, and the platform's own `Job` collection (recruiter postings).
3. Gemini's earlier role-detection output filters the combined job list down to relevant roles.
4. For each candidate job, a skill-overlap score is computed (`matched skills ÷ total resume skills`), combined 80/20 with the resume's overall AI score.
5. For the top 2 highest-relevance jobs, Groq generates a natural-language match reason and a list of missing skills (this is capped to control latency and API cost — the rest get a lightweight "basic match" label).
6. Results are sorted by score, returned to the client, and saved to `Match` history.

---

## 🗺️ Known Limitations / Future Improvements

- Email sending currently uses a personal Gmail account via SMTP — fine for demo/portfolio scale, but a dedicated transactional email provider (e.g. Resend, SendGrid) would be needed before any real production traffic, since Gmail enforces a ~500 email/day sending limit.
- No automated test suite yet.
- No pagination on job matching / saved jobs lists.

---

## 👩‍💻 Author

**Sakshi Bansal**
Full-stack portfolio project demonstrating resume parsing with LLMs, AI-driven job matching, secure email-verified authentication, and role-based dashboards.

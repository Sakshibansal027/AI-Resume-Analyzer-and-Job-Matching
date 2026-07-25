import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  Briefcase, 
  Building2, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight
} from "lucide-react";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedUrls, setSavedUrls] = useState([]);
  const [savingUrl, setSavingUrl] = useState("");
  const hasFetched = useRef(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/jobs/match");
      setJobs(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load job recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job) => {
    const jobKey = job.url || `${job.title}-${job.company}`;
    try {
      setSavingUrl(jobKey);

      await API.post("/jobs/save", {
        jobTitle: job.title,
        company: job.company,
        applyLink: job.url || "",
      });

      setSavedUrls((current) => [...current, jobKey]);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingUrl("");
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Ambient Background Glows */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 z-10">
        
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> AI Skill-Matched Openings
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Recommended <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Jobs</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Roles tailored specifically based on your uploaded resume skills, experience profile, and ATS analysis.
            </p>
          </div>

          <Link 
            to="/saved-jobs" 
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-all shadow-md shrink-0"
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span>Saved Jobs</span>
          </Link>
        </div>

        {/* Loading Skeleton State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium">Matching your skill profile with active openings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-slate-900 border border-red-500/30 p-6 rounded-3xl max-w-xl mx-auto text-center shadow-xl my-10">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Failed to Load Matches</h3>
            <p className="text-slate-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center max-w-md mx-auto my-12">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Jobs Found</h3>
            <p className="text-slate-400 text-sm mb-6">
              Try re-uploading an updated resume with more key skills to see matched job recommendations.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              <span>Upload New Resume</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-6">
            {jobs.map((job, index) => {
              const jobKey = job.url || `${job.title}-${job.company}`;
              const isSaved = savedUrls.includes(jobKey);
              const isSaving = savingUrl === jobKey;

              return (
                <div
                  key={index}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-6 md:p-8 rounded-3xl transition-all duration-200 shadow-xl backdrop-blur-xl flex flex-col justify-between"
                >
                  {/* Top Row: Title, Company & Score */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-1">
                        {job.title}
                      </h2>
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{job.company || "Company Undisclosed"}</span>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    {job.score && (
                      <div className="self-start px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide flex items-center gap-1.5 shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Match Score: {job.score}</span>
                      </div>
                    )}
                  </div>

                  {/* Reason Summary */}
                  {job.reason && (
                    <div className="mb-5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                      <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{job.reason}</span>
                    </div>
                  )}

                  {/* Skills Section */}
                  <div className="space-y-3 mb-6">
                    {/* Matched Skills */}
                    {job.matchedSkills?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
                          Matched Skills:
                        </span>
                        {job.matchedSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Missing Skills */}
                    {job.missingSkills?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
                          Missing Skills:
                        </span>
                        {job.missingSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium"
                          >
                            <AlertCircle className="w-3 h-3" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action CTAs */}
                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => handleSaveJob(job)}
                      disabled={isSaving || isSaved}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSaved
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white"
                      } disabled:opacity-75 disabled:cursor-not-allowed`}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4" />
                          <span>Saved</span>
                        </>
                      ) : isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4" />
                          <span>Save Job</span>
                        </>
                      )}
                    </button>

                    {job.url ? (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-xs"
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/60 border border-slate-700 text-slate-400 font-medium rounded-xl text-xs cursor-not-allowed"
                        title="This is an internally posted job — reach out to the company directly."
                      >
                        Internal Posting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default Jobs;
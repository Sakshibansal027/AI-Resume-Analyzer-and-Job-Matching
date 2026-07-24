import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { 
  Bookmark, 
  Building2, 
  ExternalLink, 
  Trash2, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  AlertCircle
} from "lucide-react";

function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  useEffect(() => {
    API.get("/jobs/saved")
      .then((response) => setJobs(response.data.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load saved jobs.");
      })
      .finally(() => setLoading(false));
  }, []);

  const removeJob = async (jobId) => {
    try {
      setRemovingId(jobId);
      await API.delete(`/jobs/unsave/${jobId}`);
      setJobs((current) => current.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Ambient Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
              <Bookmark className="w-3.5 h-3.5" /> Bookmarked Opportunities
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              Saved <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Jobs</span>
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Manage your shortlisted positions and apply whenever you're ready.
            </p>
          </div>

          <Link
            to="/jobs"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Recommendations</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium">Fetching your saved opportunities...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-slate-900 border border-red-500/30 p-6 rounded-3xl max-w-xl mx-auto text-center shadow-xl my-10">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Could Not Load Saved Jobs</h3>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center max-w-md mx-auto my-12">
            <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Saved Jobs Yet</h3>
            <p className="text-slate-400 text-sm mb-6">
              You haven't bookmarked any jobs. Browse your AI recommendations and save roles you like.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Recommended Jobs</span>
            </Link>
          </div>
        )}

        {/* Saved Jobs List */}
        {!loading && !error && jobs.length > 0 && (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 p-6 rounded-3xl transition-all shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Title & Company */}
                <div>
                  <h2 className="text-xl font-bold text-white mb-1 tracking-tight">
                    {job.jobTitle}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{job.company || "Company Undisclosed"}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => removeJob(job._id)}
                    disabled={removingId === job._id}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {removingId === job._id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </>
                    )}
                  </button>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    <span>Apply Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default SavedJobs;
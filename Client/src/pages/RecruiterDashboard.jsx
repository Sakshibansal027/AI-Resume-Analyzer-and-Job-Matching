import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import {
    Briefcase,
    Building2,
    MapPin,
    Sparkles,
    FilePlus2,
    Loader2,
    AlertCircle,
    ListChecks,
    Pencil,
    Trash2,
    X,
    CheckCircle2,
    DollarSign
} from "lucide-react";

function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // States for Edit & Actions
    const [editingJob, setEditingJob] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        if (actionMessage.text) {
            const timer = setTimeout(() => {
                setActionMessage({ type: "", text: "" });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [actionMessage]);
    const fetchJobs = () => {
        API.get("/jobs/my-jobs")
            .then((res) => setJobs(res.data.data || []))
            .catch((err) => {
                setError(err.response?.data?.message || "Could not load your posted jobs.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // DELETE JOB
    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;

        try {
            await API.delete(`/jobs/delete/${jobId}`);
            setJobs(jobs.filter((job) => job._id !== jobId));
            setActionMessage({ type: "success", text: "Job deleted successfully!" });
        } catch (err) {
            setActionMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to delete the job."
            });
        }
    };

    // UPDATE / EDIT JOB
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(true);

        try {
            const res = await API.put(`/jobs/update/${editingJob._id}`, editingJob);
            setJobs(jobs.map((job) => (job._id === editingJob._id ? res.data.data : job)));
            setEditingJob(null);
            setActionMessage({ type: "success", text: "Job updated successfully!" });
        } catch (err) {
            setActionMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to update the job."
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
            <Navbar />

            {/* Ambient Background Glows */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                            <Sparkles className="w-3.5 h-3.5" /> Recruiter Dashboard
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                            Your Posted <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Jobs</span>
                        </h1>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Manage the openings you've posted. Edit details or remove filled positions easily.
                        </p>
                    </div>

                    <Link
                        to="/add-job"
                        className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                    >
                        <FilePlus2 className="w-4 h-4" />
                        <span>Post New Job</span>
                    </Link>
                </div>

                {/* Action Status Message */}
                {actionMessage.text && (
                    <div
                        className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm border ${actionMessage.type === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                            }`}
                    >
                        {actionMessage.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0" />
                        )}
                        <span>{actionMessage.text}</span>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <p className="text-sm font-medium">Loading your postings...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-slate-900 border border-red-500/30 p-6 rounded-3xl max-w-xl mx-auto text-center shadow-xl my-10">
                        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-white mb-1">Could Not Load Jobs</h3>
                        <p className="text-slate-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && jobs.length === 0 && (
                    <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-3xl text-center max-w-md mx-auto my-12">
                        <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Jobs Posted Yet</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            Post your first opening to start matching with candidates.
                        </p>
                        <Link
                            to="/add-job"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
                        >
                            <FilePlus2 className="w-4 h-4" />
                            <span>Post a Job</span>
                        </Link>
                    </div>
                )}

                {/* Jobs List */}
                {!loading && !error && jobs.length > 0 && (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <article
                                key={job._id}
                                className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl transition-all shadow-xl backdrop-blur-xl flex flex-col md:flex-row justify-between gap-4"
                            >
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h2 className="text-xl font-bold text-white tracking-tight">
                                            {job.title}
                                        </h2>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-sm font-medium mb-3">
                                        {job.company && (
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4 text-indigo-400" />
                                                {job.company}
                                            </span>
                                        )}
                                        {job.location && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-indigo-400" />
                                                {job.location}
                                            </span>
                                        )}
                                        {job.jobType && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs">
                                                {job.jobType}
                                            </span>
                                        )}
                                    </div>

                                    {job.requiredSkills?.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                                                <ListChecks className="w-3.5 h-3.5" /> Skills:
                                            </span>
                                            {job.requiredSkills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Edit / Delete Buttons */}
                                <div className="flex items-center gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-800/80 shrink-0">
                                    <button
                                        onClick={() => setEditingJob(job)}
                                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                                    >
                                        <Pencil className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>

                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* EDIT JOB MODAL */}
                {editingJob && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
                            <button
                                onClick={() => setEditingJob(null)}
                                className="absolute right-5 top-5 text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-6">Edit Job Posting</h2>

                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={editingJob.title || ""}
                                        onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Company</label>
                                        <input
                                            type="text"
                                            value={editingJob.company || ""}
                                            onChange={(e) => setEditingJob({ ...editingJob, company: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Location</label>
                                        <input
                                            type="text"
                                            value={editingJob.location || ""}
                                            onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">Job Type</label>
                                        <input
                                            type="text"
                                            value={editingJob.jobType || ""}
                                            onChange={(e) => setEditingJob({ ...editingJob, jobType: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Required Skills (comma separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                Array.isArray(editingJob.requiredSkills)
                                                    ? editingJob.requiredSkills.join(", ")
                                                    : editingJob.requiredSkills || ""
                                            }
                                            onChange={(e) =>
                                                setEditingJob({
                                                    ...editingJob,
                                                    requiredSkills: e.target.value.split(",").map((s) => s.trim())
                                                })
                                            }
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setEditingJob(null)}
                                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span>Save Changes</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default RecruiterDashboard;
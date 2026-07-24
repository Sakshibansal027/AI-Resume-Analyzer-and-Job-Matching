import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  ArrowRight, 
  Loader2, 
  Briefcase,
  FileText
} from "lucide-react";

function Analysis() {
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/resumes/me")
      .then((response) => setResume(response.data.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Could not load analysis report.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-md text-center shadow-2xl">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Failed to Load Report</h3>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <button
              onClick={() => navigate("/upload")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              Upload Resume First
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm font-medium">Generating AI Analysis Report...</p>
        </div>
      </div>
    );
  }

  const analysis = resume.aiResult;
  const score = analysis?.score ?? 0; // Out of 10

  // Calculate score percentage & color tone
  const scorePercent = Math.min(Math.max(score * 10, 0), 100);
  let scoreColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  let barBg = "bg-emerald-500";
  
  if (score < 5) {
    scoreColor = "text-rose-400 border-rose-500/30 bg-rose-500/10";
    barBg = "bg-rose-500";
  } else if (score < 7.5) {
    scoreColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    barBg = "bg-amber-500";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <Navbar />

      {/* Background Glow Effects */}
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 z-10">
        
        {/* Header Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI Diagnostic Summary
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            Resume <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Analysis Report</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
            {analysis?.summary || "Comprehensive breakdown of your resume readability, ATS optimization, and key strengths."}
          </p>
        </div>

        {/* ATS Score Meter Card */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl backdrop-blur-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className={`p-4 rounded-2xl border ${scoreColor} shrink-0`}>
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Overall ATS Readability Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{score}</span>
                <span className="text-slate-500 text-lg font-medium">/ 10</span>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full md:max-w-md">
            <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
              <span>Optimization Level</span>
              <span>{scorePercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${barBg}`} 
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Cards Grid */}
        <section className="grid gap-6 md:grid-cols-2 mb-10">
          
          {/* Strengths Card */}
          <ListCard 
            title="Key Strengths" 
            items={analysis?.strengths} 
            type="success"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          />

          {/* Weaknesses Card */}
          <ListCard 
            title="Weaknesses & Gaps" 
            items={analysis?.weaknesses} 
            type="danger"
            icon={<XCircle className="w-5 h-5 text-rose-400" />}
          />

          {/* ATS Issues Card */}
          <ListCard 
            title="ATS Readability Issues" 
            items={analysis?.ats_issues} 
            type="warning"
            icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          />

          {/* Suggestions Card */}
          <ListCard 
            title="AI Recommendations" 
            items={analysis?.suggestions} 
            type="info"
            icon={<Lightbulb className="w-5 h-5 text-indigo-400" />}
          />

        </section>

        {/* Bottom CTA Button */}
        <div className="flex justify-center md:justify-end">
          <button
            onClick={() => navigate("/jobs")}
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Briefcase className="w-4 h-4" />
            <span>View Recommended Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>
    </div>
  );
}

{/* Helper Sub-Component */}
function ListCard({ title, items = [], type = "info", icon }) {
  // Border accent colors based on type
  const borderStyles = {
    success: "border-emerald-500/20 bg-emerald-500/5",
    danger: "border-rose-500/20 bg-rose-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    info: "border-indigo-500/20 bg-indigo-500/5"
  };

  return (
    <div className={`rounded-3xl border ${borderStyles[type]} bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between`}>
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          {icon}
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        </div>

        {items && items.length > 0 ? (
          <ul className="space-y-2.5 text-slate-300 text-sm">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                <span className="block w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-xs italic">No specific items identified in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Analysis;
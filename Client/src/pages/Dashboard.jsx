import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  UploadCloud, 
  Briefcase, 
  Sparkles, 
  Zap, 
  Target, 
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Navbar Integration */}
      <Navbar />

      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 z-10 flex flex-col justify-between">
        
        {/* Hero Welcome Section */}
        <div className="text-center md:text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Career Assistant
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
            Welcome back to your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Career Hub</span> 🎉
          </h1>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Optimize your resume with our AI parser, extract missing key skills, and discover high-matching job opportunities.
          </p>
        </div>

        {/* REPLACED: Key Feature Highlights (Static & Helpful) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white mb-0.5">Instant NLP Parsing</h4>
              <p className="text-xs text-slate-400 leading-snug">Extracts skills, experience & keywords in seconds.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white mb-0.5">ATS Optimization</h4>
              <p className="text-xs text-slate-400 leading-snug">Scores resume readability against modern hiring standards.</p>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white mb-0.5">Smart Matcher</h4>
              <p className="text-xs text-slate-400 leading-snug">Recommends jobs strictly relevant to your tech stack.</p>
            </div>
          </div>
        </div>

        {/* Main Interactive Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Card 1: Upload Resume */}
          <div 
            onClick={() => navigate("/upload")}
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
            
            <div>
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Upload & Analyze Resume
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Let our AI parse your resume format, calculate readability score, extract core skills, and suggest missing keywords.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              <span>Start Upload</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: View Jobs */}
          <div 
            onClick={() => navigate("/jobs")}
            className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
            
            <div>
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Job Recommendations
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Explore tech roles matching your skill matrix with real-time similarity matching and targeted application insights.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
              <span>Explore Matches</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Workflow Steps Footer */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Step 1: Upload PDF/Docx Resume</span>
          </div>
          <div className="hidden md:block text-slate-700">•</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Step 2: AI Analyzes Experience & Skills</span>
          </div>
          <div className="hidden md:block text-slate-700">•</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Step 3: Get Tailored Job Recommendations</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;
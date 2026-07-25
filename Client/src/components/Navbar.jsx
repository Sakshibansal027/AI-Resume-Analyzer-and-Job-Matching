import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles,
  UploadCloud,
  BarChart3,
  Briefcase,
  Bookmark,
  FilePlus2,
  LayoutDashboard,
  LogOut
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };


  const isActive = (path) => location.pathname === path;
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isRecruiter = storedUser?.role === "recruiter";
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 font-sans">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">

        {/* Brand Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            Resume<span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}

        <div className="flex items-center gap-1 md:gap-2 text-sm font-medium">

          {isRecruiter ? (
            <>
              <Link
                to="/recruiter-dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/recruiter-dashboard")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Jobs</span>
              </Link>

              <Link
                to="/add-job"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/add-job")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <FilePlus2 className="w-4 h-4" />
                <span>Post Job</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/upload"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/upload")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Resume</span>
              </Link>

              <Link
                to="/analysis"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/analysis")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analysis</span>
              </Link>

              <Link
                to="/jobs"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/jobs")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>

              <Link
                to="/saved-jobs"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${isActive("/saved-jobs")
                  ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Saved Jobs</span>
              </Link>
            </>
          )}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="ml-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-all cursor-pointer font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;
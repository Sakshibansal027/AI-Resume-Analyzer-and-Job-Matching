import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api.js";
import { Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    API.get(`/auth/verify-email/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification link is invalid or has expired."
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/50 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4 text-indigo-400 shadow-inner">
          <Sparkles className="w-6 h-6" />
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying your email...</h2>
            <p className="text-sm text-slate-400">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all text-sm"
            >
              Go to Sign In
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-sm text-slate-400 mb-6">{message}</p>
            <Link
              to="/"
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-sm transition-colors underline-offset-4 hover:underline"
            >
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
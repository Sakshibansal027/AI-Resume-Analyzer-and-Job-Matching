import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import {
    Briefcase,
    Building2,
    MapPin,
    DollarSign,
    Award,
    Clock,
    Code,
    FileText,
    Plus,
    X,
    Loader2,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        description: "",
        experienceLevel: "Entry Level",
        location: "",
        salary: "",
        jobType: "Full-Time",
    });

    const [skillsInput, setSkillsInput] = useState("");
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleAddSkill = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const skill = skillsInput.trim();
            if (skill && !requiredSkills.includes(skill)) {
                setRequiredSkills([...requiredSkills, skill]);
                setSkillsInput("");
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (requiredSkills.length === 0) {
            setMessage({ type: "error", text: "Please add at least one required skill." });
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const payload = {
                ...formData,
                requiredSkills,
            };

            const res = await API.post("/jobs", payload);


            setMessage({ type: "success", text: "Job posted successfully! Redirecting to dashboard..." });

            setFormData({
                title: "",
                company: "",
                description: "",
                experienceLevel: "Entry Level",
                location: "",
                salary: "",
                jobType: "Full-Time",
            });
            setRequiredSkills([]);


            setTimeout(() => {
                navigate("/recruiter-dashboard");
            }, 1500);

        } catch (error) {
            console.error(error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Something went wrong while posting the job.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">

                {/* Back Button */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        Post a New Opportunity
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">
                        Fill in the job details below to find the best candidate.
                    </p>
                </div>

                {/* Alert Messages */}
                {message.text && (
                    <div
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium ${message.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                            }`}
                    >
                        {message.type === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        <span>{message.text}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Job Title & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Job Title <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    placeholder="e.g. Senior Frontend Developer"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="company"
                                    placeholder="e.g. Google India"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Type & Experience Level */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Job Type
                            </label>
                            <div className="relative">
                                <Clock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                                >
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Experience Level
                            </label>
                            <div className="relative">
                                <Award className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
                                >
                                    <option value="Entry Level">Entry Level (0-1 yrs)</option>
                                    <option value="Mid Level">Mid Level (2-4 yrs)</option>
                                    <option value="Senior Level">Senior Level (5+ yrs)</option>
                                    <option value="Executive">Executive / Lead</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location & Salary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. Bangalore / Remote"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Salary Package
                            </label>
                            <div className="relative">
                                <DollarSign className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    name="salary"
                                    placeholder="e.g. ₹8 - ₹12 LPA or $80,000/yr"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Required Skills (Interactive Tags Input) */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Required Skills <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Code className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Type skill and press Enter or comma (e.g. React, Node.js)"
                                value={skillsInput}
                                onChange={(e) => setSkillsInput(e.target.value)}
                                onKeyDown={handleAddSkill}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                            />
                        </div>

                        {/* Display Skill Tags */}
                        {requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium rounded-lg"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-rose-400 transition"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Job Description */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                            Job Description
                        </label>
                        <div className="relative">
                            <FileText className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                            <textarea
                                name="description"
                                rows="4"
                                placeholder="Provide a detailed description of the job responsibilities and candidate expectations..."
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Posting Job...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                <span>Publish Job Post</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
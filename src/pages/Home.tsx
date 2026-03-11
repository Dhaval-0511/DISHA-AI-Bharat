import { Link } from "react-router-dom";
import { Shield, BarChart3, Brain, MapPin, Activity, ArrowRight, ChevronRight, Users, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #f1f5f9 100%)" }}>
            {/* ── NAVBAR ── */}
            <nav className="sticky top-0 z-50 border-b" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderColor: "#e2e8f0" }}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-[15px]" style={{ color: "#1e3a5f", fontFamily: "'Source Serif 4', Georgia, serif" }}>DISHA</span>
                            <span className="hidden sm:inline text-[10px] ml-2 font-medium" style={{ color: "#94a3b8" }}>National Health Intelligence Platform</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" className="font-medium text-sm h-9" style={{ color: "#475569" }}>
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button className="text-sm h-9 font-semibold shadow-sm" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
                                Sign Up <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative overflow-hidden">
                {/* Accent strip */}
                <div className="h-1 flex">
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }} />
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)" }} />
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #10b981, #059669)" }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "#e0f2fe", border: "1px solid #bae6fd" }}>
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#10b981" }} />
                                <span className="text-xs font-medium" style={{ color: "#0369a1" }}>Government of India — National Health Intelligence Initiative</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                                National Health Resource{" "}
                                <span style={{ background: "linear-gradient(135deg, #1e3a5f, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Allocation Intelligence
                                </span>
                            </h1>

                            <p className="text-base mt-5 leading-relaxed max-w-lg" style={{ color: "#64748b" }}>
                                DISHA empowers national and state health ministries to detect budget misallocation,
                                predict optimal resource distribution, and generate IAS-grade policy briefs —
                                replacing <strong style={{ color: "#334155" }}>weeks of manual analysis</strong> with minutes.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-8">
                                <Link to="/signup">
                                    <Button size="lg" className="h-12 px-6 font-semibold text-base shadow-lg" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", boxShadow: "0 8px 24px rgba(30,58,95,0.25)" }}>
                                        Get Started <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button size="lg" variant="outline" className="h-12 px-6 font-semibold text-base" style={{ borderColor: "#cbd5e1", color: "#475569" }}>
                                        Sign In to Dashboard
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right: Stats cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: "Any State", label: "Deployable Across India", icon: MapPin, bg: "linear-gradient(135deg, #eff6ff, #dbeafe)", iconColor: "#3b82f6", border: "#bfdbfe" },
                                { value: "Multi-Sector", label: "Health, Education & Beyond", icon: BarChart3, bg: "linear-gradient(135deg, #fef3c7, #fde68a)", iconColor: "#d97706", border: "#fcd34d" },
                                { value: "AWS AI", label: "Bedrock-Powered Engine", icon: Brain, bg: "linear-gradient(135deg, #f0fdf4, #dcfce7)", iconColor: "#16a34a", border: "#bbf7d0" },
                                { value: "Live", label: "Gujarat Prototype Running", icon: Activity, bg: "linear-gradient(135deg, #faf5ff, #ede9fe)", iconColor: "#7c3aed", border: "#c4b5fd" },
                            ].map(({ value, label, icon: Icon, bg, iconColor, border }) => (
                                <div key={label} className="rounded-xl p-5 border shadow-sm" style={{ background: bg, borderColor: border }}>
                                    <Icon className="w-5 h-5 mb-3" style={{ color: iconColor }} />
                                    <p className="text-2xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', serif" }}>{value}</p>
                                    <p className="text-xs mt-1" style={{ color: "#64748b" }}>{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHAT IS DISHA ── */}
            <section className="py-20" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#3b82f6" }}>What is DISHA?</p>
                        <h2 className="text-3xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                            Data Intelligence for Smart Handling of Allocation
                        </h2>
                        <p className="mt-4 leading-relaxed" style={{ color: "#64748b" }}>
                            A government-grade AI platform built for national and state health ministries. Not a citizen app. Not a chatbot.
                            A policy intelligence engine that transforms raw public health data into evidence-based, actionable decisions — scalable across any Indian state or union territory.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: BarChart3, title: "Detect Misallocation",
                                desc: "Identify districts with health budget under-allocation or over-allocation using the Allocation Efficiency Score (AES).",
                                gradient: "linear-gradient(135deg, #fff1f2, #fecdd3)", iconColor: "#e11d48", border: "#fda4af"
                            },
                            {
                                icon: Brain, title: "AI-Powered Predictions",
                                desc: "AWS Bedrock (Claude 3 Sonnet) predicts optimal health allocations based on Need Index, demographics, and historical patterns.",
                                gradient: "linear-gradient(135deg, #eff6ff, #dbeafe)", iconColor: "#2563eb", border: "#93c5fd"
                            },
                            {
                                icon: FileText, title: "Policy Briefs",
                                desc: "Generate IAS-grade executive summaries with Problem, Analysis, and Recommendation paragraphs — ready for official review.",
                                gradient: "linear-gradient(135deg, #f0fdf4, #dcfce7)", iconColor: "#16a34a", border: "#86efac"
                            },
                        ].map(({ icon: Icon, title, desc, gradient, iconColor, border }) => (
                            <div key={title} className="rounded-xl border p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300" style={{ background: gradient, borderColor: border }}>
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 shadow-sm" style={{ background: "rgba(255,255,255,0.8)" }}>
                                    <Icon className="w-5 h-5" style={{ color: iconColor }} />
                                </div>
                                <h3 className="font-semibold text-base mb-2" style={{ color: "#0f172a" }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ── */}
            <section className="py-20" style={{ background: "linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#1e3a5f" }}>Platform Capabilities</p>
                        <h2 className="text-3xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                            Everything You Need for Health Budget Intelligence
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: MapPin, title: "Multi-District Coverage", desc: "Monitor any number of districts or regions — configurable per state or ministry deployment", color: "#3b82f6" },
                            { icon: Activity, title: "Need Index Engine", desc: "Composite need score with configurable factors — poverty, infrastructure, demographics & complaints", color: "#8b5cf6" },
                            { icon: Zap, title: "Budget Simulator", desc: "Model reallocation scenarios using need-proportional logic — applicable to any sector or scheme", color: "#f59e0b" },
                            { icon: Users, title: "Role-Based Access", desc: "Admin, Analyst, and Viewer roles — designed for government hierarchy and audit accountability", color: "#10b981" },
                        ].map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="group p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300" style={{ borderColor: "#e2e8f0" }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${color}15` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <h4 className="font-semibold text-sm mb-1" style={{ color: "#0f172a" }}>{title}</h4>
                                <p className="text-xs leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-20" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: "#10b981" }}>How It Works</p>
                        <h2 className="text-3xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                            From Raw Data to Policy Action
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Upload Data", desc: "Admin uploads district master data and sector-specific budget allocation CSVs for any state or ministry", color: "#3b82f6", bg: "#eff6ff" },
                            { step: "02", title: "Compute Need Index", desc: "System calculates composite NI from poverty rate, population density, infrastructure gaps & public complaints", color: "#f59e0b", bg: "#fffbeb" },
                            { step: "03", title: "Run AI Predictions", desc: "AWS Bedrock (Claude) predicts optimal resource allocation for each administrative unit", color: "#8b5cf6", bg: "#faf5ff" },
                            { step: "04", title: "Generate Policy Briefs", desc: "AI produces IAS-grade executive summaries with Problem, Analysis & Recommendation — ready for official review", color: "#10b981", bg: "#f0fdf4" },
                        ].map(({ step, title, desc, color, bg }) => (
                            <div key={step} className="relative rounded-xl p-6 border" style={{ background: bg, borderColor: `${color}30` }}>
                                <div className="text-3xl font-bold mb-3 opacity-20" style={{ color, fontFamily: "'Source Serif 4', serif" }}>{step}</div>
                                <h4 className="font-semibold mb-2" style={{ color: "#0f172a" }}>{title}</h4>
                                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{desc}</p>
                                {step !== "04" && (
                                    <ChevronRight className="hidden md:block absolute top-6 -right-3.5 w-6 h-6" style={{ color: "#cbd5e1" }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="rounded-2xl p-10 text-center shadow-xl border" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 50%, #1e3a5f 100%)", borderColor: "#334155" }}>
                        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                            Transform How India Allocates Public Resources
                        </h2>
                        <p className="text-white/60 mb-8 max-w-lg mx-auto">
                            Built for national and state governments. Currently running a live prototype for the health sector — adaptable to any ministry, any sector, any state.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="h-12 px-8 font-semibold text-base shadow-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "#fff" }}>
                                    Create Account <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button size="lg" variant="outline" className="h-12 px-8 font-semibold border-white/20 text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0" }}>
                <div className="h-0.5 flex">
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }} />
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)" }} />
                    <div className="flex-1" style={{ background: "linear-gradient(90deg, #10b981, #059669)" }} />
                </div>
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" style={{ color: "#1e3a5f" }} />
                        <span className="text-xs" style={{ color: "#64748b" }}>DISHA — Data Intelligence for Smart Handling of Allocation | National Health Initiative</span>
                    </div>
                    <div className="text-xs" style={{ color: "#94a3b8" }}>
                        Prototype Demo: Gujarat Health Sector • Powered by AWS Bedrock AI
                    </div>
                </div>
            </footer>
        </div>
    );
}

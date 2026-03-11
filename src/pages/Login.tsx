import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, ArrowRight, BarChart3, Brain, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("admin@disha.gov.in");
  const [password, setPassword] = useState("Admin@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAppStore(s => s.login);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast({ title: "Welcome to DISHA", description: "Login successful" });
      navigate("/dashboard");
    } else {
      toast({ title: "Login Failed", description: result.error, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #eef2f7 100%)" }}>
      {/* Navbar */}
      <nav className="border-b" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderColor: "#e2e8f0" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[15px]" style={{ color: "#1e3a5f", fontFamily: "'Source Serif 4', Georgia, serif" }}>DISHA</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm" style={{ color: "#64748b" }}>Don't have an account?</span>
            <Link to="/signup">
              <Button size="sm" className="font-medium shadow-sm" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Accent strip */}
      <div className="h-0.5 flex">
        <div className="flex-1" style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }} />
        <div className="flex-1" style={{ background: "linear-gradient(90deg, #3b82f6, #2563eb)" }} />
        <div className="flex-1" style={{ background: "linear-gradient(90deg, #10b981, #059669)" }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border p-8 shadow-xl" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
            <div className="mb-7">
              <h1 className="text-2xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Sign in to DISHA
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748b" }}>National Health Intelligence Platform — Prototype: Gujarat Health Sector</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@disha.gov.in"
                  className="h-11"
                  style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pr-10"
                    style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#94a3b8" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-sm shadow-lg"
                disabled={loading}
                style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", boxShadow: "0 6px 20px rgba(30,58,95,0.25)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </form>

            <div className="text-center mt-5">
              <span className="text-sm" style={{ color: "#64748b" }}>New to DISHA? </span>
              <Link to="/signup" className="text-sm font-medium hover:underline" style={{ color: "#2563eb" }}>
                Create an account
              </Link>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl p-4 border" style={{ background: "rgba(255,255,255,0.7)", borderColor: "#e2e8f0" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "#94a3b8" }}>
              Demo Credentials — <span style={{ color: "#3b82f6" }}>click any row to auto-fill</span>
            </p>
            <div className="space-y-1.5 text-xs font-mono">
              {[
                { role: "Admin",   email: "admin@disha.gov.in",    pass: "Admin@123",   color: "#f59e0b" },
                { role: "Analyst", email: "rajesh.k@disha.gov.in", pass: "Analyst@123", color: "#3b82f6" },
                { role: "Viewer",  email: "vikram.s@disha.gov.in", pass: "Viewer@123",  color: "#64748b" },
              ].map(c => (
                <div
                  key={c.role}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f0f7ff")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => { setEmail(c.email); setPassword(c.pass); }}
                  title={`Click to fill: ${c.email} / ${c.pass}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="w-14 font-medium">{c.role}</span>
                  <span>{c.email} / {c.pass}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-center mt-5" style={{ color: "#94a3b8" }}>
            Government of India · Authorized personnel only · Powered by AWS Bedrock
          </p>
        </div>
      </div>
    </div>
  );
}

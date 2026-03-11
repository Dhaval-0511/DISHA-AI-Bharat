import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Role } from "@/types";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<Role>("ANALYST");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const addUser = useAppStore(s => s.addUser);
    const users = useAppStore(s => s.users);
    const navigate = useNavigate();
    const { toast } = useToast();

    const passwordValid = password.length >= 6;
    const passwordsMatch = password === confirmPassword && password.length > 0;
    const emailValid = email.includes("@") && email.includes(".");

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { toast({ title: "Name Required", variant: "destructive" }); return; }
        if (!emailValid) { toast({ title: "Invalid Email", variant: "destructive" }); return; }
        if (!passwordValid) { toast({ title: "Weak Password", description: "Minimum 6 characters", variant: "destructive" }); return; }
        if (!passwordsMatch) { toast({ title: "Password Mismatch", variant: "destructive" }); return; }
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            toast({ title: "Email Exists", variant: "destructive" }); return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        addUser({ id: `u${Date.now()}`, name: name.trim(), email: email.trim(), password, role, status: "Active", createdAt: new Date().toISOString() });
        setLoading(false);
        setDone(true);
        toast({ title: "Account Created" });
    };

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 50%, #eef2f7 100%)" }}>
                <div className="text-center max-w-sm rounded-2xl border p-10 shadow-xl" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "#dcfce7" }}>
                        <CheckCircle className="w-8 h-8" style={{ color: "#16a34a" }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>Account Created!</h2>
                    <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                        Your DISHA account for <strong style={{ color: "#334155" }}>{email}</strong> has been created as <strong style={{ color: "#334155" }}>{role}</strong>.
                    </p>
                    <Link to="/login">
                        <Button size="lg" className="w-full h-11 font-semibold shadow-lg" style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)" }}>
                            Sign In Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link to="/" className="block mt-3 text-sm transition-colors" style={{ color: "#94a3b8" }}>← Back to Home</Link>
                </div>
            </div>
        );
    }

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
                        <span className="text-sm" style={{ color: "#64748b" }}>Already have an account?</span>
                        <Link to="/login">
                            <Button variant="outline" size="sm" className="font-medium" style={{ borderColor: "#cbd5e1", color: "#475569" }}>Sign In</Button>
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

            {/* Form */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border p-8 shadow-xl" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                        <div className="mb-7">
                            <h1 className="text-2xl font-bold" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>Create your account</h1>
                            <p className="text-sm mt-1" style={{ color: "#64748b" }}>Join DISHA — National Health Intelligence Platform</p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Full Name</label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Rajesh Kumar" className="h-11" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Email Address</label>
                                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@disha.gov.in" className="h-11" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                                {email && !emailValid && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Please enter a valid email</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Role</label>
                                <Select value={role} onValueChange={v => setRole(v as Role)}>
                                    <SelectTrigger className="h-11" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#f59e0b" }} />Admin — Full access</span></SelectItem>
                                        <SelectItem value="ANALYST"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3b82f6" }} />Analyst — Analysis & predictions</span></SelectItem>
                                        <SelectItem value="VIEWER"><span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#64748b" }} />Viewer — Read-only</span></SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Password</label>
                                <div className="relative">
                                    <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="h-11 pr-10" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {password && !passwordValid && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Minimum 6 characters</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1.5 block" style={{ color: "#334155" }}>Confirm Password</label>
                                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="h-11" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                                {confirmPassword && !passwordsMatch && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>Passwords do not match</p>}
                                {confirmPassword && passwordsMatch && <p className="text-xs mt-1" style={{ color: "#16a34a" }}>✓ Passwords match</p>}
                            </div>

                            <Button type="submit" className="w-full h-11 font-semibold text-sm shadow-lg" disabled={loading} style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)", boxShadow: "0 6px 20px rgba(30,58,95,0.25)" }}>
                                {loading ? (
                                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account...</span>
                                ) : (
                                    <>Create Account <ArrowRight className="w-4 h-4 ml-1" /></>
                                )}
                            </Button>
                        </form>

                        <div className="text-center mt-5">
                            <span className="text-sm" style={{ color: "#64748b" }}>Already have an account? </span>
                            <Link to="/login" className="text-sm font-medium hover:underline" style={{ color: "#2563eb" }}>Sign In</Link>
                        </div>
                    </div>

                    <p className="text-[10px] text-center mt-5" style={{ color: "#94a3b8" }}>
                        Government of India · Authorized government use only · Powered by AWS Bedrock AI
                    </p>
                </div>
            </div>
        </div>
    );
}

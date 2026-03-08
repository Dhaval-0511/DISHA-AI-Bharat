import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("priya.sharma@gov.in");
  const [password, setPassword] = useState("admin123");
  const login = useAppStore(s => s.login);
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const navigate = useNavigate();

  // If already logged in, go straight to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ id: "u1", name: "Dr. Priya Sharma", email, role: "ADMIN" });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold">DISHA</h1>
          <p className="text-sm text-muted-foreground mt-1">Data Intelligence for Smart Handling of Allocation</p>
        </div>
        <form onSubmit={handleLogin} className="bg-card rounded-lg border p-6 space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1" />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
          <p className="text-[10px] text-center text-muted-foreground">Government of India — Ministry of Finance</p>
        </form>
      </div>
    </div>
  );
}


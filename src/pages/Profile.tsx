import { useAppStore } from "@/store/appStore";
import { Shield, Mail, Calendar, Clock } from "lucide-react";

export default function Profile() {
    const { user } = useAppStore();
    if (!user) return null;

    const roleColor: Record<string, { bg: string; text: string; dot: string }> = {
        ADMIN: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
        ANALYST: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
        VIEWER: { bg: "#f1f5f9", text: "#475569", dot: "#64748b" },
    };
    const rc = roleColor[user.role];

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6" style={{ color: "#0f172a", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                My Profile
            </h1>

            <div className="rounded-xl border p-6" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
                {/* Avatar + name */}
                <div className="flex items-center gap-4 pb-6 border-b" style={{ borderColor: "#f1f5f9" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
                        style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}
                    >
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold" style={{ color: "#0f172a" }}>{user.name}</h2>
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold mt-1"
                            style={{ background: rc.bg, color: rc.text }}
                        >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rc.dot }} />
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Details */}
                <div className="grid gap-4 pt-5">
                    {[
                        { icon: Mail, label: "Email", value: user.email },
                        { icon: Shield, label: "Role", value: user.role === "ADMIN" ? "Administrator — Full Access" : user.role === "ANALYST" ? "Analyst — Analysis & Predictions" : "Viewer — Read Only" },
                        { icon: Calendar, label: "Account Created", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                        { icon: Clock, label: "Status", value: user.status || "Active" },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#f1f5f9" }}>
                                <Icon className="w-4 h-4" style={{ color: "#64748b" }} />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "#94a3b8" }}>{label}</p>
                                <p className="text-sm font-medium mt-0.5" style={{ color: "#1e293b" }}>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

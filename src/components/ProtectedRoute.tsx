import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import type { Role } from "@/types";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

function AccessDenied() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="font-serif text-2xl font-bold mb-2">403 — Access Denied</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    You don't have permission to access this page. Contact your administrator to request access.
                </p>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
            </div>
        </div>
    );
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const isAuthenticated = useAppStore(s => s.isAuthenticated);
    const user = useAppStore(s => s.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <AccessDenied />;
    }

    return <>{children}</>;
}

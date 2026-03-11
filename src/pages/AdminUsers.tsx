import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserX, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Role } from "@/types";

export default function AdminUsers() {
  const { users, addUser, updateUserRole, toggleUserStatus } = useAppStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<Role>("ANALYST");

  const handleAddUser = () => {
    if (!newName || !newEmail || !newPassword) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" }); return;
    }
    if (users.find(u => u.email.toLowerCase() === newEmail.toLowerCase())) {
      toast({ title: "Error", description: "Email already exists", variant: "destructive" }); return;
    }
    addUser({ id: `u${Date.now()}`, name: newName, email: newEmail, password: newPassword, role: newRole, status: "Active", createdAt: new Date().toISOString() });
    setOpen(false);
    setNewName(""); setNewEmail(""); setNewPassword(""); setNewRole("ANALYST");
    toast({ title: "User Created", description: `${newName} has been added as ${newRole}.` });
  };

  const roleStyle: Record<string, { bg: string; text: string; dot: string }> = {
    ADMIN:   { bg: "#fffbeb", text: "#92400e", dot: "#f59e0b" },
    ANALYST: { bg: "#eff6ff", text: "#1e40af", dot: "#3b82f6" },
    VIEWER:  { bg: "#f8fafc", text: "#475569", dot: "#94a3b8" },
  };

  return (
    <AppLayout>
      <PageHeader title="User Management" subtitle="Manage DISHA platform access and roles — Admin only">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-medium" style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
              <Plus className="w-4 h-4 mr-1.5" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {[
                { label: "Full Name", value: newName, set: setNewName, type: "text", placeholder: "Dr. Name" },
                { label: "Email", value: newEmail, set: setNewEmail, type: "email", placeholder: "name@disha.gov.in" },
                { label: "Password", value: newPassword, set: setNewPassword, type: "password", placeholder: "••••••••" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "#64748b" }}>{f.label}</label>
                  <Input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                    style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "#64748b" }}>Role</label>
                <Select value={newRole} onValueChange={v => setNewRole(v as Role)}>
                  <SelectTrigger style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="ANALYST">Analyst</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full font-semibold" onClick={handleAddUser}
                style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#fff", borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #f1f5f9" }}>
                {["User", "Email", "Role", "Created", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const rs = roleStyle[u.role];
                return (
                  <tr key={u.id}
                    style={{
                      opacity: u.status === "Inactive" ? 0.55 : 1,
                      borderBottom: idx < users.length - 1 ? "1px solid #f8fafc" : "none",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "11px 16px" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "linear-gradient(135deg, #1e3a5f, #2d5a8e)" }}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-semibold" style={{ color: "#1e293b" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px", color: "#64748b", fontSize: 13 }}>{u.email}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <Select value={u.role} onValueChange={v => { updateUserRole(u.id, v as Role); toast({ title: "Role Updated" }); }}>
                        <SelectTrigger className="w-28 h-7 border-0 p-0 shadow-none focus:ring-0 bg-transparent">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: rs.bg, color: rs.text }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rs.dot }} />
                            {u.role}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          <SelectItem value="ANALYST">Analyst</SelectItem>
                          <SelectItem value="VIEWER">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td style={{ padding: "11px 16px", color: "#94a3b8", fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={u.status === "Active"
                          ? { background: "#f0fdf4", color: "#16a34a" }
                          : { background: "#fef2f2", color: "#dc2626" }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: u.status === "Active" ? "#22c55e" : "#ef4444" }} />
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs font-medium"
                        onClick={() => { toggleUserStatus(u.id); toast({ title: u.status === "Active" ? "User Deactivated" : "User Reactivated" }); }}
                        style={{ color: u.status === "Active" ? "#dc2626" : "#16a34a" }}>
                        {u.status === "Active"
                          ? <><UserX className="w-3.5 h-3.5 mr-1" /> Deactivate</>
                          : <><UserCheck className="w-3.5 h-3.5 mr-1" /> Reactivate</>}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

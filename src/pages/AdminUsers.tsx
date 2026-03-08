import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/shared/DataWidgets";
import { Badge } from "@/components/ui/badge";

const users = [
  { id: "u1", name: "Dr. Priya Sharma", email: "priya.sharma@gov.in", role: "ADMIN", status: "Active" },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh.k@gov.in", role: "ANALYST", status: "Active" },
  { id: "u3", name: "Anita Desai", email: "anita.d@gov.in", role: "ANALYST", status: "Active" },
  { id: "u4", name: "Vikram Singh", email: "vikram.s@gov.in", role: "VIEWER", status: "Active" },
  { id: "u5", name: "Meera Patel", email: "meera.p@gov.in", role: "VIEWER", status: "Inactive" },
];

export default function AdminUsers() {
  return (
    <AppLayout>
      <PageHeader title="User Management" subtitle="Manage system users and access roles" />
      <div className="bg-card rounded-lg border overflow-auto">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-muted-foreground">{u.email}</td>
                <td>
                  <span className={`govt-badge ${u.role === "ADMIN" ? "bg-primary/10 text-primary" : u.role === "ANALYST" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <span className={`govt-badge ${u.status === "Active" ? "status-optimal" : "status-under"}`}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

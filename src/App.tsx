import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Districts from "./pages/Districts";
import DistrictDetail from "./pages/DistrictDetail";
import Allocations from "./pages/Allocations";
import NeedIndexPage from "./pages/NeedIndexPage";
import Predictions from "./pages/Predictions";
import Simulator from "./pages/Simulator";
import Summaries from "./pages/Summaries";
import SettingsPage from "./pages/SettingsPage";
import DataUpload from "./pages/DataUpload";
import AdminUsers from "./pages/AdminUsers";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/districts" element={<ProtectedRoute><Districts /></ProtectedRoute>} />
          <Route path="/districts/:id" element={<ProtectedRoute><DistrictDetail /></ProtectedRoute>} />
          <Route path="/allocations" element={<ProtectedRoute><Allocations /></ProtectedRoute>} />
          <Route path="/need-index" element={<ProtectedRoute><NeedIndexPage /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute allowedRoles={["ADMIN", "ANALYST"]}><Simulator /></ProtectedRoute>} />
          <Route path="/summaries" element={<ProtectedRoute><Summaries /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["ADMIN"]}><SettingsPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute allowedRoles={["ADMIN"]}><DataUpload /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

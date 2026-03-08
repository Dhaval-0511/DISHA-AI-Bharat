import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
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
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/districts" element={<ProtectedRoute><Districts /></ProtectedRoute>} />
          <Route path="/districts/:id" element={<ProtectedRoute><DistrictDetail /></ProtectedRoute>} />
          <Route path="/allocations" element={<ProtectedRoute><Allocations /></ProtectedRoute>} />
          <Route path="/need-index" element={<ProtectedRoute><NeedIndexPage /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
          <Route path="/summaries" element={<ProtectedRoute><Summaries /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><DataUpload /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

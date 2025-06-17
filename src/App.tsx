import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CycleInsightsProvider } from "@/contexts/CycleInsightsContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardCalendar from "./pages/DashboardCalendar";
import DashboardInsights from "./pages/DashboardInsights";
import Log from "./pages/Log";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Premium from "./pages/Premium";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CycleInsightsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/calendar" element={
                <ProtectedRoute>
                  <DashboardCalendar />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/insights" element={
                <ProtectedRoute>
                  <DashboardInsights />
                </ProtectedRoute>
              } />
              <Route path="/log" element={
                <ProtectedRoute>
                  <Log />
                </ProtectedRoute>
              } />
              <Route path="/premium" element={
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CycleInsightsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

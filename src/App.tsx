import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import DiseasePredictor from "./pages/DiseasePredictor";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import DoctorPanel from "./pages/DoctorPanel";
import HealthRecords from "./pages/HealthRecords";
import AdminPanel from "./pages/AdminPanel";
import FitnessTrainer from "./pages/FitnessTrainer";
import GymTraining from "./pages/GymTraining";
import RiskPlanner from "./pages/RiskPlanner";
import AccountManager from "./pages/AccountManager";
import NotFound from "./pages/NotFound";
import Risk from "./pages/Risk";
import Trainer from "./pages/Trainer";
import Diet from "./pages/Diet";
import Chat from "./pages/Chat";
import Ocr from "./pages/Ocr";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import HealthForm from "./pages/HealthForm";
import LearnExerciseAI from "./pages/LearnExerciseAI";
import MealPlanner from "./pages/MealPlanner";
import DiseaseMetrics from "./pages/DiseaseMetrics";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientRecords from "./pages/PatientRecords";
import AIChatbot from "./pages/AIChatbot";

const queryClient = new QueryClient();

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredRole?: "admin" | "doctor" | "patient" | null;
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return element;
};

// App component now uses BrowserRouter outside of AuthProvider
const AppWithAuth = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/disease-predictor" element={<DiseasePredictor />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<Login />} />
    <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
    <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
    <Route path="/doctor-panel" element={<ProtectedRoute element={<DoctorPanel />} requiredRole="doctor" />} />
    <Route path="/health-records" element={<ProtectedRoute element={<HealthRecords />} />} />
    <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} requiredRole="admin" />} />
    <Route path="/fitness-trainer" element={<ProtectedRoute element={<FitnessTrainer />} />} />
    <Route path="/gym-training" element={<ProtectedRoute element={<GymTraining />} />} />
    <Route path="/risk-planner" element={<ProtectedRoute element={<RiskPlanner />} />} />
    <Route path="/account" element={<ProtectedRoute element={<AccountManager />} />} />
    <Route path="/risk" element={<ProtectedRoute element={<Risk />} />} />
    <Route path="/trainer" element={<ProtectedRoute element={<Trainer />} />} />
    <Route path="/diet" element={<ProtectedRoute element={<Diet />} />} />
    <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
    <Route path="/ocr" element={<ProtectedRoute element={<Ocr />} />} />
    <Route path="/health-form" element={<ProtectedRoute element={<HealthForm />} />} />
    <Route path="/learn-exercise-ai" element={<LearnExerciseAI />} />
    <Route path="/meal-planner" element={<MealPlanner />} />
    <Route path="/disease-metrics" element={<DiseaseMetrics />} />
    <Route path="/about" element={<About />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/auth/callback" element={<Login />} />
    <Route path="/doctor" element={<ProtectedRoute element={<DoctorDashboard />} requiredRole="doctor" />} />
    <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
    <Route path="/patient-records" element={<ProtectedRoute element={<PatientRecords />} requiredRole="doctor" />} />
    <Route path="/ai-chatbot" element={<ProtectedRoute element={<AIChatbot />} />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppWithAuth />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

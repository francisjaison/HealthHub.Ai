import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const DoctorPanel = lazy(() => import("./pages/DoctorPanel"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const FitnessTrainer = lazy(() => import("./pages/FitnessTrainer"));
const GymTraining = lazy(() => import("./pages/GymTraining"));
const HealthRecords = lazy(() => import("./pages/HealthRecords"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RiskPlanner = lazy(() => import("./pages/RiskPlanner"));
const AccountManager = lazy(() => import("./pages/AccountManager"));
const Risk = lazy(() => import("./pages/Risk"));
const Trainer = lazy(() => import("./pages/Trainer"));
const Diet = lazy(() => import("./pages/Diet"));
const Chat = lazy(() => import("./pages/Chat"));
const DiseasePredictor = lazy(() => import("./pages/DiseasePredictor"));
const LearnExerciseAI = lazy(() => import("./pages/LearnExerciseAI"));
const MealPlanner = lazy(() => import("./pages/MealPlanner"));
const Ocr = lazy(() => import("./pages/Ocr"));
const DiseaseMetrics = lazy(() => import("./pages/DiseaseMetrics"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PatientRecords = lazy(() => import("./pages/PatientRecords"));
const HealthForm = lazy(() => import("./pages/HealthForm"));
const HealthAssessment = lazy(() => import("./pages/HealthAssessment"));

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: "user" | "doctor" | "admin";
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has required role (if specified)
  if (requiredRole && user?.role !== requiredRole) {
    // Different redirects based on role
    if (user?.role === "admin") {
      return <Navigate to="/admin-dashboard" />;
    } else if (user?.role === "doctor") {
      return <Navigate to="/doctor" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{element}</>;
};

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="disease-predictor" element={<DiseasePredictor />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="dashboard/login" element={<Navigate to="/login" />} />
      <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="doctor-panel" element={<ProtectedRoute element={<DoctorPanel />} requiredRole="doctor" />} />
      <Route path="health-records" element={<ProtectedRoute element={<HealthRecords />} />} />
      <Route path="admin" element={<ProtectedRoute element={<AdminPanel />} requiredRole="admin" />} />
      <Route path="fitness-trainer" element={<ProtectedRoute element={<FitnessTrainer />} />} />
      <Route path="gym-training" element={<ProtectedRoute element={<GymTraining />} />} />
      <Route path="risk-planner" element={<ProtectedRoute element={<RiskPlanner />} />} />
      <Route path="account" element={<ProtectedRoute element={<AccountManager />} />} />
      <Route path="risk" element={<ProtectedRoute element={<Risk />} />} />
      <Route path="trainer" element={<ProtectedRoute element={<Trainer />} />} />
      <Route path="diet" element={<ProtectedRoute element={<Diet />} />} />
      <Route path="chat" element={<ProtectedRoute element={<Chat />} />} />
      <Route path="ocr" element={<ProtectedRoute element={<Ocr />} />} />
      <Route path="ocr/login" element={<Navigate to="/login" />} />
      <Route path="health-form" element={<ProtectedRoute element={<HealthForm />} />} />
      <Route path="health-assessment" element={<ProtectedRoute element={<HealthAssessment />} />} />
      <Route path="learn-exercise-ai" element={<LearnExerciseAI />} />
      <Route path="meal-planner" element={<MealPlanner />} />
      <Route path="disease-metrics" element={<DiseaseMetrics />} />
      <Route path="about" element={<About />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="contact" element={<Contact />} />
      <Route path="auth/callback" element={<Login />} />
      <Route path="doctor" element={<ProtectedRoute element={<DoctorDashboard />} requiredRole="doctor" />} />
      <Route path="admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
      <Route path="patient-records" element={<ProtectedRoute element={<PatientRecords />} requiredRole="doctor" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const AppWrapper = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <AuthProvider>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
              <App />
              <Toaster />
              <Sonner />
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default AppWrapper;

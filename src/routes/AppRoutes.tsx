import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';
import AdminPanel from '@/pages/AdminPanel';
import DoctorPanel from '@/pages/DoctorPanel';
import TestLogin from '@/pages/TestLogin';
import LinkTest from '@/pages/LinkTest';
import ImportTest from '@/pages/ImportTest';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  // Wrap private routes that require authentication
  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  // Admin-only route
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
  };

  // Doctor-only route
  const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    return user?.role === 'doctor' ? <>{children}</> : <Navigate to="/dashboard" />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/link-test" element={<LinkTest />} />
      <Route path="/import-test" element={<ImportTest />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Private routes with AI Chat */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/dashboard#ai-chat" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      
      {/* Role-specific routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      <Route path="/doctor" element={
        <DoctorRoute>
          <DoctorPanel />
        </DoctorRoute>
      } />

      {/* Legacy paths for backward compatibility */}
      <Route path="/admin-dashboard" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      <Route path="/doctor-dashboard" element={
        <DoctorRoute>
          <DoctorPanel />
        </DoctorRoute>
      } />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 
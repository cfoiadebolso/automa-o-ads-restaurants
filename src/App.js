import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardOverview from './components/Dashboard/DashboardOverview';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import MenuManager from './components/Menus/MenuManager';
import CampaignManager from './components/Campaigns/CampaignManager';
import BillingManager from './components/Billing/BillingManager';
import SettingsManager from './components/Settings/SettingsManager';
import { useAuth } from './hooks/useAuth';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Landing Pages Component (placeholder)
const LandingPages = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Landing Pages</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Funcionalidade de Landing Pages em desenvolvimento...</p>
      </div>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterForm />
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingFlow />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="menus" element={<MenuManager />} />
        <Route path="campaigns" element={<CampaignManager />} />
        <Route path="landing-pages" element={<LandingPages />} />
        <Route path="billing" element={<BillingManager />} />
        <Route path="settings" element={<SettingsManager />} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

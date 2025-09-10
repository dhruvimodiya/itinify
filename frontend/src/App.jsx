import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import RegistrationSuccess from './components/RegistrationSuccess';
import VerificationHandler from './components/VerificationHandler';
import ResendVerification from './components/ResendVerification';
import GoogleAuthCallback from './components/GoogleAuthCallback';
import CompleteProfile from './components/CompleteProfile';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

// Page Components
import DashboardOverview from './pages/DashboardOverview';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import ItineraryPage from './pages/ItineraryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/registration-success" element={<RegistrationSuccess />} />
            <Route path="/verify-email" element={<VerificationHandler />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
            
            {/* Semi-Protected Route - Complete Profile */}
            <Route 
              path="/complete-profile" 
              element={
                <ProtectedRoute>
                  <CompleteProfile />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes with Layout */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              } 
            >
              {/* Nested routes within the dashboard layout */}
              <Route index element={<DashboardOverview />} />
              <Route path="trips" element={<TripsPage />} />
              <Route path="trips/create" element={<TripsPage />} />
              <Route path="trips/upcoming" element={<TripsPage />} />
              <Route path="trips/ongoing" element={<TripsPage />} />
              <Route path="trips/completed" element={<TripsPage />} />
              <Route path="itinerary" element={<ItineraryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              
              {/* Placeholder routes for future features */}
              <Route path="expenses" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900">Expenses Module Coming Soon</h2></div>} />
              <Route path="analytics" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900">Analytics Module Coming Soon</h2></div>} />
              <Route path="help" element={<div className="p-8 text-center"><h2 className="text-2xl font-bold text-gray-900">Help & Support Coming Soon</h2></div>} />
            </Route>
            
            {/* Standalone itinerary route outside of dashboard layout */}
            <Route 
              path="/itinerary/:tripId" 
              element={
                <ProtectedRoute>
                  <ItineraryPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route - Redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Catch all unknown routes */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

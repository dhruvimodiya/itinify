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
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
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

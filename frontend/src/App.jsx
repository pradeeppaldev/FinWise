import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPage from './pages/auth/VerifyPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TestPage from './pages/TestPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Test route */}
            <Route path="/test" element={<TestPage />} />

            {/* Public routes using MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
            </Route>

            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="verify" element={<VerifyPage />} />
              <Route path="forgot" element={<ForgotPasswordPage />} />
              <Route path="reset" element={<ResetPasswordPage />} />
            </Route>

            {/* Protected dashboard route: render MainLayout when authenticated, with Dashboard nested */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
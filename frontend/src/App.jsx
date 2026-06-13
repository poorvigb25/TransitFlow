import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages import
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PassengerDashboard from './pages/PassengerDashboard';
import LiveMapPage from './pages/LiveMapPage';
import MetroCrowdPage from './pages/MetroCrowdPage';
import MetroCoachPage from './pages/MetroCoachPage';
import BusCrowdPage from './pages/BusCrowdPage';
import CrowdAnalyticsPage from './pages/CrowdAnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <ErrorBoundary>
            <Routes>
              {/* Public Entry Points */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Commuter Pages (Passenger & Admin Roles) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><PassengerDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/live-map"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><LiveMapPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/metro-crowd"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><MetroCrowdPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/metro-coach"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><MetroCoachPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bus-crowd"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><BusCrowdPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><CrowdAnalyticsPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><NotificationsPage /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['passenger', 'admin']}>
                  <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Restricted Operational Overrides Panel (Admin Role Only) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              }
            />
            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ErrorBoundary>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

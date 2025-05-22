import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HabitForm from './pages/HabitForm';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AboutUsContact from './components/AboutUsContact';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* HomePage Route */}
        <Route path="/" element={<HomePage />} />

        {/* Login and Signup Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about-us-contact" element={<AboutUsContact />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/habits/new"
          element={<PrivateRoute><HabitForm /></PrivateRoute>}
        />
        <Route
          path="/habits/:id/edit"
          element={<PrivateRoute><HabitForm /></PrivateRoute>}
        />
      </Routes>
    </AuthProvider>
  );
}

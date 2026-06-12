import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadScan from './pages/UploadScan';
import ReportAnalysis from './pages/ReportAnalysis';
import ReportView from './pages/ReportView';
import Trends from './pages/Trends';
import Family from './pages/Family';
import Auth from './pages/Auth';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ModalProvider } from './context/ModalContext';

// Settings Pages
import SettingsMenu from './pages/settings/SettingsMenu';
import MyProfile from './pages/settings/MyProfile';
import LanguageSettings from './pages/settings/LanguageSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import NotificationSettings from './pages/settings/NotificationSettings';
import AppearanceSettings from './pages/settings/AppearanceSettings';
import HelpSupport from './pages/settings/HelpSupport';
import SignOut from './pages/settings/SignOut';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ModalProvider>
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadScan />} />
              <Route path="/reports" element={<ReportAnalysis />} />
              <Route path="/reports/:id" element={<ReportView />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/family" element={<Family />} />
              
              {/* Nested Settings Routes */}
              <Route path="/settings" element={<SettingsMenu />} />
              <Route path="/settings/profile" element={<MyProfile />} />
              <Route path="/settings/language" element={<LanguageSettings />} />
              <Route path="/settings/security" element={<SecuritySettings />} />
              <Route path="/settings/notifications" element={<NotificationSettings />} />
              <Route path="/settings/appearance" element={<AppearanceSettings />} />
              <Route path="/settings/help" element={<HelpSupport />} />
              <Route path="/settings/signout" element={<SignOut />} />
            </Route>
            </Routes>
          </ModalProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

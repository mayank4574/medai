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
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

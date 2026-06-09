import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Loader2, ShieldCheck, Laptop, Smartphone, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, enable2FA, verify2FA, disable2FA, getSessions, logoutSession } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function SecuritySettings() {
  const { user, loginUser } = useAuth();
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.isTwoFactorEnabled || false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [toggling2FA, setToggling2FA] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await getSessions();
      setSessions(res.data);
    } catch (error) {
      console.error('Failed to fetch sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleLogoutSession = async (id) => {
    try {
      await logoutSession(id);
      setSessions(sessions.filter(s => s.id !== id));
      toast.success('Session logged out');
    } catch (err) {
      toast.error('Failed to logout session');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      // updateProfile now correctly sends currentPassword and newPassword
      await updateProfile({ 
        currentPassword: currentPassword, 
        newPassword: newPassword 
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    setToggling2FA(true);
    try {
      const res = await enable2FA();
      toast.success(res.data.message);
      setShowOtpInput(true);
    } catch (err) {
      toast.error('Failed to request OTP');
    } finally {
      setToggling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (otp.length !== 6) {
      toast.error('Enter a valid 6-digit OTP');
      return;
    }
    setToggling2FA(true);
    try {
      const res = await verify2FA({ otp });
      setIs2FAEnabled(true);
      setShowOtpInput(false);
      loginUser({ ...user, isTwoFactorEnabled: true, token: user.token });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setToggling2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    setToggling2FA(true);
    try {
      const res = await disable2FA();
      setIs2FAEnabled(false);
      loginUser({ ...user, isTwoFactorEnabled: false, token: user.token });
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to disable 2FA');
    } finally {
      setToggling2FA(false);
    }
  };

  const Toggle = ({ enabled, onClick }) => (
    <button 
      onClick={onClick}
      disabled={toggling2FA}
      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer disabled:opacity-50 ${enabled ? 'bg-[#005a8d]' : 'bg-slate-200'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-4 mb-6 px-2">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Security</h1>
      </div>

      <div className="space-y-6">
        {/* Change Password Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Change Password</h2>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Current Password</p>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 pr-10 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">New Password</p>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 pr-10 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Confirm New Password</p>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 pr-10 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
            >
              {updatingPassword && <Loader2 size={18} className="animate-spin" />}
              {updatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Two-Factor Authentication (2FA)</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Add an extra layer of security to your account.</p>

          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">2FA Status</p>
                <p className={`text-xs font-bold ${is2FAEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>{is2FAEnabled ? 'On' : 'Off'}</p>
              </div>
            </div>
            <Toggle 
              enabled={is2FAEnabled} 
              onClick={() => {
                if (is2FAEnabled) handleDisable2FA();
                else handleEnable2FA();
              }} 
            />
          </div>

          {showOtpInput && !is2FAEnabled && (
            <div className="mt-4 p-4 border border-[#005a8d]/20 bg-blue-50 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-xs text-[#005a8d] font-semibold mb-3">Check your server console for the simulated OTP code.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit OTP"
                  className="flex-1 bg-white border border-[#005a8d]/30 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-[#005a8d]"
                />
                <button
                  onClick={handleVerify2FA}
                  disabled={otp.length !== 6 || toggling2FA}
                  className="bg-[#005a8d] hover:bg-[#004a75] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Active Sessions</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Devices currently logged into your account.</p>

          {loadingSessions ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
          ) : (
            <div className="space-y-4">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600 shrink-0">
                      {session.device.toLowerCase().includes('mobile') ? <Smartphone size={18} /> : 
                       session.device.toLowerCase().includes('mac') || session.device.toLowerCase().includes('win') ? <Laptop size={18} /> : 
                       <Globe size={18} />}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">{session.device.split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {session.ip} • {session.isCurrent ? 'Current Session' : `Last active: ${new Date(session.lastActive).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button 
                      onClick={() => handleLogoutSession(session.id)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
                    >
                      Logout
                    </button>
                  )}
                  {session.isCurrent && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded shrink-0">Active</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

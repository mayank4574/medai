import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateNotifications } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function NotificationSettings() {
  const { settings, updateSettingsState } = useAuth();
  const [saving, setSaving] = useState(false);

  // Local state initialized from context
  const [emailPrefs, setEmailPrefs] = useState({
    accountUpdates: true,
    securityAlerts: true,
    newsUpdates: false
  });

  const [pushPrefs, setPushPrefs] = useState({
    generalAlerts: true,
    reminders: true,
    marketing: false
  });

  useEffect(() => {
    if (settings?.notifications) {
      if (settings.notifications.email) setEmailPrefs(settings.notifications.email);
      if (settings.notifications.push) setPushPrefs(settings.notifications.push);
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { email: emailPrefs, push: pushPrefs };
      const res = await updateNotifications(payload);
      updateSettingsState(res.data);
      toast.success('Notification preferences saved');
    } catch (err) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ enabled, onClick }) => (
    <button 
      onClick={onClick}
      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer shrink-0 ${enabled ? 'bg-[#005a8d]' : 'bg-slate-200'}`}
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
        <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">Email Notifications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">Account Updates</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive updates about your account activity</p>
              </div>
              <Toggle enabled={emailPrefs.accountUpdates} onClick={() => setEmailPrefs(p => ({ ...p, accountUpdates: !p.accountUpdates }))} />
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">Security Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Get notified about security events</p>
              </div>
              <Toggle enabled={emailPrefs.securityAlerts} onClick={() => setEmailPrefs(p => ({ ...p, securityAlerts: !p.securityAlerts }))} />
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">News & Updates</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive product updates and news</p>
              </div>
              <Toggle enabled={emailPrefs.newsUpdates} onClick={() => setEmailPrefs(p => ({ ...p, newsUpdates: !p.newsUpdates }))} />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-900">Push Notifications</h2>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">General Alerts</p>
                <p className="text-xs text-slate-500 mt-0.5">Important alerts and messages</p>
              </div>
              <Toggle enabled={pushPrefs.generalAlerts} onClick={() => setPushPrefs(p => ({ ...p, generalAlerts: !p.generalAlerts }))} />
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">Reminders</p>
                <p className="text-xs text-slate-500 mt-0.5">Receive reminder notifications</p>
              </div>
              <Toggle enabled={pushPrefs.reminders} onClick={() => setPushPrefs(p => ({ ...p, reminders: !p.reminders }))} />
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="pr-4">
                <p className="text-sm font-semibold text-slate-900">Marketing</p>
                <p className="text-xs text-slate-500 mt-0.5">Promotions and offers</p>
              </div>
              <Toggle enabled={pushPrefs.marketing} onClick={() => setPushPrefs(p => ({ ...p, marketing: !p.marketing }))} />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer mt-4"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}

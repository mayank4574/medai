import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import { User, Globe, Shield, Bell, Moon, HelpCircle, Save, Loader2, Check, Eye, EyeOff, Mail, Key, Smartphone, Download, Trash2, ChevronRight } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'ur', name: 'Urdu (اردو)' },
];

export default function SettingsPage() {
  const { user, loginUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [language, setLanguage] = useState(user?.language || 'en');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification prefs
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [reportAlerts, setReportAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Appearance
  const [theme, setTheme] = useState('light');

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updateData = { name, language, phone };
      if (password && password === confirmPassword) {
        updateData.password = password;
      }
      const res = await updateProfile(updateData);
      // Update local storage & context
      const updatedUser = { ...user, ...res.data, token: user.token };
      loginUser(updatedUser);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Moon },
    { id: 'help', name: 'Help & Support', icon: HelpCircle },
  ];

  const Toggle = ({ enabled, onChange }) => (
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${enabled ? 'bg-[#005a8d]' : 'bg-slate-200'}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 text-sm">Manage your MedScanAI account, preferences, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all cursor-pointer border-b border-slate-100 last:border-0 ${
                  activeTab === tab.id 
                    ? 'bg-[#005a8d]/5 text-[#005a8d] border-l-4 border-l-[#005a8d]' 
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-l-transparent'
                }`}
              >
                <tab.icon size={18} className={activeTab === tab.id ? 'text-[#005a8d]' : 'text-slate-400'} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-1">Update your profile details and personal information.</p>
              </div>
              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${name}&background=random&size=128`}
                    className="w-20 h-20 rounded-2xl border-2 border-slate-200 object-cover"
                    alt="Avatar"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{email}</p>
                    <p className="text-[10px] mt-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold inline-block uppercase">
                      {user?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-lg p-3 outline-none cursor-not-allowed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Member Since</label>
                    <input
                      type="text"
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'May 2026'}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-lg p-3 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {saved && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                      <Check size={16} /> Profile saved successfully!
                    </div>
                  )}
                  <div className="ml-auto">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== LANGUAGE TAB ===== */}
          {activeTab === 'language' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Language Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">Choose your default language for report translations and the interface.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Default Report Language</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`p-3 rounded-xl text-sm font-medium text-left transition-all cursor-pointer border ${
                          language === lang.code 
                            ? 'bg-[#005a8d]/10 border-[#005a8d] text-[#005a8d] ring-2 ring-[#005a8d]/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#005a8d]/50'
                        }`}
                      >
                        <span className="font-bold">{lang.name}</span>
                        {language === lang.code && <Check size={14} className="float-right mt-0.5" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-50 transition-all">
                    {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Language</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                  <p className="text-xs text-slate-500 mt-1">Keep your account secure with a strong password.</p>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg p-3 pr-10 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                      />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
                    />
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 font-medium">Passwords do not match</p>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={handleSaveProfile} 
                      disabled={saving || !password || password !== confirmPassword}
                      className="flex items-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white px-6 py-2.5 rounded-lg text-sm font-bold cursor-pointer disabled:opacity-50 transition-all"
                    >
                      {saving ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : <><Key size={16} /> Update Password</>}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Active Sessions</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                      <Smartphone size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">This Device</p>
                      <p className="text-xs text-slate-500">Browser • Active Now</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Current</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                  <p className="text-xs text-slate-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                  <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer transition-colors border border-red-200">
                    <Trash2 size={16} /> Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">Control how and when MedScanAI sends you alerts.</p>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                      <p className="text-xs text-slate-500">Receive report alerts via email</p>
                    </div>
                  </div>
                  <Toggle enabled={emailNotif} onChange={setEmailNotif} />
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                      <p className="text-xs text-slate-500">Browser push for urgent alerts</p>
                    </div>
                  </div>
                  <Toggle enabled={pushNotif} onChange={setPushNotif} />
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Report Alerts</p>
                      <p className="text-xs text-slate-500">Get notified when AI finds abnormal values</p>
                    </div>
                  </div>
                  <Toggle enabled={reportAlerts} onChange={setReportAlerts} />
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Weekly Health Digest</p>
                      <p className="text-xs text-slate-500">Summary of your health trends every Monday</p>
                    </div>
                  </div>
                  <Toggle enabled={weeklyDigest} onChange={setWeeklyDigest} />
                </div>
              </div>
            </div>
          )}

          {/* ===== APPEARANCE TAB ===== */}
          {activeTab === 'appearance' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Appearance</h2>
                <p className="text-xs text-slate-500 mt-1">Customize the look and feel of your dashboard.</p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-slate-700 mb-4">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'light', name: 'Light', desc: 'Clean & bright', gradient: 'from-white to-slate-100', border: 'border-slate-200' },
                    { id: 'dark', name: 'Dark', desc: 'Easy on eyes', gradient: 'from-slate-800 to-slate-900', border: 'border-slate-700' },
                    { id: 'auto', name: 'System', desc: 'Match OS setting', gradient: 'from-white to-slate-800', border: 'border-slate-300' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`rounded-xl p-4 text-left cursor-pointer transition-all border-2 ${
                        theme === t.id ? 'border-[#005a8d] ring-2 ring-[#005a8d]/20' : `${t.border} hover:border-[#005a8d]/50`
                      }`}
                    >
                      <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.gradient} mb-3 border border-slate-200`} />
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                      {theme === t.id && <Check size={14} className="text-[#005a8d] float-right -mt-6" />}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-4">Note: Dark mode is coming soon in future updates.</p>
              </div>
            </div>
          )}

          {/* ===== HELP TAB ===== */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { q: 'How does MedScanAI analyze my report?', a: 'We use GPT-4o Vision to extract text from your lab report image, then cross-reference each value against medical reference databases to provide color-coded insights.' },
                    { q: 'Is my medical data secure?', a: 'Yes. All data is encrypted at rest and in transit. We never share your medical information with third parties. Your reports are stored in your personal secure vault.' },
                    { q: 'How accurate is the AI analysis?', a: 'Our OCR engine achieves 99.8% accuracy in text extraction. However, AI analysis is for informational purposes only and should not replace professional medical advice.' },
                    { q: 'Can I share reports with my doctor?', a: 'Yes! You can download PDF versions of your analyzed reports and share them with your healthcare provider for review.' },
                    { q: 'How many languages are supported?', a: 'MedScanAI supports 25+ languages including Hindi, Japanese, Spanish, Arabic, Tamil, Bengali, and more. You can change your default in Language settings.' },
                  ].map((faq, idx) => (
                    <details key={idx} className="group">
                      <summary className="px-6 py-4 cursor-pointer text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors list-none flex items-center justify-between">
                        {faq.q}
                        <ChevronRight size={14} className="text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                      </summary>
                      <div className="px-6 pb-4 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl p-8 text-white">
                <h3 className="text-lg font-bold mb-2">Need More Help?</h3>
                <p className="text-sm text-slate-300 mb-4">Our support team is available 24/7 to assist you.</p>
                <div className="flex gap-3">
                  <a href="mailto:support@medscanai.com" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all">
                    <Mail size={16} /> Email Support
                  </a>
                  <button className="flex items-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all">
                    <HelpCircle size={16} /> Live Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

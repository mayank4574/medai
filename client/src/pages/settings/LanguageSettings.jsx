import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' }
];

export default function LanguageSettings() {
  const { user, loginUser } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [selectedLanguage, setSelectedLanguage] = useState(user?.language || 'en');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selectedLanguage === user?.language) return;
    
    setSaving(true);
    try {
      const res = await updateProfile({ language: selectedLanguage });
      loginUser({ ...user, ...res.data, token: user.token });
      i18n.changeLanguage(selectedLanguage);
      toast.success('Language updated successfully');
    } catch (err) {
      toast.error('Failed to update language');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 px-2">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Language</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        <div className="p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-sm font-bold text-slate-900">Select Language</h2>
        </div>
        
        {/* Scrollable Language List */}
        <div className="flex-1 overflow-y-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedLanguage === lang.code ? 'border-primary' : 'border-slate-300'}`}>
                  {selectedLanguage === lang.code && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <span className={`text-sm ${selectedLanguage === lang.code ? 'font-bold text-primary' : 'font-medium text-slate-700'}`}>
                  {lang.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 shrink-0 bg-white">
          <button
            onClick={handleSave}
            disabled={saving || selectedLanguage === user?.language}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

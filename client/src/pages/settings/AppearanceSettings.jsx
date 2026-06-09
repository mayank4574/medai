import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Loader2, Sun, Moon as MoonIcon, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateAppearance } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AppearanceSettings() {
  const { settings, updateSettingsState } = useAuth();
  const [saving, setSaving] = useState(false);

  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  const [layout, setLayout] = useState('comfortable');

  useEffect(() => {
    if (settings?.appearance) {
      setTheme(settings.appearance.theme || 'light');
      setAccentColor(settings.appearance.accentColor || 'blue');
      setFontSize(settings.appearance.fontSize || 'medium');
      setLayout(settings.appearance.layout || 'comfortable');
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { theme, accentColor, fontSize, layout };
      const res = await updateAppearance(payload);
      updateSettingsState(res.data);
      toast.success('Appearance settings saved');
    } catch (err) {
      toast.error('Failed to save appearance');
    } finally {
      setSaving(false);
    }
  };

  const colors = [
    { id: 'blue', code: 'bg-[#4361ee]' },
    { id: 'purple', code: 'bg-[#7209b7]' },
    { id: 'green', code: 'bg-[#06d6a0]' },
    { id: 'orange', code: 'bg-[#f77f00]' },
    { id: 'red', code: 'bg-[#e63946]' },
    { id: 'slate', code: 'bg-[#64748b]' },
  ];

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-4 mb-6 px-2">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Appearance</h1>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">Theme</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                theme === 'light' ? 'border-[#005a8d] bg-blue-50/50 text-[#005a8d]' : 'border-slate-200 bg-white text-slate-500 hover:border-[#005a8d]/50'
              }`}
            >
              <Sun size={32} />
              <span className="font-bold text-sm">Light</span>
              {theme === 'light' && <div className="absolute top-3 right-3 w-5 h-5 bg-[#005a8d] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                theme === 'dark' ? 'border-[#005a8d] bg-blue-50/50 text-[#005a8d]' : 'border-slate-200 bg-white text-slate-500 hover:border-[#005a8d]/50'
              }`}
            >
              <MoonIcon size={32} />
              <span className="font-bold text-sm">Dark</span>
              {theme === 'dark' && <div className="absolute top-3 right-3 w-5 h-5 bg-[#005a8d] rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">Accent Color</h2>
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-wrap">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${color.code} ${
                  accentColor === color.id ? 'ring-4 ring-offset-2 ring-[#005a8d]/30 scale-110' : 'hover:scale-110'
                }`}
              >
                {accentColor === color.id && <Check size={16} className="text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">Font Size</h2>
          <div className="flex items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            {['small', 'medium', 'large'].map(size => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 py-3 text-sm font-bold capitalize rounded-xl transition-colors ${
                  fontSize === size ? 'bg-[#005a8d] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {size === 'small' ? 'A-' : size === 'medium' ? 'Medium' : 'A+'}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 mb-3 px-2">App Layout</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {[
              { id: 'comfortable', title: 'Comfortable', desc: 'More spacing' },
              { id: 'compact', title: 'Compact', desc: 'Fit more content' },
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setLayout(l.id)}
                className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer text-left"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${layout === l.id ? 'border-[#005a8d]' : 'border-slate-300'}`}>
                  {layout === l.id && <div className="w-2.5 h-2.5 rounded-full bg-[#005a8d]" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{l.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{l.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer mt-4"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

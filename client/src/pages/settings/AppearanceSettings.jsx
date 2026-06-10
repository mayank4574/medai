import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Loader2, Sun, Moon as MoonIcon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function AppearanceSettings() {
  const { appearance, updateAppearancePreview, saveAppearanceSettings } = useTheme();
  const [saving, setSaving] = useState(false);

  const { theme, accentColor, fontSize, layout } = appearance;

  const handleUpdate = (field, value) => {
    updateAppearancePreview({ [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAppearanceSettings();
    setSaving(false);
  };

  const colors = [
    { id: 'blue', code: 'bg-[#005a8d]' },
    { id: 'purple', code: 'bg-[#7209b7]' },
    { id: 'green', code: 'bg-[#06d6a0]' },
    { id: 'orange', code: 'bg-[#f77f00]' },
    { id: 'red', code: 'bg-[#e63946]' },
    { id: 'gray', code: 'bg-[#475569]' },
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
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleUpdate('theme', 'light')}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/50'
              }`}
            >
              <Sun size={24} />
              <span className="font-bold text-xs">Light</span>
              {theme === 'light' && <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
            </button>
            <button
              onClick={() => handleUpdate('theme', 'dark')}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/50'
              }`}
            >
              <MoonIcon size={24} />
              <span className="font-bold text-xs">Dark</span>
              {theme === 'dark' && <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
            </button>
            <button
              onClick={() => handleUpdate('theme', 'system')}
              className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                theme === 'system' ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/50'
              }`}
            >
              <Monitor size={24} />
              <span className="font-bold text-xs">System</span>
              {theme === 'system' && <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
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
                onClick={() => handleUpdate('accentColor', color.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${color.code} ${
                  accentColor === color.id ? 'ring-4 ring-offset-2 ring-primary/30 scale-110' : 'hover:scale-110'
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
                onClick={() => handleUpdate('fontSize', size)}
                className={`flex-1 py-3 text-sm font-bold capitalize rounded-xl transition-colors cursor-pointer ${
                  fontSize === size ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
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
                onClick={() => handleUpdate('layout', l.id)}
                className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 cursor-pointer text-left"
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${layout === l.id ? 'border-primary' : 'border-slate-300'}`}>
                  {layout === l.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
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
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 cursor-pointer mt-4"
        >
          {saving && <Loader2 size={18} className="animate-spin" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Globe, Shield, Bell, Moon, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

export default function SettingsMenu() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const accountItems = [
    { name: 'My Profile', desc: 'Edit name, email & photo', icon: User, path: '/settings/profile' },
    { name: 'Language', desc: user?.language === 'hi' ? 'Hindi' : user?.language === 'ja' ? 'Japanese' : 'English', icon: Globe, path: '/settings/language' },
    { name: 'Security', desc: 'Change password & 2FA', icon: Shield, path: '/settings/security' },
  ];

  const preferenceItems = [
    { name: 'Notifications', desc: 'Email & push alerts', icon: Bell, path: '/settings/notifications' },
    { name: 'Appearance', desc: 'Light / Dark mode', icon: Moon, path: '/settings/appearance' },
  ];

  const supportItems = [
    { name: 'Help & Support', desc: 'FAQ & contact us', icon: HelpCircle, path: '/settings/help' },
  ];

  const MenuSection = ({ title, items }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-900 mb-3 px-2">{title}</h3>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {items.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#005a8d]/10 group-hover:text-[#005a8d] transition-colors shrink-0">
              <item.icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-[#005a8d] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-2xl font-bold text-slate-900">All Settings</h1>
        <Link to="/settings/signout" className="flex items-center gap-2 text-red-500 hover:text-red-600 font-bold text-sm transition-colors">
          <LogOut size={16} /> Sign Out
        </Link>
      </div>

      <MenuSection title="Account" items={accountItems} />
      <MenuSection title="Preferences" items={preferenceItems} />
      <MenuSection title="Support" items={supportItems} />
    </div>
  );
}

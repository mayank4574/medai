import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logoutAllSessions } from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { Toaster } from 'react-hot-toast';

export default function SignOut() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { openConfirm } = useModal();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  const handleSignOutAll = () => {
    const userLang = user?.language || 'en';
    openConfirm({
      contextKey: 'logoutAll',
      variant: 'warning',
      lang: userLang,
      onConfirm: async () => {
        await logoutAllSessions();
        return {
          type: 'success',
          title: userLang === 'ja' ? 'ログアウト完了' :
                 userLang === 'hi' ? 'सफलतापूर्वक लॉगआउट' :
                 userLang === 'gu' ? 'સફળતાપૂર્વક લોગઆઉટ' :
                 userLang === 'fr' ? 'Déconnexion réussie' : 'Logged Out',
          description: userLang === 'ja' ? 'すべてのデバイスからログアウトしました。' :
                       userLang === 'hi' ? 'सभी उपकरणों से लॉगआउट कर दिया गया है।' :
                       userLang === 'gu' ? 'તમામ ઉપકરણોમાંથી લોગઆઉટ કરવામાં આવ્યું છે.' :
                       userLang === 'fr' ? 'Déconnexion de tous les appareils réussie.' : 'Successfully logged out of all devices.',
          lang: userLang,
          onClose: () => {
            logout();
            navigate('/login');
          }
        };
      }
    });
  };

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      
      <div className="flex items-center gap-4 mb-6 px-2">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">Sign Out</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center mt-10">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogOut size={48} className="text-red-500 ml-2" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-3">Sign Out of Your Account?</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-[250px] mx-auto">
          You will need to sign in again to access your account.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] cursor-pointer"
          >
            Sign Out
          </button>
          
          <button
            onClick={handleSignOutAll}
            className="w-full flex items-center justify-center bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] cursor-pointer"
          >
            Sign Out of All Devices
          </button>

          <Link
            to="/settings"
            className="w-full flex items-center justify-center text-primary hover:bg-blue-50 py-3.5 rounded-xl text-sm font-bold transition-all mt-4 cursor-pointer"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

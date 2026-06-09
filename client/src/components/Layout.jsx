import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/api';
import { useTranslation } from 'react-i18next';
import { getAvatarUrl } from '../utils/avatar';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  TrendingUp, 
  Users,
  Search,
  Bell,
  Settings,
  Plus,
  LogOut,
  Scan,
  X,
  User,
  Globe,
  Shield,
  Moon,
  HelpCircle,
  Mail,
  Key,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Panels state
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const settingsRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close panels on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) { setShowSearch(false); setSearchQuery(''); }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close panels on route change
  useEffect(() => {
    setShowSettings(false);
    setShowNotifications(false);
    setShowSearch(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Fetch reports for search & notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReports();
        setAllReports(res.data);
        // Build notifications from reports
        const notifs = [];
        res.data.forEach(r => {
          const abnormal = r.labValues?.filter(v => v.status !== 'normal') || [];
          if (r.overallStatus === 'urgent') {
            notifs.push({
              id: r._id,
              type: 'urgent',
              title: `Urgent: ${r.reportType?.charAt(0).toUpperCase() + r.reportType?.slice(1)} Report`,
              message: `${abnormal.length} critical values detected. Consult a doctor.`,
              time: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              read: false
            });
          } else if (r.overallStatus === 'attention') {
            notifs.push({
              id: r._id,
              type: 'warning',
              title: `${r.reportType?.charAt(0).toUpperCase() + r.reportType?.slice(1)} Report: ${abnormal.length} flagged`,
              message: `Some values need your attention.`,
              time: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              read: false
            });
          } else if (r.overallStatus === 'normal') {
            notifs.push({
              id: r._id,
              type: 'success',
              title: `${r.reportType?.charAt(0).toUpperCase() + r.reportType?.slice(1)} Report: All Clear`,
              message: `All values are within normal range.`,
              time: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
              read: true
            });
          }
        });
        setNotifications(notifs);
      } catch (err) {
        // ignore
      }
    };
    fetchData();
  }, [location.pathname]);

  // Search handler
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = allReports.filter(r => 
      r.reportType?.toLowerCase().includes(q) ||
      r.labName?.toLowerCase().includes(q) ||
      r.familyMemberName?.toLowerCase().includes(q) ||
      r.summary?.toLowerCase().includes(q) ||
      r.labValues?.some(v => v.name.toLowerCase().includes(q))
    ).slice(0, 6);
    setSearchResults(results);
    setShowSearch(true);
  }, [searchQuery, allReports]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: t('Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('Upload & Scan'), path: '/upload', icon: UploadCloud },
    { name: t('Reports'), path: '/reports', icon: FileText },
    { name: t('Trends'), path: '/trends', icon: TrendingUp },
    { name: t('Family'), path: '/family', icon: Users },
  ];

  const settingsItems = [
    { name: t('My Profile'), desc: t('Edit name, email & photo'), icon: User, action: () => navigate('/settings/profile') },
    { name: t('Language'), desc: user?.language === 'hi' ? 'Hindi' : user?.language === 'ja' ? 'Japanese' : 'English', icon: Globe, action: () => navigate('/settings/language') },
    { name: t('Security'), desc: t('Change password & 2FA'), icon: Shield, action: () => navigate('/settings/security') },
    { name: t('Notifications'), desc: t('Email & push alerts'), icon: Bell, action: () => navigate('/settings/notifications') },
    { name: t('Appearance'), desc: t('Light / Dark mode'), icon: Moon, action: () => navigate('/settings/appearance') },
    { name: t('Help & Support'), desc: t('FAQ & contact us'), icon: HelpCircle, action: () => navigate('/settings/help') },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="p-6">
            <Link to="/dashboard" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                <Scan size={16} />
              </div>
              <span className="text-xl font-bold font-['Space_Grotesk'] tracking-wide text-slate-900">MedScan</span>
              <span className="text-xs bg-[#0ea5e9]/10 text-[#0ea5e9] px-2 py-0.5 rounded font-bold">AI</span>
            </Link>
          </div>
          
          <nav className="mt-2">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => {
                const isActive = location.pathname.includes(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#005a8d]/10 text-[#005a8d]' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-[#005a8d]' : 'text-slate-400'} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              src={getAvatarUrl(user, 100)}
              alt={user?.name || 'User'} 
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
          <Link to="/upload" className="w-full flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
            <Plus size={16} />
            New Scan
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex-1 flex items-center">
            {/* Breadcrumb */}
          </div>
          <div className="flex items-center gap-3">
            {/* ===== SEARCH BAR ===== */}
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Search patient records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.length >= 2) setShowSearch(true); }}
                className="pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005a8d] focus:bg-white transition-all w-64"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setShowSearch(false); }} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}

              {/* Search Results Dropdown */}
              {showSearch && searchQuery.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Results</p>
                    <span className="text-xs text-slate-400">{searchResults.length} found</span>
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center">
                      <Search size={24} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No records match "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map(report => (
                        <Link 
                          key={report._id}
                          to={`/reports/${report._id}`}
                          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0"
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            report.overallStatus === 'urgent' ? 'bg-red-50 text-red-500' :
                            report.overallStatus === 'attention' ? 'bg-amber-50 text-amber-500' :
                            'bg-green-50 text-green-500'
                          }`}>
                            <FileText size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {report.reportType?.charAt(0).toUpperCase() + report.reportType?.slice(1)} Report
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {report.labName || 'Lab'} • {report.familyMemberName || 'Self'} • {new Date(report.reportDate || report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <Link 
                      to="/reports" 
                      onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                      className="text-xs text-[#005a8d] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      View all reports <ExternalLink size={10} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ===== NOTIFICATIONS BELL ===== */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs text-[#005a8d] font-semibold hover:underline cursor-pointer">Mark all read</button>
                      )}
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell size={24} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No notifications yet</p>
                        <p className="text-xs text-slate-400 mt-1">Upload a report to get started</p>
                      </div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 last:border-0 transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/40' : ''}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'urgent' ? 'bg-red-100 text-red-500' :
                            notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                            'bg-green-100 text-green-500'
                          }`}>
                            {notif.type === 'urgent' ? <AlertTriangle size={14} /> :
                             notif.type === 'warning' ? <AlertTriangle size={14} /> :
                             <CheckCircle2 size={14} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/reports/${notif.id}`}
                              onClick={() => setShowNotifications(false)}
                              className="text-sm font-semibold text-slate-900 hover:text-[#005a8d] cursor-pointer leading-tight block"
                            >
                              {notif.title}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                              <Clock size={10} /> {notif.time}
                            </p>
                          </div>
                          <button 
                            onClick={() => dismissNotification(notif.id)}
                            className="text-slate-300 hover:text-red-400 cursor-pointer shrink-0 mt-1"
                            title="Dismiss"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <Link 
                        to="/reports" 
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#005a8d] font-semibold hover:underline cursor-pointer"
                      >
                        View all reports →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ===== SETTINGS GEAR ===== */}
            <div className="relative" ref={settingsRef}>
              <button 
                onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                className={`p-2 rounded-lg cursor-pointer transition-all ${showSettings ? 'bg-[#005a8d] text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <Settings size={20} className={showSettings ? 'animate-spin' : ''} style={showSettings ? { animationDuration: '3s' } : {}} />
              </button>

              {showSettings && (
                <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {/* User header */}
                  <div className="p-5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white">
                    <div className="flex items-center gap-3">
                      <img 
                        src={getAvatarUrl(user, 120)}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full border-2 border-white/30 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=80`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-300 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Settings menu items */}
                  <div className="py-2">
                    {settingsItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => { item.action(); setShowSettings(false); }}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-[#005a8d]/10 group-hover:text-[#005a8d] transition-colors shrink-0">
                          <item.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                      </button>
                    ))}
                  </div>

                  {/* Footer actions */}
                  <div className="p-3 border-t border-slate-100 flex gap-2">
                    <button 
                      onClick={() => { navigate('/settings'); setShowSettings(false); }}
                      className="flex-1 text-center text-xs text-[#005a8d] font-semibold py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {t('All Settings')}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="flex-1 text-center text-xs text-red-500 font-semibold py-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <LogOut size={12} /> {t('Sign Out')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <img 
              src={getAvatarUrl(user, 80)}
              alt="User" 
              className="w-8 h-8 rounded-full border border-slate-200 object-cover ml-1 cursor-pointer hover:ring-2 hover:ring-[#005a8d] transition-all"
              onClick={() => navigate('/settings')}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`; }}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

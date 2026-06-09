import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Camera, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { getAvatarUrl } from '../../utils/avatar';

export default function MyProfile() {
  const { user, loginUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      // Only set explicit preview if file is selected, otherwise use utility in render
      setAvatarPreview(null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Name and Email are required');
      return;
    }

    setSaving(true);
    try {
      let dataToSubmit;
      
      // If there's an image, we MUST use FormData
      if (avatarFile) {
        dataToSubmit = new FormData();
        dataToSubmit.append('name', name);
        dataToSubmit.append('email', email);
        dataToSubmit.append('phone', phone);
        dataToSubmit.append('bio', bio);
        dataToSubmit.append('avatar', avatarFile);
      } else {
        // Otherwise, standard JSON
        dataToSubmit = { name, email, phone, bio };
      }

      const res = await updateProfile(dataToSubmit);
      loginUser({ ...user, ...res.data, token: user.token });
      setSaved(true);
      toast.success('Profile updated successfully');
      setAvatarFile(null); // Reset the file after successful upload
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full pb-10">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/settings" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
          <ChevronLeft size={24} className="text-slate-900" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <img
              src={avatarPreview || getAvatarUrl(user, 128)}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover transition-transform group-hover:scale-105 bg-slate-100"
              alt="Profile"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random&size=128`; }}
            />
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#005a8d] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <Camera size={14} />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <p onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-[#005a8d] mt-3 hover:underline cursor-pointer">
            Change Photo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all"
              placeholder="+91 9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-[#005a8d] transition-all resize-none h-24"
              placeholder="Tell us a little about yourself..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-[#005a8d] hover:bg-[#004a75] text-white py-4 rounded-xl text-sm font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <Check size={18} /> : null}
              {saving ? 'Saving...' : saved ? 'Saved Successfully' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

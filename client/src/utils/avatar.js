export const getAvatarUrl = (user, size = 128) => {
  if (!user) return `https://ui-avatars.com/api/?name=User&background=random&size=${size}`;
  
  if (user.avatar) {
    if (user.avatar.startsWith('http')) return user.avatar;
    let API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://medai-3onq.onrender.com/api' : 'http://localhost:5000/api');
    
    if (API_URL && !API_URL.endsWith('/api')) {
      if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
      API_URL += '/api';
    }

    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}${user.avatar}`;
  }
  
  const name = encodeURIComponent(user.name || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=random&size=${size}`;
};

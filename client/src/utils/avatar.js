export const getAvatarUrl = (user, size = 128) => {
  if (!user) return `https://ui-avatars.com/api/?name=User&background=random&size=${size}`;
  
  if (user.avatar) {
    if (user.avatar.startsWith('http')) return user.avatar;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${baseUrl}${user.avatar}`;
  }
  
  const name = encodeURIComponent(user.name || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=random&size=${size}`;
};

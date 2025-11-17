const AUTH_KEY = 'rentify_auth';

export const getAuthToken = () => {
  // القراءة من أماكن التخزين المنفصلة
  const token = localStorage.getItem('userToken');
  const role = localStorage.getItem('Role');
  const userId = localStorage.getItem('UserId');

  return {
    token,
    user: token ? { 
      id: userId,
      role: role === '1' ? 'Admin' : 
            role === '2' ? 'Landlord' : 
            role === '3' ? 'Tenant' : null
    } : null
  };
};

export const setAuthToken = (token, user) => {
  // يمكن تركها فارغة أو تعديلها حسب احتياجاتك
};

export const clearAuthToken = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('Role');
  localStorage.removeItem('UserId');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('userToken');
};

export const getUserRole = () => {
  const role = localStorage.getItem('Role');
  return role === '1' ? 'Admin' : 
         role === '2' ? 'Landlord' : 
         role === '3' ? 'Tenant' : null;
};
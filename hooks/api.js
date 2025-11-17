export const fetchWithRefresh = async (url, options = {}) => {
    let token = localStorage.getItem('userToken');
  
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  
    let response = await fetch(url, options);
  
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResponse = await fetch('http://localhost:5062/api/Account/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken })
      });
  
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('refreshToken', data.refreshtoken);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('role', data.role);
  
        options.headers['Authorization'] = `Bearer ${data.token}`;
        response = await fetch(url, options);
      } else {
        throw new Error('Unable to refresh token');
      }
    }
  
    // إذا كانت الاستجابة غير صحيحة، يجب معالجة الأخطاء هنا
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
  
    const data = await response.json();  // هنا تحتاج إلى التأكد من أن البيانات هي بتنسيق JSON.
  
    if (Array.isArray(data)) {
      return data;  // إرجاع المصفوفة إذا كانت البيانات عبارة عن مصفوفة
    }
  
    console.error('Received data is not an array:', data);
    return [];  // إرجاع مصفوفة فارغة إذا كانت البيانات ليست مصفوفة
  };
  
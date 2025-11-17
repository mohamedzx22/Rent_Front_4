/*export async function fetchWithAuth(url, options = {}) {
  try {
    let token = localStorage.getItem('userToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // إعداد الهيدر الأساسي
    const buildHeaders = (token) => ({
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    options.headers = buildHeaders(token);

    let response = await fetch(url, options);

    // لو التوكن منتهي، نحاول نعمل refresh
    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch('http://localhost:5062/api/Account/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = await refreshResponse.json();

      // تحديث التوكنات في localStorage
      localStorage.setItem('userToken', refreshData.token);
      localStorage.setItem('refreshToken', refreshData.refreshToken);

      // إعادة الطلب بالتوكن الجديد
      options.headers = buildHeaders(refreshData.token);
      response = await fetch(url, options);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}*/

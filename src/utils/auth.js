const API_URL = 'https://your-backend-api.com'; // You'll need to set up a backend server

export const verifyAdmin = async (password) => {
  try {
    const response = await fetch(`${API_URL}/verify-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    return data.token; // JWT token from backend
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

export const checkAuthToken = () => {
  const token = sessionStorage.getItem('adminToken');
  return !!token;
}; 
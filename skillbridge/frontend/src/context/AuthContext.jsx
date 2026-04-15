import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
// Read from env (set VITE_API_URL in Vercel dashboard), fallback to localhost
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('sb_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  // LOGIN: backend uses OAuth2PasswordRequestForm → MUST send URL-encoded form data
  // We use plain axios (not the api instance) to avoid the JSON Content-Type interceptor
  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);  // OAuth2 spec: field is "username" not "email"
    params.append('password', password);

    const tokenRes = await axios.post(`${BASE}/auth/login`, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token } = tokenRes.data;
    localStorage.setItem('sb_token', access_token);

    const userRes = await axios.get(`${BASE}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userData = userRes.data;
    localStorage.setItem('sb_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // REGISTER: sends JSON, default role_id=3 (Student)
  const register = async (name, email, password) => {
    const res = await axios.post(`${BASE}/auth/register`, {
      name, email, password, role_id: 3,
    });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

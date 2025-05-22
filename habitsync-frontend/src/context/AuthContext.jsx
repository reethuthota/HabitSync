import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; // point to your backend

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Automatically add token to axios headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password.');
    }
  };

  const signup = async ({ name, username, email, password }) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, username, email, password });
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

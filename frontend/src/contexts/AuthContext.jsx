import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }

      // Use API helper to get current user
      const res = await api.get('/users/me');
      if (res?.data?.success) {
        setUser(res.data.user);
      } else if (res?.data) {
        // Some APIs may return user directly
        setUser(res.data.user || res.data);
      }
    } catch (error) {
      // Could try refresh and retry once
      try {
        const refreshRes = await api.post('/auth/refresh');
        if (refreshRes?.data?.accessToken) {
          localStorage.setItem('accessToken', refreshRes.data.accessToken);
          const res2 = await api.get('/users/me');
          setUser(res2?.data?.user || null);
        } else {
          setUser(null);
          localStorage.removeItem('accessToken');
        }
      } catch (refreshErr) {
        setUser(null);
        localStorage.removeItem('accessToken');
      }
    }
  }, []);

  // On mount, try to load current user
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCurrentUser();
      setLoading(false);
    })();
  }, [fetchCurrentUser]);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { accessToken, user: userData } = res.data;
        if (accessToken) localStorage.setItem('accessToken', accessToken);
        // Prefer user from response, otherwise fetch
        if (userData) {
          setUser(userData);
        } else {
          await fetchCurrentUser();
        }
        return { success: true };
      }
      return { success: false, error: res.data?.error || 'Login failed' };
    } catch (error) {
      // Bubble up server validation or message
      const message = error?.response?.data?.error || error?.message || 'Login failed';
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data && res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, error: res.data?.error || 'Registration failed' };
    } catch (error) {
      const message = error?.response?.data?.error || error?.message || 'Registration failed';
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  // Expose refreshToken helper
  const refreshToken = async () => {
    try {
      const res = await api.post('/auth/refresh');
      if (res?.data?.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        return res.data.accessToken;
      }
      throw new Error('No access token returned');
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshToken,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
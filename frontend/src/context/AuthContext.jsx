import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('surya_auth_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('surya_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  // Validate session on launch
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('surya_auth_user', JSON.stringify(res.data.user));
          }
        } catch {
          // Token expired or invalid
          logout(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Login handler (Customer & Admin)
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.data.success) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('surya_auth_token', jwtToken);
        localStorage.setItem('surya_auth_user', JSON.stringify(userData));
        addToast(res.data.message || `Welcome back, ${userData.name}!`, 'success');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid email or password. Please try again.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Register handler (Customer)
  const register = async (formData) => {
    try {
      const res = await authService.register(formData);
      if (res.data.success) {
        const { token: jwtToken, user: userData } = res.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('surya_auth_token', jwtToken);
        localStorage.setItem('surya_auth_user', JSON.stringify(userData));
        addToast('Account created successfully! Welcome to Surya Stores.', 'success');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please check your details.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Profile update handler
  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('surya_auth_user', JSON.stringify(res.data.user));
        addToast('Profile updated successfully.', 'success');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('surya_auth_token');
    localStorage.removeItem('surya_auth_user');
    if (showToast) {
      addToast('Logged out successfully.', 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: !!user && user.role === 'admin',
        isCustomer: !!user && user.role === 'customer',
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

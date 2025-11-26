import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiClient } from '../services/api';

const isJwtToken = (token) => typeof token === 'string' && token.split('.').length === 3;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setCurrentUser({ username });
      // Only set Authorization header if token is a real JWT
      if (isJwtToken(token)) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    }
    
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      setError('');

      // Real API call
      const response = await apiClient.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { token, username: user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);

        // Set authorization header for all future requests, only if valid JWT
        if (isJwtToken(token)) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete apiClient.defaults.headers.common['Authorization'];
        }

        setCurrentUser({ username: user });
        return { success: true };
      } else {
        setError(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const login = async (username, password) => {
    try {
      setError('');

      // Real API call
      const response = await apiClient.post('/api/auth/login', {
        username,
        password
      });

      const { token, username: user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);

        // Set authorization header for all future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setCurrentUser({ username: user });
        return { success: true };
      } else {
        setError(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete apiClient.defaults.headers.common['Authorization'];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
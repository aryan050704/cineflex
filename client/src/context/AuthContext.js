import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const login = async (email, password) => {
    try {
      setError(null);
      
      if (!email || !password) {
        setError('Please fill in all fields');
        return false;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return false;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      // For demo purposes, accept any valid email/password
      const user = {
        id: Date.now(),
        email,
        name: email.split('@')[0]
      };

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);

      if (!name || !email || !password) {
        setError('Please fill in all fields');
        return false;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return false;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      // Check if user already exists
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        if (parsedUser.email === email) {
          setError('An account with this email already exists');
          return false;
        }
      }

      const user = {
        id: Date.now(),
        email,
        name
      };

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError('An error occurred during registration');
      return false;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('An error occurred during logout');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
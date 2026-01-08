import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

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

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = authService.onAuthStateChange((user) => {
        setUser(user);
        setLoading(false);
      });
    } catch (err) {
      // If Firebase isn't configured or call fails, prevent app crash and continue
      // Keep loading false so UI can render (user will be null)
      // eslint-disable-next-line no-console
      console.warn('Auth subscription failed:', err);
      setLoading(false);
    }

    // Clean up subscription on unmount
    return () => {
      try {
        if (typeof unsubscribe === 'function') unsubscribe();
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  const value = {
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
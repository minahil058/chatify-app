import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      try {
        setAuthLoading(true);
        setAuthError(null);
        const res = await axios.get("/api/auth/check", {
          withCredentials: true,
        });
        if (!cancelled) {
          setUser(res.data?.user || null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setAuthError(err.response?.data?.message || "Not authenticated");
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    };

    checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData) => setUser(userData || null);
  const logout = () => setUser(null);

  const value = { user, authLoading, authError, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


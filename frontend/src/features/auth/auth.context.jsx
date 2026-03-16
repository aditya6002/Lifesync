// src/features/auth/auth.context.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async ({ email }) => {
    await new Promise((r) => setTimeout(r, 800));
    const u = {
      id: "u1",
      name: email.split("@")[0] || "User",
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(u);
    setToken("demo-token");
  };

  const signup = async ({ name, email }) => {
    await new Promise((r) => setTimeout(r, 1000));
    const u = { id: "u1", name, email, createdAt: new Date().toISOString() };
    setUser(u);
    setToken("demo-token");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };
  const updateUser = (u) => setUser((p) => (p ? { ...p, ...u } : null));

  return (
    <AuthContext.Provider
      value={{ user, token, loading: false, login, signup, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

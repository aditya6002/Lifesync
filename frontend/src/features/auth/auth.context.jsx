import { createContext, useContext, useState } from "react";
import { authApi } from "./auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async ({ email, password }) => {
    return await authApi.login({ email, password });
  };

  const signup = async ({ name, username, email, password, confirmPass }) => {
    return await authApi.signup({
      name,
      username,
      email,
      password,
      confirmPass,
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };
  const updateUser = (u) => setUser((p) => (p ? { ...p, ...u } : null));

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        setLoading,
        login,
        signup,
        logout,
        updateUser,
        toast,
        setToast,
      }}
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

import { createContext, useContext, useEffect } from "react";
import { authApi } from "./auth.api";
import { useDispatch, useSelector } from "react-redux";

import {
  setUser as setUserAction,
  setAccessToken,
  setError as setErrorAction,
  setLoading as setLoadingAction,
  setToast as setToastAction,
} from "../../store/features/auth/authSlice";
import { useLoader } from "../../shared/components/ui/GlobalLoader";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken);
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();

  const setUser = (u) => dispatch(setUserAction(u));
  const setToken = (t) => dispatch(setAccessToken(t));
  const setLoading = (l) => dispatch(setLoadingAction(l));
  const setError = (e) => dispatch(setErrorAction(e));
  const setToast = (t) => dispatch(setToastAction(t));
  const { withLoader } = useLoader();

  useEffect(() => {
    try {
      const getAndSetUser = async () => {
        const res = await authApi.getMe();
        setUser(res.data.user);
        setLoading(false);
      };
      getAndSetUser();
    } catch (error) {
      setUser(null);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (payload) => {
    await withLoader(async () => {
      const res = await authApi.login(payload);
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }, "Signing you in...");
  };

  const signup = async (payload) => {
    const res = await authApi.signup(payload);
    localStorage.setItem("token", res.data.accessToken);
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (u) =>
    setUser((prev) => (prev ? { ...prev, ...u } : null));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateUser,
        setError,
        setToast,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

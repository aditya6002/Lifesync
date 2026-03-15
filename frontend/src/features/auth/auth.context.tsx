import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginPayload, SignupPayload } from "../../shared/types";
import { authApi } from "./auth.api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  setUser as setUserAction,
  setAccessToken,
  setError as setErrorAction,
  setLoading as setLoadingAction,
  setToast as setToastAction,
} from "../../store/features/auth/authSlice";
import { useLoader } from "../../shared/components/ui/GlobalLoader";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch();

  const setUser: (u: User | null) => void = (u) => dispatch(setUserAction(u));
  const setToken = (t: string | null) => dispatch(setAccessToken(t));
  const setLoading = (l: boolean) => dispatch(setLoadingAction(l));
  const setError = (e: string) => dispatch(setErrorAction(e));
  const setToast = (t: { type: "success" | "error"; message: string }) =>
    dispatch(setToastAction(t));
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

  const login = async (payload: LoginPayload) => {
    await withLoader(async () => {
      const res = await authApi.login(payload);
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }, "Signing you in...");
  };

  const signup = async (payload: SignupPayload) => {
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

  const updateUser = (u: Partial<User>) =>
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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

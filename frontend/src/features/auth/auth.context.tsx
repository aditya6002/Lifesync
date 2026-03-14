import { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  setError as setErrorAction,
  setLoading as setLoadingAction,
  setUser as setUserAction,
  setAccessToken as setAccessTokenAction,
} from "../../app/features/auth/authSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const error = useSelector((state: RootState) => state.auth.error);

  const dispatch = useDispatch();
  const setLoading = (val: boolean) => {
    dispatch(setLoadingAction(val));
  };

  const setUser = (val: object) => {
    dispatch(setUserAction(val));
  };

  const setAccessToken = (val: string) => {
    dispatch(setAccessTokenAction(val));
  };

  const setError = (val: string) => {
    dispatch(setErrorAction(val));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        accessToken,
        setAccessToken,
        error,
        setError,
      }}
    >
      {children}{" "}
    </AuthContext.Provider>
  );
};

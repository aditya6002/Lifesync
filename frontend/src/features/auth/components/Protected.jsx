import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router";

import { authApi } from "../auth.api";
import {
  setUser,
  setAuthLoading as setLoading,
  setError,
  setAccessToken,
  setToast,
} from "../../../store/features/auth/authSlice";

const Protected = ({ children }) => {
  const { authLoading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) return;

    const getAndSetUser = async () => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const res = await authApi.getMe();

        dispatch(setUser(res.data.user));
        dispatch(setAccessToken(res.data.accessToken));
      } catch (err) {
        console.error(err);

        dispatch(
          setError(
            err.response?.data?.message ||
              "An error occurred. Please try again.",
          ),
        );

        dispatch(
          setToast({
            type: "warning",
            message: "Session expired, please login again",
          }),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    getAndSetUser();
  }, [user]);

  if (authLoading) {
    return (
      <main
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "content",
          alignItems: "center",
        }}
      >
        <h1 style={{ width: "100%", textAlign: "center" }}>Loading...</h1>
      </main>
    );
  }

  if (!user && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;

import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import { Navigate } from "react-router";
import { authApi } from "../auth.api";
import {
  setUser,
  setLoading,
  setError,
  setAccessToken,
  setToast,
} from "../../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Protected = ({ children }) => {
  const { loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getAndSetUser() {
      dispatch(setLoading(true));
      dispatch(setError(null));

      authApi
        .getMe()
        .then((res) => {
          dispatch(setUser(res.data.user));
          dispatch(setAccessToken(res.data.accessToken));
        })
        .catch((err) => {
          console.error(err);
          dispatch(
            setError(
              err.response?.data?.message ||
                "An error occurred. Please try again.",
            ),
          );
          dispatch(setAccessToken(null));
          dispatch(setUser(null));
          dispatch(
            setToast({
              type: "error",
              message: "Session expired. Please log in again.",
            }),
          );
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }

    getAndSetUser();
  }, []);

  if (loading)
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;

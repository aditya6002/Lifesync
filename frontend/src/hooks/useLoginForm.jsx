import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  setAccessToken,
  setError,
  setLoading,
  setToast,
  setAuthLoading,
} from "../store/features/authSlice";
import authApi from "../api/auth.routes";
import { useState } from "react";
import { useLoader } from "../shared/components/ui/GlobalLoader";
import { useNavigate } from "react-router";

const useLoginForm = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { withLoader } = useLoader();
  const navigator = useNavigate();

  const handleLogin = async () => {
    dispatch(setError(null));
    dispatch(setLoading(true));
    dispatch(setAuthLoading(true));
    try {
      if (
        !email ||
        !password ||
        !email.trim() ||
        !email.includes("@") ||
        !password.trim()
      ) {
        return dispatch(setError("Please fill all fields."));
      }

      const handle = authApi.login({
        email: email.toString(),
        password: password.toString(),
      });
      // const res = await withLoader(handle, "Sign in...");
      const res = await authApi.login({
        email: email.toString(),
        password: password.toString(),
      });

      dispatch(setUser(res.data.user));
      dispatch(setAccessToken(res.data.accessToken));
      navigator("/");
    } catch (error) {
      console.error(error);
      const errMsg = error.message;

      dispatch(setToast("Login failed"));
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthLoading(false));
      setEmail("");
      setPassword("");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    withLoader,
  };
};

export default useLoginForm;

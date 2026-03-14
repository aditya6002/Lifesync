import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import type { RootState } from "../../../app/store";
import { authApi } from "../auth.api.ts";
import { setError, setLoading, setUser } from "../../../store/features/auth/authSlice.ts";

const Protected = ({children}: {children: React.ReactNode}) => {
  
  const dispatch = useDispatch();

  const loading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);

    useEffect(()=>{
    const getAndSetUser = async()=>{
      dispatch(setLoading(true));
      try {
        const data = await authApi.getMe();
        dispatch(setUser(data.user));
      } catch (error: any) {
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    getAndSetUser();
  },[])
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children
};

export default Protected;

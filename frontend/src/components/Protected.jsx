import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Loader2 } from "lucide-react";
import authApi from "../api/auth.api";
import { setUser, setAuthLoading } from "../store/features/authSlice";

const Protected = ({ children }) => {
  const dispatch = useDispatch();
  const { user, authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;
    const verifyAuth = async () => {
      if (user) {
        dispatch(setAuthLoading(false));
        return;
      }
      try {
        const data = await authApi.getMe();
        if (isMounted) {
          if (data?.user) {
            dispatch(setUser(data.user));
          } else {
            dispatch(setUser(null));
          }
        }
      } catch {
        if (isMounted) {
          dispatch(setUser(null));
        }
      } finally {
        if (isMounted) {
          dispatch(setAuthLoading(false));
        }
      }
    };

    verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  if (authLoading) {
    return (
      <div className="auth-splash-screen">
        <div className="auth-splash-card glass-card">
          <div className="auth-splash-icon">
            <Activity size={32} className="brand-mark animate-pulse" />
          </div>
          <h2 className="serif text-xl mt-3 text-[var(--ink)]">LifeSync</h2>
          <p className="text-xs text-[var(--muted)] flex items-center gap-2 mt-2">
            <Loader2 size={13} className="jnl-spin" /> Verifying secure session…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;

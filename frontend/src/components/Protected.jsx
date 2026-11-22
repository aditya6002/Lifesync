import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
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
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#fbf2ef] dark:bg-[#120f17]">
        <div className="p-8 rounded-3xl bg-white/75 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-2xl shadow-purple-950/10 dark:shadow-black/50 flex flex-col items-center text-center max-w-xs w-full animate-float">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 mb-3 animate-pulse">
            <Activity size={30} strokeWidth={2.4} />
          </div>
          <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-zinc-900 to-purple-900 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            LifeSync
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-3 font-medium">
            <Loader2
              size={14}
              className="animate-spin text-purple-600 dark:text-purple-400"
            />
            Verifying secure session…
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default Protected;

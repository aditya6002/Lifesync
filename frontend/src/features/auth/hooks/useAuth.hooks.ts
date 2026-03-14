import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import {authApi} from '../auth.api.ts';
import {setError,setLoading,setUser,setAccessToken} from '../../../app/features/auth/authSlice.ts'


export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state:RootState) => state.auth);

  const handleLogin = (email: string, password: string) => {
    dispatch(setLoading(true));
    authApi.login(email, password)
      .then((data:any) => {
        dispatch(setUser(data.user));
        dispatch(setAccessToken(data.accessToken));
        dispatch(setError(null));
      })
      .catch((error) => {
        dispatch(setError(error.message));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const handleLogout = () => {
    dispatch(setLoading(true));
    authApi.logout()
      .then(() => {
        dispatch(setUser(null));
        dispatch(setAccessToken(null));
        dispatch(setError(null));
      })
      .catch((error) => {
        dispatch(setError(error.message));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };




  return {
    ...authState,
    handleLogin,
    handleLogout,
  };
};
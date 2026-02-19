//src/hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getMeThunk, logoutThunk, clearAuthError } from '../store/slices/authSlice.js';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, isMeLoading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getMeThunk());
    }
  }, [token, user, dispatch]);

  const logout     = () => dispatch(logoutThunk());
  const clearError = () => dispatch(clearAuthError());

  const isLoggedIn = !!token && !!user;
  const role       = user?.role    || null;
  const profile    = user?.profile || null;

  const medals = role === 'student' ? {
    total_score:     profile?.total_score     ?? 0,
    global_rank:     profile?.global_rank     ?? '-',
    programs_solved: profile?.programs_solved ?? 0,
  } : null;

  return { user, token, isLoggedIn, role, profile, medals, isLoading, isMeLoading, error, logout, clearError };
};

export default useAuth;
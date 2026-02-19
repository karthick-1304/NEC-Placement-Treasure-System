import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Spinner from './Spinner.jsx';

export default function ProtectedRoute() {
  const { isLoggedIn, isMeLoading } = useAuth();

  if (isMeLoading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-dark-400 text-sm animate-pulse">Loading your profile...</p>
      </div>
    </div>
  );

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
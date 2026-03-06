import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";
import Spinner from "./Spinner.jsx";

export default function ProtectedRoute({ roles, children }) {

  const { isLoggedIn, isMeLoading, role } = useAuth();

  if (isMeLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-dark-400 text-sm animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (roles && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Render children or nested routes
  return children ? children : <Outlet />;
}
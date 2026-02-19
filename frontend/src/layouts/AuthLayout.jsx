import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Spinner from '../components/common/Spinner.jsx';

export default function AuthLayout() {
  const { isLoggedIn, isMeLoading } = useAuth();

  if (isMeLoading) return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (isLoggedIn) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-pattern flex items-center justify-center p-4">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl shadow-glow-blue mb-4">
            <span className="text-2xl font-black text-white">N</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            NEC <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Placement</span> Treasure
          </h1>
          <p className="text-dark-400 mt-2 text-sm">Your gateway to placement success</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl border border-dark-700/50">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
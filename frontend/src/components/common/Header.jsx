import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth.js';
import { logoutThunk } from '../../store/slices/authSlice.js';
import Spinner from './Spinner.jsx';

const NAV_LINKS = [
  { label: 'Home',             to: '/',           roles: ['student','staff','dept_head','admin'] },
  { label: 'Leaderboard',      to: '/leaderboard',roles: ['student','staff','dept_head','admin'] }, 
  { label: 'Progress Explorer',to: '/progress',   roles: ['student','staff','dept_head','admin'] },
];

export default function Header() {
  const { user, role, profile, medals } = useAuth();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [open,       setOpen]       = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await dispatch(logoutThunk());
    navigate('/login');
  };

  const getRoleLabel = () => {
    if (role === 'student')   return 'Student';
    if (role === 'staff')     return 'Staff';
    if (role === 'dept_head') return 'Head of Department';
    if (role === 'admin')     return 'Administrator';
    return '';
  };

  const getDeptLabel = () => {
    if (role === 'admin') return null;
    return profile?.dept_code || profile?.dept_name || null;
  };

  const filtered = NAV_LINKS.filter((n) => n.roles.includes(role));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 glass border-b border-dark-700/50">
      <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center gap-5">

        {/* ── Logo + App Name ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-11 h-11 shrink-0">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl opacity-20 group-hover:opacity-40 blur-sm transition-opacity" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-glow-blue">
              {/* Treasure chest icon */}
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 4a1 1 0 00-1 1v2h16V5a1 1 0 00-1-1H5z" opacity="0.7"/>
                <path d="M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9H3zm9 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
                <path d="M9 7h6v-.5A3 3 0 009 7z" opacity="0.5"/>
              </svg>
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-lg font-black text-white tracking-tight">
              NEC{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                Placement
              </span>
              {' '}Treasure
            </span>
            <span className="text-[10px] text-dark-500 font-medium tracking-widest uppercase">
              Campus Recruitment Portal
            </span>
          </div>
          {/* Mobile short name */}
          <div className="flex sm:hidden flex-col leading-none">
            <span className="text-sm font-black text-white">
              NEC{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">PT</span>
            </span>
          </div>
        </Link>

        {/* ── Divider ── */}
        {user && <div className="hidden md:block w-px h-8 bg-dark-700 shrink-0 mx-1" />}

        {/* ── User Identity ── */}
        {user && (
          <div className="hidden md:flex flex-col justify-center min-w-0 shrink-0 max-w-[180px]">
            <span className="text-base font-semibold text-white truncate leading-tight">
              {user.full_name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md
                ${role === 'admin'     ? 'bg-rose-500/15 text-rose-400'
                : role === 'dept_head' ? 'bg-purple-500/15 text-purple-400'
                : role === 'staff'     ? 'bg-amber-500/15 text-amber-400'
                :                        'bg-primary-500/15 text-primary-400'}`}>
                {getRoleLabel()}
              </span>
              {getDeptLabel() && (
                <span className="text-xs text-dark-500 truncate">{getDeptLabel()}</span>
              )}
            </div>
          </div>
        )}

        {/* ── Student Medals ── */}
        {medals && (
          <div className="hidden lg:flex items-center gap-2 ml-1">

            {/* Score */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 group hover:bg-amber-500/15 transition-colors">
              <svg className="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-amber-300 text-xs font-bold">{medals.total_score}</span>
              <span className="text-amber-600 text-xs">pts</span>
            </div>

            {/* Rank */}
            <div className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-xl px-3 py-1.5 hover:bg-primary-500/15 transition-colors">
              <svg className="w-4 h-4 text-primary-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5 3v18h2V13h9l-2-4 2-4H7V3H5z" />
              </svg>
              <span className="text-primary-300 text-xs font-bold">
                {medals.global_rank !== '-' && medals.global_rank !== null
                  ? `#${medals.global_rank}`
                  : 'N/A'}
              </span>
            </div>

            {/* Solved */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 hover:bg-emerald-500/15 transition-colors">
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              <span className="text-emerald-300 text-xs font-bold">{medals.programs_solved}</span>
              <span className="text-emerald-600 text-xs">solved</span>
            </div>

          </div>
        )}

        {/* ── Spacer ── */}
        <div className="flex-1" />

        {/* ── Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {filtered.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`relative px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-200
                ${location.pathname === n.to
                  ? 'text-white bg-dark-800'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/60'}`}
            >
              {location.pathname === n.to && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-500 rounded-full" />
              )}
              {n.label}
            </Link>
          ))}
        </nav>

        {/* ── Profile Dropdown ── */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative w-11 h-11 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-blue hover:scale-105 transition-transform"
          >
            {user?.full_name?.[0]?.toUpperCase() || 'U'}
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-dark-900 rounded-full" />
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-72 glass rounded-2xl border border-dark-700 shadow-2xl animate-slide-down overflow-hidden">

              {/* User info header */}
              <div className="px-4 py-3.5 border-b border-dark-700 bg-dark-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
                    <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Role badge inside dropdown */}
                <div className="mt-2.5 flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md
                    ${role === 'admin'     ? 'bg-rose-500/15 text-rose-400'
                    : role === 'dept_head' ? 'bg-purple-500/15 text-purple-400'
                    : role === 'staff'     ? 'bg-amber-500/15 text-amber-400'
                    :                        'bg-primary-500/15 text-primary-400'}`}>
                    {getRoleLabel()}
                  </span>
                  {getDeptLabel() && (
                    <span className="text-xs text-dark-500">{getDeptLabel()}</span>
                  )}
                </div>
              </div>

              {/* Student medals inside dropdown (mobile) */}
              {medals && (
                <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between lg:hidden">
                  <div className="text-center">
                    <p className="text-amber-300 text-sm font-bold">{medals.total_score}</p>
                    <p className="text-dark-500 text-xs">Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary-300 text-sm font-bold">
                      {medals.global_rank !== '-' && medals.global_rank !== null
                        ? `#${medals.global_rank}` : 'N/A'}
                    </p>
                    <p className="text-dark-500 text-xs">Rank</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-300 text-sm font-bold">{medals.programs_solved}</p>
                    <p className="text-dark-500 text-xs">Solved</p>
                  </div>
                </div>
              )}

<div className="p-2">
  
{role === 'admin' && (
  <>
    <Link
      to="/admin/students"
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/80 transition-all text-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7" />
      </svg>
      Manage Students
    </Link>

    <Link
      to="/admin/programs"
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/80 transition-all text-sm"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9.75 17L8 21l-1.75-4M4 4h16v10H4z" />
      </svg>
      Manage Programs
    </Link>
  </>
)}
<Link
  to="/profile"
  onClick={() => setOpen(false)}
  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-dark-300 hover:text-white hover:bg-dark-700/80 transition-all text-sm"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
  View Profile
</Link>

<button
  onClick={handleLogout}
  disabled={loggingOut}
  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-sm disabled:opacity-50"
>
  {loggingOut
    ? <Spinner size="sm" color="white" />
    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
  }
  {loggingOut ? 'Logging out...' : 'Logout'}
</button>

</div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTPAPI } from '../../api/authAPI.js';
import Spinner from '../common/Spinner.jsx';

export default function VerifyOTPForm() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user_id, email } = location.state || {};

  const [otp,           setOtp]           = useState(['', '', '', '', '', '']);
  const [newPass,       setNewPass]       = useState('');
  const [confirmPass,   setConfirmPass]   = useState('');
  const [showNewPass,   setShowNewPass]   = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);
  const [error,         setError]         = useState(null);
  const [success,       setSuccess]       = useState(false);
  const inputRefs = useRef([]);

  if (!user_id) {
    navigate('/forgot-password');
    return null;
  }

  const handleOtpChange = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val.slice(-1);
    setOtp(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const otpStr = otp.join('');
    if (otpStr.length !== 6) return setError('Please enter the complete 6-digit OTP.');
    if (newPass.length < 8)  return setError('Password must be at least 8 characters.');
    if (newPass !== confirmPass) return setError('Passwords do not match.');

    setIsLoading(true);
    try {
      await verifyOTPAPI({ user_id, otp: otpStr, new_password: newPass, confirm_password: confirmPass });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white">Password Changed!</h3>
        <p className="text-dark-400 text-sm text-center">Redirecting you to login...</p>
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
        <p className="text-dark-400 text-sm mt-1">
          Enter the 6-digit OTP sent to{' '}
          <span className="text-primary-400 font-medium">{email}</span>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 animate-fade-in">
          <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-rose-400 text-sm">{error}</p>
        </div>
      )}

      {/* OTP boxes */}
      <div>
        <label className="label">One-Time Password</label>
        <div className="flex gap-2 justify-between" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
              className={`w-12 h-12 text-center text-xl font-bold bg-dark-800 border rounded-xl
                text-white focus:outline-none transition-all duration-200
                ${digit ? 'border-primary-500 shadow-glow-blue' : 'border-dark-600'}
                focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
            />
          ))}
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="label">New Password</label>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <input
            type={showNewPass ? 'text' : 'password'}
            value={newPass}
            onChange={(e) => { setError(null); setNewPass(e.target.value); }}
            placeholder="Min. 8 characters"
            required
            className="input-field pl-10 pr-12"
          />
          <button type="button" onClick={() => setShowNewPass((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={showNewPass
                  ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                } />
            </svg>
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="label">Confirm Password</label>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <input
            type={showConfirmPass ? 'text' : 'password'}
            value={confirmPass}
            onChange={(e) => { setError(null); setConfirmPass(e.target.value); }}
            placeholder="Re-enter password"
            required
            className={`input-field pl-10 ${
              confirmPass && newPass !== confirmPass ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
            }`}
          />
          <button type="button" onClick={() => setShowConfirmPass((p) => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={showConfirmPass
                  ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                } />
            </svg>
          </button>
        </div>
        {confirmPass && newPass !== confirmPass && (
          <p className="text-rose-400 text-xs mt-1">Passwords do not match</p>
        )}
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
        {isLoading ? <><Spinner size="sm" color="white" /> Changing Password...</> : 'Change Password'}
      </button>
    </form>
  );
}
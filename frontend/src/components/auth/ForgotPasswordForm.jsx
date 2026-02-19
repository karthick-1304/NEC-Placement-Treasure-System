import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordAPI } from '../../api/authAPI.js';
import Spinner from '../common/Spinner.jsx';

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email,     setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await forgotPasswordAPI({ email });
      navigate('/verify-otp', { state: { user_id: data.data.user_id, email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
        <p className="text-dark-400 text-sm mt-1">Enter your email and we'll send you an OTP</p>
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

      <div>
        <label className="label">Email Address</label>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <input
            type="email"
            value={email}
            onChange={(e) => { setError(null); setEmail(e.target.value); }}
            placeholder="Enter your registered email"
            required
            className="input-field pl-10"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary w-full py-3">
        {isLoading ? <><Spinner size="sm" color="white" /> Sending OTP...</> : 'Send OTP'}
      </button>

      <button type="button" onClick={() => window.history.back()}
        className="btn-secondary w-full py-3">
        Back to Login
      </button>
    </form>
  );
}
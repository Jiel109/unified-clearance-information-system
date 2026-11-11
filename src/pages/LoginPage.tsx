import React, { useState } from 'react';
import { authService } from '../services/auth_service';
import type { UserSession } from '../types';
import { Loader2 } from 'lucide-react';

interface Props {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const userSession = await authService.signIn(identifier, password);
      onLoginSuccess(userSession);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002d62] via-[#001f44] to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border-t-8 border-[#fec810] w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002d62] tracking-tight">
            Unified Clearance System
          </h2>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg leading-relaxed">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Username or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter username or email"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002d62] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002d62] focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#002d62] hover:bg-[#002046] disabled:opacity-60 text-[#fec810] font-bold rounded-lg text-sm tracking-wide shadow-md transition transform active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : null}
            <span>{loading ? 'Authenticating...' : 'Log In'}</span>
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Document Request & Clearance Portal
          </p>
        </div>
      </div>
    </div>
  );
};
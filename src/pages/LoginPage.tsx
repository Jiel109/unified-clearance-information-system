import React, { useState } from 'react';
import type { UserRole } from '../types';

interface Props {
  onLogin: (role: UserRole, identifier: string) => void;
}

const ROLES: UserRole[] = [
  'Student',
  'Registrar',
  'Library',
  'Accounting',
  'Guidance Office',
  'MIS',
  'Student Affairs'
];

export const LoginPage: React.FC<Props> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const getIdentifierPlaceholder = (role: UserRole): string => {
    switch (role) {
      case 'Student':
        return 'e.g. lopez.368966@caloocan.sti.edu.ph';
      case 'Registrar':
        return 'e.g. REG-01';
      case 'Library':
        return 'e.g. LIB-02';
      case 'Accounting':
        return 'e.g. ACC-01';
      case 'Guidance Office':
        return 'e.g. GUID-01';
      case 'MIS':
        return 'e.g. MIS-01';
      case 'Student Affairs':
        return 'e.g. OSA-01';
      default:
        return 'Enter your ID or Email';
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(''); // Clears input so the dynamic placeholder displays
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole, identifier);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002d62] via-[#001f44] to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border-t-8 border-[#fec810] w-full max-w-md p-8 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#002d62] tracking-tight">
            Unified Clearance System
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection Dropdown */}
          <div>
            <label 
              htmlFor="role-select" 
              className="block text-xs font-bold text-slate-600 uppercase mb-1"
            >
              Select User Role
            </label>
            <div className="relative">
              <select
                id="role-select"
                aria-label="Select User Role"
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-[#002d62] shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#002d62] focus:border-transparent cursor-pointer"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role} className="text-slate-800 py-1 font-medium">
                    {role}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#002d62]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* User ID Input with Dynamic Placeholder */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              {selectedRole === 'Student' ? 'Student ID / Email' : 'Personnel ID'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={getIdentifierPlaceholder(selectedRole)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#002d62] focus:border-transparent"
              required
            />
          </div>

          {/* Password Input */}
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

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-[#002d62] hover:bg-[#002046] text-[#fec810] font-bold rounded-lg text-sm tracking-wide shadow-md transition transform active:scale-[0.99]"
          >
            Log In
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Clearance & Request Gateway
          </p>
        </div>
      </div>
    </div>
  );
};
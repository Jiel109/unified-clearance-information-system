import React from 'react';
import type { UserSession } from '../types';

interface Props {
  session: UserSession;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const NavBar: React.FC<Props> = ({
  session,
  activeTab,
  setActiveTab,
  onOpenProfile,
  onLogout
}) => {
  const isStudent = session.role === 'Student';
  const isRegistrar = session.role === 'Registrar';

  return (
    <header className="bg-[#002d62] text-white shadow sticky top-0 z-40 border-b-4 border-[#fec810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 min-h-16 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <h1 className="font-bold text-sm sm:text-base md:text-lg leading-tight tracking-wide">
                Unified Clearance Information System
              </h1>
              <p className="text-xs text-yellow-300">Registrar's Office</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{session.name}</span>
              <span className="text-[11px] font-semibold text-[#fec810] uppercase tracking-wider">
                {session.role} ({session.identifier})
              </span>
            </div>

            {isStudent && (
              <button
                onClick={onOpenProfile}
                className="text-xs bg-[#fec810] hover:bg-yellow-400 text-[#002d62] font-bold px-3 py-1.5 rounded transition shadow-sm"
              >
                Profile
              </button>
            )}

            <button
              onClick={onLogout}
              className="text-xs border border-white/60 hover:bg-white/10 text-white font-semibold px-3 py-1.5 rounded transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tabs based on Role */}
        <nav className="flex space-x-1 border-t border-blue-900/60 overflow-x-auto text-sm">
          {isStudent && (
            <>
              <button
                onClick={() => setActiveTab('student-requests')}
                className={`py-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === 'student-requests'
                    ? 'border-[#fec810] text-[#fec810]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Document Requests
              </button>
              <button
                onClick={() => setActiveTab('scheduling')}
                className={`py-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === 'scheduling'
                    ? 'border-[#fec810] text-[#fec810]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Pick-up Schedule
              </button>
            </>
          )}

          {isRegistrar && (
            <>
              <button
                onClick={() => setActiveTab('registrar-audit')}
                className={`py-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === 'registrar-audit'
                    ? 'border-[#fec810] text-[#fec810]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Clearance Matrix (Read-Only)
              </button>
              <button
                onClick={() => setActiveTab('scheduling')}
                className={`py-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === 'scheduling'
                    ? 'border-[#fec810] text-[#fec810]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Release Verification & Slots
              </button>
              <button
                onClick={() => setActiveTab('student-records')}
                className={`py-2.5 px-3 font-medium transition border-b-2 whitespace-nowrap ${
                  activeTab === 'student-records'
                    ? 'border-[#fec810] text-[#fec810]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                Student Records
              </button>
            </>
          )}

          {!isStudent && !isRegistrar && (
            <button
              onClick={() => setActiveTab('department-clearance')}
              className="py-2.5 px-3 font-medium border-b-2 border-[#fec810] text-[#fec810] whitespace-nowrap"
            >
              Department Clearance Review
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
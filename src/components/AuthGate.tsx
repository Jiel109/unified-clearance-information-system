import React, { useState, useEffect } from "react";
import type { UserSession } from "../types";
import { authService } from "../services/auth_service";
import { LoginPage } from "../pages/LoginPage";
import { AppLayout } from "./AppLayout";
import { Loader2 } from "lucide-react";

// Auth Gate handles authentication state (either navigates to a logged in page or not)
export const AuthGate: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initSession = async () => {
      if (authService.isSessionExpired()) {
        await authService.signOut();
        setSession(null);
        setLoading(false);
        return;
      }

      try {
        const rawSession = await authService.getSession();
        if (rawSession) {
          const profile = await authService.getCurrentProfile();
          setSession(profile);
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { subscription } = authService.onAuthStateChange(
      async (event, currentSession) => {
        if (
          authService.isSessionExpired() ||
          event === "SIGNED_OUT" ||
          !currentSession
        ) {
          setSession(null);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          const profile = await authService.getCurrentProfile();
          setSession(profile);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-3 p-4">
        <div className="p-4 rounded-2xl bg-[#002d62] text-[#fec810] shadow-xl border-2 border-[#fec810] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <p className="text-[#002d62] font-bold text-sm tracking-wider uppercase">
          Verifying Clearance System Credentials...
        </p>
      </div>
    );
  }

  return session ? (
    <AppLayout session={session} onSignOut={() => setSession(null)} />
  ) : (
    <LoginPage onLoginSuccess={(user) => setSession(user)} />
  );
};

export default AuthGate;

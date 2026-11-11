import {
  createClient,
  type SupabaseClient,
  type Session,
} from "@supabase/supabase-js";
import type { UserSession, UserRole } from "../types";

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const BROWSER_SESSION_COOKIE = "ucis_browser_session";

// Signs out current session if browser is closed
if (typeof window !== "undefined") {
  try {
    const hasMarker = () =>
      document.cookie
        .split("; ")
        .some((c) => c.startsWith(`${BROWSER_SESSION_COOKIE}=`));

    if (!hasMarker()) {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${BROWSER_SESSION_COOKIE}=1; path=/; SameSite=Lax${secure}`;

      if (hasMarker()) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  } catch {}
}

// Session handling
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const authService = {
  isSessionExpired(): boolean {
    return false;
  },

  // Sign in
  async signIn(identifier: string, password: string): Promise<UserSession> {
    let targetEmail = identifier.trim();

    if (!targetEmail.includes("@")) {
      const { data, error: rpcError } = await supabase.rpc(
        "get_email_by_identifier",
        { p_identifier: targetEmail },
      );

      if (rpcError) {
        console.error("RPC Error:", rpcError);
        throw new Error(`Username lookup failed: ${rpcError.message}`);
      }
      if (!data) {
        throw new Error("Invalid login credentials.");
      }
      targetEmail = data;
    }

    console.log("Attempting signInWithPassword for email:", targetEmail);

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: password.trim(),
      });

    if (authError || !authData.user) {
      console.error("Supabase Auth Error:", authError);
      throw new Error(authError?.message || "Invalid login credentials.");
    }

    const profile = await this.getCurrentProfile();
    if (!profile) {
      throw new Error(
        "User record found, but institutional profile is missing.",
      );
    }

    return profile;
  },

  // Display/Read Profile
  async getCurrentProfile(): Promise<UserSession | null> {
    const { data, error } = await supabase.rpc("get_my_profile");
    if (error || !data || data.length === 0) {
      return null;
    }

    const user = data[0];
    return {
      id: user.id,
      username: user.username,
      role: user.role as UserRole,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      contactNumber: user.contact_number,
      course: user.course,
      yearLevel: user.year_level,
      description: user.description,
    };
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      await Promise.race([
        supabase.auth.signOut(),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch (err: any) {
      console.warn("Sign out fallback error:", err?.message);
    }
  },

  // Gets current user session
  async getSession(): Promise<Session | null> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) return null;
      return session;
    } catch {
      return null;
    }
  },

  onAuthStateChange(
    callback: (event: string, session: Session | null) => void,
  ) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return {
      subscription: {
        unsubscribe: () => {
          data?.subscription?.unsubscribe();
        },
      },
    };
  },
};

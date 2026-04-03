import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

type UserRole = "consumer" | "business" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: UserRole;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching role:", error);
        return null;
      }
      return (data?.role as UserRole) ?? null;
    } catch {
      return null;
    }
  };

  const refreshRole = async () => {
    if (user) {
      const role = await fetchRole(user.id);
      setUserRole(role);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch role after sign-in
          const role = await fetchRole(session.user.id);
          setUserRole(role);

          if (event === "SIGNED_IN") {
            setTimeout(() => {
              if (!role) {
                navigate("/select-role", { replace: true });
              } else if (role === "business") {
                navigate("/dashboard-business", { replace: true });
              } else {
                navigate("/", { replace: true });
              }
            }, 100);
          }
        } else {
          setUserRole(null);
        }

        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const role = await fetchRole(session.user.id);
        setUserRole(role);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/", { replace: true });

    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch (err) {
      console.error("Sign out exception:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, userRole, signOut, refreshRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

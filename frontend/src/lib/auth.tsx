import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "family" | "caregiver" | "admin";
};

type AuthResponse = { user: AuthUser; token: string };
type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  signup(input: { name: string; email: string; password: string; role: "family" | "caregiver" }): Promise<void>;
  logout(): void;
};

const STORAGE_KEY = "befine-auth";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): AuthResponse | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) as AuthResponse : null;
  } catch {
    return null;
  }
}

async function authRequest(path: string, body: unknown): Promise<AuthResponse> {
  const response = await fetch(`/api/auth/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json() as AuthResponse & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Authentication failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(() => readStoredAuth());

  const save = (value: AuthResponse | null) => {
    setAuth(value);
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(() => ({
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    async login(email, password) {
      save(await authRequest("login", { email, password }));
    },
    async signup(input) {
      save(await authRequest("signup", input));
    },
    logout() { save(null); },
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

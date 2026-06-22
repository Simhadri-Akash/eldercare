import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const auth = useAuth();
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"family" | "caregiver">("family");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignup) await auth.signup({ name, email, password, role });
      else await auth.login(email, password);
      navigate(role === "caregiver" ? "/caregiver-dashboard" : "/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to continue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-xl border-primary/15">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-3 inline-flex items-center gap-2 text-primary font-bold text-xl">
            <Heart className="fill-primary/15" /> Befine
          </Link>
          <CardTitle>{isSignup ? "Create your account" : "Welcome back"}</CardTitle>
          <CardDescription>{isSignup ? "Coordinate care with your trusted circle." : "Sign in to manage care securely."}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {isSignup && <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} /></div>}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={isSignup ? 8 : 1} /></div>
            {isSignup && <div className="space-y-2"><Label htmlFor="role">I am joining as</Label><select id="role" value={role} onChange={(e) => setRole(e.target.value as "family" | "caregiver")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="family">Family member</option><option value="caregiver">Caregiver</option></select></div>}
            {error && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>{submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{isSignup ? "Create account" : "Sign in"}</Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account? " : "New to Befine? "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-medium text-primary hover:underline">{isSignup ? "Sign in" : "Create account"}</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

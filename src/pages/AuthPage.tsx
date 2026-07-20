import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/site/SEO";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const AuthPage = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) nav("/admin", { replace: true });
  }, [user, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else nav("/admin");
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) toast.error(error.message);
      else toast.success("Account created. Check email if confirmation is enabled.");
    }
    setBusy(false);
  };

  return (
    <>
      <SEO title="Sign in" description="Editorial access." path="/auth" />
      <div className="container-editorial py-24 max-w-md">
        <p className="kicker">Editorial access</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="kicker">Email</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <div>
            <label className="kicker">Password</label>
            <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-rule bg-transparent py-2 focus:border-foreground focus:outline-none" />
          </div>
          <button disabled={busy} className="w-full border border-foreground bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:bg-transparent hover:text-foreground transition-colors disabled:opacity-50">
            {busy ? "Working…" : mode === "sign-in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="mt-6 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </>
  );
};

export default AuthPage;

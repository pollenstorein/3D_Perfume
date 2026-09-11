import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";

export type User = { id?: string; name: string; email: string; password?: string };

export type ProfileSettingsProps = {
  open: boolean;
  user: User | null;
  provider: string;
  onClose: () => void;
  onPasswordChange: (password: string) => Promise<void>;
};

type AuthModalProps = {
  open: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  onSubmit: (payload: { name: string; email: string; password: string }) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  onModeChange: (mode: "login" | "signup") => void;
  user: User | null;
};

export function AuthModal({ open, mode, onClose, onSubmit, onGoogleSignIn, onModeChange, user }: AuthModalProps) {
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    if (open) {
      setForm({ name: user?.name ?? "", email: user?.email ?? "", password: "" });
      setError("");
    }
  }, [open, user]);

  if (!open) return null;

  return <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]" onClick={event => event.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between gap-4"><div><p className="text-[10px] tracking-[0.35em] uppercase text-black/45">Know Pollen</p><h3 className="mt-2 text-2xl font-bold tracking-tight text-black">{isSignup ? "Create account" : "Welcome back"}</h3></div><button onClick={onClose} aria-label="Close login" className="flex h-9 w-9 items-center justify-center border border-black/10 text-black transition-colors hover:bg-black hover:text-white"><X size={16} /></button></div>
        <div className="mb-5 grid grid-cols-2 overflow-hidden rounded-xl border border-black/10 bg-[#f5f5f3] p-1"><button type="button" onClick={() => { setError(""); onModeChange("login"); }} className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${!isSignup ? "bg-black text-white" : "text-black/65"}`}>Login</button><button type="button" onClick={() => { setError(""); onModeChange("signup"); }} className={`rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] ${isSignup ? "bg-black text-white" : "text-black/65"}`}>Sign up</button></div>
        <button type="button" disabled={submitting} onClick={async () => { setError(""); setSubmitting(true); try { await onGoogleSignIn(); } catch (signInError) { setError(signInError instanceof Error ? signInError.message : "Unable to continue with Google."); setSubmitting(false); } }} className="flex w-full items-center justify-center gap-3 border border-black/15 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-black hover:bg-[#f5f5f3] disabled:cursor-wait disabled:opacity-60"><span className="text-base font-semibold normal-case tracking-normal">G</span> Continue with Google</button>
        <div className="my-5 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/35"><span className="h-px flex-1 bg-black/10" />Or continue with email<span className="h-px flex-1 bg-black/10" /></div>
        <form onSubmit={async event => { event.preventDefault(); setError(""); setSubmitting(true); try { await onSubmit({ ...form, name: form.name.trim(), email: form.email.trim() }); } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "Unable to authenticate. Please try again."); } finally { setSubmitting(false); } }} className="space-y-4">
          {isSignup && <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Full name</span><input type="text" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-black" placeholder="Alex Morgan" /></label>}
          <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Email</span><input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-black" placeholder="hello@knowpollen.com" /></label>
          <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Password</span><input type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-black" placeholder="********" /></label>
          {error && <p data-auth-error className="text-sm text-red-600">{error}</p>}
          {!error && <p data-auth-error className="sr-only" aria-live="polite" />}
          <button type="submit" disabled={submitting} className="mt-2 w-full bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60">{submitting ? "Please wait" : isSignup ? "Create account" : "Log in"}</button>
        </form>
      </motion.div>
    </motion.div>
  </AnimatePresence>;
}

export function ProfileSettings({ open, user, provider, onClose, onPasswordChange }: ProfileSettingsProps) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isGoogleUser = provider === "google";

  useEffect(() => {
    if (open) { setPassword(""); setConfirmation(""); setMessage(""); setError(""); }
  }, [open]);

  if (!open || !user) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setMessage("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmation) return setError("Passwords do not match.");
    setSubmitting(true);
    try {
      await onPasswordChange(password);
      setPassword(""); setConfirmation("");
      setMessage(isGoogleUser ? "Password created successfully." : "Password updated successfully.");
    } catch (passwordError) {
      setError(passwordError instanceof Error ? passwordError.message : "Unable to update your password.");
    } finally { setSubmitting(false); }
  };

  return <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4" onClick={onClose}><motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)]" onClick={event => event.stopPropagation()}><div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.35em] text-black/45">Account</p><h3 className="mt-2 text-2xl font-bold tracking-tight">Profile settings</h3></div><button type="button" onClick={onClose} aria-label="Close profile settings" className="flex h-9 w-9 items-center justify-center border border-black/10 hover:bg-black hover:text-white"><X size={16} /></button></div><div className="space-y-4 border-y border-black/10 py-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Name</p><p className="mt-1 text-sm">{user.name || "Not provided"}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Email</p><p className="mt-1 break-all text-sm">{user.email}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Signed in with</p><p className="mt-1 text-sm capitalize">{provider || "email"}</p></div></div>{isGoogleUser && <form onSubmit={handleSubmit} className="mt-6 space-y-4"><div><h4 className="text-xs font-bold uppercase tracking-[0.2em]">Create or change password</h4><p className="mt-2 text-sm leading-relaxed text-black/55">Use a password to sign in with email as well as Google.</p></div><label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">New password</span><input type="password" minLength={6} value={password} onChange={event => setPassword(event.target.value)} className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-black" autoComplete="new-password" /></label><label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-black/60">Confirm password</span><input type="password" minLength={6} value={confirmation} onChange={event => setConfirmation(event.target.value)} className="w-full border border-black/10 bg-[#faf9f7] px-4 py-3 text-sm outline-none focus:border-black" autoComplete="new-password" /></label><button type="submit" disabled={submitting} className="w-full bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60">{submitting ? "Saving" : "Save password"}</button></form>}{message && <p className="mt-4 text-sm text-green-700" aria-live="polite">{message}</p>}{error && <p className="mt-4 text-sm text-red-600" aria-live="polite">{error}</p>}</motion.div></motion.div></AnimatePresence>;
}

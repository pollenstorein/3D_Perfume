import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export type User = { name: string; email: string; password?: string };

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

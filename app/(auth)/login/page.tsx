'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Cpu } from 'lucide-react';
import Image from 'next/image';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', { redirect: false, email, password, callbackUrl });
      if (res?.error) setError('Invalid credentials');
      else { router.push(callbackUrl); router.refresh(); }
    } catch { setError('An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md mx-auto relative z-10 animate-fade-in py-12 px-2">
      <div className="mb-10 text-center">
        <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8 group">
          <div className="p-2 bg-gradient-to-br from-brand-400 to-cyan-500 rounded-xl shadow-[0_0_16px_rgba(20,184,166,0.4)]">
            <Cpu size={18} className="text-black" />
          </div>
          <span className="font-display font-black text-lg tracking-tight text-white">
            FrameRate<span className="text-brand-400">.</span>
          </span>
        </Link>
        <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2">Welcome Back</h1>
        <p className="text-sm text-white/35">Sign in to access your account.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm mb-6 text-center animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">Email</label>
          <input
            type="email" required
            className="input-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between pl-1">
            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Password</label>
            <Link href="#" className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors">Forgot?</Link>
          </div>
          <input
            type="password" required
            className="input-base font-mono tracking-widest"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="button-primary w-full py-3.5 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 group mt-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Sign In <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/8 text-center">
        <p className="text-sm text-white/35">
          No account?{' '}
          <Link href="/register" className="text-brand-400 hover:text-brand-300 font-semibold ml-1 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex absolute inset-0 z-50 overflow-hidden bg-[#050507]">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 bg-[#080809] border-r border-white/6 overflow-hidden">
        <Image
          src="/images/ui/auth-login.png"
          alt="Tech Lab"
          fill
          className="object-cover opacity-20 scale-105"
        />
        {/* Clean gradient overlay — just darkens from bottom, no blend modes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/50 to-transparent" />
        {/* Subtle teal tint at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-brand-500/10 to-transparent" />

        <div className="relative z-10 max-w-sm mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu size={12} /> Premium Hardware
          </div>
          <h2 className="text-4xl font-display font-black text-white mb-4 leading-tight tracking-tight">
            Next-Gen Hardware<br />For Next-Gen Creators.
          </h2>
          <p className="text-white/35 text-sm leading-relaxed">
            Gain access to exclusive inventory drops, order tracking, and a seamless checkout experience.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        <div className="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-brand-500/8 blur-[120px] rounded-full -translate-y-1/4 translate-x-1/4" />
        <Suspense fallback={<div className="text-brand-400 text-sm animate-pulse">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

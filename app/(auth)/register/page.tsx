'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Cpu, UserPlus } from 'lucide-react';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Something went wrong');
      else { router.push('/'); router.refresh(); }
    } catch { setError('An error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex absolute inset-0 z-50 overflow-hidden bg-[#050507]">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 bg-[#080809] border-r border-white/6 overflow-hidden">
        <Image
          src="/images/ui/auth-register.png"
          alt="Tech Lab"
          fill
          className="object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080809] via-[#080809]/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-purple-500/8 to-transparent" />

        <div className="relative z-10 max-w-sm mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
            <UserPlus size={12} /> New Account
          </div>
          <h2 className="text-4xl font-display font-black text-white mb-4 leading-tight tracking-tight">
            Join the Vanguard<br />of Elite Gamers.
          </h2>
          <p className="text-white/35 text-sm leading-relaxed">
            Create an account to track your loadouts, accelerate checkouts, and manage your arsenal.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-y-auto py-16">
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-purple-500/8 blur-[120px] rounded-full translate-y-1/4 translate-x-1/4" />

        <div className="w-full max-w-md mx-auto relative z-10 animate-fade-in">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-8 group lg:hidden">
              <div className="p-2 bg-gradient-to-br from-brand-400 to-cyan-500 rounded-xl">
                <Cpu size={16} className="text-black" />
              </div>
              <span className="font-display font-black text-lg text-white">FrameRate<span className="text-brand-400">.</span></span>
            </Link>
            <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-sm text-white/35">Fill in the details to get started.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-xl text-sm mb-6 text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@domain.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••', mono: true },
              { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: '••••••••', mono: true },
            ].map(({ label, key, type, placeholder, mono }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">{label}</label>
                <input
                  type={type}
                  required
                  className={`input-base${mono ? ' font-mono tracking-widest' : ''}`}
                  value={formData[key as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  placeholder={placeholder}
                />
              </div>
            ))}

            <button
              type="submit" disabled={loading}
              className="button-primary w-full py-3.5 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/8 text-center">
            <p className="text-sm text-white/35">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-semibold ml-1 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

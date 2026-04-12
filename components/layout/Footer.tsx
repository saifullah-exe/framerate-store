'use client';

import Link from 'next/link';
import { Cpu, Github, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/8 bg-[#050507] pt-16 pb-8 overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-32 bg-brand-500/8 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10 mb-14">
        <div className="md:col-span-5">
          <Link href="/" className="flex items-center gap-2.5 mb-6 group w-max">
            <div className="p-2 bg-white/[0.06] rounded-xl border border-white/8 group-hover:border-brand-500/30 transition-colors">
              <Cpu size={20} className="text-white/70" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white/80 group-hover:text-white transition-colors">
              FrameRate<span className="text-brand-400">.</span>
            </span>
          </Link>
          <p className="text-white/30 text-sm leading-relaxed max-w-xs mb-8">
            Engineered for performance. Designed for aesthetics. The ultimate destination for premium gaming hardware in the region.
          </p>
          <div className="flex gap-3">
            {[Twitter, Github, Youtube].map((Icon, idx) => (
              <a key={idx} href="#" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display font-bold mb-5 text-white/70 text-sm uppercase tracking-widest">Hardware</h4>
          <ul className="space-y-3 text-sm text-white/30">
            {[
              { href: '/products', label: 'All Laptops' },
              { href: '/products?category=ultra', label: 'Ultra High-End' },
              { href: '/products?brand=ASUS', label: 'ROG Series' },
              { href: '/products?brand=Razer', label: 'Razer Blade' },
            ].map(({ href, label }) => (
              <li key={label}><Link href={href} className="hover:text-brand-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-display font-bold mb-5 text-white/70 text-sm uppercase tracking-widest">Support</h4>
          <ul className="space-y-3 text-sm text-white/30">
            {[
              { href: '/profile', label: 'Account' },
              { href: '/orders', label: 'Order Tracking' },
              { href: '#', label: 'Warranty Info' },
              { href: '#', label: 'Contact' },
            ].map(({ href, label }) => (
              <li key={label}><Link href={href} className="hover:text-brand-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-display font-bold mb-5 text-white/70 text-sm uppercase tracking-widest">Newsletter</h4>
          <p className="text-sm text-white/30 mb-4 leading-relaxed">Exclusive drops and hardware news delivered weekly.</p>
          <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-brand-500/50 transition-all"
            />
            <button className="px-4 py-2.5 bg-brand-500 text-black text-sm font-bold rounded-xl hover:bg-brand-400 transition-colors shadow-[0_0_16px_rgba(20,184,166,0.3)]">
              →
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-6 border-t border-white/6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/20">
        <p>© {new Date().getFullYear()} FrameRate Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white/50 transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white/50 transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

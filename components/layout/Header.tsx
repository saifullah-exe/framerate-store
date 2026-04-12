'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, User, Menu, X, LogOut, Package, Cpu, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070a]/95 border-b border-white/8 py-3 shadow-[0_1px_0_rgba(255,255,255,0.04),0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-5'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(16px)' : 'none' }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-brand-400 to-cyan-500 rounded-xl shadow-[0_0_16px_rgba(20,184,166,0.4)] group-hover:shadow-[0_0_24px_rgba(20,184,166,0.6)] transition-shadow duration-300">
              <Cpu size={20} className="text-black" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white">
              FrameRate<span className="text-brand-400">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex gap-0.5 bg-white/[0.04] border border-white/8 rounded-full px-3 py-1.5">
            {[
              { href: '/', label: 'Explore' },
              { href: '/products', label: 'Hardware' },
              { href: '/products?category=ultra', label: 'Premium' },
            ].map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="px-4 py-1.5 text-sm font-medium text-white/50 hover:text-white hover:bg-white/8 rounded-full transition-all duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className={`relative hidden md:flex items-center transition-all duration-300 ${searchOpen ? 'w-56' : 'w-9'}`}
          >
            <input
              type="text"
              placeholder="Search hardware..."
              className={`w-full bg-[#0f0f11] border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white placeholder-white/25
                focus:outline-none focus:border-brand-500/60 transition-all duration-300
                ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className={`absolute right-0 p-2 text-white/40 hover:text-white transition-colors rounded-full ${!searchOpen && 'hover:bg-white/8'}`}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2.5 text-white/50 hover:text-white hover:bg-white/8 rounded-full transition-all duration-200 group"
          >
            <ShoppingCart size={18} className="group-hover:scale-110 transition-transform" />
            {mounted && cartItemsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-brand-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(20,184,166,0.7)]">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 hover:bg-white/8 rounded-full transition-all focus:outline-none"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1e] flex items-center justify-center border border-white/10 text-white/50">
                    <User size={14} />
                  </div>
                )}
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-52 glass rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-up origin-top-right border border-white/10">
                  <div className="px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                    <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
                    <p className="text-xs text-white/35 truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={14} /> Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/8 rounded-xl transition-all"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package size={14} /> Orders
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-white/8">
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-400/80 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/8">
                Log in
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm font-bold bg-brand-500 text-black hover:bg-brand-400 transition-colors rounded-xl shadow-[0_0_16px_rgba(20,184,166,0.3)]">
                Sign up
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 text-white/50 hover:text-white bg-white/5 rounded-xl ml-1 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#07070a]/98 border-b border-white/8 p-4 flex flex-col gap-1.5 shadow-2xl animate-fade-in"
          style={{ backdropFilter: 'blur(20px)' }}>
          {[
            { href: '/', label: 'Explore' },
            { href: '/products', label: 'Hardware' },
            { href: '/products?category=ultra', label: 'Premium' },
          ].map(({ href, label }) => (
            <Link key={label} href={href} className="px-4 py-3 text-white/60 font-medium hover:text-white hover:bg-white/6 rounded-xl transition-all">
              {label}
            </Link>
          ))}
          {!session && (
            <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-white/8">
              <Link href="/login" className="px-4 py-3 text-center font-medium bg-white/8 text-white rounded-xl hover:bg-white/12 transition-colors">Log in</Link>
              <Link href="/register" className="px-4 py-3 text-center font-bold bg-brand-500 text-black rounded-xl hover:bg-brand-400 transition-colors">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

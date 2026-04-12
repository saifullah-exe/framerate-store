'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-screen bg-[#050507]" />;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[70vh] flex flex-col items-center justify-center relative">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/8 blur-[120px] rounded-full" />
        <div className="p-7 bg-[#0f0f11] rounded-2xl mb-7 border border-white/8 relative z-10">
          <PackageOpen size={48} className="text-white/20" />
        </div>
        <h1 className="text-4xl font-display font-black text-white mb-3 relative z-10">
          Cart is <span className="text-gradient">Empty</span>
        </h1>
        <p className="text-white/35 mb-8 relative z-10">Your inventory lacks hardware. Let's fix that.</p>
        <Link href="/products" className="button-primary relative z-10 text-sm tracking-wider uppercase">
          Explore Inventory
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 relative">
      <div className="pointer-events-none absolute -top-40 right-0 w-96 h-96 bg-brand-500/6 blur-[160px] rounded-full -z-10" />

      <div className="mb-8 pb-6 border-b border-white/8">
        <h1 className="text-4xl font-display font-black text-white tracking-tight mb-1">Active Loadout</h1>
        <p className="text-white/35 text-sm">Review your selected hardware before checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-center gap-5 bg-[#0f0f11] border border-white/8 hover:border-white/12 p-4 pr-5 rounded-2xl transition-colors"
            >
              <Link href={`/products/${item.slug}`} className="relative w-28 h-28 bg-[#0a0a0c] rounded-xl overflow-hidden shrink-0 border border-white/6">
                <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
              </Link>

              <div className="flex-1 text-center sm:text-left">
                <Link href={`/products/${item.slug}`} className="font-display font-bold text-base text-white hover:text-brand-300 transition-colors">
                  {item.name}
                </Link>
                <div className="text-white/25 text-[10px] mt-1 uppercase tracking-widest font-bold">SKU: {item.sku}</div>
                <div className="text-lg font-black text-white mt-2">Rs. {item.price.toLocaleString()}</div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3 sm:pl-5 sm:border-l border-white/6">
                <div className="flex items-center bg-[#0a0a0c] border border-white/8 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))} className="p-2 text-white/40 hover:text-white hover:bg-white/8 rounded-lg transition-all">
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-display font-bold text-sm text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-white/40 hover:text-white hover:bg-white/8 rounded-lg transition-all">
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-400/70 hover:text-red-400 text-[11px] flex items-center gap-1.5 uppercase font-bold tracking-widest bg-red-500/8 hover:bg-red-500/15 px-3 py-1.5 rounded-lg transition-all"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-4">
          <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl p-7 sticky top-28">
            <h2 className="text-xl font-display font-black text-white mb-5 pb-5 border-b border-white/8 tracking-tight">Order Summary</h2>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-white/40">
                <span>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="text-white font-semibold">Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Shipping</span>
                <span className="text-brand-400 font-semibold">Calculated next</span>
              </div>
              <div className="flex justify-between text-white/40">
                <span>Taxes</span>
                <span className="line-through">Included</span>
              </div>
            </div>

            <div className="border-t border-white/8 py-5 mb-5">
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold text-white/50 uppercase tracking-widest">Total</span>
                <span className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-cyan-400">
                  Rs. {getTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/checkout" className="button-primary w-full flex items-center justify-center gap-2 group py-3.5 rounded-xl text-sm tracking-wide">
              Checkout <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <p className="text-center text-[11px] text-white/25 mt-4 font-medium">
              Secure checkout. Hardware reserved for 15 min.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

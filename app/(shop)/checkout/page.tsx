'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CreditCard, Truck, ClipboardCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const { data: session } = useSession();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState({
    name: '', phone: '', street: '', city: '', province: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');

  if (items.length === 0) {
    return (
       <div className="container mx-auto px-4 py-32 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-display font-black text-white mb-4">Cart Empty</h1>
        <p className="text-surface-400 mb-8">Hardware must be selected before initiating checkout sequence.</p>
        <Link href="/products" className="button-primary uppercase tracking-widest text-sm">Return to Inventory</Link>
      </div>
    );
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(s => Math.min(3, s + 1));
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(i => ({
        product: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        sku: i.sku
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          totalAmount: getTotalPrice(),
          shippingAddress: shipping,
          paymentMethod
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        clearCart();
        router.push(`/checkout/success/${data.orderNumber}`);
      } else {
        alert(data.error || 'Checkout failed');
      }
    } catch (err) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 lg:py-16 relative">
       {/* Ambient Glow */}
       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
       
      <h1 className="text-4xl font-display font-black text-white mb-10 tracking-tight">Checkout Protocol.</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {/* Steps Indicator */}
          <div className="flex items-center mb-10 text-xs sm:text-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg shadow-inner border border-white/5 transition-colors ${step >= 1 ? 'bg-brand-500 text-surface-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-surface-900 text-surface-500 border-white/10'}`}>1</div>
            <div className={`h-1 w-12 sm:w-20 rounded-full mx-2 transition-colors ${step >= 2 ? 'bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-surface-800'}`}></div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg shadow-inner border border-white/5 transition-colors ${step >= 2 ? 'bg-brand-500 text-surface-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-surface-900 text-surface-500 border-white/10'}`}>2</div>
            <div className={`h-1 w-12 sm:w-20 rounded-full mx-2 transition-colors ${step >= 3 ? 'bg-brand-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'bg-surface-800'}`}></div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg shadow-inner border border-white/5 transition-colors ${step >= 3 ? 'bg-brand-500 text-surface-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]' : 'bg-surface-900 text-surface-500 border-white/10'}`}>3</div>
          </div>

          <div className="space-y-6">
            {/* Step 1: Shipping */}
            <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100 block' : 'opacity-50 hidden'}`}>
              <form onSubmit={handleNext} className="glass p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-surface-900 rounded-xl text-brand-400 border border-white/5 shadow-inner"><Truck size={24}/></div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-wide">Dropzone Coordinates</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">Authorized Recipient</label>
                     <input required placeholder="Full Name" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">Commlink</label>
                     <input required type="tel" placeholder="Phone Number" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all font-mono" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">Street Level Address</label>
                     <input required placeholder="123 Sector 4, Level 9" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" value={shipping.street} onChange={e => setShipping({...shipping, street: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">City Grid</label>
                     <input required placeholder="Metropolis" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">Territory</label>
                     <input required placeholder="Province" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" value={shipping.province} onChange={e => setShipping({...shipping, province: e.target.value})} />
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1">
                     <label className="text-xs font-bold text-surface-500 uppercase tracking-widest pl-1">Nation</label>
                     <input required placeholder="Country" className="w-full bg-surface-900/50 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-surface-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="button-primary w-full mt-8 py-4 uppercase tracking-widest text-sm">Lock Coordinates</button>
              </form>
            </div>

            {/* Step 2: Payment */}
            <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100 block' : 'hidden'}`}>
              <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="p-3 bg-surface-900 rounded-xl text-accent-purple border border-white/5 shadow-inner"><CreditCard size={24}/></div>
                     <h2 className="text-2xl font-display font-bold text-white tracking-wide">Transaction Vector</h2>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300">Edit Coordinates</button>
                </div>
                
                <div className="space-y-4">
                  {['cod', 'card'].map((method) => (
                    <label key={method} className={`block p-6 border rounded-2xl cursor-pointer transition-all ${paymentMethod === method ? 'border-brand-500 bg-brand-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]' : 'border-white/5 bg-surface-900/50 hover:border-white/20'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method as any)} className="accent-brand-500 w-5 h-5 focus:ring-brand-500 bg-surface-950 border-white/10" />
                        <div className="ml-4">
                          <h4 className="font-bold text-white text-lg tracking-wide">{method === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}</h4>
                          <p className="text-sm text-surface-400 mt-1">{method === 'cod' ? 'Pay when hardware is delivered.' : 'Temporarily Disabled. Systems upgrading.'}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <button onClick={() => setStep(3)} className="button-primary w-full mt-8 py-4 uppercase tracking-widest text-sm text-surface-950">Confirm Link</button>
              </div>
            </div>

            {/* Step 3: Review */}
            <div className={`transition-all duration-300 ${step === 3 ? 'opacity-100 block' : 'hidden'}`}>
              <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl">
                 <div className="flex items-center gap-3 mb-8">
                     <div className="p-3 bg-surface-900 rounded-xl text-brand-400 border border-white/5 shadow-inner"><ClipboardCheck size={24}/></div>
                     <h2 className="text-xl font-display font-bold text-white tracking-wide">Final Verification</h2>
                  </div>
                  
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
                  <div className="bg-surface-950/80 border border-white/5 p-5 rounded-2xl shadow-inner relative">
                    <button onClick={() => setStep(1)} className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 bg-brand-500/10 px-2 py-1 rounded">Edit</button>
                    <h4 className="text-surface-500 font-bold uppercase tracking-widest mb-3 text-xs">Dropzone</h4>
                    <p className="font-medium text-white text-base">{shipping.name}</p>
                    <p className="text-surface-400 font-mono text-xs mt-1 mb-2">{shipping.phone}</p>
                    <p className="text-surface-400 leading-relaxed">{shipping.street}<br/>{shipping.city}, {shipping.province}<br/>{shipping.country}</p>
                  </div>
                  
                  <div className="bg-surface-950/80 border border-white/5 p-5 rounded-2xl shadow-inner relative">
                    <button onClick={() => setStep(2)} className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-brand-400 hover:text-brand-300 bg-brand-500/10 px-2 py-1 rounded">Edit</button>
                    <h4 className="text-surface-500 font-bold uppercase tracking-widest mb-3 text-xs">Vector</h4>
                    <p className="font-medium text-white text-base">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                  </div>
                </div>

                <button disabled={loading} onClick={handleSubmitOrder} className="button-primary w-full py-5 rounded-2xl text-base tracking-widest font-bold uppercase flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5)]">
                  {loading ? (
                     <div className="w-6 h-6 border-[3px] border-surface-950 border-t-white/30 rounded-full animate-spin"></div>
                  ) : 'Authorize Release'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-8 rounded-[2rem] border border-white/5 h-fit sticky top-28 shadow-2xl">
            <h3 className="text-xl font-display font-bold text-white mb-6 tracking-wide border-b border-white/10 pb-4">Manifest Summary</h3>
            
            <div className="space-y-5 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-surface-950 rounded-xl overflow-hidden shrink-0 border border-white/5 shadow-inner">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">{item.name}</h4>
                    <div className="text-xs text-surface-500 uppercase tracking-widest font-bold mt-1">QTY: <span className="text-white">{item.quantity}</span></div>
                    <div className="text-brand-400 font-bold font-mono text-sm mt-1">Rs. {item.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 space-y-3 text-sm text-surface-300 font-medium">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {getTotalPrice().toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-brand-400">Complimentary</span></div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
               <span className="font-bold uppercase tracking-widest text-surface-500 text-xs mb-1">Total Manifest</span>
               <span className="font-display font-black text-3xl text-white">Rs. {getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

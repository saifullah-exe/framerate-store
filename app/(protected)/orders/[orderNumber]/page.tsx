'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, CheckCircle2, PackageSearch, CreditCard } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: { orderNumber: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.orderNumber}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
         console.log(err);
         setLoading(false);
      });
  }, [params.orderNumber]);

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-surface-800 border-t-brand-500 rounded-full animate-spin"></div>
     </div>
  );

  if (!order || order.error) return (
     <div className="min-h-screen flex flex-col items-center justify-center text-center">
       <h1 className="text-3xl font-display font-bold text-white mb-4">Manifest Not Found</h1>
       <p className="text-surface-400 mb-8">The requested order coordinates do not exist in our databanks.</p>
       <Link href="/orders" className="button-primary uppercase tracking-widest text-sm">Return to Logs</Link>
     </div>
  );

  return (
    <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl relative">
       <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-500/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
       
      <Link href="/orders" className="text-sm font-bold tracking-widest uppercase text-surface-500 hover:text-white transition-colors mb-8 inline-block">
        ← Back to Logs
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-surface-800 pb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight">Order Details</h1>
          <p className="text-surface-500 font-mono mt-2 tracking-wide text-lg">ID: [{order.orderNumber}]</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-surface-400 mb-2 font-medium">Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border inline-flex items-center gap-2 ${order.status === 'cancelled' ? 'text-red-400 border-red-400/50 bg-red-400/10' : order.status === 'delivered' ? 'text-accent-purple border-accent-purple/50 bg-accent-purple/10' : 'text-brand-400 border-brand-500/50 bg-brand-500/10'}`}>
            {order.status === 'delivered' && <CheckCircle2 size={14}/>} {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Tracking & Items) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3"><PackageSearch className="text-brand-400" /> Tracking Log</h2>
            
            <div className="relative border-l-2 border-surface-800 pl-8 ml-3 space-y-8">
              {order.statusHistory.map((history: any, i: number) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[43px] w-5 h-5 rounded-full border-4 border-surface-950 shadow-sm ${i === order.statusHistory.length - 1 ? 'bg-brand-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' : 'bg-surface-600'}`}></div>
                  <h3 className="font-bold text-white text-lg tracking-wide capitalize">{history.status}</h3>
                  <p className="text-surface-400 text-sm mt-1">{history.comment}</p>
                  <p className="text-surface-600 font-mono text-xs mt-2">{new Date(history.date).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="mt-10 p-6 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-between">
                 <div>
                    <h4 className="font-bold text-brand-300">Estimated Delivery</h4>
                    <p className="text-sm text-surface-400 mt-1">Usually 3-5 business days.</p>
                 </div>
                 <Truck size={32} className="text-brand-400 opacity-50" />
              </div>
            )}
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-6 border-b border-surface-800 pb-4">Secured Hardware ({order.items.length})</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.productId} className="flex gap-6 items-center bg-surface-950/50 border border-white/5 p-4 rounded-2xl shadow-inner group">
                  <div className="w-20 h-20 bg-surface-900 rounded-xl p-2 border border-white/10 shrink-0 group-hover:border-brand-500/50 transition-colors">
                     <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-contain drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug || ''}`} className="text-base font-bold text-white hover:text-brand-400 truncate block transition-colors leading-snug">{item.name}</Link>
                    <div className="text-surface-500 text-xs font-bold uppercase tracking-widest mt-1">SKU: {item.sku}</div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-surface-400 text-sm font-medium">Qty: <span className="text-white font-bold">{item.quantity}</span></span>
                      <span className="font-mono text-brand-300 font-bold">Rs. {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-surface-800 flex justify-between font-bold text-xl text-white">
              <span>Total Value</span>
              <span className="text-brand-400">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Customer Info) */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-display font-bold text-white mb-6 border-b border-surface-800 pb-4 flex items-center gap-3"><CreditCard className="text-accent-purple" size={20} /> Transaction Data</h2>
            
            <div className="space-y-6 text-sm">
                <div>
                  <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1.5">Method</h4>
                  <p className="text-white font-medium text-base bg-surface-950 px-4 py-2 rounded-lg border border-white/5 shadow-inner inline-block">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1.5">Status</h4>
                  <p className={`font-bold uppercase tracking-widest text-xs inline-block px-3 py-1 rounded border ${order.paymentStatus === 'paid' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}`}>{order.paymentStatus}</p>
                </div>
            </div>

            <h2 className="text-xl font-display font-bold text-white mt-10 mb-6 border-b border-surface-800 pb-4">Dropzone Vector</h2>
            <div className="text-surface-300 space-y-1 bg-surface-950 p-5 rounded-xl border border-white/5 shadow-inner">
              <p className="font-bold text-white text-base mb-2">{order.shippingAddress.name}</p>
              <p className="font-mono text-xs text-brand-400 mb-3">{order.shippingAddress.phone}</p>
              <p className="leading-relaxed text-sm">
                 {order.shippingAddress.street}<br/>
                 {order.shippingAddress.city}, {order.shippingAddress.province}<br/>
                 {order.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

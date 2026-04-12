'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Package, ShieldAlert } from 'lucide-react';

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) return <p className="mt-32 text-center text-surface-400">Authentication Required.</p>;
  if (loading) return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-surface-800 border-t-brand-500 rounded-full animate-spin"></div>
     </div>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-accent-purple border-accent-purple bg-accent-purple/10';
      case 'cancelled': return 'text-red-400 border-red-400 bg-red-400/10';
      default: return 'text-brand-400 border-brand-500 bg-brand-500/10';
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-5xl relative">
       <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-brand-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
       
      <h1 className="text-4xl font-display font-black text-white mb-2 tracking-tight">Acquisition History</h1>
      <p className="text-surface-400 mb-10 text-lg">Track your incoming drops and past secure purchases.</p>
      
      {orders.length === 0 ? (
        <div className="glass p-16 rounded-[2rem] border border-white/5 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-surface-900 border border-white/5 shadow-inner rounded-full mb-6 flex items-center justify-center">
            <Package size={40} className="text-surface-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">No Active Logs</h2>
          <p className="text-surface-400 mb-8 max-w-sm">You haven't initiated any hardware requests yet.</p>
          <Link href="/products" className="button-primary uppercase tracking-widest text-xs font-bold px-8 py-4">Explore Inventory</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order._id} className="glass border border-white/5 rounded-3xl overflow-hidden hover:border-brand-500/30 transition-colors shadow-xl group">
              <div className="bg-surface-950/50 backdrop-blur-sm border-b border-white/5 p-6 sm:px-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <div className="text-surface-500 text-xs font-bold uppercase tracking-widest mb-1">Manifest ID <span className="font-mono text-white ml-2">[{order.orderNumber}]</span></div>
                  <div className="text-surface-400 text-sm">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <Link href={`/orders/${order.orderNumber}`} className="button-secondary text-xs px-4 py-2 uppercase tracking-widest group-hover:bg-brand-500 group-hover:text-surface-950 transition-colors border border-white/10 group-hover:border-transparent">View Details</Link>
                </div>
              </div>

              <div className="p-6 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex gap-4 overflow-x-auto pb-2 flex-1 w-full mask-linear">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="relative w-24 h-24 shrink-0 bg-surface-900 border border-white/5 rounded-2xl p-2 group-hover:border-white/10 transition-colors overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      <div className="absolute top-1 right-1 bg-surface-950/80 backdrop-blur w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/10 text-white">{item.quantity}</div>
                    </div>
                  ))}
                </div>
                
                <div className="sm:text-right shrink-0 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 w-full sm:w-auto">
                  <div className="text-surface-500 text-xs font-bold uppercase tracking-widest mb-1">Total Authorized</div>
                  <div className="text-2xl font-display font-bold text-white tracking-wide">Rs. {order.totalAmount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

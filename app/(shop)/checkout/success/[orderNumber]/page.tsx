import Link from 'next/link';
import { PackageCheck, ShieldCheck } from 'lucide-react';

export default function CheckoutSuccessPage({ params }: { params: { orderNumber: string } }) {
  return (
    <div className="container mx-auto px-4 py-32 flex justify-center items-center min-h-[70vh] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 blur-[150px] rounded-full -z-10"></div>
      
      <div className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 text-center max-w-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full pointer-events-none -z-10"></div>

        <div className="w-24 h-24 bg-brand-500/10 border border-brand-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
          <PackageCheck className="w-12 h-12 text-brand-400" strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight leading-[1.1]">
          Transaction <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Secured.</span>
        </h1>
        <p className="text-surface-400 mb-8 max-w-sm mx-auto">
          Your hardware release request has been validated and queued for dispatch.
        </p>

        <div className="bg-surface-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-10 shadow-inner">
          <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-2">Tracking ID</p>
          <p className="text-2xl font-bold text-brand-300 font-mono tracking-wider">{params.orderNumber}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={`/orders/${params.orderNumber}`} className="button-primary px-8 py-4 uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
            View Live Status
          </Link>
          <Link href="/products" className="button-secondary px-8 py-4 uppercase tracking-widest text-xs font-bold w-full sm:w-auto">
            Browse Inventory
          </Link>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-2 text-xs font-bold text-surface-500 uppercase tracking-widest text-center mx-auto">
          <ShieldCheck size={14} className="text-brand-500" /> Secure Encryption Verified
        </div>
      </div>
    </div>
  );
}

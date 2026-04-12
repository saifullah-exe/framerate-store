import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Cpu, Zap } from 'lucide-react';

export default function ProductCard({ product }: { product: any }) {
  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col bg-[#0f0f11] rounded-2xl border border-white/8
        hover:border-brand-500/40
        hover:shadow-[0_0_0_1px_rgba(20,184,166,0.12),0_16px_48px_rgba(0,0,0,0.6)]
        transition-all duration-300 overflow-hidden"
    >
      {/* Top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/0 to-transparent group-hover:via-brand-500/60 transition-all duration-500 z-20" />

      {/* Image area */}
      <div className="relative aspect-[4/3] w-full bg-[#0a0a0c] overflow-hidden flex items-center justify-center p-6">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {hasDiscount && (
            <span className="badge-brand text-[10px]">-{discountPercent}%</span>
          )}
          {isOutOfStock && (
            <span className="badge bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]">
              Out of Stock
            </span>
          )}
        </div>

        <Image
          src={product.images?.[0] || '/images/products/placeholder.png'}
          alt={product.name}
          fill
          className="object-contain p-4 drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Quick spec hover overlay */}
        <div className="absolute bottom-0 inset-x-0 p-3 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-300
          bg-gradient-to-t from-[#0f0f11] to-transparent pt-8 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-brand-300 font-semibold">
            <Cpu size={12} /> {product.specs?.gpu?.split(' ').slice(0, 3).join(' ')}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-white/50 font-semibold">
            <Zap size={12} /> {product.specs?.ram}GB
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-1 flex-1 border-t border-white/6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">{product.brand}</span>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/40">
            <span className="text-amber-400">★</span>
            {product.rating?.average || '0.0'}
          </div>
        </div>

        <h3 className="font-display font-bold text-[15px] text-white leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/6 mt-3">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-white/25 line-through">
                Rs. {product.originalPrice?.toLocaleString()}
              </span>
            )}
            <span className="text-lg font-black text-white tracking-tight">
              Rs. {product.price?.toLocaleString()}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40
            group-hover:bg-brand-500 group-hover:text-black group-hover:border-brand-400 transition-all duration-200">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}

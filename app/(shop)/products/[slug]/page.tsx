'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { Minus, Plus, ShoppingCart, CheckCircle2, Shield, Cpu, Box, Monitor, HardDrive, Zap } from 'lucide-react';
import Link from 'next/link';
import ProductReviews from '@/components/products/ProductReviews';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950">
      <div className="w-16 h-16 border-4 border-surface-800 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!product || product.error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-950 text-center px-4">
      <h1 className="text-4xl font-display font-bold text-white mb-4">Product Not Found.</h1>
      <Link href="/products" className="text-brand-400 hover:text-brand-300 underline underline-offset-4">Return to Hardware</Link>
    </div>
  );

  const isOutOfStock = product.stock <= 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      slug: product.slug,
      sku: product.sku,
      image: product.images[0] || '/placeholder.jpg',
      quantity
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative min-h-screen pb-24 bg-[#050507]">
       <div className="pointer-events-none fixed top-0 left-1/3 w-[600px] h-[500px] bg-brand-500/6 blur-[160px] rounded-full -z-10" />
       
      <div className="container mx-auto px-6 pt-12 md:pt-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-surface-500 font-medium mb-8 mt-12">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Hardware</Link>
          <span>/</span>
          <span className="text-brand-400 truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Media */}
          <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="relative aspect-video lg:aspect-[4/3] w-full bg-[#0a0a0c] rounded-2xl border border-white/8 overflow-hidden shadow-[0_2px_0_rgba(255,255,255,0.04)] flex items-center justify-center p-8 group">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0c]/60 z-10 pointer-events-none opacity-50" />
               
              <Image
                src={product.images[activeImage] || '/images/products/placeholder.png'}
                alt={product.name}
                fill
                className="object-contain p-8 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-[1.02] z-0"
                priority
              />
              
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                 <span className="bg-surface-800/80 backdrop-blur-md text-white px-4 py-1.5 font-bold text-xs rounded-full border border-white/10 uppercase tracking-widest">{product.brand}</span>
                 {isOutOfStock && <span className="bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 font-bold text-xs rounded-full border border-red-400 tracking-widest uppercase shadow-[0_0_15px_rgba(239,68,68,0.3)]">Stock Depleted</span>}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all snap-start ${activeImage === idx ? 'border-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-105' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-surface-600'}`}
                  >
                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover bg-surface-950" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Tech Specs Block - Visible on desktop below image */}
            <div className="hidden lg:block mt-8">
               <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                 <Zap className="text-brand-400" /> Technical Specifications
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-surface-900/30 backdrop-blur-sm rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-surface-800/50 transition-colors">
                     <div className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-brand-400 shrink-0 shadow-inner"><Cpu size={24}/></div>
                     <div><p className="text-xs text-surface-500 uppercase tracking-widest font-bold mb-1">Processor</p><p className="text-sm text-surface-200 font-medium leading-relaxed">{product.specs?.cpu}</p></div>
                  </div>
                  <div className="p-5 bg-surface-900/30 backdrop-blur-sm rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-surface-800/50 transition-colors">
                     <div className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-accent-purple shrink-0 shadow-inner"><Box size={24}/></div>
                     <div><p className="text-xs text-surface-500 uppercase tracking-widest font-bold mb-1">Graphics</p><p className="text-sm text-surface-200 font-medium leading-relaxed">{product.specs?.gpu}</p></div>
                  </div>
                  <div className="p-5 bg-surface-900/30 backdrop-blur-sm rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-surface-800/50 transition-colors">
                     <div className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-amber-400 shrink-0 shadow-inner"><HardDrive size={24}/></div>
                     <div><p className="text-xs text-surface-500 uppercase tracking-widest font-bold mb-1">Memory / Storage</p><p className="text-sm text-surface-200 font-medium leading-relaxed">{product.specs?.ram}GB RAM / {product.specs?.storage}</p></div>
                  </div>
                  <div className="p-5 bg-surface-900/30 backdrop-blur-sm rounded-2xl border border-white/5 flex gap-4 items-start hover:bg-surface-800/50 transition-colors">
                     <div className="w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center text-blue-400 shrink-0 shadow-inner"><Monitor size={24}/></div>
                     <div><p className="text-xs text-surface-500 uppercase tracking-widest font-bold mb-1">Display</p><p className="text-sm text-surface-200 font-medium leading-relaxed">{product.specs?.display}</p></div>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
             <div className="sticky top-28 bg-[#0c0c0e] border border-white/10 rounded-[1.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="mb-4">
                  <span className="text-xs font-bold tracking-[0.2em] text-surface-500 uppercase bg-surface-950 px-3 py-1.5 rounded-full border border-white/5 shadow-inner inline-block">{product.category}</span>
                </div>
                
                <h1 className="text-3xl lg:text-5xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight">
                  {product.name}
                </h1>

                {/* Rating & Short Info */}
                <div className="flex items-center gap-4 text-sm mb-8 pb-8 border-b border-white/10">
                  <div className="flex items-center gap-1.5 bg-surface-950/50 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                    <span className="text-amber-400">★</span> 
                    <span className="font-bold text-white tracking-wide">{product.rating?.average || '0.0'}</span>
                    <span className="text-surface-500 font-medium">({product.rating?.count || 0})</span>
                  </div>
                  <div className="text-surface-400 font-medium text-xs tracking-wider">SKU <span className="text-surface-300 ml-1">{product.sku}</span></div>
                </div>

                {/* Pricing Area */}
                <div className="mb-10">
                  <p className="text-xs text-surface-500 font-bold uppercase tracking-[0.2em] mb-3">Configure Price</p>
                  <div className="flex items-end gap-4 flex-wrap">
                    <span className="text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-surface-400 tracking-tighter">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-brand-500/60 line-through font-medium mb-1">
                        Rs. {product.originalPrice?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Core Add To Cart Panel */}
                  <div className="bg-[#0a0a0c] border border-white/8 rounded-2xl p-6 mb-8 shadow-inner relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rotate-12 rounded-3xl blur-[2px] pointer-events-none"></div>
                  
                  {!isOutOfStock ? (
                     <div className="flex flex-col gap-6 relative z-10">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-bold tracking-wide text-surface-400">SELECT QUANTITY</span>
                           <div className="flex items-center bg-surface-950 border border-white/5 rounded-xl p-1 shadow-inner">
                             <button
                               onClick={() => setQuantity(Math.max(1, quantity - 1))}
                               className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-all"
                             >
                               <Minus size={16} strokeWidth={3} />
                             </button>
                             <span className="w-12 text-center font-display font-bold text-lg text-white">{quantity}</span>
                             <button
                               onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                               className="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-all"
                             >
                               <Plus size={16} strokeWidth={3} />
                             </button>
                           </div>
                        </div>
                        
                        <button
                          onClick={handleAddToCart}
                          disabled={isOutOfStock}
                          className="button-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg group"
                        >
                          {added ? (
                            <><CheckCircle2 size={24} className="text-surface-950" /> <span className="tracking-wide">ACQUIRED</span></>
                          ) : (
                            <><ShoppingCart size={24} className="text-surface-950 group-hover:scale-110 transition-transform" /> <span className="tracking-wide">SECURE HARDWARE</span></>
                          )}
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-widest mt-1">
                           <Shield size={14} /> 2 Years Secure Warranty Included
                        </div>
                     </div>
                  ) : (
                    <div className="py-6 text-center relative z-10">
                      <p className="text-xl font-display font-bold text-red-400 mb-2">INVENTORY EXHAUSTED</p>
                      <p className="text-sm text-surface-400 font-medium">Join the waitlist for next cargo drop.</p>
                      <button className="mt-6 w-full bg-surface-800 text-white font-bold py-4 rounded-2xl border border-white/5 hover:bg-surface-700 hover:border-white/20 transition-all uppercase tracking-widest text-sm shadow-xl">Notify Me</button>
                    </div>
                  )}
                </div>
                
                {/* Mobile Specs (Hidden on desktop) */}
                <div className="lg:hidden mt-8 border-t border-white/5 pt-8">
                   <h4 className="font-display font-bold text-white mb-6 uppercase tracking-widest text-sm">Specs Overview</h4>
                   <ul className="text-sm text-surface-300 space-y-4">
                      <li className="flex flex-col"><span className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">CPU</span> <span className="font-medium text-white">{product.specs?.cpu}</span></li>
                      <li className="flex flex-col"><span className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">GPU</span> <span className="font-medium text-brand-400">{product.specs?.gpu}</span></li>
                      <li className="flex flex-col"><span className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">RAM</span> <span className="font-medium text-white">{product.specs?.ram}GB / {product.specs?.storage}</span></li>
                   </ul>
                </div>

             </div>
          </div>
        </div>
        
        {/* REVIEWS SECTION */}
        <ProductReviews productSlug={params.slug} />
      </div>
    </div>
  );
}

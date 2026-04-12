import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { ArrowRight, ChevronRight, Zap, Target, ShieldCheck } from "lucide-react";

async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Featured products error:", error);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  const brands = [
    { name: "ASUS" }, { name: "MSI" }, { name: "Lenovo" },
    { name: "Dell" }, { name: "HP" }, { name: "Razer" }, { name: "Acer" },
  ];

  return (
    <div className="flex flex-col pb-24 relative overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden px-4 md:px-0 pt-10">
        {/* Single controlled background glow — top right */}
        <div className="pointer-events-none absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-brand-500/8 blur-[160px] -translate-y-1/4 translate-x-1/4" />

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — copy */}
          <div className="flex flex-col items-start gap-7 max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f0f11] border border-white/10 text-brand-300 text-xs font-semibold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              Unleash Elite Performance
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter text-white leading-[1.02]">
              DOMINATE <br />THE{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-300 via-brand-400 to-cyan-400">
                GAME.
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/40 max-w-lg leading-relaxed font-light">
              Experience unparalleled computing power with our curated selection of ultra-premium gaming and creator laptops.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Link href="/products" className="button-primary flex items-center gap-2 text-sm tracking-wide">
                Explore Hardware <ArrowRight size={16} />
              </Link>
              <Link href="/products?category=ultra" className="button-secondary text-sm">
                View High-End
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-6 pt-6 border-t border-white/8">
              {[
                { stat: "50+", label: "Premium Models" },
                { stat: "24/7", label: "Expert Support" },
                { stat: "100%", label: "Genuine" },
              ].map(({ stat, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-display font-black text-white">{stat}</span>
                  <span className="text-[11px] text-white/30 font-semibold uppercase tracking-wider mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product showcase */}
          <div className="relative w-full h-[480px] lg:h-[640px] hidden md:flex items-center justify-center animate-fade-in [animation-delay:200ms]">
            {/* Outer ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-white/[0.04]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full border border-dashed border-white/[0.06] animate-spin-slow" />

            {/* Hero laptop frame */}
            <div className="relative w-full max-w-[580px] drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)]" style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)' }}>
              <div className="relative aspect-video rounded-2xl border border-white/10 bg-[#0c0c0e] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),inset_0_0_60px_rgba(0,0,0,0.8)]">
                <img
                  src="/images/ui/hero-cyberpunk.png"
                  alt="Gaming Setup"
                  className="w-full h-full object-cover opacity-70"
                />
                {/* Screen glare line */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#0c0c0e] to-transparent" />
              </div>
              {/* Laptop base/hinge suggestion */}
              <div className="h-2 w-[95%] mx-auto bg-gradient-to-b from-[#1a1a1e] to-[#0f0f11] rounded-b-sm border-x border-b border-white/6" />
            </div>

            {/* Floating stat cards */}
            <div className="absolute bottom-16 left-4 p-4 rounded-2xl bg-[#0f0f11] border border-white/10 shadow-2xl animate-fade-up [animation-delay:500ms]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-500/15 text-brand-400 rounded-xl">
                  <Zap size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Equipped With</p>
                  <p className="text-white font-bold font-display text-sm">RTX 40-Series</p>
                </div>
              </div>
            </div>

            <div className="absolute top-24 right-4 p-4 rounded-2xl bg-[#0f0f11] border border-white/10 shadow-2xl animate-fade-up [animation-delay:700ms]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/15 text-purple-400 rounded-xl">
                  <Target size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">Displays up to</p>
                  <p className="text-white font-bold font-display text-sm">240Hz 4K Mini-LED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND STRIP ───────────────────────────────────── */}
      <section className="border-y border-white/6 bg-[#080809] py-10 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-7">Official Retail Partner</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {brands.map((brand) => (
              <Link key={brand.name} href={`/products?brand=${brand.name}`} className="group">
                <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-white/15 group-hover:text-white/70 transition-colors duration-300">
                  {brand.name.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/8 gap-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-brand-400 uppercase mb-3">Featured Hardware</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
              Elite <span className="text-gradient">Inventory.</span>
            </h2>
            <p className="text-white/35 text-base">Handpicked performance monsters guaranteed to crush any workload.</p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 px-5 py-2.5 rounded-full transition-all shrink-0"
          >
            View all <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-28 text-white/20 border border-dashed border-white/8 rounded-2xl">
            No featured products found. Run seed script.
          </div>
        )}
      </section>

      {/* ── CATEGORY HIGHLIGHTS ───────────────────────────── */}
      <section className="container mx-auto px-4 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Mid-Range card */}
          <Link
            href="/products?category=mid-range"
            className="group relative h-[380px] rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/8 hover:border-brand-500/30 transition-all duration-500 hover:shadow-[0_0_0_1px_rgba(20,184,166,0.2),0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <Image
              src="/images/ui/hero-workstation.png"
              alt="Workstation"
              fill
              className="object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 z-10">
              <div className="p-3 bg-brand-500/15 text-brand-400 rounded-xl w-fit mb-5 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-black group-hover:border-brand-500 transition-all duration-300">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-2">Mid-Range Kings</h3>
              <p className="text-white/40 text-sm mb-5 max-w-xs leading-relaxed">The absolute sweet spot of price-to-performance for modern 1440p gaming.</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-widest">
                Explore <ChevronRight size={14} />
              </span>
            </div>
          </Link>

          {/* Ultra card */}
          <Link
            href="/products?category=ultra"
            className="group relative h-[380px] rounded-2xl overflow-hidden bg-[#0a0a0c] border border-white/8 hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_0_1px_rgba(147,51,234,0.2),0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <Image
              src="/images/ui/hero-ultra-spec.png"
              alt="Ultra Spec"
              fill
              className="object-cover opacity-25 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 z-10">
              <div className="p-3 bg-purple-500/15 text-purple-400 rounded-xl w-fit mb-5 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300">
                <Zap size={24} />
              </div>
              <h3 className="font-display text-2xl font-black text-white mb-2">Ultra Enthusiast</h3>
              <p className="text-white/40 text-sm mb-5 max-w-xs leading-relaxed">No compromises. Unbridled power for 4K ray-traced gaming and ultimate creation.</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-widest">
                Explore <ChevronRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // States
  const [brand, setBrand] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [ram, setRam] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [q, setQ] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const brands = searchParams.get('brand')?.split(',') || [];
    setBrand(brands);
    setCategory(searchParams.get('category') || '');
    setPriceRange({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || ''
    });
    setRam(searchParams.get('minRam') || '');
    setSortBy(searchParams.get('sortBy') || '');
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (brand.length > 0) params.set('brand', brand.join(','));
    else params.delete('brand');

    if (category) params.set('category', category);
    else params.delete('category');

    if (priceRange.min) params.set('minPrice', priceRange.min);
    else params.delete('minPrice');

    if (priceRange.max) params.set('maxPrice', priceRange.max);
    else params.delete('maxPrice');

    if (ram) params.set('minRam', ram);
    else params.delete('minRam');

    if (sortBy) params.set('sortBy', sortBy);
    else params.delete('sortBy');

    if (q) params.set('q', q);
    else params.delete('q');

    params.delete('page'); // reset page on filter
    router.push(`/products?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    router.push('/products');
    setIsOpen(false);
  };

  if (!mounted) return null;

  const brandsList = ['ASUS', 'MSI', 'Razer', 'Lenovo', 'Dell', 'HP', 'Acer'];
  const categoriesList = ['budget', 'mid-range', 'high-end', 'ultra'];
  const ramOptions = [8, 16, 32, 64];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-[#0f0f11] border border-white/8 text-white p-3.5 rounded-xl font-semibold mb-5 hover:border-white/15 transition-colors text-sm"
      >
        <SlidersHorizontal size={18} /> Filters & Sorting
      </button>

        <div className={`fixed md:relative inset-0 z-50 md:z-0 bg-black/60 md:bg-transparent transition-all duration-300 md:opacity-100 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:pointer-events-auto'}`}
          style={{ backdropFilter: isOpen ? 'blur(8px)' : 'none' }}>
          <div className={`absolute md:relative top-0 left-0 h-full md:h-auto w-4/5 md:w-full max-w-sm bg-[#0d0d10] md:bg-[#0f0f11] border-r md:border border-white/10 md:border-white/8 p-6 md:rounded-2xl transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8">
              <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-brand-400" /> Filters
              </h3>
              <button className="md:hidden p-2 text-white/40 hover:text-white bg-white/5 rounded-lg" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

          <div className="space-y-8">
            {/* Search */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Keywords</h4>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search by name, specs..." 
                  className="input-base text-sm"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Sort By</h4>
              <select 
                title="Sort"
                className="w-full bg-[#0a0a0c] border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/50 transition-colors appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Brand */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Manufacturer</h4>
              <div className="flex flex-col gap-3 text-sm">
                {brandsList.map(b => (
                  <label key={b} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded border border-surface-600 bg-surface-950 group-hover:border-brand-400 transition-colors">
                      <input 
                        type="checkbox" 
                        className="peer opacity-0 absolute inset-0 cursor-pointer"
                        checked={brand.includes(b)}
                        onChange={(e) => {
                          if (e.target.checked) setBrand([...brand, b]);
                          else setBrand(brand.filter(item => item !== b));
                        }}
                      />
                      <div className="pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:bg-brand-500 absolute inset-0 rounded-[3px] scale-75 transition-all"></div>
                    </div>
                    <span className="text-white/55 group-hover:text-white transition-colors text-sm">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Class</h4>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(category === c ? '' : c)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${
                      category === c 
                        ? 'bg-brand-500/15 text-brand-300 border-brand-500/30' 
                        : 'bg-[#0a0a0c] text-white/35 border-white/8 hover:border-white/15 hover:text-white/60'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Price Range (Rs)</h4>
              <div className="flex items-center gap-3">
                <input type="number" placeholder="Min" 
                  className="w-full bg-[#0a0a0c] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span className="text-white/20">—</span>
                <input type="number" placeholder="Max" 
                  className="w-full bg-[#0a0a0c] border border-white/8 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500/50 transition-colors"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>

            {/* RAM */}
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-surface-500 uppercase mb-4">Min RAM</h4>
              <div className="grid grid-cols-4 gap-2">
                {ramOptions.map(r => (
                  <button
                    key={r}
                    onClick={() => setRam(ram === r.toString() ? '' : r.toString())}
                    className={`py-2 rounded-lg text-sm font-bold transition-all border ${
                      ram === r.toString()
                        ? 'bg-brand-500 text-black border-brand-500 shadow-[0_0_12px_rgba(20,184,166,0.4)]' 
                        : 'bg-[#0a0a0c] text-white/35 border-white/8 hover:border-white/15 hover:text-white/60'
                    }`}
                  >
                    {r}GB
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-5 border-t border-white/8 flex flex-col gap-2.5">
              <button 
                onClick={applyFilters}
                className="button-primary w-full py-3 rounded-xl text-sm tracking-wider uppercase"
              >
                Apply Filters
              </button>
              <button 
                onClick={clearFilters}
                className="button-secondary w-full py-3 rounded-xl text-sm tracking-wider uppercase"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

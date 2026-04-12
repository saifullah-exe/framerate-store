import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { Suspense } from 'react';
import { PackageSearch } from 'lucide-react';

async function getProducts(searchParams: any) {
  try {
    await dbConnect();
    const page = parseInt(searchParams.page || '1');
    const limit = parseInt(searchParams.limit || '12');
    const skip = (page - 1) * limit;
    const query: any = { isActive: true };
    if (searchParams.brand) query.brand = { $in: searchParams.brand.split(',') };
    if (searchParams.category) query.category = searchParams.category;
    if (searchParams.minPrice || searchParams.maxPrice) {
      query.price = {};
      if (searchParams.minPrice) query.price.$gte = parseInt(searchParams.minPrice);
      if (searchParams.maxPrice) query.price.$lte = parseInt(searchParams.maxPrice);
    }
    if (searchParams.minRam) query['specs.ram'] = { $gte: parseInt(searchParams.minRam) };
    if (searchParams.gpu) query['specs.gpu'] = { $regex: searchParams.gpu, $options: 'i' };
    if (searchParams.q) query.$text = { $search: searchParams.q };
    let sortObj: any = { createdAt: -1 };
    if (searchParams.sortBy === 'price_asc') sortObj = { price: 1 };
    else if (searchParams.sortBy === 'price_desc') sortObj = { price: -1 };
    else if (searchParams.sortBy === 'rating') sortObj = { 'rating.average': -1 };
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(query);
    return { products: JSON.parse(JSON.stringify(products)), pagination: { total, page, pages: Math.ceil(total / limit) } };
  } catch (error) {
    console.error("Products fetch error:", error);
    return { products: [], pagination: {} };
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const { products, pagination } = await getProducts(searchParams);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Single glow — far behind content */}
      <div className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] bg-brand-500/5 blur-[180px] rounded-full -translate-x-1/2 -translate-y-1/4 -z-10" />

      <div className="container mx-auto px-6 py-14 relative z-10">
        {/* Page header */}
        <div className="mb-10 pb-8 border-b border-white/8">
          <p className="text-[10px] font-black tracking-[0.25em] text-brand-400 uppercase mb-3">Browse</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-2">
                Elite <span className="text-gradient">Hardware.</span>
              </h1>
              <p className="text-white/35 text-base max-w-xl">
                Filter by exact specifications to match your exact playstyle.
              </p>
            </div>
            {searchParams.q && (
              <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/25 px-4 py-2 rounded-xl text-sm font-semibold text-brand-300 shrink-0">
                <span className="text-brand-500">›</span> "{searchParams.q}"
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-[260px] lg:w-[300px] flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-[#0f0f11] border border-white/8 rounded-2xl animate-pulse" />}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {products?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 bg-[#0a0a0c] rounded-2xl border border-dashed border-white/8 text-center">
                <div className="p-5 bg-white/[0.04] rounded-2xl mb-5 border border-white/8">
                  <PackageSearch size={40} className="text-white/25" />
                </div>
                <h3 className="text-xl font-display font-black text-white mb-2">No results</h3>
                <p className="text-white/35 text-sm max-w-xs">Try loosening your filter requirements.</p>
              </div>
            )}

            {pagination?.pages > 1 && (
              <div className="mt-14 pt-6 border-t border-white/8 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isCurrent = pageNum === (pagination.page || 1);
                  return (
                    <a
                      key={pageNum}
                      href={`/products?page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                        isCurrent
                          ? 'bg-brand-500 text-black shadow-[0_0_16px_rgba(20,184,166,0.4)]'
                          : 'bg-white/[0.04] border border-white/8 text-white/40 hover:border-brand-500/40 hover:text-brand-300'
                      }`}
                    >
                      {pageNum}
                    </a>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

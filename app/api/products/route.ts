import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build filter query
    const query: any = { isActive: true };

    const brand = searchParams.get('brand');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRam = searchParams.get('minRam');
    const gpu = searchParams.get('gpu');
    const search = searchParams.get('q');

    if (brand) query.brand = { $in: brand.split(',') };
    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (minRam) query['specs.ram'] = { $gte: parseInt(minRam) };
    if (gpu) query['specs.gpu'] = { $regex: gpu, $options: 'i' };

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sortBy = searchParams.get('sortBy');
    let sortObj: any = { createdAt: -1 };
    
    if (sortBy === 'price_asc') sortObj = { price: 1 };
    else if (sortBy === 'price_desc') sortObj = { price: -1 };
    else if (sortBy === 'rating') sortObj = { 'rating.average': -1 };
    else if (sortBy === 'newest') sortObj = { createdAt: -1 };

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

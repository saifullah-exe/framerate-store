import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({ isActive: true, isFeatured: true })
      .limit(8)
      .lean();
      
    return NextResponse.json(products);
  } catch (error) {
    console.error('Featured products error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}

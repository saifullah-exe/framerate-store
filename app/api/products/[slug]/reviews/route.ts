import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { auth } from '@/lib/auth';
import { reviewSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug: params.slug }).select('_id');
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const reviews = await Review.find({ productId: product._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const validation = reviewSchema.parse(body);

    await dbConnect();
    const product = await Product.findOne({ slug: params.slug });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Check if user already reviewed
    const existing = await Review.findOne({ productId: product._id, userId: session.user.id });
    if (existing) return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });

    // Check verified purchase
    const order = await Order.findOne({ 
      userId: session.user.id, 
      'items.productId': product._id,
      status: 'delivered' 
    });
    const isVerifiedPurchase = !!order;

    await Review.create({
      ...validation,
      productId: product._id,
      userId: session.user.id,
      isVerifiedPurchase
    });

    // Update aggregate rating using pipeline
    const pipeline = [
      { $match: { productId: product._id } },
      { $group: { _id: '$productId', average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ];
    const stats = await Review.aggregate(pipeline);
    
    if (stats.length > 0) {
      product.rating = {
        average: parseFloat(stats[0].average.toFixed(1)),
        count: stats[0].count
      };
      await product.save();
    }

    return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

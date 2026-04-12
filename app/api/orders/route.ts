import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';
import { orderSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = orderSchema.parse(body);

    await dbConnect();
    
    // Validate stock and calculate subtotal securely
    let subtotal = 0;
    const items = [];
    
    for (const item of validatedData.items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product ${item.name} is unavailable` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }
      
      subtotal += product.price * item.quantity;
      items.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        image: item.image
      });
    }

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    // Generate Order Number: FS-YYYYMMDD-XXXXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString();
    const orderNumber = `FS-${dateStr}-${randomCode}`;

    // Create Order
    const order = await Order.create({
      orderNumber,
      userId: session.user.id,
      items,
      shippingAddress: validatedData.shippingAddress,
      payment: {
        method: validatedData.paymentMethod,
        status: validatedData.paymentMethod === 'cod' ? 'pending' : 'paid' // simplified for mock
      },
      status: 'pending',
      statusHistory: [{ status: 'pending', note: 'Order placed successfully' }],
      subtotal,
      shippingCost: 0,
      totalAmount: subtotal
    });

    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Pagination omitted for brevity but can be added similarly to products
    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

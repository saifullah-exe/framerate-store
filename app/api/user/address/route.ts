import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { addressSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const address = addressSchema.parse(body);

    await dbConnect();
    
    // If it's the first address or set as default, handle it
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (address.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => { a.isDefault = false; });
      address.isDefault = true;
    }

    user.addresses.push(address as any);
    await user.save();
    
    return NextResponse.json(user.addresses);
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const addressSchema = z.object({
  street: z.string().min(5, 'Street must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export const orderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['cod', 'card', 'jazzcash', 'easypaisa']),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    sku: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    image: z.string()
  })).min(1, 'Cart is empty'),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(2, 'Title must be at least 2 characters').max(100),
  body: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

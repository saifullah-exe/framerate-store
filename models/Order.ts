import mongoose, { Document, Model, Schema } from 'mongoose';

export interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderShippingAddress {
  name: string;
  street: string;
  city: string;
  province: string;
  country: string;
  phone: string;
}

export interface OrderPayment {
  method: 'cod' | 'card' | 'jazzcash' | 'easypaisa';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
}

export interface StatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  shippingAddress: OrderShippingAddress;
  payment: OrderPayment;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusHistory: StatusHistory[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  payment: {
    method: { type: String, enum: ['cod', 'card', 'jazzcash', 'easypaisa'], required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    transactionId: { type: String }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models?.Order || mongoose.model<IOrder>('Order', orderSchema);
export default Order;

import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Specs {
  cpu: string;
  gpu: string;
  ram: number;
  storage: string;
  display: string;
  battery: string;
  weight: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: 'ASUS' | 'MSI' | 'Lenovo' | 'Dell' | 'HP' | 'Razer' | 'Acer';
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  specs: Specs;
  images: string[];
  category: 'budget' | 'mid-range' | 'high-end' | 'ultra';
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const specsSchema = new Schema<Specs>({
  cpu: { type: String, required: true },
  gpu: { type: String, required: true },
  ram: { type: Number, required: true },
  storage: { type: String, required: true },
  display: { type: String, required: true },
  battery: { type: String, required: true },
  weight: { type: Number, required: true }
}, { _id: false });

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: { 
    type: String, 
    enum: ['ASUS', 'MSI', 'Lenovo', 'Dell', 'HP', 'Razer', 'Acer'], 
    required: true,
    index: true
  },
  price: { type: Number, required: true, index: true },
  originalPrice: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
  specs: specsSchema,
  images: [{ type: String }],
  category: { 
    type: String, 
    enum: ['budget', 'mid-range', 'high-end', 'ultra'], 
    required: true,
    index: true
  },
  tags: [{ type: String }],
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

// Add text index for search
productSchema.index({ name: 'text', 'tags': 'text', 'specs.cpu': 'text', 'specs.gpu': 'text' });

const Product: Model<IProduct> = mongoose.models?.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product;

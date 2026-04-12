import mongoose, { Document, Model, Schema } from 'mongoose';

export interface Address {
  _id?: string;
  street: string;
  city: string;
  province: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String }, // Optional for Google provider users
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String },
  phone: { type: String },
  addresses: [addressSchema]
}, { timestamps: true });

const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);
export default User;

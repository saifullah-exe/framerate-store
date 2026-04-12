import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Simple model definitions for seeding standalone
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, brand: String, price: Number, originalPrice: Number, 
  stock: Number, sku: String,
  specs: { cpu: String, gpu: String, ram: Number, storage: String, display: String, battery: String, weight: Number },
  images: [String], category: String, tags: [String], rating: { average: Number, count: Number },
  isActive: Boolean, isFeatured: Boolean
}, { timestamps: true });
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  orderNumber: String, userId: mongoose.Schema.Types.ObjectId,
  items: [{ productId: mongoose.Schema.Types.ObjectId, name: String, sku: String, price: Number, quantity: Number, image: String }],
  shippingAddress: { name: String, street: String, city: String, province: String, country: String, phone: String },
  payment: { method: String, status: String },
  status: String, statusHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
  subtotal: Number, shippingCost: Number, totalAmount: Number
});
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected!');

    // Clean DB
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Users
    const hashedAdminPass = await bcrypt.hash('Admin123!', 12);
    const hashedUserPass = await bcrypt.hash('User123!', 12);

    const admin = await User.create({
      name: 'Admin User', email: 'admin@framerateshop.com', password: hashedAdminPass, role: 'admin'
    });

    const user = await User.create({
      name: 'Regular User', email: 'user@framerateshop.com', password: hashedUserPass, role: 'customer'
    });
    console.log('Users created.');

    // 2. Create Products
    const productsData = [
      {
        name: "ASUS ROG Strix SCAR 17", slug: "asus-rog-strix-scar-17", brand: "ASUS",
        price: 850000, originalPrice: 900000, stock: 10, sku: "ASUS-ROG-S17-4090",
        specs: { cpu: "AMD Ryzen 9 7945HX", gpu: "NVIDIA RTX 4090 16GB", ram: 32, storage: "2TB NVMe SSD", display: "17.3 inch QHD 240Hz", battery: "90Wh", weight: 3.0 },
        images: ["/images/products/asus-rog-scar17.png", "/images/products/asus-rog-scar17-2.png"],
        category: "ultra", tags: ["RTX 4090", "eSports", "premium"], rating: { average: 5, count: 2 }, isActive: true, isFeatured: true
      },
      {
        name: "MSI Titan GT77 HX", slug: "msi-titan-gt77-hx", brand: "MSI",
        price: 820000, stock: 5, sku: "MSI-TITAN-4090",
        specs: { cpu: "Intel Core i9-13980HX", gpu: "NVIDIA RTX 4090 16GB", ram: 64, storage: "4TB NVMe SSD", display: "17.3 inch 4K MiniLED 144Hz", battery: "99Wh", weight: 3.3 },
        images: ["/images/products/msi-titan-gt77.png"], category: "ultra", tags: ["4K", "RTX 4090", "Desktop Replacement"], rating: { average: 4.8, count: 5 }, isActive: true, isFeatured: true
      },
      {
        name: "Razer Blade 16", slug: "razer-blade-16", brand: "Razer",
        price: 750000, stock: 8, sku: "RAZ-B16-4080",
        specs: { cpu: "Intel Core i9-13950HX", gpu: "NVIDIA RTX 4080 12GB", ram: 32, storage: "1TB NVMe SSD", display: "16 inch Dual Mode MiniLED", battery: "95.2Wh", weight: 2.45 },
        images: ["/images/products/razer-blade16.png"], category: "high-end", tags: ["Thin", "Premium", "MiniLED", "RTX 4080"], rating: { average: 4.6, count: 12 }, isActive: true, isFeatured: true
      },
      {
        name: "Lenovo Legion Pro 7i", slug: "lenovo-legion-pro-7i", brand: "Lenovo",
        price: 520000, originalPrice: 550000, stock: 15, sku: "LEN-L7I-4080",
        specs: { cpu: "Intel Core i9-13900HX", gpu: "NVIDIA RTX 4080 12GB", ram: 32, storage: "1TB NVMe SSD", display: "16 inch WQXGA 240Hz", battery: "99.9Wh", weight: 2.8 },
        images: ["/images/products/lenovo-legion-pro7i.png"], category: "high-end", tags: ["Performance", "RTX 4080"], rating: { average: 4.9, count: 25 }, isActive: true, isFeatured: true
      },
      {
        name: "Dell Alienware m16", slug: "alienware-m16", brand: "Dell",
        price: 480000, stock: 12, sku: "DELL-AW16-4070",
        specs: { cpu: "AMD Ryzen 9 7845HX", gpu: "NVIDIA RTX 4070 8GB", ram: 16, storage: "1TB NVMe SSD", display: "16 inch QHD+ 165Hz", battery: "86Wh", weight: 3.2 },
        images: ["/images/products/dell-alienware-m16.png"], category: "high-end", tags: ["RGB", "Alienware", "RTX 4070"], rating: { average: 4.5, count: 8 }, isActive: true, isFeatured: true
      },
      {
        name: "HP Omen 16", slug: "hp-omen-16", brand: "HP",
        price: 350000, originalPrice: 380000, stock: 20, sku: "HP-OMEN16-4060",
        specs: { cpu: "Intel Core i7-13700HX", gpu: "NVIDIA RTX 4060 8GB", ram: 16, storage: "512GB NVMe SSD", display: "16.1 inch FHD 144Hz", battery: "83Wh", weight: 2.3 },
        images: ["/images/products/hp-omen16.png"], category: "mid-range", tags: ["Value", "RTX 4060"], rating: { average: 4.3, count: 18 }, isActive: true, isFeatured: false
      },
      {
        name: "Acer Nitro 5", slug: "acer-nitro-5", brand: "Acer",
        price: 280000, stock: 30, sku: "ACER-N5-4050",
        specs: { cpu: "Intel Core i5-12500H", gpu: "NVIDIA RTX 4050 6GB", ram: 16, storage: "512GB NVMe SSD", display: "15.6 inch FHD 144Hz", battery: "57Wh", weight: 2.5 },
        images: ["/images/products/acer-nitro5.png"], category: "budget", tags: ["Entry Level", "RTX 4050"], rating: { average: 4.1, count: 30 }, isActive: true, isFeatured: false
      },
      {
        name: "ASUS TUF Gaming A15", slug: "asus-tuf-a15", brand: "ASUS",
        price: 290000, originalPrice: 310000, stock: 25, sku: "ASUS-TUF-A15-4050",
        specs: { cpu: "AMD Ryzen 7 7735HS", gpu: "NVIDIA RTX 4050 6GB", ram: 16, storage: "512GB NVMe SSD", display: "15.6 inch FHD 144Hz", battery: "90Wh", weight: 2.2 },
        images: ["/images/products/asus-tuf-a15.png"], category: "budget", tags: ["Durable", "Battery Life", "RTX 4050"], rating: { average: 4.4, count: 42 }, isActive: true, isFeatured: true
      },
      {
        name: "Lenovo LOQ 15", slug: "lenovo-loq-15", brand: "Lenovo",
        price: 270000, stock: 40, sku: "LEN-LOQ-4050",
        specs: { cpu: "Intel Core i5-13420H", gpu: "NVIDIA RTX 4050 6GB", ram: 8, storage: "512GB NVMe SSD", display: "15.6 inch FHD 144Hz", battery: "60Wh", weight: 2.4 },
        images: ["/images/products/lenovo-loq15.png"], category: "budget", tags: ["Entry Level", "RTX 4050"], rating: { average: 4.0, count: 15 }, isActive: true, isFeatured: false
      },
      {
        name: "MSI Katana 15", slug: "msi-katana-15", brand: "MSI",
        price: 340000, originalPrice: 360000, stock: 15, sku: "MSI-KATANA-4060",
        specs: { cpu: "Intel Core i7-13620H", gpu: "NVIDIA RTX 4060 8GB", ram: 16, storage: "1TB NVMe SSD", display: "15.6 inch FHD 144Hz", battery: "53.5Wh", weight: 2.25 },
        images: ["/images/products/msi-katana15.png"], category: "mid-range", tags: ["RTX 4060", "Lightweight"], rating: { average: 4.2, count: 21 }, isActive: true, isFeatured: false
      },
      {
        name: "Dell G15 Gaming", slug: "dell-g15", brand: "Dell",
        price: 360000, stock: 18, sku: "DELL-G15-4060",
        specs: { cpu: "Intel Core i7-13650HX", gpu: "NVIDIA RTX 4060 8GB", ram: 16, storage: "1TB NVMe SSD", display: "15.6 inch FHD 165Hz", battery: "86Wh", weight: 2.8 },
        images: ["/images/products/dell-g15.png"], category: "mid-range", tags: ["RTX 4060", "Robust"], rating: { average: 4.4, count: 34 }, isActive: true, isFeatured: true
      },
      {
        name: "Acer Predator Helios 16", slug: "acer-predator-16", brand: "Acer",
        price: 490000, originalPrice: 520000, stock: 10, sku: "ACER-PRED-4070",
        specs: { cpu: "Intel Core i7-13700HX", gpu: "NVIDIA RTX 4070 8GB", ram: 16, storage: "1TB NVMe SSD", display: "16 inch WQXGA 240Hz", battery: "90Wh", weight: 2.6 },
        images: ["/images/products/acer-predator16.png"], category: "high-end", tags: ["RTX 4070", "240Hz"], rating: { average: 4.7, count: 11 }, isActive: true, isFeatured: false
      },
      {
        name: "HP Victus 15", slug: "hp-victus-15", brand: "HP",
        price: 240000, stock: 35, sku: "HP-VIC-3050",
        specs: { cpu: "Intel Core i5-12450H", gpu: "NVIDIA RTX 3050 4GB", ram: 8, storage: "512GB NVMe SSD", display: "15.6 inch FHD 144Hz", battery: "70Wh", weight: 2.29 },
        images: ["/images/products/hp-victus15.png"], category: "budget", tags: ["Budget", "RTX 3050"], rating: { average: 3.9, count: 56 }, isActive: true, isFeatured: false
      },
      {
        name: "ASUS ROG Zephyrus G14", slug: "asus-zephyrus-g14", brand: "ASUS",
        price: 550000, originalPrice: 580000, stock: 14, sku: "ASUS-G14-4070",
        specs: { cpu: "AMD Ryzen 9 7940HS", gpu: "NVIDIA RTX 4070 8GB", ram: 16, storage: "1TB NVMe SSD", display: "14 inch QHD+ 165Hz", battery: "76Wh", weight: 1.65 },
        images: ["/images/products/asus-zephyrus-g14.png"], category: "high-end", tags: ["Thin-and-light", "RTX 4070", "Portable"], rating: { average: 4.8, count: 45 }, isActive: true, isFeatured: true
      },
      {
        name: "Razer Blade 18", slug: "razer-blade-18", brand: "Razer",
        price: 880000, stock: 4, sku: "RAZ-B18-4090",
        specs: { cpu: "Intel Core i9-13950HX", gpu: "NVIDIA RTX 4090 16GB", ram: 32, storage: "2TB NVMe SSD", display: "18 inch QHD+ 240Hz", battery: "91.7Wh", weight: 3.1 },
        images: ["/images/products/razer-blade18.png"], category: "ultra", tags: ["Desktop Replacement", "18-inch", "RTX 4090"], rating: { average: 4.9, count: 6 }, isActive: true, isFeatured: false
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`Created ${products.length} products.`);

    // 3. Create mock orders for regular user
    const order1 = await Order.create({
      orderNumber: "FS-20231001-12345", userId: user._id,
      items: [{ productId: products[0]._id, name: products[0].name, sku: products[0].sku, price: products[0].price, quantity: 1, image: products[0].images[0] }],
      shippingAddress: { name: "Regular User", street: "123 Test St", city: "Lahore", province: "Punjab", country: "Pakistan", phone: "03001234567" },
      payment: { method: "card", status: "paid" }, status: "delivered",
      statusHistory: [
        { status: "pending", timestamp: new Date(Date.now() - 10 * 86400000), note: "Order placed" },
        { status: "delivered", timestamp: new Date(Date.now() - 5 * 86400000), note: "Package delivered" }
      ],
      subtotal: products[0].price, shippingCost: 0, totalAmount: products[0].price
    });

    const order2 = await Order.create({
      orderNumber: "FS-20240115-67890", userId: user._id,
      items: [{ productId: products[7]._id, name: products[7].name, sku: products[7].sku, price: products[7].price, quantity: 1, image: products[7].images[0] }],
      shippingAddress: { name: "Regular User", street: "123 Test St", city: "Lahore", province: "Punjab", country: "Pakistan", phone: "03001234567" },
      payment: { method: "cod", status: "pending" }, status: "processing",
      statusHistory: [
        { status: "pending", timestamp: new Date(Date.now() - 2 * 86400000), note: "Order placed" },
        { status: "processing", timestamp: new Date(Date.now() - 1 * 86400000), note: "Preparing for shipment" }
      ],
      subtotal: products[7].price, shippingCost: 0, totalAmount: products[7].price
    });

    const order3 = await Order.create({
      orderNumber: "FS-20240310-54321", userId: user._id,
      items: [{ productId: products[14]._id, name: products[14].name, sku: products[14].sku, price: products[14].price, quantity: 1, image: products[14].images[0] }],
      shippingAddress: { name: "Regular User", street: "123 Test St", city: "Lahore", province: "Punjab", country: "Pakistan", phone: "03001234567" },
      payment: { method: "jazzcash", status: "paid" }, status: "shipped",
      statusHistory: [
        { status: "pending", timestamp: new Date(Date.now() - 3 * 86400000), note: "Order placed" },
        { status: "shipped", timestamp: new Date(), note: "Handed to courier" }
      ],
      subtotal: products[14].price, shippingCost: 0, totalAmount: products[14].price
    });

    console.log("Created 3 orders.");
    console.log("Seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed: ", error);
    process.exit(1);
  }
};

seedDatabase();

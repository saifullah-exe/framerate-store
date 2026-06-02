// scripts/seed.js
// ---------------------------------------------------------------------------
// Kubernetes-safe database seeder for Framerate Store.
//
// Usage:
//   MONGODB_URI=mongodb://mongo-service:27017/framerate node scripts/seed.js
//
// Behaviour:
//   • Connects using the MONGODB_URI environment variable – no hard-coded URI.
//   • Reads the Products collection; if it already contains documents the
//     script exits without touching the database (idempotent / safe to run
//     on every pod start-up).
//   • If the collection is empty it inserts 5 default PC gaming products so
//     the UI has something to display immediately after first boot.
// ---------------------------------------------------------------------------

'use strict';

const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Minimal Product schema (mirrors models/Product.ts – kept in sync manually)
// ---------------------------------------------------------------------------
const ProductSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    slug:          { type: String, required: true, unique: true, index: true },
    brand: {
      type: String,
      enum: ['ASUS', 'MSI', 'Lenovo', 'Dell', 'HP', 'Razer', 'Acer'],
      required: true,
    },
    price:         { type: Number, required: true },
    originalPrice: { type: Number },
    stock:         { type: Number, required: true, default: 0 },
    sku:           { type: String, required: true, unique: true },
    specs: {
      cpu:     { type: String, required: true },
      gpu:     { type: String, required: true },
      ram:     { type: Number, required: true },
      storage: { type: String, required: true },
      display: { type: String, required: true },
      battery: { type: String, required: true },
      weight:  { type: Number, required: true },
    },
    images:   [{ type: String }],
    category: {
      type: String,
      enum: ['budget', 'mid-range', 'high-end', 'ultra'],
      required: true,
    },
    tags:    [{ type: String }],
    rating:  { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
    isActive:   { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ---------------------------------------------------------------------------
// 5 default products (RTX 4090 flagship → budget entry)
// ---------------------------------------------------------------------------
const DEFAULT_PRODUCTS = [
  {
    name: 'ASUS ROG Strix SCAR 17',
    slug: 'asus-rog-strix-scar-17',
    brand: 'ASUS',
    price: 850000,
    originalPrice: 900000,
    stock: 10,
    sku: 'ASUS-ROG-S17-4090',
    specs: {
      cpu: 'AMD Ryzen 9 7945HX',
      gpu: 'NVIDIA RTX 4090 16GB',
      ram: 32,
      storage: '2TB NVMe SSD',
      display: '17.3 inch QHD 240Hz',
      battery: '90Wh',
      weight: 3.0,
    },
    images: ['/images/products/asus-rog-scar17.png'],
    category: 'ultra',
    tags: ['RTX 4090', 'eSports', 'premium'],
    rating: { average: 5, count: 2 },
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Razer Blade 16',
    slug: 'razer-blade-16',
    brand: 'Razer',
    price: 750000,
    stock: 8,
    sku: 'RAZ-B16-4080',
    specs: {
      cpu: 'Intel Core i9-13950HX',
      gpu: 'NVIDIA RTX 4080 12GB',
      ram: 32,
      storage: '1TB NVMe SSD',
      display: '16 inch Dual Mode MiniLED',
      battery: '95.2Wh',
      weight: 2.45,
    },
    images: ['/images/products/razer-blade16.png'],
    category: 'high-end',
    tags: ['Thin', 'Premium', 'MiniLED', 'RTX 4080'],
    rating: { average: 4.6, count: 12 },
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Lenovo Legion Pro 7i',
    slug: 'lenovo-legion-pro-7i',
    brand: 'Lenovo',
    price: 520000,
    originalPrice: 550000,
    stock: 15,
    sku: 'LEN-L7I-4080',
    specs: {
      cpu: 'Intel Core i9-13900HX',
      gpu: 'NVIDIA RTX 4080 12GB',
      ram: 32,
      storage: '1TB NVMe SSD',
      display: '16 inch WQXGA 240Hz',
      battery: '99.9Wh',
      weight: 2.8,
    },
    images: ['/images/products/lenovo-legion-pro7i.png'],
    category: 'high-end',
    tags: ['Performance', 'RTX 4080'],
    rating: { average: 4.9, count: 25 },
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Acer Nitro 5',
    slug: 'acer-nitro-5',
    brand: 'Acer',
    price: 280000,
    stock: 30,
    sku: 'ACER-N5-4050',
    specs: {
      cpu: 'Intel Core i5-12500H',
      gpu: 'NVIDIA RTX 4050 6GB',
      ram: 16,
      storage: '512GB NVMe SSD',
      display: '15.6 inch FHD 144Hz',
      battery: '57Wh',
      weight: 2.5,
    },
    images: ['/images/products/acer-nitro5.png'],
    category: 'budget',
    tags: ['Entry Level', 'RTX 4050'],
    rating: { average: 4.1, count: 30 },
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'HP Omen 16',
    slug: 'hp-omen-16',
    brand: 'HP',
    price: 350000,
    originalPrice: 380000,
    stock: 20,
    sku: 'HP-OMEN16-4060',
    specs: {
      cpu: 'Intel Core i7-13700HX',
      gpu: 'NVIDIA RTX 4060 8GB',
      ram: 16,
      storage: '512GB NVMe SSD',
      display: '16.1 inch FHD 144Hz',
      battery: '83Wh',
      weight: 2.3,
    },
    images: ['/images/products/hp-omen16.png'],
    category: 'mid-range',
    tags: ['Value', 'RTX 4060'],
    rating: { average: 4.3, count: 18 },
    isActive: true,
    isFeatured: false,
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      '[seed] ERROR: MONGODB_URI environment variable is not set.\n' +
      '       Set it to a value like: mongodb://mongo-service:27017/framerate'
    );
    process.exit(1);
  }

  console.log('[seed] Connecting to MongoDB...');

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000, // give Kubernetes service time to be ready
  });

  console.log('[seed] Connected. Checking Products collection...');

  // Re-use an existing model if one is already registered (hot-reload safety).
  const Product =
    mongoose.models.Product || mongoose.model('Product', ProductSchema);

  const count = await Product.countDocuments();

  if (count > 0) {
    console.log(
      `[seed] Products collection already has ${count} document(s). Skipping seed.`
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log('[seed] Collection is empty. Inserting 5 default products...');

  const inserted = await Product.insertMany(DEFAULT_PRODUCTS);

  console.log(`[seed] ✅ Inserted ${inserted.length} products:`);
  inserted.forEach((p) => console.log(`        • ${p.name} (${p.sku})`));

  await mongoose.disconnect();
  console.log('[seed] Done. Connection closed.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Fatal error:', err.message || err);
  process.exit(1);
});

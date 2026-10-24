import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI missing! Check backend/.env');
  process.exit(1);
}
console.log('🔗 Using MONGO_URI:', process.env.MONGO_URI);

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const categoryData = [
  { name: 'Electronics', description: 'Electronic gadgets and devices' },
  { name: 'Accessories', description: 'Fashion and travel accessories' },
  { name: 'Footwear', description: 'Shoes, sneakers, and footwear' },
  { name: 'Food & Beverages', description: 'Gourmet food and drinks' },
  { name: 'Home Decor', description: 'Home decoration and furniture' },
  { name: 'Sports', description: 'Sports equipment and fitness gear' },
];

const productData = [
  {
    name: 'Wireless Headphones',
    description:
      'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear sound quality.',
    price: 149.99,
    categoryName: 'Electronics',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20wireless%20over%20ear%20headphones%20black%20color%20product%20photography%20white%20background&image_size=square_hd',
    stock: 25,
    rating: 4.5,
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life. Water-resistant design.',
    price: 299.99,
    categoryName: 'Electronics',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=smart%20watch%20fitness%20tracker%20silver%20color%20product%20photography%20white%20background&image_size=square_hd',
    stock: 18,
    rating: 4.7,
  },
  {
    name: 'Leather Messenger Bag',
    description:
      'Handcrafted genuine leather messenger bag perfect for work or travel. Fits laptops up to 15 inches.',
    price: 189.0,
    categoryName: 'Accessories',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vintage%20brown%20leather%20messenger%20bag%20product%20photography%20white%20background&image_size=square_hd',
    stock: 12,
    rating: 4.8,
  },
  {
    name: 'Running Sneakers',
    description:
      'Lightweight breathable running shoes with responsive cushioning technology for maximum comfort.',
    price: 129.5,
    categoryName: 'Footwear',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20running%20sneakers%20blue%20white%20color%20product%20photography%20white%20background&image_size=square_hd',
    stock: 42,
    rating: 4.3,
  },
  {
    name: 'Organic Coffee Beans 1kg',
    description:
      'Premium single-origin Arabica coffee beans, freshly roasted. Rich aroma and smooth flavor.',
    price: 34.99,
    categoryName: 'Food & Beverages',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20coffee%20beans%20in%20kraft%20paper%20bag%20product%20photography%20white%20background&image_size=square_hd',
    stock: 60,
    rating: 4.9,
  },
  {
    name: 'Desk Lamp LED',
    description:
      'Adjustable LED desk lamp with 5 brightness levels, USB charging port, and eye-care technology.',
    price: 59.99,
    categoryName: 'Home Decor',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20minimalist%20white%20led%20desk%20lamp%20product%20photography%20white%20background&image_size=square_hd',
    stock: 30,
    rating: 4.4,
  },
  {
    name: 'Yoga Mat Premium',
    description:
      'Extra-thick non-slip eco-friendly yoga mat with alignment lines. Perfect for all yoga styles.',
    price: 45.0,
    categoryName: 'Sports',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=purple%20yoga%20mat%20rolled%20up%20product%20photography%20white%20background&image_size=square_hd',
    stock: 35,
    rating: 4.6,
  },
  {
    name: 'Ceramic Plant Pot Set',
    description:
      'Set of 3 modern minimalist ceramic plant pots with drainage holes. Sizes: small, medium, large.',
    price: 39.99,
    categoryName: 'Home Decor',
    image:
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=set%20of%203%20white%20ceramic%20plant%20pots%20product%20photography%20white%20background&image_size=square_hd',
    stock: 22,
    rating: 4.2,
  },
  {
    name: 'iPhone 15 Pro Max',
    description:
      'Premium smartphone with a titanium design, and powerful A17 Pro chip.',
    price: 1199,
    categoryName: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
    stock: 15,
    rating: 4.8,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('\n🏷️  Creating categories...');
    const createdCategories = await Category.create(categoryData);
    console.log(`✅ Created ${createdCategories.length} categories`);
    createdCategories.forEach((c) =>
      console.log(`   • ${c.name} (${c._id})`)
    );

    const categoryMap = {};
    createdCategories.forEach((c) => {
      categoryMap[c.name] = c._id;
    });

    console.log('\n🛍️  Creating products...');
    const productsWithCategoryIds = productData.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: categoryMap[p.categoryName],
      image: p.image,
      stock: p.stock,
      rating: p.rating,
    }));

    const createdProducts = await Product.create(productsWithCategoryIds);
    console.log(`✅ Created ${createdProducts.length} products`);
    createdProducts.forEach((p) =>
      console.log(`   • ${p.name} - $${p.price}`)
    );

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   Categories: ${createdCategories.length}`);
    console.log(`   Products:   ${createdProducts.length}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();

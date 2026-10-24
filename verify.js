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

const verifyDB = async () => {
  try {
    console.log('🔌 Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected\n');

    const db = mongoose.connection.db;
    const dbName = mongoose.connection.name;
    const collections = await db.listCollections().toArray();
    console.log(`📦 Database: ${dbName}`);
    console.log(
      `🗂️  Collections: ${collections.map((c) => c.name).join(', ') || '(none)'}\n`
    );

    const rawCats = await db.collection('categories').find({}).toArray();
    console.log(`🏷️  RAW Categories (${rawCats.length}):`);
    rawCats.forEach((c) =>
      console.log(`   • ${String(c.name).padEnd(20)} _id=${c._id}`)
    );

    const rawProds = await db.collection('products').find({}).toArray();
    console.log(`\n🛍️  RAW Products (${rawProds.length}):`);
    rawProds.forEach((p) => {
      const cid = String(p.category);
      const t = Object.prototype.toString.call(p.category);
      const oid = p.category && p.category._bsontype === 'ObjectID';
      const kind = oid ? 'ObjectId' : typeof p.category;
      console.log(
        `   • ${String(p.name).padEnd(30)} $${String(p.price).padEnd(
          8
        )}  category=${cid}  (type=${kind})`
      );
    });

    const invalidCats = rawProds.filter(
      (p) => !(p.category && p.category._bsontype === 'ObjectID')
    );
    if (invalidCats.length > 0) {
      console.log(
        `\n⚠️  ${invalidCats.length} products have category NOT as ObjectId!`
      );
      invalidCats.forEach((p) =>
        console.log(`     - ${p.name}: category=${JSON.stringify(p.category)}`)
      );
    } else {
      console.log(`\n✅ All products.category are proper ObjectIds.`);
    }

    console.log('\n--- Now via Mongoose models + populate:');
    const catCount = await Category.countDocuments();
    const cats = await Category.find().lean();
    console.log(`🏷️  Mongoose Categories (${catCount}):`);
    cats.forEach((c) =>
      console.log(`   • ${c.name.padEnd(20)} id=${c._id}`)
    );

    const prodCount = await Product.countDocuments();
    const prods = await Product.find().populate('category', 'name').lean();
    console.log(`\n🛍️  Mongoose Products (${prodCount}):`);
    prods.forEach((p) => {
      const catName = p.category ? p.category.name : 'NO REF!';
      const catId = p.category ? p.category._id : '?';
      console.log(
        `   • ${p.name.padEnd(30)} $${String(p.price).padEnd(8)} stock=${String(
          p.stock
        ).padEnd(3)} rating=${p.rating}  cat=[${catName}] refId=${catId}`
      );
    });

    const brokenRefs = prods.filter((p) => !p.category);
    if (brokenRefs.length) {
      console.log(
        `\n⚠️  BROKEN ObjectId refs: ${brokenRefs.length} products without category`
      );
    } else {
      console.log(`\n✅ All product -> category ObjectId refs valid!`);
    }

    console.log('\n🎉 DB verification complete.');
    process.exit(0);
  } catch (e) {
    console.error('❌ VERIFY FAILED:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
};

verifyDB();

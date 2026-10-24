import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MERN E-commerce Product Catalog API',
    version: '1.0.0',
    database: process.env.MONGO_URI,
    endpoints: {
      health: 'GET    /api/health',
      products_list: 'GET    /api/products?category=X&search=Y',
      product_get: 'GET    /api/products/:id',
      product_create: 'POST   /api/products',
      product_update: 'PUT    /api/products/:id',
      product_delete: 'DELETE /api/products/:id',
      categories_list: 'GET    /api/categories',
      category_create: 'POST   /api/categories',
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MERN E-commerce API running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
  console.log(`🏷️  Categories: http://localhost:${PORT}/api/categories\n`);
});

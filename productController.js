import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).populate('category', 'name');
    const formattedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category ? p.category.name : 'Uncategorized',
      image: p.image,
      stock: p.stock,
      rating: p.rating,
    }));

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const formatted = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category ? product.category.name : 'Uncategorized',
      image: product.image,
      stock: product.stock,
      rating: product.rating,
    };

    res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate('category', 'name');
    const formatted = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category ? product.category.name : 'Uncategorized',
      image: product.image,
      stock: product.stock,
      rating: product.rating,
    };
    res.status(201).json({
      success: true,
      message: 'Product created in MongoDB',
      data: formatted,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true, context: 'query' }
    ).populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const formatted = {
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category ? product.category.name : 'Uncategorized',
      image: product.image,
      stock: product.stock,
      rating: product.rating,
    };

    res.status(200).json({
      success: true,
      message: 'Product updated in MongoDB',
      data: formatted,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted from MongoDB',
      deletedId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

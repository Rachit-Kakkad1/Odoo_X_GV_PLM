const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/products — List all products (paginated)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.user.role === 'Operations User') {
      query.status = 'Active';
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: String(req.query.search), $options: 'i' } },
        { sku: { $regex: String(req.query.search), $options: 'i' } }
      ];
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = String(req.query.status);
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ 
      success: true, 
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — Get single product
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (req.user.role === 'Operations User' && product.status !== 'Active') {
      return res.status(403).json({ success: false, message: 'Access denied. You can only view active products.' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

module.exports = router;


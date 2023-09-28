const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Error handling middleware
const handleErrors = (res, err) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};

// GET all products with associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, Tag],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    return res.json(products);
  } catch (err) {
    handleErrors(res, err);
  }
});

// GET one product by its `id` value with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, Tag],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    handleErrors(res, err);
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    return res.status(201).json(product);
  } catch (err) {
    handleErrors(res, err);
  }
});

// PUT update product by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [updatedProductCount] = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedProductCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ... (tag updates logic)

    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    handleErrors(res, err);
  }
});

// DELETE a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProductCount = await Product.destroy({
      where: { id: req.params.id },
    });

    if (deletedProductCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    handleErrors(res, err);
  }
});

module.exports = router;
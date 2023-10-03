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
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// GET one product by its `id` value with associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(productData);
  } catch (err) {
    handleErrors(res, err);
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  try {
    // Create the product and get its ID
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    // Check if tagIds were provided and the product was created
    if (req.body.tagIds && product) {
      // Create an array of objects to insert into the product_tag table
      const productTagIdArr = req.body.tagIds.map((tagId) => ({
        product_id: product.id,
        tag_id: tagId,
      }));

      // Bulk insert the product_tag associations
      await ProductTag.bulkCreate(productTagIdArr);
    }

    // Send a success response with the newly created product
    res.status(201).json(product);
  } catch (err) {
    // Handle any errors that occur during the process
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update product by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const productData = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!productData[0]) {
      res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    handleErrors(res, err);
  }
});

// DELETE a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      // If no product was deleted, return a 404 status code
      return res.status(404).json({ message: 'Product not found' });
    }

    // If a product was successfully deleted, return a 200 status code
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    // Handle any errors that occur during the process
    handleErrors(res, err);
  }
});

module.exports = router;
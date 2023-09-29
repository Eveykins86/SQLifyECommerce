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
    /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create({
    .then((product) => {
      if(req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      handleErrors(res, err);
    })
  });

// PUT update product by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [updatedProductCount] = await Product.update(
      {
        product_name: req.body.product_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (updatedProductCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully' });
  } catch (err) {
    handleErrors(res, err);
  }
});

// DELETE a product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedProductCount = await Product.destroy({
      where: {
        id: req.params.id,
      },
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
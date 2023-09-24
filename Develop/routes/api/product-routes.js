const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

//GET all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product by ID
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// UPDATE product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length > 0) {
      const existingTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const existingTagIds = existingTags.map(({ tag_id }) => tag_id);

      const newTagIds = req.body.tagIds.filter((tag_id) => !existingTagIds.includes(tag_id));
      const productTagsToRemove = existingTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id));

      await ProductTag.destroy({
        where: { id: productTagsToRemove.map(({ id }) => id) },
      });

      const newProductTags = newTagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: { id: req.params.id },
    });

    res.json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
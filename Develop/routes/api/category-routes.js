const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories with associated products
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: Product,
    });

    if (categories.length === 0) {
      return res.status(404).send('No categories found');
    }

    return res.json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// GET one category by its `id` value with associated products
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: Product,
    });

    if (!category) {
      return res.status(404).send('Category not found');
    }

    return res.json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return res.status(201).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// PUT update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [updatedCategoryCount] = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (updatedCategoryCount === 0) {
      return res.status(404).send('Category not found');
    }

    return res.status(200).send('Category updated successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// DELETE a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategoryCount = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (deletedCategoryCount === 0) {
      return res.status(404).send('Category not found');
    }

    return res.status(200).send('Category deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;

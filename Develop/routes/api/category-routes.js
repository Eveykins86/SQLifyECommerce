const router = require('express').Router();
const { Category, Product } = require('../../models');

// GET all categories with associated products
router.get('/', async (req, res) => {
  try {
    const categoriesData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one category by its `id` value with associated products
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      return res.status(404).send('Category not found');
    }

    return res.json(categoryData);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// POST create a new category
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name,
    });

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowCount] = await Category.update(
      {
        category_name: req.body.category_name,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updatedRowCount) {
      return res.status(404).send('Category not found');
    }

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowCount = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedRowCount) {
      return res.status(404).send('Category not found');
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

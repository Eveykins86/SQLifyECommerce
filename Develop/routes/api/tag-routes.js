const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

// GET all tags with associated products
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });

    if (!tagData) {
      return res.status(404).json({ message: "Tag not found."});
    };
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one tag by its `id` value with associated products
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name }, // Specify the new tag name to update
      { where: { id: req.params.id } }
    );

    res.json(updatedTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: { id: req.params.id },
    });

    res.json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
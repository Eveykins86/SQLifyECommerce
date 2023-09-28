const router = require('express').Router();
const { Tag, Product } = require('../../models');

// GET all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      include: [Product],
    });

    if (tags.length === 0) {
      return res.status(404).send('No tags found');
    }

    return res.json(tags);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// GET one tag by its `name` with associated Product data
router.get('/:name', async (req, res) => {
  try {
    const tagName = req.params.name;
    const tag = await Tag.findOne({
      where: { tag_name: tagName },
      include: [Product],
    });

    if (!tag) {
      return res.status(404).send('Tag not found');
    }

    return res.json(tag);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// GET one tag by its `id` with associated Product data
router.get('/id/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const tag = await Tag.findByPk(tagId, {
      include: [Product],
    });

    if (!tag) {
      return res.status(404).send('Tag not found');
    }

    return res.json(tag);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// POST create a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    return res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// PUT update tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTagCount = await Tag.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedTagCount[0] === 0) {
      return res.status(404).send('Tag not found');
    }

    return res.status(200).json({ message: 'Tag updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

// DELETE a tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deletedTagCount = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (deletedTagCount === 0) {
      return res.status(404).send('Tag not found');
    }

    return res.status(200).send('Tag deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
});

module.exports = router;
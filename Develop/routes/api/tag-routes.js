const router = require('express').Router();
const { Tag, Product } = require('../../models');

// GET all tags with associated Product data
router.get('/', async (req, res) => {
  try {
    const tagsData = await Tag.findAll({
      include: [{ model: Product }],
    });

    res.status(200).json(tagsData);
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
      include: [{ model: Product }],
    });

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    return res.json(tag);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET one tag by its `id` with associated Product data
router.get('/id/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product}],
  
  });
  if (!tagData) {
  res.status(404).json({ message: 'Tag not found' });
  return;
  }
  
  res.status(200).json(tagData);
  } catch (err) {
  res.status(500).json(err);
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
    const tagData = await Tag.update(req.body, 
    {
      where: {
        id: req.params.id,
      },
    }
  );

  if (!tagData[0]) {
    return res.status(404).send('Tag not found');
  }

  res.status(200).json({ message: 'Tag updated successfully' });
} catch (err) {
  res.status(500).json(err);
}
});

// DELETE a tag by its `id` value
router.delete('/id/:id', async (req, res) => {
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
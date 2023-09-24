const { Category } = require('../models');

const categoryData = [
  {
    category_name: 'Shirts',
    category_id: 1,
  },
  {
    category_name: 'Shorts',
    category_id: 2,
  },
  {
    category_name: 'Music',
    category_id: 3,
  },
  {
    category_name: 'Hats',
    category_id: 4,
  },
  {
    category_name: 'Shoes',
    category_id: 5,
  },
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;

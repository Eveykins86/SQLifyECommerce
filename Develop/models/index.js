// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignkey: 'category_id',
});
//Categories have many products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL',
});
// Products belongToMany Tags (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignkey: 'tag_id',
});
// Tags belongToMany Products (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignkey: 'product_id',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

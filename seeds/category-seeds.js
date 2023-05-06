const { Category } = require('../models');

const categoryData = [
  {
    category_name: 'Cleanser',
  },
  {
    category_name: 'Serum',
  },
  {
    category_name: 'Exfoliators',
  },
  {
    category_name: 'Masques',
  },
  {
    category_name: 'Eyecream',
  },
];

const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;

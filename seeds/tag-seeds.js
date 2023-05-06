const { Tag } = require('../models');

const tagData = [
  {
    tag_name: 'acne',
  },
  {
    tag_name: 'aging',
  },
  {
    tag_name: 'dark spots',
  },
  {
    tag_name: 'dryness',
  },
  {
    tag_name: 'protection',
  },
  {
    tag_name: 'pigmentation',
  },
  {
    tag_name: 'wrinkles',
  },
  {
    tag_name: 'texture',
  },
];

const seedTags = () => Tag.bulkCreate(tagData);

module.exports = seedTags;

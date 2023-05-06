const { Product } = require('../models');

const productData = [
  {
    product_name: 'Mega-purifying',
    price: 25.99,
    stock: 10,
    category_id: 1,
  },
  {
    product_name: 'Gentle Face Wash',
    price: 30.99,
    stock: 15,
    category_id: 2,
  },
  {
    product_name: 'Living Cell Clairfier',
    price: 33.99,
    stock: 12,
    category_id: 3,
  },
  {
    product_name: 'Ultra Hydro Gel',
    price: 42.99,
    stock: 14,
    category_id: 4,
  },
  {
    product_name: 'SPF 15',
    price: 29.99,
    stock: 15,
    category_id: 5,
  },
];

const seedProducts = () => Product.bulkCreate(productData);

module.exports = seedProducts;

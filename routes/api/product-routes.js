const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data

  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        {
          model: Tag,
          through: {
            attributes: [],
          }
        }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      res.status(404).json({ message: 'No driver found with that id!' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const productData = await Product.create(req.body)
    console.log(req.body)
    if (req.body.tag_ids) {
      const productTagIdArr = req.body.tag_ids.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      })
      const productTagData = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json({ productData, productTagData });
    } else {
      res.status(200).json(productData)
    }


  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  };

});

// update product
router.put('/:id', async (req, res) => {

  try {
    // update product data
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })

    // find all associated tags from ProductTag
    const productTagData = await ProductTag.findAll({ where: { product_id: req.params.id } });

    // get list of current tag_ids
    const productTagIds = productTagData.map(({ tag_id }) => tag_id);
    console.log(productTagIds)
    // create filtered list of new tag_ids
    const newProductTags = req.body.tag_id
      .filter((tag_id) => !productTagIds.includes(tag_id)) //find where updated tags do not equal current tags
      .map((tag_id) => { // with list of new tags, return new ProductTag entry
        console.log(tag_id)
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    // figure out which ones to remove
    const productTagsToRemove = productTagData
      .filter(({ tag_id }) => !req.body.tag_id.includes(tag_id)) // grab existing product tags that aren't matched in the user input
      .map(({ id }) => id); //grab ids

    // run both actions
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);

    res.status(200).json({productData, updatedProductTags})
  } catch (err) {
  console.log(err);
  res.status(400).json(err);
  }
})



router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      }
    })
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
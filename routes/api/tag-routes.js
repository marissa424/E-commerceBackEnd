const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    })
    res.status(200).json(tagData)

  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],

    })
    if (!tagData) {
      res.status(404).json({ message: "No tag associated with this id!" })
      return;
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
    console.log(err)
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  /* req.body should look like this...
    {
      tag_name: "Basketball",
      productIds: [1, 2, 3, 4]
    }
  */
  try {
    const tagData = await Tag.create(req.body)
    if (req.body.productIds.length) {
      // add product ids to the ProductTag table
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tagData.id,
          product_id,
        }
      });

      const productTagData = await ProductTag.bulkCreate(productTagIdArr)
      res.status(200).json({ tagData, productTagData })
    } else {
      res.status(200).json(tagData)
    }

  } catch (err) {
    res.status(500).json(err)
  }

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value

  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    })

    if (req.body.product_id.length > 0) {
      // find products associated with updated tag id
      const productTagData = await ProductTag.findAll({
        where: {
          tag_id: req.params.id,
        }
      })
      // if there's ProductTag data for this tag, do this:

      let newProductTags;
      let productTagsToRemove;
      if (productTagData.length > 0) {
        console.log("product_tag has existing entries")
        // find new tags to product, excluding existing
        const productIds = productTagData.map(({ product_id }) => product_id);

        newProductTags = req.body.product_id
          .filter((product_id) => !productIds.includes(product_id)) // grab products from request params that aren't already in ProductTag
          .map((product_id) => {
            return {
              tag_id: req.params.id,
              product_id,
            }
          })

        productTagsToRemove = productTagData
          .filter(({ product_id }) => !req.body.product_id.includes(product_id)) // grab products from request params that aren't already in ProductTag
          .map(({ id }) => id);
        console.log(productTagsToRemove)

      } else {

        newProductTags = req.body.product_id
          .map((product_id) => {
            return {
              tag_id: req.params.id,
              product_id,
            }

          })
        productTagsToRemove = -1;
        console.log(newProductTags)
      }

      const updatedProductTags = await Promise.all(
        [
          await ProductTag.destroy({
            where: {
              id: productTagsToRemove
            }
          }),
          await ProductTag.bulkCreate(newProductTags)
        ]
      )


    }

    res.status(200).json(tagData)


  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }

});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!tagData) {
      res.status(404).json("No tag with that id!")
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;

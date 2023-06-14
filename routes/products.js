const router = require('express').Router()
const Product = require('../models/product')

// Route    /api/products
// Desc     Get all products
// Access   Public
router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) -1 || 0
        const limit = parseInt(req.query.limit) || 8
        const search = req.query.search || ''
        let sort = req.query.sort || 'rating'
        let category = req.query.category || 'All'

		const categoryOptions = [
			"Security",
			"Networking",
			"Internet of Things",
			"Development",
			"Media",
			"Database",
			"Storage",
			"Artificial Intelligence",
			"Analytics",
			"Compute",
			"Management",
		];

        category === 'All'
            ? (category = [...categoryOptions])
            : (category = req.query.category.split(','))
        req.query.sort 
            ? (sort = req.query.sort.split(','))
            : (sort = [sort])
        let sortBy = {}
        sortBy[sort[0]] = req.query.order

        const products = await Product.find({name: {$regex: search, $options: 'i'}})
            .where('category')
            .in([...category])
            .sort(sortBy)
            .skip(page*limit) //page 0 skips 0 docs, page 1 skips 5 docs..
            .limit(limit)

        const total = await Product.countDocuments({
            category: {$in: [...category]},
            name: {$regex:search, $options: 'i'}
        })

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            categories: categoryOptions,
            products
        }

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: true, msg: error})
    }
})


// Route    /api/products
// Desc     Get only name desc and price for all products
// Access   Public
router.get('/products/reduced', async (req, res) => {
    try {
      const products = await Product.find({}, 'name description price').lean();
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


// Route    /api/products/:id
// Desc     Get product by id
// Access   Public
router.get('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id
        const product = await Product.findById(productId)

        if (!product) {
            res.status(404).json({error: "product not found"})
        }
        res.status(200).json(product)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
    }
})

// const insertProducts = async () => {
//     try {
//         const docs = await Product.insertMany(products)
//         return Promise.resolve(docs)
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }

// insertProducts()
//     .then((docs) => console.log(docs))
//     .catch((err) => console.log(err))

module.exports = router
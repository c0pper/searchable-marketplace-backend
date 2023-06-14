const router = require('express').Router()
const Movie = require('../models/movie')
const products = require('../config/products.json')
const Product = require('../models/product')

router.get('/movies', async (req, res) => {
    try {
        const page = parseInt(req.query.page) -1 || 0
        const limit = parseInt(req.query.limit) || 5
        const search = req.query.search || ''
        let sort = req.query.sort || 'rating'
        let genre = req.query.genre || 'All'

		const genreOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

        genre === 'All'
            ? (genre = [...genreOptions])
            : (genre = req.query.genre.split(','))
        req.query.sort 
            ? (sort = req.query.sort.split(','))
            : (sort = [sort])
        let sortBy = {}
        sortBy[sort[0]] = req.query.order

        const movies = await Movie.find({name: {$regex: search, $options: 'i'}})
            .where('genre')
            .in([...genre])
            .sort(sortBy)
            .skip(page*limit) //page 0 skips 0 docs, page 1 skips 5 docs..
            .limit(limit)

        const total = await Movie.countDocuments({
            genre: {$in: [...genre]},
            name: {$regex:search, $options: 'i'}
        })

        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            genres: genreOptions,
            movies
        }

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({error: true, msg: error})
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
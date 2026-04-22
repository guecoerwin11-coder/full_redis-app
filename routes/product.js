const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controller/productController')
const { createSchema, updateSchema } = require('../schema/productSchema')
const validate = require('../middleware/validate')
const protect = require('../middleware/protect')
const cache = require('../middleware/cache')
const express = require('express')
const router = express.Router()

router.get('/', protect, cache('products', 60), getProducts)
router.get('/:id', protect, (req, res, next) => {cache(`product:${req.params.id}`, 60)(req, res, next)}, getProductById)
router.post('/', protect, validate(createSchema), createProduct)
router.put('/:id', protect, validate(updateSchema), updateProduct)
router.delete('/:id', protect, deleteProduct)

module.exports = router
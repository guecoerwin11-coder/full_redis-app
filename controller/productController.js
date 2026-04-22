const User = require('../models/authentication')
const Product = require('../models/product')
const redisClient = require('../middleware/redis')


const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 3
        const search = req.query.search || ''
        const skip = (page - 1) * limit

        const searchProduct = search ? { brand: { $regex: search, $options: 'i' } } : {}

        const products = await Product.find(searchProduct)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
        const total = await Product.countDocuments(searchProduct)

        await redisClient.set(`products:${page}:${limit}:${search}`, JSON.stringify(products), { ex: 60 })

        res.status(200).json({
            page,
            limit,
            total,
            fromcache: false,
            message: 'Products retrieved successfully',
            products
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
}

const getProductById = async (req, res) => {
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }

        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        await redisClient.set(`product:${req.params.id}`, JSON.stringify(product), { ex: 60 })

        res.status(200).json({ 
            message: 'Product retrieved successfully',
            product })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            brand: req.body.brand,
            quantity: req.body.quantity,
            category: req.body.category,
            supplies: req.body.supplies,
            user: req.user.id
        })

        await redisClient.del('products')


        res.status(201).json({ message: 'Product created successfully', product })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })

    }
}

const updateProduct = async (req, res) => {
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        res.status(200).json({ message: 'Product updated successfully', product })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

const deleteProduct = async (req, res) => {
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid product ID' })
        }
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        
        await redisClient.del(`product:${req.params.id}`)
        await redisClient.del('products')
        res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
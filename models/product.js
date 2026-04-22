const mongoose = require('mongoose')
const User = require('./authentication')

const productSchema = new mongoose.Schema({
    brand: {
        type: String,
        requred: true,
        trim: true
    },
    quantity: {
        type: String,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true
    },
    supplies: {
        type: String,
        required:true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

module.exports = Product
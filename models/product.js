const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: { type: String, required: true },
    img: {type: String, required: true},
    category: { type: String, required: true },
    price: {type: Number, required: true},
    rating: {type: Number, required: true},
    dateAdded: { type: Date, default: Date.now }
}, 
{ collection: 'products' });

module.exports = mongoose.model("product", productSchema, 'products');
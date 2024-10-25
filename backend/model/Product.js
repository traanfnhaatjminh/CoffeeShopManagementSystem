const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,  
    },
    pname: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: String,
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    discount: Number,
    status: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


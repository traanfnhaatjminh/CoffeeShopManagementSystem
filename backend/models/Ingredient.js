const mongoose = require('mongoose');
const moment = require('moment-timezone');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    current_quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
        trim: true
    },
    cost_price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    capacity:{
        type: Number,
        required: true,
    }
}, { timestamps: true });

ingredientSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.createdAt = moment(obj.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm');
    obj.updatedAt = moment(obj.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm');
    return obj; 
};

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;

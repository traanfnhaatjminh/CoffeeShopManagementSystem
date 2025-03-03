const mongoose = require('mongoose');

const warehouseCardSchema = new mongoose.Schema({
    ingredient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ingredient",
    },
    method: {
        type: String,
        required: true,
        trim: true
    },
    current_quantity: {
        type: Number,
        required: true,
    },
    cost_price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const WarehouseCard = mongoose.model('WarehouseCard', warehouseCardSchema);

module.exports = WarehouseCard;

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
    },
    supplier: {
        type: String,
        required: true,
        trim: true
    },
}, { timestamps: true });

warehouseCardSchema.methods.toJSON = function () {
    const obj = this.toObject();

    obj.createdAt = moment(obj.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm');
    obj.updatedAt = moment(obj.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm');

    return obj;
};

const WarehouseCard = mongoose.model('WarehouseCard', warehouseCardSchema);

module.exports = WarehouseCard;

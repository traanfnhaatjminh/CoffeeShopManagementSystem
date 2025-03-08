const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    group_name: {
        type: String,
        required: true,
    },
    category_name: {
        type: String,
        required: true,
    },
    status: { //Trang thái
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});

module.exports = mongoose.model("Category", categorySchema);

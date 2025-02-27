const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        pname: {
            type: String,
            required: true,
            unique: true,
        },
        quantity: {
            type: Number,
        },
        price: {
            type: Number,
            required: true,
        },
        image:{
            type: String
        },
        cloudinary_id:{
            type: String
        },
        category_id: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        discount: Number,
        status: Number,
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

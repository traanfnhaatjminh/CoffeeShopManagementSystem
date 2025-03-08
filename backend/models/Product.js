const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        pname: {
            type: String,
            required: true,
            unique: true,
        },
        cost_price: {
            type: Number,
            required: true,
        },
        sale_price: {
            type: Number,
            required: true,
        },
        image: {
            type: String
        },
        cloudinary_id: {
            type: String
        },
        category_id: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        discount: Number,
        status: { //Trang thái
            type: String,
            required: true,
            enum: ['active', 'inactive', 'out of stock'],
            default: 'active',
        },
        ingredients: [
            {
                ingredient_id: {
                    type: Schema.Types.ObjectId,
                    ref: "Ingredient",
                },
                quantitative: {
                    type: Number,
                },
                TotalPerIngredient: {
                    type: Number,
                },
            },
        ],
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
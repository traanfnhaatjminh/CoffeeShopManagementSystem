const { WarehouseCard } = require("../../models");
const Ingredient = require("../../models/Ingredient");
const mongoose = require('mongoose');  // To create an ObjectId
const moment = require('moment-timezone');
const Product = require("../../models/Product");

const createNewIngredient = async (req, res, next) => {
    try {
        const { name, cost_price, unit, quantity, capacity, supplier } = req.body;
        const Id = new mongoose.Types.ObjectId();
        const remaining_quantity = Number(quantity) * Number(capacity);
        const current_quantity = remaining_quantity;
        const newIngredient = new Ingredient({
            _id: Id,
            name,
            unit,
            current_quantity,
            capacity,
            purchase_history: [{
                quantity,
                remaining_quantity,
                cost_price,
                supplier,
                date: moment().tz('Asia/Ho_Chi_Minh').toDate()
            }]
        });
        await newIngredient.save();
        res.status(201).json({
            message: "Insert successfully.",
            result: newIngredient
        });
    } catch (error) {
        next(error);
    }
};

const updateIngredient = async (req, res, next) => {
    const { ingredientId } = req.params;
    console.log(ingredientId);

    const { name, cost_price, unit, quantity, capacity } = req.body;
    const current_quantity = quantity;

    try {
        const updatedIngredient = {
            name,
            cost_price,
            unit,
            quantity,
            capacity,
            current_quantity
        };

        const ingredient = await Ingredient.findByIdAndUpdate(ingredientId, updatedIngredient, { new: true });
        if (!ingredient) {
            return res.status(404).json({ message: "Không tìm thấy nguyên liệu!" });
        }
        res.status(200).json({ message: "Cập nhật nguyên liệu thành công.", ingredient });
    } catch (error) {
        next(error);
    }
};

const importIngredient = async (req, res, next) => {
    try {
        const { ingredientId } = req.params;
        const { quantity, cost_price, supplier } = req.body;
        console.log("Dữ liệu nhận từ client:", req.body);
        console.log("ID nguyên liệu:", ingredientId);

        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) return res.status(404).json({ error: "Không tìm thấy nguyên liệu" });

        const remaining_quantity = Number(quantity) * Number(ingredient.capacity);
        // Cập nhật số lượng
        ingredient.current_quantity = Number(ingredient.current_quantity) + remaining_quantity;

        // Lưu vào lịch sử nhập hàng
        const date = new Date(); // Không cần đổi múi giờ
        console.log("Date (as JavaScript object):", date);
        console.log("Date (formatted with moment):", moment(date).format('YYYY-MM-DD HH:mm:ss'));

        ingredient.purchase_history.push({ quantity, remaining_quantity, cost_price, supplier, date });

        await ingredient.save();

        const products = await Product.find({ "ingredients.ingredient_id": ingredientId }).populate("ingredients.ingredient_id");

        for (const product of products) {
            let canBeActive = true; // Cờ kiểm tra xem product có thể active hay không

            for (const ing of product.ingredients) {
                // Bỏ qua nguyên liệu vừa nhập
                if (ing.ingredient_id._id.toString() === ingredientId) continue;

                let unitParts = ing.ingredient_id.unit.split("/");
                let baseUnit = unitParts[1]?.toLowerCase(); // Lấy đơn vị gốc (g, ml, kg)

                let minRequired = 0;
                if (baseUnit === "g") minRequired = 50;
                if (baseUnit === "ml") minRequired = 500;
                if (baseUnit === "kg") minRequired = 0.3;

                if (ing.ingredient_id.current_quantity <= minRequired) {
                    canBeActive = false; // Nếu có ít nhất một nguyên liệu không đủ, không thể active
                    break;
                }
            }

            // Nếu tất cả nguyên liệu đủ, cập nhật trạng thái về "active"
            if (canBeActive && product.status === "out of stock") {
                product.status = "active";
                await product.save();
            }
        }

        res.json(ingredient);
    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
}

const getAllIngredients = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(
            ingredients
        );
    } catch (error) {
        next(error);
    }
};



module.exports = { createNewIngredient, getAllIngredients, updateIngredient, importIngredient };

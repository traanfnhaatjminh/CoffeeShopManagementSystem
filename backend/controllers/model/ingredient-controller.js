const { WarehouseCard } = require("../../models");
const Ingredient = require("../../models/Ingredient");
const mongoose = require('mongoose');  // To create an ObjectId
const moment = require('moment-timezone');

const createNewIngredient = async (req, res, next) => {
    try {
        const { name, cost_price, unit, quantity, capacity } = req.body;
        const Id = new mongoose.Types.ObjectId();
        const current_quantity = quantity;
        const newIngredient = new Ingredient({
            _id: Id,
            name,
            unit,
            current_quantity,
            capacity,
            purchase_history: [{
                quantity,
                cost_price,
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

        // Cập nhật số lượng
        ingredient.current_quantity = Number(ingredient.current_quantity) + Number(quantity);

        // Lưu vào lịch sử nhập hàng
        ingredient.purchase_history.push({ quantity, cost_price, supplier, date: moment().tz('Asia/Ho_Chi_Minh').toDate() });

        await ingredient.save();
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

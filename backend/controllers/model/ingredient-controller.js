const { WarehouseCard } = require("../../models");
const Ingredient = require("../../models/Ingredient");
const mongoose = require('mongoose');  // To create an ObjectId

const createNewIngredient = async (req, res, next) => {
    try {
        const {name, cost_price, unit, quantity, capacity} = req.body;
        const Id = new mongoose.Types.ObjectId();
        const current_quantity = quantity;
        const newIngredient = new Ingredient({ _id: Id, name, cost_price, unit, current_quantity, quantity, capacity});
        await newIngredient.save();

        const wcID = new mongoose.Types.ObjectId();
        const method = "Nhập hàng";
        const newWarehouseCard = new WarehouseCard({wcID, method, current_quantity, cost_price, quantity});
        await newWarehouseCard.save();
        res.status(201).json({
            message: "Insert successfully.",
            result: newIngredient
        });
    } catch (error) {
        next(error);
    }
};

const getAllIngredients= async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(
            ingredients
        );
    } catch (error) {
        next(error);
    }
};

module.exports = {createNewIngredient, getAllIngredients};

const Category = require("../../model/Category");
const mongoose = require('mongoose');  // To create an ObjectId

const createNewCategory = async (req, res, next) => {
    try {
        // Extract data from req.body
        const { group_name, category_name } = req.body;
        const cId = new mongoose.Types.ObjectId();

        const newCategory = new Category({ _id: cId, group_name, category_name });
        await newCategory.save().then(newDoc => {
            res.status(201).json({
                message: "Insert successfully.",
                result: newDoc
            })
        })
    } catch (error) {
        next(error);
    }
};

const getAllCategory = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(
            categories
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { createNewCategory, getAllCategory };
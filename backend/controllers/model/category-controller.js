const Category = require("../../models/Category");
const mongoose = require('mongoose');  // To create an ObjectId

const createNewCategory = async (req, res, next) => {
    try {
        const { group_name, category_name } = req.body;
        const cId = new mongoose.Types.ObjectId();
        const newCategory = new Category({ _id: cId, group_name, category_name });
        await newCategory.save();
        res.status(201).json({
            message: "Insert successfully.",
            result: newCategory
        });
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

const getCategoryById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { group_name, category_name } = req.body;
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { group_name, category_name },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category updated successfully",
            result: updatedCategory
        });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category deleted successfully",
            result: deletedCategory
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createNewCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory };
const Category = require("../../models/Category");
const Product = require("../../models/Product");
const mongoose = require('mongoose');  // To create an ObjectId

//tao category moi
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

//lay tat ca category
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

//tim category theo id
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

//cap nhat category 
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

// const deleteCategory = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//         const deletedCategory = await Category.findByIdAndDelete(id);
//         if (!deletedCategory) {
//             return res.status(404).json({ message: "Category not found" });
//         }
//         res.status(200).json({
//             message: "Category deleted successfully",
//             result: deletedCategory
//         });
//     } catch (error) {
//         next(error);
//     }
// };

const inactiveCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra ID có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        // Cập nhật trạng thái danh mục
        const updatedCategory = await Category.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        // Cập nhật trạng thái của tất cả sản phẩm liên quan
        await Product.updateMany({ category_id: id }, { status });

        res.status(200).json({ message: "Trạng thái danh mục đã được cập nhật", updatedCategory });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái danh mục:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};



module.exports = { createNewCategory, getAllCategory, getCategoryById, updateCategory, inactiveCategory };
const Product = require("../../model/Product");
const Category = require('../../model/Category'); // Đường dẫn tới model danh mục
const mongoose = require("mongoose");
const csv = require("csvtojson");
const createNewProduct = async (req, res, next) => {
    try { 
        const { pname, quantity, price, category_id } = req.body;
        const pId = new mongoose.Types.ObjectId();
        const discount = 0;
        const status = 1;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const newProduct = new Product({ _id: pId, pname, quantity, price, image, category_id, discount, status });

        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: "Insert successfully.",
            result: savedProduct
        });
    } catch (error) {
        next(error);
    }
};

const getAllProductInWarehouse = async (req, res, next) => {
    try {
        const products = await Product.find()
            .populate('category_id')
            .exec();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getAllProductInHome = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

const getProductsByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        console.log("Category ID from request:", categoryId);

        // Check if categoryId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Query the products by category_id
        const products = await Product.find({ category_id: categoryId });
        console.log("Products found:", products);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this category." });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error in getProductsByCategory:', error);  // Log the error
        return res.status(500).json({ message: "An error occurred while fetching products." });
    }
};


// Edit products
// const updateProduct = async (req, res, next) => {
//     try {
//         const { productId } = req.params;
//         const { pname, quantity, price, image, category_id } = req.body;

//         const updatedProduct = await Product.findByIdAndUpdate(
//             productId,
//             { pname, quantity, price, image, category_id},
//             { new: true }
//         ).populate('category_id');
//         if (!updatedProduct) {
//             return res.status(404).json({ message: "Product not found." });
//         }
//         res.status(200).json({
//             message: "Product updated successfully.",
//             result: updatedProduct
//         });
//     } catch (error) {
//         next(error);
//     }
// };
const updateProduct = async (req, res, next) => {
    const { productId } = req.params;
    console.log(productId);

    const { pname, quantity, price, category_id } = req.body;
    const image = req.file ? req.file.filename : undefined;  // không có ảnh mới thì để undefined hihi

    try {
        const updatedProduct = {
            pname,
            quantity,
            price,
            category_id,
        };
        //cập nhật đường dẫn ảnh
        if (image) {
            updatedProduct.image = `/uploads/${image}`;
        }

        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        next(error);
    }
};
//Delete product
// const deleteProduct = async (req, res, next) => {
//     try {
//         const { productId } = req.params;
//         const deletedProduct = await Product.findByIdAndDelete(productId);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: " Product not found" });
//         }
//         res.status(200).json({
//             message: "Product deleted successfully",
//             result: deletedProduct
//         });
//     } catch (error) {
//         next(error);
//     }
// };
const deleteProduct = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(productId, { status: 0 }, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: " Product not found" });
        }
        res.status(200).json({
            message: "Product status updated successfully",
            result: updatedProduct
        });
    } catch (error) {
        next(error);
    }
}
// import product
const importProduct = async (req, res, next) => {
    try {
        const products = await csv().fromFile(req.file.path);
        const productData = [];
        const duplicateProducts = [];
        const defaultImage = '../../uploads/default.jpg';
        // map để lưu danh sách danh mục với tên và ID
        const categories = await Category.find(); // list all categories
        const categoryMap = new Map();
        categories.forEach(category => {
            categoryMap.set(category.category_name.trim(), category._id);
        });
        for (const item of products) {
            const pname = item.ten_san_pham.trim();
            const quantity = Number(item.so_luong);
            const price = Number(item.gia);
            const categoryName = item.category_name.trim();
            // Tìm ID của danh mục từ map
            const categoryId = categoryMap.get(categoryName);

            const existingProduct = await Product.findOne({ pname });
            if (existingProduct) {
                duplicateProducts.push(pname);
            } else {
                productData.push({
                    pname,
                    quantity,
                    price,
                    image: defaultImage,
                    category_id: categoryId,
                    discount: 0,
                    status: 1
                });
            }
        }
        if (productData.length > 0) {
            await Product.insertMany(productData);
            return res.status(200).json({ success: true, count: productData.length, duplicates: duplicateProducts });
        }
        return res.status(200).json({ success: false });
    } catch (error) {
        console.error('Error importing products:', error);
        next(error);
    }
};

module.exports = { createNewProduct, getAllProductInHome, getAllProductInWarehouse, getProductsByCategory, updateProduct, deleteProduct, importProduct };


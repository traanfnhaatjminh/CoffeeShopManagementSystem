const Product = require("../../models/Product");
const Category = require('../../models/Category'); // Đường dẫn tới model danh mục
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../../utils/uploadService");

const createNewProduct = async (req, res, next) => {
    try {
        const { pname, sale_price, cost_price, category_id, ingredients } = req.body;
        const pId = new mongoose.Types.ObjectId();
        const discount = 0;
        const status = "active";
        // Kiểm tra và chuyển đổi ingredients từ JSON string
        const parsedIngredients = ingredients ? JSON.parse(ingredients) : [];
        // Upload ảnh lên Cloudinary (nếu có file)
        let imageUrl = "";
        let cloudinaryId = "";

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            imageUrl = result.secure_url;
            cloudinaryId = result.public_id;
        }
        // Tạo sản phẩm mới
        const newProduct = new Product({
            _id: pId,
            pname,
            sale_price,
            cost_price,
            image: imageUrl,
            category_id,
            discount,
            status,
            ingredients: parsedIngredients
        });
        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: "Create new product successfully.",
            result: savedProduct
        });
    } catch (error) {
        next(error);
    }
};

const getAllProductInWarehouse = async (req, res, next) => {
    try {
        const { search = "", page = "1", limit = "10", status = "" } = req.query;

        const searchQuery = search.trim();
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

        let filter = {};

        if (searchQuery) {
            filter.pname = { $regex: searchQuery, $options: "i" };
        }

        if (status) {
            const statusLower = status.trim().toLowerCase();
            const validStatuses = ["active", "inactive", "discontinued", "out of stock"];
            if (!validStatuses.includes(statusLower)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            filter.status = statusLower;
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .populate("category_id", "category_name status")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            products,
            totalProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber),
        });
    } catch (error) {
        next(error);
    }
};

const getAllProductInHome = async (req, res, next) => {
    try {
        const { search = "", page = "1", limit = "10", selectCategory = "" } = req.query;
        const searchLower = search.toLowerCase();
        let filter = {};

        // Lọc theo tên sản phẩm nếu có search query
        if (searchLower) {
            filter.pname = { $regex: searchLower, $options: "i" };
        }

        // Nếu có truyền selectCategory, kiểm tra và lọc theo category_id
        if (selectCategory) {
            if (!mongoose.Types.ObjectId.isValid(selectCategory)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
            filter.category_id = selectCategory;
        }

        // Chuyển đổi phân trang từ string sang số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Tính tổng số sản phẩm thỏa mãn filter
        const totalProducts = await Product.countDocuments(filter);

        // Lấy danh sách sản phẩm theo phân trang và populate thông tin category
        const product = await Product.find(filter)
            .populate('category_id')
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber);

        res.status(200).json({
            product,
            totalProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limitNumber)
        });
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
    const { pname, price, category_id } = req.body;

    try {
        // Kiểm tra sản phẩm có tồn tại không
        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = { pname, price, category_id };

        if (req.file) {
            if (existingProduct.cloudinary_id) {
                await cloudinary.uploader.destroy(existingProduct.cloudinary_id);
            }

            const result = await uploadToCloudinary(req.file.buffer);
            updatedProduct.image = result.secure_url;
        }

        // Cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true, fields: '-cloudinary_id' });

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        next(error);
    }
};

const updateProductStatus = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { status } = req.body;
        // kiểm tra sản phẩm có tồn tại không
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        // kiểm tra giá trị hợp lệ của status
        const validStatuses = ["active", "inactive", "discontinued", "out of stock"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        // cập nhật trạng thái sản phẩm
        existingProduct.status = status;
        await existingProduct.save();
        res.status(200).json({
            message: "Product status updated successfully",
            product: existingProduct
        });
    } catch (error) {
        next(error);
    }
};
module.exports = { createNewProduct, getAllProductInHome, getAllProductInWarehouse, getProductsByCategory, updateProduct, updateProductStatus };



const Product = require("../../models/Product");
const Category = require('../../models/Category'); // Đường dẫn tới model danh mục
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary");
const createNewProduct = async (req, res, next) => {
    try {
        const { pname, sale_price, category_id } = req.body;
        const pId = new mongoose.Types.ObjectId();
        const discount = 0;
        const status = 1;
        const cost_price = 10000;
        const ingredients = [{}];
        // Upload ảnh lên Cloudinary (nếu có file)
        let imageUrl = "";
        let cloudinaryId = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "products" // Ảnh sẽ được lưu trong thư mục "products"
            });
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
            ingredients
        });
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
    const { pname, price, category_id, status } = req.body;

    try {
        // Kiểm tra sản phẩm có tồn tại không
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = { pname, price, category_id, status };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: "products" });

            updatedProduct.image = result.secure_url;

            if (existingProduct.cloudinary_id) {
                await cloudinary.uploader.destroy(existingProduct.cloudinary_id);
            }
        }
        // Cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true, fields: '-cloudinary_id' });

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        next(error);
    }
};

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
module.exports = { createNewProduct, getAllProductInHome, getAllProductInWarehouse, getProductsByCategory, updateProduct, deleteProduct };


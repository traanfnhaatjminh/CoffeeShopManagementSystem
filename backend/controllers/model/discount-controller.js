// controllers/discountController.js
const Discount = require("../../models/Discount");

// Tạo mã giảm giá mới
const createDiscount = async (req, res) => {
  try {
    const { code, discount, startDate, endDate, maxUses } = req.body;

    const newDiscount = new Discount({
      code,
      discount,
      startDate,
      endDate,
      maxUses: maxUses || 0,
    });

    await newDiscount.save();

    res.status(201).json({
      success: true,
      data: newDiscount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy tất cả mã giảm giá
const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: discounts.length,
      data: discounts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Lấy mã giảm giá theo ID
const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã giảm giá",
      });
    }

    res.status(200).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật mã giảm giá
const updateDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã giảm giá",
      });
    }

    res.status(200).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa mã giảm giá
const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy mã giảm giá",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Xác thực mã giảm giá
const verifyDiscount = async (req, res) => {
  try {
    const { code } = req.params;
    const discount = await Discount.findOne({ code });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không hợp lệ",
      });
    }

    const now = new Date();

    // Kiểm tra xem mã có còn hiệu lực không
    if (
      !discount.isActive ||
      now < new Date(discount.startDate) ||
      now > new Date(discount.endDate) ||
      (discount.maxUses > 0 && discount.usedCount >= discount.maxUses)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã hết hạn hoặc đã hết lượt sử dụng",
      });
    }

    res.status(200).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Sử dụng mã giảm giá (tăng usedCount)
const useDiscount = async (req, res) => {
  try {
    const { code } = req.params;
    const discount = await Discount.findOne({ code });

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Mã giảm giá không hợp lệ",
      });
    }

    const now = new Date();

    // Kiểm tra xem mã có còn hiệu lực không
    if (
      !discount.isActive ||
      now < new Date(discount.startDate) ||
      now > new Date(discount.endDate) ||
      (discount.maxUses > 0 && discount.usedCount >= discount.maxUses)
    ) {
      return res.status(400).json({
        success: false,
        message: "Mã giảm giá đã hết hạn hoặc đã hết lượt sử dụng",
      });
    }

    // Tăng số lần sử dụng
    discount.usedCount += 1;
    await discount.save();

    res.status(200).json({
      success: true,
      data: discount,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  verifyDiscount,
  useDiscount,
};

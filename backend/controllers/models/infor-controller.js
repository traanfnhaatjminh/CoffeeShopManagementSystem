const mongoose = require("mongoose");
const Info = require("../../model/Info");
const  User  = require("../../model/user");

// Create new shop information
const createInfoShop = async (req, res, next) => {
    const { name_shop, email_shop, phone_shop, address_shop, logo_shop, operating_info, owner } = req.body;
  
    const newInfo = new Info({
      name_shop,
      email_shop,
      phone_shop,
      address_shop,
      logo_shop,
      operating_info,
      owner
    });
  
    try {
      const savedInfo = await newInfo.save();
      res.status(201).json(savedInfo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateInfoShop = async (req, res, next) => {
    try {
        const { id } = req.params; // id này là user ID của admin

        // Kiểm tra quyền admin
        const user = await User.findById(id).populate('role');
        if (!user || user.role.role_name !== 'admin') {
            return res.status(403).json({ message: "Bạn không có quyền truy cập" });
        }

        // Tìm shop info dựa trên owner (user ID)
        const shopInfo = await Info.findOne({ owner: id });
        if (!shopInfo) {
            return res.status(404).json({ message: "Không tìm thấy thông tin shop" });
        }

        // Cập nhật thông tin shop
        const updatedInfo = await Info.findByIdAndUpdate(
            shopInfo._id,
            {
                ...req.body,
                owner: id, // Đảm bảo owner không bị thay đổi
            },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Cập nhật thông tin shop thành công",
            data: updatedInfo
        });

    } catch (error) {
        console.error("Error updating shop info:", error);
        res.status(500).json({ 
            success: false,
            message: "Lỗi khi cập nhật thông tin shop", 
            error: error.message 
        });
    }
};


  

// Get shop information by ID
const getInfoShop = async (req, res, next) => {
  try {
    const shopInfo = await Info.find();
    res.status(200).json(shopInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching shop info", error });
  }
};

module.exports = { createInfoShop, updateInfoShop, getInfoShop };

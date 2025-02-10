const express = require("express");
const mongoose = require("mongoose");
const Bill = require("../../model/Bill");
const Table = require("../../model/TableList");

const getStatistics = async (req, res) => {
  try {
    // Get total revenue and order count
    const [revenueData] = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total_cost" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Get best-selling drink and total drinks sold
    const [drinkData] = await Bill.aggregate([
      { $unwind: "$product_list" }, // Flatten product_list arrays
      {
        $group: {
          _id: "$product_list.nameP",
          totalQuantity: { $sum: "$product_list.quantityP" },
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by highest quantity
      {
        $group: {
          _id: null,
          bestSellingDrink: { $first: "$_id" },
          totalDrinksSold: { $sum: "$totalQuantity" },
        }
      },
    ]);

    res.json({
      totalRevenue: revenueData?.totalRevenue || 0,
      totalOrders: revenueData?.totalOrders || 0,
      bestSellingDrink: drinkData?.bestSellingDrink || "No Data",
      totalDrinksSold: drinkData?.totalDrinksSold || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating statistics", error });
  }
};

const getProductsSoldByCategory = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $unwind: "$product_list" }, // Unwind the product_list array
      {
        $lookup: {
          from: "products", // Name of the products collection
          localField: "product_list.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" }, // Unwind to access the product details
      {
        $lookup: {
          from: "categories", // Name of the categories collection
          localField: "productDetails.category_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" }, // Unwind to access category details
      {
        $group: {
          _id: "$categoryDetails.category_name", // Group by category name
          totalSold: { $sum: "$product_list.quantityP" }, // Sum quantities sold
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalSold: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching products sold by category:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const postBill = async (req, res) => {
  try {
    const {
      created_time,
      updated_time,
      total_cost,
      table_id,
      payment,
      discount,
      status,
      product_list,
    } = req.body;

    // Tạo hóa đơn mới
    const newBill = new Bill({
      created_time,
      updated_time,
      total_cost,
      table_id,
      payment,
      status,
      discount,
      product_list,
    });

    // Lưu hóa đơn vào database
    const savedBill = await newBill.save();

    // Cập nhật trạng thái bàn (occupied = true) sau khi tạo hóa đơn
    await Table.findByIdAndUpdate(table_id, { status: false });

    res.status(201).json({
      message: "Bill created successfully",
      result: savedBill,
    });
  } catch (error) {
    console.log(error);
    res.status(400).jsonp({
      message: "Error creating bill",
      error: error.message,
    });
  }
};

const getBillFromTable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findOne({ table_id: id, status: 0 }).populate(
      "product_list.productId"
    );

    if (!bill) {
      return res.status(404).json({ message: "No bill found for this table" });
    }

    res.status(200).json(bill);
  } catch (error) {
    next(error);
  }
};

const postBillUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBill = {
      status: 1,
      payment: req.body.payment,
      discount: req.body.discount,
      total_cost: req.body.totalCost,
      updated_time: Date.now()
    };
    const bill = await Bill.findByIdAndUpdate(id, updatedBill, { new: true });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    await Table.findByIdAndUpdate(bill.table_id, { status: true });
    res
      .status(200)
      .json({ message: "Payment successful, table is now available", bill });
  } catch (error) {
    next(error);
  }
};

const getAllBill = async (req, res) => {
  try {
    const billlist = await Bill.find();
    res.status(200).json(billlist);
  } catch (error) {
    next(error);
  }
};

////tétttt
const getBill = async (req, res, next) => {
  try {
    // Lấy các tham số search và phân trang từ query params
    const { search = "", page = 1, limit = 10 } = req.query;

    // Chuyển đổi tìm kiếm sang chữ thường
    const searchLower = search.toLowerCase();

    // Lọc hóa đơn theo tên sản phẩm hoặc ngày tạo/cập nhật
    const filteredBills = await Bill.find({
      $or: [
        {
          "product_list.nameP": { $regex: searchLower, $options: "i" },
        },


      ],
    });

    // Tính toán phân trang
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Lấy danh sách hóa đơn sau khi phân trang
    const currentBills = filteredBills.slice(startIndex, endIndex);

    // Tổng số lượng hóa đơn sau khi lọc
    const totalBills = filteredBills.length;

    // Trả về dữ liệu JSON gồm hóa đơn, số lượng tổng, trang hiện tại và giới hạn
    res.status(200).json({
      bills: currentBills,
      totalBills,
      currentPage: parseInt(page, 10),
      totalPages: Math.ceil(totalBills / limit),
    });
  } catch (error) {
    next(error);
  }
};


////
const createNewBill = async (req, res, next) => {
  try {
    const { total_cost, table_id, product_list, payment, status } = req.body;

    // Create a new bill document
    const newBill = new Bill({
      _id: new mongoose.Types.ObjectId(), // Automatically generate ObjectId
      total_cost: total_cost,
      table_id: table_id,
      payment: payment,
      status: status,
      product_list: product_list,
    });

    // Save the new bill to the database
    const savedBill = await newBill.save();

    // Return success response
    res.status(201).json(savedBill);
  } catch (error) {
    console.error("Error creating bill:", error);
    res
      .status(500)
      .json({ message: "Failed to create bill", error: error.message });
  }
};

module.exports = {
  getBill,
  postBill,
  getBillFromTable,
  postBillUpdate,
  getAllBill,
  createNewBill,
  getStatistics,
  getProductsSoldByCategory
};

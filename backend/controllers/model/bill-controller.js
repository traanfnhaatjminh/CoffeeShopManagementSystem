const express = require("express");
const mongoose = require("mongoose");
const Bill = require("../../models/Bill");
const Table = require("../../models/TableList");

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
        },
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
    console.error("Error fetching products sold by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
const addProductsToBill = async (req, res, next) => {
  try {
    const { products } = req.body; // Nhận danh sách sản phẩm từ request body
    const { id } = req.params; // Lấy billId từ URL params

    // Tìm bill theo ID
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Kiểm tra xem product_list đã được khởi tạo chưa
    if (!bill.product_list) {
      bill.product_list = []; // Khởi tạo nếu chưa có
    }

    // Duyệt từng sản phẩm trong danh sách gửi lên
    products.forEach((product) => {
      const existingProductIndex = bill.product_list.findIndex(
        (p) => p.productId.toString() === product.productId.toString()
      );

      if (existingProductIndex !== -1) {
        // Nếu sản phẩm đã có, tăng số lượng và tổng tiền
        bill.product_list[existingProductIndex].quantityP += product.quantityP;
        bill.product_list[existingProductIndex].total += product.total;
      } else {
        // Nếu chưa có, thêm mới
        bill.product_list.push(product);
      }
    });

    // Tính lại tổng tiền của hóa đơn
    // Theo schema, trường này tên là total_cost chứ không phải totalAmount
    bill.total_cost = bill.product_list.reduce((sum, p) => sum + p.total, 0);

    // Cập nhật thời gian cập nhật
    bill.updated_time = new Date();

    // Lưu lại hóa đơn sau khi cập nhật
    await bill.save();

    res
      .status(200)
      .json({ message: "Thêm sản phẩm vào hóa đơn thành công", bill });
  } catch (error) {
    console.error(error); // Thêm log chi tiết lỗi
    next(error);
  }
};

const postBillUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { payment, discount = 0, totalCost } = req.body;

    // Tìm hóa đơn hiện tại
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
    }

    // Tính lại tổng tiền nếu chưa được cung cấp
    const calculatedTotalCost =
      totalCost ||
      bill.product_list.reduce(
        (total, item) => total + item.priceP * item.quantityP,
        0
      ) *
        ((100 - discount) / 100);

    const updatedBill = {
      status: 1, // Đánh dấu hóa đơn đã thanh toán
      payment,
      discount,
      total_cost: calculatedTotalCost,
      // Nếu schema dùng timestamps thì có thể không cần trường updated_time
      updated_time: Date.now(),
    };

    const updatedBillDoc = await Bill.findByIdAndUpdate(id, updatedBill, {
      new: true,
    });

    // Cập nhật trạng thái bàn thành trống (giả sử status: true là trống)
    await Table.findByIdAndUpdate(bill.table_id, { status: true });

    res.status(200).json({
      message: "Thanh toán thành công, bàn đã được giải phóng",
      bill: updatedBillDoc,
    });
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

const getBill = async (req, res, next) => {
  try {
    // Lấy các tham số search, phân trang và lọc từ query params
    const {
      search = "",
      page = 1,
      limit = 10,
      from,
      to,
      status,
      payment,
    } = req.query;

    let filter = {};

    // Chuyển đổi tìm kiếm sang chữ thường
    const searchLower = search.toLowerCase();

    // Lọc theo khoảng thời gian
    if (from && to) {
      filter.updated_time = { 
        $gte: new Date(from),  // Từ 00:00:00 ngày from
        $lte: new Date(to)     // Đến 23:59:59 ngày to
      };
    }
    
    
    // Lọc theo trạng thái
    if (status && status !== "all") {
      filter.status = Number(status);
    }

    // Lọc theo phương thức thanh toán
    if (payment && payment !== "all") {
      filter.payment = payment;
    }

    // Lọc theo tên sản phẩm
    filter.$or = [
      {
        "product_list.nameP": { $regex: searchLower, $options: "i" },
      },
    ];

    // Lấy danh sách hóa đơn theo bộ lọc
    const filteredBills = await Bill.find(filter)
      .populate("table_id", "table_name")
      .populate("product_list.productId");

    // Sắp xếp hóa đơn theo ngày tạo gần nhất (giảm dần)
    filteredBills.sort(
      (a, b) => new Date(b.created_time) - new Date(a.created_time)
    );

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

const getBillFilter = async (req, res) => {
  try {
    const { from, to, status, payment } = req.query;
    let filter = {};

    if (from && to) {
      filter.created_time = { $gte: new Date(from), $lte: new Date(to) };
    }
    if (status && status !== "all") {
      filter.status = Number(status);
    }
    if (payment && payment !== "all") {
      filter.payment = payment;
    }

    const bills = await Bill.find(filter)
      .populate("table_id")
      .populate("product_list.productId");
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách hóa đơn", error });
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
  getProductsSoldByCategory,
  addProductsToBill,
  getBillFilter,
};

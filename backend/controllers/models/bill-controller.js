
const express = require("express");
const mongoose = require("mongoose")
const Bill = require("../../model/Bill");
const Table = require("../../model/TableList");

const postBill = async (req, res) => {
  try {
    const { created_time, updated_time, total_cost, table_id, payment, discount, status, product_list } = req.body;

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
}
const getBill = async (req, res, next) => {
  try {
    const { id } = req.params;  // Lấy `id` từ URL

    // Tìm hóa đơn theo table_id
    const bill = await Bill.findOne({ table_id: id, status: 0 }).populate('product_list.productId');

    if (!bill) {
      return res.status(404).json({ message: "No bill found for this table" });
    }

    res.status(200).json(bill);
  } catch (error) {
    next(error);  // Đảm bảo truyền lỗi vào middleware xử lý lỗi
  }
};

const postBillUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBill = {
      status: 1,
      payment: req.body.payment, // Đảm bảo lấy đúng giá trị payment từ request body
    };
    const bill = await Bill.findByIdAndUpdate(id, updatedBill, { new: true });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    await Table.findByIdAndUpdate(bill.table_id, { status: true });
    res.status(200).json({ message: "Payment successful, table is now available", bill });
  } catch (error) {
    next(error);
  }
}


const getAllBill = async (req, res) => {
  try {
    const billlist = await Bill.find();
    res.status(200).json(billlist);
  } catch (error) {
    next(error);
  }

}
const createNewBill = async (req, res, next) => {
  try {
    const { total_cost, table_id, product_list, payment, status, discount } = req.body;

    // Create a new bill document
    const newBill = new Bill({
      _id: new mongoose.Types.ObjectId(),  // Automatically generate ObjectId
      total_cost: total_cost,
      table_id: table_id,
      payment: payment,
      status: status,
      discount: discount,
      product_list: product_list
    });

    // Save the new bill to the database
    const savedBill = await newBill.save();

    // Return success response
    res.status(201).json(savedBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ message: 'Failed to create bill', error: error.message });
  }
};


module.exports = { postBill, getBill, postBillUpdate, getAllBill, createNewBill };


const TableList = require("../../models/TableList");
const mongoose = require("mongoose"); // To create an ObjectId

const createNewTable = async (req, res) => {
  try {
    const { table_name, number_of_chair, status, location_table } = req.body;

    // Kiểm tra nếu thiếu tên bàn
    if (!table_name) {
      return res.status(400).json({ message: "Tên bàn là bắt buộc!" });
    }

    // Kiểm tra xem tên bàn đã tồn tại chưa
    const existingTable = await TableList.findOne({ table_name });
    if (existingTable) {
      return res
        .status(400)
        .json({ message: "Tên bàn đã tồn tại! Hãy chọn tên khác." });
    }

    // Tạo bàn mới nếu không bị trùng tên
    const newTable = new TableList({
      _id: new mongoose.Types.ObjectId(),
      table_name, // 🔥 Đã thêm vào đây
      number_of_chair,
      status,
      location_table,
    });

    const savedTable = await newTable.save();
    res.status(201).json({
      message: "Thêm bàn thành công!",
      result: savedTable,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Lỗi khi tạo bàn.",
      error: error.message,
    });
  }
};

const getAllTable = async (req, res, next) => {
  try {
    const tables = await TableList.find(); // Fetch all categories from the DB
    res.status(200).json(tables);
  } catch (error) {
    next(error);
  }
};

const updateTableView = async (req, res) => {
  const { id } = req.params;
  const { x, y } = req.body;

  // Log dữ liệu nhận được
  console.log("🛠 Dữ liệu nhận từ client:", req.body);

  // Kiểm tra dữ liệu đầu vào
  if (typeof x !== "number" || typeof y !== "number") {
    return res.status(400).json({ message: "Dữ liệu x hoặc y không hợp lệ" });
  }

  try {
    // Đổi từ TableList thành Table
    const updatedTable = await TableList.findByIdAndUpdate(
      id,
      { x, y },
      { new: true }
    );

    if (!updatedTable) {
      return res.status(404).json({ message: "Không tìm thấy bàn" });
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error("❌ Lỗi cập nhật vị trí bàn:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật vị trí bàn" });
  }
};
const getAllTables = async (req, res, next) => {
  try {
    const tables = await TableList.find();

    const groupedTables = tables.reduce((acc, table) => {
      const location = table.location_table;

      if (!acc[location]) {
        acc[location] = [];
      }

      acc[location].push(table);
      return acc;
    }, {});

    res.status(200).json(groupedTables);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { tableId } = req.params;
    const { status } = req.body;

    // Update the table status
    await TableList.findByIdAndUpdate(tableId, { status: status });

    res.status(200).json({ message: "Table status updated successfully." });
  } catch (error) {
    next(error);
  }
};
const updateTable = async (req, res, next) => {
  try {
    const { idTables } = req.params;
    const { table_name, number_of_chair, status, location_table } = req.body;
    const updatedT = { table_name, number_of_chair, status, location_table };

    const updatedTable = await TableList.findByIdAndUpdate(idTables, updatedT, {
      new: true,
    });

    if (!updatedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    res.status(200).json({ message: "Table updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  const { tableId } = req.params;
  try {
    const deletedTable = await TableList.findByIdAndDelete(tableId);
    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }
    res.status(200).json({
      message: "Table deleted successfully",
      result: deletedTable,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewTable,
  getAllTable,
  updateStatus,
  getAllTables,
  updateTable,
  deleteTable,
  updateTableView,
};

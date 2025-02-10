const TableList = require("../../model/TableList");
const mongoose = require("mongoose"); // To create an ObjectId

const createNewTable = async (req, res) => {
  try {
    const { number_of_chair, status, location_table } = req.body;
    const tId = new mongoose.Types.ObjectId();
    const newTable = new TableList({
      _id: tId,
      number_of_chair,
      status,
      location_table,
    });

    await newTable.save().then((newDoc) => {
      res.status(201).json({
        message: "Insert successfully.",
        result: newDoc,
      });
       });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Error creating product.",
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
    const { number_of_chair, status, location_table } = req.body;
    const updatedT = { number_of_chair, status, location_table };

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
      result: deletedTable
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
  deleteTable
};

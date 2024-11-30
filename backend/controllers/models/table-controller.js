const TableList = require("../../model/TableList");
const mongoose = require('mongoose');  // To create an ObjectId

const createNewTable = async (req, res) => {
    try {
        const { number_of_chair, status } = req.body;
        const tId = new mongoose.Types.ObjectId();
        const newTable = new TableList({ _id: tId, number_of_chair, status });

        await newTable.save().then(newDoc => {
            res.status(201).json({
                message: "Insert successfully.",
                result: newDoc
            })
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: "Error creating product.",
            error: error.message
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

const updateStatus = async (req, res, next) => {
    try {
        const { tableId } = req.params;
        const { status } = req.body;

        // Update the table status
        await TableList.findByIdAndUpdate(tableId, { status: status });

        res.status(200).json({ message: 'Table status updated successfully.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createNewTable, getAllTable, updateStatus };
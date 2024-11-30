const Role = require("../../model/Role");
const mongoose = require('mongoose');  // To create an ObjectId

const createNewRole = async (req, res, next) => {
    try {
        // Extract data from req.body
        const { role_name } = req.body;
        const rId = new mongoose.Types.ObjectId();

        const newRole = new Role({ _id: rId, role_name });
        await newRole.save().then(newDoc => {
            res.status(201).json({
                message: "Insert a new role successfully.",
                result: newDoc
            })
        })
    } catch (error) {
        next(error);
    }
};

module.exports = {createNewRole};
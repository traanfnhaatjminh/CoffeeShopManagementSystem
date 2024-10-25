const User = require("../../model/user");
const mongoose = require('mongoose');  // To create an ObjectId
const bcrypt = require("bcryptjs");

const createNewUser = async (req, res, next) => {
    try {
        const { fullName, email, password, dob, phone, address, avatar, role, status } = req.body;
        const uId = new mongoose.Types.ObjectId();

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: uId,
            fullName,
            email,
            password: hashedPassword,  // Save hashed password
            dob,
            phone,
            address,
            avatar,
            role,
            status
        });

        await newUser.save().then(newDoc => {
            res.status(201).json({
                message: "Insert a new user successfully.",
                result: newDoc
            });
        });
    } catch (error) {
        next(error);
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(
            users
        );
    } catch (error) {
        next(error);
    }
};

module.exports = { createNewUser, getAllUser };
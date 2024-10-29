const User = require("../../model/user");
const Role = require("../../model/Role");
const mongoose = require("mongoose"); // To create an ObjectId
const bcrypt = require("bcryptjs");

const createNewUser = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            password,
            dob,
            phone,
            address,
            avatar,
            role,
            status,
        } = req.body;
        const role_id = await Role.findOne({ role_name: role });
        console.log("role_id:", role_id);
        const uId = new mongoose.Types.ObjectId();

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            _id: uId,
            fullName,
            email,
            password: hashedPassword, // Save hashed password
            dob,
            phone,
            address,
            avatar: avatar || "",
            role: role_id._id,
            status: status === "1" ? true : false,
        });

        await newUser.save().then((newDoc) => {
            res.status(201).json({
                message: "Insert a new user successfully.",
                result: newDoc,
            });
        });
    } catch (error) {
        next(error);
    }
};

const getAllUser = async (req, res, next) => {
    try {
        const users = await User.find({status: 1});
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

const getAllUsersWithRole = async (req, res, next) => {
    try {
        const users = await User.find()
            .populate('role')
            .exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}
// const deleteUser = async (req, res, next) =>{
//     try {
//         const {userId} = req.params;
//         const deleteUser = await User.findByIdAndUpdate(userId, {status: 0}, {new:true});
//         res.status(200).json({
//             message: "User status updated successfully",
//             result: deleteUser
//         });
//     } catch (error) {
//         next(error);
//     }
// }
const editUser = async (req, res, next) => {
    try {
        const {userId} = req.params;
        const {newRole, status} = req.body;
        const role = await Role.findOne({role_name: newRole});
        const updateUser = await User.findByIdAndUpdate(userId, {role: role._id, status: status}, {new: true}).populate('role');
        if(!updateUser){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({
            message: "Updated successfully",
            result: updateUser
        });
    } catch (error) {
        next(error);
    }
}
module.exports = { createNewUser, getAllUser, getAllUsersWithRole, editUser};

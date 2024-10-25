const mongoose = require("mongoose");
const Category = require("../model/Category");
const User = require("./user");
const Role = require("../model/Role");

//Khởi tạo đối tượng CSDL
const db = {};

//Bổ sung Entity object vào DB
db.Category = Category;
db.User = User;
db.Role = Role;

//Kết nối CSDL
db.connectDB = async () => {
    try {
        await mongoose
            .connect(process.env.MONGODB_URI)
            .then(() => console.log("Connect to MongoDB successfully."));
    } catch (error) {
        next(error);
        process.exit();
    }
};

module.exports = db;

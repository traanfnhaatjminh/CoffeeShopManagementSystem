const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../../model/index");
const Role = require("../../model/Role");
const User = require("../../model/user");
const { default: mongoose } = require("mongoose");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await db.User.findOne({ email }).populate("role");
        console.log("checkUser:", checkUser);

        if (!checkUser)
            return res.json({
                success: false,
                message: "Email doesn't exist! Please register first",
            });
        const checkPasswordMatches = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatches)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });
        const token = jwt.sign(
            {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                fullName: checkUser.fullName,
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            { expiresIn: "60m" }
        );
        res.cookie("token", token, { httpOnly: true, secure: false }).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.fullName,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Some error service false",
        });
    }
};

const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const checkUser = await db.User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "User doesn't exits! Please register first",
            });
        const changeNewPassword = await bcrypt.hash(newPassword, 12);
        checkUser.password = changeNewPassword;
        await checkUser.save();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Update success",
            data: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.fullName,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Some error service false",
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        // Clear the token cookie by setting it with an expired date
        res.cookie("token", "", {
            expires: new Date(0),
            httpOnly: true,
            secure: false,
        })
            .status(StatusCodes.OK)
            .json({
                success: true,
                message: "Logged out successfully",
            });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Some error occurred during logout",
        });
    }
};

const checkAuthor = (req, res, next) => {
    const user = req.user;
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Authenticated user!",
        user,
    });
};

const register = async (req, res, next) => {
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
            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Insert a new user successfully.",
                data: {
                    email: newUser.email,
                    role: newUser.role,
                    id: newUser._id,
                    userName: newUser.fullName,
                },
            });
        });
    } catch (error) {
        next(error);
    }
};
const authController = {
    loginUser,
    updatePassword,
    checkAuthor,
    logoutUser,
    register,
};

module.exports = authController;

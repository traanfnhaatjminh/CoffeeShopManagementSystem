require("dotenv").config;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../../model/index");
const Role = require("../../model/Role");
const User = require("../../model/user");
const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");

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

const logoutUser = (req, res) => {
    res.clearCookie("token").json({
        success: true,
        message: "Logged out successfully!",
    });
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

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
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

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const forgotPassword = async (req, res, next) => {
    try {
        console.log("req:", req.body);
        const { email } = req.body;
        const user = await db.User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const token = jwt.sign(
            { otp, email },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {
                expiresIn: "5m",
            }
        );

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "OTP for Password Reset",
            text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
        });
        res.cookie("resetpassword", token, {
            httpOnly: true,
            secure: false,
        }).json({
            success: true,
            message: "OTP send email",
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error!",
        });
    }
};

const resetPassword = (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET,
            async (err, decoded) => {
                if (err)
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ message: "Invalid or expired token" });
                const { otp, email } = decoded;
                const user = await db.User.findOne({ email });
                if (!user) {
                    res.status(StatusCodes.NOT_FOUND).json({
                        success: false,
                        message: "User not found",
                    });
                }
                user.password = await bcrypt.hash(newPassword, 10);
                await user.save().then((user) => {
                    res.status(StatusCodes.OK).json({
                        success: true,
                        message: "Password reset successful.",
                        data: {
                            email: user.email,
                            role: user.role,
                            id: user._id,
                            userName: user.fullName,
                        },
                    });
                });
            }
        );
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Server Error!",
        });
    }
};
const authController = {
    loginUser,
    updatePassword,
    checkAuthor,
    logoutUser,
    register,
    forgotPassword,
    resetPassword,
};

module.exports = authController;

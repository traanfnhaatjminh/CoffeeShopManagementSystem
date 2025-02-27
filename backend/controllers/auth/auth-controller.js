require("dotenv").config;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../../models/index");
const Role = require("../../models/Role");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");
const nodemailer = require("nodemailer");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await db.User.findOne({ email }).populate("role");

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
                phone: checkUser.phone,
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
const updatePasswordByOldPassword = async (req, res) => {
    const { email, newPassword, oldPassword } = req.body.data;
    try {
        const checkUser = await db.User.findOne({ email });
        if (!checkUser)
            return res.json({
                success: false,
                message: "Người dùng không tồn tại",
            });
        const isOldPasswordCorrect = await bcrypt.compare(
            oldPassword,
            checkUser.password
        );
        if (!isOldPasswordCorrect) {
            return res.json({
                success: false,
                message: "Mật khẩu không đúng vui lòng nhập đúng mật khẩu!",
            });
        }
        const changeNewPassword = await bcrypt.hash(newPassword, 12);
        checkUser.password = changeNewPassword;
        await checkUser.save();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật mật khẩu thành công",
        });
    } catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi hệ thống",
        });
    }
};

const updateInfoUser = async (req, res) => {
    const {
        oldEmail,
        email: newEmail,
        phone: newPhone,
        userName: newUserName,
    } = req.body.data;
    try {
        const checkUser = await db.User.findOne({ email: oldEmail }).populate(
            "role"
        );
        if (!checkUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy người dùng !",
            });
        }

        const updatedUser = {
            ...checkUser.toObject(),
            fullName: newUserName,
            email: newEmail,
            phone: newPhone,
        };
        Object.assign(checkUser, updatedUser);
        await checkUser.save();
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật thông tin người dùng thành công .",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.fullName,
                phone: checkUser.phone,
            },
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Lỗi hệ thống",
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
    const { fullname, email, phone, role } = req.user;
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Authenticated user!",
        user: {
            fullname,
            email,
            phone,
            role,
        },
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
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
        const { email } = req.body;
        console.log("email:", email);
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
        next(error);
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

const verifyOTP = async (req, res, next) => {
    const { code } = req.body;
    const token = req.cookies.resetpassword;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message:
                "OTP does not exist or has expired. Please request OTP again.",
            success: false,
        });
    }
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "OTP does not exist or has expired",
                success: false,
            });
        }
        const { otp, email } = decode;
        if (code === otp) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message:
                    "OTP is valid. You can proceed to change your password.",
                email,
            });
        } else {
            return res.json({
                success: false,
                message: "OTP is incorrect. Please try again.",
            });
        }
    });
};

const authController = {
    loginUser,
    updatePassword,
    checkAuthor,
    logoutUser,
    register,
    forgotPassword,
    resetPassword,
    verifyOTP,
    updatePasswordByOldPassword,
    updateInfoUser,
};

module.exports = authController;

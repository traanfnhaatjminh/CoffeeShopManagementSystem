const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const db = require("../../model/index");

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUser = await db.User.findOne({ email });
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
        res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: false })
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


const authController = {
    loginUser,
    updatePassword,
    logoutUser
};

module.exports = authController;

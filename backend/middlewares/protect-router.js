const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const asyncHandle = require("express-async-handler");
const db = require("../models/index");

const protectRouter = asyncHandle(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "Unauthorised user! You do not have permission right here",
        });
    }
    try {
        const decoderToken = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        );
        const user = await db.User.findOne({ _id: decoderToken.id });
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Token has expired, please log in again",
            });
        }
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            message: "Token invalid",
        });
    }
});

module.exports = protectRouter;

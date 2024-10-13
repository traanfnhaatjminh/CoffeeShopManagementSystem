require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const db = require("./model/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { StatusCodes } = require("http-status-codes");

const CategoryRouter = require("./router/category.route");
const ProductRouter = require("./router/product.route")
const authRouter = require("./router/auth/auth.routers");

const HOST = process.env.HOSTNAME;
const POST = process.env.POST;
const app = express();

app.use(
    cors({
        origin: process.env.API_FE,
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.get("/", async (req, res, next) => {
    res.status(StatusCodes.OK).json({ message: "Welcome to Group 5" });
});

app.use("/createbill", CategoryRouter);
app.use("/products", ProductRouter);
app.use("/api/auth", authRouter);

app.use("/", async (req, res, next) => {
    next(httpErrors.BadRequest("Bad Request"));
});

app.use("/", async (req, res, next) => {
    res.status = err.status || 500;
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

app.listen(POST, HOST, () => {
    console.log("server is running");
    db.connectDB();
});

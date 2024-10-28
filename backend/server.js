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
const ProductRouter = require("./router/product.route");
const TableRouter = require("./router/tablelist.route");
const authRouter = require("./router/auth/auth.routers");
const UserRouter = require("./router/user.route");
const BillRouter = require("./router/bill.route");

const HOST = process.env.HOSTNAME;
const POST = process.env.POST;
const app = express();

app.use("/uploads", express.static("uploads"));

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

app.get("/api", async (req, res, next) => {
    res.status(StatusCodes.OK).json({ message: "Welcome to Group 6" });
});

app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter);
app.use("/admin/bills", BillRouter);
app.use("/api/auth", authRouter);
app.use("/tables", TableRouter);
app.use("/users", UserRouter);
app.use("/uploads", express.static("uploads"));

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

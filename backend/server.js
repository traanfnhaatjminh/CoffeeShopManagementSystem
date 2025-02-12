require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const db = require("./models/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { StatusCodes } = require("http-status-codes");

const TableRouter = require("./routers/table.route");
const authRouter = require("./routers/auth/auth.routers");
const UserRouter = require("./routers/user.route");
const BillRouter = require("./routers/bill.route");
const InfoRouter= require("./routers/infor.route");
const RoleRouter = require("./routers/role.route");

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
    res.status(StatusCodes.OK).json({ message: "Welcome to Group 2" });
});

app.use("/bills", BillRouter);
app.use("/api/auth", authRouter);
app.use("/tables", TableRouter);
app.use("/users", UserRouter);
app.use("/roles", RoleRouter);
app.use("/uploads", express.static("uploads"));
app.use("/info", InfoRouter)

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

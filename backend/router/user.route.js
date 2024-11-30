const express = require("express");
const bodyParser = require("body-parser");
const { createNewUser, getAllUser} = require("../controllers/models/user-controller");


const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.post("/createUser", createNewUser);

userRouter.get("/list", getAllUser);

module.exports = userRouter;

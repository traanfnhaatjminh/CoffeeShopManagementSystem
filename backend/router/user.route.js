const express = require("express");
const bodyParser = require("body-parser");
const { createNewUser, getAllUser, getAllUsersWithRole,  editUser} = require("../controllers/models/user-controller");


const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.post("/createUser", createNewUser);

userRouter.get("/list", getAllUser);

userRouter.get("/listall", getAllUsersWithRole )

userRouter.put("/updateRole/:userId", editUser );

module.exports = userRouter;

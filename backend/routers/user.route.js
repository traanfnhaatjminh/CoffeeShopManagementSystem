const express = require("express");
const bodyParser = require("body-parser");
const { createNewUser, getAllUser, getAllUsersWithRole,  editUser, banUser} = require("../controllers/model/user-controller");


const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.post("/createUser", createNewUser);

userRouter.get("/list", getAllUser);

userRouter.get("/listall", getAllUsersWithRole )

userRouter.put("/updateRole/:userId", editUser );

userRouter.put("/banUser/:userId", banUser);
module.exports = userRouter;

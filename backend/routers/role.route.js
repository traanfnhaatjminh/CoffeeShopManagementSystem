const express = require("express");
const bodyParser = require("body-parser");

const {createNewRole, getAllRole} = require("../controllers/model/role-controller");

const roleRouter = express.Router();
roleRouter.use(bodyParser.json());

//Create a new category
roleRouter.post("/createRole", createNewRole);
roleRouter.get("/listallrole", getAllRole);
module.exports = roleRouter;

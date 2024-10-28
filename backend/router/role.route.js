const express = require("express");
const bodyParser = require("body-parser");

const {createNewRole} = require("../controllers/models/role-controller");

const roleRouter = express.Router();
roleRouter.use(bodyParser.json());

//Create a new category
roleRouter.post("/createRole", createNewRole);

module.exports = roleRouter;

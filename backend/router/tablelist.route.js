const express = require("express");
const bodyParser = require("body-parser");
const { createNewTable, getAllTable, updateStatus } = require("../controllers/models/table-controller");


const tableRouter = express.Router();
tableRouter.use(bodyParser.json());

tableRouter.post("/createTable", createNewTable);

tableRouter.get("/list", getAllTable);

tableRouter.put("/updateStatus/:tableId", updateStatus);

module.exports = tableRouter;

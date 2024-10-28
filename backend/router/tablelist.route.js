const express = require("express");
const bodyParser = require("body-parser");
const { createNewTable, getAllTable,getAllTables,updateTable, updateStatus } = require("../controllers/models/table-controller");


const tableRouter = express.Router();
tableRouter.use(bodyParser.json());

tableRouter.post("/createTable", createNewTable);

tableRouter.get("/list", getAllTable);
tableRouter.get("/listAll", getAllTables);
tableRouter.put("/update/:idTables",updateTable)
tableRouter.put("/updateStatus/:tableId", updateStatus);

module.exports = tableRouter;

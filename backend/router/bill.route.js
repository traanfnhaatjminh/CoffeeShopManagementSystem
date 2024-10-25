const express = require("express");
const bodyParser = require("body-parser");

const billRouter = express.Router();
billRouter.use(bodyParser.json());
const {

  getBillFromTable,
  postBillUpdate,
  getAllBill,
  getBill,
  createNewBill,
} = require("../controllers/models/bill-controller");

billRouter.get("", getBill);
billRouter.post("/createBill", createNewBill);

billRouter.get("/table/:id", getBillFromTable);
billRouter.put("/update/:id",postBillUpdate)

module.exports = billRouter;

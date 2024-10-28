const express = require("express");
const bodyParser = require("body-parser");

const billRouter = express.Router();
billRouter.use(bodyParser.json());
const {

  getBill,
  postBillUpdate,
  getAllBill,
  createNewBill,
  getStatistics
} = require("../controllers/models/bill-controller");

billRouter.get("", getAllBill);
billRouter.post("/createBill", createNewBill);
billRouter.get("/statistics", getStatistics);
billRouter.get("/table/:id", getBill);
billRouter.put("/update/:id",postBillUpdate)

module.exports = billRouter;

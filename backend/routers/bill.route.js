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
  getStatistics,
  getProductsSoldByCategory,
  addProductsToBill,
  deleteBill,
} = require("../controllers/model/bill-controller");

billRouter.get("", getBill);
billRouter.get("/all", getAllBill);
billRouter.post("/createBill", createNewBill);
billRouter.get("/statistics", getStatistics);
billRouter.get("/sold-by-category", getProductsSoldByCategory);
billRouter.get("/table/:id", getBillFromTable);
billRouter.put("/update/:id", postBillUpdate);
billRouter.put("/add-products/:id", addProductsToBill);
billRouter.get("/filter", addProductsToBill);
billRouter.put("/delete/:id", deleteBill);

module.exports = billRouter;

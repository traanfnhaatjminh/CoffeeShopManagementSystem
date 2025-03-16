const express = require("express");
const adminController = require("../../controllers/admin/admin-control");

const router = express.Router();

router.post("/totalRevenue", adminController.getDataTotalRevenue);
router.post("/totalProfit", adminController.getDataTotalProfit);
router.post("/totalExpense", adminController.getDataTotalExpense);
router.get("/getRevenueLatestMonths", adminController.getDataLatestMonths);
router.post("/listTopProductsOrder", adminController.listTopProductsOrder);
router.post("/listDataExpense", adminController.listDataExpense);

module.exports = router;

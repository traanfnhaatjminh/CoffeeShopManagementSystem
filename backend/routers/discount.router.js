// routes/discountRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDiscount,
  getAllDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  verifyDiscount,
  useDiscount,
} = require("../controllers/model/discount-controller");

router.post("/create", createDiscount);
router.get("/", getAllDiscounts);
router.get("/:id", getDiscountById);
router.put("/update/:id", updateDiscount);
router.delete("/delete/:id", deleteDiscount);
router.get("/discounts/verify/:code", verifyDiscount);
router.post("/discounts/use/:code", useDiscount);

module.exports = router;

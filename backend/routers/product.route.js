const express = require("express");
const bodyParser = require("body-parser");
// const multer = require("multer"); // Import Multer để upload file
const upload = require("../utils/multer");
const { createNewProduct, getAllProductInWarehouse, getAllProductInHome, getProductsByCategory, updateProduct, updateProductStatus, getProductIngredients} = require("../controllers/model/product-controller");


const productRouter = express.Router();
productRouter.use(bodyParser.json());


productRouter.post("/createProduct", upload.single("image"), createNewProduct);
productRouter.get("/listall", getAllProductInWarehouse);
productRouter.get("/listInHome/", getAllProductInHome);
productRouter.get("/getByCategory/:categoryId", getProductsByCategory);
productRouter.put("/updateProduct/:productId", upload.single("image"), updateProduct);
productRouter.put("/updateStatus/:productId", updateProductStatus);
productRouter.get("/:productId/ingredients", getProductIngredients);
module.exports = productRouter;


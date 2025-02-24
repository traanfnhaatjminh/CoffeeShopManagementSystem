const express = require("express");
const bodyParser = require("body-parser");
// const multer = require("multer"); // Import Multer để upload file
const upload = require("../utils/multer");
const { createNewProduct, getAllProductInWarehouse, getAllProductInHome, getProductsByCategory, updateProduct, deleteProduct } = require("../controllers/model/product-controller");


const productRouter = express.Router();
productRouter.use(bodyParser.json());


productRouter.post("/createProduct", upload.single("image"), createNewProduct);
productRouter.get("/listall", getAllProductInWarehouse);

productRouter.get("/listInHome/", getAllProductInHome);

productRouter.get("/getByCategory/:categoryId", getProductsByCategory);

productRouter.put("/updateProduct/:productId", upload.single("image"), updateProduct);

productRouter.put("/deleteProduct/:productId", deleteProduct);

module.exports = productRouter;


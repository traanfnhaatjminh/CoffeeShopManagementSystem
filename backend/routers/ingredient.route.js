const express = require("express");
const multer = require("multer");
const upload = multer(); // Nếu không gửi file, sử dụng upload.none() là đủ
const { createNewIngredient, getAllIngredients, updateIngredient, importIngredient } = require("../controllers/model/ingredient-controller");

const ingredientRoute = express.Router();

// Nếu dữ liệu được gửi dưới dạng multipart/form-data
ingredientRoute.post("/createIngredient", upload.none(), createNewIngredient);

ingredientRoute.get("/getAll", getAllIngredients);

ingredientRoute.put("/updateIngredient/:ingredientId", upload.none(), updateIngredient);

ingredientRoute.post("/importIngredient/:ingredientId", upload.none(), importIngredient);

module.exports = ingredientRoute;

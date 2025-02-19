const express = require("express");
const bodyParser = require("body-parser");

const {createNewIngredient, getAllIngredients} = require("../controllers/model/ingredient-controller");

const ingredientRoute = express.Router();
ingredientRoute.use(bodyParser.json());

//Create a new category
ingredientRoute.post("/createIngredient", createNewIngredient);

// Get all categories
ingredientRoute.get("/getAll", getAllIngredients);

module.exports = ingredientRoute;

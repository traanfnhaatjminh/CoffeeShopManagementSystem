const express = require("express");
const bodyParser = require("body-parser");

const { createNewCategory, getAllCategory } = require("../controllers/models/category-controller");

const categoryRouter = express.Router();
categoryRouter.use(bodyParser.json());

//Create a new category
categoryRouter.post("/createCategory", createNewCategory);


// Get all categories
categoryRouter.get("/list", getAllCategory);

module.exports = categoryRouter;

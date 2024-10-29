const express = require("express");
const bodyParser = require("body-parser");

const { createNewCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } = require("../controllers/models/category-controller");

const categoryRouter = express.Router();
categoryRouter.use(bodyParser.json());

//Create a new category
categoryRouter.post("/createCategory", createNewCategory);

// Get all categories
categoryRouter.get("/list", getAllCategory);

// Get a category by ID
categoryRouter.get("/:id", getCategoryById);

// Update a category by ID
categoryRouter.put("/:id", updateCategory);

// Delete a category by ID
categoryRouter.delete("/:id", deleteCategory);

module.exports = categoryRouter;

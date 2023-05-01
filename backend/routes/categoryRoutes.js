const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

//GET request to return all the categories
router.get("/", categoryController.getAllCategories);

//POST request to create a single category
router.post("/", categoryController.createCategory);

//PUT request to update a category with given id
router.put("/:id", categoryController.updateCategory);

//DELETE request to delete a category with given id
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

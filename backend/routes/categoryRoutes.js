const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

//GET request to return all the categories
router.get("/", categoryController.getAllCategories);

//POST request to create a single category
router.post("/", categoryController.createCategory);

module.exports = router;

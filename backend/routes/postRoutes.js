const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

//GET request to return all the posts
router.get("/", postController.getAllPosts);

//POST request to create a single post
router.post("/", postController.createPost);

module.exports = router;

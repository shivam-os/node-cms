const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controllers/postController");
const postValidator = require("../utils/validators/postValidator");
const verifyRoles = require("../middlewares/verifyRoles");
const roleConstants = require("../utils/roleConstants");

//-------------------Public Routes---------------------

//GET request to return all the posts
router.get("/", postController.getAllPosts);

//GET request to return post with given id
router.get("/:id", postController.getSinglePost);

//-------------------Protected Routes------------------

//Only allowed logged in users
router.use(passport.authenticate("jwt", { session: false }));

//POST request to create a single post
router.post("/", postValidator.createPost, postController.createPost);

//PUT request to update a post with given id
router.put("/:id", postValidator.createPost, postController.updatePost);

//DELETE request to delete a post with given id
router.delete("/:id", postController.deletePost);

module.exports = router;

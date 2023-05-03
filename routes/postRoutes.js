const express = require("express");
const router = express.Router();
const passport = require("passport");
const postController = require("../controllers/postController");

//GET request to return all the posts
router.get("/", postController.getAllPosts);

//GET request to return post with given id
router.get("/:id", postController.getSinglePost);

//POST request to create a single post
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);

//PUT request to update a post with given id
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);

//DELTE request to delete a post with given id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);

module.exports = router;

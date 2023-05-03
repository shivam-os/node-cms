const { validationResult } = require("express-validator");
const db = require("../config/db");
const Post = db.post;
const Category = db.category;
const User = db.user;
const handleErrors = require("../utils/validators/handleErrors");
const httpResponses = require("../utils/httpResponses");
const responseObj = "Post";

//GET method to get all the posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["postId", "title", "content", "updatedAt"],
      include: [
        { model: User, attributes: ["name"] },
        { model: Category, attributes: ["name"] },
      ],
    });

    return res.status(200).json({ posts: posts });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//GET method to return post with given id
exports.getSinglePost = async (req, res) => {
  try {
    const existingPost = await Post.findOne({
      where: { postId: req.params.id },
      attributes: { exclude: ["userId", "categoryId"] },
      include: [
        { model: User, attributes: ["name"] },
        { model: Category, attributes: ["name"] },
      ],
    });

    //If post doesn't exist
    if (!existingPost) {
      return httpResponses.notFoundError(res, responseObj);
    }

    return res.status(200).json({ post: existingPost });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//GET method to return all posts from a category with given name
exports.getCategoryPosts = async (req, res) => {
  try {
    //Check if category exists
    const existingCategory = await Category.findOne({
      where: { name: req.params.id },
    });
    if (!existingCategory) {
      return httpResponses.notFoundError(res, "Category");
    }

    const categoryPosts = await Post.findAll({
      where: { categoryId: req.params.id },
    });

    //If category does not have any posts
    if (!categoryPosts) {
      return res.status(404).json({ err: "No posts exist for this category!" });
    }

    return res.status(200).json({ posts: categoryPosts });
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//POST method to create a post
exports.createPost = async (req, res) => {
  //Handle errors coming from the create post validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, categoryId } = req.body;

    await Post.create({
      userId: req.user.dataValues.userId,
      title,
      content,
      categoryId,
    });
    return httpResponses.createdResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//PUT method to update a post with given id
exports.updatePost = async (req, res) => {
  //Handle errors coming from the create post validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, categoryId } = req.body;

    const existingPost = await Post.findOne({
      where: { postId: req.params.id },
    });

    //If post with given id does not exist
    if (!existingPost) {
      return httpResponses.notFoundError(res, responseObj);
    }

    await existingPost.update({
      userId: req.user.dataValues.userId,
      title,
      content,
      categoryId,
    });

    return httpResponses.updatedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//DELETE method to delete a post with given id
exports.deletePost = async (req, res) => {
  try {
    const existingPost = await Post.findOne({
      where: { postId: req.params.id },
    });

    //If post doesn't exist
    if (!existingPost) {
      return httpResponses.notFoundError(res, responseObj);
    }

    await existingPost.destroy();
    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

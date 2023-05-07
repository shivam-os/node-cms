const Post = require("../config/db").post;
const Category = require("../config/db").category;
const User = require("../config/db").user;
const httpResponses = require("../utils/httpResponses");
const roleConstants = require("../utils/roleConstants");
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
    const existingCategory = await Category.findOne({
      where: { name: req.params.id },
    });

    //If category with given id doesn't exist
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
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to create a post
exports.createPost = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
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
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
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

    //If post's userId is same as the current user (if it's an author)
    if (
      req.user.dataValues.roleId === roleConstants.AUTHOR &&
      req.user.dataValues.userId !== existingPost.userId
    ) {
      return httpResponses.forbiddenError(res);
    }

    await existingPost.update({
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

    //If post's userId is same as the current user (if it's an author)
    if (
      req.user.dataValues.roleId === roleConstants.AUTHOR &&
      req.user.dataValues.userId !== existingPost.userId
    ) {
      return httpResponses.forbiddenError(res);
    }

    await existingPost.destroy();
    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

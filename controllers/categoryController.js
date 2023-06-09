const Category = require("../config/db").category;
const Post = require("../config/db").post;
const User = require("../config/db").user;
const httpResponses = require("../utils/httpResponses");
const responseObj = "Category";

//GET method to return all the categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["categoryId", "name"],
    });

    return res.status(200).json({ categories });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//GET method to return details about given category
exports.getSingleCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      where: { categoryId: req.params.id },
    });

    //If category with given id doesn't exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    return res.status(200).json({ category: existingCategory });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//GET method to return posts with given category id
exports.getCategoryPosts = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      where: { categoryId: req.params.id },
    });

    //If category with given id does not exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    const posts = await Post.findAll({
      where: { categoryId: req.params.id },
      attributes: ["postId", "title", "content", "updatedAt"],
      include: [{ model: User, attributes: ["name"] }],
    });
    return res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to create a category by the admin
exports.createCategory = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { name } = req.body;

    //If category with given name already exists
    if (await Category.findOne({ where: { name } })) {
      return httpResponses.existsError(res, responseObj);
    }

    await Category.create({ name });
    return httpResponses.createdResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//PUT method to update a category by admin with given id
exports.updateCategory = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const existingCategory = await Category.findOne({
      where: { categoryId: req.params.id },
    });

    //If category with given id doesn't exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //If category name already exists
    if (await Category.findOne({ where: { name: req.body.name } })) {
      return httpResponses.existsError(res, responseObj);
    }

    await existingCategory.update({ name: req.body.name });
    return httpResponses.updatedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//DELETE method to delete a categroy by admin with given id
exports.deleteCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findOne({
      where: { categoryId: req.params.id },
    });

    //If category is uncategorized
    if (req.params.id === "1") {
      return httpResponses.forbiddenError(res);
    }

    //If category with given id doesn't exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //Change the category id to default one
    await Post.update(
      { categoryId: 1 },
      { where: { categoryId: req.params.id } }
    );

    await existingCategory.destroy();
    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

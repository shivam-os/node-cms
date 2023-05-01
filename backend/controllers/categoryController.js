const handleErrors = require("../utils/validators/handleErrors");
const Category = require("../config/db").category;
const httpResponses = require("../utils/httpResponses");
const responseObj = "Category";

const checkCategory = async (name) => {
  try {
    const categoryExists = await Category.findOne({ where: { name: name } });
    return categoryExists;
  } catch (err) {
    console.log(err);
  }
  return undefined;
};

//GET method to return all the categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["categoryId", "name"],
    });

    //If no category exists
    if (categories.length === 0) {
      return res
        .status(404)
        .json({ msg: "No category exists! Create one and try again." });
    }

    return res.status(200).json({ categories });
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//POST method to create a category by the admin
exports.createCategory = async (req, res) => {
  //Handle errors coming from the category validator
  handleErrors(req, res);
  try {
    const { name } = req.body;

    //If category with given name already exists
    if (await checkCategory(name)) {
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
  //Handle errors coming from the create category validator
  handleErrors(req, res);
  try {
    const existingCategory = await Category.findOne({
      where: { categoryId: req.params.id },
    });

    //If category with given id doesn't exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    //If category name already exists
    if (await checkCategory(req.body.name)) {
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

    //If category with given id doesn't exist
    if (!existingCategory) {
      return httpResponses.notFoundError(res, responseObj);
    }

    await existingCategory.destroy();
    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

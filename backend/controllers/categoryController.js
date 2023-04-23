const handleErrors = require("../utils/validators/userValidator");
const Category = require("../config/db").category;

const checkCategory = async (name) => {
  try {
    const categoryExists = await Category.findOne({where: {name: name}});
  } catch (err) {

  }
  console.log(categoryExists)
}

//GET method to return all the categories
exports.getAllCategories = (req, res) => {
  try {
    
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
    await checkCategory();
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//PUT method to update a category by admin with given id
exports.updateCategory = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//DELETE method to delete a categroy by admin with given id
exports.deleteCategory = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

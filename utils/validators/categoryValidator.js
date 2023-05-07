const { body } = require("express-validator");

//Validator for registering a new category
exports.createCategory = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name field cannot be empty!")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Name field must contain minimum 3 letters and maximum 50 letters!"
    )
    .isAlpha("en-US", { ignore: " " })
    .withMessage(
      "Name field cannot contain any numbers or special characters!"
    ),
];

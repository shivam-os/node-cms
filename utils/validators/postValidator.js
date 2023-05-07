const { body } = require("express-validator");

//Validator for creating a new post
exports.createPost = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title field cannot be empty!")
    .isLength({ min: 3, max: 100 })
    .withMessage(
      "Name field must contain minimum 3 letters and maximum 100 letters!"
    ),

  body("content")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Content field cannot be empty!"),

  body("categoryId")
    .trim()
    .not()
    .isEmpty()
    .withMessage("CategoryId field cannot be empty!")
    .isInt({ min: 1, max: 999 }),
];

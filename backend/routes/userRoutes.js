const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");

//POST request to register an admin
router.post("/admin", userValidator.createUser, userController.registerAdmin);

//POST request to login all users
router.post("/login", userValidator.login, userController.login);

//POST request to create a user by admin
router.post("/", userValidator.createUser, userController.createUser);

module.exports = router;

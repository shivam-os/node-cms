const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");

//POST request to register an admin
router.post("/admin", userValidator.createAdmin, userController.registerAdmin);

//POST request to login all users
router.post("/login", userValidator.login, userController.login);

//POST request to create a user by admin
router.post("/", userValidator.createUser, userController.createUser);

//GET request to return all the users
router.get("/", userController.getAllUsers);

//GET request to get detauls of a single user
router.get("/:id", userController.getSingleUser);

//PUT request to update a user with given userId
router.put("/:id", userValidator.createUser, userController.updateUser)

//DELETE request to delete user with given userId
router.delete("/:id", userController.deleteUser)

module.exports = router;

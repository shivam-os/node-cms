const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");
const verifyRoles = require("../middlewares/verifyRoles");
const passport = require("passport");
const roleConstants = require("../utils/roleConstants");

//-------------------Public Routes---------------------

//POST request to register an admin
router.post("/admin", userValidator.createAdmin, userController.registerAdmin);

//POST request to login all users
router.post("/login", userValidator.login, userController.login);

//-------------------Protected Routes------------------

//POST request to generate new access tokens
router.post("/refresh", userController.refresh);

//Only allow logged in users
router.use(passport.authenticate("jwt", { session: false }));

//POST request to logout the logged in user
router.post("/logout", userController.logout);

//------------------Only allowed for admin-------------

router.use(verifyRoles([roleConstants.ADMIN]));

//GET request to return all the users
router.get("/", userController.getAllUsers);

//GET request to get details of a single user
router.get("/:id", userController.getSingleUser);

//POST request to create a user by admin
router.post("/", userValidator.createUser, userController.createUser);

//PUT request to update a user with given userId
router.put("/:id", userValidator.createUser, userController.updateUser);

//DELETE request to delete user with given userId
router.delete("/:id", userController.deleteUser);

module.exports = router;

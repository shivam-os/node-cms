const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userValidator = require("../utils/validators/userValidator");
const verifyRoles = require("../middlewares/verifyRoles");
const passport = require("passport");
const roleConstants = require("../utils/roleConstants");

//POST request to register an admin
router.post("/admin", userValidator.createAdmin, userController.registerAdmin);

//POST request to login all users
router.post(
  "/login",
  userValidator.login,
  verifyRoles([1]),
  userController.login
);

//POST request to create a user by admin
router.post("/", verifyRoles([roleConstants.ADMIN]), userValidator.createUser, userController.createUser);

//GET request to return all the users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  verifyRoles([roleConstants.ADMIN]),
  userController.getAllUsers
);

//GET request to get details of a single user
router.get(
  "/:id",
  verifyRoles([roleConstants.ADMIN]),
  userController.getSingleUser
);

//PUT request to update a user with given userId
router.put(
  "/:id",
  verifyRoles([roleConstants.ADMIN]),
  userValidator.createUser,
  userController.updateUser
);

//DELETE request to delete user with given userId
router.delete(
  "/:id",
  verifyRoles([roleConstants.ADMIN]),
  userController.deleteUser
);

module.exports = router;

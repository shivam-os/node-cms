const express = require("express");
const router = express.Router();
const passport = require("passport");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../utils/validators/categoryValidator");
const roleConstants = require("../utils/roleConstants");
const verifyRoles = require("../middlewares/verifyRoles");

//------------------Public Routes------------------

//GET request to return all the categories
router.get("/", categoryController.getAllCategories);

//GET request to return posts with given category id
router.get("/posts/:id", categoryController.getCategoryPosts);

//-----------------Protected Routes-----------------

//Only allowed logged in admin
router.use(
  passport.authenticate("jwt", { session: false }),
  verifyRoles([roleConstants.ADMIN])
);

//GET request to return details of category with given id
router.get("/:id", categoryController.getSingleCategory);

//POST request to create a single category
router.post(
  "/",
  categoryValidator.createCategory,
  categoryController.createCategory
);

//PUT request to update a category with given id
router.put(
  "/:id",
  categoryValidator.createCategory,
  categoryController.updateCategory
);

//DELETE request to delete a category with given id
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

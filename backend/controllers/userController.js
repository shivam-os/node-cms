const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleErrors = require("../utils/validators/handleErrors");
const User = require("../config/db").user;
const roleConstants = require("../utils/roleConstants");
const httpResponses = require("../utils/httpResponses");

const ifUserExists = async (field) => {
  try {
    userExists = await User.findOne({ where: { field } });
    if (userExists) {
      return userExists;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

const createUser = async (req, res) => {
  try {
    //Create encrypted password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Create user
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      roleId: req.body.roleId,
    });

    return res.status(201).json({ msg: "User created successfully!" });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "User could not be created. Please try again!" });
  }
};

//POST method to register an admin
exports.registerAdmin = async (req, res) => {
  //Handle errors coming from createUser validator
  handleErrors(req, res);
  try {
    //Check if an admin already exists
    const adminExists = await User.findOne({
      where: { roleId: roleConstants.ADMIN },
    });
    if (adminExists) {
      return res
        .status(403)
        .json({ err: "Admin cannot be created as there already exists one." });
    }

    //Assign roleId to req.body
    req.body.roleId = roleConstants.ADMIN;

    await createUser(req, res);
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res)
  }
};

//POST method to login all types of users
exports.login = async (req, res) => {
  //Handle errors coming from the login validator
  handleErrors(req, res);
  try {
    //Check if user with given email already exists
    const userExists = await ifUserExists(req.body.email);
    console.log(userExists);
    if (!userExists) {
      return res.status(404).json({
        err: "User with given email does not exists. Check credentials again!",
      });
    }

    //Compare the passwords
    const passwordMatched = await bcrypt.compare(
      req.body.password,
      userExists.dataValues.password
    );

    //If password does not match
    if (!passwordMatched) {
      return res
        .status(400)
        .json({ err: "Incorrect email or password! Please try again." });
    }

    //Create jwt
    const payload = { userId: user.dataValues.userId };
    const bearerToken = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({
      msg: `Welcome back ${user.dataValues.name}! You are now logged in.`,
      token: bearerToken,
      roleId: user.dataValues.roleId,
    });
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//POST method to create a user by admin
exports.createUser = async (req, res) => {
  //Handle errors coming from the create user validator
  handleErrors(req, res);
  try {
    //Check if user with given email already exists
    if (await ifUserExists(req.body.email)) {
      return res.status(403).json({
        err: "User with given email already exists! Check the entered email or log in.",
      });
    }

    await createUser(req, res);
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//GET method to return all the users by admin
exports.getAllUsers = async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: ["userId", "name", "email", "roleId"],
    });
    return res.status(200).json({ userData });
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//GET method to get details of user with given id
exports.getSingleUser = async (req, res) => {
  try {
    if (!(await ifUserExists(req.body.userId))) {
      httpResponses.notFoundError(res, "User")
    }

    const userData = await User.findAll(
      { where: { userId: req.params.userId } },
      {
        attributes: ["userId", "name", "email", "roleId"],
      }
    );
    return res.status(200).json({ userData });
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//PUT method to update a user by admin with given id
exports.updateUser = async (req, res) => {
  //Handle errors coming from the create user validator
  handleErrors(req, res);
  try {
    const { name, email, password, roleId } = req.body;

    if (!(await ifUserExists(req.body.userId))) {
      httpResponses.notFoundError(res, "User");
    }

    //Update the user
    await User.update(
      { name, email, password, roleId },
      { where: { userId: req.params.userId } }
    );
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//DELETE method to delete a user by admin with given userId
exports.deleteUser = async (req, res) => {
  try {
    //Check if user with given userId exists
    if (!(await ifUserExists(req.params.userId))) {
      httpResponses.notFoundError(res, "User")
    }

    //Delete the user
    await User.destroy({ where: { userId: req.params.userId } });

    return res
      .status(200)
      .json({ msg: "User with given userId deleted successfully!" });
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

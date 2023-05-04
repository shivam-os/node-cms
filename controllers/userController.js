const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const handleErrors = require("../utils/validators/handleErrors");
const User = require("../config/db").user;
const roleConstants = require("../utils/roleConstants");
const httpResponses = require("../utils/httpResponses");
const responseObj = "User";

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

    //Create encrypted password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Create user
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      roleId: req.body.roleId,
    });

    return httpResponses.createdResponse(res, "Admin");
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//POST method to login all types of users
exports.login = async (req, res) => {
  //Handle errors coming from the login validators
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if user with given email already exists
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (!userExists) {
      return httpResponses.notFoundError(res, responseObj);
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
    const payload = { userId: userExists.dataValues.userId };
    const bearerToken = await jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({
      msg: `Welcome back ${userExists.dataValues.name}! You are now logged in.`,
      token: bearerToken,
      roleId: userExists.dataValues.roleId,
    });
  } catch (err) {
    console.log(err);
    httpResponses.serverError(res);
  }
};

//POST method to create a user by admin
exports.createUser = async (req, res) => {
  //Handle errors coming from the create user validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    //Check if user with given email already exists
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return httpResponses.existsError(res, responseObj);
    }

    //Create encrypted password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Create user
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      roleId: req.body.roleId,
    });

    return httpResponses.createdResponse(res, responseObj);
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
    return httpResponses.serverError(res);
  }
};

//GET method to get details of user with given id
exports.getSingleUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: { userId: req.params.id },
    });

    if (!existingUser) {
      httpResponses.notFoundError(res, "User");
    }

    const userData = await User.findAll({
      where: { userId: req.params.id },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json({ userData });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//PUT method to update a user by admin with given id
exports.updateUser = async (req, res) => {
  //Handle errors coming from the create user validator
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  try {
    const { name, email, password, roleId } = req.body;

    const existingUser = await User.findOne({
      where: { userId: req.params.id },
    });

    //If user with given id doesn't exist
    if (!existingUser) {
      httpResponses.notFoundError(res, "User");
    }

    //If user with given email already exists
    const userWithEmail = await User.findOne({ where: { email } });
    if (userWithEmail) {
      return res
        .status(400)
        .json({ err: "This email is already in use. Try another one!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Update the user
    await existingUser.update({
      name,
      email,
      password: hashedPassword,
      roleId,
    });
    return httpResponses.updatedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//DELETE method to delete a user by admin with given userId
exports.deleteUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      where: { userId: req.params.id },
    });

    //Check if user with given userId exists
    if (!existingUser) {
      httpResponses.notFoundError(res, "User");
    }

    //Delete the user
    await existingUser.destroy();

    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

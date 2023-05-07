const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../config/db").user;
const Post = require("../config/db").post;
const roleConstants = require("../utils/roleConstants");
const httpResponses = require("../utils/httpResponses");
const cookieExtractor = require("../utils/verifyCookie");
const responseObj = "User";
const refreshTokenValidity = 15 * 24 * 60 * 60 * 1000; //In milliseconds
const accessTokenValidity = "15m"; //15 minutes
const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenValidity),
  httpOnly: true,
};

const createUser = async (req) => {
  const { name, email, password, roleId } = req.body;

  //Create encrypted password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Create user
  await User.create({
    name,
    email,
    password: hashedPassword,
    roleId,
  });
};

//Create jwt for user with given userId
const generateJwt = async (userId, secret, expiryTime) => {
  const payload = { userId };

  const token = await jwt.sign(payload, secret, {
    expiresIn: `${expiryTime}`,
  });

  return token;
};

//POST method to register an admin
exports.registerAdmin = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const adminExists = await User.findOne({
      where: { roleId: roleConstants.ADMIN },
    });

    //If an admin already exists
    if (adminExists) {
      return res
        .status(403)
        .json({ err: "Admin cannot be created as there already exists one." });
    }

    //Assign roleId to req.body
    req.body.roleId = roleConstants.ADMIN;

    //Create user
    await createUser(req);

    return httpResponses.createdResponse(res, "Admin");
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to login all types of users
exports.login = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    //If user with given email doesn't exist
    if (!userExists) {
      return httpResponses.notFoundError(res, responseObj);
    }

    const { userId, password, roleId } = userExists.dataValues;

    //Compare the passwords
    const passwordMatched = await bcrypt.compare(req.body.password, password);

    //If password does not match
    if (!passwordMatched) {
      return res
        .status(400)
        .json({ err: "Incorrect email or password! Please try again." });
    }

    //Get access token
    const accessToken = await generateJwt(
      userId,
      process.env.ACCESS_TOKEN_SECRET,
      accessTokenValidity
    );

    //Get refresh token
    const refreshToken = await generateJwt(
      userId,
      process.env.REFRESH_TOKEN_SECRET,
      refreshTokenValidity
    );

    return res
      .status(200)
      .cookie("token", refreshToken, refreshTokenOptions)
      .json({
        msg: `Welcome back ${userExists.dataValues.name}! You are now logged in.`,
        token: accessToken,
        roleId,
      });
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to create a user by admin
exports.createUser = async (req, res) => {
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    //If user with given email already exists
    if (existingUser) {
      return httpResponses.existsError(res, responseObj);
    }

    //Create User
    await createUser(req);

    return httpResponses.createdResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
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
  //Handle validation errors
  if (httpResponses.validationError(req, res)) {
    return;
  }

  try {
    const { name, password, roleId } = req.body;

    const existingUser = await User.findOne({
      where: { userId: req.params.id },
    });

    //If user with given id doesn't exist
    if (!existingUser) {
      return httpResponses.notFoundError(res, "User");
    }

    //Create encrypted password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Update the user
    await existingUser.update({
      name,
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

    //If user with given userId doesn't exist
    if (!existingUser) {
      httpResponses.notFoundError(res, "User");
    }

    //Update the userId of posts to the admin's userId
    await Post.update({ userId: 1 }, { where: { userId: req.params.id } });

    await existingUser.destroy();
    return httpResponses.deletedResponse(res, responseObj);
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to generate refresh token
exports.refresh = async (req, res) => {
  try {
    const refreshToken = cookieExtractor(req);

    //If no refresh token
    if (!refreshToken) {
      return res
        .status(401)
        .json({ err: "You are currently logged out. Log in to continue!" });
    }

    //Verify the refresh token from cookie
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          return res.status(401).json({ err: "Invalid token." });
        }

        const accessToken = await generateAccessToken(user.userId);
        return res.status(200).json({ accessToken });
      }
    );
  } catch (err) {
    console.log(err);
    return httpResponses.serverError(res);
  }
};

//POST method to logout the existing user
exports.logout = (req, res) => {
  return res
    .status(201)
    .clearCookie("token", req.cookies.token, refreshTokenOptions)
    .json({ msg: `Now you are logged out! We hope to see you soon.` });
};

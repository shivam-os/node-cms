const bcrypt = require("bcrypt");
const handleErrors = require("../utils/validators/handleErrors");
const User = require("../config/db").user;
const roleConstants = require("../utils/roleConstants");

const ifUserExists = async (email) => {
  try {
    userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return userExists;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
};

//POST method to register an admin
exports.registerAdmin = async (req, res) => {
  //Handle errors coming from createUser validator
  handleErrors(req, res);
  try {
    const { name, email, password } = req.body;

    //Check if an admin already exists
    const adminExists = await User.findOne({
      where: { roleId: roleConstants.ADMIN },
    });
    if (adminExists) {
      return res
        .status(401)
        .json({ err: "Admin cannot be created as there already exists one." });
    }

    //Create encrypted password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create admin user
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      roleId: roleConstants.ADMIN,
    });
    return res.status(201).json({ msg: "Admin created successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//POST method to login all types of users
exports.login = async (req, res) => {
  //Handle errors coming from the login validator
  handleErrors(req, res);
  try {
    //Check if user with given email already exists
    const userExists = await ifUserExists();
    console.log(userExists)
    // if (!userExists) {
    //   return res.status(404).json({err: "User with given email does not exists. Check credentials again!"})
    // }

    // const passwordMatched = await bcrypt.compare()


  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//POST method to create a user by admin
exports.createUser = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//GET method to return all the users by admin
exports.getAllUsers = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//PUT method to update a user by admin with given id
exports.updateUser = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

//DELETE method to delete a user by admin with given id
exports.deleteUser = (req, res) => {
  try {
  } catch (err) {
    res
      .status(500)
      .json({ err: "Something has went wrong. Please try again later." });
  }
};

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const secretKey = "secret123";

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      const existingUserPassword = await bcrypt.compare(password, existingUser.password);
      if (!existingUserPassword) {
        console.log("Password mismatch");
        return res.status(400).json({
          message: "user not found",
        });
      }
    } else {
      return res.status(400).json({
        message: "user not found",
      });
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secretKey, {
      expiresIn: "1hr",
    });

    res.status(201).json({
      message: "User logged in successfully",
      data: existingUser,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Invalid credentials",
    });
  }
};

const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // verifying whether the user is there or not
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists",
        status: "error",
      });
    }
    // if no existing user , it will create hashPassword and store it in db
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = await userModel.create({
      email,
      password: hashPassword,
      name: `${firstName} ${lastName}`,
    });

    //create atoken using newUser email and id
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, secretKey, {
      expiresIn: "10hr",
    });

    res.status(201).json({
      message: "New user created successfully",
      data: newUser,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      Error: err.message,
    });
  }
};

module.exports = {
  signup,
  signin,
};

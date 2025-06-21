const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username, password);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return res.json({
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await User.create({
      username: username,
      password: hashedPassword,
    });

    if (newUser) {
      req.session.userId = newUser.dataValues.id;
      req.session.username = newUser.dataValues.username;
      req.session.isAuthenticated = true;
      
      return res.json({
        message: "User created successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Failed to create user",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in sign up", error);
    return res.json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = { signup };
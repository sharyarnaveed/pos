const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(username,password);
    
    const searchuser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (searchuser) {
      const isvalidPassword = await bcrypt.compare(
        password,
        searchuser.dataValues.password
      );

      if (isvalidPassword) {
        req.session.userId = searchuser.dataValues.id;
        req.session.username = searchuser.dataValues.username;
        req.session.isAuthenticated = true;
        return res.json({
          message: "user exsist",
          success: true,
        });
      } else {
        return res.json({
          message: "user doesnot exsist",
          success: false,
        });
      }
    } else {
      return res.json({
        message: "User not Found",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in sign in", error);
  }
};

module.exports = { signin };

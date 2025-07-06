const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({
    path:"./.env"
});
const sequelize = new Sequelize(
  "burjclke_pos",
  "root",
  '',
  {
    host: "localhost",
    dialect: 'mysql',
    logging: false,
  }
);



module.exports={sequelize}
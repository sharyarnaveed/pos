const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({
    path:"./.env"
});
const sequelize = new Sequelize(
  process.env.DATABASENAME,
  process.env.DATABASEUSER,
  '',
  {
    host: process.env.DATABASEHOST,
    dialect: 'mysql',
    logging: false,
  }
);



module.exports={sequelize}
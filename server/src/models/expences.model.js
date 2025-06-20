const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");

const Expences = sequelize.define(
  "expences",
  {
    id: {
      type: Sequelize.INTEGER(255),
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: Sequelize.toString(255),
      allowNull: false,
    },
    amount: {
      type: Sequelize.DOUBLE(10),
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    vehicle: {
      type: Sequelize.INTEGER(255),
      allowNull: false,
    },
    remarks: {
      type: Sequelize.TEXT(255),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Expences };

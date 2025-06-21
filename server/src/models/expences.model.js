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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Expences;

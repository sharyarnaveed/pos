const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const FuelStation = sequelize.define(
  "FuelStation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    stationName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200],
      },
    },
    fuelTypes: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
      allowNull: false,
    },
  },
  {
    tableName: "fuelstations",
    timestamps: true,
  }
);

module.exports = FuelStation;
const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database.js");

const Mechanic = sequelize.define(
  "Mechanic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shopName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Shop name cannot be empty",
        },
        len: {
          args: [2, 100],
          msg: "Shop name must be between 2 and 100 characters",
        },
      },
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
  },
  {
    tableName: "mechanics",
    timestamps: true,
  }
);

module.exports = Mechanic;
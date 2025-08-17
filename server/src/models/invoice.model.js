const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/database");

const Invoice = sequelize.define(
  "invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoicenumber: {
      type: DataTypes.STRING,
      allowNull: false,
     
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "invoice",
    timestamps: true,
  }
);

module.exports = Invoice;

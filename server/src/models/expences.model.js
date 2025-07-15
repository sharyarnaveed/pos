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
      driverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Fuel-specific fields
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    dhs: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    fills: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fuelStation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billInvoice: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maintenanceShop: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maintenanceBillNo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Expences;

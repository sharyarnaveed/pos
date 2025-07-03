const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");
const Vehicle = require("./Vehicle.model.js");


const Order = sequelize.define(
  "order",
  {
    id: {
      type: Sequelize.INTEGER(255),
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    to: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    containerNumber: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique:true
    },
    customer: {
      type: Sequelize.INTEGER(255),
      allowNull: false,
    },
    driver: {
      type: Sequelize.INTEGER(255),
      allowNull: false,
    },
    vehicle: {
      type: Sequelize.INTEGER(255),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    token: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    custwash: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    merc: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    extra: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    extratype:{
type:DataTypes.STRING,
allowNull:true
    },
    vat:{
type: DataTypes.DOUBLE,
      allowNull: true,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    type: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    paidamount:{
      type:DataTypes.DOUBLE,
      allowNull:true,
      defaultValue:0
    },
    paidStatus:{
type:DataTypes.BOOLEAN,
defaultValue:false,
allowNull:true

    },
    date:{
type:DataTypes.STRING,
allowNull:true
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


module.exports = Order;

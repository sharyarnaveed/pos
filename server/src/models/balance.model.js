const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");

const Currentbalance = sequelize.define("currentbalance", {
id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},
balance:{
    type:DataTypes.DOUBLE,
    allowNull:false
},


},{
    timestamps:true
})


module.exports=Currentbalance
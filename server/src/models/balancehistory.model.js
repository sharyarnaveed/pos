const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");


const BalanceHistory = sequelize.define("balancehistory", {
id:{
    type:DataTypes.INTEGER(255),
    primaryKey:true,
    autoIncrement:true
},
balance:{
    type:DataTypes.DOUBLE,
    allowNull:false
},
description:{
    type:DataTypes.STRING,
    allowNull:true
}

},{
    timestamps:true,
})


module.exports=BalanceHistory
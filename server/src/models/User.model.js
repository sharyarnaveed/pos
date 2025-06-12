const { DataTypes } = require("sequelize")
const {sequelize}= require("../database/database.js")


const User=sequelize.define(
    "user",
    {
        id:{
             type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            
        }
    }
)


module.exports=User
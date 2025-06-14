const { DataTypes, Sequelize } = require("sequelize")
const {sequelize}= require("../database/database.js")


const Driver=sequelize.define("driver",{
    id:{
        type: Sequelize.INTEGER(255),
    autoIncrement: true,
    primaryKey: true,
    },
    drivername:{
          type: DataTypes.STRING,
    allowNull: false,
    },
    driverphoneno:{
              type: Sequelize.INTEGER(20),
    allowNull: false, 
    }
},{
    timestamps:true
})


module.exports=Driver
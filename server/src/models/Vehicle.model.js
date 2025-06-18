const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");


const Vehicle = sequelize.define("vehicle", {
id:{
    type: Sequelize.INTEGER(255),
    autoIncrement: true,
    primaryKey: true,

},
  plateNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  type:{
   type: DataTypes.STRING,
    allowNull: false,
  },
  fuelType:{
       type: DataTypes.STRING,
    allowNull: false,
  }

})



module.exports=Vehicle

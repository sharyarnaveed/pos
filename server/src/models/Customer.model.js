const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../database/database.js");

const Customer = sequelize.define("customer", {
  id: {
    type: Sequelize.INTEGER(255),
    autoIncrement: true,
    primaryKey: true,
  },
  customername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  phoneno: {
       type: Sequelize.INTEGER(20),

    allowNull: false,
  },
  mainowner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  operator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  taxnumber: {
       type: Sequelize.INTEGER(35),

    allowNull: false,
    
  },
},
{
   timestamps: true,
});



module.exports=Customer